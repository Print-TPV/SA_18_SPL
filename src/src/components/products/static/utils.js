import deepcopy from 'deepcopy'
import {UStoreProvider} from '@ustore/core'

export const convertPropertiesFromApiToPropertiesObject = (propertiesFromApi, dependenciesObject = null) => {
  // We create a sorted properties array according
  const propertiesOrder = Object
    .keys(propertiesFromApi.JSONSchema.definitions)
    .sort((a, b) => propertiesFromApi.JSONSchema.definitions[a].custom.displayOrder - propertiesFromApi.JSONSchema.definitions[b].custom.displayOrder)

  // We create a dependent properties array to check which property has dependencies

  // Array of property objects, sorted
  const sortedPropertiesObject = propertiesOrder.map((propertyId) => {
    return {
      ...propertiesFromApi.JSONSchema.definitions[propertyId],
      id: propertyId,
      pattern: propertiesFromApi.JSONSchema.definitions[propertyId].pattern,
      custom: propertiesFromApi.JSONSchema.definitions[propertyId].custom,
      depended: dependenciesObject && Object.keys(dependenciesObject).includes(propertyId) ? createNestedDependencyTree(propertiesFromApi, dependenciesObject, propertyId) : null,
      required: propertiesFromApi.JSONSchema.required.includes(propertyId),
      order: propertiesFromApi.JSONSchema.definitions[propertyId].custom.displayOrder,
      uiSchema: {
        ...propertiesFromApi.UISchema[propertyId],
        'ui:errorMessages': propertiesFromApi.UISchema[propertyId]['ui:errorMessages']
      },
      propertySchema: dependenciesObject &&
      Object
        .keys(dependenciesObject)
        .includes(propertyId)
        ? {
          ...propertiesFromApi
            .JSONSchema
            .dependencies[Object.values(dependenciesObject)[Object.keys(dependenciesObject).indexOf(propertyId)]]
            .oneOf
            .filter((dependees) => Object.keys(dependees.properties).includes(propertyId))[0]
            .properties[propertyId],
          ...propertiesFromApi.JSONSchema.definitions[propertyId]
        }
        : {
          ...propertiesFromApi.JSONSchema.properties[propertyId],
          ...propertiesFromApi.JSONSchema.definitions[propertyId]
        },
      value: propertiesFromApi.formData[propertyId] === '' || propertiesFromApi.formData[propertyId] === '[]' ? undefined : propertiesFromApi.formData[propertyId]
    }
  })

  const propertiesObject = {}
  // Convert array back to object
  sortedPropertiesObject.forEach((property) => {
    propertiesObject[property.id] = {
      ...property
    }
  })

  return propertiesObject
}

export const pushOrderItem = async (orderId, orderItem) => {
  return UStoreProvider.api.orders.updateOrderItem(orderId, orderItem)
}

export const pushPropertiesState = async (orderItemId, dataToPush) => {
  return UStoreProvider.api.orders.updatePropertiesState(orderItemId, dataToPush)
}

export const getPriceOrderItem = (orderItemId, obj) => {
  return UStoreProvider.api.orders.getPriceOrderItem(orderItemId, obj)
}

export const pushCart = async (orderId) => {
  await UStoreProvider.api.orders.addToCart(orderId)
}

export const pushSavedForLater = async (orderId) => {
  await UStoreProvider.api.orders.saveForLater(orderId)
}

export const getReorder = async (lastOrderId) => {
  return UStoreProvider.api.orders.reorder(lastOrderId)
}

export const pushProperties = async (orderId, properties) => {
  await UStoreProvider.api.orders.updateProperties(orderId, properties)
}

export const removeEmptyValuesFromFormData = (formData) => Object
  .keys(formData)
  .map((propertyId) => (
    {
      [propertyId]: formData[propertyId] === '' || formData[propertyId] === '[]'
        ? undefined
        : formData[propertyId]
    }))
  .reduce((acc, value) => (
    {
      ...acc,
      [Object.entries(value)[0][0].toString().replace(',', '')]: Object.entries(value)[0][1] }
  ), {})

export const getDependentSchema = (schema, formData) => {
  if (schema.dependencies) {
    const depTree = Object.entries(schema.dependencies).reduce((r, [key, dep]) => {
      const allDeps = dep.oneOf.map(({ properties }) => {
        const parentKey = `${key}|${properties[key].enum.join('|')}`
        const depProps = { ...properties }
        delete depProps[key]

        return { parentKey, depProps }
      }).reduce((acc, deps) => ({ ...acc, [deps.parentKey]: deps.depProps }), {})

      return { ...r, ...allDeps }
    }, {})
    const schemaWithDeps = deepcopy(schema)

    const getProperty = (propSchema) => {
      return Object.keys(propSchema).map(key => {
        if (depTree[`${key}|${formData[key]}`]) {
          return [{ [key]: propSchema[key] }, ...getProperty(depTree[`${key}|${formData[key]}`])]
        } else {
          return { [key]: propSchema[key] }
        }
      }).flat()
    }

    schemaWithDeps.properties = getProperty(schema.properties).reduce((r, prop) => ({ ...r, ...prop }), {})

    const propsMap = Object.keys(schemaWithDeps.properties).reduce((r, d) => ({ ...r, [d]: 1 }), {})
    schemaWithDeps.required = schemaWithDeps.required.filter(d => propsMap[d])
    schemaWithDeps.dependencies = {}

    return schemaWithDeps
  } else {
    return schema
  }
}

