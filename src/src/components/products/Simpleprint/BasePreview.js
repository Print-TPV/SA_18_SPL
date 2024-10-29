const pdfjs = require('pdfjs-dist');

export class BasePreview {
    constructor() {
        // pdfjs.GlobalWorkerOptions.workerSrc = `worker-loader!pdfjs-dist/build/pdf.worker.js`
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.js`
        this.totalPages = 0;
        this.getImagePages = this.getImagePages.bind(this);
        this.pageSize = "Letter";
        this.isPortrait = false;
        this.convertPDFToImagesByPage = this.convertPDFToImagesByPage.bind(this);
        this.getBufferImageIndexArray = this.getBufferImageIndexArray.bind(this);
        this.getTotalPages = this.getTotalPages.bind(this);
        this.getPdfObj = this.getPdfObj.bind(this);
    }

    getTotalPages = () => {
        return this.totalPages;
    }

    getPortrait = () => {
        return this.isPortrait;
    }

    getPageSize = () => {
        return this.pageSize;
    }

    getPdfObj = () => {
        return this.pdf;
    }

    async convertPDFToImagesByPage(file) {
        return new Promise(async (resolve, reject) => {
            const reader = new FileReader()
            reader.readAsArrayBuffer(file)
            reader.onload = async (event) => {
                const d = event.target.result
                const pdfObj = await pdfjs.getDocument({ data: new Uint8Array(d) }).promise.then(async (pdfFile) => {
                    const pdfPermissions = await pdfFile.getPermissions().then(permissions => {
                      return permissions;
                    }).catch(() => {
                      //Get Permission failed
                      return null;
                    })
                    
                    console.log("PDF Permission Flag: ", pdfPermissions);
                    if(pdfPermissions) {
                      return null;
                    }
                    return pdfFile;
                }).catch(error => {
                    if (error && error.name == 'PasswordException') {
                        return null;
                    }
                    return null;
                })
                if(!pdfObj) {
                    resolve(null);
                    return;
                } 
                this.pdf = pdfObj;
                this.totalPages = this.pdf.numPages;
                resolve(this);
            }
        })
    }

    async convertPDFUrlToImagesByPage(url) {
        return new Promise(async (resolve, reject) => {
            const pdfObj = await pdfjs.getDocument(url).promise.then(async (pdfFile) => {
                const pdfPermissions = await pdfFile.getPermissions().then(permissions => {
                  return permissions;
                }).catch(() => {
                  //Get Permission failed
                  return null;
                })
                
                console.log("PDF Permission Flag: ", pdfPermissions);
                if(pdfPermissions) {
                  return null;
                }
                return pdfFile;
            }).catch(error => {
                if (error && error.name == 'PasswordException') {
                    return null;
                }
                return null;
            })
            if(!pdfObj) {
                resolve(null);
                return;
            } 
            this.pdf = pdfObj;
            this.totalPages = this.pdf.numPages
            resolve(this)
        })
    }

    async getImagePages(startPage, imageBuffer, isPortraitMode) {
        return new Promise(async (resolve, reject) => {
        const imagesList = {};
        await Promise?.all(this.getBufferImageIndexArray(startPage, 7, this.getTotalPages())?.map(async (imgIdx) => {
            if(!imageBuffer || (imageBuffer && !imageBuffer[imgIdx])) {
                const canvas = document.createElement('canvas')
                canvas.setAttribute('className', 'canv')
                let page = await this.pdf.getPage(imgIdx)
                let viewport = page.getViewport({ scale: 1 })
                var aspectRatio = viewport.width / viewport.height;
                if(viewport.height > viewport.width) {
                    this.isPortrait = true;
                } else {
                    this.isPortrait = false;
                    aspectRatio = viewport.height / viewport.width;
                }                
                
                this.pageSize = this.calculatePageSize(aspectRatio);
                
                canvas.height = viewport.height
                canvas.width = viewport.width
                const canvasContext = canvas.getContext('2d');
                    
                // Determine if rotation is needed based on dimensions
                let ctx;
                if (isPortraitMode && (viewport.height < viewport.width)) {
                    ctx = canvas.getContext('2d');
                    canvas.height = viewport.width
                    canvas.width = viewport.height
                    ctx.rotate(90 * Math.PI / 180);
                    ctx.translate(0, -canvas.width);
                } else if(isPortraitMode == false && (viewport.height > viewport.width)) {
                    ctx = canvas.getContext('2d');
                    canvas.height = viewport.width
                    canvas.width = viewport.height
                    ctx.rotate(-90 * Math.PI / 180);
                    ctx.translate(-canvas.height, 0);
                }

                const render_context = {
                    canvasContext: ctx || canvasContext,
                    viewport: viewport
                };

                await page.render(render_context).promise
                let img = canvas.toDataURL('image/jpeg')
                imagesList[imgIdx] = img;
            } else {
                imagesList[imgIdx] = imageBuffer[imgIdx];
            }
          }));
          resolve(imagesList);
        });
    }

    calculatePageSize = (aspectRatio) => {
        if (Math.abs(aspectRatio - (8.5 / 11)) < 0.01) {
            return 'Letter';
          } else if (Math.abs(aspectRatio - (8.5 / 14)) < 0.01) {
            return 'Legal';
          } else if (Math.abs(aspectRatio - (11 / 17)) < 0.01) {
            return 'Ledger';
          } else {
            return 'Letter';
          }
    }

    getBufferImageIndexArray = (mainPage, buffer, totalPage) => {
        if (typeof Number(mainPage) !== 'number') {
            return;
        }

        if (mainPage < 0 || mainPage > totalPage) {
            throw new Error("Main page should be greater than 0");
        }

        const result = [];

        const endIndex = mainPage + Math.floor(buffer / 2);
        const endPage = (endIndex >= totalPage) ? totalPage : endIndex;
        for (let i = mainPage - Math.floor(buffer / 2); i < endPage; i++) {
            if (i >= 0) {
                result.push((i + 1));
            }
        }

        return result;
    }
}