import { useEffect, useState} from 'react'
import { useNavigate} from 'react-router-dom'
import Inventory from './Inventory'
import Price from './Price'
import ProductItemQuantity from './ProductItemQuantity'
import UnitsOfMeasure from './UnitsOfMeasure'
import { Button, Tooltip, Icon, ImageLoader, LoadingDots} from '$core-components'
import { UStoreProvider } from '@ustore/core'
import { t } from '$themelocalization'
import './ProductItem.scss'

const ProductItem = (props) => {
  const navigate = useNavigate()
  const [currentOrderItem, setCurrentOrderItem] = useState(null)
  const [isPriceCalculating, setIsPriceCalculating] = useState(false)
  const [calculatedPriceModel, setCalculatedPriceModel] = useState(null)
  const [addToCartShowSuccess, setAddToCartShowSuccess] = useState(false)
  const [quantity, setQuantity] = useState(null)
  const [isQuantityValid, setIsQuantityValid] = useState(true)
  const [addToCartShowSuccessTimer, setAddToCartShowSuccessTimer] = useState(null)
  let {descriptionLines, productNameLines, model, url, detailed, className} = props

  const onQuantityChange = async (newQuantity, isValid) => {
    const { model } = props

    if (isValid) {
      setQuantity(newQuantity)
      if (model.HasPricing) {
        setIsPriceCalculating(true)
        const calculatedPriceModel = await onCalculatePrice(newQuantity)
        setIsPriceCalculating(false)
        setIsQuantityValid(true)
        setCalculatedPriceModel(calculatedPriceModel)
      } else {
        setIsQuantityValid(true)
      }
    } else {
      setIsQuantityValid(false)
    }
  }

  const onCalculatePrice = async (newQuantity) => {
    const { model } = props
    if (model.MinimumPrice === null) return
    const orderItemForApi = currentOrderItem || await UStoreProvider.api.orders.addOrderItem(model.ID)

    const priceModel = await UStoreProvider.api.orders.getPriceOrderItem(orderItemForApi.ID, { ...orderItemForApi, Quantity: newQuantity })
    setCalculatedPriceModel(priceModel.Price)
    setCurrentOrderItem(orderItemForApi)
    return priceModel.Price
  }

  const addToCart = async () => {
    if (isQuantityValid) {
      const { model } = props
      const orderItemForApi = currentOrderItem || await UStoreProvider.api.orders.addOrderItem(model.ID)
      // call the update order api if quantity is updated
      if (quantity) {
        const updated = {
          ...orderItemForApi,
          Quantity: quantity
        }

        await UStoreProvider.api.orders.updateOrderItem(orderItemForApi.ID, updated)
      }
      await UStoreProvider.api.orders.addToCart(orderItemForApi.ID)

      if (UStoreProvider.state.get()['currentStore']?.Attributes?.find((attr) => attr.Name === 'ForceCartAspx' && attr.Value === 'False')) {
        await UStoreProvider.state.store.loadCartItemsCount()
      }

      return true
    }

    return false
  }

  const onAddToCartClick = async () => {
    const success = await addToCart()

    if (success) {
      setAddToCartShowSuccess(true)
      setCurrentOrderItem(null)
      setQuantity(null)
      setAddToCartShowSuccessTimer(setTimeout(() => {
        setAddToCartShowSuccess(false)
        setCalculatedPriceModel(null)
      }, 3000))
    }
  }

  const onClick = (url) => {
    if (typeof url === "string") {
      navigate(url)
    }
  }

  useEffect(() => {
    return () => {
      clearTimeout(addToCartShowSuccessTimer)
    }
  }, [addToCartShowSuccessTimer])

  if (!model) {
    return null
  }

  productNameLines = productNameLines ? productNameLines : 2
  descriptionLines = descriptionLines ? descriptionLines : 4

  const imageUrl = (model && model.ImageUrl) ? model.ImageUrl : require(`$assets/images/default.png`)
  const productNameAndCatalog = model.CatalogNumber && model.CatalogNumber.trim().length > 0 ? `${model.Name} / ${model.CatalogNumber}` : model.Name
  const showQuickAddToCart = model.Configuration && model.Configuration.AllowQuickAddToCart
  const priceModelToDisplay = calculatedPriceModel || model.MinimumPrice
  const isMinimumPrice = !calculatedPriceModel && !showQuickAddToCart
  const quantityToShow = quantity || model.MinimumQuantity

  return (
    <div className={`product-item ${className ? className : ''}`} data-qaautomationinfo={model.FriendlyID}>
      <div className="image-wrapper" onClick={() => onClick(url)}>
        <ImageLoader className="image" src={imageUrl}/>
      </div>
      <div className="product-name" style={{maxHeight: `${productNameLines * 1.5}em`}} onClick={() => onClick(url)}>
        <Tooltip placement="top" text={productNameAndCatalog} maxLine={productNameLines}/>
      </div>
      {detailed && <div className="product-description" style={{maxHeight: `${descriptionLines * 1.5}em`}}>
        <Tooltip placement="bottom" text={model.ShortDescription} maxLine={descriptionLines}/>
      </div>}
      <Inventory model={model.Inventory} minQuantity={model.MinimumQuantity}/>
      {model.HasPricing && priceModelToDisplay && <div>
        <div className="product-units">
          <UnitsOfMeasure minQuantity={model.MinimumQuantity} model={model.Unit} isMinimumPrice={isMinimumPrice}/>
        </div>
        <div className="product-price">
          {isPriceCalculating ?
            <LoadingDots/> : <Price model={priceModelToDisplay} isMinimumPrice={isMinimumPrice}/>
          }
        </div>
      </div>}
      <div className="anchor-flex-end"/>
      {showQuickAddToCart && <div className='add-to-cart'>
        {!addToCartShowSuccess && <div className='add-to-cart-controls'>
          <div className='add-to-cart-product-quantity'>
            <ProductItemQuantity
              supportsInventory={true}
              onQuantityChange={onQuantityChange}
              productModel={model}
              orderModel={{Quantity: quantityToShow}}
            />
          </div>
          <div className='add-to-cart-button-wrapper'>
            <Button className='button-secondary add-to-cart-button' text={t('ProductItem.Add_to_cart_button_text')}
                    onClick={() => onAddToCartClick()}/>
            <Button className='button-secondary add-button' text={t('ProductItem.Add_button_text')}
                    onClick={() => onAddToCartClick()}/>
          </div>
        </div>
        }
        {addToCartShowSuccess &&
          <div className='add-to-cart-success'>
            <div>{t('ProductItem.Added_successfully_message')}
              <span className='success-checkmark-icon-wrapper'>
                  <Icon name="checkmark.svg" width="20px" height="20px" className="success-checkmark-icon"/>
                </span>
            </div>
          </div>
        }
      </div>
      }
    </div>
  )
}


export default ProductItem
