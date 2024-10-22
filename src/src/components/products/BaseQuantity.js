import { debounce } from 'throttle-debounce'
import React, { useEffect, useState } from 'react'
import { t } from '$themelocalization'
import './BaseQuantity.scss'

const MAX_VALUE = 2147483646

const BaseQuantity = ({ quantityConfig, additionalClassName, onChange, id, quantity, showMinimalDisplay }) => {
    const [updatedQuantity, setUpdatedQuantity] = useState(quantity)

    useEffect(() => {
        setUpdatedQuantity(quantity)
    },[quantity])

    const getValueFromRange = (options, value) => {
        if (options.length === 0) {
            return null
        }

        // if not in any range, use the minimum value.
        let selected = options.find((item) => { return value.toString() === item.Value.toString() })
        if (selected === undefined) {
            selected = options[0]
        }

        return selected
    }

    const onValueChange = (e) => {
        e.persist();
        setUpdatedQuantity(e.target.value)
        debounced(e);
    }

    const onKeyDown = (e) => {
        if (e.key === '.' || e.key === '-' || e.key === '+' || e.key === '=') {
            e.preventDefault()
            return false
        }
    }

    const onClickPlusMinus = (reduceOrAdd, id) =>{
        const value = parseInt(updatedQuantity + reduceOrAdd)
        if (value > 0) {
            const el = document.querySelector(`#${id}`)
            if (el) {
                el.value = value
            }
            setUpdatedQuantity(value)
            debounced({ target: { value, id } });
        }
    }

    const debounced = debounce(300, (e) => {
        if (e.target.value > MAX_VALUE) {
            e.target.value = MAX_VALUE
        }
        e.target.value = parseInt(e.target.value)
        onChange && onChange(e)
    });

    if (!quantityConfig) {
        return null
    }

    const selectedDropDownItem = quantityConfig.Options && getValueFromRange(quantityConfig.Options, updatedQuantity)

    return (<div className='product-quantity'>
        {!quantityConfig.Changeable && !showMinimalDisplay &&   // READ ONLY LABEL
          <div className='ro-quantity-wrapper'>
              <span className={'quantity-control quantity-label ' + additionalClassName} id={'quantity_' + id}>{updatedQuantity}</span>
          </div>
        }
        {!quantityConfig.Changeable && showMinimalDisplay &&   // READ ONLY LABEL with Quantity before
          <div className='ro-quantity-wrapper-show-quantity'>
              <span className='quantity-label'>{t('product.quantity')}:</span>
              <span className={'quantity-control quantity-label ' + additionalClassName} id={'quantity_' + id}>{updatedQuantity}</span>
          </div>
        }
        {quantityConfig.Changeable && quantityConfig.Options === null && !showMinimalDisplay && // TEXT BOX
          <div className='txt-quantity-wrapper'>
              <input id={'quantity_' + id} type={'number'} className={'quantity-control quantity-input ' + additionalClassName}
                     onChange={onValueChange} value={updatedQuantity}
                     onKeyDown={onKeyDown}
                     onWheel={(e) => {  return false }} />
          </div>
        }
        {quantityConfig.Changeable && quantityConfig.Options === null && showMinimalDisplay && // TEXT BOX WITH +/-
          <div className='txt-quantity-wrapper-show-indicators'>
                    <span className={`indicator minus ${updatedQuantity <= 1 ? 'disabled' : ''}`}
                          onClick={() => { onClickPlusMinus(-1, 'quantity_' + id) }}>-</span>
              <input id={'quantity_' + id} type={'number'} className={'quantity-control quantity-input  ' + additionalClassName}
                     onChange={onValueChange} value={updatedQuantity}
                     onKeyDown={onKeyDown}
                     onWheel={(e) => {  return false }} />
              <span className='indicator plus' onClick={() => { onClickPlusMinus(1, 'quantity_' + id) }}>+</span>

          </div>
        }
        {quantityConfig.Changeable && quantityConfig.Options != null && quantityConfig.Options.length && !showMinimalDisplay &&// DROPDOWN
          <div className='dd-quantity-wrapper'>
              <select id={'quantity_' + id} onChange={onChange} className={'quantity-control quantity-dropdown ' + additionalClassName} defaultValue={selectedDropDownItem.Value} title={selectedDropDownItem.Name}>
                  {quantityConfig.Options.map((item) => {
                      return <option key={item.Value} value={item.Value} >{item.Name}</option>
                  })}
              </select>
          </div>
        }
        {quantityConfig.Changeable && quantityConfig.Options != null && quantityConfig.Options.length && showMinimalDisplay &&// DROPDOWN with custom carret
          <div className='dd-quantity-wrapper-custom-caret'>
              <select id={'quantity_' + id} onChange={onChange} className={'quantity-control quantity-dropdown custom-caret ' + additionalClassName} defaultValue={selectedDropDownItem.Value} title={selectedDropDownItem.Name}>
                  {quantityConfig.Options.map((item) => {
                      return <option key={item.Value} value={item.Value} >{item.Name}</option>
                  })}
              </select>
          </div>
        }
    </div>)
}

export default BaseQuantity
