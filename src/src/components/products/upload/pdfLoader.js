import * as pdfjsLib from 'pdfjs-dist'

const wait = async (ms) => new Promise(resolve => setTimeout(resolve, ms))

export class PDFLoader {
  constructor () {
    this._pdf = null
    this._url = null
  }

  async load (url) {
    if (this._pdf) {
      return this._pdf
    }

    if (this._url === url) {
      await wait(1000)
      return await this.load(url)
    }

    this._url = url
    this._pdf = await pdfjsLib.getDocument(url).promise
    return this._pdf
  }

  clear () {
    this._pdf = null
    this._url = null
  }

  get pdf () {
    return this._pdf
  }
}

const loader = new PDFLoader()
export default loader
