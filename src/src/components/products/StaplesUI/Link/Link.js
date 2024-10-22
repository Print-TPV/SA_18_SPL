import React from 'react'
import PropTypes from 'prop-types'
import { StyledLink } from './Link.styles'

export function Link(props) {
  const { href, ariaLabel, role, onClick, target, size, children, color, rel, disabled, id, className, customCSS, underline } = props
  return (
    <StyledLink
      size={size}
      color={color}
      disabled={disabled}
      underline={underline}
      id={id}
      className={className}
      customCSS={customCSS}>
      { disabled ?
        <div aria-label={ariaLabel}>{children}</div> :
        <a
          href={href}
          aria-label={ariaLabel}
          role={role}
          tabIndex="0"
          onClick={onClick}
          target={target}
          onKeyPress={onClick}
          rel={rel}>
          {children}
        </a> }
    </StyledLink>
  )
}

Link.defaultProps = {
  size: 'md',
  href: null,
  ariaLabel: '',
  target: '_self',
  role: 'link',
  onClick: () => { },
  color: 'link_blue',
  underline: false,
  rel: null,
  disabled: false,
  id: null,
  customCSS: null,
  className: null,
}

Link.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  href: PropTypes.string,
  children: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string,
  onClick: PropTypes.func,
  target: PropTypes.oneOf(['_blank', '_self']),
  role: PropTypes.oneOf(['link', 'button']),
  color: PropTypes.oneOf(['link_blue', 'black', 'white']),
  underline: PropTypes.bool,
  rel: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  customCSS: PropTypes.string,
  className: PropTypes.string,
}