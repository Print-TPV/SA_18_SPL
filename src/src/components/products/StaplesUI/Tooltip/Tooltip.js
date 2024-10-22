import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { colors, textColorByBackground } from '../styles/colors'

import {
  ReactTooltipStyled,
  StyledTooltipWrapper,
  StyledTriggerWrapper,
} from './Tooltip.styles.js'


/** COMPONENT **/

export function Tooltip(props) {
  const [isMounted, setIsMounted] = useState(false)
  const tooltipRef = useRef()
  const {
    ariaLabel,
    backgroundColor,
    behavior,
    children,
    id,
    customCSS,
    openModal,
    position,
    triggerElement,
    delayHide,
    ...rest
  } = props
  const toolTipVariant = {
    arrowColor: behavior === 'float' ? '' : colors[backgroundColor],
    backgroundColor:
      behavior === 'float' ? colors.light_gray_2 : colors[backgroundColor],
    textColor:
      behavior === 'float'
        ? colors.dark_gray_1
        : textColorByBackground[backgroundColor],
  }
  useEffect(() => {
    setIsMounted(true)
  }, [])
  useEffect(() => {
    if (openModal) {
      ReactTooltipStyled.show(tooltipRef.current)
    } else {
      ReactTooltipStyled.hide(tooltipRef.current)
    }
  }, [openModal])
  const handleFocus = () => {
    ReactTooltipStyled.show(tooltipRef.current)
  }

  const handleBlur = () => {
    ReactTooltipStyled.hide(tooltipRef.current)
  }

  return (
    <StyledTooltipWrapper
      customCSS={customCSS}
      {...rest}
      onFocus={handleFocus}
      onBlur={handleBlur} 
      onMouseEnter={handleFocus}
      onMouseLeave={handleBlur}
    >
      <StyledTriggerWrapper ref={tooltipRef} data-tip data-for={id}>
        {triggerElement}
      </StyledTriggerWrapper>
      {isMounted && (
        <ReactTooltipStyled
          role="status"
          ariaHidden
          ariaLive="polite"
          aria-label={ariaLabel}
          delayHide={delayHide}
          effect={behavior}
          id={id}
          place={position}
          {...props}
          {...toolTipVariant}
        >
          {children}
        </ReactTooltipStyled>
      )}
      <div style={{ display: 'none' }}>{children}</div>
    </StyledTooltipWrapper>
  )
}

/** Props **/

Tooltip.propTypes = {
  ariaLabel: PropTypes.string,
  backgroundColor: PropTypes.string,
  behavior: PropTypes.oneOf(['float', 'solid']),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
  id: PropTypes.string.isRequired,
  customCSS: PropTypes.string,
  maxWidth: PropTypes.number,
  openModal: PropTypes.bool,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  triggerElement: PropTypes.node.isRequired,
  delayHide: PropTypes.number,
}

Tooltip.defaultProps = {
  ariaLabel: 'tooltip',
  backgroundColor: 'white',
  behavior: 'solid',
  maxWidth: 100,
  openModal: false,
  position: 'bottom',
  customCSS: null,
  delayHide: 200,
}