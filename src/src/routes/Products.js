import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { UStoreProvider } from '@ustore/core'
import { LoadingDots } from '$core-components'
import { t } from '$themelocalization'
import KitProduct from '../components/products/kit/KitProduct'
import StaticProduct from '../components/products/static/StaticProduct'
import Layout from '../components/layout'
import { productTypes } from '../services/utils'
import WithThemeProvider from './WithThemeProvider'
import './Products.scss'


const renderLoader = () => {
  return (
    <div>
      <div className={'product-loading'}>
        <LoadingDots />
        {t('product.loading-msg')}
      </div>
    </div>
  )
}

const Products = (props) => {
  const params = useParams()
  const [xmPieSAParameters, setXmPieSAParameters] = useState({ parentUrl: "https://aka-qe102.staplesadvantage.com" })

  useEffect(() => {
    (async () => {
      if (typeof window !== 'undefined') {
        window.addEventListener('Theme_Stpl_Message', onThemeMessageRecieved)
        window.addEventListener('Theme_Stpl_Internal_Message', onStplMessageRecieved)
        window.addEventListener('message', onMessageRecieved)
      }
      const { id: productFriendlyID, OrderItemId: orderItemID } = params
      if (!productFriendlyID) return

      const { currentProduct } = UStoreProvider.state.customState.get()
      if (currentProduct && currentProduct.FriendlyID === parseInt(productFriendlyID)) {
        UStoreProvider.state.customState.setBulk({ currentOrderItemId: orderItemID || null })
        return
      }
      const productID = await UStoreProvider.api.products.getProductIDByFriendlyID(productFriendlyID)
      const product = await UStoreProvider.api.products.getProductByID(productID)

      UStoreProvider.state.customState.setBulk({ currentProduct: product,currentOrderItemId: orderItemID})
    })()
    return () => {
      window.removeEventListener("Theme_Stpl_Message", onThemeMessageRecieved);
      window.removeEventListener("Theme_Stpl_Internal_Message", onStplMessageRecieved);
      window.removeEventListener("message", onMessageRecieved);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onMessageRecieved = (saData) => { 
    if (saData && saData.origin && saData.origin.indexOf(".staplesadvantage.com") >= 0) {
      if(saData.data && saData.data.xmPieParameters && (xmPieSAParameters && !xmPieSAParameters.refUrl)) {
        setXmPieSAParameters(saData.data.xmPieParameters)
      }
    }
  }

  const onThemeMessageRecieved = (saData) => {
    if (saData && saData.detail && saData.detail.xmPieParameters && (xmPieSAParameters && !xmPieSAParameters.refUrl)) {
      setXmPieSAParameters(saData.detail.xmPieParameters)
    }
  }

  const onStplMessageRecieved = (saData) => {
     if (saData && saData.detail && saData.detail.xmPieParameters && (xmPieSAParameters && !xmPieSAParameters.refUrl)) {
      setXmPieSAParameters(saData.detail.xmPieParameters)
    }
  }

  if (!props.state || !props.customState) {
    return <Layout {...props}>
      {renderLoader()}
    </Layout>
  }

  if (!props.customState.currentProduct) {
    return <Layout {...props}>
      {renderLoader()}
    </Layout>
  }

  const product = props.customState.currentProduct
  // check type of product to decide which component to render.
  switch (product.Type) {
    case productTypes.KIT:
      return <Layout {...props}>
        <KitProduct key={product.ID} {...props} />
      </Layout>
    case productTypes.STATIC:
    case productTypes.DYNAMIC:
    case productTypes.EASY_UPLOAD:
      return <WithThemeProvider>
        <Layout {...props}>
          <StaticProduct key={product.ID} {...props} _xmPieSAParameters={xmPieSAParameters} />
        </Layout>
      </WithThemeProvider>
    default:
      return null
  }
}

export default Products
