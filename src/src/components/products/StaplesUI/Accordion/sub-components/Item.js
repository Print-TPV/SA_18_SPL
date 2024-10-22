import React from 'react'
import PropTypes from 'prop-types'
import {
  useCustomContext,
  AccordionContext,
  AccordionItemContext,
} from '../../utility/useCustomContext'
import { AccordionItemWrapper } from '../Accordion.styles'

export const Item = ({
  eventKey,
  children,
  subTitle,
  customCSS,
  showNotificationError,
}) => {
  const { variant } = useCustomContext(AccordionContext)
  return (
    <AccordionItemContext.Provider
      value={{ eventKey, subTitle, showNotificationError }}
    >
      <AccordionItemWrapper
        customCSS={customCSS}
        data-testid="accordion-item"
        id={`accordion-item-${eventKey}`}
        variant={variant}
      >
        {children}
      </AccordionItemWrapper>
    </AccordionItemContext.Provider>
  )
}

Item.defaultProps = {
  children: null,
  subTitle: '',
  customCSS: null,
  showNotificationError: false, // show error window
}

Item.propTypes = {
  eventKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
  ]),
  subTitle: PropTypes.node,
  customCSS: PropTypes.string,
  showNotificationError: PropTypes.bool,
}
