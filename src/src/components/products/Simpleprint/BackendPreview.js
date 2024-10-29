import * as pdfjs from 'pdfjs-dist'
import {
  uploadImagesToAssetSource,
  getImageAndProofCampaignId,
  createNewLocalAssetSource,
  deleteAssetSourceByNamePrefix,
  deleteSpecificAssetFromAssetSource,
  getAssetDetails,
  downloadProofPdfFile,
  filterAssetSource,
  cloneAssetSource,
  createNewDataSource,
  submitProofGenerationJob,
  fetchProofJobResult,
  downloadProofJobResult,
  deleteDataSource,
  deleteAssetSource,
  previewJobConfig,
  getProofFileAssetSourceId,
  getCampaignIdBasedOnPaperSize

} from './UProduceHelper'
import { sleep } from './PreviewHelper'
pdfjs.GlobalWorkerOptions.workerSrc = `worker-loader!pdfjs-dist/build/pdf.worker.js`

export const getDownloadProofFileName = (orderProductId) => {
  return "proof_" + orderProductId;
}
export const deleteAssetSourcesWithImages = async (orderProductId) => {
  if (orderProductId) {
    let assetSourceName = previewJobConfig.uploadedImageAssetSourceNamePrefix + orderProductId + "%";
    try {
      await deleteAssetSourceByNamePrefix(assetSourceName);
    } catch (e) {
      console.error("Unable to delete existing image asset sources, opId - " + orderProductId, e);
    }
  }
}

export const deletePreviouslyGeneratedProof = async (orderProductId) => {
  if (orderProductId) {
    try {
      await deleteSpecificAssetFromAssetSource(getProofFileAssetSourceId(), getDownloadProofFileName(orderProductId) + '.pdf');
    } catch (e) {
      console.error("Unable to delete previously generated proof, opId - " + orderProductId, e);
    }
  }
}

export const generateAssetImagesAndUpload = async (orderProductId, uploadedFileObjBlob) => {
  console.log("Generating asset images for orderProductId :" + orderProductId);
  if (orderProductId && uploadedFileObjBlob) {
    try {
      if (uploadedFileObjBlob) {
        let imagesList = await convertPdfFileToImages(uploadedFileObjBlob)
        console.log('Generating asset images, count :' + imagesList.length)

        if (imagesList && imagesList.length > 0) {
          let imageAssetSourceName = previewJobConfig.uploadedImageAssetSourceNamePrefix + orderProductId;
          // Create Local Asset Source for 'Letter'
          let assetSourceObject = await createNewLocalAssetSource(imageAssetSourceName,getImageAndProofCampaignId());
          //console.log('Asset source for Images has been created, id :' + assetSourceObject.FriendlyId)

          if (assetSourceObject && assetSourceObject.FriendlyId) {
            // Upload thumbnail (JPG) images to newly created asset source
            await uploadImagesToAssetSource(imagesList, assetSourceObject.FriendlyId)
            return true;
          }
        }
      }
    } catch (e) {
      console.log("Unable to generate and upload asset images :", e);
    }
  }
  return false;
}

