import React, { useEffect, useState } from 'react'
import { throttle } from 'throttle-debounce'

import { UStoreProvider } from '@ustore/core'
import { t } from '$themelocalization'

import { Slot } from '$core-components'
import Layout from '../components/layout'
import CategoryItem from '../components/category/CategoryItem'
import ProductItem from '../components/products/ProductItem'
import PromotionItem from '../components/products/PromotionItem'
import { Slider, Gallery } from '$core-components'

import { getIsNGProduct } from '$themeservices/utils'
import { decodeStringForURL } from '$ustoreinternal/services/utils'
import { getVariableValue } from '$ustoreinternal/services/cssVariables'
import urlGenerator from '$ustoreinternal/services/urlGenerator'
import theme from '$styles/_theme.scss'
import './Home.scss'

const Home = (props) => {
  const { customState: { categories } } = props

  const [isMobile, setIsMobile] = useState(false)
  const [promotionItemButtonUrl, setPromotionItemButtonUrl] = useState('')
  const [homeFeaturedProducts, setHomeFeaturedProducts] = useState(null)
  const [homeFeaturedCategory, setHomeFeaturedCategory] = useState(null)

  const promotionItemImageUrl = getVariableValue('--homepage-carousel-slide-1-image', require(`$assets/images/banner_image.png`), true)
  const promotionItemTitle = getVariableValue('--homepage-carousel-slide-1-main-text', t('PromotionItem.Title'))
  const promotionItemSubtitle = getVariableValue('--homepage-carousel-slide-1-sub-text', t('PromotionItem.Subtitle'))
  const promotionItemButtonText = getVariableValue('--homepage-carousel-slide-1-button-text', t('PromotionItem.Button_Text'))
  const onResize = () => setIsMobile(document.body.clientWidth < parseInt(theme.md.replace('px', '')))

  useEffect(() => {
    window.addEventListener('resize', onResize.bind(this))
    throttle(250, onResize);// Call this function once in 250ms only

    (async () => {
      const maxInPage = 200
      let { Count, Categories } = await UStoreProvider.api.categories.getTopCategories(1, maxInPage)
      if (Count === 0) {
        return
      }

      const page = Math.ceil(Count / maxInPage)
      if (page > 1) {
        const { Categories: lastPageCategories } = await UStoreProvider.api.categories.getTopCategories(page, maxInPage)
        if (lastPageCategories.length > 0) {
          Categories = lastPageCategories
        }
      }

      const homeFeaturedCategory = Categories[Categories.length - 1]
      const { Products } = await UStoreProvider.api.products.getProducts(homeFeaturedCategory.ID, 1)
      setHomeFeaturedProducts(Products)
      setHomeFeaturedCategory(homeFeaturedCategory)
    })()

    onResize()
    return () => {
      window.removeEventListener('resize', onResize)
      clearCustomState()
    }
  }, [])

  useEffect(() => {
    if (categories && categories.length && !promotionItemButtonUrl) {
      const { FriendlyID, Name } = categories[0]
      const defaultURL = urlGenerator.get({ page: 'category', id: FriendlyID, name: decodeStringForURL(Name) })
      setPromotionItemButtonUrl(getVariableValue('--homepage-carousel-slide-1-button-url', defaultURL, false, true))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.customState, categories])

  if (!props.state) {
    return null
  }

  return (
    <Layout {...props} className="home">
      <Slot name="homepage_top"/>
      <div className="promotion-wrapper">
        <Slider>
          <PromotionItem
            imageUrl={promotionItemImageUrl}
            title={promotionItemTitle}
            subTitle={promotionItemSubtitle}
            buttonText={promotionItemButtonText}
            url={promotionItemButtonUrl}
          />
        </Slider>
      </div>

      <div className="middle-section">
        {categories && categories.length > 0 &&
          <div className="categories-wrapper">
            <Slider multi>
              {
                categories.map((model) => {
                    return <CategoryItem key={model.ID} model={model}
                                         url={urlGenerator.get({
                                           page: 'category',
                                           id: model.FriendlyID,
                                           name: decodeStringForURL(model.Name)
                                         })}/>
                  }
                )
              }
            </Slider>
          </div>
        }

        <div className="divider"/>
        {homeFeaturedCategory && homeFeaturedProducts?.length > 0 &&
          <div className="featured-products-wrapper">
            <Gallery title={homeFeaturedCategory.Name}
                     seeAllUrl={urlGenerator.get({
                       page: 'category',
                       id: homeFeaturedCategory.FriendlyID,
                       name: decodeStringForURL(homeFeaturedCategory.Name)
                     })}
                     gridRows="2">
              {
                homeFeaturedProducts.map((model) => {
                  const hideProduct =
                    isMobile &&
                    model.Attributes &&
                    model.Attributes.find(attr => attr.Name === 'UEditEnabled' && attr.Value === 'true') !== undefined

                  return !hideProduct &&
                    <ProductItem
                      key={model.ID}
                      model={model}
                      productNameLines="2"
                      descriptionLines="4"
                      url={getIsNGProduct(model)
                        ? urlGenerator.get({
                          page: 'products',
                          id: model.FriendlyID,
                          name: decodeStringForURL(model.Name)
                        })
                        : urlGenerator.get({
                          page: 'product',
                          id: model.FriendlyID,
                          name: decodeStringForURL(model.Name)
                        })
                      }
                    />
                })
              }
            </Gallery>
          </div>
        }
      </div>
      <Slot name="homepage_bottom"/>
    </Layout>
  )

}

export default Home

function clearCustomState () {
  UStoreProvider.state.customState.delete('homeFeaturedProducts')
  UStoreProvider.state.customState.delete('homeFeaturedCategory')
  UStoreProvider.state.customState.delete('currentProduct')
  UStoreProvider.state.customState.delete('currentOrderItem')
  UStoreProvider.state.customState.delete('currentOrderItemId')
  UStoreProvider.state.customState.delete('currentOrderItemPriceModel')
  UStoreProvider.state.customState.delete('lastOrder')
  UStoreProvider.state.customState.delete('currentProductThumbnails')
}
