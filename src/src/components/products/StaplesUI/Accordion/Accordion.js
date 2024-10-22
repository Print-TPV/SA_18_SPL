import React, { useState, useRef, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { stopProp, getInitialBreakpoint, KEYCODES } from '../utility/helpers'
import { Breakpoint } from '../Breakpoint/Breakpoint'
import { Item, Header, Body } from './sub-components'
import { AccordionContext } from '../utility/useCustomContext'
import { Container } from './Accordion.styles'

export const Accordion = (props) => {
  const {
    id,
    children,
    activeKey,
    lock,
    maxHeight,
    variant,
    maxWidth,
    loadingText,
    collapsible,
    customCSS,
    onOpen,
    onClose,
    onClickCallBack,
  } = props
  const [activeAccordion, setActiveAccordion] = useState(activeKey)
  const [currentBreakpoint, setCurrentBreakpoint] = useState(
    getInitialBreakpoint()
  )

  const [height, setHeight] = useState(0)
  const contentRef = useRef(null)

  const setInteractiveEleTabIndex = useCallback(() => {
    if (typeof contentRef.current.children === 'object') {
      const childrens = Object.values(contentRef.current.children)
      const disableList = ['a', 'input', 'select', 'textarea', 'button']
      if (typeof childrens === 'object') {
        childrens.map((child) => {
          if (
            child.nodeName &&
            disableList.includes(child.nodeName.toLowerCase())
          ) {
            if (activeAccordion) {
              child.removeAttribute('tabIndex')
            } else {
              child.setAttribute('tabIndex', '-1')
            }
          }
          return 1
        })
      }
    }
  }, [activeAccordion])

  const getHeight = useCallback(() => {
    if (contentRef.current) {
      let contentHeight = contentRef.current.clientHeight

      if (contentHeight !== height) {
        if (maxHeight && maxHeight < contentHeight) {
          contentHeight = maxHeight
        }
        setHeight(contentHeight)
      }
    }
  }, [height, maxHeight])

  const breakpointCallback = (breakpoint) => {
    if (currentBreakpoint !== breakpoint) {
      setCurrentBreakpoint(breakpoint)
      getHeight()
    }
  }

  useEffect(() => {
    getHeight()
    setInteractiveEleTabIndex()
  }, [getHeight, setInteractiveEleTabIndex])

  useEffect(() => {
    if (activeKey) {
      setActiveAccordion(activeKey)
     // onOpen(activeKey)
    }
  }, [activeKey, onOpen])

  const handleKeyDown = (event, currentAccordion, showNotificationError) => {
    if (
      (event.keyCode === KEYCODES.space && !activeAccordion) ||
      event.keyCode === KEYCODES.enter
    ) {
      onClick(event, currentAccordion, showNotificationError)
    }
    if (event.keyCode === KEYCODES.space) {
      event.preventDefault(event)
    }
  }

  const onClick = (event, currentAccordion, isError) => {
    let toggle = currentAccordion
    stopProp(event)
    if (collapsible) {
      toggle = !activeAccordion
    } else if (activeAccordion === currentAccordion) {
      toggle = !currentAccordion
    }
    // check error on close of the drawer
    if (isError) {
      const stringItemNumber = currentAccordion.toString()
      onClickCallBack(toggle, stringItemNumber)
    }

    if (!lock) {
      setActiveAccordion(toggle)
      setInteractiveEleTabIndex()
      // only triggers callback if accordion is being opened
      if (toggle !== false) {
        onOpen(toggle)
      } else if (onClose) {
        onClose()
      }
    }
  }

  return (
    <AccordionContext.Provider
      value={{
        variant,
        collapsible,
        activeAccordion,
        onClick,
        contentRef,
        height,
        handleKeyDown,
        lock,
        maxHeight,
        maxWidth,
        loadingText,
        currentBreakpoint,
      }}
    >
      <Container
        id={id}
        customCSS={customCSS}
        aria-label="accordion"
        data-testid="accordion-container"
      >
        {children}
        <Breakpoint onBreakpointChange={breakpointCallback} />
      </Container>
    </AccordionContext.Provider>
  )
}
// Sub-components
Accordion.Item = Item
Accordion.Header = Header
Accordion.Body = Body

Accordion.defaultProps = {
  id: 'accordion-0',
  variant: 'white',
  activeKey: '',
  children: '',
  lock: false,
  maxHeight: null,
  maxWidth: '85%',
  loadingText: '',
  collapsible: false,
  onOpen: () => {},
  onClose: () => {},
  onClickCallBack: () => {},
  customCSS: null,
}

Accordion.propTypes = {
  id: PropTypes.string,
  variant: PropTypes.oneOf(['gray', 'white']),
  activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
  ]),
  lock: PropTypes.bool,
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  loadingText: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  collapsible: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  customCSS: PropTypes.string,
  onClickCallBack: PropTypes.func,
}
