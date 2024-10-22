import styled from 'styled-components'
import { colors } from '../styles/colors'
import { typography } from '../styles/fonts'

const variantBackground = (type) => {
  switch (type) {
    case 'product':
      return colors.light_red_2
    case 'price':
      return colors.light_magenta_1
    case 'primary':
      return colors.light_forest_2
    case 'stock':
      return colors.light_orange_2
    case 'premium':
      return colors.premium
    case 'select':
      return colors.select
    case 'new':
      return colors.light_blue
    case 'choice':
      return colors.staples_red
    default:
      return colors.select
  }
}

const variantColor = (type) => {
  switch (type) {
    case 'product':
      return colors.staples_red
    case 'price':
      return colors.magenta
    case 'stock':
      return colors.orange
    case 'primary':
      return colors.forest
    case 'premium':
    case 'select':
      return colors.white
    case 'new':
      return colors.ink_blue
    case 'choice':
      return colors.white
    default:
      return colors.staples_red
  }
}

export const StyledBadge = styled.div`
  display: inline-block;
  font-family: ${typography.type.motiva_bold};
  font-style: italic;
  line-height: ${(props) => (props.size === 'sm' ? '12px' : '20px')};
  border-radius: ${(props) => (props.size === 'sm' ? '8px 0' : '16px 0')};
  font-size: ${(props) => (props.size === 'sm' ? '10px' : '14px')};
  padding: ${(props) => (props.size === 'sm' ? '7px 8px' : '6px 12px')};
  margin: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: ${(props) => variantBackground(props.type)};
  color: ${(props) => variantColor(props.type)};
  ${(props) => (props.customCSS ? props.customCSS : '')};
`