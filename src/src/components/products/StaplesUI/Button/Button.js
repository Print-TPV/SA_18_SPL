import React, { forwardRef, useRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import { KEYCODES } from '../utility/helpers'
import { StyledButton, StyledText } from './Button.styles'

/** Component **/

export const Button = forwardRef((props, ref) => {
  const {
    onClickHandler,
    disabled,
    variant,
    size,
    children,
    type,
    id,
    customCSS,
    label,
    width,
    preventDefault,
    className,
    iconOnly,
    selected,
    textColor,
    qtyBtn,
    ...rest
  } = props
  const buttonRef = useRef()

  useImperativeHandle(ref, () => ({
    focus: () => {
      buttonRef.current.focus()
    },
  }))

  const keyPressHandler = (e) => {
    if (preventDefault && e.which !== KEYCODES.tab && type !== 'submit')
      e.preventDefault()
    if (e.which === KEYCODES.space || e.which === KEYCODES.enter) {
      onClickHandler(e)
    }
  }

  const clickHandler = (e) => {
    if (preventDefault && e.which !== KEYCODES.tab && type !== 'submit')
      e.preventDefault()
    onClickHandler(e)
  }

  return (
    <StyledButton
      onClick={(e) => clickHandler(e)}
      onKeyDown={(e) => keyPressHandler(e)}
      tabIndex={disabled ? '-1' : '0'}
      ref={buttonRef}
      type={type}
      width={width}
      aria-label={label}
      disabled={disabled}
      selected={selected}
      {...(disabled && { 'aria-disabled': true })}
      variant={variant}
      size={size}
      id={id}
      className={className}
      customCSS={customCSS}
      iconOnly={iconOnly}
      qtyBtn={qtyBtn}
      {...rest}
    >
      <StyledText
        variant={variant}
        selected={selected}
        size={size}
        {...(disabled && { 'aria-disabled': true })}
        disabled={disabled}
        textColor={textColor}
      >
        {children}
      </StyledText>
    </StyledButton>
  )
})

/** Constants **/

export const buttonVariants = [
  'primary',
  'secondary',
  'text',
  'reward',
  'outlined',
  'premium',
  'activate'
]

/** Props **/
Button.defaultProps = {
  disabled: false,
  selected: false,
  size: 'md',
  variant: 'primary',
  onClickHandler: () => {},
  type: 'button',
  id: null,
  customCSS: null,
  width: 'auto',
  label: null,
  preventDefault: true,
  className: null,
  iconOnly: false,
  textColor: '',
  qtyBtn: false,
}

Button.propTypes = {
  disabled: PropTypes.bool,
  selected: PropTypes.bool,
  size: PropTypes.oneOf(['xs', 'sm', 'md']),
  variant: PropTypes.oneOf(buttonVariants),
  onClickHandler: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  type: PropTypes.oneOf(['button', 'submit']),
  id: PropTypes.string,
  customCSS: PropTypes.string,
  width: PropTypes.oneOf(['auto', '100%']),
  label: PropTypes.string,
  preventDefault: PropTypes.bool,
  className: PropTypes.string,
  iconOnly: PropTypes.bool,
  textColor: PropTypes.string,
  qtyBtn: PropTypes.bool,
}
