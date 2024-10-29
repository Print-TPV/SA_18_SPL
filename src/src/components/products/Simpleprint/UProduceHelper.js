import { generateRandomNumber, sleep } from './PreviewHelper'

const UPRODUCE_ENV = 'PROD';
const PAGE_SIZE_LEGAL = 'Legal';
const PAGE_SIZE_LEDGER = 'Ledger';
export const previewJobDevConfig = {
  uproduce_api : "https://staplesdev.xmpiecloud.com/XMPieRestAPI/v1",
  uproduce_api_header: getUProduceAPIDevHeaders(),
  uploadedImageAssetSourceNamePrefix: 'Simple-Print-Images-',
  dataSourceNamePrefix: "Simple-Print-DataSource-",
  uploadedProofAssetSourceId: 2731,
  generatedProofDestination: 5,
  ustore_base_file_attachment_location: 'd:\\XMPie\\uStore\\App\\uStoreShared\\FileAttachments\\'
}

export const previewJobProdConfig = {
  uproduce_api : "https://printservices.staplesadvantage.com/XMPieRestAPI/v1",
  uproduce_api_header: getUProduceAPIProdHeaders(),
  uploadedImageAssetSourceNamePrefix: 'Simple-Print-Images-',
  dataSourceNamePrefix: "Simple-Print-DataSource-",
  uploadedProofAssetSourceId: 177197,
  generatedProofDestination: 5,
  ustore_base_file_attachment_location: '\\\\amznfsx24vt3eei.us.xmcloud.com\\\\uStoreShared\\\\FileAttachments\\\\'
}
export const previewJobConfig = (UPRODUCE_ENV === 'PROD') ? previewJobProdConfig : previewJobDevConfig;

export const getImageAndProofCampaignId = () => {
  return (UPRODUCE_ENV === 'PROD') ? 1164 : 39
}

export const getProofFileAssetSourceId = () => {
  return (UPRODUCE_ENV === 'PROD') ? 177197 : 2731
}

export function getConvertedPdfFilesAssetSourceId() {
  return (UPRODUCE_ENV === 'PROD') ? 133181 : 2616
}

export function getConvertedPdfFilesFolderName() {
  return 'ConvertedPdfFiles';
}

function getUProduceAPIDevHeaders() {
  let myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')
  myHeaders.append('Authorization', 'Basic bW9oYW5yYWoubWFuaWNrYW1Ac3RhcGxlcy5jb206U3RhcGxlc0AxMjM=')
  return myHeaders;
}

function getUProduceAPIProdHeaders() {
  let myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')
  myHeaders.append('Authorization', 'Basic dHB2X3Vwcm9kX2FwaUBzdGFwbGVzLmludmFsaWQ6TGR0SWVhZVpBc1hXcDQhMw==')
  return myHeaders;
}

export const getCampaignIdBasedOnPaperSize = (size) => {
  if (size === PAGE_SIZE_LEGAL) {
    return (UPRODUCE_ENV === 'PROD') ? 1119 : 37
  } else if (size === PAGE_SIZE_LEDGER) {
    return (UPRODUCE_ENV === 'PROD') ? 1120: 38
  } else {
    return (UPRODUCE_ENV === 'PROD') ? 1134 : 36
  }
}

const getPlanIdBasedOnPaperSize = (size) => {
  if (size === PAGE_SIZE_LEGAL) {
    return (UPRODUCE_ENV === 'PROD') ? 1106: 33
  } else if (size === PAGE_SIZE_LEDGER) {
    return (UPRODUCE_ENV === 'PROD') ? 1107 : 34
  } else {
    return (UPRODUCE_ENV === 'PROD') ? 1121 : 32
  }
}

const getDocumentIdBasedOnPaperSize = (size) => {
  if (size === PAGE_SIZE_LEGAL) {
    return (UPRODUCE_ENV === 'PROD') ? 1924 : 48
  } else if (size === PAGE_SIZE_LEDGER) {
    return (UPRODUCE_ENV === 'PROD') ? 1926 : 49
  } else {
    return (UPRODUCE_ENV === 'PROD') ? 2001 : 47
  }
}

