import React, { useEffect, useRef, useState } from 'react';
import { Container, Column, Row } from '../StaplesUI/Grid/Grid';
import { Link} from '../StaplesUI/Link/Link';
import { Modal } from "../StaplesUI/Modal/Modal";
import { Icon as StaplesIcon } from '../StaplesUI/Icon/Icon';
import { Button } from '../StaplesUI/Button/Button';
import './DocumentPreview.scss';
import { Card } from '../StaplesUI/Card/Card';
import { Tooltip } from '../StaplesUI/Tooltip/Tooltip'
import { Pagination } from '../StaplesUI/Pagination/Pagination';
import {
    DocumentPreviewMainContainer,
    OverlayContainer,
    OverlayImage,
    PageLabel, PreviewContainer,
    StyledDiv,
    StyledImage,PageLabelWrapper
} from './DocumentPreview.styles'
import { useWindowSize } from './useWindowSize';
import { Spinner } from '../StaplesUI/Animations/Spinner';
import LetterOverlayImage from './LetterOverlayImage'
import LedgerOverlayImage from './LedgerOverlayImage'
import LegalOverlayImage from './LegalOverlayImage'
import { NotificationBubble } from '../StaplesUI/NotificationBubble/NotificationBubble';
import {
    calculateAspectRatio,
    checkMemoPadsProduct,
    checkNCRProduct,
    checkStandardPageSize,
    getBookletTotalPage, getIconSize,
    getPageSizeFromStandardSize,
    getStandardPageSize,
    calculatePaperBackground,
    darkShadeCover,
    getPagesArrLeftSideView,
    getPagesArrRightSideView
} from '../Simpleprint/PreviewHelper'
import {
    findNextTabElementIndex, getFont, getFontStyle,
    getTabDetails, getTabIndexArray,
    getTabMatrix, validTabData
} from '../Simpleprint/TabHelper'
import StatementOverlayImage from '../static/StatementOverlayImage'
import QuarterOverlayImage from "../static/QuarterOverlayImage";
import TabOverlay from "../../../assets/svgs/TabOverlay";
import { UStoreProvider } from '@ustore/core'
import { Icon } from '$core-components'


