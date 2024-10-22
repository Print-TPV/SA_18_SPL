export const getConfig = () => ({
  publicRuntimeConfig: {
    assetPrefix: '/ustorethemes/AquaBlue',
    apiUrl: `${process.env.REACT_APP_USTORE_REMOTE_SERVER_URL}/uStoreRestAPI`,
    classicUrl: '/ustore',
    themeCustomizationUrl: '/uStoreThemeCustomizations',
    serverDomain: 'http://localhost:3000'
  }
})
