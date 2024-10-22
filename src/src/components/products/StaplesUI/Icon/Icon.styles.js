import styled from 'styled-components'
import { textColorByBackground, colors } from '../styles/colors'
import { typography } from '../styles/fonts'

export const brandColor = (color, themeColor) => {
  switch (color) {
    case 'brand':
      return colors[themeColor]
    case 'brand_text':
      return textColorByBackground[themeColor]
    default:
      return colors[color]
  }
}

export const Svg = styled.svg`
  display: ${(props) => (props.block ? 'block' : 'inline-block')};
  vertical-align: middle;
  fill: ${(props) => brandColor(props.color, props.theme.components?.icon.brandcolorname)};
  shape-rendering: inherit;
  ${(props) => props.style};
`

export const Badge = styled.div`
  position: absolute;
  z-index: 10;
  border-radius: 50%;
  font-size: 12px;
  letter-spacing: -0.5px;
  display: flex;
  justify-content: center;
  align-items: center;
  top: ${(props) => (props.dot ? '-7px' : '-14px')};
  left: ${(props) => (props.dot ? (props.size === 'sm' ? '20px' : '24px') : props.size === 'sm' ? '13px' : '15px')};
  height: ${(props) => (props.dot ? '8px' : '22px')};
  width: ${(props) => (props.dot ? '8px' : '22px')};
  background-color: ${(props) => colors[props.color]};
  color: ${(props) => textColorByBackground[props.color]};
  font-family: ${typography.type.motiva_medium};
  & span {
    width: 22px;
    text-align: center;
  }
`

export const BadgeContainer = styled.div`
  display: inline-flex;
  position: relative;
  width: fit-content;
  ${(props) => (props.customCSS ? props.customCSS : '')};
`
const factor = (size) => (size > 120 ? 2.75 : size > 80 ? 3 : 2.5)

export const NumberWrapper = styled.div`
  display: inline-flex;
`

export const Number = styled.div`
  font-family: ${typography.type.motiva_medium};
  border-radius: 50%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 6px;
  background-color: ${(props) => colors[props.color]};
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  font-size: ${(props) => Math.floor(props.size / factor(props.size))}px;
  color: ${(props) => textColorByBackground[props.color]};
`
export const HighlightContainer = styled.div`
  display: inline-flex;
  flex-direction: ${(props) => (props.variant === 'vertical' ? 'column' : 'row')};
  align-items: center;
  text-align: ${(props) => (props.variant === 'vertical' ? 'center' : 'left')};
  position: relative;
  width: fit-content;
  ${(props) => (props.customCSS ? props.customCSS : '')};
`
export const TopLabel = styled.div`
  padding-top: ${(props) => (props.variant === 'vertical' ? '12px' : '0')};
  line-height: 20px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  color: ${(props) => colors[props.color]};
`
export const BottomLabel = styled.div`
  font-family: ${typography.type.motiva_medium};
  line-height: 24px;
  font-size: 16px;
  color: ${(props) => colors[props.color]};
`

export const InnerCircle = styled.div`
  background-color: ${(props) => colors[props.background] || colors.white};
  border-radius: 50%;
  position: absolute;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  margin-top: ${(props) => props.top}px;
  margin-left: ${(props) => props.left}px;
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: ${(props) => (props.variant === 'vertical' ? '0' : '12px')}; ;
`
export const IconWrapper = styled.div`
  min-width: ${(props) => props.size}px;
`
