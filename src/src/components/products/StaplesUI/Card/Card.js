import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { CardWrapper } from './Card.styles'

/** Component **/

export function Card(props) {
  const [isClicked, setClicked] = useState(false)
  const { isClickable, children, onClick, cardCustomCSS, id } = props

  const clickHandler = (e) => {
    setClicked(!isClicked)
    if (onClick) onClick(e)
  }

  return (
    <CardWrapper
      id={id}
      aria-disabled="true"
      {...props}
      {
      ...isClickable && {
        tabIndex: '0',
        onClick: clickHandler
      }
      }
      cardCustomCSS={cardCustomCSS}
      isActive={isClickable && isClicked}>
      {children}
    </CardWrapper>
  )
}

/** Props **/

Card.defaultProps = {
  padding: 'lg',
  margin: 0,
  borderRadius: 'lg',
  isHover: true,
  isClickable: false,
  isBorder: true,
  children: '',
  onClick: null,
  cardCustomCSS: null,
  backgroundColor: 'white',
  id: null
}

Card.propTypes = {
  padding: PropTypes.oneOf(['lg', 'md', 'sm']),
  margin: PropTypes.number,
  borderRadius: PropTypes.oneOf(['lg', 'sm']),
  isHover: PropTypes.bool,
  isClickable: PropTypes.bool,
  isBorder: PropTypes.bool,
  children: PropTypes.node,
  onClick: PropTypes.func,
  cardCustomCSS: PropTypes.string,
  backgroundColor: PropTypes.string,
  id: PropTypes.string
}