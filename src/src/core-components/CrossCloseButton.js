import React from 'react'
import Icon from './Icon'

import './CrossCloseButton.scss'

const CrossCloseButton = ({ onClick, className }) => {
  return (
    <div onClick={onClick}
      className={`cross-close-button-container ${className || ''}`}>
      <Icon name="close_black.svg" width="15px" height="15px" className="cross-close-button"/>
    </div>
  )
}

export default CrossCloseButton
