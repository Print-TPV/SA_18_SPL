import React, {forwardRef} from 'react'
import { LoadingDots } from '$core-components'
import PriceDisplay from '../Price'

const Price = forwardRef(({ price, isPriceCalculating, showMinimumPrice, showOriginalPriceAndBadge, discountRate }, ref) => {
  if (!price) return null
  return (
    <div className='product-instance-price' ref={ref}>
      <div className='total-price' id='total-price-component'>
        {isPriceCalculating || !price
          ? <LoadingDots />
          : <div className='price-wrapper'>
            <PriceDisplay
              model={price.Price}
              showCurrency
              isMinimumPrice={showMinimumPrice}
              showOriginalPriceAndBadge={showOriginalPriceAndBadge}
              discountRate={discountRate}
            />
          </div>
        }
      </div>
    </div>
  )
})

export default Price
