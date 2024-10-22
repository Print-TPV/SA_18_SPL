import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { colors, textColorByBackground } from '../styles/colors'
import {
  ReactPopoverStyled,
  StyledPopoverWrapper,
  StyledTriggerWrapper,
} from './Popover.styles'
import { useOnClickOutside, checkWindow, KEYCODES } from '../utility/helpers'

/** COMPONENT **/

export function Popover(props) {
  const popoverTriggerRef = useRef()

  const {
    ariaLabel,
    backgroundColor,
    children,
    id,
    openModal,
    position,
    triggerElement,
    customCSS,
    delayHide,
    analyticsCallBack,
    onHoverPopover,
    onClose,
    ...rest
  } = props

  const [isOpen, setIsOpen] = useState(openModal)
  const [isMounted, setIsMounted] = useState(false)

  useOnClickOutside(popoverTriggerRef, () => setIsOpen(false))

  useEffect(() => {
    if (openModal) {
      ReactPopoverStyled.show(popoverTriggerRef.current)
    } else {
      ReactPopoverStyled.hide()
    }
  }, [openModal])

  useEffect(() => {
    if (checkWindow()) window.addEventListener('keydown', handleEscKeyDown)
    return () => {
      if (checkWindow()) window.removeEventListener('keydown', handleEscKeyDown)
    }
  })
  useEffect(() => {
    setIsMounted(true)
  }, [])
  // override for backgroundColor
  // needed for known bug for backgroundColor prop not working correctly in react-tooltip
  const backgroundColorOverride = {
    backgroundColor: colors[backgroundColor],
  }

  const handleKeyDown = (event) => {
    if (event.keyCode === KEYCODES.enter) {
      setIsOpen(!isOpen)
      ReactPopoverStyled.show(popoverTriggerRef.current)
      onClose()
    }
  }

  const handleEscKeyDown = (event) => {
    if (isOpen && event.keyCode === KEYCODES.esc) {
      setIsOpen(false)
      ReactPopoverStyled.hide(popoverTriggerRef.current)
    }
  }
  // on click function
  const onClickHandler = (e) => {
    setIsOpen(!isOpen)
    analyticsCallBack(e)
  }

  const handleBlur = (event) => {
    const current = event && event.currentTarget
    const related = event && event.relatedTarget
    if (
      current &&
      related &&
      current.nodeType &&
      related.nodeType &&
      related === !current.contains(related)
    ) {
      setIsOpen(false)
    }
    onClose()
  }

  return (
    <StyledPopoverWrapper onBlur={handleBlur} customCSS={customCSS} {...rest}>
      <StyledTriggerWrapper
        ref={popoverTriggerRef}
        data-tip
        data-for={id}
        aria-expanded={isOpen}
        onKeyDown={(e) => handleKeyDown(e)}
        onClick={(e) => onClickHandler(e)}
        {...(onHoverPopover && {
          onMouseEnter: onClickHandler,
          onMouseLeave: handleBlur,
        })}
      >
        {triggerElement}
      </StyledTriggerWrapper>
      {isMounted && (
        <ReactPopoverStyled
          ariaLabel={ariaLabel}
          delayHide={delayHide}
          arrowColor={colors[backgroundColor]}
          effect="solid"
          event="click"
          id={id}
          place={position}
          isCapture
          textColor={textColorByBackground[backgroundColor]}
          {...props}
          {...backgroundColorOverride}
        >
          {children}
        </ReactPopoverStyled>
      )}
      <div style={{ display: 'none' }}>{children}</div>
    </StyledPopoverWrapper>
  )
}

/** Props **/

Popover.propTypes = {
  ariaLabel: PropTypes.string,
  backgroundColor: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
  globalEventOff: PropTypes.string,
  id: PropTypes.string.isRequired,
  maxWidth: PropTypes.number,
  minWidth: PropTypes.number,
  onClose: PropTypes.func,
  openModal: PropTypes.bool,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  showCaret: PropTypes.bool,
  triggerElement: PropTypes.node.isRequired,
  customCSS: PropTypes.string,
  delayHide: PropTypes.number,
  analyticsCallBack: PropTypes.func,
  onHoverPopover: PropTypes.bool,
}

Popover.defaultProps = {
  ariaLabel: 'popover',
  backgroundColor: 'white',
  globalEventOff: 'click',
  maxWidth: 100,
  minWidth: 0,
  onClose: () => {},
  openModal: false,
  position: 'bottom',
  showCaret: true,
  customCSS: null,
  delayHide: 200,
  analyticsCallBack: () => {},
  onHoverPopover: false,
}