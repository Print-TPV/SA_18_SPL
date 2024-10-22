/* eslint-disable no-console */
// https://github.com/focus-trap/tabbable
const selectElements = [
  'input',
  'select',
  'textarea',
  'a[href]',
  'button',
  '[tabindex]',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
].join(',')

export const getFocusableElements = root => {
  const elements = []
  Array.from(root.querySelectorAll(selectElements)).forEach(node => {
    const nodeTabIndex = getTabIndex(node)

    if (nodeTabIndex === -1 || !isElementFocusable(node)) {
      return
    }

    if (nodeTabIndex === 0) {
      elements.push(node)
    }
  })
  return elements
}

export const isElementFocusable = node => {
  if (node.disabled || (node.tagName === 'INPUT' && node.type === 'hidden')) {
    return false
  }
  return true
}

export const getTabIndex = node => {
  const tabindexAttr = node && parseInt(node.getAttribute('tabindex'), 10)

  if (!Number.isNaN(tabindexAttr)) {
    return tabindexAttr
  }

  const elementsWithNoTabIndex = ['AUDIO', 'VIDEO', 'DETAILS']
  if (
    node.contentEditable === 'true' ||
        ((elementsWithNoTabIndex.find(element => element === node.nodeName)) &&
            node.getAttribute('tabindex') === null)
  ) {
    return 0
  }

  return node.tabIndex
}

export const trapFocus = (event, root) => {
  const focusable = getFocusableElements(root)
  if(focusable && focusable.length > 0){
    const firstFocusable = focusable[0]
    const lastFocusable = focusable[focusable.length - 1]
    const KEYCODE_TAB = 9

    const x = event.which || event.keyCode
    const isTabPressed = (event.key === 'Tab' || x === KEYCODE_TAB)

    if (!isTabPressed) {
      return
    }

    if ( event.shiftKey ) /* shift + tab */ {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus()
        event.preventDefault()
      }
    } else /* tab */ if (document.activeElement === lastFocusable) {
      firstFocusable.focus()
      event.preventDefault()
    }
  }
}

export const focusOnFirstElement = root => {
  if(root){
    const focusable = getFocusableElements(root)
    if(focusable && focusable.length > 0){
      focusable[0].focus()
    }
  }
}