import React, {forwardRef} from 'react'
import {Icon} from '$core-components'
import {t} from '$themelocalization'

import './DuplicateButton.scss'

const DuplicateButton = forwardRef((props, ref) => {
  const { className, onClick, disabled, showLargeIcon } = props
  return (
    <button
      ref={ref}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon
        name="duplicate_cart.svg"
        size={showLargeIcon ? "20px" : "15px"}
        wrapperClassName="cart-list-bar-link-icon"
        title={t('Cart.ListBar.Duplicate')}
      />
    </button>
  )
})

DuplicateButton.defaultProps = {
  className: '',
};

export default DuplicateButton