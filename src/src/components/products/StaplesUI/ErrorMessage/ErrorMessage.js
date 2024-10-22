import React from 'react'
import PropTypes from 'prop-types'
import { ErrorText, ErrorWrapper } from './ErrorMessage.styles'
import { Icon } from '../Icon/Icon'

export function ErrorMessage({ size, children, customCSS, id, color, errorRef, ariaHidden, fieldNotificationType }) {
 return (
     <ErrorWrapper
       customCSS={customCSS} id={id}
       ref={errorRef} {...ariaHidden ? {
        'aria-hidden': 'true',
      } : {
        'tabIndex': '0',
        'role' : 'alert'
      }}>
     <div><Icon name={fieldNotificationType === 'error' ? 'error-square' : 'warning-triangle'} size={15} color={fieldNotificationType ? fieldNotificationType === 'error' ? 'staples_red' : 'warning' : `${color}` } /></div>
    <ErrorText color={color} size={size}>{children}</ErrorText>
    </ErrorWrapper>
 )
}

/** Props **/
ErrorMessage.defaultProps = {
    children: '',
    customCSS: '',
    id: null,
    color: 'staples_red',
    errorRef: null,
    ariaHidden: true,
    fieldNotificationType: 'error',
    size: 'sm'
}

ErrorMessage.propTypes = {
children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string
  ]),
  ariaHidden: PropTypes.bool,
  customCSS: PropTypes.string,
  id: PropTypes.string,
  color: PropTypes.string,
  errorRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.elementType })
  ]),
  fieldNotificationType: PropTypes.oneOf(['error', 'warning']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
}