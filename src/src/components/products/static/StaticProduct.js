import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { throttle } from 'throttle-debounce'
import { UStoreProvider } from '@ustore/core'
import { t } from '$themelocalization'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { LoadingDots } from '$core-components'
import Popper from './Popper'
import DynamicForm from '../DynamicForm'
import urlGenerator from '$ustoreinternal/services/urlGenerator'
import theme from '$styles/_theme.scss'
import themeContext from '$ustoreinternal/services/themeContext'
import ProductDetails from '../ProductDetails'
import ProductDeliveryMethod from '../ProductDeliveryMethod'
import ProductOrderSummary from '../ProductOrderSummary'
import ProductStickyPrice from '../ProductStickyPrice'
import ProductLayout from '../ProductLayout'
import Price from './Price'
import {
  convertPropertiesFromApiToPropertiesObject,
  getDependenciesObject,
  getPriceOrderItem, getReorder, pushCart,
  pushOrderItem,
  pushProperties,
  pushPropertiesState,
  pushSavedForLater,
  getPickUpDateUTC_,
  calcDateTime_
} from './utils'
import {
  fastProofService,
  convertProductPropertiesFormIntoArray,
  preparingFormDataToSendToServer,
  productTypes
} from '$themeservices'
import { isOutOfStock } from '../Inventory'
import ProductQuantity from '../ProductQuantity'
import ProductProof from '../ProductProof'
import ProductApprovalModal from '../ProductApprovalModal'
import './StaticProduct.scss'
import './ProductProperties.scss'
import useErrors from './useErrors'
import useUpdateProperties from './useUpdateProperties'
import { Slot } from '$core-components'
import './ProductProperties.scss'
import './StaticProduct.scss'
import { useSticky } from './useSticky'
import Preview from '../Preview'
import { PDFViewer } from '../upload/PDFViewer'
import PreviewErrorBalloon from './PreviewErrorBalloon'
import { CookiesManager } from '$ustoreinternal/services/cookies'
import SstkEditor from '../Shutterstock/SstkEditor'
import isEmpty from 'lodash/isEmpty'
import { NotificationBubble } from '../StaplesUI/NotificationBubble/NotificationBubble'
import { Modal } from '../StaplesUI/Modal/Modal'
import { DoubleIcon } from '../StaplesUI/Icon/DoubleIcon'
import { Icon } from '../StaplesUI/Icon/Icon'
import { Spinner } from '../StaplesUI/Animations/Spinner'
import { Link } from '../StaplesUI/Link/Link'
import { Button } from '../StaplesUI/Button/Button'
import {
  createFileAttachAssetSource,
  deleteFileAttachAssetSource,
  downloadConvertedAsset,
  fileBlobFromAssetSourceResult,
  fileListFromAssetSourceResult,
  getConvertedPdfFilesAssetSourceId,
  getConvertedPdfFilesFolderName,
  uploadFileToAssetSource,
} from '../Simpleprint/UProduceHelper'
import {
  BOOKLET_FINISHING,
  checkMemoPadsProduct,
  checkNCRProduct,
  getBookletTotalPage
} from '../Simpleprint/PreviewHelper'
import {
  getTabMaxPageNumber, getTabMetadata, getTabSummary,
  sortedTabData
} from '../Simpleprint/TabHelper'
import FileOperationWizard from '../DocumentPreview/FileOperationWizard'
import DocumentPreview from '../DocumentPreview/DocumentPreview'
import { debounce } from 'lodash'
import { ToastBar } from '../StaplesUI/ToastBar/ToastBar'
import { Breakpoint } from '../StaplesUI/Breakpoint/Breakpoint'
import FileUpload from '../DocumentPreview/FileUpload'
import {
  deleteAssetSourcesWithImages,
  deletePreviouslyGeneratedProof,
  generateAssetImagesAndUpload,
  downloadSimplePrintProof
} from '../Simpleprint/BackendPreview'
import { BasePreview } from '../Simpleprint/BasePreview'
import { generateRandomNumber, removeFileExtension } from '../Simpleprint/PreviewHelper'
import { FileSetupDetailsAccordion } from "../DocumentPreview/FileSetupDetailsAccordion";
import SubHeader from '../../layout/Header/SubHeader'
import ImageCarousel from '../ImageCarousel'
import { disableEnableScroll } from '../StaplesUI/utility/helpers'

// const pdfjs = require('pdfjs-dist');
// import 'pdfjs-dist/build/pdf.worker.mjs'
// import 'pdfjs-dist/web/pdf_viewer.css'
import * as pdfjsLib from 'pdfjs-dist'

const State = {
  loading: 'LOADING',
  calculatingPrice: 'CALCULATING_PRICE',
  initial: 'INITIAL',
  clickedAddToCart: 'CLICKED_ADD_TO_CART',
  error: 'ERROR'
}