export const downloadSimplePrintProof = async (proofPropsValues) => {
    console.log("Request received to download proof - " + JSON.stringify(proofPropsValues));
    let proofJobAssetSourceId = -1;
    let proofJobDataSourceId = -1;
    try {
      if (!proofPropsValues || !proofPropsValues.orderProductId || proofPropsValues.orderProductId < 0) {
        return new Error("Invalid request to generate simple print proof");
      }
      let orderProductId = proofPropsValues.orderProductId;
      let pageCount = proofPropsValues.pageCount ? proofPropsValues.pageCount : 0;
      let proofFileName = getDownloadProofFileName(orderProductId);
      let proofFileNameWithExtn = proofFileName + ".pdf";

      // First check, if proof already exist for this orderProductID
      let assetDetail = await getAssetDetails(previewJobConfig.uploadedProofAssetSourceId, proofFileNameWithExtn);
      console.log("Uploaded Image Asset source has been identified - " + JSON.stringify(assetDetail));

      if (assetDetail && assetDetail.FileId === proofFileNameWithExtn) {
        // If exist download the existing one
        return downloadProofPdfFile(previewJobConfig.uploadedProofAssetSourceId, proofFileNameWithExtn)
          .then((proofBlobObj) => {
            console.log("Proof already exist & has been downloaded");
            return proofBlobObj;
          })
          .catch((error) => {
            console.error("Unable to download existing proof", error);
            return null;
          });
      } else {
        // If doesn't exist, generate a new one and download
        console.log("Proof doesn't exist hence generating a new one");
        let proofJobResult = null;
        // Get assetSourceID of uploaded images for this orderProductId
        let assetSourceObj = await filterAssetSource(getImageAndProofCampaignId(), orderProductId);
        if (assetSourceObj && assetSourceObj.Items && assetSourceObj.Items[0]) {
          let uploadedImageAssetSourceId = assetSourceObj.Items[0].FriendlyId;
          let proofJobCampaignId = getCampaignIdBasedOnPaperSize(proofPropsValues.paperSize);

          // Clone original images asset source to targeted proof job campaign
          let clonedAssetSource = await cloneAssetSource(orderProductId, uploadedImageAssetSourceId, proofJobCampaignId);
          if (clonedAssetSource && clonedAssetSource.FriendlyId)  {
            proofJobAssetSourceId = clonedAssetSource.FriendlyId;
            // Build CSV file and Upload it to a new datasource
            let dataSourceObj = await buildAndCreateDataSource(orderProductId, proofJobCampaignId, proofPropsValues, pageCount);
            if (dataSourceObj && dataSourceObj.FriendlyId && dataSourceObj.Name) {
              proofJobDataSourceId = dataSourceObj.FriendlyId;
              // Build job request and submit a new Job
              proofJobResult = await submitProofGenerationJob(proofJobCampaignId, proofJobAssetSourceId, dataSourceObj.FriendlyId, dataSourceObj.Name, proofPropsValues, proofFileName);
            }
          }
        }
        if (proofJobResult && proofJobResult[0]) {
          let proofJobId = proofJobResult[0].FriendlyId;
          // Poll to get the status, download the report if the status is completed.
          let isJobCompleted = await checkIfProofJobCompleted(proofJobId);
          if (isJobCompleted) {
            let proofFileContentBlob = await downloadProofJobResult(proofJobId, proofFileNameWithExtn);
            console.log("A new proof has been generated & downloaded")
            if (proofFileContentBlob) {
              return proofFileContentBlob;
            }
          }
        }
        return new Error("Unable to generate new proof");
      }
    } catch(error) {
      console.error("Unable to download OR generate simple print proof" + error);
      return null;
    } finally {
      // cleanup the resources such as datasource, assetsource, etc.
      if (proofJobDataSourceId > -1) {
        deleteDataSource(proofJobDataSourceId);
      }
      if (proofJobAssetSourceId > -1) {
        deleteAssetSource(proofJobAssetSourceId);
      }
    }
  }


 const convertPdfFileToImages = async(pdfObj) => {
  return new Promise(async (resolve, reject) => {
    const imagesList = [];
    const canvas = document.createElement('canvas')
    canvas.setAttribute('className', 'canv')
    const totalPages = await pdfObj.numPages;
    for (let imgIdx = 1; imgIdx <= totalPages; imgIdx++) {
      let page = await pdfObj.getPage(imgIdx);
      let viewport = page.getViewport({ scale: 1.5 })
      canvas.height = viewport.height
      canvas.width = viewport.width
      let render_context = {
        canvasContext: canvas.getContext('2d'),
        viewport: viewport,
      }
      await page.render(render_context).promise
      let img = canvas.toDataURL('image/jpeg')
      imagesList.push(img)
    }
    console.log("Number of proof images :" + imagesList.length)
    resolve(imagesList);
  });
}

