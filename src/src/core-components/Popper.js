import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDetectClickOutside } from 'react-detect-click-outside'
import { ReactComponent as ErrorIcon } from '$assets/icons/error.svg'
import { t } from '$themelocalization'
import './Popper.scss'
import { isServer } from '../ustore-internal/services/utils'
import { debounce } from 'throttle-debounce'

const popperPositions = {
  topPrice: {
    refElementSelector: '#total-price-component.total-price',
    location: {
      top: '52px',
      left: '0px'
    },
    tipPosition: {
      bottom: 'calc(100% - 4px)',
      left: '15.4%',
      rotation: '225deg'
    }
  },
  stickyPrice: {
    refElementSelector: '.product-sticky-price',
    location: {
      bottom: '60px',
      left: '0px'
    },
    tipPosition: {
      bottom: 'calc(0% - 6px)',
      left: '44%',
      rotation: '45deg'
    }
  },
  bottomPrice: {
    refElementSelector: '.summary-table-row.total-row',
    location: {
      bottom: '35px',
      right: '0px'
    },
    tipPosition: {
      bottom: 'calc(0% - 6px)',
      left: '85%',
      rotation: '45deg'
    }
  },
  addToCartButton: {
    refElementSelector: '.add-to-cart-button-wrapper',
    location: {
      bottom: '160px',
      left: '50%',
      transform: 'translateX(-50%)'
    },
    tipPosition: {
      bottom: 'calc(0% - 6px)',
      left: '48%',
      rotation: '45deg'
    }
  }
}

const isInViewport = (el, top = 140) => {
  const rect = el.getBoundingClientRect()
  return (
    rect.top >= top && // header height + tooltip height
      rect.left >= 0 &&
      rect.bottom - rect.height <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

const DEFAULT_OPTIONS = {
  config: { attributes: true, childList: true, subtree: true },
  debounceTime: 0
}

const useMutationObservable = (targetEl, cb, options = DEFAULT_OPTIONS) => {
  const [observer, setObserver] = useState(null)

  useEffect(() => {
    if (!cb || typeof cb !== 'function') {
      console.warn(
        `You must provide a valida callback function, instead you've provided ${cb}`
      )
      return
    }
    const { debounceTime } = options
    const obs = new MutationObserver(
      debounceTime > 0 ? debounce(cb, debounceTime) : cb
    )
    setObserver(obs)
  }, [cb, options, setObserver])

  useEffect(() => {
    if (!observer) return

    if (!targetEl) {
      console.warn(
        `You must provide a valid DOM element to observe, instead you've provided ${targetEl}`
      )
    }

    const { config } = options

    try {
      observer.observe(targetEl, config)
    } catch (e) {
      console.error(e)
    }

    return () => {
      if (observer) {
        observer.disconnect()
      }
    }
  }, [observer, targetEl, options])
}

const Popper = ({ errorCode, forceAddToCartButton, resetError }) => {
  const [errorMessage, setErrorMessage] = useState('')
  const [errorType, setErrorType] = useState('')
  const [pageLoaded, setPageLoaded] = useState(false)
  const onDocumentMutation = useCallback(() => {
    if (!isServer() &&
        document.querySelector('.sticky-price') &&
        document.querySelector('#total-price-component .price-display') &&
        document.querySelector('.summary-table .total-row .price-display')) {
      setPageLoaded(true)
    }
  }, [])

  !isServer() && useMutationObservable(document, onDocumentMutation)

  const handleClickOutside = (e) => {
    if (e.target.id !== 'add-to-cart-button') {
      if (popperWrapper.current) {
        const popperElement = document.getElementById('#popper')
        if (popperElement) {
          const popperParentElement = popperElement.parentElement
          popperParentElement.removeChild(popperElement)
        }
        popperWrapper.current.style.setProperty('display', 'none')
      }
      setErrorMessage('')
      setErrorType('')
      resetError()
    }
  }

  const popperWrapper = useDetectClickOutside({ onTriggered: handleClickOutside })

  const errors = {
    'SOMETHING_WENT_WRONG': {
      type: 'error',
      message: t('product.error_something_went_wrong')
    },
    'GET_PRICE': {
      type: 'error',
      message: t('product.price_is_not_valid')
    },
    'PRICE_CAN_NOT_BE_UPDATED': {
      type: 'warning',
      message: t('product.price_cannot_be_updated')
    },
    'VALIDATION_ERROR': {
      type: 'error',
      message: t('product.validation_error')
    }
  }

  const getPosition = () => {
    if (forceAddToCartButton) {
      return popperPositions.addToCartButton
    }

    const stickyPanel = document.querySelector('.sticky-price')
    if (stickyPanel && stickyPanel.style.height !== '0px') {
      return popperPositions.stickyPrice
    }

    const topPriceElement = document.querySelector('#total-price-component .price-display')
    if (topPriceElement && isInViewport(topPriceElement)) {
      return popperPositions.topPrice
    }

    const summaryTablePriceElement = document.querySelector('.summary-table .total-row .price-display')
    if (summaryTablePriceElement && isInViewport(summaryTablePriceElement)) {
      return popperPositions.bottomPrice
    }

    return null
  }

  const setPosition = () => {
    const position = getPosition()
    if (position && popperWrapper.current) {
      popperWrapper.current.style.setProperty('display', 'inherit')
      const refElement = document.querySelector(position.refElementSelector)
      if (refElement) {
        refElement.appendChild(popperWrapper.current)
        refElement.style.setProperty('position', 'relative')
        popperWrapper.current.setAttribute('style', '')
        Object.keys(position.location).forEach((locationPoint) => {
          popperWrapper.current.style.setProperty(locationPoint, position.location[locationPoint])
        })
        if (position.tipPosition && Object.keys(position.tipPosition).length) {
          popperWrapper.current.style.setProperty('--tip-position-bottom', position.tipPosition.bottom)
          popperWrapper.current.style.setProperty('--tip-position-left', position.tipPosition.left)
          popperWrapper.current.style.setProperty('--tip-rotation', position.tipPosition.rotation)
        }
      }
    }
  }

  const handleScroll = () => {
    setPosition()
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.addEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (errorCode && pageLoaded) {
      setErrorMessage(errors[errorCode].message)
      setErrorType(errors[errorCode].type)
      setPosition()
    } else if (errorCode === null) {
      setErrorMessage('')
      setErrorType('')
    }
  }, [errorCode, pageLoaded])

  return (
    <div ref={popperWrapper} className={`popper-tooltip ${errorType}`} id='popper'>
      <div className='popper-tooltip-inner'>
        <div className='error-icon'>
          <ErrorIcon width='15px' height='15px'/>
        </div>
        <div className='popover-message'>{errorMessage}</div>
      </div>
      <span className='arrow'/>
    </div>
  )
}

export default Popper
