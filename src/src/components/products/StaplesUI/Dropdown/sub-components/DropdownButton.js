import React from 'react'
import PropTypes from 'prop-types'
import {
  StyledDropdownButton,
  Input,
  Required,
  TextWrapper,
} from '../Dropdown.styles'
import { Icon } from '../../Icon/Icon'
import { useCustomContext, DropdownContext } from '../../utility/useCustomContext'
import { stopProp } from '../../utility/helpers'

export const DropdownButton = (props) => {
  const { disabled, openDropdown, handleKeyDown, currValue, open } =
    useCustomContext(DropdownContext)
  const {
    label,
    inLineLabel,
    withoutContainer,
    labelBGColor,
    ariaLabel,
    labelFontsize,
    labelFontfamily,
    ...rest
  } = props

  return (
    <StyledDropdownButton
      disabled={disabled}
      withoutContainer={withoutContainer}
      errorMsg={rest.errorMsg}
      labelBGColor={labelBGColor}
      labelFontsize={labelFontsize}
      labelFontfamily={labelFontfamily}
      size={rest.size}
      dropDownType={rest.dropDownType}
      height={rest.height}
      width={rest.width}
    >
      <div>
        {inLineLabel ? (
          <span>{label}</span>
        ) : (
          <label>
            {label}
            {rest.isRequired && <Required aria-hidden>*</Required>}
          </label>
        )}
        <div
          role="button"
          tabIndex="0"
          aria-label={
            ariaLabel
              ? disabled
                ? `disabled ${ariaLabel}`
                : ariaLabel
              : disabled
              ? `disabled ${label}`
              : label
          }
          {...(disabled && { 'aria-disabled': true })}
          onClick={() => !disabled && openDropdown()}
          onKeyUp={(e) => handleKeyDown(e)}
          disabled={rest.disabled}
        >
          {rest.dropDownType === 'typeAhead' ? (
            <>
              <Input
                role="textbox"
                value={
                  currValue && currValue.text
                    ? currValue.text
                    : currValue || rest.inputValue
                }
                onChange={(e) => rest.handleChange(e)}
                ref={rest.inputRef}
                type="text"
                dropDownType={rest.dropDownType}
              />
            </>
          ) : (
            <>
              {currValue && currValue.text ? (
                <TextWrapper>{currValue.text}</TextWrapper>
              ) : !currValue ? (
                <Input
                  value={currValue}
                  placeholder={rest.placeholder}
                  aria-hidden
                  readOnly
                  type="text"
                  tabIndex="-1"
                  onKeyPress={(e) => stopProp(e)}
                />
              ) : (
                <TextWrapper>{currValue}</TextWrapper>
              )}
            </>
          )}
          <Icon
            name={open ? 'mini-caret-up' : 'mini-caret-down'}
            size={32}
            color="dark_gray_1"
          />
        </div>
      </div>
    </StyledDropdownButton>
  )
}

DropdownButton.defaultProps = {
  label: '',
  inLineLabel: false,
  withoutContainer: false,
  labelBGColor: 'white',
  ariaLabel: '',
  labelFontsize: '',
  labelFontfamily: '',
}

DropdownButton.propTypes = {
  label: PropTypes.string,
  inLineLabel: PropTypes.bool,
  withoutContainer: PropTypes.bool,
  labelBGColor: PropTypes.string,
  ariaLabel: PropTypes.string,
  labelFontsize: PropTypes.string,
  labelFontfamily: PropTypes.string,
}