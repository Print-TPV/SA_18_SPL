import React, { Component, createRef } from 'react'
import HeadSEO from './HeadSEO'
import Header from './Header'
import Footer from './Footer'
import './Layout.scss'
import CookiesRibbon from "./CookiesRibbon";
import ResizeObserver from "resize-observer-polyfill"
import RouteChangeListener from './RouteChangeListener'
import { FontStyles } from '../../styles/fonts'
/**
 * The main page wrapper - contains the Header and Footer and gets children as the main content
 *
 * @param {object} state - state of store
 * @param {component} children - React components to be presented between header and footer
 * @param {string} [className] - class name to append to the container div
 */

class Layout extends Component {
  constructor() {
    super();

    this.isConnectStore = false
    this.resizeObserver = null;
    this.resizeElement = createRef()
  }

  static currentHeight = 0

  _debounce = function (ms, fn) {
    var timer;
    return function () {
      clearTimeout(timer)
      var args = Array.prototype.slice.call(arguments)
      args.unshift(this)
      timer = setTimeout(fn.bind.apply(fn, args), ms)
    };
  };

  componentWillUnmount() {
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }

  render() {
    const { state, children, className } = this.props

    const storeType = (state && state.currentStore) ? state.currentStore.StoreType : null
    if (storeType === 3) {
      // connect store - hide header and footer.
      this.isConnectStore = true
    }

    if (this.isConnectStore) {
      if (this.resizeObserver) this.resizeObserver.disconnect();

      this.resizeObserver = new ResizeObserver(this._debounce(300, function (entries) {
        entries.forEach(entry => {
          if (Layout.currentHeight !== entry.contentRect.height) {
            Layout.currentHeight = entry.contentRect.height
            console.log('USTORE_CONNECT_RESIZE height: ' + entry.contentRect.height)
            window.parent.postMessage({
              type: '@USTORE_CONNECT_RESIZE',
              data: {
                height: entry.contentRect.height,
                width: entry.contentRect.width
              }
            }, '*')
          }
        })
      }))

      if (this.resizeElement.current) this.resizeObserver.observe(this.resizeElement.current);
    }

    let isPreviewMode = false
    let url = ''
    try {
      // wrapping in try catch so that in cross-domain (connect store) it will be ignored.
      url = window.top.location.href
    } catch (error) { }

    if (url && (url.includes('MobilePreview.aspx') || url.includes('ThemeCustomization.aspx')))
      isPreviewMode = true

    const showHeaderFooter = storeType === 4 ?
      state.currentStore.Attributes.find(attr => attr.Name === 'ShowHeaderAndFooter' && attr.Value === 'True') :
      (!this.isConnectStore || isPreviewMode)

    return (
      <div>
        <HeadSEO {...state} />
        <FontStyles />
        <div className={`layout ${className ? className : ''} ${isPreviewMode ? 'preview' : ''} ${!showHeaderFooter ? 'connect' : ''}`}>
          {showHeaderFooter && <Header {...state} />}
          <div className="main-content" ref={this.resizeElement}>
            {children}
          </div>
          {/* {showHeaderFooter && <Footer />} SPLS -- remove footer from render */}
          {/* {state.customState && state.currentStore && <CookiesRibbon showRibbon={state.customState.showCookieRibbon} />} SPLS -- remove from render */}
        </div>
        <RouteChangeListener/>
      </div>
    )
  }
}

export default Layout
