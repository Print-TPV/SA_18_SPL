import React from 'react'
import PropTypes from 'prop-types'
import {
  useCustomContext,
  AccordionContext,
  AccordionItemContext,
} from '../../utility/useCustomContext'
import {
  AccordionHeader,
  Arrow,
  TitleWrapper,
  SubTitleWrapper,
} from '../Accordion.styles'
import { Icon } from '../../Icon/Icon'

export const Header = ({ children, customCSS }) => {
  const {
    collapsible,
    currentBreakpoint,
    onClick,
    activeAccordion,
    handleKeyDown,
    lock,
    variant,
  } = useCustomContext(AccordionContext)
  const { eventKey, subTitle, showNotificationError } =
    useCustomContext(AccordionItemContext)
  const isOpen = collapsible ? activeAccordion : activeAccordion === eventKey
  return (
    <AccordionHeader
      data-testid="accordion-header"
      customCSS={customCSS}
      onClick={(e) => onClick(e, eventKey, showNotificationError)} //show error window
      onKeyDown={(e) => handleKeyDown(e, eventKey, showNotificationError)}
      variant={variant}
      breakpoint={currentBreakpoint}
      role="button"
      tabIndex="0"
      id={`accordion-button-${eventKey}`}
      aria-expanded={isOpen}
      aria-controls={`accordion-content-${eventKey}`}
      aria-disabled={lock}
      open={isOpen}
    >
      <TitleWrapper>
        {children}
        <Arrow breakpoint={currentBreakpoint}>
          <Icon name={isOpen ? 'caret-up' : 'caret-down'} size={14} />
        </Arrow>
      </TitleWrapper>
      {subTitle && <SubTitleWrapper>{subTitle}</SubTitleWrapper>}
    </AccordionHeader>
  )
}

Header.defaultProps = {
  children: null,
  customCSS: null,
}

Header.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
  ]),
  customCSS: PropTypes.string,
}
