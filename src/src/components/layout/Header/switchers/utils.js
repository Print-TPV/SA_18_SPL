import { UStoreProvider } from '@ustore/core'
import legacyIframeHandler from '$ustoreinternal/services/legacyIframeHandler'
import themeContext from '$ustoreinternal/services/themeContext'
import { CookiesManager, storefrontCookies } from '$ustoreinternal/services/cookies'
import urlGenerator from '$ustoreinternal/services/urlGenerator'

export const switchCurrency= (selectedCurrency) => {
  UStoreProvider.state.culture.setCurrentCurrency(selectedCurrency)
  themeContext.set('currencyFriendlyID', selectedCurrency.FriendlyID)
  CookiesManager.setCookie({ key: storefrontCookies.currencyID, value: selectedCurrency.FriendlyID, days: 30 })
  CookiesManager.setCookie({ key: storefrontCookies.currencyGUID, value: selectedCurrency.ID, days: 30 })
  legacyIframeHandler.postMessage({
    type: '@CHANGE_CURRENCY',
    data: selectedCurrency.FriendlyID
  })

}

export const switchCulture = (selectedCulture, params) => {
    CookiesManager.setCookie({ key: storefrontCookies.language, value: selectedCulture.LanguageCode, days: 30 })
    const newURL = urlGenerator.get({
      ...params,
      languageCode: selectedCulture.LanguageCode
    }) + window.location.search + window.location.hash
    window.location.replace(newURL)

}

export const getMobileMenuItems = (categoriesTree, cultures, currencies, currentCurrency, currentCulture) =>{

  const convertCategories = (categories, parent, depth) => {
    return categories.map((category) => {
      const id = `${!depth ? 'T' : ''}CT_${category.Category.FriendlyID}`
      const item = {
        id,
        value: id,
        name: category.Category.Name,
        parent,
        depth,
        hasProducts: category.Category.HasProducts
      }
      item.children = category ? convertCategories(category.SubCategories, item, depth + 1) : []
      return item
    })
  }

  const menuTree = []
  if (currencies) {
    menuTree.push({
      id: `TCR_${currentCurrency.ID}`,
      name: currentCurrency.Code,
      value: `TCR_${currentCurrency.ID}`,
      parent: null,
      depth: 0,
      sign: currentCurrency.Symbol,
      children: currencies?.map((model) => {
        const { ID, Symbol, Code } = model
        return ({
          id: `CR_${ID}`, sign: Symbol, name: Code, value: `CR_${ID}`, parent: menuTree, children: [], depth: 1, model
        })
      })
    })
  }

  if (cultures) {
    menuTree.push({
      id: `TCL_${currentCulture.ID}`,
      name: currentCulture.Name,
      value: `TCL_${currentCulture.ID}`,
      icon: `${currentCulture.CountryCode}.svg`,
      parent: null,
      depth: 0,
      children: cultures?.map((model) => {
        const { LanguageCode, CountryCode, Name } = model
        return ({
          id: `CL_${LanguageCode}`,
          icon: `${CountryCode}.svg`,
          name: Name,
          value: `CL_${LanguageCode}`,
          parent: menuTree,
          children: [],
          depth: 1,
          model,
        })
      })
    })
  }

  if (categoriesTree) {
    menuTree.push(...convertCategories(categoriesTree, menuTree, 0))
  }

  return [{
    id: 'menu',
    value: 'menu',
    children: menuTree
  }]
}
