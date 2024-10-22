import styled from 'styled-components'
import { colors } from '../styles/colors'
import { fadeIn } from '../styles/animation'
import { BREAKPOINTS } from '../utility/helpers'

const variantBorderColor = (variant) => {
  switch (variant) {
    case 'success':
      return colors.positive
    case 'warning':
      return colors.warning
    case 'failure':
      return colors.negative
    default:
      return colors.info
  }
}

export const StyledWrapper = styled.div`
${(props) =>
  props.isAnimate && {
    transition: 'max-height 1s',
    overflow: 'hidden',
  }}
  animation: ${(props) => (props.isAnimate ? fadeIn: 'auto')} 1s 1s ease-out forwards;
`

export const StyledNotificationBubble = styled.div`
  line-height: 24px;
  color: ${(props) => colors[props.color]};
  border-radius: 4px;
  padding: 15px 24px 15px 12px;
  display: inline-flex;
  position: relative;
  border: ${(props) => props.noBorder ? '0' : `1px solid ${variantBorderColor(props.variant)}`};
  border-left-width: 12px;
  align-items: ${(props) => props.alignItem};
  background-color: ${colors.white};
  width: ${(props) => (props.maxWidth ? '100%' : '')};
  ${props => props.customCSS ? props.customCSS : ''};
  @media all and (max-width: ${BREAKPOINTS.sm}px) {
    line-height: 20px;
    padding: 12px;
  }
`
export const StyledBtn = styled.button`
  display: flex;
  align-items: center;
  height: 20px;
  background: transparent;
  border: 0;
  min-width: 16px;
  padding-left: 15px;
  margin-left: auto;
  cursor: pointer;
`
export const StyledIconWrapper = styled.div`
  display: block;
  min-width: 21px;
`
export const StyledContent = styled.div`
  padding-left: 12px;
  font-size: ${props => (props.textSize === 'md' ? '14px' : '16px')};
  @media all and (max-width: ${BREAKPOINTS.sm}px) {
   font-size : 14px;
  }
`