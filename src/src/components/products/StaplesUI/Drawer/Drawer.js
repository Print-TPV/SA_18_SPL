import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react'
import PropTypes from 'prop-types'
import { Icon } from '../Icon/Icon'
import {
  Container,
  Backdrop,
  Body,
  Title,
  StickyHeader,
  Footer,
  Close,
} from './Drawer.styles'
import {
  checkWindow,
  disableEnableScroll,
  KEYCODES,
  triggerEvent,
} from '../utility/helpers'
import { focusOnFirstElement, trapFocus } from '../utility/TrapUtil'

const DrawerContext = createContext()

export const Drawer = forwardRef((props, ref) => {
  const {
    children,
    size,
    onClose,
    onOpen,
    id,
    side,
    focusOnClose,
    scrollEndCallback,
    backgroundColor,
    preventClose,
    className,
    backCallback,
    backText,
    preventCloseCallback,
    customCSS,
    scrollBackToTop,
    arialabel,
    showError,
    errorOnClose,
    centerTitle,
  } = props
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState(null)
  const [loadHTML, setLoadHTML] = useState(false)
  const drawerRef = useRef()

  // These are exposed to user from their custom ref
  useImperativeHandle(ref, () => ({
    focus: () => {
      drawerRef.current.focus()
    },
    open: () => {
      openDrawer()
    },
    close: (e) => {
      closeDrawer(e)
    },
  }))

  const closeDrawer = useCallback(
    // eslint-disable-next-line consistent-return
    (e) => {
      if (!preventClose) {
        // Show error window on accordion
        if (e !== 'close' && errorOnClose) {
          if (showError || showError === false) {
            errorOnClose()
            return 1
          }
        }

        // enable scrolling now that drawer is closed
        disableEnableScroll(false)
        // change state
        setIsOpen(false)
        // set focus
        if (focusOnClose && focusOnClose.current) {
          focusOnClose.current.focus()
        } else if (checkWindow() && document.activeElement) {
          document.activeElement.focus()
        }

        setTimeout(() => {
          // callback
          onClose?.(e)
          setLoadHTML(false)
        }, 300)
      } else if (preventCloseCallback) {
        preventCloseCallback()
        if (drawerRef && drawerRef.current) {
          focusOnFirstElement(drawerRef.current)
        }
      }
    },
    [
      setIsOpen,
      onClose,
      focusOnClose,
      preventClose,
      preventCloseCallback,
      showError,
      errorOnClose,
    ]
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleKeyDown = (e) => {
    trapFocus(e, drawerRef.current)
    if (e.keyCode === KEYCODES.esc) closeDrawer(e)
  }

  const openDrawer = useCallback(() => {
    // status changes once drawer is triggered for first time
    if (!status) setStatus(true)
    // disallow page scrolling while drawer is open
    disableEnableScroll(true)
    // change state
    setIsOpen(true)
    // callback
    onOpen()
    setLoadHTML(true)
    if (drawerRef && drawerRef.current) {
      focusOnFirstElement(drawerRef.current)
    }
    // cleanup
    return () => {
      disableEnableScroll(false)
    }
  }, [status, setStatus, setIsOpen, onOpen])

  useEffect(() => {
    if (isOpen) {
      triggerEvent('drawer', { isOpen: true, id })
      disableEnableScroll(true)
      if (drawerRef && drawerRef.current) {
        focusOnFirstElement(drawerRef.current)
      }
    } else {
      triggerEvent('drawer', { isOpen: false, id })
      // If secandary drawer close then scroll will not show for first drawer
      disableEnableScroll(
        !(document.getElementsByClassName('drawer-wrapper').length <= 1)
      )
    }
    return () => {
      disableEnableScroll(false)
    }
  }, [id, isOpen])

  useEffect(() => {
    const referenceToRef = drawerRef.current
    if (referenceToRef) {
      referenceToRef.addEventListener('keydown', handleKeyDown, true)
    }
    return () => {
      if (referenceToRef) {
        referenceToRef.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [handleKeyDown])

  return (
    <>
      <DrawerContext.Provider
        value={{
          isOpen,
          openDrawer,
          closeDrawer,
          size,
          status,
          id,
          side,
          scrollEndCallback,
          backgroundColor,
          drawerRef,
          className,
          backCallback,
          backText,
          loadHTML,
          customCSS,
          arialabel,
          scrollBackToTop,
          centerTitle,
        }}
      >
        {Array.isArray(props.children) ? children[0] : null}
        {loadHTML ? (
          <div
            ref={drawerRef}
            style={{ position: 'absolute' }}
            className="drawer-wrapper"
          >
            {Array.isArray(props.children) ? children[1] : children}
          </div>
        ) : null}
      </DrawerContext.Provider>
      <Backdrop isOpen={isOpen} onClick={(e) => closeDrawer(e)} />
    </>
  )
})

/** Props **/

Drawer.defaultProps = {
  size: 'sm',
  onClose: () => {},
  onOpen: () => {},
  id: 'drawer-0',
  side: 'right',
  focusOnClose: null,
  scrollEndCallback: () => {},
  backgroundColor: 'white',
  preventClose: false,
  children: null,
  className: null,
  customCSS: '',
  backText: null,
  backCallback: null,
  preventCloseCallback: () => {},
  arialabel: '',
  scrollBackToTop: false,
  showError: null,
  errorOnClose: () => {},
  centerTitle: false,
}

Drawer.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  id: PropTypes.string,
  side: PropTypes.oneOf(['left', 'right']),
  focusOnClose: PropTypes.object,
  scrollEndCallback: PropTypes.func,
  backgroundColor: PropTypes.string,
  preventClose: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  className: PropTypes.string,
  customCSS: PropTypes.string,
  backText: PropTypes.string,
  backCallback: PropTypes.func,
  preventCloseCallback: PropTypes.func,
  arialabel: PropTypes.string,
  scrollBackToTop: PropTypes.bool,
  showError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  errorOnClose: PropTypes.func,
  centerTitle: PropTypes.bool,
}

/** Subcomponents **/

export const DrawerTrigger = ({ children }) => {
  const { isOpen, openDrawer } = useContext(DrawerContext)
  const clickDrawer = () => {
    if (!isOpen) {
      openDrawer()
    }
  }
  const keydownDrawer = (e) => {
    if (
      (!isOpen && e.keyCode === KEYCODES.enter) ||
      e.keyCode === KEYCODES.space
    ) {
      openDrawer()
    }
  }

  return (
    <>
      {React.cloneElement(children, {
        onClickHandler: clickDrawer,
        onClick: clickDrawer,
        onKeyDown: keydownDrawer,
      })}
    </>
  )
}

export const DrawerBody = ({ children, customCSS }) => {
  const { scrollEndCallback, scrollBackToTop } = useContext(DrawerContext)
  const bodyRef = useRef()
  useEffect(() => {
    const body = bodyRef.current
    const scrollHandler = (e) => {
      const { scrollHeight, offsetHeight, scrollTop } = e.target
      if (scrollHeight === offsetHeight + scrollTop) {
        scrollEndCallback()
      }
    }
    body.addEventListener('scroll', scrollHandler, true)
    return () => {
      body.removeEventListener('scroll', scrollHandler)
    }
  }, [scrollEndCallback, bodyRef])

  useEffect(() => {
    if (
      scrollBackToTop &&
      bodyRef.current &&
      bodyRef.current.clientHeight < bodyRef.current.scrollHeight
    ) {
      bodyRef.current.scrollTop = 0
    }
  }, [scrollBackToTop, bodyRef])

  return (
    <Body customCSS={customCSS} ref={bodyRef}>
      {children}
    </Body>
  )
}

export const DrawerTitle = ({ children, customCSS, headerBg }) => {
  const { centerTitle } = useContext(DrawerContext)
  return (
    <Title centerTitle={centerTitle} headerBg={headerBg} customCSS={customCSS}>
      {children}
    </Title>
  )
}

// eslint-disable-next-line react/prop-types
export const DrawerStickyHeader = ({ children, customCSS }) => {
  const { backCallback, backText } = useContext(DrawerContext)
  const backButtonPress = (e) => {
    if (
      e.type === 'click' ||
      (e.type === 'keyup' && e.keyCode === KEYCODES.enter)
    ) {
      backCallback(e)
    }
  }
  return (
    <StickyHeader customCSS={customCSS}>
      {backCallback !== null && backText !== null ? (
        <div
          role="button"
          tabIndex="0"
          aria-label={backText}
          onKeyUp={backButtonPress}
          onClick={backButtonPress}
        >
          <Icon name="back" size={16} color="black" />
          <span>&nbsp;{backText}</span>
        </div>
      ) : (
        ''
      )}
      {children}
    </StickyHeader>
  )
}

export const DrawerFooter = ({ children, customCSS }) => (
  <Footer role="region" aria-labelledby="action buttons" customCSS={customCSS}>
    {children}
  </Footer>
)

export const DrawerClose = (props) => {
  const { closeDrawer, arialabel, centerTitle } = useContext(DrawerContext)
  const { headerBg, customCSS } = props

  return (
    <Close
      onClick={(e) => closeDrawer(e)}
      tabIndex="0"
      id="closeBtn"
      centerTitle={centerTitle}
      aria-label={`${arialabel}, dialog, close`}
      customCSS={customCSS}
    >
      <Icon
        name="close"
        size={16}
        color={headerBg === 'white' ? 'black' : 'brand_text'}
      />
    </Close>
  )
}

export const DrawerContent = (props) => {
  const context = useContext(DrawerContext)
  const { children, customCSS } = props
  return (
    <>
      {context.loadHTML ? (
        <Container
          aria-hidden={!context.isOpen}
          role="dialog"
          aria-modal="true"
          id={context.id}
          customCSS={customCSS}
          className={context.className}
          {...props}
          {...context}
        >
          {children}
        </Container>
      ) : null}
    </>
  )
}
/** Compound Components **/

Drawer.Trigger = DrawerTrigger
Drawer.Body = DrawerBody
Drawer.StickyHeader = DrawerStickyHeader
Drawer.Footer = DrawerFooter
Drawer.Title = DrawerTitle
Drawer.Content = DrawerContent
Drawer.Close = DrawerClose

/** Props **/

DrawerContent.defaultProps = {
  children: null,
  customCSS: null,
}

DrawerContent.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  customCSS: PropTypes.string,
}

DrawerTrigger.defaultProps = {
  children: null,
}

DrawerTrigger.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
}

DrawerBody.defaultProps = {
  children: null,
  customCSS: null,
}

DrawerBody.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  customCSS: PropTypes.string,
}

DrawerStickyHeader.defaultProps = {
  children: null,
  customCSS: null,
}

DrawerStickyHeader.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  customCSS: PropTypes.string,
}

DrawerTitle.defaultProps = {
  children: null,
  customCSS: null,
  headerBg: 'default',
}

DrawerTitle.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  customCSS: PropTypes.string,
  headerBg: PropTypes.oneOf(['default', 'white']),
}

DrawerClose.defaultProps = {
  headerBg: 'default',
  customCSS: null,
}

DrawerClose.propTypes = {
  headerBg: PropTypes.oneOf(['default', 'white']),
  customCSS: PropTypes.string,
}

DrawerFooter.defaultProps = {
  children: null,
  customCSS: null,
}

DrawerFooter.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  customCSS: PropTypes.string,
}
