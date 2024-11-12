import React, { useEffect, useRef, useState } from 'react';
import "./SstkEditor.scss";
import LoadSstkApi from "./LoadSstkApi";
import { Spinner } from '../StaplesUI/Animations/Spinner';
import { Modal } from "../StaplesUI/Modal/Modal";
import { NotificationBubble } from '../StaplesUI/NotificationBubble/NotificationBubble';
import { DoubleIcon } from '../StaplesUI/Icon/DoubleIcon';
import { Icon } from '../StaplesUI/Icon/Icon';
import { Button } from '../StaplesUI/Button/Button';
import { TextInput } from '../StaplesUI/TextInput/TextInput';
import { Link } from '../StaplesUI/Link/Link';
import isEmpty from 'lodash/isEmpty';
import SubHeader from '../../layout/Header/SubHeader';

function SstkEditor({openSstkEditorModal,isPriceCalculating, price, showMinimumPrice, sstkProjectId, productHeight, productWidth, productMaxPage, productSafetyMargin, productBleedMargin, setSstkThumbnails, saveProjectTpv, savePdfToProduct, hideCropMarks, lockCanvasDimensions, fileType, sstkProjectName, apiHost, assetCountValue, originalOrderProductId, orderProductId, setShowLoader, showLoader, getUpdatedProjectName, supportEmail, setTpvPropsValue, projectAssetID, pageCountKey, updateProperties, sstkProjectNameKey, isSstkBlankCanvas, sstkBlankCanvas, handleSstkPdf, docRef, pageCountValue, getPageCountOnSstkBack }) {
    
    let editorSdk = null;
    let assetToUpload = [];
    let cachedMetaPeroperties = null;
    const [_editorSdk, setEditorSdk] = useState(null);
    const [currentDesign, setCurrentDesign] = useState(null);
    const sstkContainerRef = useRef(null);
    const sstkEditorRef = useRef(null);
    const [showSpinner, setShowSpinner] = useState(false);
    const [messageType, setMessageType] = useState(null);
    const [config, setConfig] = useState(null);
    const [pdfDesign, setPdfDesign] = useState(null);
    const [pdfDesignAssetId, setPdfDesignAssetId] = useState(null);
    const [projectName, setProjectName] = useState(null)
    const [stockAssetCount, setStockAssetCount] = useState(0)
    const projectAssetIDRef = useRef(projectAssetID);
    const pageCount = useRef(1);

    useEffect(() => {
        projectAssetIDRef.current = projectAssetID;
    }, [projectAssetID])
    useEffect(() => {
        if(!config) {
            fetch(`${apiHost}/tpv/session/api/tpvProxy/print/sstk/printConfig`, { credentials: 'include' })
                .then(response => response && response.json())
                .then(printConfg => {
                    setConfig(printConfg);
                })
        }
    }, [apiHost])

    useEffect(() => {
        if (sstkProjectName) {
            setProjectName(sstkProjectName)
        }
    }, [sstkProjectName])

    useEffect(() => {   
         if(openSstkEditorModal){    
            openSstkEditorHandler();   
          }
    }, [openSstkEditorModal]);

    const myRef = useRef(null); 
    const handleScroll = () => {
        myRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    useEffect(() => {
        if (sstkProjectId && sstkProjectId !== "NONE" && !currentDesign) {
            // setShowSpinner(true)
            // setMessageType("PROJECT_LOADING")
            setShowLoader(true)
            docRef && docRef.current && docRef.current._setShowLoader(true)
            fetch(`${apiHost}/tpv/session/api/tpvProxy/print/sstk/retrieveAssetById/${sstkProjectId}`, { credentials: 'include' })
                .then(resp => resp.json())
                .then(sstkProjectResp => {
                    if (sstkProjectResp && sstkProjectResp.result !== "failure") {
                        const sstkProjectThumbnails = [{ Url: sstkProjectResp.thumbnails && sstkProjectResp.thumbnails.webimage }];
                        const sstkAssetPromises = [];
                        sstkProjectResp.mediaItems && sstkProjectResp.mediaItems.filter(asset => asset.type === "additional").forEach(asset => {
                            if (asset && asset.fileName && asset.fileName.indexOf(".pdf") > 0) {
                                setPdfDesignAssetId(asset && asset.id)
                                sstkAssetPromises.push(fetch(`${apiHost}/tpv/session/api/tpvProxy/print/sstk/assets/${sstkProjectId}/items/${asset.id}/download`, {
                                    credentials: 'include', headers: {
                                        'Content-Type': 'application/json',
                                        'Accept': 'application/json'
                                    }
                                }))
                            } else if (asset && asset.fileName && asset.fileName.indexOf(".json") > 0) {
                                sstkAssetPromises.unshift(fetch(`${apiHost}/tpv/session/api/tpvProxy/print/sstk/assets/${sstkProjectId}/items/${asset.id}/download`, {
                                    credentials: 'include', headers: {
                                        'Content-Type': 'application/json',
                                        'Accept': 'application/json'
                                    }
                                }))
                            }
                        })

                        Promise.all([...sstkAssetPromises])
                            .then(resp => {
                                return Promise.all(resp.map(response => response.json()));
                            })
                            .then(resp => {

                                const designConfig = resp && resp[0];
                                if (designConfig && designConfig.s3_file) {
                                    fetch(designConfig.s3_file)
                                        .then(asst => asst.json())
                                        .then(design => {
                                            setCurrentDesign(design)
                                            try {
                                                const _pageCount = Number(pageCountValue);
                                                if(!isNaN(_pageCount) && _pageCount > 0) {
                                                    pageCount.current = _pageCount;
                                                }
                                            } catch(e) {
                                                // page count parsing fail.
                                                console.error("Error parsing page count.")
                                            }
                                            // setShowSpinner(false)
                                            // setMessageType(null)
                                        })
                                }
                                const fileUrl = resp && resp[1];
                                if (fileUrl && fileUrl.s3_file) {
                                    fetch(fileUrl.s3_file)
                                        .then(response => response.blob())
                                        .then(blob => {
                                            handleSstkPdf(blob)
                                            setShowLoader(false)
                                            //setPdfDesign(blob);
                                        }).catch(e => {
                                            docRef && docRef.current && docRef.current._setShowLoader(false)
                                            setShowLoader(false)
                                        });
                                }
                            })
                            .catch(e => {
                                // setShowSpinner(false)
                                // setMessageType(null)
                                setShowLoader(false)
                                docRef && docRef.current && docRef.current._setShowLoader(false)
                            })
                    } else {
                        // setShowSpinner(false)
                        // setMessageType(null)
                        setShowLoader(false)
                        docRef && docRef.current && docRef.current._setShowLoader(false)
                    }
                })
                .catch(e => {
                    console.error("Error Loading Project ... ")
                    // setShowSpinner(false)
                    // setMessageType(null)
                    setShowLoader(false)
                    docRef && docRef.current && docRef.current._setShowLoader(false)
                })
        }
    }, [sstkProjectId])

    const openSstkEditorHandler = (newDesignFlow) => {
        setShowSpinner(true);
        setMessageType(null);
        setStockAssetCount(assetCountValue);
        fetch(`${apiHost}/tpv/session/api/tpvProxy/print/sstk/retrieveAsset/USER?filterBy=SSTK_Project`, { credentials: 'include' })
            .then(res => res.json())
            .then(resp => {
                setShowSpinner(false);
                assetToUpload = resp.map(asset => {
                    if (asset) {
                        return {
                            "id": asset.id,
                            "thumbnailUrl": asset.thumbnails.thul,
                            "label": asset.name,
                            "width": asset.width,
                            "height": asset.height,
                            "contentType": asset.extension[0],
                            "url": `${apiHost}/tpv/common/api/tpvProxy/print/media/download/${asset.id}`,
                            "deletable": asset.deletable
                        }
                    }
                    return null;
                })
                openSstkEditor(newDesignFlow)
            })
            .catch(e => {
                // Fail silently
                setShowSpinner(false);
                openSstkEditor(newDesignFlow)
            })
    }

    const onRequestUploadAssetHandler = (asset) => {

        const maxSizeInBytes = ((config && config.maxFileSize) ? config.maxFileSize : 100) * 1024 * 1024;

        if (asset.file.size > maxSizeInBytes) {
            setMessageType("UPLOAD_VALIDATION_ERROR")
            return;
        }

        setMessageType("UPLOAD_IN_PROGRESS")
        setShowSpinner(true)
        let metaPropFetch = Promise.resolve({ json: () => cachedMetaPeroperties })
        if (!cachedMetaPeroperties) {
            metaPropFetch = fetch(`${apiHost}/tpv/session/api/tpvProxy/print/sstk/metaproperties`, { credentials: 'include' });
        }
        metaPropFetch
            .then(resp => resp.json())
            .then(metaproperties => {
                if(!(metaproperties && metaproperties.addMethod)) {
                    setShowSpinner(false);
                    setMessageType("UPLOAD_ERROR");
                    return;
                }
                if (!cachedMetaPeroperties) {
                    cachedMetaPeroperties = metaproperties
                }
                const addMethodObj = metaproperties.addMethod.options.filter(addMethod => addMethod.name === "SSTK_Upload")[0];
                const queryParams = new URLSearchParams({
                    fileName: asset.file.name,
                    accountID: "metaproperty." + metaproperties.accountID.id,
                    uploadedUserID: "metaproperty." + metaproperties.uploadedUserID.id,
                    uploadedUserName: "metaproperty." + metaproperties.uploadedUserName.id,
                    addMethod: "metaproperty." + metaproperties.addMethod.id,
                    addMethodLabel: addMethodObj.label,
                    assetOwnerID: "metaproperty." + metaproperties.assetOwnerID.id,
                    assetOwnerName: "metaproperty." + metaproperties.assetOwnerName.id,
                    sharing: "metaproperty." + metaproperties.sharing.id,
                    shared: 0
                });
                const reader = new FileReader();
                reader.readAsArrayBuffer(asset.file);
                reader.onload = (event) => {
                    fetch(`${apiHost}/tpv/session/api/tpvProxy/print/sstk/uploadAsset?${queryParams.toString()}`,
                        {
                            method: 'POST',
                            body: event.target.result,
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/octet-stream'
                            }
                        }).then(resp => resp.json())
                        .then(file => {
                            if (file && file.result === 'failure') {
                                setMessageType("UPLOAD_ERROR")
                                setShowSpinner(false)
                            } else {
                                fetch(`${apiHost}/tpv/session/api/tpvProxy/print/sstk/retrieveAssetById/${file.mediaid}`, { credentials: 'include' })
                                    .then(resp => resp.json())
                                    .then(assetDetails => {
                                        const assetsToUpload = {
                                            "id": assetDetails.id,
                                            "thumbnailUrl": assetDetails.thumbnails.thul,
                                            "label": assetDetails.name,
                                            "width": assetDetails.width,
                                            "height": assetDetails.height,
                                            "url": `${apiHost}/tpv/common/api/tpvProxy/print/media/download/${assetDetails.id}`,
                                            "contentType": assetDetails.extension[0]
                                        }
                                        assetToUpload.unshift(assetsToUpload);
                                        editorSdk.setUploads(assetToUpload);
                                        setShowSpinner(false);
                                        setMessageType("UPLOAD_SUCCESS");
                                        setTimeout(() => {
                                            setMessageType(null);
                                        }, 1000);
                                    })
                            }
                        }).catch(err => {
                            setShowSpinner(false)
                            setMessageType("UPLOAD_ERROR");
                        })
                }
            }).catch(err => {
                setShowSpinner(false)
                setMessageType("UPLOAD_ERROR");
            })
    }

    const onRequestAddAssetToCanvasHandler = (asset) => {

        editorSdk.addAssetToCanvas(asset);
        try {
            var _projectAssetIds = projectAssetIDRef.current.split(",");
            _projectAssetIds = _projectAssetIds.filter(_aId => _aId != 'NONE');
            if(_projectAssetIds.indexOf(asset.item.id) === -1) {
                _projectAssetIds.push(asset.item.id);
                setTpvPropsValue({"projectAssetID" : _projectAssetIds.join(",")})
            }
        } catch(e) {
            //fail silently
        }
    }

    const onRequestDeleteAssetHandler = (asset) => {
        if (asset && asset.item && asset.item.deletable === false) {
            setShowSpinner(false)
            setMessageType("DELETE_NOT_ALLOWED")
            return;
        }
        setShowSpinner(true)
        setMessageType("DELETE_IN_PROGRESS")
        fetch(`${apiHost}/tpv/session/api/tpvProxy/print/sstk/deleteAssetById/${asset.item.id}`, {
            method: 'POST',
            credentials: 'include'
        })
            .then(resp => resp.json())
            .then(resp => {
                assetToUpload = assetToUpload.filter(asst => asst.id !== asset.item.id);
                editorSdk.setUploads(assetToUpload);
                setShowSpinner(false);
                setMessageType("DELETE_SUCCESS");
                setTimeout(() => {
                    setMessageType(null);
                }, 1000);
            })
            .catch(e => {
                setShowSpinner(false)
            })
    }
    const openSstkEditor = async (newDesignFlow) => {
        sstkEditorRef.current.style.display = "block";
        document.getElementsByTagName("body")[0].style.overflowY = 'hidden';

        let __sstk__init__ = 'mF5j9q3817x7ZuwV0NEcV3tbdLZsRmAn';
        try {
            if(config && config._ak)
                __sstk__init__ = atob(config && config._ak);
            else 
                __sstk__init__ = 'mF5j9q3817x7ZuwV0NEcV3tbdLZsRmAn';
        } catch(e) {
            // fail silently
            __sstk__init__ = 'mF5j9q3817x7ZuwV0NEcV3tbdLZsRmAn';
        }
        const opts = {
            apiKey: __sstk__init__,
            env: "Development",
            container: sstkContainerRef.current,
            fullStoryKey: config && config.fullStoryKey ? config.fullStoryKey : 'PPEY7',
            enableUserAnalytics: true
        };
        editorSdk = window.CreateEditor(opts);
        setEditorSdk(editorSdk)
        const options = {
            ctaLabel: 'Save Design',
            safetyMargin: productSafetyMargin,
            bleedMargin: productBleedMargin,
            hideCropMarks: Boolean(hideCropMarks),
            fileType: fileType,
            hideTopBar: true,
            overrideUploadHandler: true,
            document: {
                width: productWidth,
                height: productHeight,
                lockCanvasDimensions: Boolean(lockCanvasDimensions),
                maxPages: productMaxPage
            },
            onRequestUploadAsset: onRequestUploadAssetHandler,
            onRequestAddAssetToCanvas: onRequestAddAssetToCanvasHandler,
            onRequestDeleteAsset: onRequestDeleteAssetHandler,
            onStockContentUpdated: onStockContentUpdatedHandler,
            onAddPageToDocument: addPageToDocumentHandler,
            onDeletePageFromDocument: removePageToDocumentHandler,
            onError: onErrorHandler,
            importAsset: newDesignFlow ? null : currentDesign
        };
        await editorSdk.launchEditor(options);
        editorSdk.setUploads(assetToUpload);
        try {
            if (!newDesignFlow && pageCountKey && getPageCountOnSstkBack && getPageCountOnSstkBack() != pageCount.current) {
                updateProperties(pageCountKey, getPageCountOnSstkBack());
            }
        } catch(e) {
            //fail silently with back button handler
        }
    }

    const addPageToDocumentHandler = () => {
        try {
            pageCount.current++;
            if (pageCountKey) {
                updateProperties(pageCountKey, pageCount.current > productMaxPage ? productMaxPage : pageCount.current);
            }
        } catch(e) {
            //fail silently
        }
    }

    const removePageToDocumentHandler = () => {
        try {
            pageCount.current--;
            if (pageCountKey) {
                updateProperties(pageCountKey, pageCount.current <= 0 ? 1 : pageCount.current);
            }
        } catch(e) {
            //fail silently
        }
    }

    const onStockContentUpdatedHandler = (event) => {
        
        if (event) {
            setTpvPropsValue({"assetCount": (event.inUse.length + "")});
        }
    }

    const onErrorHandler = (errorDetails) => {
        try {
            const { id, message, data } = errorDetails
            console.log(`The user encountered the ${id} error with the message: ${message}`, data)
        } catch (e) {
            console.log('error', e)
        }
    }

    const getDesignHandler = async (fileType, unlicensedImages) => {
        try {
            if(unlicensedImages && unlicensedImages.length > 0) {
                return await _editorSdk.getDesign({
                    fileType: fileType,
                    jpegQuality: 'high',
                    documentWatermarkOptions: {
                        url: "data:image/png;base64,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",
                        isTiled: true,
                        relativeSizePercentage: 25
                    }

                }).catch(e => {
                    console.error("Error Design: {}", e)
                });
            }
        } catch(e) {
            // fail silently
            console.log("Error exporting unlicensed image and design.")
        }
        return await _editorSdk.getDesign({
            fileType: fileType,
            jpegQuality: 'medium'
        }).catch(e => {
            console.error("Error Design: {}", e)
        });
    }

    const exportDesignHandler = async () => {
        return await _editorSdk.exportDesign().catch(e => {
            console.error("Error Export Design: {}", e)
        });
    }

    const closeEditorBlankCanvasHandler = () => {
        setMessageType(null);
        setShowSpinner(false);
        isSstkBlankCanvas(true);
        exportDesignComplete();
        return
    }

    const isBlankCanvas = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(blob);
            reader.onload = (event) => {

                const arrayBuffer = event.target.result;
                const blob = new Blob([arrayBuffer], { type: 'image/png' });
                const url = URL.createObjectURL(blob);
                const img = new Image();
                // Set the source of the Image to the Blob URL
                img.src = url;
                img.onload = function () {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    const imageData = ctx.getImageData(0, 0, img.width, img.height).data;
                    let isBlankWhite = true;
                    for (let i = 0; i < imageData.length; i += 4) {
                        if (imageData[i] !== 255 || imageData[i + 1] !== 255 || imageData[i + 2] !== 255) {
                            isBlankWhite = false;
                            break;
                        }
                    }
                    URL.revokeObjectURL(url);

                    resolve(isBlankWhite);
                }
                img.onerror = function (err) {
                    reject("Error loading the image: " + err);
                };
            }
            reader.onerror = function (err) {
                reject("Error reading the file: " + err);
            };
        });
    }

    const backButtonHandler = () => {
        try {
            if (getPageCountOnSstkBack && getPageCountOnSstkBack() != pageCount.current) {
                updateProperties(pageCountKey, getPageCountOnSstkBack());
            }
        } catch(e) {
            //fail silently with back button handler
        }
    }
    const saveDesign = async (isCloseEditor) => {

        setShowSpinner(true)

        const { FileType } = _editorSdk;
        const unlicensedImages = await _editorSdk.getUnlicensedAssets();

        const currentDesignObj = await exportDesignHandler();
        const design = await getDesignHandler(FileType.jpg, unlicensedImages);
        const designPDF = await getDesignHandler(FileType.pdf, unlicensedImages);// send to base preview and set the object the base preview of the static document
        handleSstkPdf(designPDF, true); // *handle pdf for preview

        if (sstkProjectNameKey && sstkProjectName != projectName) {
            updateProperties(sstkProjectNameKey, projectName);
        }

        const blobPromises = design.pages.map((page, index) => {
            return isBlankCanvas(page.imageBlob).then(isBlank => ({
                pageIndex: index,
                isBlank: isBlank
            }));
        });

        Promise.all(blobPromises)
            .then(results => {
                const allBlank = results.every(result => result.isBlank);
                if (allBlank) {
                    setMessageType("BLANK_CANVAS_WARNING")
                } else {
                    isSstkBlankCanvas(false);
                    setMessageType("SAVE_PROJECT_IN_PROGRESS");
                    if (currentDesignObj && currentDesign && currentDesignObj.document.patches === currentDesign.document.patches) {
                        setShowSpinner(false)
                        if (isCloseEditor) {
                            setMessageType(null);
                            exportDesignComplete();
                            return
                        }

                        if (sstkProjectName !== projectName) {
                            saveProjectTpv(projectName)
                        }

                        setMessageType("PROJECT_SAVED");
                        setTimeout(() => {
                            setMessageType(null);
                        }, 1000);
                        return;
                    }

                    const currentProjectSstkId = sstkProjectId;

                    let metaPropFetch = Promise.resolve({ json: () => cachedMetaPeroperties })
                    if (!cachedMetaPeroperties) {
                        metaPropFetch = fetch(`${apiHost}/tpv/session/api/tpvProxy/print/sstk/metaproperties`, { credentials: 'include' });
                    }
                    metaPropFetch
                        .then(resp => resp.json())
                        .then(metaproperties => {
                            if (!(metaproperties && metaproperties.addMethod)) {
                                setShowSpinner(false)
                                setMessageType("SAVE_PROJECT_ERROR");
                                return;
                            }
                            if (!cachedMetaPeroperties) {
                                cachedMetaPeroperties = metaproperties
                            }
                            const addMethodObj = metaproperties.addMethod.options.filter(addMethod => addMethod.name === "SSTK_Project")[0];
                            const queryParams = new URLSearchParams({
                                fileName: currentDesignObj.document.title + ".jpg",
                                accountID: "metaproperty." + metaproperties.accountID.id,
                                uploadedUserID: "metaproperty." + metaproperties.uploadedUserID.id,
                                uploadedUserName: "metaproperty." + metaproperties.uploadedUserName.id,
                                addMethod: "metaproperty." + metaproperties.addMethod.id,
                                addMethodLabel: addMethodObj.label,
                                assetOwnerID: "metaproperty." + metaproperties.assetOwnerID.id,
                                assetOwnerName: "metaproperty." + metaproperties.assetOwnerName.id,
                                sharing: "metaproperty." + metaproperties.sharing.id,
                                shared: 1
                            });

                            const reader = new FileReader();
                            reader.readAsArrayBuffer(design.pages[0].imageBlob);
                            reader.onload = (event) => {


                                fetch(`${apiHost}/tpv/session/api/tpvProxy/print/sstk/uploadAsset?${queryParams.toString()}`,
                                    {
                                        method: 'POST',
                                        body: event.target.result,
                                        credentials: 'include',
                                        headers: {
                                            'Content-Type': 'application/octet-stream'
                                        }
                                    }).then(resp => resp.json())
                                    .then(file => {
                                        if (file && (file.result === 'failure' || !file.success)) {
                                            setMessageType("SAVE_PROJECT_ERROR")
                                            setShowSpinner(false)
                                            return;
                                        }

                                        let tpvAttributes = {}
                                        tpvAttributes['sstkProjectID'] = file.mediaid;

                                        if (originalOrderProductId !== orderProductId) {
                                            tpvAttributes['originalOrderProductID'] = orderProductId;
                                        }

                                        setTpvPropsValue(tpvAttributes);
                                        if (pageCountKey && design.pages.length != pageCount.current) {
                                            updateProperties(pageCountKey, design.pages.length);
                                        }
                                        let promises = [], filePromiseCount = 0;
                                        design.pages.slice(1).forEach((page, idx) => {
                                            const _pagesQueryParams = new URLSearchParams({
                                                fileName: currentDesignObj.document.title + (idx + 1) + ".jpg",
                                                assetId: file.mediaid
                                            });
                                            promises.push(fetch(`${apiHost}/tpv/session/api/tpvProxy/print/sstk/uploadAdditionalAsset?${_pagesQueryParams.toString()}`,
                                                {
                                                    method: 'POST',
                                                    body: page.imageBlob,
                                                    credentials: 'include',
                                                    headers: {
                                                        'Content-Type': 'application/octet-stream'
                                                    }
                                                }))
                                            filePromiseCount++;
                                        });
                                        const _pdfQueryParams = new URLSearchParams({
                                            fileName: "sstkProjectProof.pdf",
                                            assetId: file.mediaid
                                        });
                                        promises.push(fetch(`${apiHost}/tpv/session/api/tpvProxy/print/sstk/uploadAdditionalAsset?${_pdfQueryParams.toString()}`,
                                            {
                                                method: 'POST',
                                                body: designPDF.pages[0].imageBlob,
                                                credentials: 'include',
                                                headers: {
                                                    'Content-Type': 'application/octet-stream'
                                                }
                                            }));
                                        // }).then(resp => resp.json())

                                        const _queryParams = new URLSearchParams({
                                            fileName: "sstkProject.json",
                                            assetId: file.mediaid
                                        });

                                        currentDesignObj['pendingImages'] = unlicensedImages;
                                        const jsonString = JSON.stringify(currentDesignObj);

                                        const blob = new Blob([jsonString], { type: 'application/json' });

                                        promises.push(fetch(`${apiHost}/tpv/session/api/tpvProxy/print/sstk/uploadAdditionalAsset?${_queryParams.toString()}`,
                                            {
                                                method: 'POST',
                                                body: blob,
                                                credentials: 'include',
                                                headers: {
                                                    'Content-Type': 'application/octet-stream'
                                                }
                                            }))

                                        Promise.all([...promises])
                                            .then(resp => {
                                                return Promise.all(resp.map(response => response.json()));
                                            })
                                            .then(resp => {
                                                setCurrentDesign(currentDesignObj);
                                                setPdfDesign(designPDF);

                                                const sstkAssetPromises = [fetch(`${apiHost}/tpv/session/api/tpvProxy/print/sstk/retrieveAssetById/${file.mediaid}`, { credentials: 'include' })];

                                                if (filePromiseCount > 0) {
                                                    let idx = 0, fileCount = filePromiseCount;
                                                    while (fileCount > 0) {
                                                        sstkAssetPromises.push(fetch(`${apiHost}/tpv/session/api/tpvProxy/print/sstk/assets/${file.mediaid}/items/${resp[idx++].itemId}/download`, { credentials: 'include' }))
                                                        fileCount--;
                                                    }
                                                }
                                                if (currentProjectSstkId && originalOrderProductId && currentProjectSstkId !== "NONE" && (originalOrderProductId === "NONE" || (originalOrderProductId !== "NONE" && originalOrderProductId === orderProductId))) {
                                                    fetch(`${apiHost}/tpv/session/api/tpvProxy/print/sstk/deleteAssetById/${sstkProjectId}`, {
                                                        method: 'POST',
                                                        credentials: 'include'
                                                    }).then(resp => resp.json())
                                                }
                                                Promise.all([...sstkAssetPromises])
                                                    .then(async (resp) => {
                                                        return Promise.all(resp.map(response => response.json()));
                                                    })
                                                    .then(async (sstkAssetResp) => {

                                                        const sstkProjectResp = sstkAssetResp[0];
                                                        const thumbnails = [{ Url: sstkProjectResp && sstkProjectResp.thumbnails && sstkProjectResp.thumbnails.webimage }]

                                                        if (filePromiseCount > 0) {
                                                            let idx = 1;
                                                            while (filePromiseCount > 0) {
                                                                thumbnails.push({ Url: sstkAssetResp && sstkAssetResp[idx] && sstkAssetResp[idx].s3_file })
                                                                idx++;
                                                                filePromiseCount--;
                                                            }
                                                        }

                                                        setSstkThumbnails(thumbnails)
                                                        setStockAssetCount(assetCountValue);

                                                        await savePdfToProduct(designPDF && designPDF.pages[0].imageBlob, null)

                                                        setShowSpinner(false)
                                                        setMessageType("PROJECT_SAVED");
                                                        setTimeout(() => {
                                                            setMessageType(null);
                                                            if (isCloseEditor) {
                                                                sstkEditorRef.current.style.display = "none";
                                                                document.getElementsByTagName("body")[0].style.overflowY = 'visible';
                                                                _editorSdk.closeEditor();
                                                            } else {
                                                                saveProjectTpv(projectName);
                                                            }
                                                        }, 1000);
                                                    })
                                                    .catch(err => {
                                                        //fail silently
                                                    });
                                            })

                                    }).catch(err => {
                                        setShowSpinner(false)
                                        setMessageType("SAVE_PROJECT_ERROR");
                                    })
                            }
                        }).catch(err => {
                            console.error("Error here is : {}", err)
                            setShowSpinner(false)
                            setMessageType("SAVE_PROJECT_ERROR");
                        })
                }
            })
            .catch(error => {
                console.error("An error occurred while processing the images:", error);
            });
    }

    const exportDesignComplete = async () => {
        sstkEditorRef.current.style.display = "none";
        document.getElementsByTagName("body")[0].style.overflowY = 'visible';
        _editorSdk.closeEditor();
    }

    const closeModelHandler = () => {
        setShowSpinner(false)
        setMessageType(null)
    }

    const projectNameChangeHandler = (event, value) => {
        setProjectName(value)
    }

    const triggerFileDownload = (fileBlob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(fileBlob);
        link.download = `${projectName}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const downloadProofHandler = () => {
        if (pdfDesign) {
            triggerFileDownload(pdfDesign && pdfDesign.pages[0].imageBlob)
        } else if (pdfDesignAssetId) {
            fetch(`${apiHost}/tpv/session/api/tpvProxy/print/sstk/assets/${sstkProjectId}/items/${pdfDesignAssetId}/download`, {
                credentials: 'include', headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
                .then(resp => resp.json())
                .then(fileUrl => {
                    if (fileUrl && fileUrl.s3_file) {
                        fetch(fileUrl.s3_file)
                            .then(response => response.blob())
                            .then(blob => {
                                triggerFileDownload(blob)
                            });
                    }
                });
        }
    }

    const exportDesignClickHandler = () => {
        if (projectName) {
            saveDesign(true)
        } else {
            setMessageType("SAVE_PROJECT_DIALOGE_WITH_CLOSE_EDITOR")
        }
    }

    const closeEditorHandler = () => {
        
        if (stockAssetCount !== assetCountValue) {
            setTpvPropsValue({"assetCount": stockAssetCount ? (stockAssetCount + "") : "0"});
        }
        _editorSdk.closeEditor();
    }

    return (
        <> 
            {(showSpinner || messageType) && <Modal
                showModal={true}
                hasCloseButton={true}
                closeOnBackdropClick={false}
                onClose={closeModelHandler}>
                {!messageType && showSpinner && <div>
                    <Spinner
                        size="lg"
                        color="black" />
                </div>}
                {messageType === "PROJECT_LOADING" &&
                    <div className="war-modal-container">
                        <div className='notification-title'>Project loading...</div>
                        <Spinner
                            size="lg"
                            color="black" />
                    </div>}
                {(messageType === "UPLOAD_IN_PROGRESS" || messageType === "SAVE_PROJECT_IN_PROGRESS") &&
                    <div className="war-modal-container">
                        <div className='notification-title'>{messageType === "UPLOAD_IN_PROGRESS" ? "File uploading..." : "Processing design..."}</div>
                        <Spinner
                            size="lg"
                            color="black" />
                        <NotificationBubble variant='info' maxWidth={true} customCSS={"margin-top: 24px; text-align: left"}>
                            {messageType === "UPLOAD_IN_PROGRESS" ?
                                "Your file is uploading. Please be patient as larger files will take longer to upload." :
                                "Please wait while your design is being rendered."}
                        </NotificationBubble>
                    </div>}
                {(messageType === "UPLOAD_SUCCESS" || messageType === "PROJECT_SAVED") &&
                    <div className="war-modal-container">
                        <div className='notification-title'>{messageType === "UPLOAD_SUCCESS" ? "Upload successful!" : "Design successfully saved!"}</div>
                        <div className='center-align-content'>
                            <DoubleIcon size={80}>
                                <Icon name="circle-outline" size={80} color="positive"></Icon>
                                <Icon name="check" size={80} color="black"></Icon>
                            </DoubleIcon>
                        </div>
                    </div>}
                {(messageType === "UPLOAD_ERROR" || messageType === "UPLOAD_VALIDATION_ERROR" || messageType === "SAVE_PROJECT_ERROR") &&
                    <div className="war-modal-container">
                        <div className='notification-title'>{messageType === "SAVE_PROJECT_ERROR" ? "Design save unsuccessful" : "Upload unsuccessful"}</div>
                        <div className='center-align-content'>
                            <DoubleIcon size={80} customCSS={"justify-content: center; align-items: center; display: flex"}>
                                <Icon name="circle" size={80} color="light_gray_2"></Icon>
                                <Icon name="upload" size={40} color="black"></Icon>
                            </DoubleIcon>
                        </div>
                        {messageType !== "SAVE_PROJECT_ERROR" &&
                            <div className='center-align-content'>
                                <button
                                    id="upload-again-button"
                                    className='button button-secondary upload-again-btn'
                                    onClick={closeModelHandler}>Upload again</button>
                            </div>}
                        <NotificationBubble variant='failure' maxWidth={true} customCSS={"margin-top: 12px; text-align: left"}>
                            {messageType === "UPLOAD_ERROR" && <>We’re sorry, we couldn’t upload your file at this moment. Please try again. If you continue to experience issues, reach out to <a rel="noreferrer" href={`mailto:${supportEmail}`} target="_blank">{supportEmail}</a>.</>}
                            {messageType === "SAVE_PROJECT_ERROR" && <>We’re sorry, we couldn’t save your design at this moment. Please try again. If you continue to experience issues, reach out to <a rel="noreferrer" href={`mailto:${supportEmail}`} target="_blank">{supportEmail}</a>.</>}
                            {messageType === "UPLOAD_VALIDATION_ERROR" && <>The file you uploaded doesn't meet our file format or size requirements. Please ensure that the file is no larger than {(config && config.maxFileSize) ? config.maxFileSize : '100'} MB and is one of these file formats: {(config && config.supportedFileExtensions) ? config.supportedFileExtensions : 'JPG, PNG, SVG'}. <a href="javascript:void(0)" onClick={closeModelHandler}>Upload again</a></>}
                        </NotificationBubble>
                    </div>}
                {messageType === "DELETE_NOT_ALLOWED" &&
                    <div className="war-modal-container">
                        <div className='notification-title'>File deleting...</div>
                        <NotificationBubble variant='failure' maxWidth={true} customCSS={"margin-top: 24px; text-align: left"}>
                            Your are not allowed to delete this asset.
                        </NotificationBubble>
                    </div>
                }
                {messageType === "DELETE_IN_PROGRESS" &&
                    <div className="war-modal-container">
                        <div className='notification-title'>File deleting...</div>
                        <Spinner
                            size="lg"
                            color="black" />
                        <NotificationBubble variant='info' maxWidth={true} customCSS={"margin-top: 24px; text-align: left"}>
                            Your file is deleting.
                        </NotificationBubble>
                    </div>}
                {messageType === "DELETE_SUCCESS" &&
                    <div className="war-modal-container">
                        <div className='notification-title'>Delete successful!</div>
                        <div className='center-align-content'>
                            <DoubleIcon size={80}>
                                <Icon name="circle-outline" size={80} color="positive"></Icon>
                                <Icon name="check" size={80} color="black"></Icon>
                            </DoubleIcon>
                        </div>
                    </div>}
                {(messageType === 'SAVE_PROJECT_DIALOGE' || messageType === 'SAVE_PROJECT_DIALOGE_WITH_CLOSE_EDITOR') &&
                    <div className="war-modal-container">
                        <div className='notification-title'>Save project</div>
                        <TextInput
                            name="project name"
                            label="Project name"
                            placeHolder="Enter project name"
                            onChange={projectNameChangeHandler}
                            isRequired={true}
                            value={projectName}
                            maxLength={120} />
                        <div className='save-modal-container'>
                            <Link
                                color="black"
                                onClick={closeModelHandler}>Cancel</Link>
                            <Button
                                size="sm"
                                disabled={(!projectName || (projectName && projectName.trim().length === 0))}
                                onClickHandler={saveDesign.bind(this, messageType === 'SAVE_PROJECT_DIALOGE_WITH_CLOSE_EDITOR' ? true : false)}>Save</Button>
                        </div>
                    </div>
                }
                {(messageType === 'BLANK_CANVAS_WARNING') &&
                    <div className="war-modal-container">
                        <div className='notification-title_'>Continue with blank canvas?</div>
                        <div className='notification-sub_header_'>It doesn't look like you've added anything to your design project. Do you still want to continue with your order?</div>
                        <div className='save-modal-container'>
                            <Link
                                color="black"
                                underline={true}
                                onClick={closeModelHandler}>Back to my design</Link>
                            <Button
                                size="md"
                                onClickHandler={closeEditorBlankCanvasHandler}>Continue</Button>
                        </div>
                    </div>
                }
            </Modal>}
            <LoadSstkApi />
            <div className="sstk-editor" ref={sstkEditorRef}>
                <SubHeader showMinimumPrice={showMinimumPrice}
                    isPriceCalculating={isPriceCalculating}
                    price={price}
                    showSaveAndContinueButton
                    closeEditorHandler={closeEditorHandler}
                    saveDesign={() => { setMessageType("SAVE_PROJECT_DIALOGE") }}
                    exportDesignComplete={exportDesignClickHandler}
                    isSstkOrSimplePrintProduct={true}
                    projectName={sstkProjectName}
                    getUpdatedProjectName={getUpdatedProjectName}
                    disablePopover={showLoader}
                    backButtonHandler={backButtonHandler}
                />
                <div className="edit-container" ref={sstkContainerRef}></div>
            </div>
            {!showLoader && <div className="sstk-editor-wizard">
              
                {(isEmpty(sstkProjectId) || sstkProjectId === "NONE" || !sstkProjectId || sstkBlankCanvas ) ?
                    <Button id="editOpenBtnTxt" onClickHandler={openSstkEditorHandler.bind(this, true)}>Get started</Button> :
                    <div>
                        <Button id="editOpenBtnNew" variant="secondary" onClickHandler={downloadProofHandler}>
                            Download proof
                        </Button>
                        <Button variant="secondary" onClickHandler={openSstkEditorHandler.bind(this, false)}>Edit design</Button>
                    </div>}
            </div>}

        </>
    )
}

export default SstkEditor;