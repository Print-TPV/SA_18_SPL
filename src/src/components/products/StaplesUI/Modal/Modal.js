import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Icon } from '../Icon/Icon'
import {
  BackDrop,
  Wrapper,
  Body,
  CloseBar,
  CloseBtn,
  BtnWrapper,
  AlignBtnTxt,
} from './Modal.styles'
import {
  checkWindow,
  disableEnableScroll,
  KEYCODES,
} from '../utility/helpers'
import { focusOnFirstElement, trapFocus } from '../utility/TrapUtil'
import { Button } from '../Button/Button'

/** Component **/

export function Modal(props) {
  const {
    showModal,
    onClose,
    focusOnModalClosed,
    hasCloseButton,
    ariaLabels,
    fullscreen,
    children,
    closeOnBackdropClick,
    id,
    customCSS,
    showSubHeader
  } = props
  const [show, setShow] = useState(showModal)
  const dialogRef = useRef()
  const handleKeyDown = (event) => {
    trapFocus(event, dialogRef.current)
  }

  useEffect(() => {
    const modalRef = dialogRef.current
    setShow(showModal)
    if (showModal) {
      disableEnableScroll(true)
      if (dialogRef && dialogRef.current)
        modalRef.addEventListener('keydown', handleKeyDown, true)
      focusOnFirstElement(dialogRef.current)
    } else {
      disableEnableScroll(false)
    }
    return () => {
      disableEnableScroll(false)
      // NOTE!! Please remove this disable and fix this error
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (dialogRef && dialogRef.current)
        modalRef.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [showModal])

  useEffect(() => {
    if (!show) {
      if (focusOnModalClosed) {
        focusOnModalClosed.focus()
      } else if (checkWindow() && document.activeElement) {
        document.activeElement.focus()
      }
    }
  }, [focusOnModalClosed, show])

  const handleClickOutside = (e) => {
    if (!dialogRef.current.contains(e.target) && closeOnBackdropClick) {
      closeModal()
    }
  }

  const onKeyUp = (e) => {
    if (e.keyCode === KEYCODES.esc) {
      closeModal()
    }
  }

  const closeModal = () => {
    setShow(false)
    disableEnableScroll(false)
    onClose()
  }

  const Close = () => (
    <CloseBar>
      <CloseBtn aria-label="Close" type="button" onClick={closeModal}>
        <Icon name="close" size={12} color="dark_gray_1" />
      </CloseBtn>
    </CloseBar>
  )

  const BackBtn = () => (
    <BtnWrapper>
      <Button onClickHandler={closeModal}>
        <Icon name="arrow-left" size={24} color="white" />
        <AlignBtnTxt aria-label={ariaLabels.btnAriaLabel}>Back</AlignBtnTxt>
      </Button>
    </BtnWrapper>
  )

  return (
    <BackDrop
      {...props}
      aria-label="Modal"
      show={show}
      onClick={handleClickOutside}
      onKeyUp={onKeyUp}
    >
      <Wrapper
        {...props}
        role="dialog"
        show={show}
        ref={dialogRef}
        customCSS={customCSS}
        id={id}
      >
        {hasCloseButton ? <Close /> : null}
        {fullscreen ? <BackBtn /> : null}
        <Body>{children}</Body>
      </Wrapper>
    </BackDrop>
  )
}

/** Props **/

Modal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  closeOnBackdropClick: PropTypes.bool,
  focusOnModalClosed: PropTypes.object,
  onClose: PropTypes.func,
  fullscreen: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  hasCloseButton: PropTypes.bool,
  ariaLabels: PropTypes.object,
  customCSS: PropTypes.string,
  id: PropTypes.string,
  showSubHeader: PropTypes.bool
}

Modal.defaultProps = {
  closeOnBackdropClick: true,
  focusOnModalClosed: null,
  onClose: () => {},
  fullscreen: false,
  hasCloseButton: false,
  ariaLabels: { btnAriaLabel: 'Modal, Back' },
  customCSS: null,
  id: '',
  showSubHeader: false
}
