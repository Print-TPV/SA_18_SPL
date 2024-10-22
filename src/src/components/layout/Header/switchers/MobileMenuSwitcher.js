import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ListBox, ListBoxItem, Select } from 'react-aria-components'
import { useButton } from 'react-aria'
import { Icon } from '$core-components'
import urlGenerator from '$ustoreinternal/services/urlGenerator'
import { t } from '$themelocalization'
import Flag from './Flag'
import { switchCurrency, switchCulture } from './utils'

import './MobileMenuSwitcher.scss'

export const MobileMenuSwitcher = ({ items, onClose, onTopLevelSelected }) => {
  const [currentItems, setCurrentItems] = useState(items)
  const [selected, setSelected] = useState(null)
  const [isListChanged, setIsListChanged] = useState(false)
  const selectorListRef = useRef()
  const navigate = useNavigate()
  const params = useParams()

  useEffect(() => {
    setCurrentItems(items)
  }, [items])

  useEffect(() => {
    if (currentItems) {
      setIsListChanged(true)
    }
  }, [currentItems])

  useEffect(() => {
    if (isListChanged) {
      document.querySelector('.mobile-menu-switcher [role="option"]')?.focus()
      setIsListChanged(false)
    }
  }, [isListChanged])

  const onPress = (e) => {
    if (e.key === 'Escape') {
      if (e.target.getAttribute('role') === 'listbox') {
        onClose && onClose()
        return
      }
      onBack(e.target.getAttribute('data-key'))
    }
  }

  const onSelectionChanged = (key) => {
    const selectedItem = currentItems.find(i => i.value === key)
    if (selectedItem?.children.length) {
      onTopLevelSelected && onTopLevelSelected(false)
      setSelected(selectedItem)
      if (selectedItem?.hasProducts){
        const featuredProducts = {
          id: `FP_${selectedItem.id.slice(4)}`,
          value: `FP_${selectedItem.id.slice(4)}`,
          name: t('General.FeaturedProducts'),
          children: []
        }
        setCurrentItems([featuredProducts, ...selectedItem.children])
      } else {
        setCurrentItems(selectedItem.children)
      }
      return
    }

    if (selectedItem?.value.startsWith('TCT') || selectedItem?.value.startsWith('CT') || selectedItem?.value.startsWith('FP')) {
      setSelected(null)
      setCurrentItems(items)
      onTopLevelSelected && onTopLevelSelected(true)
      onClose && onClose()
      navigate(urlGenerator.get({ page: 'category', id: selectedItem.value.slice(selectedItem?.value.startsWith('TCT') ? 4 : 3) }))
      return
    }

    if (selectedItem?.value.startsWith('CL')) {
      switchCulture(selectedItem.model, params)
      return
    }

    if (selectedItem?.value.startsWith('CR')) {
      switchCurrency(selectedItem.model)
      setSelected(null)
      setCurrentItems(items)
      onClose && onClose()
      onTopLevelSelected && onTopLevelSelected(true)
    }
  }

  const onBack = (currentSelected) => {
    if (/^TC[TRL]_/.test(currentSelected)) {
      onClose && onClose()
    }
    const current = currentItems.find(i => i.value === currentSelected)
    if (current?.parent?.value?.startsWith('C')) {
      setCurrentItems(current?.parent?.children)
      setSelected(current?.parent)
      return
    }
    onTopLevelSelected && onTopLevelSelected(true)
    setCurrentItems(items)
    setSelected(null)
  }

  if (!items) {
    return <div/>
  }

  return (
    <Select className="mobile-menu-switcher" onSelectionChange={onSelectionChanged} isOpen={true}>
      <div className="mobile-menu-switcher-list" ref={selectorListRef} onKeyUp={onPress}>
        {selected && <BackButton onPress={() => onBack()} label={selected.name}/>}
        <ListBox items={currentItems} selectionMode="single">
          {(item) => {
            return <ListBoxItem key={item.id} value={item.value}
                                className={({ isFocused, isSelected }) => isFocused || isSelected ? 'selected' : ''}>
              <CategoryItem item={item}/>
              <CurrencyItem item={item}/>
              <CultureItem item={item}/>
            </ListBoxItem>
          }}
        </ListBox>
      </div>
    </Select>
  )
}

function BackButton (props) {
  const ref = useRef()
  const { buttonProps } = useButton(props, ref)

  return (
    <button {...{ ...buttonProps, className: 'mobile-menu-switcher-back' }} ref={ref}>
      <Icon name="back.svg" height="19px" width="9px"/>
      <div className="mobile-submenu-title">{props.label}</div>
    </button>
  )
}

function CategoryItem ({ item }) {
  return /^T?CT|FP/.test(item.id) && <div>{item.name}</div>
}

function CurrencyItem ({ item }) {
  return /^T?CR/.test(item.id) && <div>
    {item.depth > 0 && <span className="currency-sign">{item.sign}</span>}
    <span className="currency-name">{item.name}</span>
    {item.depth === 0 && <span>{t('Header.Currency')}</span>}
  </div>
}

function CultureItem ({ item }) {
  return /^T?CL/.test(item.id) && <div>
    <Flag name={item.icon} width="29" height="19" className="icon"/>
    <span className="culture-name">{item.name}</span>
  </div>
}