const StaticProduct = ({
  customState,
  state: {
    currentCurrency,
    currentStore: { TaxFormatType, StoreType }
  },
  _xmPieSAParameters
}) => {
  const [pageState, setPageState] = useState(State.loading)
  const [orderItem, _setOrderItem] = useState(customState.currentOrderItem || {})
  const [product, setProduct] = useState(customState.currentProduct || {})
  const [productThumbnails, setProductThumbnails] = useState({})
  const [documentData, setDocumentData] = useState({
    pdfFileBlob: '',
    numOfPages: '',
    fileName: '',
    file: null,
    assetId: '',
    isFileAdded: false
  })
  const [quantity, setQuantity] = useState(1)
  const [price, setPrice] = useState({})
  const [properties, _setProperties] = useState({})
  const [propertiesObject, _setPropertiesObject] = useState({})
  const [excelPricingEnabled, _setExcelPricingEnabled] = useState(false)
  const [productDeliveries, setProductDeliveries] = useState(customState.currentDeliveryServices || null)
  const [deliveryMethod, setDeliveryMethod] = useState(null)
  const [deliveryService, setDeliveryService] = useState(null)
  const [priceError, setPriceError] = useState(null)
  const [quantityError, _setQuantityError] = useState(null)
  const [proofUrl, setProofUrl] = useState(null)
  const [proofModalOpen, setProofModalOpen] = useState(false)
  const [approvalModalOpen, setApprovalModalOpen] = useState(false)
  const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false)
  const [popperAffectedSections, setPopperAffectedSections] = useState([])
  const [popperError, setPopperError] = useState(null)
  const [postLoadingProcedures, setPostLoadingProcedures] = useState(false)
  const [forceAddToCartButtonPopper, setForceAddToCartButtonPopper] = useState(false)
  const [htmlDataUpdateTimeout, setHtmlDataUpdateTimeout] = useState(null)
  const [showLoaderDots, setShowLoaderDots] = useState(false)
  const [showLoader, setShowLoader] = useState(false);

  const [sstkThumbnails, setSstkThumbnails] = useState(null);
  const [sstkProperties, _setSstkProperties] = useState({});
  const [isSstkProduct, setIsSstkProduct] = useState(false);
  const [isMultiFileProduct, _setMultiFileProduct] = useState(false);
  const [isBookletProduct, setIsBookletProduct] = useState(false);
  const [isNewSimplePrintProduct, setIsNewSimplePrintProduct] = useState(false);
  const [isStaticProduct, setIsStaticProduct] = useState(false);
  const [productMode, setProductMode] = useState('');
  const [messageType, setMessageType] = useState(null);
  const [altProductPresent, setIsAltProduct] = useState(false)

  const [isReadyToGenerateProof, setIsReadyToGenerateProof] = useState(false);
  const [proofPropertiesValue, _setProofPropertiesValue] = useState(null);
  const [disabledRefreshPreviewButton, setDisabledRefreshPreviewButton] = useState(false)
  const [uploadComplete, _setUploadComplete] = useState(true)
  const [uploadError, _setUploadError] = useState(false)
  const [lastViewImageId, setLastViewImageId] = useState(0)
  const [fileName, _setFileName] = useState('')
  const [showReplaceFileLink, setShowReplaceFileLink] = useState(false)
  const [fileSize, _setFileSize] = useState('')
  const [basePreview, _setBasePreview] = useState(null)
  const [isDisableATC, _setIsDisableATC] = useState(false)
  const [currentBreakpoint, setCurrentBreakpoint] = useState('')
  const [supportEmail, setSupportEmail] = useState('support@staplesadvantage.com')
  const [localFileObj, setLocalFileObj] = useState(null)
  const [localFileObjWord, setLocalFileObjWord] = useState(null)
  const [pdfConvertedFileFl, setPdfConvertedFileFl] = useState(false)
  const [isMobile, setIsMobile] = useState(document.body.clientWidth < parseInt(theme.md.replace('px', '')))
  const [previousUploadedFileBlob, setPreviousUploadedFileBlob] = useState(null)
  const [myAssetId, setMyAssetId] = useState(null)
  const [selectedFileSource, setSelectedFileSource] = useState('NA')
  const [disablePopover, _setDisablePopover] = useState(false)
  const [showToast, _setShowToast] = useState(false);
  const [showToastMsg, _setShowToastMsg] = useState('');
  const [tpvAttributes, _setTpvAttributes] = useState({});
  const tpvAttributesRef = React.useRef(tpvAttributes)
  const isMultiFileProductRef = React.useRef(isMultiFileProduct)
  const propertiesObjectRef = React.useRef(propertiesObject)
  const orderItemRef = React.useRef(orderItem)
  const sstkPropertiesRef = React.useRef(sstkProperties)
  const propertiesRef = React.useRef(properties)
  const excelPricingEnabledRef = React.useRef(excelPricingEnabled)
  const quantityErrorRef = React.useRef(quantityError)
  const proofPropertiesValueRef = React.useRef(proofPropertiesValue)
  const uploadCompleteRef = React.useRef(uploadComplete)
  const fileNameRef = React.useRef(fileName)
  const basePreviewRef = React.useRef(basePreview)
  const prevBasePreviewRef = React.useRef(null)
  const fileSizeRef = React.useRef(fileSize)
  const uploadErrorRef = React.useRef(uploadError)
  const isDisableATCRef = React.useRef(isDisableATC)
  const beforeUnloadHandler = React.useRef(null);
  const [sectionToOpen, setSectionToOpen] = useState(0)
  const [searchParams, setSearchParams] = useSearchParams()
  const [poofPreviewError, setPoofPreviewError] = useState(false)
  const [disableATCForStore, _setDisableATCForStore] = useState(false)
  const [errorNotification, setErrorNotification] = useState(false);
  const [formErrorsArray, setFormErrorsArray] = useState([])
  const [sstkBlankCanvas, _isSstkBlankCanvas] = useState(false)
  const [fileList, setFileList] = useState([])
  const [tabSummary, _setTabSummary] = useState(null)
  const [showTabError, _setShowTabError] = useState(false)
  const [tempFileList, _setTempFileList] = useState([])
  const tempFileListRef = React.useRef(tempFileList)
  const [isAddMoreFileEnabled, _setAddMoreFileEnabled] = useState(false)
  const isAddMoreFileEnabledRef = React.useRef(isAddMoreFileEnabled)
  const [addToMyFileState, setAddToMyFileState] = useState('initial')
  const [enableWarningModal, setWarningModal] = useState(false)
  const [webGlEnabled, setWebGlEnabled] = useState(true)
  const [openSstkEditorModal, setOpenSstkEditorModal] = useState(false)
  const topMarkerRef = useRef(null)
  const easyUploadTopMarkerRef = useRef(null)
  const bottomMarkerRef = useRef(null)
  const { showStickyPrice, stickyConnect, stickyDisconnect } = useSticky(topMarkerRef, bottomMarkerRef, easyUploadTopMarkerRef)
  const topPriceRef = useRef(null)
  const bottomPriceRef = useRef(null)
  const { addPromise } = useUpdateProperties()
  const navigate = useNavigate()
  const {
    errors,
    processErrorsOnApiResponse,
    processErrorsOnFormChange,
    processErrorsOnAddToCart,
    showAllErrors,
    excelPricingError,
    checkIsPriceAffectedWithErrors
  } = useErrors(properties)
  const [showRefreshPreview, setShowRefreshPreview] = useState(false)
  const stickyPriceRef = useRef(null)
  const disablePopoverRef = React.useRef(disablePopover)
  const showToastRef = React.useRef(showToast)
  const showToastMsgRef = React.useRef(showToastMsg)
  const showTabErrorRef = React.useRef(showTabError)
  const childRef = React.useRef();
  const scrollRef = React.useRef();
  const fileOpRef = React.useRef();
  const drawerRef = React.useRef();
  const fileInputRef = React.useRef(null);
  const replaceFileRef = React.useRef(false);
  const disableATCForStoreRef = React.useRef(disableATCForStore);
  const sstkBlankCanvasRef = React.useRef(sstkBlankCanvas);
  const tabSummaryRef = React.useRef(tabSummary)
  const xmPieSAParametersRef = React.useRef(_xmPieSAParameters);

  const sizeId = Object.keys(propertiesObject).find(formProps => formProps.startsWith('Size')) || ''
  const productModeKey = Object.keys(propertiesObject).find(formProps => formProps.startsWith("product-mode")) || ''
  const currentProductHasSSTK = UStoreProvider.state.get().customState?.currentProductProperties?.JSONSchema?.properties[productModeKey]?.enum?.includes('sstk') || false;

  const setTempFileList = (data) => {
    tempFileListRef.current = data;
    _setTempFileList(data);
  }

  const setMultiFileProduct = (data) => {
    isMultiFileProductRef.current = data;
    _setMultiFileProduct(data);
  }

  const setAddMoreFileEnabled = (data) => {
    isAddMoreFileEnabledRef.current = data;
    _setAddMoreFileEnabled(data);
  }

  const setDisableATCForStore = (data) => {
    disableATCForStoreRef.current = data;
    _setDisableATCForStore(data);
  }

  const isSstkBlankCanvas = (data) => {
    sstkBlankCanvasRef.current = data;
    _isSstkBlankCanvas(data);
  }

  const setBasePreview = data => {
    basePreviewRef.current = data
    _setBasePreview(data)
  }

  const setProofPropertiesValue = data => {
    proofPropertiesValueRef.current = data
    _setProofPropertiesValue(data)
  }
  const setTpvAttributes = data => {
    tpvAttributesRef.current = data
    _setTpvAttributes(data)
  }

  const setUploadError = data => {
    uploadErrorRef.current = data
    _setUploadError(data)
  }
  const setFileSize = data => {
    fileSizeRef.current = data
    _setFileSize(data)
  }
  const setFileName = data => {
    fileNameRef.current = data
    _setFileName(data)
  }
  const setUploadComplete = data => {
    uploadCompleteRef.current = data
    _setUploadComplete(data)
  }
  const setPropertiesObject = data => {
    propertiesObjectRef.current = data
    _setPropertiesObject(data)
  }
  const setOrderItem = data => {
    orderItemRef.current = data
    _setOrderItem(data)
  }
  const setSstkProperties = data => {
    sstkPropertiesRef.current = data
    _setSstkProperties(data)
  }
  const setProperties = data => {
    propertiesRef.current = data
    _setProperties(data)
  }
  const setExcelPricingEnabled = data => {
    excelPricingEnabledRef.current = data
    _setExcelPricingEnabled(data)
  }
  const setQuantityError = data => {
    quantityErrorRef.current = data
    _setQuantityError(data)
  }

  const setIsDisabledATC = data => {
    isDisableATCRef.current = data
    _setIsDisableATC(data)
  }

  const setDisablePopover = data => {
    disablePopoverRef.current = data
    _setDisablePopover(data)
  }

  const setShowToast = data => {
    showToastRef.current = data
    _setShowToast(data)
  }

  const setShowToastMsg = data => {
    showToastMsgRef.current = data
    _setShowToastMsg(data)
  }

  const setTabSummary = data => {
    tabSummaryRef.current = data
    _setTabSummary(data)
  }

  const setShowTabError = data => {
    showTabErrorRef.current = data
    _setShowTabError(data)
  }

  const getUpdatedProjectName = async (updatedProjectName) => {
    await formValueChangeHandler(sstkPropertiesRef.current["sstkProjectName"], updatedProjectName);
  }

  const breakpointCallback = (breakpoint) => {
    if (breakpoint !== currentBreakpoint) {
      setCurrentBreakpoint(breakpoint);
    }
  }

  useEffect(() => {
    if (_xmPieSAParameters) {
      xmPieSAParametersRef.current = _xmPieSAParameters;
    }
  }, [_xmPieSAParameters])

  const checkIfThereArePropertyErrors = useCallback((updatedErrors = null, updatedProperties = null) => {
    const productErrors = updatedErrors ? { ...updatedErrors } : { ...errors }
    const propertiesToUse = updatedProperties ? convertPropertiesFromApiToPropertiesObject(updatedProperties) : propertiesObject

    return Object.keys(productErrors)
      .some((propertyId) =>
        productErrors[propertyId] &&
        productErrors[propertyId].errors &&
        productErrors[propertyId].errors.length &&
        propertiesToUse[propertyId].uiSchema['ui:options'].visible
      )
  }, [errors, propertiesObject])

  const checkIfThereAreSectionErrors = useCallback(() => {
    return Object.values(errors).some((property) => property.errors.length && property.show && property.section)
  }, [errors])

  const checkIfThereAreVisiblePropertyErrors = useCallback((updatedErrors = null) => {
    const productErrors = updatedErrors ? { ...updatedErrors } : { ...errors }
    return Object.values(productErrors).some((property) => property.errors.length && property.show)
  }, [errors])

  const calculateProperties = throttle(750, async (usedQuantity, updatedOrderItem = null, updatedProperties = null, updatedErrors = null) => {
    if (price.Price === null) return
    setPageState(State.calculatingPrice)
    const updatedPrice = await getPriceOrderItem(
      updatedOrderItem ? updatedOrderItem.ID : orderItemRef.current.ID,
      {
        ...updatedOrderItem || orderItemRef.current,
        Properties: ((updatedProperties && Object.keys(updatedProperties).length)) || (properties && Object.keys(properties).length) ? convertProductPropertiesFormIntoArray(
          updatedProperties || properties,
          excelPricingEnabled
        ) : null,
        Quantity: usedQuantity
      })
    if (updatedPrice.Price === null) {
      setPrice(updatedPrice)
      setPageState(State.initial)
      return
    }
    if (updatedErrors && updatedProperties) {
      const errorsExist = checkIfThereArePropertyErrors(updatedErrors, updatedProperties)
      if (errorsExist && (updatedPrice.Price.Price === -1 || updatedPrice.IsMinimumPrice)) {
        setPriceError('can not recalculate')
        setPostLoadingProcedures(true)
      } else if (!errorsExist && (updatedPrice.Price.Price === -1 || updatedPrice.IsMinimumPrice)) {
        setPricingError({
          ErrorCode: 'ExcelCalculation'
        })
        setPageState(State.initial)
        return
      } else if (product.Type === productTypes.DYNAMIC) {
        const keepError = Object.entries(updatedErrors).reduce((r, [key, val]) => {
          return r || (val.show && updatedProperties.JSONSchema.definitions[key]?.custom.affectPrice)
        }, false)
        if (!keepError) {
          setPriceError(null)
        }
      } else {
        setPriceError(null)
      }
    }
    setPrice(updatedPrice)
    UStoreProvider.state.customState.set('currentOrderItemPriceModel', updatedPrice)
    setPageState(State.initial)
  })

  const updateProperties = useCallback(async (changedProperties = [], updatedProperties = null, usedQuantity = null, recalculatePrice = true, updatedErrors = null) => {
    const updatedPropertiesSchema = updatedProperties || propertiesRef.current

    const formDataForApi = preparingFormDataToSendToServer(updatedPropertiesSchema.formData, propertiesRef.current)
    formDataForApi.push({
      id: 'uStoreOrderItemQuantity',
      value: usedQuantity || quantity
    })

    const handleResponse = async (response, e) => {
      if (e) {
        console.error(e)
        // Excel template V15.0 error
        setPricingError(e)
        return {
          updatedPropertiesFromApi: properties, updatedPropertiesObject: propertiesObjectRef.current
        }
      }

      const updatedPropertiesObject = convertPropertiesFromApiToPropertiesObject(
        response,
        getDependenciesObject(response, excelPricingEnabledRef.current) ? getDependenciesObject(response, excelPricingEnabledRef.current).dependenciesObject : null
      )
      setProperties(response)
      setPropertiesObject(updatedPropertiesObject)
      setIsSstkProduct(checkIsSstkProduct(response))
      setMultiFileProduct(checkIsMultiFileProduct(response))
      setIsStaticProduct(checkIsStaticProduct(response))
      setIsNewSimplePrintProduct(checkIsNewSimplePrintProduct(response))
      setIsBookletProduct(checkIsBookletProduct(response))
      setProductMode(checkProductMode(response));
      UStoreProvider.state.customState.set('currentProductProperties', response)
      const updatedErrorsFromApi = await processErrorsOnApiResponse(
        response,
        updatedErrors || errors,
        changedProperties
      )
      if (product.Type === productTypes.DYNAMIC) {
        recalculatePrice = changedProperties.reduce((acc, propertyId) => {
          return acc || response.JSONSchema.definitions[propertyId]?.custom.affectPrice
        }, recalculatePrice)
      }

      if (recalculatePrice && !checkIfThereAreVisiblePropertyErrors(updatedErrorsFromApi)) {
        calculateProperties(usedQuantity || quantity, null, response, updatedErrorsFromApi)
      }
      return { updatedPropertiesFromApi: response, updatedPropertiesObject }
    }

    addPromise(pushPropertiesState(
      orderItemRef.current.ID,
      formDataForApi
    ), handleResponse)

    return { updatedPropertiesFromApi: propertiesRef.current, updatedPropertiesObject: propertiesObjectRef.current }
  }, [addPromise, calculateProperties, checkIfThereAreVisiblePropertyErrors, errors, excelPricingEnabled, orderItem.ID,
    processErrorsOnApiResponse, propertiesRef.current, propertiesObjectRef.current, quantity, product.Type])

  const checkStoreDetails = (_properties, _updatedPropertiesObject) => {
    try {
      const _storePropIds = {
        fulfillmentmethod: getPropertyId("Fulfillmentmethod_", false, _properties),
        delivMethodPropsId: getPropertyId("Deliverymethod_", false, _properties),
        pickupDateTime: getPropertyId("PickupDateTime_", false, _properties),
        pickupStore: getPropertyId("PickupStore_", false, _properties),
        storeAddress: getPropertyId("StoreAddress_", false, _properties)
      };
      const _storePropValue = {
        fulfillmentmethod: _storePropIds.fulfillmentmethod && _updatedPropertiesObject && _updatedPropertiesObject.formData && _updatedPropertiesObject.formData[_storePropIds.fulfillmentmethod],
        deliveryMethodValue: _storePropIds.delivMethodPropsId && _updatedPropertiesObject && _updatedPropertiesObject.formData && _updatedPropertiesObject.formData[_storePropIds.delivMethodPropsId],
        pickupDateTime: _updatedPropertiesObject && _updatedPropertiesObject.formData && _updatedPropertiesObject.formData[_storePropIds.pickupDateTime],
        pickupStore: _updatedPropertiesObject && _updatedPropertiesObject.formData && _updatedPropertiesObject.formData[_storePropIds.pickupStore],
        storeAddress: _updatedPropertiesObject && _updatedPropertiesObject.formData && _updatedPropertiesObject.formData[_storePropIds.storeAddress]
      }
      const storeMissingDiv = document.getElementById('div-store-missing');
      const storeDetailsDiv = document.getElementById('div-store-details');

      let zipCode = '';
      JSON.parse(sessionStorage.getItem('userInfo')).CustomProperties.forEach(customProperty => {
        if (customProperty.Name === 'Shipping Zip Code') {
          zipCode = customProperty.Value.substring(0, 5);
        }
      });
      const isZipPresent = zipCode && zipCode.length > 0;
      if ((_storePropValue.fulfillmentmethod === "Pickup" ||
        _storePropValue.deliveryMethodValue === "sameDayPickup" ||
        _storePropValue.deliveryMethodValue === "nextDayPickup"
      ) && !isZipPresent &&
        (_storePropValue.pickupDateTime === "NONE" ||
          _storePropValue.pickupStore === "NONE")) {
        setDisableATCForStore(true);
        if (storeMissingDiv && storeMissingDiv.style) {
          storeMissingDiv.style.display = 'block';
        }
        if (storeDetailsDiv && storeDetailsDiv.style) {
          storeDetailsDiv.style.display = 'none';
        }
      } else {
        setDisableATCForStore(false);
        if (storeMissingDiv && storeMissingDiv.style) {
          storeMissingDiv.style.display = 'none';
        }
        if (storeDetailsDiv && storeDetailsDiv.style) {
          storeDetailsDiv.style.display = 'block';
        }
      }
    } catch (e) {
      console.log("ERROR Check Store Error:", e)
      setDisableATCForStore(false);
    }
  }

  const disableSameDayDelivery = (p2sStateValue) => {
    try {
      let store = sessionStorage.getItem("pickupStoreDetails");
      store = JSON.parse(store);
      if (!store) {
        return false;
      }
      const gmtOffset = store && store.gmtOffset;

      var d = new Date();
      var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
      var convertedDate = new Date(utc + (3600000 * gmtOffset));
      const hours = convertedDate.getHours();
      const isAfterNoon = hours >= 12;
      if (p2sStateValue && p2sStateValue == 'express' && isAfterNoon) {
        return true;
      }
    } catch (e) {
      //fail silently
    }
    return false;
  }

  const checkAndDisableStorePickup = useMemo((_isSstkProduct, _properties) => debounce((_isSstkProduct, _properties) => {
    try {
      // if (!_isSstkProduct) {
      const p2sState = getPropertyId("p2sState_");
      const p2sStateValue = _properties && _properties.formData && _properties.formData[p2sState];

      const disableSameDayDeliveryOption = disableSameDayDelivery(p2sStateValue);
      const delivMethodPropsId = getPropertyId("Deliverymethod_");
      const pickUpDateTimePropsId = getPropertyId("PickupDateTime_");

      if (delivMethodPropsId) {
        const delivMethodDiv = document.getElementById(delivMethodPropsId);
        const galleryItems = delivMethodDiv ? delivMethodDiv.getElementsByClassName("gallery-item") : [];
        let sameDayEle, nextDayEle;
        for (const item of galleryItems) {
          if (item.getAttribute("data-value") === "sameDayPickup") {
            sameDayEle = item;
          } else if (item.getAttribute("data-value") === "nextDayPickup") {
            nextDayEle = item;
          }
        }

        const deliveryMethodValue = _properties && _properties.formData && _properties.formData[delivMethodPropsId];
        const pickUpDateTimeValue = _properties && _properties.formData && _properties.formData[pickUpDateTimePropsId];

        let updateToNextDay = false;
        if (p2sStateValue && p2sStateValue.toLowerCase() === "express") {
          if (disableSameDayDeliveryOption) {
            disableTile(sameDayEle);
            if (deliveryMethodValue == 'sameDayPickup') {
              formValueChangeHandler(delivMethodPropsId, 'nextDayPickup')
              updateToNextDay = true;
            } else {
              window.postMessage({ detail: { fulfillmentMethod: 'ShipToCustomer', reload: true } }, '*');
            }
          } else {
            enableTile(sameDayEle);
          }
          enableTile(nextDayEle);
        } else if (p2sStateValue && p2sStateValue.toLowerCase() === "enabled") {
          disableTile(sameDayEle);
          enableTile(nextDayEle);
          if (deliveryMethodValue == 'sameDayPickup') {
            formValueChangeHandler(delivMethodPropsId, 'nextDayPickup')
            updateToNextDay = true;
          } else {
            window.postMessage({ detail: { fulfillmentMethod: 'ShipToCustomer', reload: true } }, '*');
          }
        } else if (p2sStateValue && p2sStateValue.toLowerCase() === "disabled") {
          disableTile(sameDayEle);
          disableTile(nextDayEle);
          if (deliveryMethodValue == 'sameDayPickup' || deliveryMethodValue == 'nextDayPickup') {
            formValueChangeHandler(delivMethodPropsId, 'delivery');
            window.postMessage({ detail: { fulfillmentMethod: 'ShipToCustomer', reload: true } }, '*');
          }
        }

        let store = sessionStorage.getItem("pickupStoreDetails");
        store = JSON.parse(store);
        if (store) {
          let storeDateTime = calcDateTime_(store.gmtOffset ? store.gmtOffset : '0')
          if (updateToNextDay) {
            if (storeDateTime) {
              storeDateTime.setDate(storeDateTime.getDate() + 1);
              let pickupDateUTC = getPickUpDateUTC_(store.workingHours, storeDateTime, store.gmtOffset ? store.gmtOffset : '0');
              if (pickupDateUTC != pickUpDateTimeValue) {
                formValueChangeHandler(pickUpDateTimePropsId, pickupDateUTC);
              }
            }
          } else if (deliveryMethodValue == 'nextDayPickup') {
            if (storeDateTime) {
              storeDateTime.setDate(storeDateTime.getDate() + 1);
              let pickupDateUTC = getPickUpDateUTC_(store.workingHours, storeDateTime, store.gmtOffset ? store.gmtOffset : '0');
              if (pickupDateUTC != pickUpDateTimeValue) {
                formValueChangeHandler(pickUpDateTimePropsId, pickupDateUTC);
              }
            }
          } else if (deliveryMethodValue == 'sameDayPickup') {
            if (storeDateTime) {
              let pickupDateUTC = getPickUpDateUTC_(store.workingHours, storeDateTime, store.gmtOffset ? store.gmtOffset : '0');
              if (pickupDateUTC != pickUpDateTimeValue) {
                formValueChangeHandler(pickUpDateTimePropsId, pickupDateUTC);
              }
            }
          }
        }

      } else {
        const fulFillPropsId = getPropertyId("Fulfillmentmethod_");
        const fulfillmentMethodDiv = document.getElementById(fulFillPropsId);
        const galleryItems = fulfillmentMethodDiv ? fulfillmentMethodDiv.getElementsByClassName("gallery-item") : [];
        let pickupElement;
        for (const item of galleryItems) {
          if (item.getAttribute("data-value") === "Pickup") {
            pickupElement = item;
            break;
          }
        }

        if (pickupElement && p2sStateValue && p2sStateValue.toLowerCase() === "disabled") {
          disableTile(pickupElement);
          window.postMessage({ detail: { fulfillmentMethod: 'ShipToCustomer', reload: true } }, '*');
        } else if (pickupElement && p2sStateValue && p2sStateValue.toLowerCase() !== "disabled") {
          enableTile(pickupElement)
        }
      }
      // }
    } catch (e) {
      //fail silently
      console.log("Error updating store details or property change: ", e)
    }

  }, 1500), []);

  const disableTile = (ele) => {
    try {
      ele.classList.add('galleryItem_disabled');
      ele.style.background = "linear-gradient(to left top, transparent 47.75%, rgb(236, 236, 236) 49.5%, rgb(236, 236, 236) 50.5%, transparent 52.25%)";
      ele.style.pointerEvents = "none";
      ele.style.cursor = "auto";
      ele.style.backgroundColor = "rgb(243, 243, 243)";
    } catch (e) {
      // fail silently
      console.log("Error Disabling Tile ", e)
    }
  }

  const enableTile = (ele) => {
    try {
      ele.classList.remove('galleryItem_disabled');
      ele.style.background = "transparent";
      ele.style.pointerEvents = "auto";
      ele.style.cursor = "pointer";
      ele.style.backgroundColor = "transparent";
    } catch (e) {
      // fail silently
      console.log("Error Disabling Tile ", e)
    }
  }

  const createPreview = useCallback(async (propsFromApiToPropsObject, orderItemId = null, propertiesFromApi = null) => {
    let loadingTimeout = null
    setDisabledRefreshPreviewButton(() => true)
    const propsForProof = preparingFormDataToSendToServer(Object.values(propsFromApiToPropsObject).reduce((r, p) => ({
      ...r,
      [p.id]: p.value
    }), {}), propertiesFromApi || properties)
    fastProofService.onError = () => {
      setDisabledRefreshPreviewButton(() => false)
      fastProofService.breakCurrentLoop()
      setPoofPreviewError(true)
      loadingTimeout && clearTimeout(loadingTimeout)
      setShowLoaderDots(false)
    }

    fastProofService.onProof = async (proof) => {
      setDisabledRefreshPreviewButton(() => false)
      const fileNames = proof.Items.map((p) => ({ Url: p.Url.replace(/.*?fileName=(.*)$/, '$1') }))
      let proofedDownloaded = []
      let hadError = false
      let firstProof = true
      for (const file of fileNames) {
        const fileBlob = await UStoreProvider.api.products.downloadProofPreview(orderItem.ID || orderItemId, proof.PreviewID, file.Url)
        if (fileBlob) {
          if (firstProof) {
            window['proofPreview'] = window['proofPreview'] || {}
            window['proofPreview'][orderItem.ID || orderItemId] = window['proofPreview'][orderItem.ID || orderItemId] || []
            window['proofPreview'][orderItem.ID || orderItemId].push(fileBlob)
            firstProof = false
          }
          proofedDownloaded = [...proofedDownloaded, {
            Url: URL.createObjectURL(fileBlob),
            DisplayName: t('DynamicProof.Page', { pageNumber: proofedDownloaded.length + 1 }),
            type: proof.Format === 1 ? 'image' : 'pdf'
          }]
        } else {
          hadError = true
        }
      }
      if (!hadError) {
        setProductThumbnails({ Thumbnails: proofedDownloaded })
      }
      loadingTimeout && clearTimeout(loadingTimeout)
      setShowLoaderDots(false)
      setPoofPreviewError(hadError)
    }
    if (showRefreshPreview || searchParams.has('OrderItemId')) {
      setShowLoaderDots(true)
    }
    setPoofPreviewError(false)
    fastProofService.push([orderItem.ID || orderItemId, propsForProof])
    loadingTimeout = setTimeout(() => {
      setShowLoaderDots(true)
    }, 2000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderItem.ID, properties])

  const handleFormChange = useCallback(async (
    propertyId = null,
    propertyValue = undefined,
    propertyErrors = null,
    formChanges = {},
    skipValidation
  ) => {
    if (excelPricingEnabled) {
      setPriceError(null)
    } else {
      if (Object.values(propertiesObject).some((property) => property.custom.affectPrice && property.id === propertyId)) {
        setPriceError(null)
      } else {
        setPriceError(priceError === 'can not recalculate' && popperError ? 'can not recalculate' : null)
      }
    }
    resetPopperError()
    const updatedPropertiesSchema = propertiesRef.current
    if (Object.keys(formChanges).length) {
      updatedPropertiesSchema.formData = {
        ...propertiesRef.current.formData,
        ...formChanges
      }
    } else {
      updatedPropertiesSchema.formData = {
        ...propertiesRef.current.formData,
        [propertyId]: propertyValue
      }
    }

    const updatedErrors = processErrorsOnFormChange(
      Object.keys(formChanges).length ? Object.keys(formChanges) : propertyId,
      propertyErrors,
      updatedPropertiesSchema,
      propertyValue
    )

    const updatedFormData = {
      ...propertiesRef.current,
      formData: updatedPropertiesSchema.formData
    }

    const propsFromApiToPropsObject = convertPropertiesFromApiToPropertiesObject(
      updatedFormData,
      getDependenciesObject(updatedFormData, excelPricingEnabledRef.current) ? getDependenciesObject(updatedFormData, excelPricingEnabledRef.current).dependenciesObject : null
    )

    const propAffectProof = formChanges && !propertyId ?
      Object.entries(formChanges).reduce((r, [key, value]) => r || updatedFormData.JSONSchema.definitions[key]?.custom?.affectProof) :
      updatedFormData.JSONSchema.definitions[propertyId]?.custom?.affectProof

    if (propAffectProof && product.Type === productTypes.DYNAMIC && !showRefreshPreview && (formChanges || propertyErrors[propertyId]?.length === 0)) {
      await createPreview(propsFromApiToPropsObject)
    }

    // Set temporal local state
    setPropertiesObject(propsFromApiToPropsObject)
    setProperties({
      ...propertiesRef.current,
      formData: updatedPropertiesSchema.formData
    })

    if (!quantityErrorRef.current) {
      // Check if there are validation errors on changed property
      if (!skipValidation && ((!Object.keys(formChanges).length && updatedErrors[propertyId] && updatedErrors[propertyId].errors.length) ||
        (Object.keys(formChanges).length && checkIfThereArePropertyErrors(updatedErrors)))
      ) {
        // Errors already shown as part of errors processing - processErrorsOnFormChange
        setPageState(State.initial)
      } else if (checkIfThereArePropertyErrors(updatedErrors)) {
        if (excelPricingEnabledRef.current) {
          await updateProperties(
            Object.keys(formChanges).length ? Object.keys(formChanges) : [propertyId],
            updatedPropertiesSchema,
            null,
            true,
            updatedErrors
          )
          setPageState(State.initial)
        } else if (!excelPricingEnabledRef.current && checkIfThereAreVisiblePropertyErrors(updatedErrors)) {
          await updateProperties(
            Object.keys(formChanges).length ? Object.keys(formChanges) : [propertyId],
            updatedPropertiesSchema,
            null,
            false,
            updatedErrors
          )
          setPageState(State.initial)
        } else if (!excelPricingEnabledRef.current && !checkIfThereAreVisiblePropertyErrors(updatedErrors)) {
          await updateProperties(
            Object.keys(formChanges).length ? Object.keys(formChanges) : [propertyId],
            updatedPropertiesSchema,
            null,
            false,
            updatedErrors
          )
          if (checkIsPriceAffectedWithErrors(propertiesObject, updatedErrors)) {
            setPageState(State.initial)
            if (Object.values(propertiesObject).some((property) => property.custom.affectPrice && property.id === propertyId)) {
              setPriceError('can not recalculate')
              setPostLoadingProcedures(true)
            }
          } else {
            await updateProperties(
              Object.keys(formChanges).length ? Object.keys(formChanges) : [propertyId],
              updatedPropertiesSchema,
              null,
              true,
              updatedErrors
            )
            setPageState(State.initial)
          }
        }
      } else {
        await updateProperties(
          Object.keys(formChanges).length ? Object.keys(formChanges) : [propertyId],
          updatedPropertiesSchema,
          null,
          true,
          updatedErrors
        )
        setPageState(State.initial)
      }
    }
    if (quantityError === 'invalid' && product.Type === productTypes.DYNAMIC) {
      setPageState(State.initial)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkIfThereArePropertyErrors, checkIfThereAreVisiblePropertyErrors, excelPricingEnabled, product.Type,
    processErrorsOnFormChange, properties, quantityError, updateProperties, createPreview, showRefreshPreview])

  const loadProductData = async () => {
    if (product.ID) {
      setPageState(State.loading)
      const productFromApi = await UStoreProvider.api.products.getProductByID(product.ID)
      setProduct(productFromApi)
      const fastPreviewEnabled = !productFromApi?.Configuration?.Proof?.FastPreviewEnabled && productFromApi.Type === productTypes.DYNAMIC
      setShowRefreshPreview(fastPreviewEnabled)
      const productThumbnailsFromApi = await UStoreProvider.api.products.getProductThumbnails(productFromApi.ID)
      setProductThumbnails(productThumbnailsFromApi)
      let orderItemFromApi
      if (searchParams.get('OrderItemId')) orderItemFromApi = await UStoreProvider.api.orders.getOrderItem(searchParams.get('OrderItemId'))
      else orderItemFromApi = await UStoreProvider.api.orders.addOrderItem(productFromApi.ID)
      setOrderItem(orderItemFromApi)
      setQuantity(orderItemFromApi.Quantity)
      setDeliveryMethod(orderItemFromApi.DeliveryMethod)
      setDeliveryService(orderItemFromApi.DeliveryServiceID)
      const lastOrderFromApi = await UStoreProvider.api.orders.getLastOrder(productFromApi.ID) // null
      await loadProductDeliveries(productFromApi, orderItemFromApi.ID)
      loadProductProofUrl(productFromApi, orderItemFromApi.ID)
      await loadProductProperties(orderItemFromApi, orderItemFromApi.Quantity, productFromApi, fastPreviewEnabled)
      UStoreProvider.state.customState.setBulk({
        currentProductThumbnails: productThumbnailsFromApi,
        currentOrderItem: orderItemFromApi,
        lastOrder: lastOrderFromApi,
        currentProduct: productFromApi
      })
      setPageState(State.initial)
    }
  }

  const setTabClickHandler = (value) => {
    if (value === 'addTabs') {
      tabClickHandler("openTabDrawer");
    }
    if (value === 'NONE' && propertiesRef.current
      && propertiesRef.current.formData
      && propertiesRef.current.formData[sstkPropertiesRef.current["tabData"]] !== "{}") {
      tabClickHandler("openNoTabConfirmationModal");
    }
  }

  const onFormChange = useCallback((...args) => {
    const [propertyId, propertyValue, ...rest] = [...args]
    if (propertyId && propertyId.startsWith('Tabs')) {
      setTabClickHandler(propertyValue);
    }
    setPageState(State.loading)
    handleFormChange(...args)
  }, [handleFormChange])

  const loadProductDataCallbackRef = useRef(loadProductData)
  useEffect(() => {
    loadProductDataCallbackRef.current = loadProductData
  })

  const getTpvPropsKey = (name) => {
    return tpvAttributesRef.current && tpvAttributesRef.current.hasOwnProperty(name)
  }

  const getTpvPropsValue = (name) => {
    if (getTpvPropsKey(name))
      return tpvAttributesRef.current[name];
    return null;
  }

  const setTpvPropsValue = async (updatedObj) => {
    let _tpvProps = (propertiesObjectRef.current && propertiesObjectRef.current[sstkPropertiesRef.current['tpvProps']]) ? JSON.parse(propertiesObjectRef.current[sstkPropertiesRef.current['tpvProps']].value) : {};
    _tpvProps = Object.assign(_tpvProps, updatedObj);
    await formValueChangeHandler(sstkPropertiesRef.current['tpvProps'], JSON.stringify(_tpvProps))
  }

  const openSstkModal = () => {
    setOpenSstkEditorModal(true);
  }

  const sstkProjectId = getTpvPropsValue('sstkProjectID')
  const fileAttachPropValue = properties && properties.formData && properties.formData[sstkProperties["fileAttach"]]

  const actualBeforeUnloadHandler = (e, customArg) => {
    console.log('Custom Argument:', customArg);
    if (customArg == 'Add') {
      e.preventDefault();
      e.returnValue = ''; // Required for Chrome
    }
    else {
      return
    }
  };

  const addEventListenerWrapper = () => {
    const customArg = 'Add';
    beforeUnloadHandler.current = (e) => actualBeforeUnloadHandler(e, customArg);
    window.addEventListener('beforeunload', beforeUnloadHandler.current);
    console.log('beforeunload event listener added with custom argument:', customArg);
  };

  const removeEventListenerWrapper = () => {
    window.removeEventListener('beforeunload', beforeUnloadHandler.current);
  };


  useEffect(() => {
    const loadProductDataCallback = e => loadProductDataCallbackRef.current(e)

    const onResize = (event) => {
      setIsMobile(document.body.clientWidth < parseInt(theme.md.replace('px', '')))
    }

    addEventListenerWrapper()
    window.addEventListener('unload', cleanCustomState, true)
    window.addEventListener('resize', onResize, true)
    // stickyConnect()
    onResize()
    disableEnableScroll(true)
    window.addEventListener('assetDetails', getAssetDetails, true)
    window.addEventListener('uploadFileDetails', getUploadFileDetails, true)
    window.addEventListener('sendATCDisableRequest', enableDisableATC, true)
    window.addEventListener('sendATCEnableRequest', enableDisableATC, true)
    window.addEventListener('tabDataDetails', getTabDataDetails, true)
    window.addEventListener('resetTabDataDetails', getResetTabDataDetails, true)
    loadProductDataCallback()

    try {
      const whiteLabel = getWhiteLabel();
      if (whiteLabel) {
        const type = whiteLabel && whiteLabel.split("=").at(1);
        if (type === 'SWS') {
          setSupportEmail('CSR@southwestschool.com')
        } else if (type === 'HIT') {
          setSupportEmail('customerservice@hitouchbusinessservices.com')
        } else {
          setSupportEmail('support@staplesadvantage.com')
        }
      }
    } catch (e) {
      //fail silently
    }

    return () => {
      stickyDisconnect()
      cleanCustomState()
      window.removeEventListener('beforeunload', cleanCustomState, true)
      window.removeEventListener('assetDetails', getAssetDetails, true)
      window.removeEventListener('uploadFileDetails', getUploadFileDetails, true)
      window.removeEventListener('sendATCDisableRequest', enableDisableATC, true)
      window.removeEventListener('sendATCEnableRequest', enableDisableATC, true)
      window.removeEventListener('tabDataDetails', getTabDataDetails, true)
      window.removeEventListener('resetTabDataDetails', getResetTabDataDetails, true)
      fastProofService.breakCurrentLoop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setExcelPricingEnabled(product
      .Attributes
      .find((attribute) => attribute.Name === 'PartialPriceCalculationEnabled')
      .Value === 'true')
  }, [product])

  useEffect(() => {
    const demiState = { ...properties.formData }

    window.triggerFormPropertyChange = (propertyId, propertyValue) => {
      if (propertyValue && propertyValue.includes && propertyValue.includes('__GENERIC_HTML_ACCUMULATOR_VALUE__')) {
        const formValues = JSON.parse(propertyValue)['__GENERIC_HTML_ACCUMULATOR_VALUE__']
        onFormChange(null, null, null, formValues)
      } else {
        if (propertiesObject[propertyId]) demiState[propertyId] = propertyValue
        clearTimeout(htmlDataUpdateTimeout)
        const newHtmlUpdateTimeout = setTimeout(() => {
          onFormChange(null, null, null, demiState)
        }, 500)
        setHtmlDataUpdateTimeout(newHtmlUpdateTimeout)
      }
    }

    let _tpvProps = (propertiesObjectRef.current && propertiesObjectRef.current[sstkPropertiesRef.current['tpvProps']]) ? JSON.parse(propertiesObjectRef.current[sstkPropertiesRef.current['tpvProps']].value) : {};
    let isFilePresent = false
    try {
      let _fileAttach = (propertiesObjectRef.current && propertiesObjectRef.current[sstkPropertiesRef.current['fileAttach']]) ? JSON.parse(propertiesObjectRef.current[sstkPropertiesRef.current['fileAttach']].value)[0] : {};
      if (_fileAttach && _fileAttach.FileName) {
        isFilePresent = true
      }
    }
    catch {
      //fail silently
    }
    if (isFilePresent) {
      hideAddContentProps(propertiesObject)
    }
    setTpvAttributes(_tpvProps);

    checkAndDisableStorePickup(isSstkProduct, properties);
    checkStoreDetails(propertiesObject, properties);
    const _isMemoPadsProduct = checkIsMemoPadsProduct(properties);
    if (_isMemoPadsProduct) {
      updateMemoPadsPageCount(propertiesObject, properties);
    }
    const tabData = (propertiesObjectRef.current && propertiesObjectRef.current[sstkPropertiesRef.current['tabData']]) ? JSON.parse(propertiesObjectRef.current[sstkPropertiesRef.current['tabData']].value) : {};
    setTabSummary(getTabSummary(tabData));
    try {
      const erroProperties = Object.keys(errors);
      const propertiesWithError = erroProperties.filter(properties => properties.indexOf("fileAttach_") < 0 && errors[properties].errors.length > 0);
      setFormErrorsArray(propertiesWithError)
      if (propertiesWithError.length > 0) {
        setErrorNotification(true);
      } else {
        setErrorNotification(false);
      }
    } catch (e) {
      //fail silently
      console.log("Error while fetching error:", e)
    }

    return () => { window.triggerFormPropertyChange = undefined }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties, propertiesObject, errors])

  useEffect(() => {
    if (pageState !== State.loading && pageState !== State.calculatingPrice && postLoadingProcedures) {
      if (!forceAddToCartButtonPopper) {
        if (priceError === 'invalid') {
          setPopperError('GET_PRICE')
        } else if (priceError === 'can not recalculate') {
          setPopperError('PRICE_CAN_NOT_BE_UPDATED')
        } else if (priceError === null) {
          setPopperError(null)
        }
      }
      setPostLoadingProcedures(false)
    }
  }, [
    priceError,
    quantityError,
    pageState,
    excelPricingEnabled,
    postLoadingProcedures,
    forceAddToCartButtonPopper,
    price
  ])

  useEffect(() => {
    if (pageState !== State.loading && pageState !== State.calculatingPrice) setPostLoadingProcedures(true)
    else setPostLoadingProcedures(false)
  }, [pageState])

  useEffect(() => {
    prevBasePreviewRef.current = basePreview
  }, [basePreview])

  const cleanCustomState = () => {
    ['currentProduct',
      'currentOrderItem',
      'currentOrderItemId',
      'currentOrderItemPriceModel',
      'lastOrder',
      'currentProductThumbnails',
      'currentDeliveryServices',
      'CurrentProductDucErrors',
      'ducData',
      'currentProductProperties',
      'isLoadingData'
    ].forEach((property) => {
      UStoreProvider.state.customState.delete(property)
    })
  }

  const setPricingError = (error) => {
    if (error.ErrorCode && error.ErrorCode === 'ExcelCalculation') {
      const updatedPrice = {
        IsMinimumPrice: true,
        MailingFee: 0,
        Price: { Price: -1, Tax: 0 },
        ProductPrice: 0
      }
      setPrice(updatedPrice)
      UStoreProvider.state.customState.set('currentOrderItemPriceModel', updatedPrice)
      setPriceError('invalid')
      setPostLoadingProcedures(true)
    }
  }

  const loadProductDeliveries = async (productFromApi, orderItemId) => {
    if (productFromApi.Configuration.Delivery.Mailing.Enabled) {
      const deliveriesFromApi = await UStoreProvider.api.orders.getDeliveryServices(orderItemId)
      setProductDeliveries(deliveriesFromApi)
      UStoreProvider.state.customState.set('currentProductDeliveries', deliveriesFromApi)
    }
  }

  const checkIsSstkProduct = (propertiesFromApi) => {
    return checkProductModeSstkOrSimplePrint(propertiesFromApi, 'sstk')
  }

  const checkIsMultiFileProduct = (propertiesFromApi) => {
    return checkProductModeSstkOrSimplePrint(propertiesFromApi, 'docsV3')
  }

  const checkIsStaticProduct = (propertiesFromApi) => {
    try {
      const formDataObj = propertiesFromApi ? propertiesFromApi.formData : properties && properties.formData && properties.formData
      const productMode = Object.keys(formDataObj).find(formProps => formProps.startsWith('product-mode'))
      if (productMode) {
        return false
      } else {
        return true
      }
    } catch (e) {
      return false
    }
  }

  const checkIsNewSimplePrintProduct = (propertiesFromApi) => {
    return (checkProductModeSstkOrSimplePrint(propertiesFromApi, 'docsV2') || checkProductModeSstkOrSimplePrint(propertiesFromApi, 'docsV3') || checkProductModeSstkOrSimplePrint(propertiesFromApi, 'docs'))
  }

  const checkIsBookletProduct = (propertiesFromApi) => {
    try {
      const bookletKeyVal = getPropertyId('Bookletfinishing', false)
      const booklet = propertiesFromApi ? propertiesFromApi.formData && propertiesFromApi.formData[bookletKeyVal] : propertiesRef.current && propertiesRef.current.formData && propertiesRef.current.formData[bookletKeyVal]
      if (BOOKLET_FINISHING.includes(booklet)) {
        return true
      }
      return false
    } catch (e) {
      return false
    }
  }

  const loadProductProperties = async (updatedOrderItem, initialQuantity, product, fastPreviewEnabled) => {
    try {
      const propertiesFromApi = await UStoreProvider.api.orders.getProperties(updatedOrderItem.ID)
      const updatedPropertiesObject = convertPropertiesFromApiToPropertiesObject(
        propertiesFromApi,
        getDependenciesObject(propertiesFromApi, excelPricingEnabled) ? getDependenciesObject(propertiesFromApi, excelPricingEnabled).dependenciesObject : null
      )

      setProperties(propertiesFromApi)
      setPropertiesObject(updatedPropertiesObject)
      if (product.Type === productTypes.DYNAMIC) {
        if (searchParams.get('OrderItemId')) {
          setTimeout(() => createPreview(updatedPropertiesObject, searchParams.get('OrderItemId'), propertiesFromApi), 0)
        } else if (!fastPreviewEnabled) {
          setTimeout(() => createPreview(updatedPropertiesObject, updatedOrderItem.ID, propertiesFromApi), 0)
        }
      }
      calculateSstkOrSimplePrintProperties(updatedPropertiesObject, propertiesFromApi)
      setIsSstkProduct(checkIsSstkProduct(propertiesFromApi))
      setMultiFileProduct(checkIsMultiFileProduct(propertiesFromApi))
      setIsStaticProduct(checkIsStaticProduct(propertiesFromApi))
      setIsNewSimplePrintProduct(checkIsNewSimplePrintProduct(propertiesFromApi))
      setIsBookletProduct(checkIsBookletProduct(propertiesFromApi))
      setProductMode(checkProductMode(propertiesFromApi))


      UStoreProvider.state.customState.set('currentProductProperties', { ...propertiesFromApi })
      const updatedErrors = await processErrorsOnApiResponse(propertiesFromApi, null)

      if (!checkIfThereAreVisiblePropertyErrors(updatedErrors)) {
        await calculateProperties(initialQuantity, updatedOrderItem, propertiesFromApi, updatedErrors)
      } else {
        setPricingError({
          ErrorCode: 'ExcelCalculation'
        })
      }

      //hide existing file attach container
      try {
        // code to be done over here
        let xmPieSAParameters = CookiesManager.getCookie('xmPieSAParameters')
        try {
          if (xmPieSAParameters) {
            xmPieSAParameters = decodeURIComponent(xmPieSAParameters)
            xmPieSAParameters = JSON.parse(xmPieSAParameters)
          }
          if (xmPieSAParameters && Object.keys(xmPieSAParameters).length != 0) {
            xmPieSAParametersRef.current = xmPieSAParameters;
          }
        } catch (e) {
          console.log("ERROR ", e)
        } finally {
          CookiesManager.deleteCookie('xmPieSAParameters')
        }
        //end

        const _tpvProps = updatedPropertiesObject && updatedPropertiesObject[sstkPropertiesRef.current['tpvProps']] && JSON.parse(updatedPropertiesObject[sstkPropertiesRef.current['tpvProps']].value);

        try {
          if (_tpvProps && _tpvProps.fileList) {
            setFileList([..._tpvProps.fileList]);
          }
        } catch (e) {
          //fail silently
        }

        if (renderNewPreview()) {
          const previousFileName = getPreviousFileName();
          const orderProductId = updatedOrderItem.FriendlyID;
          const tabData = propertiesRef.current && propertiesRef.current.formData && propertiesRef.current.formData[sstkPropertiesRef.current["tabData"]];
          if (tabData && tabData !== "{}" && xmPieSAParameters && xmPieSAParameters.isTPVReOrderMode) {
            const numOfPages = propertiesRef.current && propertiesRef.current.formData && propertiesRef.current.formData[sstkPropertiesRef.current["pageCount"]];
            const _projectName = propertiesRef.current && propertiesRef.current.formData && propertiesRef.current.formData[sstkPropertiesRef.current["sstkProjectName"]];
            let fileName = _projectName
            if (_projectName.toLowerCase().endsWith(".pdf")) {
              fileName = _projectName.substring(0, _projectName.length - 4).concat(".pdf");
            }
            fileName = _projectName.concat(".pdf");
            const message = {
              detail: {
                fileList: [
                  {
                    "name": fileName,
                    "page": numOfPages,
                    "pageSize": null,
                    "savedTemplateID": null,
                    "size": null
                  },
                ]
              }
            }
            await getUploadFileDetails(message);
          } else if (orderProductId && previousFileName) {
            const _previousFileName = getTpvPropsValue('fileName') ? getTpvPropsValue('fileName') : previousFileName
            setFileName(_previousFileName)
            const savedTemplateID = propertiesRef.current && propertiesRef.current.formData && propertiesRef.current.formData[sstkPropertiesRef.current["savedTemplateID"]];
            setValueForShowReplaceFileLink(savedTemplateID);
            await previousUploadedFileHandler(orderProductId)
          }

          if (xmPieSAParameters && xmPieSAParameters.mediaId) {
            if (!isMultiFileProductRef.current) {
              const assetInfo = {
                detail: {
                  assetURL: xmPieSAParameters.assetURL,
                  fileName: xmPieSAParameters.fileName,
                  assetId: xmPieSAParameters.mediaId,
                  savedTemplateID: xmPieSAParameters.savedTemplateID
                }
              }
              await getAssetDetails(assetInfo)
            }
            hideSelectFileHtmlProps(updatedPropertiesObject);

            if (xmPieSAParameters && xmPieSAParameters.accountAndUserId) {
              const accountNumberUserID = xmPieSAParameters.accountAndUserId.split("|");
              _tpvProps['accountNumber'] = accountNumberUserID[0];
              if (xmPieSAParameters.is3PPUser) {
                _tpvProps['userId'] = '3PP_ANONYMOUS_USERS';
              } else {
                _tpvProps['userId'] = accountNumberUserID[1];
              }
              await formValueChangeHandler(sstkPropertiesRef.current['tpvProps'], JSON.stringify(_tpvProps))
            }

            if (isMultiFileProductRef.current) {
              const file_name_extn = xmPieSAParameters?.fileName?.split('.').pop();
              if (file_name_extn.toLowerCase() !== 'pdf' && file_name_extn.toLowerCase() !== 'png' && file_name_extn.toLowerCase() !== 'jpg' && file_name_extn.toLowerCase() !== 'jpeg') {
                console.warn("Unsupported file extension, fileName - " + xmPieSAParameters?.fileName)
                childRef.current && childRef.current._setShowLoader(false)
                childRef.current && childRef.current._setFileExtension(file_name_extn)
                childRef.current && childRef.current._setIsUnsupported(true)
                return;
              }
              const _response = await fetch(`${xmPieSAParametersRef.current && xmPieSAParametersRef.current.parentUrl}/tpv/session/api/tpvProxy/azure/upload?assetId=${xmPieSAParameters.mediaId}&opId=${updatedOrderItem.FriendlyID}&fileName=${xmPieSAParameters.fileName}`,
                {
                  method: 'POST',
                  body: document,
                  credentials: 'include',
                  headers: {
                    'Content-Type': 'application/octet-stream'
                  }
                }).then(resp => resp.json());
              const _totalPage = _response.totalPage;
              const event = { detail: { fileList: [{ name: xmPieSAParameters.fileName, page: _totalPage, size: xmPieSAParameters.size, pageSize: xmPieSAParameters.pageSize, savedTemplateID: xmPieSAParameters.savedTemplateID }] } };
              getUploadFileDetails(event);
            }
            return;
          }

          hideSelectFileHtmlProps(updatedPropertiesObject);

          var obj = {};
          if (isMultiFileProductRef.current) {
            obj = {
              isMultiFile: true,
              orderProductId: updatedOrderItem.FriendlyID
            }
          }
          const isAddContentProperty = getPropertyId('Addcontent_')
          const productModeKeys = Object.keys(propertiesRef?.current?.formData).filter(key => key.includes('product-mode'));
          const currentProductHasSSTK = propertiesRef?.current?.JSONSchema?.properties[productModeKeys]?.enum.includes('sstk') || false;

          if (xmPieSAParameters && !xmPieSAParameters.isEditOrReOrderMode && !isAddContentProperty && !currentProductHasSSTK) {
            if (window && window.parent !== window) {
              window.parent.postMessage({
                xmPieOpenDrawerRequest: {
                  detail: {
                    showMyFilesModal: true,
                    landingPage: 'XMPIE_SIMPLE_PRINT',
                    productId: getProductID(),
                    ...obj
                  }
                }
              }, "*");
            }
          }
        }
        if (xmPieSAParameters && xmPieSAParameters.accountAndUserId) {
          const accountNumberUserID = xmPieSAParameters.accountAndUserId.split("|");
          const is3PPUser = xmPieSAParameters.is3PPUser;
          const _tpvProps = updatedPropertiesObject && updatedPropertiesObject[sstkPropertiesRef.current['tpvProps']] && JSON.parse(updatedPropertiesObject[sstkPropertiesRef.current['tpvProps']].value);
          _tpvProps['accountNumber'] = accountNumberUserID[0];
          if (is3PPUser) {
            _tpvProps['userId'] = '3PP_ANONYMOUS_USERS';
          } else {
            _tpvProps['userId'] = accountNumberUserID[1];
          }
          await formValueChangeHandler(sstkPropertiesRef.current['tpvProps'], JSON.stringify(_tpvProps))
        }

        try {
          const altProductId = getPropertyId("altProductURL_")
          if (altProductId) {
            setIsAltProduct(updatedPropertiesObject && updatedPropertiesObject[altProductId] && updatedPropertiesObject[altProductId].value)
          }



          if (xmPieSAParameters && xmPieSAParameters.isWebGLEnabled == false) {

            setWebGlEnabled(false)
            const addContentPropsId = getPropertyId("Addcontent_");
            const addContentMethodDiv = document.getElementById(addContentPropsId);
            const galleryItems = addContentMethodDiv ? addContentMethodDiv.getElementsByClassName("gallery-item") : [];
            let sstkElement;
            for (const item of galleryItems) {
              if (item.getAttribute("data-value") === "sstk") {
                sstkElement = item;
                break;
              }
            }
            disableTile(sstkElement);

            const sstkContentElement = sstkElement.querySelector('.content')
            const sstkDescriptionElement = sstkContentElement && sstkContentElement.querySelector('.description')
            if (sstkDescriptionElement) {
              sstkDescriptionElement.textContent = "Your browser does not support this feature"
            }
          }
        } catch {
          //fail silently
        }



        const whiteLabel = getWhiteLabel();
        if (whiteLabel) {
          const type = whiteLabel && whiteLabel.split("=").at(1);
          if (type === 'SWS' || type === 'HIT') {
            await formValueChangeHandler(sstkPropertiesRef.current['whiteLabel'], 'White Label Packaging')
          }
        }
      } catch (e) {
        //fail silently
      }
    } catch (e) {
      console.error(e)
      // Excel template V15.0 error
      setPricingError(e)
    }
  }

  const hideSelectFileHtmlProps = (_updatedPropertiesObject) => {
    try {
      const fileId = getPropertyId("Selectyourfile_", false, _updatedPropertiesObject);
      //Hide fileAttach container from UI as per business to hide fileAttach option from end user.
      const element = document.getElementById(fileId);
      if (element) {
        element.style.display = 'none';
      }
    } catch (e) {
      // fail silently
    }
  }

  const hideAddContentProps = (_updatedPropertiesObject) => {
    try {
      const fileId = getPropertyId("Addcontent_", false, _updatedPropertiesObject);
      const element = document.getElementById(fileId);
      if (element) {
        element.style.display = 'none';
      }
    } catch (e) {
      // fail silently
    }
  }

  const getPreviousFileName = () => {
    const propertyId = Object.keys(propertiesObjectRef.current).find(formProps => formProps.startsWith('fileAttach_'))
    const propertyValue = propertyId && propertiesObjectRef.current[propertyId].value
    if (propertyValue) {
      const isValidJson = isJsonString(propertyValue)
      let propertyValueObj = {}
      if (isValidJson) {
        propertyValueObj = JSON.parse(propertyValue)
      } else {
        propertyValueObj = propertyValue
      }
      return propertyValueObj && propertyValueObj[0] && propertyValueObj[0].FileName
    }
  }

  const loadProductProofUrl = (productFromApi, orderItemId) => {
    setProofUrl(productFromApi.Proof ? `${productFromApi.Proof.Url}&OrderItemID=${orderItemId}` : null)
  }

  const downloadProofLinkHandler = async () => {
    try {
      setMessageType("PROOF_DOWNLOAD_IN_PROGRESS");
      return await downloadSimplePrintProof(proofPropertiesValueRef.current);
    } catch (e) {
      console.log("Error occurred during download proof: ", e)
      return null;
    } finally {
      setMessageType(null);
    }
  }

  const reRouteToCart = (storeType, cartUrl) => {
    if (storeType === 3 && cartUrl) {
      const decoded = decodeURIComponent(cartUrl)
      window.location.href = `${decoded}${decoded.includes('?') ? '&' : '?'}OrderProductId=${orderItem.FriendlyID}`
    } else {
      navigate(urlGenerator.get({ page: 'cart' }))
    }
  }

  const reRouteToNewOrder = (productId, productName, newOrderId) => {
    setSearchParams({ OrderItemId: newOrderId, reorder: true })
    navigate(0)
  }

  const handleQuantityChange = async (newQuantity, error) => {
    try {
      if (error) {
        setQuantityError('invalid')
        if (newQuantity === '') setQuantity('')
        return
      } else {
        setQuantityError(null)
      }

      if (checkIfThereArePropertyErrors() && !excelPricingEnabled) {
        if (checkIfThereAreVisiblePropertyErrors()) {
          return
        } else {
          const propertiesCanAffectPrice = Object.values(propertiesObject).filter((property) => property.custom.affectPrice)
          const isPriceAffectedWithErrors = propertiesCanAffectPrice.some((property) => errors[property.id].errors.length)
          if (isPriceAffectedWithErrors) {
            setPriceError('can not recalculate')
            setPostLoadingProcedures(true)
            return
          }
        }
      }

      if (pageState !== State.loading) {
        await updateProperties(['quantity'], null, newQuantity)
        setPageState(State.initial)
        setPopperError(null)
      }
    } catch (e) {
      setPageState(State.initial)
      console.error(e)
      setPricingError(e)
    } finally {
      setQuantity(newQuantity)
      if (!isNaN(parseInt(newQuantity))) {
        setOrderItem({
          ...orderItem,
          Quantity: newQuantity
        })
      }
    }
  }

  const setTabMetadata = async (tabData) => {
    const numOfPages = propertiesRef.current && propertiesRef.current.formData && propertiesRef.current.formData[sstkPropertiesRef.current["pageCount"]];
    const sides = propertiesRef.current && propertiesRef.current.formData && propertiesRef.current.formData[sstkPropertiesRef.current["sides"]];
    const _tpvProps = (propertiesObjectRef.current && propertiesObjectRef.current[sstkPropertiesRef.current['tpvProps']]) ? JSON.parse(propertiesObjectRef.current[sstkPropertiesRef.current['tpvProps']].value) : {};
    _tpvProps['tabMetaData'] = getTabMetadata(numOfPages, sides, tabData);
    await formValueChangeHandler(sstkPropertiesRef.current['tpvProps'], JSON.stringify(_tpvProps));
  }

  const addToCartOrSave = async (skipPropertiesPush = false) => {
    // If product is out of stock - save it for later
    if (renderNewPreview() && getIsEditOrReOrderMode() && documentData && documentData.isFileAdded) {
      await deletePreviousPdfFromFileAttachProp();
      await savePdfToProduct(documentData.pdfFileBlob, documentData.numOfPages, documentData.fileName, documentData.file, documentData.assetId, documentData.savedTemplateID);
    }
    const tabData = propertiesRef.current && propertiesRef.current.formData && propertiesRef.current.formData[sstkPropertiesRef.current["tabData"]];
    if (tabData && tabData !== "{}") {
      await setTabMetadata(JSON.parse(tabData));
    }
    const productStockQuantity = product.Inventory && product.Inventory.Quantity
    const minQuantity = product.Configuration &&
      product.Configuration.Quantity &&
      product.Configuration.Quantity.Minimum
      ? product.Configuration.Quantity.Minimum
      : 0
    const allowOutOfStockPurchase = product.Inventory && product.Inventory.AllowOutOfStockPurchase
    if (
      product.Inventory &&
      isOutOfStock(
        productStockQuantity,
        minQuantity,
        allowOutOfStockPurchase
      )
    ) {
      await pushSavedForLater(orderItem.ID)
    } else {
      if (!skipPropertiesPush) {
        if (propertiesRef.current && Object.keys(propertiesRef.current).length) {
          await pushProperties(
            orderItem.ID,
            convertProductPropertiesFormIntoArray(
              propertiesRef.current,
              excelPricingEnabled
            )
          )
        }
        await pushOrderItem(orderItem.ID, {
          ...orderItem,
          Properties: propertiesRef.current && Object.keys(propertiesRef.current).length ? convertProductPropertiesFormIntoArray(
            propertiesRef.current,
            excelPricingEnabled
          ) : null
        })
      }
      await pushCart(orderItem.ID)
    }
    reRouteToCart(StoreType, themeContext.get('cartUrl'))
  }

  const handleAddToCartButtonClick = async () => {
    if (pageState !== State.initial) return
    // Error checking
    const erroProperties = Object.keys(errors);
    const propertiesWithError = erroProperties.filter(properties => properties.indexOf("fileAttach_") < 0 && errors[properties].errors.length > 0);
    setFormErrorsArray(propertiesWithError)
    if (propertiesWithError.length > 0) {
      setErrorNotification(true);
      setTimeout(() => {
        const element = document.getElementById('field-incomplete-failure')
        element.scrollIntoView();
      }, 200);
    }
    if (showTabErrorRef.current) {
      setTimeout(() => {
        const element = document.getElementById('tab-field-incomplete-failure')
        element.scrollIntoView();
      }, 200);
    }
    if (uploadError) {
      setForceAddToCartButtonPopper(true)
      setPopperError('FILE_MUST_BE_UPLOADED')
      setPostLoadingProcedures(true)
      return
    } else if (showTabErrorRef.current) {
      return
    } else if (quantityError) {
      setForceAddToCartButtonPopper(true)
      setPopperError('VALIDATION_ERROR')
      setPostLoadingProcedures(true)
      return
    } else if ((priceError === 'invalid' && !((price.Price && price.Price.Price === -1) || price.IsMinimumPrice)) || excelPricingError) {
      setForceAddToCartButtonPopper(true)
      setPopperError('SOMETHING_WENT_WRONG')
      setPostLoadingProcedures(true)
      return
    } else if (priceError === 'invalid' && ((price.Price && price.Price.Price === -1) || price.IsMinimumPrice)) {
      setForceAddToCartButtonPopper(true)
      setPopperError('GET_PRICE')
      setPostLoadingProcedures(true)
      return
    } else if (checkIfThereArePropertyErrors()) {
      setForceAddToCartButtonPopper(true)
      setPostLoadingProcedures(true)
      showAllErrors()
      if (product.Type === productTypes.DYNAMIC && checkIfThereAreSectionErrors()) {
        const distinctSections = [...new Set(Object.values(propertiesObject).reduce((acc, current) => [...acc, current.uiSchema['ui:options'].section], []))]

        if (distinctSections.length > 1) {
          const sectionsAffectedByErrors = [...new Set(Object.values(errors).reduce((acc, current) => current.show && current.section ? [...acc, current.section] : [...acc], []))].sort((a, b) => distinctSections.indexOf(a) - distinctSections.indexOf(b))
          const sectionsAffectedByErrorsWithIndexes = sectionsAffectedByErrors.map((section) =>
            distinctSections.includes(section) ?
              `${distinctSections.indexOf(section) + 1}. ${section === 'xmpie_product_properties' ? t('xmpie_product_properties') : section}` :
              ''
          )
          // numbers lower than -2 are special values to signal dynamic form to open the first section with errors
          setSectionToOpen(-2 - Date.now())
          setPopperAffectedSections(sectionsAffectedByErrorsWithIndexes)
          setPopperError('SECTION_ERROR')
          return
        }
      }
      setPopperError('VALIDATION_ERROR')
      return
    }
    const updatedProperties = await updateProperties(Object.keys(propertiesObject))
    if (priceError) {
      setForceAddToCartButtonPopper(true)
      setPopperError('SOMETHING_WENT_WRONG')
      setPostLoadingProcedures(true)
      return
    }
    const updatedErrors = await processErrorsOnAddToCart(updatedProperties.updatedPropertiesFromApi)
    if (checkIfThereArePropertyErrors(updatedErrors)) {
      setForceAddToCartButtonPopper(true)
      setPopperError('VALIDATION_ERROR')
      setPostLoadingProcedures(true)
      return
    }
    setPageState(State.loading)
    // If product requires proof approval, open form approval modal and exit
    if (product.Configuration.Proof && product.Configuration.Proof.RequireProofApproval) {
      if (price && price.Price) await calculateProperties(quantity, null, updatedProperties.updatedPropertiesFromApi, updatedErrors)
      setApprovalModalOpen(true)
      setPageState(State.initial)
      return
    }

    await addToCartOrSave()
  }

  const handleDeliveryChange = async (newDeliveryMethod, newDeliveryServiceId) => {
    setDeliveryMethod(newDeliveryMethod)
    setDeliveryService(newDeliveryServiceId)
    const updatedOrderItem = {
      ...orderItem,
      DeliveryMethod: newDeliveryMethod,
      DeliveryServiceID: newDeliveryServiceId
    }
    setOrderItem(updatedOrderItem)
    UStoreProvider.state.customState.set('currentOrderItem', updatedOrderItem)
    if (Object.keys(price).length && price.Price) calculateProperties(quantity, updatedOrderItem)
  }

  const handlePropertyBlur = (propertyId) => {
    const updatedErrors = processErrorsOnFormChange(propertyId, null, properties)
    processErrorsOnApiResponse(
      properties,
      updatedErrors,
      [propertyId]
    )
  }

  const handleReorder = async () => {
    const { lastOrder } = UStoreProvider.state.customState.get()
    setPageState(State.loading)
    const newOrder = await getReorder(lastOrder.OrderItemID)
    reRouteToNewOrder(product.FriendlyID, product.Name, newOrder.ID)
  }

  const getContinueButtonText = (proofModal = false) => {
    if (xmPieSAParametersRef.current && xmPieSAParametersRef.current.isEditCartMode) {
      return 'Save Changes'
    }
    if (
      product.Configuration.Proof &&
      product.Configuration.Proof.RequireProofApproval &&
      !proofModal
    ) return t('product.review_approve')
    if (
      product &&
      product.Inventory &&
      Object.keys(product.Inventory).includes('Quantity') &&
      Object.keys(product.Inventory).includes('AllowOutOfStockPurchase') &&
      isOutOfStock(
        product.Inventory.Quantity,
        product.Configuration.Quantity.Minimum,
        product.Inventory.AllowOutOfStockPurchase
      )
    ) return t('product.save_for_later')
    return t('product.add_to_cart')
  }

  const resetPopperError = () => {
    setPopperError(null)
    setForceAddToCartButtonPopper(false)
  }
  const onProofPreviewClick = async () => !isNewUpload && await createPreview(propertiesObject)

  const calculateSstkOrSimplePrintProperties = (updatedPropertiesObject, propertiesFromApi) => {
    const sstkProps = {
      "documentHeight": getPropertyId("documentheight_", false, updatedPropertiesObject),
      "documentWidth": getPropertyId("documentwidth_", false, updatedPropertiesObject),
      "safetyMargin": getPropertyId("safetyMargin_", false, updatedPropertiesObject),
      "bleedMargin": getPropertyId("bleedMargin_", false, updatedPropertiesObject),
      "documentMaxPages": getPropertyId("documentmaxPages_", false, updatedPropertiesObject),
      "hideCropMarks": getPropertyId("hideCropMarks_", false, updatedPropertiesObject),
      "lockCanvasDimensions": getPropertyId("documentlockCanvasDimensions_", false, updatedPropertiesObject),
      "fileType": getPropertyId("fileType_", false, updatedPropertiesObject),
      "fileAttach": getPropertyId("fileAttach_", false, updatedPropertiesObject),
      "tpvProps": getPropertyId("productAttributes_", false, updatedPropertiesObject),
      "pageCount": getPropertyId("page-count_", false, updatedPropertiesObject),
      "priceTierAndPromo": getPropertyId("priceTierAndPromo", false, updatedPropertiesObject),
      "calculatedDiscount": getPropertyId("calculatedDiscount_", false, updatedPropertiesObject),
      "sstkProjectName": getPropertyId("Projectname_", false, updatedPropertiesObject),
      "whiteLabel": getPropertyId("WhiteLabelPackaging_", false, updatedPropertiesObject),
      "paperSize": getPropertyId("Size_", false, updatedPropertiesObject),
      "sheetsPerPad": getPropertyId("Sheetsperpad_", false, updatedPropertiesObject),
      "savedTemplateID": getPropertyId("savedTemplateID_", false, updatedPropertiesObject),
      "productID": getPropertyId("SKU_", false, updatedPropertiesObject),
      "tabData": getPropertyId("tabData_", false, updatedPropertiesObject),
      "tabs": getPropertyId("Tabs_", false, updatedPropertiesObject),
      "sides": getPropertyId("Sides_", false, updatedPropertiesObject)
    }
    try {

      //Hide fileAttach container from UI as per business to hide fileAttach option from end user.
      const element = document.getElementById(sstkProps.fileAttach);
      if (element) {
        element.style.display = 'none';
      }
      // Removed hiding ProjecT Name as per Business comment - P2PTEAM-18481
      // if (checkIsSstkProduct(propertiesFromApi) || checkIsNewSimplePrintProduct(propertiesFromApi)) {
      //   const projectNameElement = document.getElementById(sstkProps.sstkProjectName)
      //   if (projectNameElement) {
      //     projectNameElement.style.display = 'none';
      //   }
      // }
    } catch (e) {
      //fail silently
    }
    setSstkProperties(sstkProps);
  }

  const getPropertyId = (name, isOnlyId, updatedPropertiesObject) => {

    const _formDataObj = updatedPropertiesObject ? updatedPropertiesObject : propertiesObjectRef.current
    const _propertyId = Object.keys(_formDataObj).find(formProps => formProps.startsWith(name))


    // const _property = product.Configuration && product.Configuration.Properties.find(props => props.Name && props.Name.toLowerCase() == name.toLowerCase())
    console.debug(`Calculating Property for ${name} and Key: ${_propertyId}`)
    if (isOnlyId) {
      return _formDataObj[_propertyId] && _formDataObj[_propertyId].custom && _formDataObj[_propertyId].custom.id
    }
    if (_propertyId) {
      return _propertyId
    } else {
      return null;
    }
  }

  const checkProductModeSstkOrSimplePrint = (_respProps, key) => {
    try {
      const _formDataObj = _respProps ? _respProps.formData : properties && properties.formData && properties.formData
      const productModeKey = Object.keys(_formDataObj).find(formProps => formProps.startsWith("product-mode"))
      if (productModeKey && _formDataObj[productModeKey] === key) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const checkProductMode = (data) => {
    const formData = data ? data.formData : propertiesRef.current && propertiesRef.current.formData ? propertiesRef.current.formData : {};
    const productModeKey = Object.keys(formData).find(formProps => formProps.startsWith("product-mode"));
    if (productModeKey && formData && formData[productModeKey]) {
      return formData[productModeKey];
    } else {
      return ''
    }
  }

  const saveProjectForLaterHandler = async () => {
    setMessageType("SAVE_PROJECT_IN_PROGRESS")
    await saveProjectTpv()
    let decodedUrl = ''
    try {
      const refUrl = xmPieSAParametersRef.current && xmPieSAParametersRef.current.refUrl;
      if (refUrl) {
        decodedUrl = decodeURIComponent(refUrl)
      }
    } catch (e) {
      console.error("Error reading parent query string. {}", e);
    }
    setMessageType("PROJECT_SAVED");
    setTimeout(() => {
      setMessageType(null);
      window.parent.location.href = `${xmPieSAParametersRef.current && xmPieSAParametersRef.current.parentUrl}${decodedUrl}`;
    }, 1000);
  }

  const saveProjectTpv = async (_projectName) => {

    if (propertiesRef.current && Object.keys(propertiesRef.current).length) {
      await pushProperties(
        orderItem.ID,
        convertProductPropertiesFormIntoArray(
          propertiesRef.current,
          excelPricingEnabled
        )
      )
    }
    const projectName = _projectName ? _projectName : (propertiesRef.current && propertiesRef.current.formData && propertiesRef.current.formData[sstkProperties["sstkProjectName"]]);
    const templateBody = {
      template: {
        name: projectName,
        configId: orderItem.FriendlyID,
        itemId: product.ExternalID,
        assetId: getTpvPropsValue('sstkProjectID')
      }
    }
    fetch(`${xmPieSAParametersRef.current && xmPieSAParametersRef.current.parentUrl}/tpv/session/api/tpvProxy/print/creatOrEditTemplate`, {
      method: 'POST',
      body: JSON.stringify(templateBody),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(async (resp) => {
      try {
        await pushSavedForLater(orderItem.ID);
        const res = resp.json()
        return res;
      } catch (e) {
        console.error("Error saving template: {}", e);
      }

      return resp;
    }).catch(async (e) => {
      await pushSavedForLater(orderItem.ID);
    })
  }

  const deleteSavedPdf = async (previousFileName, propsId) => {

    const token = themeContext.get('securityToken')
    const contentLanguage = themeContext.get('languageCode')

    const myHeaders = new Headers()
    myHeaders.append('Authorization', `uStore ${token}`)
    myHeaders.append('Accept-Language', contentLanguage)

    const requestOptions = {
      method: 'DELETE',
      headers: myHeaders
    }

    await fetch(`/uStoreRestAPI/v1/store/login/user/orders/unsubmitted/items/${orderItemRef.current && orderItemRef.current.ID}/properties/${propsId}/files?fileNames[0]=${previousFileName}`, requestOptions)
      .then(response => {
        return response.json()
      })
  }

  const savePdfToProduct = async (pdfFileBlob, numOfPages, fileName, file, assetId, savedTemplateID) => {

    if (fileName) {
      const _tpvProps = (propertiesObjectRef.current && propertiesObjectRef.current[sstkPropertiesRef.current['tpvProps']]) ? JSON.parse(propertiesObjectRef.current[sstkPropertiesRef.current['tpvProps']].value) : {};
      _tpvProps['fileName'] = fileName;
      await formValueChangeHandler(sstkPropertiesRef.current['tpvProps'], JSON.stringify(_tpvProps))
      fileName = 'SimplePrint.pdf'
    } else {
      fileName = 'designProof.pdf'
    }

    const token = themeContext.get('securityToken')
    const contentLanguage = themeContext.get('languageCode')

    const myHeaders = new Headers()
    myHeaders.append('Authorization', `uStore ${token}`)
    myHeaders.append('Accept-Language', contentLanguage)

    const formData = new FormData()
    if (file) {
      const newFile = new File([file], file.name, {
        type: file.type,
        lastModified: file.lastModified
      });
      formData.append(encodeURIComponent(fileName), newFile, fileName)
    } else {
      const fileOptions = { type: 'application/pdf' }
      const pdfFile = new File([pdfFileBlob], fileName, fileOptions)
      formData.append(encodeURIComponent(fileName), pdfFile, fileName)
    }

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formData,
      redirect: 'follow',
      credentials: 'include'
    }
    const propsId = getPropertyId("fileAttach_", true)

    if (propsId) {
      await fetch(`/uStoreRestAPI/v1/store/login/user/orders/unsubmitted/items/${orderItemRef.current && orderItemRef.current.ID}/properties/${propsId}/files`, requestOptions)
        .then(response => {
          try {
            const _response = response.json()
            return _response
          } catch (e) {
            setUploadError(true)
            console.error("\n\n**** Error converting JSON : {}", e)
            return null
          }
        })
        .then(async (response) => {
          if (response) {
            await formValueChangeHandler(sstkPropertiesRef.current["fileAttach"], response.FileInfoList);

            const _tpvProps = (propertiesObjectRef.current && propertiesObjectRef.current[sstkPropertiesRef.current['tpvProps']]) ? JSON.parse(propertiesObjectRef.current[sstkPropertiesRef.current['tpvProps']].value) : {};
            if (numOfPages) {
              _tpvProps['uploadedDocPageCount'] = numOfPages;
              // Calculating pages for booklets and memo pads.
              const _isBookletProduct = checkIsBookletProduct();
              if (_isBookletProduct) {
                numOfPages = Math.floor(getBookletTotalPage(numOfPages) / 2)
              }
              const _isMemoPadsProduct = checkIsMemoPadsProduct();
              if (_isMemoPadsProduct) {
                numOfPages = getMemoPadsPage(numOfPages);
              }
              const tabData = propertiesRef.current && propertiesRef.current.formData && propertiesRef.current.formData[sstkPropertiesRef.current["tabData"]];
              setShowTabError(getShowTabError(numOfPages, tabData));
              await formValueChangeHandler(sstkPropertiesRef.current["pageCount"], numOfPages);
            }
            if (renderNewPreview()) {
              _tpvProps['projectAssetID'] = assetId ? assetId : "NONE";
            }
            _tpvProps['fileAttachPropID'] = propsId;
            _tpvProps['uniqueOPID'] = orderItemRef.current && orderItemRef.current.ID;
            await formValueChangeHandler(sstkPropertiesRef.current['tpvProps'], JSON.stringify(_tpvProps))
            if (savedTemplateID) {
              await formValueChangeHandler(sstkPropertiesRef.current["savedTemplateID"], savedTemplateID);
            }
          }
          setUploadComplete(true)
        })
        .catch(error => {
          setUploadError(true)
          console.error('error uploading', error)
        })
    }
  }

  const formValueChangeHandler = async (propId, value) => {
    const propErrors = Object.assign({}, errors);
    if (propErrors) {
      Object.keys(propErrors).forEach(key => {
        propErrors[key] = errors[key].errors;
      });
    }
    await handleFormChange(propId, value, propErrors);
  }

  const closeModelHandler = () => {
    setMessageType(null)
  }

  const closeUploadModelHandler = () => {
    setUploadComplete(true)
  }

  const getFileSizeAndUnit = (sizeInBytes) => {
    if (sizeInBytes < 1024) {
      return sizeInBytes + ' bytes'
    } else if (sizeInBytes < 1024 * 1024) {
      return (sizeInBytes / 1024).toFixed(2) + ' kb'
    } else {
      return (sizeInBytes / (1024 * 1024)).toFixed(2) + ' MB'
    }
  }

  const isJsonString = (str) => {
    try {
      JSON.parse(str)
    } catch (e) {
      console.log('error in isJsonString', e)
      return false
    }
    return true
  }

  const enableDisableATC = (event) => {
    if (event && event.detail) {
      setIsDisabledATC(event.detail.isDisabled)
    }
  }

  const getAssetDetails = async (event) => {
    if (event && event.detail) {
      try {

        if (isMultiFileProductRef.current) {
          getUploadFileDetails(event);
          return;
        }
        console.log("MyFiles - File Object here: ", event.detail)
        const assetURL = event.detail.assetURL
        const fileName = event.detail.fileName
        const assetId = event.detail.assetId
        const replaceFile = event.detail.replaceFile || replaceFileRef.current
        const savedTemplateID = event.detail.savedTemplateID

        setValueForShowReplaceFileLink(savedTemplateID)
        setLocalFileObjWord(null);
        setSelectedFileSource('MyFiles')

        const fileExtension = fileName.split(".").pop();
        console.log("MyFiles - Selected file type : " + fileExtension);
        if (fileExtension.toLowerCase() === 'pdf') {
          uploadPdfDocument(null, assetURL, assetId, fileName, replaceFile, savedTemplateID);
        } else if (fileExtension.toLowerCase() === 'doc' || fileExtension.toLowerCase() === 'docx') {
          convertWordToPdf(null, assetURL, assetId, fileName, null, replaceFile, savedTemplateID);
        } else {
          console.warn("Unsupported file extension, fileName - " + fileName)
          childRef.current && childRef.current._setShowLoader(false)
          childRef.current && childRef.current._setFileExtension(fileExtension && fileExtension.toUpperCase())
          childRef.current && childRef.current._setIsUnsupported(true)
        }
      } catch (error) {
        console.log('error in getAssetDetails', error)
        setUploadError(true)
        setUploadComplete(true)
        setDisablePopover(false)
      } finally {
        setDisablePopover(false);
      }
    }
  }

  const getTabDataDetails = async (event) => {
    if (event && event.detail) {
      const tabData = event.detail.tabData;
      const stringifyTabData = JSON.stringify(sortedTabData(tabData));
      const numOfPages = propertiesRef.current && propertiesRef.current.formData && propertiesRef.current.formData[sstkPropertiesRef.current["pageCount"]];
      if (propertiesRef.current && propertiesRef.current.formData && propertiesRef.current.formData[sstkPropertiesRef.current["tabData"]] === "{}") {
        setShowToastMsg('Added tabs to this project successfully.');
      } else {
        setShowToastMsg('Saved tab changes successfully.');
      }
      await formValueChangeHandler(sstkPropertiesRef.current['tabData'], stringifyTabData)
      setTabSummary(getTabSummary(tabData));
      setShowToast(true);
      setShowTabError(getShowTabError(numOfPages, stringifyTabData));
    }
  }

  const getShowTabError = (numOfPages, tabData) => {
    if (tabData && tabData !== "{}") {
      const maxPageNumber = getTabMaxPageNumber(JSON.parse(tabData));
      if (maxPageNumber && maxPageNumber > numOfPages) {
        return true
      } else {
        return false
      }
    }
    return false
  }

  const getResetTabDataDetails = async (event) => {
    if (event && event.detail) {
      const resetTab = event.detail.resetTab;
      if (resetTab) {
        setTabSummary(null);
        setShowTabError(false);
        await formValueChangeHandler(sstkPropertiesRef.current['tabData'], "{}")
      } else {
        await formValueChangeHandler(sstkPropertiesRef.current['tabs'], "addTabs")
      }
    }
  }

  const getUploadFileDetails = async (event) => {
    if (event && event.detail) {

      var uploadFileInfo;
      var localFileList;
      /** Multi file feature starts */
      if (isMultiFileProductRef.current) {

        if (event.detail.ignoreChanges) {
          return;
        }

        localFileList = event.detail.fileList;
        // if(isAddMoreFileEnabledRef.current) {
        //   const newFiles = [...tempFileListRef.current, ...localFileList];
        //   setTempFileList([...newFiles]);
        //   drawerRef.current && drawerRef.current.open();
        //   return;
        // }

        childRef.current && childRef.current._setShowLoader(true);
        setFileList(localFileList); // Assuming setFileList is a function to update the state or similar
        const fileListObj = {
          fileList: localFileList,
          isMultiFileFlow: true
        };
        setTpvPropsValue(fileListObj);
        uploadFileInfo = await generatePreviewHandler(localFileList);
      } else {
        uploadFileInfo = event.detail.uploadFileInfo
      }

      const replaceFile = event.detail.replaceFile || replaceFileRef.current

      try {
        setLocalFileObjWord(null);
        setDisablePopover(true)
        setSelectedFileSource('LocalFile')
        setAddToMyFileState('initial')
        setValueForShowReplaceFileLink(null);
        const fileExtension = uploadFileInfo.name.split('.').pop();
        if (isMultiFileProductRef.current) {
          // savedTemplateID if exist in a localFileList will always be same
          const fileListOBJ = localFileList && localFileList.length > 0
            && localFileList.find(fileList => fileList.savedTemplateID);
          const savedTemplateID = fileListOBJ ? fileListOBJ["savedTemplateID"] : null;
          setValueForShowReplaceFileLink(savedTemplateID);
          uploadPdfDocument(uploadFileInfo, null, null, localFileList[0].name, replaceFile, savedTemplateID);
        } else if (fileExtension.toLowerCase() === 'pdf') {
          uploadPdfDocument(uploadFileInfo, null, null, uploadFileInfo.name, replaceFile);
        } else if (fileExtension.toLowerCase() === 'doc' || fileExtension.toLowerCase() === 'docx') {
          convertWordToPdf(uploadFileInfo, null, null, uploadFileInfo.name, uploadFileInfo.size, replaceFile);
        } else {
          console.warn("Unsupported file extension, fileName - " + uploadFileInfo.name)
          childRef.current && childRef.current._setShowLoader(false)
          childRef.current && childRef.current._setFileExtension(fileExtension)
          childRef.current && childRef.current._setIsUnsupported(true)
        }
      } catch (errors) {
        setDisablePopover(false)
        setUploadError(true)
        childRef.current && childRef.current._setShowLoader(false);
        console.log('Error in getUploadFileDetails ', errors)
      } finally {
        setDisablePopover(false);
      }
    }
  }

  const uploadPdfDocument = async (fileObject, assetUrl, assetId, _fileName, replaceFile, savedTemplateID) => {

    if (renderNewPreview()) {
      if (assetUrl) {
        setMyAssetId(assetId)
        setLocalFileObj(null)
      } else {
        setMyAssetId(null)
        setLocalFileObj(fileObject)
      }
      setPreviousUploadedFileBlob(null)
      childRef.current && childRef.current._setFilePasswordProtected(false);
      childRef.current && childRef.current._setShowLoader(true);
      childRef.current && childRef.current._isDocFile(false);
    } else {
      setUploadComplete(false)
    }

    setUploadError(false)
    setDisablePopover(true)

    var filePromise = Promise.resolve();
    if (fileObject) {
      filePromise = readFileAsArrayBuffer(fileObject);
    } else if (assetUrl) {
      filePromise = fetch(assetUrl).then(res => {
        const size = res.headers.get("Content-Length");
        setFileSize(getFileSizeAndUnit(size))
        return res.blob()
      });
    }
    await filePromise.then(async (document) => {
      const basePreviewObjRef = await new BasePreview().convertPDFUrlToImagesByPage(assetUrl ? assetUrl : document);
      if (renderNewPreview() && basePreviewObjRef && checkMaxPageAllowedError(basePreviewObjRef.getTotalPages())) {
        childRef.current && childRef.current._setShowLoader(false);
        childRef.current && childRef.current._setMaxPageAllowedError(true);
        if (replaceFile) {
          postUploadModelMessage(false, true, "The number of pages in the uploaded file exceeds the maximum pages allowed (" + `${checkIsBookletProduct() ? 80 : 2}` + ").");
        }
      } else if (basePreviewObjRef) {
        const projectName = propertiesRef.current && propertiesRef.current.formData && propertiesRef.current.formData[sstkPropertiesRef.current["sstkProjectName"]];
        if (projectName === "Untitled project" || projectName === removeFileExtension(fileNameRef.current)) {
          getUpdatedProjectName(removeFileExtension(_fileName));
        }
        setFileName(_fileName)
        const pageCount = basePreviewObjRef.getTotalPages();
        setBasePreview(basePreviewObjRef);
        setDocumentData({
          pdfFileBlob: assetUrl ? document : '',
          numOfPages: pageCount,
          fileName: _fileName,
          file: assetUrl ? null : fileObject,
          assetId: assetUrl ? assetId : null,
          isFileAdded: true,
          savedTemplateID: savedTemplateID ? savedTemplateID : null
        })
        if (!getIsEditOrReOrderMode()) {
          await deletePreviousPdfFromFileAttachProp();
          await savePdfToProduct(assetUrl ? document : '', pageCount, _fileName, assetUrl ? null : fileObject, assetUrl ? assetId : null, savedTemplateID);
        } else {
          let _pageCount = pageCount;
          if (_pageCount && renderNewPreview()) {
            // Calculating pages for booklets and memo pads.
            const _isBookletProduct = checkIsBookletProduct();
            if (_isBookletProduct) {
              _pageCount = Math.floor(getBookletTotalPage(_pageCount) / 2)
            }
            const _isMemoPadsProduct = checkIsMemoPadsProduct();
            if (_isMemoPadsProduct) {
              _pageCount = getMemoPadsPage(_pageCount);
            }
            await formValueChangeHandler(sstkPropertiesRef.current["pageCount"], _pageCount);
          }
        }
        renderNewPreview() && childRef.current && childRef.current._setShowLoader(false);
        renderNewPreview() && replaceFile && setShowToastMsg('You successfully replaced your file.')
        renderNewPreview() && replaceFile && setShowToast(replaceFile)
        replaceFileRef.current = false
        // renderNewPreview() && generateNewImagesForProofGeneration(basePreviewObjRef.getPdfObj());
      } else {
        setUploadComplete(true);
        if (!renderNewPreview()) {
          postUploadModelMessage(true, true, "We are unable to process password-protected files. Please upload or select another file.");
        } else if (renderNewPreview()) {
          childRef.current && childRef.current._setShowLoader(false);
          if (basePreviewRef.current && basePreviewRef.current.getTotalPages() > 0) {
            postUploadModelMessage(true, true, "We are unable to process password-protected files. Please upload or select another file.");
          } else if (childRef.current) {
            childRef.current._setFilePasswordProtected(true);
            setFileName(null);
          }
        }
      }
    })
  }

  const postUploadModelMessage = (isFilePasswordProtected, showError, errorMsg) => {
    if (window && window.parent !== window) {
      setTimeout(() => {
        window.parent.postMessage({
          xmPieOpenDrawerRequest: {
            detail: {
              showMyFilesModal: true,
              isFilePasswordProtected: isFilePasswordProtected,
              landingPage: 'XMPIE_SIMPLE_PRINT',
              replaceFile: replaceFileRef.current,
              productId: getProductID(),
              uploadedFileError: { showError: showError ? true : false, errorMsg: errorMsg }
            }
          }
        }, "*");
      }, 500)
    }
  }

  const convertWordToPdf = async (fileObject, assetUrl, assetId, _fileName, fileSize, replaceFile, savedTemplateID) => {
    if (renderNewPreview()) {
      childRef.current && childRef.current._setFilePasswordProtected(false);
      childRef.current && childRef.current._setShowLoader(true);
      childRef.current && childRef.current._isDocFile(true);
      childRef.current && childRef.current._setFileName(_fileName);
      fileSize && childRef.current && childRef.current._setFileSize(getFileSizeAndUnit(fileSize));
    }
    var filePromise = Promise.resolve();
    if (fileObject) {
      filePromise = readFileAsArrayBuffer(fileObject);
    } else if (assetUrl) {
      filePromise = fetch(assetUrl).then(res => {
        const size = res.headers.get("Content-Length");
        size && childRef.current && childRef.current._setFileSize(getFileSizeAndUnit(size));
        return res.blob()
      });
    }

    await filePromise.then(async (document) => {

      if (fileObject) {
        setLocalFileObjWord(fileObject);
      }
      const orderProductId = orderItemRef.current.FriendlyID;
      const fileExtension = _fileName.split(".").pop();
      const parsedInputFileName = orderProductId + '_' + generateRandomNumber() + '_SimplePrint.' + fileExtension;
      const resultPdfFileName = removeFileExtension(parsedInputFileName) + '.pdf';

      const convertedPdfAssetSourceId = getConvertedPdfFilesAssetSourceId();
      const convertedPdfFileFolderName = getConvertedPdfFilesFolderName();
      await uploadFileToAssetSource(document, convertedPdfAssetSourceId, parsedInputFileName);
      let convertToPdfResult = await triggerPdfConversion(convertedPdfFileFolderName, parsedInputFileName, resultPdfFileName);

      let convertedPdfAssetBlob = null;
      if (convertToPdfResult.result === 'success') {
        convertedPdfAssetBlob = await downloadConvertedAsset(convertedPdfAssetSourceId, resultPdfFileName);
      }
      let finalFileNameToAttach = removeFileExtension(_fileName) + '.pdf'
      if (convertedPdfAssetBlob) {
        if (renderNewPreview()) {
          if (assetUrl) {
            setPdfConvertedFileFl(true)
            setMyAssetId(assetId)
          } else {
            setMyAssetId(null)
          }
          setLocalFileObj(convertedPdfAssetBlob)
          setPreviousUploadedFileBlob(null)
        } else {
          setUploadComplete(false)
        }
        setFileSize(getFileSizeAndUnit(assetUrl ? document.size : convertedPdfAssetBlob.size));
        setUploadError(false);
        setDisablePopover(true);
        const data = new Uint8Array(await convertedPdfAssetBlob.arrayBuffer());
        const blob = new Blob([data], { type: 'application/pdf' });
        const basePreviewObjRef = await new BasePreview().convertPDFToImagesByPage(blob);
        if (renderNewPreview() && basePreviewObjRef && checkMaxPageAllowedError(basePreviewObjRef.getTotalPages())) {
          childRef.current && childRef.current._setShowLoader(false);
          childRef.current && childRef.current._setMaxPageAllowedError(true);
          if (replaceFile) {
            postUploadModelMessage(false, true, "The number of pages in the uploaded file exceeds the maximum pages allowed (" + `${checkIsBookletProduct() ? 80 : 2}` + ").");
          }
        } else if (basePreviewObjRef) {
          const pageCount = basePreviewObjRef.getTotalPages();
          setBasePreview(basePreviewObjRef);
          const projectName = propertiesRef.current && propertiesRef.current.formData && propertiesRef.current.formData[sstkPropertiesRef.current["sstkProjectName"]];
          if (projectName === "Untitled project" || projectName === removeFileExtension(fileNameRef.current)) {
            getUpdatedProjectName(removeFileExtension(_fileName));
          }
          setFileName(finalFileNameToAttach);
          setDocumentData({
            pdfFileBlob: convertedPdfAssetBlob,
            numOfPages: pageCount,
            fileName: finalFileNameToAttach,
            file: null,
            assetId: assetUrl ? assetId : null,
            isFileAdded: true,
            savedTemplateID: savedTemplateID ? savedTemplateID : null
          })
          if (!getIsEditOrReOrderMode()) {
            await deletePreviousPdfFromFileAttachProp();
            await savePdfToProduct(convertedPdfAssetBlob, pageCount, finalFileNameToAttach, null, assetUrl ? assetId : null, savedTemplateID);
          } else {
            let _pageCount = pageCount;
            if (_pageCount && renderNewPreview()) {
              // Calculating pages for booklets and memo pads.
              const _isBookletProduct = checkIsBookletProduct();
              if (_isBookletProduct) {
                _pageCount = Math.floor(getBookletTotalPage(_pageCount) / 2)
              }
              const _isMemoPadsProduct = checkIsMemoPadsProduct();
              if (_isMemoPadsProduct) {
                _pageCount = getMemoPadsPage(_pageCount);
              }
              await formValueChangeHandler(sstkPropertiesRef.current["pageCount"], _pageCount);
            }
          }
          renderNewPreview() && childRef.current && childRef.current._setShowLoader(false);
          renderNewPreview() && replaceFile && setShowToastMsg('You successfully replaced your file.')
          renderNewPreview() && replaceFile && setShowToast(replaceFile)
          renderNewPreview() && childRef.current && childRef.current._setFileSize(null);
          childRef.current && childRef.current._isDocFile(false);
          // renderNewPreview() && generateNewImagesForProofGeneration(basePreviewObjRef.getPdfObj());
        } else {
          setUploadComplete(true);
          if (!renderNewPreview()) {
            postUploadModelMessage(true, true, "We are unable to process password-protected files. Please upload or select another file.");
          } else if (renderNewPreview()) {
            childRef.current && childRef.current._setShowLoader(false);
            childRef.current && childRef.current._setFileSize(null);
            childRef.current && childRef.current._isDocFile(false);
            if (basePreviewRef.current && basePreviewRef.current.getTotalPages() > 0) {
              postUploadModelMessage(true, true, "We are unable to process password-protected files. Please upload or select another file.");
            } else if (childRef.current) {
              childRef.current._setFilePasswordProtected(true);
              setFileName(null);
            }
          }
        }
      } else {
        console.log(`${assetUrl ? 'MyFiles' : 'LocalFile'} - Unable to process uploaded file : ${finalFileNameToAttach}`);
      }
    })
    setDisablePopover(false);
  }

  const readFileAsArrayBuffer = (uploadFileInfo) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(uploadFileInfo);
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  }

  const deletePreviousPdfFromFileAttachProp = async () => {
    const propsId = getPropertyId('fileAttach_', true)
    const propertyId = Object.keys(propertiesObjectRef.current).find(formProps => formProps.startsWith('fileAttach_'))
    const propertyValue = propertyId && propertiesObjectRef.current[propertyId].value
    if (propertyValue) {
      const isValidJson = isJsonString(propertyValue)
      let propertyValueObj = {}
      if (isValidJson) {
        propertyValueObj = JSON.parse(propertyValue)
      } else {
        propertyValueObj = propertyValue
      }
      const previousFileName = propertyValueObj && propertyValueObj[0] && propertyValueObj[0].FileName
      if (previousFileName) {
        await deleteSavedPdf(previousFileName, propsId)
        // await deleteImageAssetSourceAndProof();
      }
    }
  }

  const triggerPdfConversion = async (folder, fileName, resultFileName) => {
    let convertToPdfPayload = JSON.stringify({
      folder,
      fileName,
      resultFileName
    })
    return fetch(`${xmPieSAParametersRef.current && xmPieSAParametersRef.current.parentUrl}/tpv/session/api/tpvProxy/print/sstk/convertToPdf`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: convertToPdfPayload
      })
      .then(resp => resp.json())
      .catch((error) => {
        console.log('Error occurred during pdf conversion: ', error)
      })
  }

  const deleteImageAssetSourceAndProof = async () => {
    const orderProductId = orderItemRef.current.FriendlyID;
    if (orderProductId) {
      setIsReadyToGenerateProof(false);
      await deleteAssetSourcesWithImages(orderProductId);
      await deletePreviouslyGeneratedProof(orderProductId);
    }
  }

  const generateNewImagesForProofGeneration = async (uploadedAssetBlob) => {
    const orderProductId = orderItemRef.current.FriendlyID;
    let result = await generateAssetImagesAndUpload(orderProductId, uploadedAssetBlob);
    if (result) {
      setIsReadyToGenerateProof(true);
      console.log("Asset images are ready for proof generation")
    } else {
      console.log("Unable to prepare asset images for proof generation")
    }
  }

  const setShowLoaderHandler = (value) => {
    setShowLoader(value);
  }

  const renderNewPreview = () => {
    try {
      const productMode = checkProductMode();
      var newPreview = localStorage.getItem('newPreview');
      // console.log("[newPreview] : productMode: ", productMode, " newPreview: ", newPreview)
      if (productMode === 'docsV2' || productMode === 'docsV3' || newPreview === 1) {
        return true;
      }
      return false;
    } catch (e) {
      console.log("[newPreview] : Error occured New Preview: ", e)
      return false;
    }
  }

  const previousUploadedFileHandler = async (orderProductId) => {
    try {
      childRef.current && childRef.current._setShowLoader(true);
      const fileAttachAssetSource = await createFileAttachAssetSource(orderProductId)
      console.log('[newPreview] fileAttachAssetSource ', fileAttachAssetSource)
      if (fileAttachAssetSource && fileAttachAssetSource.FriendlyId) {
        const assetSourceId = fileAttachAssetSource.FriendlyId
        try {
          const fileListFromAssetSource = await fileListFromAssetSourceResult(assetSourceId)
          if (fileListFromAssetSource && fileListFromAssetSource.Items[0]) {
            const fileId = fileListFromAssetSource.Items[0].FileId
            const fileObjBlob = await fileBlobFromAssetSourceResult(assetSourceId, fileId)
            if (fileObjBlob) {
              // console.log('[newPreview] previousUploadedFileBlob', fileObjBlob)
              setPreviousUploadedFileBlob(fileObjBlob);
              const basePreviewObjRef = await new BasePreview().convertPDFToImagesByPage(fileObjBlob);
              if (basePreviewObjRef) {
                setBasePreview(basePreviewObjRef);
              }
              // Enable it later when download proof link is needed in future
              //setIsReadyToGenerateProof(true); // show download proof link
              childRef.current && childRef.current._setShowLoader(false);
            }
          }
        } catch (e) {
          console.log('[newPreview] Error occurred fetching file blob :', e)
          throw new Error('[newPreview] Error occurred fetching file blob')
        } finally {
          const deleteFileAttachAssetSourceResult = await deleteFileAttachAssetSource(assetSourceId)
          console.log('[newPreview] deleteFileAttachAssetSourceResult ', deleteFileAttachAssetSourceResult)
        }
      }
    } catch (e) {
      // TODO Implement error state
      childRef.current && childRef.current._setShowLoader(false);
      console.log('[newPreview] Error occurred', e)
    }
  }

  const tabClickHandler = (comingFrom) => {
    if (comingFrom === "openTabDrawer") {
      const tabsPageCount = propertiesRef.current && propertiesRef.current.formData && propertiesRef.current.formData[sstkPropertiesRef.current["pageCount"]];
      const tabData = propertiesRef.current && propertiesRef.current.formData && propertiesRef.current.formData[sstkPropertiesRef.current["tabData"]];
      const tabDataObj = tabData && JSON.parse(tabData);
      if (window && window.parent !== window) {
        window.parent.postMessage({
          xmPieOpenDrawerRequest: {
            detail: {
              showTabsDrawer: true,
              tabData: tabDataObj && Object.keys(tabDataObj).length !== 0 ? tabDataObj : {},
              tabsPageCount: tabsPageCount
            }
          }
        }, '*')
      }
    }
    if (comingFrom === "openNoTabConfirmationModal") {
      if (window && window.parent !== window) {
        window.parent.postMessage({
          xmPieOpenModalRequest: {
            detail: {
              showNoTabConfirmationModal: true
            }
          }
        }, '*')
      }
    }
  }

  const viewFileDetails = () => {
    const projectAssetID = getTpvPropsValue('projectAssetID')
    if ((!projectAssetID || projectAssetID === 'NONE') && !pdfConvertedFileFl && (localFileObj || previousUploadedFileBlob)) {
      const file = localFileObj ? localFileObj : previousUploadedFileBlob
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onload = async (event) => {
        const buffer = event.target.result
        const data = new Uint8Array(buffer)
        const pdfDoc = await pdfjsLib.getDocument(data).promise
        const pageCount = pdfDoc.numPages
        if (window && window.parent !== window) {
          window.parent.postMessage({
            showFileDetails: {
              detail: {
                localFileDetails: {
                  name: file.name ? file.name : fileName,
                  size: getFileSizeAndUnit(file.size),
                  numPages: pageCount,
                  extension: file.name ? file.name.split('.').pop() : fileName.split('.').pop()
                }
              }
            }
          }, '*')
        }
      }
    } else {
      if (window && window.parent !== window) {
        window.parent.postMessage({
          showFileDetails: {
            detail: {
              myAssetId: myAssetId ? myAssetId : projectAssetID
            }
          }
        }, '*')
      }
    }
  }

  const getPriceTierValue = (calculatedDiscount, priceTierAndPromoValue, fieldName) => {
    try {

      if (calculatedDiscount && calculatedDiscount > 0) {
        if (fieldName == "rate")
          return String(calculatedDiscount);
        if (fieldName == "active")
          return '1';
      }

      const parts = priceTierAndPromoValue.split('|');
      const rateIndex = parts.indexOf(fieldName);

      if (rateIndex !== -1 && rateIndex + 1 < parts.length) {
        return parts[rateIndex + 1];
      }

    } catch (e) {
      //fail silently
    }
    return null;
  }

  const showOriginalPriceAndBadge = () => {
    try {
      //calculatedDiscount
      const discountRate = getPriceTierValue(properties && properties.formData && properties.formData[sstkProperties["calculatedDiscount"]], properties && properties.formData && properties.formData[sstkProperties["priceTierAndPromo"]], 'rate')
      const promoActive = getPriceTierValue(properties && properties.formData && properties.formData[sstkProperties["calculatedDiscount"]], properties && properties.formData && properties.formData[sstkProperties["priceTierAndPromo"]], 'active')

      if (discountRate && promoActive && promoActive === '1' && discountRate.length > 0) {
        return true;
      }
    } catch (e) {
      //fail silently
    }
    return false;

  }

  const replaceFileClickHandler = () => {
    if (window && window.parent !== window) {
      replaceFileRef.current = true;
      window.parent.postMessage({
        xmPieOpenDrawerRequest: {
          detail: {
            showMyFilesModal: true,
            replaceFile: true,
            productId: getProductID(),
            landingPage: 'XMPIE_SIMPLE_PRINT'
          }
        }
      }, "*");
    }
  }

  const handleClearToast = () => {
    setShowToast(false);
    setShowToastMsg('');
  }

  const openUploadLocalModelHandler = () => {
    fileInputRef.current && fileInputRef.current.openFileBrowser();
  }

  /**
   * 
   * @param {FileEvent} event 
   * This function is only used for New Preview and only for Local development.
   */
  const uploadLocalFileHandler = async (event) => {

    if (isMultiFileProductRef.current) {
      const totalFile = event.target.files.length;
      console.log(event.target.files)
      const files = Array.from(event.target.files);
      if (totalFile > 0) {
        const uploadPromises = files.map(file => uploadFileAndGeneratePreview(file, null));
        const localFileList = await Promise.all(uploadPromises);

        localFileList.sort((a, b) => files.findIndex(f => f.name === a.name) - files.findIndex(f => f.name === b.name));

        setFileList(localFileList);

        const customEvent = {
          detail: {
            fileList: [...localFileList]
          }
        };
        getUploadFileDetails(customEvent)
      }
    } else {
      const file = event.target.files[0];
      const customEvent = {
        detail: {
          uploadFileInfo: file
        }
      };
      getUploadFileDetails(customEvent)
    }
  }

  async function uploadFileAndGeneratePreview(file) {
    const document = await readFileAsArrayBuffer(file);
    const response = await fetch(`/tpv/session/api/tpvProxy/azure/upload?opId=${orderItem.FriendlyID}&fileName=${file.name}`,
      {
        method: 'POST',
        body: document,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/octet-stream'
        }
      }).then(resp => resp.json());
    const totalPage = response.totalPage;

    return { name: file.name, page: totalPage, size: file.size };
  }

  const generatePreviewHandler = (localFileList) => {
    const fileNames = localFileList.map(file => file.name);
    return fetch(`${xmPieSAParametersRef.current && xmPieSAParametersRef.current.parentUrl}/tpv/session/api/tpvProxy/file/mergeUtility?folderName=${orderItemRef.current.FriendlyID}`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fileNames)
      }).then(resp => resp.json())
      .then(async (resp) => {
        return downloadProof(resp);
      });
  }

  const downloadProof = async (resp) => {
    var response;
    var retryCount = 0;
    const delay = 2500;
    while (retryCount < 20) {
      response = await fetch(`${xmPieSAParametersRef.current && xmPieSAParametersRef.current.parentUrl}${resp.proofUrl}`, {
        method: 'GET',
        credentials: 'include'
      });
      if (response.status === 404) {
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch file from blob storage: ${response.statusText}`);
      } else {
        break;
      }
    }
    // Convert the response to a blob
    const fileBlob = await response.blob();

    // Create a File object from the blob
    const file = new File([fileBlob], 'designProof.pdf', { type: fileBlob.type });

    return file;
  }

  const getIsEditOrReOrderMode = () => {
    if (xmPieSAParametersRef.current && xmPieSAParametersRef.current.isEditOrReOrderMode) {
      return true
    } else {
      return false
    }
  }

  const setValueForShowReplaceFileLink = (savedTemplateID) => {
    if (savedTemplateID && savedTemplateID.includes("LOCK")) {
      setShowReplaceFileLink(false);
    } else {
      setShowReplaceFileLink(true);
    }
  }

  const addToMyFileClickHandler = () => {
    setAddToMyFileState('uploading');
    const file = localFileObjWord || localFileObj || previousUploadedFileBlob;
    if (!(file && file.name)) {
      setAddToMyFileState('error');
      return;
    }
    fetch(`${xmPieSAParametersRef.current && xmPieSAParametersRef.current.parentUrl}/tpv/session/api/tpvProxy/print/metaproperties`, { credentials: 'include' })
      .then(response => response && response.json())
      .then(metaproperties => {
        if (!metaproperties) {
          console.log("Fetch MetaProperties error - Not present : ")
          setAddToMyFileState('error');
          return;
        }
        const queryParams = new URLSearchParams({
          fileName: file.name,
          accountID: "metaproperty." + metaproperties.accountID.id,
          uploadedUserID: "metaproperty." + metaproperties.uploadedUserID.id,
          uploadedUserName: "metaproperty." + metaproperties.uploadedUserName.id,
          addMethod: "metaproperty." + metaproperties.addMethod.id,
          assetOwnerID: "metaproperty." + metaproperties.assetOwnerID.id,
          assetOwnerName: "metaproperty." + metaproperties.assetOwnerName.id,
          sharing: "metaproperty." + metaproperties.sharing.id
        });

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = (event) => {
          fetch(`${xmPieSAParametersRef.current && xmPieSAParametersRef.current.parentUrl}/tpv/session/api/tpvProxy/print/uploadAsset?${queryParams.toString()}`, {
            method: 'POST',
            body: event.target.result,
            credentials: 'include',
            headers: {
              'Content-Type': 'application/octet-stream'
            }
          }).then(response => response && response.json())
            .then(() => {
              setAddToMyFileState('complete');
            }).catch((e) => {
              console.log("File upload error : ", e)
              setAddToMyFileState('error');
            });
        }
      }).catch((e) => {
        console.log("Fetch MetaProperties error : ", e)
        setAddToMyFileState('error');
      })
  }

  const getWhiteLabel = () => {
    try {
      const _logoutUrl = CookiesManager.getCookie("_logoutUrl");
      const decodedUrl = decodeURIComponent(_logoutUrl);
      const urlParts = decodedUrl.split("&");
      return urlParts.find(part => part.startsWith("whiteLabel"));
    } catch (e) {
      //fail silently
    }
    return null;
  }

  const checkMaxPageAllowedError = (pageCount) => {
    const paperSize = propertiesRef.current && propertiesRef.current.formData && propertiesRef.current.formData[sstkPropertiesRef.current["paperSize"]];
    if ((checkNCRProduct(paperSize) || checkMemoPadsProduct(paperSize)) && pageCount > 2) {
      return true;
    } else if (checkIsBookletProduct() && pageCount > 80) {
      return true;
    }
    return false;
  }

  const manageFileHandler = () => {
    // manageFileHandler is only used for New Preview
    // drawerRef && drawerRef.current && drawerRef.current.open();
    const savedTemplateID = propertiesRef.current && propertiesRef.current.formData && propertiesRef.current.formData[sstkPropertiesRef.current["savedTemplateID"]];
    const tabData = propertiesRef.current && propertiesRef.current.formData && propertiesRef.current.formData[sstkPropertiesRef.current["tabData"]];
    const maxPageNumberTab = tabData && tabData !== "{}" ? getTabMaxPageNumber(JSON.parse(tabData)) : null;
    if (window && window.parent !== window) {
      replaceFileRef.current = true;
      window.parent.postMessage({
        xmPieOpenDrawerRequest: {
          detail: {
            showMyFilesModal: true,
            productId: getProductID(),
            landingPage: 'XMPIE_SIMPLE_PRINT',
            isMultiFile: true,
            showManageFilesDrawer: true,
            orderProductId: orderItemRef.current.FriendlyID,
            fileList: [...fileList],
            savedTemplateID: savedTemplateID && savedTemplateID !== "NONE" ? savedTemplateID : '',
            maxPageNumberTab: maxPageNumberTab
          }
        }
      }, "*");
    }

  }

  const checkIsMemoPadsProduct = (propertiesFromApi) => {
    const paperSize = propertiesFromApi ? propertiesFromApi.formData && propertiesFromApi.formData[sstkPropertiesRef.current["paperSize"]] : propertiesRef.current && propertiesRef.current.formData && propertiesRef.current.formData[sstkPropertiesRef.current["paperSize"]]
    if (checkMemoPadsProduct(paperSize)) {
      return true;
    }
    return false;
  }

  const getMemoPadsPage = (pageCount) => {
    const sheetsPerPad = propertiesRef.current && propertiesRef.current.formData && propertiesRef.current.formData[sstkPropertiesRef.current["sheetsPerPad"]];
    const numSheetsPerPad = Number(sheetsPerPad);
    if (isNaN(numSheetsPerPad)) {
      return pageCount;
    } else {
      return pageCount * numSheetsPerPad;
    }
  }

  const updateMemoPadsPageCount = (_properties, _updatedPropertiesObject) => {
    const pageCountPropId = getPropertyId("page-count_", false, _properties);
    const pageCount = _updatedPropertiesObject && _updatedPropertiesObject.formData && _updatedPropertiesObject.formData[pageCountPropId];
    const uploadedDocPageCount = getTpvPropsValue('uploadedDocPageCount');
    if (uploadedDocPageCount) {
      const memoPadsPages = getMemoPadsPage(uploadedDocPageCount);
      if (pageCount != memoPadsPages) {
        formValueChangeHandler(pageCountPropId, memoPadsPages);
      }
    }
  }

  const ImageComponent = () => {

    const originalHeight = properties && properties.formData && properties.formData[sstkProperties["documentHeight"]]
    const originalWidth = properties && properties.formData && properties.formData[sstkProperties["documentWidth"]]

    const aspectRatio = originalWidth / originalHeight;

    const maxWidth = 300;
    const maxHeight = 250;

    let width, height;

    if (maxWidth / aspectRatio <= maxHeight) {
      // Width is the limiting factor
      width = maxWidth;
      height = maxWidth / aspectRatio;
    } else {
      // Height is the limiting factor
      width = maxHeight * aspectRatio;
      height = maxHeight;
    }

    return (
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div style={{ width: maxWidth, height: maxHeight, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div
            style={{
              width: `${width}px`,
              height: `${height}px`,
              backgroundColor: 'white',
              border: '1px solid #d6d6d6',
              boxShadow: '0 3px 6px #00000029, 0 3px 6px #0000003b'
            }}
          ></div>
        </div>
      </div>
    );
  };


  const handleClearMyFileToast = () => {
    setAddToMyFileState('uploaded');
  }

  const closeWarningModal = () => {
    setWarningModal(false)
  }

  const openWarningModal = () => {
    setWarningModal(true)
  }
  const leaveWarningModal = () => {
    removeEventListenerWrapper()
    { window.parent.location.href = `${xmPieSAParametersRef.current.parentUrl}/services/print/print-center?action=files` }
  }

  const addMoreFileClickHandler = () => {
    setAddMoreFileEnabled(true);
    drawerRef && drawerRef.current && drawerRef.current.close();

    if (window && window.parent !== window) {
      window.parent.postMessage({
        xmPieOpenDrawerRequest: {
          detail: {
            showMyFilesModal: true,
            landingPage: 'XMPIE_SIMPLE_PRINT',
            isMultiFile: true,
            orderProductId: orderItemRef.current.FriendlyID,
            productId: getProductID()
          }
        }
      }, "*");
    }
  }

  const cancleManageFileHandler = () => {

    drawerRef && drawerRef.current && drawerRef.current.close();
    setTempFileList([...fileList]);
    setAddMoreFileEnabled(false);
    return fetch(`${xmPieSAParametersRef.current && xmPieSAParametersRef.current.parentUrl}/tpv/session/api/tpvProxy/file/mergeUtility?folderName=${orderItemRef.current.FriendlyID}&onlyCleanFiles=true`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([...fileList].map(file => file.name))
      }).then(resp => resp.json());
  }

  const getProductID = () => {
    const productID = propertiesRef.current && propertiesRef.current.formData && propertiesRef.current.formData[sstkPropertiesRef.current["productID"]];
    return productID;
  }

  const handleSstkPdf = async (pdf, getBlob) => {
    if (pdf) {
      try {
        let blob = pdf;
        if (getBlob) {
          blob = pdf?.pages[0]?.imageBlob;
        }
        const basePreviewObjRef = await new BasePreview().convertPDFToImagesByPage(blob);
        setBasePreview(basePreviewObjRef);//set the local doc
      } catch (e) {
        //handle failure
        // console.log("error in sstk pdf >>", e);
      }
    }
  }

  const isNewUpload = product.Type === productTypes.EASY_UPLOAD

  return (
    <>
      <Breakpoint
        onBreakpointChange={breakpointCallback} />
      {showToastRef.current && <ToastBar
        marginTop={60}
        variant="success"
        delay={1000}
        hideAnimation={1000}
        showAnimation={1000}
        aria-live="assertive"
        onClose={handleClearToast}
      >
        {showToastMsgRef.current}
      </ToastBar>}
      {addToMyFileState === 'complete' && <ToastBar
        marginTop={60}
        variant="success"
        delay={4000}
        hideAnimation={1000}
        showAnimation={1000}
        aria-live="assertive"
        onClose={handleClearMyFileToast}
      >
        You successfully added this file to My Files.<Link size={"lg"} underline={true} color={"black"} onClick={openWarningModal}>View file in My Files.</Link>
      </ToastBar>}
      {(messageType) && <Modal
        showModal={true}
        hasCloseButton={true}
        closeOnBackdropClick={false}
        onClose={closeModelHandler}>
        {messageType === "SAVE_PROJECT_IN_PROGRESS" &&
          <div className="war-modal-container">
            <div className='notification-title'>Saving project...</div>
            <Spinner
              size="lg"
              color="black" />
            <NotificationBubble variant='info' maxWidth={true} customCSS={"margin-top: 24px; text-align: left"}>
              Please wait while your project is being saved.
            </NotificationBubble>
          </div>}
        {messageType === "PROJECT_SAVED" &&
          <div className="war-modal-container">
            <div className='notification-title'>Project save successful!</div>
            <div className='center-align-content'>
              <DoubleIcon size={80}>
                <Icon name="circle-outline" size={80} color="positive"></Icon>
                <Icon name="check" size={80} color="black"></Icon>
              </DoubleIcon>
            </div>
          </div>}
        {messageType === "PROOF_DOWNLOAD_IN_PROGRESS" &&
          <div className="war-modal-container">
            <div className='notification-title'>Downloading Proof</div>
            <div className='center-align-content'>
              <Spinner size="sm" color="black" />
            </div>
          </div>}
      </Modal>}
      {!uploadCompleteRef.current &&
        <Modal
          showModal={true}
          hasCloseButton={true}
          closeOnBackdropClick={false}
          onClose={closeUploadModelHandler}
          showSubHeader={true}>
          <div className="upload_flex_container">
            <div className="upload_file_title">Upload file</div>
            {uploadErrorRef.current ?
              <NotificationBubble variant="failure" maxWidth={true}
                customCSS={"margin: 16px auto 0; text-align: left"}>
                <>
                  {`We’re sorry, we couldn’t upload your file at this moment. Please try again later. If you continue to experience issues, reach out to `}
                  <Link
                    href={`mailto: ${supportEmail}`}
                    customCSS={"margin: 0"}
                  >
                    {supportEmail}
                  </Link>
                  .
                </>
              </NotificationBubble>
              :
              <>
                <div className="progress_section">
                  <Spinner size="sm" color="black" />
                  <div className="upload_text">
                    {'File processing...'}
                  </div>
                </div>
                <div className="uploader_container">
                  <p className="fileName">{fileNameRef.current}</p>
                  <div className="upload_count_container">
                    <p className="fileSize">{fileSizeRef.current}</p>
                  </div>
                </div>
              </>

            }
          </div>
        </Modal>
      }
      {renderNewPreview() && <FileUpload ref={fileInputRef} isMultiFile={isMultiFileProductRef.current} onSelection={uploadLocalFileHandler} />}
      {enableWarningModal && <div className='modal-width'>
        <Modal customCSS={(currentBreakpoint === 'lg' || currentBreakpoint === 'md') ? 'width:648px' : currentBreakpoint === 'sm' ? 'width:601px' : currentBreakpoint === 'xs' && 'width:312px'} hasCloseButton showModal={enableWarningModal} onClose={closeWarningModal}>
          <div className="modal-wrapper-second">
            <h1 className="modal-heading-second">Are you sure you want to leave?</h1>
            <div className="modal-text-second">Your project may not be saved if you navigate away from this page.</div>
            <div className="modal-button-wrapper-second">
              <a className="modal-link-second" onClick={closeWarningModal}>Back to my project</a>
              <Button onClickHandler={leaveWarningModal}>Leave</Button>
            </div>
          </div>

        </Modal> </div>}
      <SubHeader
        isPriceLoading={pageState === State.loading || pageState === State.calculatingPrice}
        isPriceCalculating={pageState === State.calculatingPrice || pageState === State.loading}
        price={price}
        showMinimumPrice={!!price.IsMinimumPrice}
        isSstkOrSimplePrintProduct={isSstkProduct || isNewSimplePrintProduct}
        projectName={properties && properties.formData && properties.formData[sstkProperties["sstkProjectName"]]}
        getUpdatedProjectName={getUpdatedProjectName}
        disablePopover={showLoader || disablePopoverRef.current}
        isSimplePrintProduct={isNewSimplePrintProduct}
        downloadProof={isReadyToGenerateProof ? downloadProofLinkHandler : ''}
        orderProductId={orderItemRef.current.FriendlyID}
        removeEventListenerWrapper={removeEventListenerWrapper}
        isEditCartMode={xmPieSAParametersRef.current && xmPieSAParametersRef.current.isEditCartMode} />
      <ProductLayout className="product-instance"
        dynamic={product.Type === productTypes.DYNAMIC}
        upload={isNewUpload}
      >
        <left id="custom" className="desktop-product">
          <div className="left-container">
            <PreviewErrorBalloon {...{ poofPreviewError }} />
            {showLoader ?
              <div style={{ zIndex: 10001 }} className={showLoader ? "spinner_view_mask" : "spinner_view_mask_hide"} >
                <div className={"spinner_center"}>
                  <Spinner
                    size="lg"
                    color="black" />
                </div>
              </div>
              :
              <>
                {/* //ONLY RENDER THE PREVIEW FOR SSTK WHEN THERE IS A SSTK PROJ ID */}
                {(renderNewPreview() || (isSstkProduct && (sstkProjectId && sstkProjectId !== "NONE")) && (currentBreakpoint === 'md' || currentBreakpoint === 'lg' || currentBreakpoint === 'sm')) ? <div><DocumentPreview
                  currentProductHasSSTK={currentProductHasSSTK}
                  openSstkModal={openSstkModal}
                  sizeId={sizeId}
                  webGlEnabled={webGlEnabled}
                  propertiesObj={properties}
                  getPropertyId={getPropertyId}
                  updateProperties={formValueChangeHandler}
                  setFileName={setFileName}
                  forwardedRef={childRef}
                  basePreview={basePreview}
                  renderSide="left"
                  currentBreakpoint={currentBreakpoint}
                  openUploadLocalModelHandler={openUploadLocalModelHandler}
                  previousBasePreview={prevBasePreviewRef.current}
                  isBookletProduct={isBookletProduct}
                  orderItem={orderItem}
                  isMultiFileProduct={isMultiFileProductRef.current}
                  isEdit={getIsEditOrReOrderMode()}
                  docRef={childRef}
                  isSstkProduct={isSstkProduct}
                  productId={getProductID()}/> </div> : 
                  isSstkProduct ? !sstkBlankCanvasRef.current && (!sstkProjectId || sstkProjectId === "NONE") ? <ImageCarousel
                  showTitle
                  images={productThumbnails.Thumbnails}
                /> : <div className='blank-canvas-div'><ImageComponent /></div>
                : isStaticProduct ? <ImageCarousel showTitle
                  images={productThumbnails.Thumbnails} /> : <></>}
              </>}
            {isSstkProduct ?
              <div className='sstk-desktop'>
                <SstkEditor
                  openSstkEditorModal={openSstkEditorModal}
                  handleSstkPdf={handleSstkPdf}
                  isPriceCalculating={pageState === State.calculatingPrice || pageState === State.loading}
                  price={price}
                  showMinimumPrice={!!price.IsMinimumPrice}
                  updateProperties={formValueChangeHandler}
                  setSstkThumbnails={setSstkThumbnails}
                  sstkProjectId={getTpvPropsValue('sstkProjectID')}
                  productHeight={properties && properties.formData && properties.formData[sstkProperties["documentHeight"]]}
                  productWidth={properties && properties.formData && properties.formData[sstkProperties["documentWidth"]]}
                  productSafetyMargin={properties && properties.formData && properties.formData[sstkProperties["safetyMargin"]]}
                  hideCropMarks={properties && properties.formData && properties.formData[sstkProperties["hideCropMarks"]]}
                  lockCanvasDimensions={properties && properties.formData && properties.formData[sstkProperties["lockCanvasDimensions"]]}
                  fileType={properties && properties.formData && properties.formData[sstkProperties["fileType"]]}
                  productBleedMargin={properties && properties.formData && properties.formData[sstkProperties["bleedMargin"]]}
                  productMaxPage={properties && properties.formData && properties.formData[sstkProperties["documentMaxPages"]]}
                  sstkProjectName={properties && properties.formData && properties.formData[sstkProperties["sstkProjectName"]]}
                  assetCountValue={getTpvPropsValue('assetCount')}
                  projectAssetID={getTpvPropsValue('projectAssetID')}
                  originalOrderProductId={getTpvPropsValue('originalOrderProductID')}
                  pageCountKey={sstkProperties["pageCount"]}
                  sstkProjectNameKey={sstkProperties["sstkProjectName"]}
                  orderProductId={orderItem && orderItem.ID}
                  savePdfToProduct={savePdfToProduct}
                  saveProjectTpv={saveProjectTpv}
                  apiHost={xmPieSAParametersRef.current && xmPieSAParametersRef.current.parentUrl}
                  setShowLoader={setShowLoaderHandler}
                  showLoader={showLoader}
                  getUpdatedProjectName={getUpdatedProjectName}
                  supportEmail={supportEmail}
                  setTpvPropsValue={setTpvPropsValue}
                  isSstkBlankCanvas={isSstkBlankCanvas}
                  sstkBlankCanvas={sstkBlankCanvasRef.current}
                />
              </div>
              : null}
            {/* { product.Proof &&
              <Proof
                  currentProduct={product}
                  isMobile={false}
                  hasThumbnails
                  hideLink={false}
                  orderItemId={orderItem.ID}
                  onToggle={() => setProofModalOpen(!proofModalOpen)}
              />
          } */}
            {/* <RefreshPreviewButton {...{showRefreshPreview, onProofPreviewClick, disabled: disabledRefreshPreviewButton }}/> */}
          </div>
        </left>
        <right is="custom">
          {(renderNewPreview() && (currentBreakpoint === 'smXmpie' || currentBreakpoint === 'xs' || currentBreakpoint === 'xxs')) ? <div className='new-preview-mobile'><DocumentPreview
            propertiesObj={properties}
            getPropertyId={getPropertyId}
            updateProperties={formValueChangeHandler}
            setFileName={setFileName}
            forwardedRef={childRef}
            basePreview={basePreview}
            renderSide="right"
            currentBreakpoint={currentBreakpoint}
            openUploadLocalModelHandler={openUploadLocalModelHandler}
            previousBasePreview={prevBasePreviewRef.current}
            isBookletProduct={isBookletProduct}
            orderItem={orderItem}
            isMultiFileProduct={isMultiFileProductRef.current}
            isEdit={getIsEditOrReOrderMode()}
            productId={getProductID()}/></div> : <></>
          }
          <Slot name="ng_product_top" data={product} />
          <ProductDetails
            className="product-instance"
            productModel={product}
            minimumQuantity={product.Configuration ? product.Configuration.Quantity.Minimum : null}
            // reorderModel={!searchParams.get('reorder') ? UStoreProvider.state.customState.get('lastOrder') : null}
            onReorder={handleReorder}
            showInStock
            langCode={themeContext.get('languageCode')}
          />
          {isSstkProduct ?
            <div className='sstk-mobile'>
              <NotificationBubble variant='warning'>
                Sorry, this product's customization options aren't formatted for small screens. Please use a larger screen to access our many templates & advanced customization features.
              </NotificationBubble>
            </div>
            : null
          }
          <Price
            isPriceCalculating={pageState === State.calculatingPrice || pageState === State.loading}
            price={price} showMinimumPrice={!!price.IsMinimumPrice}
            showOriginalPriceAndBadge={showOriginalPriceAndBadge()}
            discountRate={getPriceTierValue(properties && properties.formData && properties.formData[sstkProperties["calculatedDiscount"]], properties && properties.formData && properties.formData[sstkProperties["priceTierAndPromo"]], 'rate')}
          />
          {/* <div ref={topMarkerRef} className="price-top-marker"></div> */}
          <div className="product-instance-wizard">
            <div id="form-container" className="product-instance-properties product-properties">
              <Slot name="ng_product_above_quantity" data={product} />
              <div className="quantity">
                <span className="quantity-label">{t('product.quantity')}</span>
                {orderItem?.Quantity && <ProductQuantity
                  supportsInventory
                  productModel={product}
                  orderModel={orderItem}
                  onQuantityChange={handleQuantityChange}
                />}
              </div>
              {sstkBlankCanvasRef.current && <div className='blank-canvas-error-div'>
                  <NotificationBubble 
                    id="field-incomplete-design-failure"
                    variant="failure"
                    textSize={'md'}
                    customCSS={"display: flex; align-items: baseline;margin-bottom:10px"}>
                    Your canvas is blank. You will not be able to add your project to cart until you complete your design.
                  </NotificationBubble>
                </div>}
              {errorNotification &&
                <NotificationBubble
                  id="field-incomplete-failure"
                  variant="failure"
                  textSize={'md'}
                  customCSS={"display: flex; align-items: baseline;margin-bottom:30px"}
                >
                  One or more required fields have not been completed. Please review and correct.{" "}
                  <Link
                    customCSS={"margin: 0; color: #086DD2"}
                    size={'md'}
                    onClick={() => {
                      try {
                        const element = document.getElementById(formErrorsArray[0]);
                        element.scrollIntoView({ inline: "center" });
                      } catch (e) {
                        console.log("Error in error focus", e)
                      }
                    }} >
                    See these fields
                  </Link>
                </NotificationBubble>
              }
                {showTabErrorRef.current &&
                <NotificationBubble
                    id="tab-field-incomplete-failure"
                    variant="failure"
                    textColor="brand"
                    textSize={'md'}
                    customCSS={"display: flex; align-items: baseline;margin-bottom:30px"}
                >
                  Your current file(s) are incompatible with your existing tab selections. Please add more file pages to
                  this project or{" "}
                  <Link
                      customCSS={"margin: 0; color: #086DD2"}
                      size={'md'}
                      onClick={() => {
                        try {
                          const tabs = getPropertyId('Tabs_', false)
                          const element = document.getElementById(tabs);
                          element.scrollIntoView({ inline: "center" });
                        } catch (e) {
                          console.log("Error in error focus", e)
                        }
                      }} >
                    modify your tab selections.
                  </Link>
                </NotificationBubble>
                }
              <Slot name="ng_product_below_quantity" data={product} />
              {fileName && renderNewPreview() &&
                <FileOperationWizard
                  fileName={fileName}
                  fileList={fileList}
                  selectedFileSource={selectedFileSource}
                  viewFileDetailsClickHandler={viewFileDetails}
                  replaceFileClickHandler={replaceFileClickHandler}
                  addToMyFileClickHandler={addToMyFileClickHandler}
                  addToMyFileState={addToMyFileState}
                  manageFileHandler={manageFileHandler}
                  isMultiFileProduct={isMultiFileProductRef.current}
                  showReplaceFileLink={showReplaceFileLink}
                  allowUploadEdit= {xmPieSAParametersRef.current && xmPieSAParametersRef.current.allowUploadEditFiles}
                  navigateToFileHandler={(pageIndex) => { 
                    childRef.current && childRef.current.onPageSelect((pageIndex+1));
                    childRef.current && childRef.current.setResetPagination(true);
                    childRef.current && childRef.current.setStartIndex(pageIndex + 1);
                    }} />}
              {renderNewPreview() &&
                <FileSetupDetailsAccordion isBookletProduct={isBookletProduct} fileUploaded={fileName ? true : false} />}
              <DynamicForm
                properties={propertiesObject}
                excelPricingEnabled={excelPricingEnabled}
                errors={errors}
                onChange={onFormChange}
                formData={properties.formData}
                onBlur={handlePropertyBlur}
                properties={propertiesObject}
                sectionToOpen={sectionToOpen}
                sectionsDescription={properties.JSONSchema && properties.JSONSchema.sections}
                productType={product.Type}
                isMobile={isMobile}
                disableATCForStore={disableATCForStoreRef.current}
                isWebGLEnabled={webGlEnabled}
                currentParentUrl={xmPieSAParametersRef.current.parentUrl}
                altProductLink={altProductPresent}
                tabSummary={tabSummaryRef.current}
                tabClickHandler={tabClickHandler}
                showTabError={showTabErrorRef.current}
              />
            </div>
          </div>
          <ProductDeliveryMethod
            className="static-delivery-method"
            productModel={product}
            onDeliveryChange={handleDeliveryChange}
            currentDeliveryMethod={deliveryMethod}
            currentDeliveryServiceID={deliveryService}
            deliveryServices={productDeliveries}
          />
          {/* <ProductOrderSummary
            ref={bottomPriceRef}
            currency={currentCurrency?.Code}
            deliveryMethod={deliveryMethod}
            className="static-order-summary"
            productModel={product}
            quantity={quantity}
            taxFormatType={TaxFormatType}
            priceModel={Object.keys(price).length ? price : null}
            isPriceCalculating={pageState === State.calculatingPrice || pageState === State.loading}
          /> */}
          <div ref={bottomMarkerRef} className="price-bottom-marker"></div>
          {proofModalOpen && <ProductProof
            onAddToCartClick={handleAddToCartButtonClick}
            isModalOpen={proofModalOpen}
            modalClassName="product-instance-proof-modal"
            src={proofUrl}
            type={product.Proof && product.Proof.MimeType ? product.Proof.MimeType : ''}
            onCloseModal={() => setProofModalOpen(!proofModalOpen)}
            isMobile={isMobile}
          />}
          {approvalModalOpen && <ProductApprovalModal product={product} properties={properties}
            onAddToCartClick={addToCartOrSave} orderItem={orderItem}
            productThumbnails={productThumbnails} modalOpen={approvalModalOpen}
            onCloseModal={() => setApprovalModalOpen(!approvalModalOpen)}
            continueButtonText={getContinueButtonText(true)} src={proofUrl}
            excelPricingEnabled={excelPricingEnabled} />}
          <div className='extra-space' />
          {/* <div className="add-to-cart-button-wrapper">
            <Slot name="ng_product_above_add_to_cart" data={product} />
            <div
              className="button button-primary add-to-cart-button"
              id="add-to-cart-button"
              onClick={handleAddToCartButtonClick}
              tabIndex="0"
            >
              {
                pageState === State.loading ||
                  pageState === State.calculatingPrice
                  ? <LoadingDots />
                  : getContinueButtonText()}
            </div>
            <Slot name="ng_product_below_add_to_cart" data={product} />
          </div>
          <Popper
            isNewUpload={isNewUpload}
            bottomPriceRef={bottomPriceRef}
            topPriceRef={topPriceRef}
            stickPriceRef={stickyPriceRef}
            errorCode={popperError}
            forceAddToCartButton={forceAddToCartButtonPopper}
            resetError={resetPopperError}
            popperAffectedSections={popperAffectedSections}
          /> */}
          <Slot name="ng_product_bottom" data={product} />
          {/* {(product.Type === productTypes.DYNAMIC || isNewUpload) &&
            <ProductThumbnailsPreview
              isMobile={isMobile}
              orderItem={orderItem}
              isNewUpload={isNewUpload}
              isModalOpen={thumbnailModalOpen}
              onCloseModal={() => setThumbnailModalOpen(false)}
              productThumbnails={(product.Type === productTypes.DYNAMIC && productThumbnails) ? productThumbnails : null}
              modalClassName="thumbnails-preview"
              onImageChange={(id) => setLastViewImageId(id)}
              poofPreviewError={poofPreviewError}
              onProofPreviewClick={onProofPreviewClick}
              properties={propertiesObject}
            />
          } */}
        </right>
        <sticky is="custom">
          <ProductStickyPrice
              saveProjectForLaterHandler={saveProjectForLaterHandler}
              isSstkProduct={isSstkProduct}
              addToCartDisabled={(isSstkProduct && (isEmpty(sstkProjectId) || sstkProjectId === "NONE") || sstkBlankCanvasRef.current) || disableATCForStoreRef.current || isDisableATCRef.current || (isNewSimplePrintProduct && isEmpty(fileAttachPropValue))}
              properties={properties}
              longPrice={TaxFormatType === 3}
              onClick={handleAddToCartButtonClick}
              addToCartBtnText={getContinueButtonText()}
              priceModel={price}
              isPriceLoading={pageState === State.loading || pageState === State.calculatingPrice}
              disabled={pageState === State.loading || pageState === State.calculatingPrice}
              showMinimumPrice={!!price.IsMinimumPrice}
              productThumbnails={(product.Type === productTypes.DYNAMIC && productThumbnails) ? productThumbnails : null}
              onImageClick={() => setThumbnailModalOpen(true)}
              lastViewImageId={lastViewImageId}
              // ref={stickyPriceRef}
              isNewUpload={isNewUpload}
              isNewDocumentMobileView={renderNewPreview() && (currentBreakpoint === 'smXmpie' || currentBreakpoint === 'xs' || currentBreakpoint === 'xxs') ? true : false}
          />
        </sticky>
      </ProductLayout>
    </>
  )
}

      export default StaticProduct
