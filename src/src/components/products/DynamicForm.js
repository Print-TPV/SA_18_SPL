import React, { useEffect, useRef, useState } from 'react'
import sanitizeHTML from 'sanitize-html'
import { Section } from './Section'
import { Icon } from '$core-components'
import features from '$features'
import Hashids from 'hashids'
import { UStoreProvider } from '@ustore/core'
import { t } from '$themelocalization'
import { productTypes } from '$themeservices'
import './DynamicForm.scss'
import { NotificationBubble } from './StaplesUI/NotificationBubble/NotificationBubble'
import { Accordion } from './StaplesUI/Accordion/Accordion'
import { Tooltip } from './StaplesUI/Tooltip/Tooltip'
import { Breakpoint } from './StaplesUI/Breakpoint/Breakpoint'
import { Link } from './StaplesUI/Link/Link'
import { Icon as StaplesIcon } from './StaplesUI/Icon/Icon';

const withCustomProps = (WrappedComponent = {}) => {
  class ConnectedComponent extends React.Component {
    constructor(props) {
      super(props)
      const regex = new RegExp(/[!$%^&*()+|~=`{}[\]:";'<>?,./]/, 'g')
      this.id = this.props.id.replace('root_', '').replace(regex, '')
    }

    onDucChange = (value, errors = [], skipValidation = false) => {
      const newDucValue = value === 'default' ? undefined : value
      const schemaErrors = !value && this.props.uiSchema['ui:errorMessages']
        ? Object.values(this.props.uiSchema['ui:errorMessages']).map((err) => err)
        : []
      const errSchema = { [this.props.id]: { __errors: [...schemaErrors, ...errors] } }
      this.props.onChange(this.props.id, newDucValue === '__xmpie__clear__' ? '' : newDucValue, errSchema, skipValidation)
    }

    render() {
      const hashids = new Hashids(this.id)
      const hashedID = hashids.encode(1, 2, 3)

      return (
        <div className={`a${hashedID}`}>
          <WrappedComponent
            {...this.props}
            id={this.id}
            disabled={this.props.readonly}
            onChange={this.onDucChange}
          />
        </div>
      )
    }
  }

  return ConnectedComponent
}

const widgets = window.uStoreDucs.reduce((r, duc) => ({ ...r, [duc.name]: withCustomProps(duc.component) }), {})

const isSectionHidden = (section) => section.properties.every((property) => !property.uiSchema['ui:options'].visible)
export const sectionSplitter = (properties, nameOfSectionToKeepOpen, changedSections, disableATCForStore) => {
  const sections = Object.values(properties).reduce((r, property) => {
    if (property.uiSchema['ui:options'].sectionId !== r.lastSectionId) {
      r.sections.push({
        name: property.uiSchema['ui:options'].section,
        properties: [property],
        changed: changedSections[r.sections.length] || false,
      })
      r.lastSectionId = property.uiSchema['ui:options'].sectionId
    } else {
      r.sections[r.sections.length - 1].properties.push(property)
    }
    return r
  }, { sections: [], lastSectionId: null })
  return sections.sections.filter((section) => !isSectionHidden(section))
}

const checkIfPropertyDependersHaveDefaultValueSelected = (property, formData) =>
  property.depended !== null &&
    formData[property.parent] === property.condition.enum[0] ?
    checkIfPropertyDependersHaveDefaultValueSelected(property.depended, formData) :
    formData[property.parent] === property.condition.enum[0]

const Property = ({ property, errors, handlePropertyChange, internalFormData, setHover, resetHover, hoverEle, isHover, disableATCForStore, resetAccordionActiveKey, galeryListItems, isWebGLEnabled, altProductLink, currentParentUrl, tabSummary, tabClickHandler, showTabError, productType }) => {

  const [selectedListItems, setSelectedListItems] = useState({
    selectedIcons: '',
    name: "",
    description: ''
  });
  const [currentBreakpoint, setCurrentBreakpoint] = useState('')

  const breakpointCallback = (breakpoint) => {
    if (breakpoint !== currentBreakpoint) {
      setCurrentBreakpoint(breakpoint);
    }
  }
  useEffect(() => {
    if (property?.uiSchema['ui:widgetSubType'] === 'galeryList') {
      const selectedIndex = property?.propertySchema?.enum?.indexOf(property?.value)
      if (property?.value) {
        setSelectedListItems({
          selectedIcons: property?.propertySchema?.icons ? property?.propertySchema?.icons[selectedIndex] : '',
          name: property?.propertySchema?.enumNames ? property?.propertySchema?.enumNames[selectedIndex] : '',
          description: property?.propertySchema?.enumDescriptions ? property?.propertySchema?.enumDescriptions[selectedIndex] : ''
        })
      }
      else {
        setSelectedListItems({
          selectedIcons: '',
          name: '',
          description: ''
        });
      }
    }
  }, [property?.value])

  if (productType === productTypes.EASY_UPLOAD && property.custom?.code === 'FileAttachment') {
    return null;
  }

  const MapGaleryListItems = () => {

    const { icons, enumNames, enumDescriptions } = property.propertySchema
    const handleSelectedItem = (index, id, value, errors = []) => {
      const newDucValue = value === 'default' ? undefined : value
      const schemaErrors = !value && property.uiSchema['ui:errorMessages']
        ? Object.values(property.uiSchema['ui:errorMessages']).map((err) => err)
        : []
      const errSchema = { [id]: { __errors: [...schemaErrors, ...errors] } }
      handlePropertyChange(id, newDucValue === '__xmpie__clear__' ? '' : newDucValue, errSchema, false)
    }

    const defaultIndex = property?.propertySchema?.enum?.indexOf(property?.value)
    return (<><Breakpoint
      onBreakpointChange={breakpointCallback} />{

        property?.propertySchema?.enum?.map((data, index) => {
          return (
            <div className={`galeryListAccordion ${(defaultIndex === index) ? 'selected' : null}`} key={index} onClick={() => handleSelectedItem(index, property.id, property.propertySchema.enum[index])}>
              <div className='imageRadio'>
                <img src={icons && icons[index]} width="50" height="50" />
              </div>
              <div className='content'>
                <span className='name'>{enumNames && enumNames[index]}</span>
                <span className='description'>{enumDescriptions && enumDescriptions[index]}</span>

              </div>

            </div>
          )
        })}</>)

  }

  const SubtitleComponent = () => {
    const subtitleContent = `${selectedListItems && selectedListItems.name} ${selectedListItems && selectedListItems.description && '•'} ${selectedListItems && selectedListItems.description}`;
    const subtitleRef = useRef(null);
    const [isEllipsisActive, setIsEllipsisActive] = useState(false);

    useEffect(() => {
      const element = subtitleRef.current;
      if (element) {
        const isOverflowing = element.scrollHeight > element.clientHeight + 2;
        setIsEllipsisActive(isOverflowing);
      }
    }, [subtitleContent]);
    return (
      <div className='subtitleLayout'>
        {selectedListItems && selectedListItems.selectedIcons && (
          <img src={selectedListItems.selectedIcons} width="50" height="50" />)}
        {(subtitleContent && isEllipsisActive) ? <Tooltip
          id="subTitleContent"
          position="top"
          maxWidth={currentBreakpoint === 'xxs' ? 200 : 300}
          triggerElement={<span ref={subtitleRef} className='subTitleContent'>{subtitleContent}</span>}
          customCSS={'margin:auto;'}
        >
          {<div>{subtitleContent}</div>}
        </Tooltip> : <span ref={subtitleRef} className='subTitleContent'>{subtitleContent}</span>}
      </div>
    )
  }
  const showAltProductsUrl = () => {
    return (
      (altProductLink && altProductLink !== 'NONE' && altProductLink !== null) ?
        <Link customCSS={'margin:0;font-size:16px;'} href={`${currentParentUrl}${altProductLink}`}>
          Show alternate products.</Link> : <></>

    )
  }
  const ErrorMsgComponent = () => {
    return (
      errors[property.id] &&
        errors[property.id].errors
        &&
        errors[property.id].show
        ? errors[property.id].errors.map((error) => {
          let newErrorMsg = error.replace('enter', 'select').replace('the field', '').replace(/'/g, '"');
          return (
            <div className="duc-error" key="err">
              <NotificationBubble
                id={`${property.id}`}
                noBorder
                variant="failure"
                textColor="brand"
                textSize={'md'}
                customCSS={"display: flex; align-items: baseline;padding: 4px 0px 4px 0px;"}
              >
                <div>{newErrorMsg}</div>
              </NotificationBubble>
            </div>

          )
        })
        : null
    )
  }


  if ((
    property.depended && checkIfPropertyDependersHaveDefaultValueSelected(property.depended, internalFormData)) ||
    !property.depended
  ) {

    const WidgetComponent = widgets[property.uiSchema['ui:widget']]
    return (
      <div key={property.id}
        id={property.id}
        className={`duc-wrapper 
                ${property.uiSchema['ui:options'].visible ? '' : 'hidden'}
                ${errors[property.id] && errors[property.id].errors.length && errors[property.id].show ? 'errors' : ''}
              `}>
        {!(property?.uiSchema['ui:widgetSubType'] === 'galeryList') && <div className="duc-head">
          <label htmlFor={property.id} className="duc-title">
            {property.title}
            {property.required
              ? <span className="required-field">*</span>
              : null
            }
          </label>
          {(isWebGLEnabled === false && property.id.indexOf('Addcontent_') >= 0) ?
            <Tooltip id="webGlDisabledtooltip"
              delayHide={1000}
              position="top"
              maxWidth={currentBreakpoint === 'xxs' ? 200 : 300} triggerElement={<Icon name="info.svg" width="16px" height="16px"></Icon>}>
              Shutterstock design feature can be used to create your content. To use this feature, your browser must have certain requirements. <Link target={"_blank"} customCSS={'margin:0;font-size:16px;'} href='https://support.shutterstock.com/s/article/Why-is-the-Create-app-running-so-slow-on-my-computer?language=en_US'>See details.</Link> {showAltProductsUrl()}
            </Tooltip> : <></>
          }
          {property.description &&
            <span className="duc-description" onMouseEnter={() => setHover(property.id)} onMouseLeave={resetHover}>
              <Icon name="info.svg" width="16px" height="16px" className="info-icon" title="" />
              {hoverEle == property.id && isHover && <div className="duc-description-text">{property.description}</div>}
            </span>
          }
          {property.custom.info &&
            <span className="info-icon">(i)
              <span className="tooltip-text" dangerouslySetInnerHTML={{ __html: property.custom.info }} />
            </span>
          }
        </div>}
        {disableATCForStore && property.id && property.id.indexOf("Storepickupdetails_") >= 0 && <div>
          <NotificationBubble
            noBorder
            variant="failure"
            textColor="brand"
            customCSS={"display: flex; align-items: baseline;"}
          >
            <div>
              Store pickup details are required. Please select a pickup store location.
            </div>
          </NotificationBubble>
        </div>}
        {
          property?.uiSchema['ui:widgetSubType'] === 'galeryList' ?
            (<><Accordion id='ListItems' onOpen={() => { resetAccordionActiveKey(property.id, true) }} onClose={() => { resetAccordionActiveKey(property.id, false) }} activeKey={!property.value ? `GaleryListItems_${property.id}` : galeryListItems && galeryListItems[property.id] ? galeryListItems[property.id] : ''}>

              <Accordion.Item eventKey={`GaleryListItems_${property.id}`}
                subTitle={<SubtitleComponent />}
              >
                <Accordion.Header customCSS={'padding:0px 0px 10px 0px;'}>{property.title}</Accordion.Header>

                <Accordion.Body customCSS={'max-width:100%; padding:16px;'}>
                  {ErrorMsgComponent()}
                  <div className='accordionWrapper'>
                    <MapGaleryListItems />
                  </div>
                </Accordion.Body>

              </Accordion.Item>
            </Accordion>
            </>)
            :
            (<><WidgetComponent
              features={features}
              formContext={{ UStoreProvider }}
              id={property.id}
              onChange={handlePropertyChange}
              onBlur={(id, value, errorsFromProperty, skipValidation) =>
                value && handlePropertyChange(id, 'value', errorsFromProperty || [], skipValidation)
              }
              options={property.uiSchema['ui:options']}
              readonly={property.uiSchema['ui:readonly']}
              required={property.required}
              schema={property.propertySchema}
              t={t}
              uiSchema={property.uiSchema}
              value={internalFormData[property.id]}
            />
              {property.id && property.id.indexOf("Tabs_") >= 0 && property.value === 'addTabs' && tabSummary &&
                <><span className='subTitleContent'>{tabSummary}</span>
                  <span onClick={() => {
                    tabClickHandler("openTabDrawer")
                  }} onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      tabClickHandler("openTabDrawer")
                    }
                  }} style={{ cursor: 'pointer' }} role={"button"} aria-label={"Edit tab options"} tabIndex={0}><StaplesIcon
                      size={16} name="edit" /></span>
                </>
              }
              {property.id && property.id.indexOf("Tabs_") >= 0 && property.value === 'addTabs' && showTabError &&
                <div className="duc-error" key="err">
                  <NotificationBubble
                    id={`${property.id}`}
                    noBorder
                    variant="failure"
                    textColor="brand"
                    textSize={'md'}
                    customCSS={"display: flex; align-items: baseline;padding: 4px 0px 4px 0px;"}
                  >
                    <div>{"One or more tab selections are no longer valid. Please review and modify."}</div>
                  </NotificationBubble>
                </div>
              }
              {ErrorMsgComponent()} </>)
        }


      </div>
    )
  }
  return null
}

const getFirstSectionWithErrors = (sections, errors) => {
  const sectionWithErrors = sections.map((section) => {
    return section.properties.reduce((r, property) => r || (errors[property.id] && errors[property.id].show), false)
  })
  for (let i = 0; i < sectionWithErrors.length; i++) {
    if (sectionWithErrors[i]) {
      return i
    }
  }
  return -1
}

const DynamicForm = ({ errors, excelPricingEnabled, formData, onChange, properties, sectionToOpen, sectionsDescription, productType, isMobile, disableATCForStore, isWebGLEnabled, currentParentUrl, altProductLink, tabSummary, tabClickHandler, showTabError }) => {
  const [internalFormData, setInternalFormData] = useState(formData || {})
  const [firstLoad, setFirstLoad] = useState(true)
  const [openSection, setOpenSection] = useState(0)
  const [sections, setSections] = useState([])
  const [changedSections, setChangedSections] = useState({})
  const sectionsRef = useRef({})
  const [hoverEle, setHoverEle] = useState(null);
  const [isHover, setIsHover] = useState(false);
  const [galeryListItems, setGaleryListItems] = useState({});

  useEffect(() => {
    // SPLS storing userInfo a sessionStorage to access from html generic property
    sessionStorage.setItem("userInfo", JSON.stringify(UStoreProvider.state.get().currentUser));
  }, []);
  useEffect(() => {
    if (firstLoad && formData && !isMobile) {
      setTimeout(() => {
        getFirstFocusableElement()?.focus()
        setFirstLoad(false)
      }, 0)
    }
  }, [firstLoad, formData])

  useEffect(() => formData && setInternalFormData(formData), [formData])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setSections(sectionSplitter(properties, openSection, changedSections, disableATCForStore)), [properties])

  useEffect(() => {
    if (sectionToOpen && sectionToOpen !== openSection) {
      if (sectionToOpen < -2) {
        const firstSectionWithErrors = getFirstSectionWithErrors(sections, errors)
        setOpenSection(firstSectionWithErrors)
        scrollToElement(sectionsRef.current[firstSectionWithErrors])
        return
      }
      setOpenSection(sectionToOpen)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionToOpen])
  const handlePropertyChange = (id, value, errorsFromProperty, skipValidation = false) => {
    const sectionIndex = sections.findIndex(section => section.properties.some(property => property.id === id))
    setChangedSections({ ...changedSections, [sectionIndex]: true })

    const updatedErrors = Object.keys(errors)
      .reduce((acc, propertyId) => ({
        ...acc,
        [propertyId]: (errorsFromProperty[propertyId] &&
          errorsFromProperty[propertyId].__errors) || errors[propertyId].errors
      }), {})
    setInternalFormData({
      ...internalFormData,
      [id]: value
    })

    onChange(id, value, updatedErrors, {}, skipValidation)
  }

  const onNextSection = () => {
    const sectionProps = sections[openSection].properties
    const sectionChanges = sectionProps.reduce((acc, prop) => ({ ...acc, [prop.id]: prop.value || '' }), {})
    const changedPropList = sectionProps.map(prop => prop.id)
    setInternalFormData({
      ...internalFormData, ...sectionChanges
    })
    setChangedSections({ ...changedSections, [openSection]: true })
    const currentErrors = Object.entries(errors).reduce((acc, [key, value]) => ({ ...acc, [key]: value.errors }), {})
    onChange(changedPropList, null, currentErrors, sectionChanges, false)
    setTimeout(() => getFirstFocusableElement()?.focus(), 0)
    const nextSectionIndex = openSection + 1
    if (nextSectionIndex < sections.length) {
      setOpenSection(nextSectionIndex)
      scrollToElement(sectionsRef.current[nextSectionIndex])
    } else {
      setOpenSection(-1)
    }
  }

  const setHover = (propId) => {
    setHoverEle(propId);
    setIsHover(true);
  }

  const resetHover = () => {
    setHoverEle(null);
    setIsHover(false);
  }

  const resetAccordionActiveKey = (id, isOpen) => {
    let _galeryListItems = {};
    Object.values(properties).forEach(property => {
      if (property?.uiSchema['ui:widgetSubType'] === 'galeryList') {
        if (!property.value) {
          _galeryListItems[property.id] = `GaleryListItems_${property.id}`;
        } else if (property.id === id && isOpen) {
          _galeryListItems[property.id] = `GaleryListItems_${id}`;
        } else {
          _galeryListItems[property.id] = "GaleryListItems";
        }
      }
    })
    setGaleryListItems(_galeryListItems);
  }

  if (!Object.keys(properties).length) return null

  if (sections.length < 2) {
    const description = '' //sectionsDescription[Object.values(properties)[0]?.uiSchema['ui:options']?.sectionId]?.description
    const sanitizedDescription = sanitizeHTML(description, {
      allowedClasses: { '*': ['*'] },
      allowedAttributes: { '*': ['*'] },
      parseStyleAttributes: false
    })
    return (
      <>
        {description && <div className="section-description" dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />}
        {Object.values(properties).map((property, index) => (
          <Property
            key={index}
            property={property}
            errors={errors}
            handlePropertyChange={handlePropertyChange}
            setHover={setHover}
            resetHover={resetHover}
            hoverEle={hoverEle}
            isHover={isHover}
            disableATCForStore={disableATCForStore}
            internalFormData={internalFormData}
            resetAccordionActiveKey={resetAccordionActiveKey}
            galeryListItems={galeryListItems}
            isWebGLEnabled={isWebGLEnabled}
            altProductLink={altProductLink}
            currentParentUrl={currentParentUrl}
            tabSummary={tabSummary}
            tabClickHandler={tabClickHandler}
            showTabError={showTabError}
            productType={productType} />
        )
        )}
      </>
    )
  }

  const getSectionErrors = (section, index) => {
    if (changedSections[index] && openSection !== index) {
      return section.properties.map((prop) => errors[prop.id].errors.length > 0)
    }
    return section.properties.map((prop) => errors[prop.id].show && errors[prop.id].errors.length > 0)
  }


  return sections.map((section, index) => (
    <Section key={section.name} number={index}
      setOpenSection={(sectionNumber) => setOpenSection(sectionNumber)}
      section={section} sections={sections}
      isOpen={openSection === index}
      isLastSection={sections.length - 1 !== index}
      onNext={onNextSection}
      changed={section.changed}
      sectionToScrollTo={openSection}
      sectionErrors={getSectionErrors(section, index)}
      ref={(ref) => sectionsRef.current[index] = ref}
      isHidden={isSectionHidden(section)}
      sectionDescription={sectionsDescription[section.properties[0].uiSchema['ui:options'].sectionId]}
    >
      {section.properties.map((property) => (
        <Property
          key={property.id}
          property={property}
          errors={errors}
          handlePropertyChange={handlePropertyChange}
          setHover={setHover}
          resetHover={resetHover}
          hoverEle={hoverEle}
          isHover={isHover}
          disableATCForStore={disableATCForStore}
          internalFormData={internalFormData}
          resetAccordionActiveKey={resetAccordionActiveKey}
          galeryListItems={galeryListItems}
          isWebGLEnabled={isWebGLEnabled}
          currentParentUrl={currentParentUrl}
          altProductLink={altProductLink}
          prodcutType={productType} />
      ))}
    </Section>
  ))
}

export default DynamicForm

function smoothScroll(target, { duration = 100, offset = 0, container = document.body }) {
  const targetPosition = target.offsetTop - offset
  const startPosition = container.scrollTop
  const distance = targetPosition - startPosition

  let start = null

  const animation = (currentTime) => {
    if (!start) start = currentTime
    const timeElapsed = currentTime - start
    const run = ease(timeElapsed, startPosition, distance, duration)
    container.scrollTop = run
    if (timeElapsed < duration) {
      requestAnimationFrame(animation)
    }
  }

  const ease = (t, b, c, d) => {
    t /= d / 2
    if (t < 1) return c / 2 * t * t + b
    t--
    return -c / 2 * (t * (t - 2) - 1) + b
  }

  requestAnimationFrame(animation)
}

function scrollToElement(element) {
  setTimeout(() => {
    const header = document.querySelector('.header')
    const headerHeight = header ? header.offsetHeight + 20 : 20
    smoothScroll(element, { offset: headerHeight })

  }, 400)
}

function getFirstFocusableElement() {
  const elements = document.querySelectorAll('.section-open [data-xmpie-focusable]');
  return Array.from(elements).find(el => {
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && el.getBoundingClientRect().height > 0;
  });
}
