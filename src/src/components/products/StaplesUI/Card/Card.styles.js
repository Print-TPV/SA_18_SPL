/* eslint-disable no-confusing-arrow */
import styled from 'styled-components'
import { colors, textColorByBackground } from '../styles/colors'

export const CardWrapper = styled.div`
  ${(props) =>
    (props.isBorder || props.isActive) && {
      border: `1px solid ${props.isActive ? colors.premium : colors.ink_light_gray}`,
    }}
  ${(props) =>
    props.isHover && '&:hover { box-shadow: 0px 0px 6px rgba(155, 155, 155, 0.7) }'}
  padding: ${(props) =>
    props.padding === 'lg' ? '24px' : props.padding === 'md' ? '16px' : '8px'};
  border-radius: ${(props) => (props.borderRadius === 'lg' ? '16px' : '8px')};
  cursor: ${props => props.isClickable ? 'pointer' : 'auto'};
  width: 100%;
  background-color: ${props => colors[props.backgroundColor]};
  color: ${props => textColorByBackground[props.backgroundColor]};
  margin: ${props => props.margin}px;
  ${props => props.cardCustomCSS ? props.cardCustomCSS : ''};
`