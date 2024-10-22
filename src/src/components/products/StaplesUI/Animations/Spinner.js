/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import { SpinnerWrapper, ThemedSpinner } from './Spinner.styles'

/** Component **/

export function Spinner(props) {
  return (
    <SpinnerWrapper
      role="alert"
      aria-busy="true"
      aria-label={props.altText}
      size={props.size}
      customCSS={props.customCSS}
      id={props.id}>
      <ThemedSpinner {...props} />
    </SpinnerWrapper>
  )
}

/** Props **/

Spinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'lg']),
  color: PropTypes.string,
  altText: PropTypes.string,
  customCSS: PropTypes.string,
  id: PropTypes.string
}

Spinner.defaultProps = {
  size: 'sm',
  color: 'brand',
  altText: 'Loading...',
  customCSS: null,
  id: ''
}