const getOverlayAssetSourceIdBasedOnPaperSize = (size) => {
  if (size === PAGE_SIZE_LEGAL) {
    return (UPRODUCE_ENV === 'PROD') ? 1511 : 1070
  } else if (size === PAGE_SIZE_LEDGER) {
    return (UPRODUCE_ENV === 'PROD') ? 1512 : 1071
  } else {
    return (UPRODUCE_ENV === 'PROD') ? 25763 : 1069
  }
}

export const uploadImagesToAssetSource = async (imageList, newAssetSourceId) => {
  const promises = []
  for (let i = 0; i < imageList.length; i++) {
    const base64Response = await fetch(`${imageList[i]}`)
    const blob = await base64Response.blob()

    let requestOptions = {
      method: 'POST',
      headers: previewJobConfig.uproduce_api_header,
      body: blob
    }
    let fileName = (i + 1) + '.jpg'
    const promise = await fetch(previewJobConfig.uproduce_api + '/asset-sources/' + newAssetSourceId + '/assets/upload?fileName=' + fileName, requestOptions)
      .then(response => response.json())
      .catch(error => console.log('error', error))
    promises.push(promise)
  }

  Promise.all(promises).then(results => {
    console.log('preview images have been uploaded to asset source :' + results.length)
    return results
  });
}

export const getAssetDetails = async (assetSourceId ,fileId) => {
  const assetDetailsReqOptions = {
    method: 'GET',
    headers: previewJobConfig.uproduce_api_header
  }
  return await fetch(previewJobConfig.uproduce_api + '/asset-sources/' + assetSourceId + '/assets/' + fileId, assetDetailsReqOptions).then(res => res.json())
}

export const filterAssetSource = async (campaignId, orderProductId) => {
  const filterAssetSourceReqOptions = {
    method: 'GET',
    headers: previewJobConfig.uproduce_api_header
  }
  let queryParam = "Limit=1&Where=ParentFriendlyId=" + campaignId + " AND Name='" + previewJobConfig.uploadedImageAssetSourceNamePrefix + orderProductId + "'&obtainTotalCount=false";
  return await fetch(previewJobConfig.uproduce_api + '/asset-sources?' + queryParam, filterAssetSourceReqOptions).then(res => res.json())
}

export const cloneAssetSource = async (orderProductId, sourceAssetSourceID, destCampaignId) => {
  let cloneAssetPayload = JSON.stringify({
    "ParentId": destCampaignId,
    "ParentType": "Campaign",
    "Name": previewJobConfig.uploadedImageAssetSourceNamePrefix + orderProductId + "-" + generateRandomNumber()
  });

  let cloneFileAssetSourceReqOptions = {
    method: 'POST',
    headers: previewJobConfig.uproduce_api_header,
    body: cloneAssetPayload
  };
  return await fetch(previewJobConfig.uproduce_api + "/asset-sources/" + sourceAssetSourceID + "/clone", cloneFileAssetSourceReqOptions).then(response => response.json());
}

export const downloadProofPdfFile = async (assetSourceId ,fileId) => {
  const fileBlobFromAssetSourceReqOptions = {
    method: 'GET',
    headers: previewJobConfig.uproduce_api_header
  }
  return await fetch(previewJobConfig.uproduce_api + '/asset-sources/' + assetSourceId + '/assets/' + fileId + '/download?inline=false', fileBlobFromAssetSourceReqOptions).then(res => res.blob())
}

export const createNewDataSource = async (orderProductId, dataSourceCSVFileContent, campaignId) => {
  let createDSRequestOptions = {
    method: 'POST',
    headers: previewJobConfig.uproduce_api_header,
    body: dataSourceCSVFileContent
  }
  let uniqueFileName = previewJobConfig.dataSourceNamePrefix + orderProductId + '_' + generateRandomNumber() + '.csv'
  return await fetch(previewJobConfig.uproduce_api + '/data-sources/upload?parentId=' + campaignId + '&parentType=Campaign' +
    '&fileName=' + uniqueFileName + '&HostStrategy=Default&AutoDetectRecipientTables=true', createDSRequestOptions).then(response => response.json());
}

