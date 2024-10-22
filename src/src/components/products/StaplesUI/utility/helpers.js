import { useEffect } from 'react'
import DOMPurify from 'dompurify'

export const checkWindow = () => typeof window !== 'undefined'

export const exists = (objProp) => typeof objProp !== 'undefined'

export const getKeyVals = (obj) => {
  const arr = []
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(obj)) {
    arr.push({ name: key, value })
  }
  return arr
}

export const stopProp = (e) => {
  if (
    e &&
    typeof e.preventDefault !== 'undefined' &&
    typeof e.stopPropagation !== 'undefined'
  ) {
    e.preventDefault()
    e.stopPropagation()
  }
}

export const disableEnableScroll = (scrollOff) => {
  if (typeof document !== 'undefined' && document.body) {
    if (scrollOff && document.documentElement && window && window.innerWidth) {
      const scrollBarGap =
        window.innerWidth - document.documentElement.clientWidth
      if (scrollBarGap > 0) {
        document.body.style.paddingRight = `${scrollBarGap}px`
      }
      document.body.style.overflowY = 'hidden'
    } else {
      document.body.style.overflowY = 'auto'
      document.body.style.paddingRight = 'inherit'
    }
  }
}

export const KEYCODES = {
  enter: 13,
  esc: 27,
  left: 37,
  right: 39,
  space: 32,
  tab: 9,
}

export const BREAKPOINTS = {
  xxs: 360,
  xs: 600,
  smXmpie: 767, // xmpie mobile view breakpoint is 767
  sm: 820,
  md: 1024,
  lg: 1440,
}

// eslint-disable-next-line consistent-return
export function getBreakpoint() {
  /** Constants **/

  let breakpoint = 'lg'
  let isBreakpointSet = false

  if (checkWindow()) {
    Object.entries(BREAKPOINTS).forEach(([key, value]) => {
      if (
        window.matchMedia(`(max-width: ${value}px)`).matches &&
        !isBreakpointSet
      ) {
        isBreakpointSet = true
        breakpoint = key.toString()
      }
    })
  }

  return breakpoint
}

export function getInitialBreakpoint() {
  if (checkWindow()) {
    return window.staplesInitialBreakpoint || 'lg'
  }
  return global.staplesInitialBreakpoint || 'lg'
}

// https://usehooks.com/useOnClickOutside/
// https://github.com/Andarist/use-onclickoutside/blob/main/src/index.ts
export function useOnClickOutside(ref, handler, attachMouseOver) {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements

      if (!ref.current || ref.current.contains(event.target)) {
        return
      }

      handler(event)
    }

    document.addEventListener('mousedown', listener)

    document.addEventListener('touchstart', listener)

    document.addEventListener(
      'mouseover',
      attachMouseOver ? (e) => listener(e) : null
    )

    return () => {
      document.removeEventListener('mousedown', listener)

      document.removeEventListener('touchstart', listener)

      document.removeEventListener(
        'mouseover',
        attachMouseOver ? (e) => listener(e) : null
      )
    }
  }, [ref, handler, attachMouseOver])
}

export const sanitizeHTML = (html) => DOMPurify.sanitize(html)

export const parsedInteger = (val) => {
  const parsedValue = parseInt(val, 10)
  return !Number.isNaN(parsedValue) ? parsedValue : ''
}

export const logError = (msg, e) => {
  if (window !== undefined) {
    /* eslint-disable no-console */
    console.log(msg, e)
  }
}

export const triggerEvent = (eventName, obj) => {
  if (window !== undefined) {
    const event = new CustomEvent(eventName, {
      detail: { ...obj }
    })
    window.dispatchEvent(event)
  }
}

// from https://vhudyma-blog.eu/detect-mobile-device-in-react/
export const touchDetector = () => {
  let hasTouchScreen = null
  if (checkWindow()) {
    if ('maxTouchPoints' in navigator) {
      hasTouchScreen = navigator.maxTouchPoints > 0
    } else if ('msMaxTouchPoints' in navigator) {
      hasTouchScreen = navigator.msMaxTouchPoints > 0
    } else {
      const mQ = window.matchMedia && matchMedia('(pointer:coarse)')
      if (mQ && mQ.media === '(pointer:coarse)') {
        hasTouchScreen = !!mQ.matches
      } else if ('orientation' in window) {
        hasTouchScreen = true // deprecated, but good fallback
      } else {
        // Only as a last resort, fall back to user agent sniffing
        const UA = navigator.userAgent
        hasTouchScreen =
          /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
          /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
      }
    }
  }
  return hasTouchScreen
}

export const hasValue = (obj, val) => Object.values(obj).includes(val)

export const hasProperty = (obj, pro) => Object.keys(obj).includes(pro)