const buildAndCreateDataSource = async (orderProductId, campaignId, proofPropsValue, pageCount) => {
  // Prepare comma separated CSV file & unique file name to create datasource
  let dataSourceCSVFileContent = '"Left_Page","Right_Page","Size","Orientation","Sides","Color","Print To Edge","Stapling","Folding","Cutting","Lamination","Drilling"\n'
  let proofDetailLine = '';
  // Paper size
  if (proofPropsValue.paperSize) {
    proofDetailLine = proofDetailLine + '"' + proofPropsValue.paperSize + '",';
  } else {
    proofDetailLine = proofDetailLine + '"",';
  }
  // Orientation
  if (proofPropsValue.orientation) {
    proofDetailLine = proofDetailLine + '"' + proofPropsValue.orientation + '",';
  } else {
    proofDetailLine = proofDetailLine + '"",';
  }

  // Sides
  if (proofPropsValue.sides) {
    proofDetailLine = proofDetailLine + '"' + proofPropsValue.sides + '",';
  } else {
    proofDetailLine = proofDetailLine + '"",';
  }

  // Color
  if (proofPropsValue.color) {
    proofDetailLine = proofDetailLine + '"' + proofPropsValue.color + '",';
  } else {
    proofDetailLine = proofDetailLine + '"",';
  }

  // Print To Edge
  if (proofPropsValue.printToEdge) {
    proofDetailLine = proofDetailLine + '"' + proofPropsValue.printToEdge + '",';
  } else {
    proofDetailLine = proofDetailLine + '"",';
  }

  // Stapling
  if (proofPropsValue.stapling) {
    proofDetailLine = proofDetailLine + '"' + proofPropsValue.stapling + '",';
  } else {
    proofDetailLine = proofDetailLine + '"",';
  }

  // Folding
  if (proofPropsValue.folding) {
    proofDetailLine = proofDetailLine + '"' + proofPropsValue.folding + '",';
  } else {
    proofDetailLine = proofDetailLine + '"",';
  }

  // Cutting
  if (proofPropsValue.cutting) {
    proofDetailLine = proofDetailLine + '"' + proofPropsValue.cutting + '",';
  } else {
    proofDetailLine = proofDetailLine + '"",';
  }

  // Lamination
  if (proofPropsValue.lamination) {
    proofDetailLine = proofDetailLine + '"' + proofPropsValue.lamination + '",';
  } else {
    proofDetailLine = proofDetailLine + '"",';
  }

  // Drilling
  if (proofPropsValue.drilling) {
    proofDetailLine = proofDetailLine + '"' + proofPropsValue.drilling + '",';
  } else {
    proofDetailLine = proofDetailLine + '"",';
  }

  let pageCountInt = parseInt(pageCount);
  // Calculate the left & right pages with the file name.
  for (let line = 1; line < (pageCountInt + 1); line = line + 2) {
    let leftPageName = line + '.jpg';
    let rightPageName = '';
    if (line < pageCountInt) {
      rightPageName = (line + 1) + '.jpg';
    } else {
      rightPageName = '""'
    }
    dataSourceCSVFileContent = dataSourceCSVFileContent + leftPageName + ',' + rightPageName + ',' + proofDetailLine + '\n'
  }
  return await createNewDataSource(orderProductId, dataSourceCSVFileContent, campaignId);
}

const checkIfProofJobCompleted = async (jobId) => {
  let isJobCompleted = false;
  for (let counter = 0; counter < 20; counter++) {
    let proofJobStatus = null;
    try {
      proofJobStatus = await fetchProofJobResult(jobId);

      console.log("Checking If proof job completed or not, counter - " + counter)
      if (proofJobStatus && proofJobStatus.Status === 'Completed') {
        isJobCompleted = true
        break;
      }
    } catch (error) {
      console.error("Unable to check proof Job status", error)
      break;
    }
    await sleep(5000);
  }
  return isJobCompleted;
}