import React from 'react'
import PropTypes from 'prop-types'
import { StyledBadge } from './Badge.styles'

/** Component **/

export function Badge(props) {
  const { title, children, customCSS, id, ...rest } = props
  return (
    <StyledBadge
      {...(title && {
        'aria-label': `This item is ${title}.`,
        title,
      })}
      customCSS={customCSS} id={id}
      {...rest}>
      {children}
    </StyledBadge>
  )
}

/** Props **/

Badge.defaultProps = {
  size: 'sm',
  title: null,
  type: 'price',
  customCSS: null,
  id: ''
}

Badge.propTypes = {
  type: PropTypes.oneOf([
    'product',
    'stock',
    'price',
    'primary',
    'premium',
    'select',
    'new',
    'choice'
  ]),
  size: PropTypes.oneOf(['sm', 'lg']),
  children: PropTypes.string.isRequired,
  title: PropTypes.string,
  customCSS: PropTypes.string,
  id: PropTypes.string
}