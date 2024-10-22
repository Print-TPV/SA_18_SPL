import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { StyledDropdownContainer } from '../Dropdown.styles'
import { useCustomContext, DropdownContext } from '../../utility/useCustomContext'

export const DropdownContainer = (props) => {
  const [focus, setFocus] = useState(false)
  const { children, id, customCSS } = props
  const { disabled, wrapperRef, dropDownType } =
    useCustomContext(DropdownContext)
  return (
    <StyledDropdownContainer
      disabled={disabled}
      {...(disabled && { 'aria-disabled': true })}
      id={id}
      customCSS={customCSS}
      dropDownType={dropDownType}
      ref={wrapperRef}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      focus={focus}
    >
      {children}
    </StyledDropdownContainer>
  )
}

DropdownContainer.defaultProps = {
  children: null,
  disabled: false,
  handleFocus: () => {},
  id: '',
  customCSS: null,
}

DropdownContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  disabled: PropTypes.bool,
  handleFocus: PropTypes.func,
  id: PropTypes.string,
  customCSS: PropTypes.string,
}