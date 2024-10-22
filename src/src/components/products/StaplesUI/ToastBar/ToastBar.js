import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Icon } from '../Icon/Icon'
import {
  StyledToastBar,
  StyledBtn,
  IconWrapper,
  LongerMsgStyle,
  ShorterMsgStyle,
} from './ToastBar.styles'

const iconType = {
  info: {
    name: 'check-circle',
    color: 'white',
  },
  warning: {
    name: 'warning-triangle',
    color: 'black',
  },
  failure: {
    name: 'warning-triangle',
    color: 'white',
  },
  success: {
    name: 'check-circle',
    color: 'black',
  },
}

export function ToastBar(props) {
  const {
    variant,
    children,
    delay,
    onClose,
    id,
    customCSS,
    marginTop,
    isCloseBtn,
    showAnimation,
    hideAnimation,
    secondLineMsg,
    ariaLabel,
  } = props
  const [visible, setVisible] = useState(true)

  const openTimer = useRef(null)
  const closeTimer = useRef(null)

  const closeToastHandler = () => {
    clearTimeout(openTimer.current)
    clearTimeout(closeTimer.current)
    setVisible(false)
    closeTimer.current = setTimeout(() => {
      onClose()
    }, hideAnimation)
    return () => {
      clearTimeout(openTimer.current)
      clearTimeout(closeTimer.current)
    }
  }

  useEffect(() => {
    openTimer.current = setTimeout(() => {
      setVisible(false)
    }, delay + showAnimation)

    closeTimer.current = setTimeout(() => {
      onClose()
    }, delay + hideAnimation)

    return () => {
      clearTimeout(openTimer.current)
      clearTimeout(closeTimer.current)
    }
  }, [delay, hideAnimation, onClose, showAnimation])

  return (
    <StyledToastBar
      {...props}
      visible={visible}
      role="alert"
      customCSS={customCSS}
      id={id}
      marginTop={marginTop}
      aria-label={ariaLabel}
    >
      <IconWrapper>
        <Icon
          name={iconType[variant].name}
          size={20}
          color={iconType[variant].color}
        />
      </IconWrapper>
      <span  {...(ariaLabel && { 'aria-hidden': true })}>
        {children}
        {secondLineMsg.length >= 10 && (
          <>
            <br />
            <LongerMsgStyle>{secondLineMsg}</LongerMsgStyle>
          </>
        )}
      </span>
      {secondLineMsg.length < 10 && (
        <ShorterMsgStyle>{secondLineMsg}</ShorterMsgStyle>
      )}

      {isCloseBtn && (
        <StyledBtn
          type="button"
          onClick={closeToastHandler}
          aria-label="close"
          showAnimation={showAnimation}
          hideAnimation={hideAnimation}
          data-testid="close-button"
        >
          <Icon name="close" size={20} color={iconType[variant].color} />
        </StyledBtn>
      )}
    </StyledToastBar>
  )
}

ToastBar.defaultProps = {
  children: '',
  delay: 4000,
  onClose: () => { },
  variant: 'success',
  customCSS: null,
  id: '',
  marginTop: null,
  isCloseBtn: false,
  showAnimation: 1000,
  hideAnimation: 5000,
  secondLineMsg: '',
  ariaLabel: '',
}

ToastBar.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
  ]),
  delay: PropTypes.number,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['success', 'failure', 'warning', 'info']),
  customCSS: PropTypes.string,
  id: PropTypes.string,
  marginTop: PropTypes.number,
  isCloseBtn: PropTypes.bool,
  showAnimation: PropTypes.number,
  hideAnimation: PropTypes.number,
  secondLineMsg: PropTypes.string,
  ariaLabel: PropTypes.string,
}