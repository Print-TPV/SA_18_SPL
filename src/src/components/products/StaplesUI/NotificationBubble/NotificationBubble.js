import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  StyledNotificationBubble,
  StyledIconWrapper,
  StyledContent,
  StyledBtn,
  StyledWrapper,
} from './NotificationBubble.styles'
import { Icon } from '../Icon/Icon'
import { stopProp } from '../utility/helpers'

const colorType = (variant) => {
  switch (variant) {
    case 'success':
      return 'positive'
    case 'warning':
      return 'warning'
    case 'failure':
      return 'negative'
    case 'info':
    default:
      return 'info'
  }
}
const iconType = (variant) => {
  switch (variant) {
    case 'success':
      return 'check-circle'
    case 'warning':
      return 'warning-triangle'
    case 'failure':
      return 'error-square'
    default:
      return 'info-bubble'
  }
}
export function NotificationBubble(props) {
  const {
    variant,
    textSize,
    showCloseBtn,
    onClose,
    children,
    id,
    isCustomIcon,
    customCSS,
    textColor,
    isAnimate,
    noBorder,
  } = props

  const ref = useRef(null)
  const [maxHeight, setMaxHeight] = useState(0)
  const [countInTimeout, setCountInTimeout] = useState(0)

  useEffect(() => {
    if(isAnimate){
    setTimeout(() => {
      setCountInTimeout(maxHeight) // count is 0 here
    }, 1000)
    setMaxHeight(ref && ref.current && ref.current.clientHeight + 2) // Update height to be 1 after timeout is scheduled
    }
  }, [maxHeight, isAnimate])

  const closeHandler = (event) => {
    stopProp(event)
    onClose()
  }

  return (
    <StyledWrapper
      role="alert"
      aria-label="Notification Bubble"
      isAnimate={isAnimate}
      style={{ ...(isAnimate ? { maxHeight: `${countInTimeout}px` } : null) }}
    >
      <StyledNotificationBubble
        {...props}
        {...(id && { id })}
        {...(customCSS && { customCSS })}
        color={textColor}
        ref={ref}
        {...(noBorder && { noBorder })}
      >
        {!isCustomIcon ? (
          <>
            <StyledIconWrapper>
              <Icon
                name={iconType(variant)}
                size={18}
                color={colorType(variant)}
              />
            </StyledIconWrapper>
            <StyledContent textSize={textSize}>{children}</StyledContent>
          </>
        ) : (
          children
        )}

        {showCloseBtn && (
          <StyledBtn aria-label="Close Notification" onClick={closeHandler}>
            <Icon name="close" size={16} color="medium_gray_1" />
          </StyledBtn>
        )}
      </StyledNotificationBubble>
    </StyledWrapper>
  )
}

NotificationBubble.defaultProps = {
  children: null,
  alignItem: 'center',
  maxWidth: false,
  showCloseBtn: false,
  onClose: () => {},
  id: null,
  customCSS: null,
  textSize: 'lg',
  isCustomIcon: false,
  textColor: 'black',
  isAnimate: false,
  noBorder: false,
}

NotificationBubble.propTypes = {
  variant: PropTypes.oneOf(['info', 'success', 'warning', 'failure'])
    .isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  alignItem: PropTypes.oneOf(['center', 'flex-start']),
  maxWidth: PropTypes.bool,
  showCloseBtn: PropTypes.bool,
  onClose: PropTypes.func,
  id: PropTypes.string,
  customCSS: PropTypes.string,
  textSize: PropTypes.oneOf(['lg', 'md']),
  isCustomIcon: PropTypes.bool,
  textColor: PropTypes.string,
  isAnimate: PropTypes.bool,
  noBorder: PropTypes.bool,
}