export const submitProofGenerationJob = async (campaignId, assetSourceId, datasourceId, datasourceName, proofPropsValue, proofFileName) => {
  let submitJobRequest = {
    Job: {
      JobType: 'Proof',
      Context: {
        CampaignId: campaignId
      },
      Priority: 'Immediately',
      TurboInstancesLimit: 1
    },
    Data: {
      RecipientsDataSources: [
        {
          Id: datasourceId,
          FilterType: 'TableName',
          Filter: datasourceName
        }
      ],
      Assets: {
        UseCampaignAssetSources: (assetSourceId < 0) ? true : false,
        Media: 'Print',
        AssetSources: [
          {
            Id: getOverlayAssetSourceIdBasedOnPaperSize(proofPropsValue.paperSize)
          },
          {
            Id: assetSourceId
          }
        ]
      }
    },
    Plan: {
      Id: getPlanIdBasedOnPaperSize(proofPropsValue.paperSize)
    },
    Document: {
      Id: getDocumentIdBasedOnPaperSize(proofPropsValue.paperSize),
      Fonts: {
        UseCampaignFonts: true
      }
    },
    Output: {
      Format: 'PDF',
      FileName: {
        Automatic: false,
        Name: proofFileName,
        AppendJobId: false
      },
      Bleed: {
        Top: 0,
        Bottom: 0,
        LeftOrInside: 0,
        RightOrOutside: 0
      },
      PdfSettings: 'XMPiEQualityProof',
      PdfCompatibilityLevel: 'PdfVersion17',
      PdfStandardsCompliance: 'PDFX42010'
    },
    PostComposition: {
      CopyOutput: {
        Enabled: true,
        DestinationId: previewJobConfig.generatedProofDestination
      }
    }
  }

  let submitJobRequestOptions = {
    method: 'POST',
    headers: previewJobConfig.uproduce_api_header,
    body: JSON.stringify(submitJobRequest)
  }
  return await fetch(previewJobConfig.uproduce_api + '/jobs/submit', submitJobRequestOptions).then(res => res.json())
}

export const fetchProofJobResult = async (jobId) => {
  let requestOptions = {
    method: 'GET',
    headers: previewJobConfig.uproduce_api_header
  };
  return fetch(previewJobConfig.uproduce_api + "/jobs/" + jobId + "?includeOutput=true", requestOptions).then(res => res.json());
}

export const downloadProofJobResult = async (jobId, resultFileName) => {
  let downloadRequestOptions = {
    method: 'GET',
    headers: previewJobConfig.uproduce_api_header
  }
  return await fetch(previewJobConfig.uproduce_api + '/jobs/' + jobId + '/output/' + resultFileName + '/download?inline=false', downloadRequestOptions).then(res => res.blob())
}

export const deleteDataSource = async (dataSourceId) => {
  const deleteDataSourceReqOptions = {
    method: 'DELETE',
    headers: previewJobConfig.uproduce_api_header
  }
  return await fetch(previewJobConfig.uproduce_api + '/data-sources/' + dataSourceId, deleteDataSourceReqOptions)
}

export const deleteAssetSource = async (assetSourceId) => {
  const deleteAssetSourceReqOptions = {
    method: 'DELETE',
    headers: previewJobConfig.uproduce_api_header
  }
  return await fetch(previewJobConfig.uproduce_api + '/asset-sources/' + assetSourceId, deleteAssetSourceReqOptions)
}

export const createNewLocalAssetSource = async (assetSourceName, campaignId) => {
  let createAssetPayload = JSON.stringify({
    "Name": assetSourceName,
    "Enabled": true,
    "Type": {
      "Name": "LOCAL"
    }
  });
  let createLocalAssetSourceReqOptions = {
    method: 'POST',
    headers: previewJobConfig.uproduce_api_header,
    body: createAssetPayload
  };
  return await fetch(previewJobConfig.uproduce_api + "/asset-sources?parentId=" + campaignId + "&parentType=Campaign", createLocalAssetSourceReqOptions).then(response => response.json());
}

export const deleteAssetSourceByNamePrefix = async (assetSourceNamePrefix) => {
  let queryParam = "Limit=100&Where=Name LIKE '" + assetSourceNamePrefix + "'&obtainTotalCount=false";
  const deleteAssetSourceReqOptions = {
    method: 'DELETE',
    headers: previewJobConfig.uproduce_api_header
  }
  return await fetch(previewJobConfig.uproduce_api + '/asset-sources?' + queryParam, deleteAssetSourceReqOptions)
}