export const getDependenciesObject = (properties, excelPricing) => {
  if (properties.JSONSchema.dependencies) {
    const dependenciesObject = {}
    const dependenciesObjectWithValues = {}

    Object
      .keys(properties.JSONSchema.dependencies)
      .forEach((propertyId) => {
        properties
          .JSONSchema
          .dependencies[propertyId]
          .oneOf
          .forEach((dependees) => {
            Object.keys(dependees.properties)
              .forEach((dependentPropertyId) => {
                if (propertyId !== dependentPropertyId) {
                  dependenciesObject[dependentPropertyId] = propertyId
                  dependenciesObjectWithValues[dependentPropertyId] = {
                    dependant: propertyId,
                    dependantValue: dependees.properties[propertyId].enum
                  }
                }
              })
          })
      })
    return { dependenciesObject, dependenciesObjectWithValues }
  }
  return null
}

const createNestedDependencyTree = (propertiesFromApi, dependenciesObject, propertyId) => {
  if (Object.keys(dependenciesObject).includes(propertyId)) {
    return {
      parent: dependenciesObject[propertyId],
      condition: propertiesFromApi.JSONSchema.dependencies[dependenciesObject[propertyId]].oneOf
        .filter((dependees) => Object.keys(dependees.properties).includes(propertyId))
        .map((dependees) => dependees.properties[dependenciesObject[propertyId]])[0],
      depended: createNestedDependencyTree(propertiesFromApi, dependenciesObject, dependenciesObject[propertyId]) || null
    }
  }
}

const convertTo24HourFormat_ = (val) => {
  let hours = parseInt(val.substr(0, 2));
  if (val.indexOf('am') != -1 && hours == 12) {
      val = val.replace('12', '0');
  }
  if (val.indexOf('pm') != -1 && hours < 12) {
      val = val.replace(hours, (hours + 12));
  }
  return val.replace(/(am|pm)/, '');
}

export const getPickUpDateUTC_ = (storeWorkingHours, storeDateTime, gmtOffSet) => {

  let pickupDateUTC = ''
  //this loop is to check store close hours for whole week.If  closeTime != 'Closed' set pickupDateUTC and break the loop.
  for (let i = 0; i < storeWorkingHours.length; i++) {
    if (i > 0) {
      storeDateTime.setDate(storeDateTime.getDate() + 1)
    }
    let storeDay = storeDateTime.getDay()
    // get store offset in msec.It will be current login user offset.If it is a positive value subtract from final pickup date time else add
    let storeOffset = storeDateTime.getTimezoneOffset() * 60000
    gmtOffSet = 3600000 * gmtOffSet
    // Handling Sunday case. In store finder sunday has index=7
    if (storeDay === 0) {
      storeDay = 7
    }
    storeWorkingHours.forEach(storeHours => {
      if (storeDay === storeHours.index) {
        let closeTime = storeHours.closeTime
        if (closeTime && closeTime != 'Closed') {
          let pickupTimeHours = convertTo24HourFormat_(closeTime)
          // 30 min before close time
          pickupTimeHours = pickupTimeHours - 0.5
          // pickup time in msec
          let pickupTimeMSec = pickupTimeHours * 60 * 60 * 1000
          //creating new date object with time as 00:00:00
          let newDate = new Date(storeDateTime.toLocaleDateString())
          //adding pickupTimeMSec to newDate time . Also adjusting login user offset
          let pickupDateTime = newDate.getTime() + pickupTimeMSec - storeOffset - gmtOffSet
          // creating new date object with store date and time
          let storeDateTimePickup = new Date(pickupDateTime)
          pickupDateUTC = storeDateTimePickup.toISOString()
        }
      }
    })
    if (pickupDateUTC && pickupDateUTC != '') {
      break
    }
  }
  return pickupDateUTC
}

// Return new data time.
export const calcDateTime_ = (gmtOffSet) => {
  const sysDate = new Date();
  let utc = sysDate.getTime() + (sysDate.getTimezoneOffset() * 60000);
  let storeDateTime = new Date(utc + (3600000 * gmtOffSet));
  return storeDateTime;
}