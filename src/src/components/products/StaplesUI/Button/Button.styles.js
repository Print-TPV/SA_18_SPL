import styled from 'styled-components'
import { colors } from '../styles/colors'
import { typography } from '../styles/fonts'

export const themes = {
    components: {
      color: colors.staples_red,
      colorName: 'staples_red',
      button: {
        background: {
          primary: colors.staples_red,
          secondary: colors.white,
          text: colors.transparent,
          reward: colors.rewards,
          outlined: colors.white,
          premium: colors.premium,
          easyRewards: colors.easy_rewards,
        },
        hover: {
          primary: colors.negative,
          secondary: colors.white,
          text: colors.light_gray_2,
          reward: colors.light_rewards,
          premium: colors.premium_1,
        },
        textColor: {
          primary: colors.white,
          secondary: colors.black,
          text: colors.black,
          reward: colors.black,
          outlined: colors.black,
          premium: colors.white,
          easyRewards: colors.white,
        },
      }
    }
}


export const StyledButton = styled.button`
  font-family: ${(props) => (props.variant === 'text' ? typography.type.motiva : typography.type.motiva_medium)};
  display: inline-flex;
  width: ${(props) => props.width};
  height: auto;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  border: 0;
  transition: all 0.1s ease-in;
  margin: 10px 10px 10px;
  box-shadow: ${(props) =>
    props.variant === 'text' || props.variant === 'outlined' || props.variant === 'secondary' ? 'none' : '0px 2px 12px 0px rgba(0, 0, 0, 0.15)'};
  border-radius: ${(props) => (props.size === 'md' ? '22px' : '20px')};
  ${({ iconOnly, size, variant, qtyBtn }) =>
    iconOnly
      ? {
          padding: `${size === 'md' ? '10px' : size === 'sm' ? '8px' : '4px'};`,
        }
      : variant === 'text'
      ? {
          padding: `${size === 'md' ? '10px 16px' : size === 'sm' ? '8px 16px' : '4px 16px'};`,
        }
      : qtyBtn
      ? {
          padding: `${size === 'md' ? '10px 20px' : size === 'sm' ? '8px 16px' : '4px 12px'};`,
        }
      : {
          padding: `${size === 'md' ? '10px 28px' : size === 'sm' ? '8px 20px' : '4px 16px'};`,
        }};
  background-color: ${(props) => {
    return props.selected
      ? colors.light_forest_2
      : props.theme.components
      ? props.theme.components.button.background[props.variant]
      : '#c00'} };
  border: ${(props) =>
    props.variant === 'secondary-alt'
      ? `1px solid ${colors.white}`
      : props.variant === 'outlined'
      ? `1px solid ${colors.dark_gray_2}`
      : props.variant === 'activate'
      ? `1px solid ${colors.activate}`
      : 'none'};
  ${(props) => (props.variant === 'secondary' ? `border: 1px solid ${colors.medium_gray_1};` : '')};

  &:hover:not(:active) {
    background: ${(props) =>
      props.selected
        ? colors.light_forest_2
        : props.theme.components
        ? props.theme.components.button.hover[props.variant]
        : '#c00'};
    box-shadow: ${(props) => (props.variant === 'text' ? 'none' : '0px 2px 12px 0px rgba(0, 0, 0, 0.3)')};
    ${(props) => (props.variant === 'secondary' ? `border: 1px solid ${colors.medium_gray_1};` : '')};
    ${(props) =>
      props.selected &&
      `
    background-color: ${colors.light_forest_2};
  `};
    ${(props) =>
      props.variant === 'outlined' && {
        'text-decoration': 'underline',
      }};
  }

  :active {
    box-shadow: none;
    background: ${(props) =>
      props.selected
        ? colors.light_forest_2
        : props.theme.components
        ? props.theme.components.button.hover[props.variant]
        : '#c00'};
  }

  :focus:not(:focus-visible) {
    outline: none;
  }

  ${(props) =>
    props.disabled
      ? `pointer-events: none;
    cursor: auto;
    background-color: ${props.variant === 'text' ? 'transparent' : colors.light_gray_1};
    box-shadow: none;
    border: none;
    &:hover:not(:active) { 
      background-color: ${props.variant === 'text' ? 'transparent' : colors.light_gray_1};
      box-shadow: none;
    }
    :active { 
      background-color: ${props.variant === 'text' ? 'transparent' : colors.light_gray_1};
      box-shadow: none;
    }
    `
      : ''}
  ${(props) =>
    props.disabled && props.qtyBtn
      ? `pointer-events: none;
        cursor: auto;
        box-shadow: none;
        border: 1px solid ${colors.light_gray_1};
        background-color: ${colors.white};
        `
      : ''}
  & div {
    ${props => props.iconOnly && `
      height: ${props.size === 'md' ? '24px' : props.size === 'sm' ? '20px' : '16px'};
      width: ${props.size === 'md' ? '24px' : props.size === 'sm' ? '20px' : '16px'};
    `}
  }
  & svg {
    ${(props) => !props.iconOnly ? `fill: 
      ${props.disabled
        ? colors.dark_gray_2
        : props.theme.components
        ? props.theme.components.button.textColor[props.variant]
        : '#c00'} !important;` : ''}
    margin: ${(props) => (props.iconOnly ? '0 !important' : '0 7px 0 0 !important')};
    padding: 0;
    ${(props) => props.iconOnly && 'top: 0; left: 0;'}
    height: ${(props) => (props.size === 'md' ? '24px' : props.size === 'sm' ? '20px' : '16px')};
    width: ${(props) => (props.size === 'md' ? '24px' : props.size === 'sm' ? '20px' : '16px')};
  }
  ${(props) => (props.customCSS ? props.customCSS : '')}
`

export const StyledText = styled.span`
  padding: 0;
  margin: 0;
  line-height: ${(props) => (props.size === 'md' ? '24px' : '20px')};
  letter-spacing: 0;
  font-size: ${(props) => (props.size === 'md' ? '16px' : '14px')};
  color: ${(props) =>
    props.textColor
      ? colors[props.textColor]
      : props.selected
      ? colors.black
      : props.disabled
      ? colors.dark_gray_2
      : props.variant === 'activate'
      ? colors.activate
      : props.theme.components
      ? props.theme.components.button.textColor[props.variant]
      : 'white'};
  display: flex;
  align-items: center;
`