function DocumentPreview({currentProductHasSSTK,webGlEnabled,openSstkModal,sizeId, openUploadLocalModelHandler, forwardedRef, basePreview, propertiesObj, getPropertyId, updateProperties, renderSide, currentBreakpoint, previousBasePreview, isBookletProduct, isEdit, orderItem, isMultiFileProduct, productId, isSstkProduct }) {
    const basePreviewObject = React.useRef(null)
    const previewContentRef = React.useRef(null)
    const previewContainerRef = React.useRef(null)
    const styledDivRef = React.useRef(null)
    const [totalPage, setTotalPage] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [currentPageNumber, setCurrentPageNumber] = useState()
    const [imgArry, setImgArry] = useState(null);
    const [startIndex, setStartIndex] = useState(1)
    const [resetPagination, setResetPagination] = useState(false)
    const windowSize = useWindowSize();
    const [scaleDelta, setScaleDelta] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [docFile, isDocFile] = useState(false);
    const [fileSize, setFileSize] = useState(null);
    const [fileName, setFileName] = useState('');
    const [pageSize, setPageSize] = useState(null);
    const [pageOrientation, setPageOrientation] = useState(null);
    const [isPrintToEdge, setPrintToEdge] = useState(false);
    const [isColorPrint, setColorPrint] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [isPortrait, setPortrait] = useState(false);
    const [sides, setSides] = useState(null);
    const [overlayContainerWidth, setOverlayContainerWidth] = useState(null);
    const [overlayContainerHeight, setOverlayContainerHeight] = useState(null);
    const [drilling, setDrilling] = useState(null)
    const [lamination, setLamination] = useState(null)
    const [folding, setFolding] = useState(null)
    const [cutting, setCutting] = useState(null)
    const [stapling, setStapling] = useState(null)
    const [paperBackground, setPaperBackground] = useState(null)
    const [nextPage, setNextPage] = useState(null)
    const [isFilePasswordProtected, setFilePasswordProtected] = useState(false)
    const [fileExtension, setFileExtension] = useState(null)
    const [isUnsupported, setIsUnsupported] = useState(false)
    const [bookletTotalPage, setBookletTotalPage] = useState(0)
    const [selectedPage, setSelectedPage] = useState(1)
    const [paperTypeOptions, setPaperTypeOptions] = useState(null)
    const [isNCRProduct, setIsNCRProduct] = useState(false)
    const [isMemoPadsProduct, setIsMemoPadsProduct] = useState(false)
    const [maxPageAllowedError, setMaxPageAllowedError] = useState(false)
    const prevSidesRef = useRef('');
    const [booklet, setBooklet] = useState(null)
    const [bindingSide, setBindingSide] = useState(null)
    const [bindingType, setBindingType] = useState(null)
    const [bindingTypeOptions, setBindingTypeOptions] = useState(null)
    const [openCreateDesignModal, setOpenCreateDesignModal] = useState(false)
    const [bindingFrontCover, setBindingFrontCover] = useState(null)
    const [bindingBackCover, setBindingBackCover] = useState(null)
    const currentState = UStoreProvider.state.get();
  
    const handleCloseModal=()=>{
       setOpenCreateDesignModal(false)
    }
    const [tabData, setTabData] = useState({})
    const [tabMatrix, setTabMatrix] = useState([])
    const [tabDetails, setTabDetails] = useState([])
    const [hasTab, setHasTab] = useState(false)
    const [totalBackSideTabs, setTotalBackSideTabs] = useState([])
    const stringifyTabDataRef = useRef();
    const openUploadModelHandler = (modalType) => {
        let openModelParam = '';
        setFilePasswordProtected(false);
        setIsUnsupported(false);
        setMaxPageAllowedError(false);
        if (modalType === 'LocalFiles') {
            openModelParam = 'showOnlyLocalFilesModal';
            // Commenting used for Local development
            // openUploadLocalModelHandler()
        } else if (modalType === 'MyFiles') {
            openModelParam = 'showOnlyMyFilesModal';
        }
        var obj = {};
        if (isMultiFileProduct) {
        obj = {
            isMultiFile: true,
            orderProductId: orderItem.FriendlyID
        }
        }
        if (window && window.parent !== window) {
            window.parent.postMessage({
                xmPieOpenDrawerRequest: {
                    detail: {
                        [openModelParam]: true,
                        productId: productId,
                        landingPage: 'XMPIE_SIMPLE_PRINT',
                        ...obj
                    }
                }
            }, "*");
        }
    }

    const openCreateModelHandler = () => {
        setOpenCreateDesignModal(true)
    } 
       
    useEffect(() => {
        if (!styledDivRef.current || !previewContainerRef.current) return
        const styledDivWidth = styledDivRef.current.clientWidth
        const styledDivHeight = styledDivRef.current.clientHeight
        const previewContainerWidth = previewContainerRef.current.clientWidth
        const previewContainerHeight = previewContainerRef.current.clientHeight
        let calculatedWidth = ''
        // finishing overlay container should be 5% larger
        if (nextPage != null) {
            //double sided. Add 8px margin between 2 divs
            calculatedWidth = (styledDivWidth * 2) + 8
        } else {
            calculatedWidth = styledDivWidth
        }
        let overlayContainerWidth;
        let overlayContainerHeight;
        if (hasTab) {
            overlayContainerWidth = calculatedWidth + (0.10 * calculatedWidth);
            overlayContainerHeight = styledDivHeight + (0.10 * styledDivHeight);
        } else {
            overlayContainerWidth = calculatedWidth + (0.05 * calculatedWidth);
            overlayContainerHeight = styledDivHeight + (0.05 * styledDivHeight);
        }
        setOverlayContainerWidth(overlayContainerWidth)
        setOverlayContainerHeight(overlayContainerHeight)
        const scaleWidth = previewContainerWidth / overlayContainerWidth
        const scaleHeight = previewContainerHeight / overlayContainerHeight
        const scale = Math.min(scaleWidth, scaleHeight, 1);
        setScaleDelta(scale)
        setIsLoading(true)
    }, [
        imgArry,// please chekc this
        pageSize,
        sides,
        pageOrientation,
        windowSize,
        scaleDelta,
        showLoader,
        nextPage,
        tabData
    ])

    useEffect(() => {
        const pageSizeKeyVal = getPropertyId('Size_', false)
        const pageOrientationKeyVal = getPropertyId('Orientation_', false)
        const printtoedgeKeyVal = getPropertyId('Printtoedge_', false)
        const colorPrintKeyVal = getPropertyId('Color_', false)
        const sidesKeyVal = getPropertyId('Sides_', false)
        const drillingKeyVal = getPropertyId('Drilling_', false)
        const laminationKeyVal = getPropertyId('Lamination_', false)
        const foldingKeyVal = getPropertyId('Folding_', false)
        const cuttingKeyVal = getPropertyId('Cutting_', false)
        const staplingKeyVal = getPropertyId('Stapling_', false)
        const _paperTypeKeyVal = getPropertyId('Papertype_', false)
        const _paperTypeOptionsKeyVal = getPropertyId('Papertypeoptions_', false)
        const _bookletKeyVal = getPropertyId('Bookletfinishing', false)
        const _bindingSideKeyVal = getPropertyId('Bindingside', false)
        const _bindingTypeKeyVal = getPropertyId('Bindingtype', false)
        const _bindingTypeOptionsKeyVal = getPropertyId('Bindingtypeoptions', false)
        const _bindingFrontCoverKeyVal = getPropertyId('Frontcover', false)
        const _bindingBackCoverKeyVal = getPropertyId('Backcover', false)
        const tabDataKeyVal = getPropertyId('tabData_', false)
        const pageCountKeyVal = getPropertyId('page-count_', false)
        const _size = propertiesObj && propertiesObj.formData && propertiesObj.formData[pageSizeKeyVal];
        const _pageOrientation = propertiesObj && propertiesObj.formData && propertiesObj.formData[pageOrientationKeyVal];
        const _printToEdge = propertiesObj && propertiesObj.formData && propertiesObj.formData[printtoedgeKeyVal];
        const _colorPrint = propertiesObj && propertiesObj.formData && propertiesObj.formData[colorPrintKeyVal];
        const _sides = propertiesObj && propertiesObj.formData && propertiesObj.formData[sidesKeyVal]
        const _drilling = propertiesObj && propertiesObj.formData && propertiesObj.formData[drillingKeyVal]
        const _lamination = propertiesObj && propertiesObj.formData && propertiesObj.formData[laminationKeyVal]
        const _folding = propertiesObj && propertiesObj.formData && propertiesObj.formData[foldingKeyVal]
        const _cutting = propertiesObj && propertiesObj.formData && propertiesObj.formData[cuttingKeyVal]
        const _stapling = propertiesObj && propertiesObj.formData && propertiesObj.formData[staplingKeyVal]
        const _paperType = propertiesObj && propertiesObj.formData && propertiesObj.formData[_paperTypeKeyVal]
        const _paperTypeOptions = propertiesObj && propertiesObj.formData && propertiesObj.formData[_paperTypeOptionsKeyVal]
        const _booklet = propertiesObj && propertiesObj.formData && propertiesObj.formData[_bookletKeyVal]
        const _bindingSide = propertiesObj && propertiesObj.formData && propertiesObj.formData[_bindingSideKeyVal]
        const _bindingType = propertiesObj && propertiesObj.formData && propertiesObj.formData[_bindingTypeKeyVal]
        const _bindingTypeOptions = propertiesObj && propertiesObj.formData && propertiesObj.formData[_bindingTypeOptionsKeyVal]
        const _bindingFrontCover = propertiesObj && propertiesObj.formData && propertiesObj.formData[_bindingFrontCoverKeyVal]
        const _bindingBackCover = propertiesObj && propertiesObj.formData && propertiesObj.formData[_bindingBackCoverKeyVal]
        const _stringifyTabData = propertiesObj && propertiesObj.formData && propertiesObj.formData[tabDataKeyVal]
        const _pageCount = propertiesObj && propertiesObj.formData && propertiesObj.formData[pageCountKeyVal]
        setPageSize(getStandardPageSize(_size));
        setIsNCRProduct(checkNCRProduct(_size));
        setIsMemoPadsProduct(checkMemoPadsProduct(_size));
        setPageOrientation(_pageOrientation);
        setSides(_sides)
        setDrilling(_drilling)
        setLamination(_lamination)
        setFolding(_folding)
        setCutting(_cutting)
        setStapling(_stapling)
        setBooklet(_booklet)
        setBindingSide(_bindingSide)
        setBindingType(_bindingType)
        setBindingTypeOptions(_bindingTypeOptions)
        setBindingFrontCover(_bindingFrontCover)
        setBindingBackCover(_bindingBackCover)
        setPaperTypeOptions(_paperTypeOptions)
        if (stringifyTabDataRef.current !== _stringifyTabData) {
            const _validAndSortedTabData = validTabData(_stringifyTabData ? JSON.parse(_stringifyTabData) : {}, _pageCount);
            setTabData(_validAndSortedTabData)
            setHasTab(_validAndSortedTabData && _validAndSortedTabData.details && _validAndSortedTabData.details.length > 0 ? true : false)
            stringifyTabDataRef.current = _stringifyTabData
        }
        const _paperBackground = calculatePaperBackground(_paperType, _paperTypeOptions)
        setPaperBackground(_paperBackground)
        if (_printToEdge && _printToEdge.toLowerCase() === 'true') {
            setPrintToEdge(true);
        } else {
            setPrintToEdge(false);
        }
        if (_colorPrint && _colorPrint.toLowerCase() === 'true') {
            setColorPrint(true);
        } else {
            setColorPrint(false);
        }
    }, [propertiesObj])

    useEffect(() => {
        basePreviewObject.current = basePreview;
        if (basePreview) {
            uploadDocumentHandler();
        }
    }, [basePreview])


    useEffect(() => {
        if (hasTab) {
            const tabMatrix = getTabMatrix(tabData)
            setTabMatrix(tabMatrix)
            const tabDetails = getTabDetails(tabMatrix, 0)
            setTabDetails(tabDetails)
        }
        if (basePreviewObject.current) {
            setStartIndex(1)
            if (darkShadeCover.includes(bindingFrontCover)) {
                setCurrentPage(-1)
                setCurrentPageNumber(1)
                setNextPage(null)
                setResetPagination(prev => !prev)
            } else if (hasTab && tabData.before && tabData.details.some(detail => detail.page === 1)) {
                setCurrentPage(null)
                setCurrentPageNumber(1)
                setNextPage(null)
                setResetPagination(prev => !prev)
            } else {
                handlePageClick(0, false)
            }
        }
    }, [bindingFrontCover, bindingBackCover, tabData, basePreview])

    const uploadDocumentHandler = () => {
        const totalPages = basePreviewObject.current.getTotalPages()
        setTotalPage(totalPages)
        setStartIndex(1)
        isBookletProduct ? setBookletTotalPage(getBookletTotalPage(totalPages)) : setBookletTotalPage(0)
        handlePageClick(0, true)
    }

    React.useImperativeHandle(forwardedRef, () => ({
        _setFilePasswordProtected,
        _setShowLoader,
        _isDocFile,
        _setFileName,
        _setFileSize,
        _setIsUnsupported,
        _setFileExtension,
        _setMaxPageAllowedError,
        onPageSelect,
        setResetPagination,
        setStartIndex
    }));

    const _setFilePasswordProtected = (value) => {
        setFilePasswordProtected(value)
    }

    const _setShowLoader = (value) => {
        setShowLoader(value)
    }

    const _isDocFile = (value) => {
        isDocFile(value)
    }

    const _setFileName = (value) => {
        setFileName(value)
    }
    const _setFileSize = (value) => {
        setFileSize(value)
    }

    const _setIsUnsupported = (value) => {
        setIsUnsupported(value)
    }

    const _setFileExtension = (value) => {
        setFileExtension(value)
    }

    const _setMaxPageAllowedError = (value) => {
        setMaxPageAllowedError(value)
    }

    const handlePageClick = (page, calculatePageSize) => {
        setCurrentPage(page + 1)
        setCurrentPageNumber(page + 1)
        setNextPage(null)
        basePreviewObject.current.getImagePages(page, null, undefined).then(imgList => {
            if (calculatePageSize) {
                const pageSizeKey = getPropertyId('Size_', false)
                const _size = propertiesObj && propertiesObj.formData && propertiesObj.formData[pageSizeKey]

                if (checkStandardPageSize(_size) && previousBasePreview !== basePreview && !isBookletProduct && !isEdit) {
                    const pageSize = basePreviewObject.current.getPageSize();
                    updateProperties(pageSizeKey, getPageSizeFromStandardSize(pageSize, _size));
                }
                const isPagePortrait = basePreviewObject.current.getPortrait()
                setPortrait(isPagePortrait);
                if (pageOrientation === 'Portrait' && !isPagePortrait && !isBookletProduct) {
                    const pageOrientationKeyVal = getPropertyId('Orientation_', false)

                    updateProperties(pageOrientationKeyVal, 'Landscape');
                }
            }
            setImgArry(imgList)
        })
    }
  
    const PreviewLabel = () => {
        const showSide=  sides === 'HeadToHead' || sides === 'HeadToFoot' || isBookletProduct
        return ( renderSide === 'right' ? showSide && currentPage % 2 === 0 ? <PageLabel>{'BACK'}</PageLabel> : <PageLabel>{'FRONT'}</PageLabel>:
                renderSide === 'left'&&showSide ?( currentPageNumber!==1 && currentPageNumber!=='Front' && currentPageNumber!=='Tab' && currentPageNumber!==totalPage && currentPageNumber !=='End'  ?
                    <PageLabelWrapper><PageLabel width='50%'>{'BACK'}</PageLabel><PageLabel width='50%'>{'FRONT'}</PageLabel></PageLabelWrapper>:
                    <PageLabelWrapper>{(currentPageNumber==1 ||currentPageNumber=='Front' || currentPageNumber=='Tab') &&<PageLabel width='100%'>{'FRONT'}</PageLabel>}{(currentPageNumber==totalPage || currentPageNumber =='End')&&<PageLabel width='100%'>{'BACK'}</PageLabel>}</PageLabelWrapper>)
                :<></>
            )

    }
    const calculateAndSetPageStateBooklets = (page) => {
        if (page == bookletTotalPage && totalPage !== 1) {
            setCurrentPage(totalPage)
            setNextPage(null)
            return totalPage
        } else if (page == bookletTotalPage) {
            setCurrentPage(0)
            setNextPage(null)
            return 0
        } else {
            setCurrentPage(-1)
            setNextPage(0)
            return 0
        }
    }

    /**
     * Find next tab details and set it as a preview
     * @param {String} page - Selected page number
     * @param {Array} pagesArr - Array of page number
     * @return {Array} - Sorted tab details
     */
    const setTabOnPageSelect = (page, pagesArr) => {
        const indexOfCurrentPage = pagesArr.findIndex(element => element === page);
        const nextTabElementIndex = findNextTabElementIndex(pagesArr, indexOfCurrentPage);
        if (nextTabElementIndex) {
            const columnIndex = getTabIndexArray(pagesArr).findIndex(element => element === nextTabElementIndex);
            const tabDetails = getTabDetails(tabMatrix, columnIndex);
            setTabDetails(tabDetails);
        } else {
            setTabDetails([]);
        }
    }

    const onPageSelect = (page , index) => {
        setIsLoading(false);
        setStartIndex(0)
        setCurrentPageNumber(page)
        const pagesArr = getPagesArr();
        if (hasTab) {
            if (page.toString() !== 'Tab' && !page.toString().includes(',Tab')) {
                setTabOnPageSelect(page, pagesArr);
            }
            const tabIndexArray = getTabIndexArray(pagesArr);
            setTotalBackSideTabs(tabIndexArray.filter(num => num < index));
        }
        if (page.toString().includes(',')) {
            const _currentPage = page.split(',')[0]
            const _nextPage = page.split(',')[1]
            page = _currentPage
            if (isBookletProduct && _currentPage == totalPage && totalPage < bookletTotalPage && totalPage !== 1) {
                setCurrentPage(-1)
                setNextPage(_nextPage)
            } else if (isBookletProduct && _nextPage == totalPage && totalPage < bookletTotalPage && totalPage !== 1) {
                setCurrentPage(_currentPage)
                setNextPage(0)
            }else if (_currentPage === 'Tab' && _nextPage === 'End') {
                const columnIndex = getTabIndexArray(pagesArr).findIndex(element => element === index);
                const tabDetails = getTabDetails(tabMatrix, columnIndex);
                setTabDetails(tabDetails);
                setCurrentPage(null)
                setNextPage(0)
                page = 0
            } else if (_nextPage === 'End') {
                setCurrentPage(_currentPage)
                setNextPage(0)
            } else if (_currentPage === 'Front' && _nextPage === 'Tab') {
                const columnIndex = getTabIndexArray(pagesArr).findIndex(element => element === index);
                const tabDetails = getTabDetails(tabMatrix, columnIndex);
                setTabDetails(tabDetails);
                setCurrentPage(-1)
                setNextPage(-1)
                page = 0
            } else if (_currentPage === 'Front') {
                setCurrentPage(-1)
                setNextPage(_nextPage)
                page = _nextPage
            } else if ((/(?=.*\d)(?=.*B)/.test(_currentPage) || _currentPage === 'Tab') && _nextPage === 'Tab') {
                const columnIndex = getTabIndexArray(pagesArr).findIndex(element => element === index);
                const tabDetails = getTabDetails(tabMatrix, columnIndex);
                setTabDetails(tabDetails);
                setCurrentPage(null)
                setNextPage(-1)
                page = 0
            }  else if (_nextPage === 'Tab') {// set overlay
                const columnIndex = getTabIndexArray(pagesArr).findIndex(element => element === index);
                const tabDetails = getTabDetails(tabMatrix, columnIndex);
                setTabDetails(tabDetails);
                setCurrentPage(_currentPage)
                setNextPage(-1)
            } else if (_currentPage === 'Tab') {
                setCurrentPage(null)
                setNextPage(_nextPage)
                page = _nextPage
            }  else {
                setCurrentPage(_currentPage)
                setNextPage(_nextPage)
            }
        } else if (page.toString() === 'Front') {
            setCurrentPage(-1)
            setNextPage(null)
            page = 0
        } else if (page.toString() === 'End') {
            setCurrentPage(0)
            setNextPage(null)
            page = 0
        } else if (page.toString() === 'Tab') {
            const columnIndex = getTabIndexArray(pagesArr).findIndex(element => element === index);
            const tabDetails = getTabDetails(tabMatrix, columnIndex);
            setTabDetails(tabDetails);
            setCurrentPage(null)
            setNextPage(null)
            page = 0
        } else {
            setCurrentPage(page)
            setNextPage(null)
            if (isBookletProduct && page == totalPage && totalPage < bookletTotalPage && totalPage !== 1) {
                setCurrentPage(-1)
            }
        }
        if (isBookletProduct) {
            setSelectedPage(page)
            if (page > totalPage) {
                page = calculateAndSetPageStateBooklets(page)
            }
        }
        basePreviewObject.current.getImagePages(page, imgArry, isPortrait).then(imgList => {
            setImgArry(imgList)
        })
    }

    const OverlayImageContainer = (props) => {
        let overlayImageArray = props.pageSize === 'Letter' ? LetterOverlayImage(props)
            : props.pageSize === 'Ledger' ? LedgerOverlayImage(props)
                : props.pageSize === 'Legal' ? LegalOverlayImage(props)
                    : props.pageSize === 'Statement' ? StatementOverlayImage(props)
                        : props.pageSize === 'Quarter' ? QuarterOverlayImage(props)
                        : ''
        if (overlayImageArray && Object.keys(overlayImageArray).length > 0) {
            return Array.isArray(overlayImageArray) && overlayImageArray.map(function (imageUrl, index) {
                return imageUrl ? <OverlayImage
                    src={imageUrl}
                    zIndex={index + 1}
                    customCSS={hasTab ? 'width: 95%; height: 95%' : 'width: 100%; height: 100%'}
                /> : <></>
            })
        } else {
            return <></>
        }
    }

    const closeModalHandler = () => {
        setShowLoader(false)
    }

    // TODO need to get dynamic page size
       const getPadding = () => {
        const _aspectRatio = calculateAspectRatio(pageSize);
        if (_aspectRatio) {
            return calculatePadding(_aspectRatio[0], _aspectRatio[1])
        }
        switch (getStandardPageSize(pageSize)) {
            case 'Letter':
                return calculatePadding(8.5, 11)
            case 'Legal':
                return calculatePadding(8.5, 14)
            case 'Ledger':
                return calculatePadding(11, 17)
            case 'Statement':
                return calculatePadding(5.5, 8.5)
            case 'Quarter':
                return calculatePadding(4.25, 5.5)
            default:
                return '0%'
        }
    }

    /**
     * Used to calculate padding percentage for different page sizes.
     * Converts input width & height into pixels.
     * Gets noBleedMargin per pixels.
     * Gets noBleedMargin average of width & height.
     * Converts average into percentage to get final padding .
     * @param {Number} width - Width of paper in inches
     * @param {Number} height - Height of paper in inches
     * @return {String} - Return padding in percentage
     */
    const calculatePadding = (width, height) => {
        const inchToPixels = 96
        const noBleedMargin = 12
        const noBleedMarginWidthPerPixels = noBleedMargin / (width * inchToPixels)
        const noBleedMarginHeightPerPixels = noBleedMargin / (height * inchToPixels)
        const padding = (noBleedMarginWidthPerPixels + noBleedMarginHeightPerPixels) / 2
        return nextPage != null ? `${(padding / 2) * 100}%` : `${padding * 100}%`
    }
    const handleModifySelection =()=>{
        const element =document.getElementById(sizeId)
        setOpenCreateDesignModal(false)
        element.scrollIntoView({ behavior:'smooth',inline: 'start' });
        
    }
    const hasDarkFrontCover = bindingFrontCover && darkShadeCover.includes(bindingFrontCover) && (bindingType === 'Comb' || bindingType === 'Coil'|| bindingType === 'Staple') ? true : false
    const hasDarkBackCover = bindingBackCover && darkShadeCover.includes(bindingBackCover) && (bindingType === 'Comb' || bindingType === 'Coil'|| bindingType === 'Staple') ? true : false
    const hasBindingBackCover = bindingBackCover && bindingBackCover !== 'NONE' && bindingBackCover !== '' && (bindingType === 'Comb' || bindingType === 'Coil' || bindingType === 'Staple') ? true : false

    const getPagesArr = () => {
        const totalItems = isBookletProduct ? bookletTotalPage : totalPage;
        const isDoubleSidedView = (sides === 'HeadToHead' || sides === 'HeadToFoot') ? true : isBookletProduct ? true : false
        const tabCount = tabData && tabData.details && tabData.details.length > 0 ? tabData.details.length : 0;
        const pagesArr = isDoubleSidedView && renderSide === 'left' ? getPagesArrLeftSideView(totalItems, hasDarkFrontCover, hasDarkBackCover, tabCount, tabData)
            : (isDoubleSidedView && renderSide === 'right') || hasDarkFrontCover || hasBindingBackCover || hasTab ? getPagesArrRightSideView(totalItems, hasDarkFrontCover, hasBindingBackCover, tabCount, tabData)
                : Array.from({length: totalItems}, (_, i) => i + 1)
        return pagesArr;
    }

    const ShowProgress = () =>
    (<>
        {showLoader && (!docFile ? <div className='spinner_view_mask'>
            <div className='spinner_center'>
                <Spinner
                    size="lg"
                    color="black" />
            </div>
        </div> : <div className='spinner_view_mask'>
            <Modal
                showModal={true}
                hasCloseButton={true}
                closeOnBackdropClick={false}
                onClose={closeModalHandler}>
                <div className='modal-elements'>
                    <div className='spinner-header'>Convert File</div>

                    <Spinner
                        size="lg"
                        color="black" />
                    <div className='spinner-description'>Converting to PDF...</div>
                </div>
                <span className='file-name'>{fileName}</span>
                {fileSize && <span className='file-size'>{fileSize}</span>}

            </Modal>
        </div>)}
    </>);
    if (imgArry && Object.keys(imgArry).length > 0) {
        return (
            <>
                {showLoader && <ShowProgress />}
                <DocumentPreviewMainContainer isSstkProduct={isSstkProduct}>
                    <PreviewContainer ref={previewContainerRef} >
                        <PreviewLabel />
                        <OverlayContainer scale={scaleDelta} height={overlayContainerHeight}
                            width={overlayContainerWidth}>
                            {isLoading ?
                                <>
                                {hasTab ?
                                    <TabOverlay tabSize={tabData.size}
                                                font={getFont(tabData.font)}
                                                fontStyle={getFontStyle(tabData.fontStyle)}
                                                fontSize={`${tabData.fontSize}pt`} tabDetails={tabDetails}
                                                pageOrientation={pageOrientation}
                                                isFront={(currentPage === 0  || (currentPage === totalPage && (sides === 'HeadToHead' || sides === 'HeadToFoot'))) && nextPage === null ? false : true}
                                                totalTabs={tabData && tabData.details && tabData.details.length}
                                                nextPage={nextPage}
                                                totalBackSideTabs={totalBackSideTabs.length}/> : <></>}
                                <OverlayImageContainer drilling={drilling} pageSize={pageSize}
                                pageOrientation={pageOrientation}
                                sides={sides} currentPage={currentPage} nextPage={nextPage}
                                folding={folding}
                                totalPage={totalPage} lamination={lamination} cutting={cutting}
                                stapling={stapling}
                                renderSide={renderSide}
                                bookletTotalPage={bookletTotalPage}
                                selectedPage={selectedPage}
                                isBookletProduct={isBookletProduct}
                                booklet={booklet}
                                bindingType={bindingType}
                                bindingSide={bindingSide}
                                bindingTypeOptions={bindingTypeOptions}
                                bindingFrontCover={bindingFrontCover}
                                bindingBackCover={bindingBackCover}
                                hasDarkFrontCover={hasDarkFrontCover}
                                hasDarkBackCover={hasDarkBackCover}
                                paperTypeOptions={paperTypeOptions}
                                isNCRProduct={isNCRProduct}  
                                isPrintToEdge={isPrintToEdge} // Ensure this prop is passed                            
                                isMemoPadsProduct={isMemoPadsProduct}
                                hasTabBeforeFirstPage={hasTab && tabData.before && tabData.details.some(detail => detail.page === 1) ? true : false}
                                hasTabAfterLastPage={hasTab && (sides === 'HeadToHead' || sides === 'HeadToFoot') ? false : true}/> </>: null}
                            <StyledDiv
                                ref={styledDivRef}
                                pageSize={pageSize}
                                pageOrientation={pageOrientation}
                                isPrintToEdge={isPrintToEdge}
                                nextPage={nextPage}
                                sides={sides}
                                float={isBookletProduct ? '' : 'left'}
                                paperBackground={paperBackground}
                                isColorPrint={isColorPrint}
                                currentPage={currentPage}
                                aspectRatio={calculateAspectRatio(pageSize)}
                                padding={getPadding()}
                               
                            >
                                {currentPage !== 0 && currentPage !== -1 && imgArry[currentPage]&& <>
                                    <StyledImage
                                        src={imgArry[currentPage]}
                                        pageOrientation={pageOrientation}
                                        isColorPrint={isColorPrint}
                                        ref={previewContentRef}
                                        paperBackground={paperBackground}
                                        isPortrait={isPortrait}
                                        sides={(currentPage !== 1 && currentPage !== 0 && renderSide === 'left') ? sides
                                            : (currentPage % 2 === 0 && renderSide === 'right') ? sides
                                                : ''}
                                    />
                                </>
                                }
                            </StyledDiv>
                            {nextPage != null &&
                                <StyledDiv
                                    pageSize={pageSize}
                                    pageOrientation={pageOrientation}
                                    isPrintToEdge={isPrintToEdge}
                                    nextPage={nextPage}
                                    sides={sides}
                                    paperBackground={paperBackground}
                                    float={isBookletProduct ? '' : 'right'}
                                    currentPage={currentPage}
                                    aspectRatio={calculateAspectRatio(pageSize)}
                                    padding={getPadding()}
                                >
                                    {nextPage !== -1 && imgArry[nextPage] && <>
                                        <StyledImage
                                            src={imgArry[nextPage]}
                                            pageOrientation={pageOrientation}
                                            isColorPrint={isColorPrint}
                                            ref={previewContentRef}
                                            paperBackground={paperBackground}
                                            isPortrait={isPortrait}
                                            sides={''}
                                        />
                                    </>}
                                </StyledDiv>

                            }
                        </OverlayContainer>
                    </PreviewContainer>
                    <Pagination
                        size={(currentBreakpoint === 'xs' || currentBreakpoint === 'xxs') ? 'sm' : 'lg'}
                        startIndex={startIndex}
                        itemsPerPage={1}// this will always be 1
                        isDoubleSidedView={(sides === 'HeadToHead' || sides === 'HeadToFoot') ? true : isBookletProduct ? true : false}
                        onPageSelect={onPageSelect}
                        totalItems={isBookletProduct ? bookletTotalPage : totalPage}
                        showLabel={false}
                        showViewAll={false}
                        resetPagination={resetPagination}
                        pagesArr={getPagesArr()}
                        customCSS={(currentBreakpoint === 'xs' || currentBreakpoint === 'xxs') ? 'margin: 12px 0px 0px 0px' : 'margin: 20px 0px 0px 0px'}
                    />
                </DocumentPreviewMainContainer>
            </>
        )
    } else {
        return (
            <>
                {showLoader && <ShowProgress />}
                {!isSstkProduct && <div class="empty_state_doc_preview">
                    <Container customCSS={'margin: 0px; padding: 0px'}>
                        <Row>
                            <Column spanLG={currentProductHasSSTK?1:2} spanMD={0} spanSM={0} spanXS={0} customCSS={"margin: 0px"} />
                            <Column spanLG={currentProductHasSSTK?10:8} spanMD={12} spanSM={12} spanXS={12} customCSS={"margin: 0px"}>
                                <Row>
                                    <Column span={12}>
                                        <div style={{ textAlign: 'center' }}>
                                            <StaplesIcon
                                                name="paper-sketch"
                                                size={getIconSize(currentBreakpoint)}
                                                color="medium_gray_2" />
                                        </div>
                                    </Column>
                                </Row>
                                <Row>
                                    <Column span={12}>
                                        <React.Fragment>
                                            {isFilePasswordProtected && <NotificationBubble variant="failure" textSize="md" customCSS={"align-items: baseline; margin: 20px 0 30px"}>
                                                We are unable to process password-protected files. Please upload or select another file.
                                            </NotificationBubble>}
                                            {isUnsupported && <NotificationBubble variant="failure" textSize="md" customCSS={"align-items: baseline; margin: 20px 0 30px"}>
                                                The selected file type ({fileExtension}) is not currently supported. Please upload or select another file.
                                            </NotificationBubble>}
                                            {maxPageAllowedError && <NotificationBubble variant="failure" textSize="md" customCSS={"align-items: baseline; margin: 20px 0 30px"}>
                                                The number of pages in the uploaded file exceeds the maximum pages
                                                allowed ({isBookletProduct ? 80 : 2}).
                                            </NotificationBubble>}
                                            <div className='msg_txt'>
                                            <span className='relative-text'> To begin your print project, add your content by choosing one of the options below.
                                            <span className='info-iconstyle'>{( webGlEnabled===false ) ? 
                                                <Tooltip id="webGlDisabledtooltip"
                                                delayHide={1000}
                                                position="top"
                                                maxWidth={currentBreakpoint==='xxs' ? 200 :300} triggerElement={<Icon name="info.svg" width="16px" height="16px" block={false}></Icon>}>
                                                    Shutterstock design feature can be used to create your content. To use this feature, your browser must have certain requirements. <Link target={"_blank"} customCSS={'margin:0;font-size:16px;'} href='https://support.shutterstock.com/s/article/Why-is-the-Create-app-running-so-slow-on-my-computer?language=en_US'>See details.</Link> 
                                                    </Tooltip> : <></>
                                                }</span></span>
                                            </div>
                                        </React.Fragment>
                                    </Column>
                                </Row>
                                <Row >
                                    <Column span={currentProductHasSSTK?4:6}>
                                        <Card
                                            margin={12}
                                            onClick={openUploadModelHandler.bind(this, 'LocalFiles')}
                                            padding={(currentBreakpoint === 'lg' || currentBreakpoint === 'md' || currentBreakpoint === 'sm') ? 'lg' : 'md'}
                                            borderRadius="lg"
                                            cardCustomCSS={`margin: 0 6px 0 0; padding:20px 16px 20px 16px; height:${currentProductHasSSTK?'210px':'144px'}; position: relative;`}
                                            
                                            isHover={true}
                                            isBorder={true}
                                            isClickable={true}>
                                            <div style={{position: currentProductHasSSTK?'absolute':'',top: '25%',left: '16px', right: '16px'}}>
                                            <div style={{ textAlign: 'center' }}>
                                                <StaplesIcon
                                                    name="upload_preview"
                                                    size={(currentBreakpoint === 'lg' || currentBreakpoint === 'md' || currentBreakpoint === 'sm') ? 48 : 28}
                                                    color={"black"} />
                                            </div>
                                            <div className="upload_txt">
                                                {isMultiFileProduct ? 'Upload files' : 'Upload file'}
                                            </div>
                                            {(currentBreakpoint === 'lg' || currentBreakpoint === 'md' || currentBreakpoint === 'sm' || currentBreakpoint === 'smXmpie') ?
                                                <div className="upload_txt_desc">
                                                    {isMultiFileProduct ? 'Upload files from your device' : 'Upload a file from your device'}
                                                </div> : <></>
                                            }
                                            </div>
                                           
                                        </Card>
                                    </Column>
                                    <Column span={currentProductHasSSTK?4:6}>
                                        <Card
                                            margin={12}
                                            onClick={openUploadModelHandler.bind(this, 'MyFiles')}
                                            padding={(currentBreakpoint === 'lg' || currentBreakpoint === 'md' || currentBreakpoint === 'sm') ? 'lg' : 'md'}
                                            borderRadius="lg"
                                            cardCustomCSS={`margin: 0 6px 0 0; padding:20px 16px 20px 16px; height:${currentProductHasSSTK?'210px':'144px'}; position: relative;`}
                                            
                                            isHover={true}
                                            isBorder={true}
                                            isClickable={true}>
                                                
                                            <div style={{position: currentProductHasSSTK?'absolute':'',top: '25%',left: '16px', right: '16px'}}>
                                            <div style={{ textAlign: 'center' }}>
                                                <StaplesIcon
                                                    name="grid-outline"
                                                    size={(currentBreakpoint === 'lg' || currentBreakpoint === 'md' || currentBreakpoint === 'sm') ? 48 : 28}
                                                    color="black" />
                                            </div>
                                            <div className="upload_txt">
                                                {(currentBreakpoint === 'xs' || currentBreakpoint === 'xxs') ? 'Select My Files' : 'Select from My Files'}
                                            </div>
                                            {(currentBreakpoint === 'lg' || currentBreakpoint === 'md' || currentBreakpoint === 'sm' || currentBreakpoint === 'smXmpie') ?
                                                <div className="upload_txt_desc">
                                                    {isMultiFileProduct ? 'Use existing files from My Files' : 'Use an existing file from My Files'}
                                                </div> : <></>
                                            }
                                            
                                            </div>
                                        </Card>
                                    </Column>
                                    {currentProductHasSSTK &&
                                    <Column span={4}>
                                           <Card
                                            margin={12}
                                            onClick={()=>webGlEnabled && openCreateModelHandler()}
                                            padding={(currentBreakpoint === 'lg' || currentBreakpoint === 'md' || currentBreakpoint === 'sm') ? 'lg' : 'md'}
                                            borderRadius="lg"
                                            cardCustomCSS={`margin: 0; padding:${webGlEnabled?'20px 16px 20px 16px':0}; height:210px; position:relative;`}
                                            isHover={webGlEnabled}
                                            isBorder={true}
                                            isClickable={webGlEnabled}
                                            backgroundColor={webGlEnabled? 'white':'#f8f8f8'}
                                            >
                                           {!webGlEnabled && <div className={'diagonalBorder'}></div>}
                                            <div style={{position: 'absolute',top: '25%',left: '16px', right: '16px'}}>
                                            <div style={{ textAlign: 'center' }}>
                                                <StaplesIcon
                                                    name="design-tool"
                                                    size={(currentBreakpoint === 'lg' || currentBreakpoint === 'md' || currentBreakpoint === 'sm') ? 48 : 28}
                                                    color={!webGlEnabled?'medium_gray_2':'black'} />
                                            </div>
                                            <div className={`upload_txt ${!webGlEnabled && 'text_grey'}`}>
                                               Create your own
                                            </div>
                                            {(currentBreakpoint === 'lg' || currentBreakpoint === 'md' || currentBreakpoint === 'sm' || currentBreakpoint === 'smXmpie') ?
                                                <div className={`upload_txt_desc ${!webGlEnabled && 'text_grey'}`}>
                                                   Start with a blank canvas or choose a template
                                                 </div> : <></>
                                            }
                                            </div>
                                        </Card>
                                    </Column>}
                                </Row>
                            </Column>
                            <Column spanLG={currentProductHasSSTK?1:2} spanMD={0} spanSM={0} spanXS={0} customCSS={"margin: 0px"} />
                        </Row>
                    </Container>
                </div>}
    
               
               {openCreateDesignModal&&
                <Modal hasCloseButton onClose={handleCloseModal}  showModal={true} customCSS={'padding:16px,text-align:end'} >
                <div className='Modal-spacing'>
                <div className='Modal-heading'>Create your own</div>
               <div className={'modal-text text-margin'}>Before the project is started, please confirm the current selections for paper size and orientation as the following:</div> 
               <div className={'modal-text1 text-margin'}>Paper size: <span className='modal-text-bold'>{pageSize} {pageSize=="Letter"&&'8.5"x11"'|| pageSize=="Ledger"&& '11"x17"'|| pageSize=="Legal"&& '8.5"x14"'}</span></div>
               <div className='modal-text1'>Orientation: <span className='modal-text-bold'>{pageOrientation}</span></div>
               <div className='modal-text text-margin'>If you want to change these selections, close this dialog and modify them at the right side of the page.</div>
              
               <div className='align-btns'>
       
        <Link size="lg" color="black" onClick={handleModifySelection } underline>
               Modify selections
            </Link>
                   <Button onClick={() => {
                       const productModeKey = getPropertyId('product-mode_', false);
                       updateProperties(productModeKey, 'sstk');
                       handleCloseModal();
                       openSstkModal();
                   }}>
                       Confirm
                   </Button></div> </div>
               </Modal>}
            </>
        )
    }
}

export default DocumentPreview;