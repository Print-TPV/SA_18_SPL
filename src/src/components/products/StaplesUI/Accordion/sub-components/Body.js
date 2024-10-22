import React from 'react'
import PropTypes from 'prop-types'
import { Spinner } from '../../Animations/Spinner'
import {
  useCustomContext,
  AccordionContext,
  AccordionItemContext,
} from '../../utility/useCustomContext'
import {
  AccordionBody,
  AccordionContainer,
  LoadingWrapper,
  LoadingContainer,
} from '../Accordion.styles'

export const Body = ({ children, customCSS }) => {
  const {
    collapsible,
    currentBreakpoint,
    activeAccordion,
    contentRef,
    variant,
    maxHeight,
    maxWidth,
    loadingText,
  } = useCustomContext(AccordionContext)
  const { eventKey } = useCustomContext(AccordionItemContext)
  const isOpen = collapsible ? activeAccordion : activeAccordion === eventKey
  const childProp = !!(children !== null && children !== undefined)
  const loadingContent = (
    <LoadingWrapper>
      <Spinner />
      {loadingText && (
        <LoadingContainer breakpoint={currentBreakpoint} aria-live="polite">
          {loadingText}
        </LoadingContainer>
      )}
    </LoadingWrapper>
  )
  return (
    <AccordionBody
      data-testid="accordion-body"
      aria-hidden={!isOpen}
      role="region"
      id={`accordion-content-${eventKey}`}
      open={isOpen}
      childProp={childProp}
      maxHeight={maxHeight}
      maxWidth={maxWidth}
      variant={variant}
      aria-labelledby={`accordion-button-${eventKey}`}
    >
      <AccordionContainer
        data-testid="accordion-body-container"
        customCSS={customCSS}
        open={isOpen}
        maxWidth={maxWidth}
        childProp={childProp}
        breakpoint={currentBreakpoint}
        ref={contentRef}
      >
        {childProp ? children : loadingContent}
      </AccordionContainer>
    </AccordionBody>
  )
}

Body.defaultProps = {
  children: null,
  customCSS: null,
}

Body.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
  ]),
  customCSS: PropTypes.string,
}