export const deleteSpecificAssetFromAssetSource = async (assetSourceId, assetId) => {
  const deleteAssetReqOptions = {
    method: 'DELETE',
    headers: previewJobConfig.uproduce_api_header
  }
  return await fetch(previewJobConfig.uproduce_api + '/asset-sources/' + assetSourceId + '/assets/' + assetId, deleteAssetReqOptions)
}

export const createFileAttachAssetSource = async (orderProductId) => {
  const createFileAttachAssetPayload = JSON.stringify({
    'Name': 'FILE_ATTACH_' + orderProductId,
    'Enabled': true,
    'Type': {
      'Name': 'FILE SYSTEM',
      'AssemblyHandler': 'XMPFileSystemContentSource',
      'Properties': {
        'BaseSearchURL': previewJobConfig.ustore_base_file_attachment_location + orderProductId
      }
    }
  })
  const createFileAttachAssetSourceReqOptions = {
    method: 'POST',
    headers: previewJobConfig.uproduce_api_header,
    body: createFileAttachAssetPayload
  }
  return await fetch(previewJobConfig.uproduce_api + '/asset-sources?parentId=' + getImageAndProofCampaignId() + '&parentType=Campaign', createFileAttachAssetSourceReqOptions).then(response => response.json())
}

export const deleteFileAttachAssetSource = async (id) => {
  const deleteAssetSourceReqOptions = {
    method: 'DELETE',
    headers: previewJobConfig.uproduce_api_header
  }
  return await fetch(previewJobConfig.uproduce_api + '/asset-sources/' + id, deleteAssetSourceReqOptions)
}

export const downloadConvertedAsset = async (id, fileId) => {
  let isAssetExist = false;
  for (let counter = 0; counter < 30; counter++) {
    await sleep(5000);
    let fileData = null;
    try {
      fileData = await checkFileFromAssetSourceResult(id, fileId);
      console.log("polling count - " + counter + " - File data : " + JSON.stringify(fileData));
    } catch (error) {
      console.log("Asset doesn't exist", error);
      if (error && error.Message === "Asset does not exist.") {
        console.log("Polling" + counter + "Asset not available");
      }
    }
    if (fileData && fileData.FileId === fileId) {
      isAssetExist = true;
      break;
    }
  }
  if (isAssetExist) {
    return await fileBlobFromAssetSourceResult(id, fileId);
  } else {
    return null;
  }
}

export const fileBlobFromAssetSourceResult = async (id ,fileId) => {
  const fileBlobFromAssetSourceReqOptions = {
    method: 'GET',
    headers: previewJobConfig.uproduce_api_header
  }
  return await fetch(previewJobConfig.uproduce_api + '/asset-sources/' + id + '/assets/' + fileId + '/download?inline=false', fileBlobFromAssetSourceReqOptions).then(res => res.blob())
}

export const fileListFromAssetSourceResult = async (id) => {
  const fileAttachAssetSourceReqOptions = {
    method: 'GET',
    headers: previewJobConfig.uproduce_api_header
  }
  return  await fetch(previewJobConfig.uproduce_api + '/asset-sources/' + id + '/assets', fileAttachAssetSourceReqOptions).then(response => response.json())
}

export const uploadFileToAssetSource = async (document, assetSourceId, fileName) => {
  let requestOptions = {
    method: 'POST',
    headers: previewJobConfig.uproduce_api_header,
    body: document
  }
  return await fetch(previewJobConfig.uproduce_api + '/asset-sources/' + assetSourceId + '/assets/upload?fileName=' + fileName, requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log(result)
      return result
    })
    .catch(error => console.log('error in uploading ', error))
}

export const checkFileFromAssetSourceResult = async (id ,fileId) => {
  const checkFileFromAssetSourceReqOptions = {
    method: 'GET',
    headers: previewJobConfig.uproduce_api_header
  }
  return await fetch(previewJobConfig.uproduce_api + '/asset-sources/' + id + '/assets/' + fileId, checkFileFromAssetSourceReqOptions).then(res => res.json())
}