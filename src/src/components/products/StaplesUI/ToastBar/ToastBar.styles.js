import styled from 'styled-components'
import { colors } from '../styles/colors'
import { expandToastBar, collapseToastBar } from '../styles/animation'

const variantBackground = (variant) => {
  switch (variant) {
    case 'success':
      return colors.medium_positive
    case 'warning':
      return colors.warning
    case 'failure':
      return colors.negative
    case 'info':
    default:
      return colors.info
  }
}

export const StyledToastBar = styled.div`
  color: ${(props) =>
  props.variant === 'warning' || props.variant === 'success' ? colors.black : colors.white};
  padding: 12px;
  margin-top: ${(props) => props.marginTop}px;
  font-size: 16px;
  font-weight: normal;
  background-color: ${(props) => variantBackground(props.variant)};
  animation: ${(props) => (props.visible ? expandToastBar(): collapseToastBar())};
  animation-duration: ${(props) => (props.visible ? props.showAnimation: props.hideAnimation)}ms;
  left: 0;
  right: 0;
  top: 0;
  position: fixed;
  width: 100%;
  z-index: 11000;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    margin-left: 12px;
  }
  ${props => props.customCSS ? props.customCSS : ''};
`
export const StyledBtn = styled.div` 
    background: transparent;
    border: 0;
    display: flex;
    padding-left: 10px;
    min-width: ${(props) => props.width === 'sm' ? '75px' : 'auto'};
    ${(props) =>
      props.underline && {
        'text-decoration': 'underline',
      }}
`
export const IconWrapper = styled.div`
      min-width: 21px;
      `
export const LongerMsgStyle = styled.div`
      width: 250px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
`
export const ShorterMsgStyle = styled.div`
      text-indent: 5px;
`