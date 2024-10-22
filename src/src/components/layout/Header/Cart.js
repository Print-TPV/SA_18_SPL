import { useEffect, useState } from 'react'
import { Link } from 'react-aria-components'
import { UStoreProvider } from '@ustore/core'
import urlGenerator from '$ustoreinternal/services/urlGenerator'
import { getCartMode, CART_MODE } from '$themeservices'
import { Icon } from '$core-components'

import './Cart.scss'

const Cart = ({ connectCartUrl = '' }) => {
  const storeItemsCount = UStoreProvider.state.get().cartItemsCount?.ItemsCount
  const [cartItemsCount, setCartItemsCount] = useState(storeItemsCount)
  const isCartLists = getCartMode(UStoreProvider.state.get().currentStore) === CART_MODE.Lists

  useEffect(() => {
    setCartItemsCount(UStoreProvider.state.get().cartItemsCount?.ItemsCount)
  }, [storeItemsCount])

  const getBadge = () => {
    if (isCartLists && cartItemsCount) {
      return <div className="cart-badge"/>
    }
    if (cartItemsCount) {
      return <div className="cart-badge">{cartItemsCount >= 100 ? '∞' : cartItemsCount}</div>
    }
    return null
  }

  const cartUrl = connectCartUrl ? decodeURIComponent(connectCartUrl) : urlGenerator.get({ page: 'cart' })

  return (
    <div className="cart">
      <Link href={cartUrl} className="cart-icon-container">
        <Icon name="cart.svg" width="23px" height="21px" className="cart-icon"/>
        {getBadge()}
      </Link>
    </div>
  )
}

export default Cart
