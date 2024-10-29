import React, { forwardRef, useEffect, useState } from 'react'
import Price from './Price'
import { Icon, LoadingDots } from '$core-components'
import './ProductStickyPrice.scss'
import { PDFRenderer } from './upload/PDFRenderer'
import { usePDFViewer } from './upload/PDFViewerContext'
import { Button } from './StaplesUI/Button/Button'

const styles = {
  saveProject: `
    height: 45px;
    margin: 12px 6px 12px 0;
    width: 50%;
    // border-color: #c00;
  `,
  addToCart: `
    height: 45px;
    margin: 12px 0 12px 6px;
    width: 50%;
  `,
  addToCartStatic: `
    height: 45px;
    @media screen and (max-width: 767px) { 
      margin: 12px auto;
    }
    width: 50%;
    margin: 12px auto;
  `,
  addToCartNewDocumentMobileView: `
    height: 45px;
    margin: 4px 16px 4px 16px;
    width: 100%;
  `
}

const ProductStickyPrice = forwardRef(({
  priceModel,
  addToCartBtnText,
  disabled,
  onClick,
  longPrice,
  isSstkProduct,
  isPriceLoading,
  showMinimumPrice,
  productThumbnails,
  onImageClick,
  lastViewImageId,
  isNewUpload,
  properties,
  addToCartDisabled,
  isNewDocumentMobileView,
  saveProjectForLaterHandler
}, ref) => {
  const image = (productThumbnails && productThumbnails.Thumbnails && productThumbnails.Thumbnails.length)
    ? productThumbnails.Thumbnails[lastViewImageId ? lastViewImageId : 0] : null;
  const { viewerState, fileName } = usePDFViewer()

  const [animationClass, setAnimationClass] = useState('')

  useEffect(() => {
    setAnimationClass('block-reload')
  }, [properties])

  return (
    <div className='product-sticky-price'>
      <div className="product-sticky-price-error-anchor" />
      {/* <div className="sticky-container"> */}
        {/* {image &&
            <div onAnimationEnd={()=> setAnimationClass('')} className="sticky-image-block" onClick={onImageClick}>
              <img className={`${animationClass}`} key={image.Url} height={50} src={image.Url} alt={image.DisplayName}/>
            </div>
          }
          {viewerState.previewUrl && <div className="sticky-image-block" onClick={onImageClick}>
              <div onAnimationEnd={()=> setAnimationClass('')} className={`canvas-wrapper ${animationClass}`}>
                  <PDFRenderer
                      state={{...viewerState, pageNumber: 1}}
                      name={fileName}
                  />
              </div>
          </div>}
            <div className={`total-price${longPrice ? ' long-price' : ''}${!priceModel ? ' button-only' : ''}`}>
              {priceModel
                ?
                (<>
                  <span className={`${isPriceLoading ? 'text-hidden' : ''}`}>
                    <Price
                      showCurrency
                      model={priceModel.Price}
                      isMinimumPrice={showMinimumPrice}/>
                  </span>
                  {isPriceLoading && <LoadingDots/>}
                  <div className='filler'/>
                </>)
                : null
              }
              <div className='sticky-add-to-cart-icon-container'>
                {image === null && viewerState.previewUrl === null && !isNewUpload &&
                  <span className='add-to-cart-icon-wrapper' onClick={() => !disabled ? onClick('sticky_add_button') : undefined}>
                      <Icon id='sticky-add-to-cart-icon' className='sticky-add-to-cart-icon' name='add_to_cart.svg'
                            width='26px'
                            height='26px'
                            onClick={() => !disabled ? onClick('sticky_add_icon') : undefined}/>
                </span>
                }
                <div
                  id='sticky-add-to-cart-button'
                  className={'button button-secondary sticky-add-to-cart-button'}
                  onClick={() => !disabled ? onClick('sticky_add_button') : undefined} ref={ref}>
                  <span className={`${disabled ? 'text-hidden' : ''}`}>{addToCartBtnText}</span>
                  {disabled && <LoadingDots/>}
                </div>
              </div>

            </div> */}
        {/*{isSstkProduct && <Button
            id="save-project-button"
            variant="outlined"
            disabled={addToCartDisabled}
            textColor={!addToCartDisabled ? "primary": ""}
            customCSS={styles.saveProject}
            onClickHandler={saveProjectForLaterHandler}
          >
            Save Project
          </Button>}*/}
        <Button
          id="add-to-cart-button"
          disabled={disabled || addToCartDisabled}
          customCSS={isNewDocumentMobileView ? styles.addToCartNewDocumentMobileView : styles.addToCartStatic}
          onClickHandler={onClick}
        >
          {isPriceLoading
            ? <LoadingDots overrideCss={true} />
            : addToCartBtnText}
        </Button>
      {/* </div> */}
      {/* {(image || viewerState.previewUrl || isNewUpload)
        &&
        (<span className='add-to-cart-icon-wrapper'>
          <Icon id='sticky-add-to-cart-icon' className='sticky-add-to-cart-icon' name='add_to_cart.svg'
                width='26px'
                height='26px'
                onClick={() => !disabled ? onClick('sticky_add_icon') : undefined}/>
        </span>)
      } */}
    </div>
  )
})

export default ProductStickyPrice
