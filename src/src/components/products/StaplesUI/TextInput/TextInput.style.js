/* eslint-disable no-confusing-arrow */
import styled from 'styled-components'
import { colors, getLabelBGColors } from '../styles/colors'
import { typography } from '../styles/fonts'

const borderColor = (props, hover) => {
  if (props.error) {
    return colors.staples_red
  }
  if (props.inputFocus || hover) {
    return colors.link_blue
  }
  return colors.medium_gray_1
}

export const InputWrapperContainer = styled.div`
  width: 100%;
  height: ${(props) =>
    props.multiple ? 'auto' : props.size === 'md' ? '40px' : '38px'};
  padding: ${(props) => props.multiple ? '8px' : '0 8px'};
  border: ${(props) => (props.inputFocus ? 2 : 1)}px solid
    ${(props) => (props.inputFocus ? colors.link_blue : borderColor(props))};
  font-size: ${(props) => (props.size === 'md' ? '16px' : '14px')};
  border-radius: 4px;
  outline: none;
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  align-items: center;
  background: ${colors.white};
  text-transform: ${(props) =>
    props.convertToUppercase ? 'uppercase' : 'initial'};
  &:hover {
    border: ${(props) => (props.inputFocus ? 2 : 1)}px solid
      ${(props) => borderColor(props, true)};
  }
  &:focus {
    padding: 0 8px;
  }
  ${(props) =>
    props.disabled &&
    `
    background: ${colors.light_gray_2};
    color: ${colors.neutral_gray};
    border: 1px solid ${colors.dark_gray_2};
`}
  ${(props) => (props.customCSS ? props.customCSS : '')};
`

export const Label = styled.label`
  font-family: ${typography.type.motiva_light};
  font-size: 14px;
  line-height: 14px;
  font-weight: 300;
  position: absolute;
  top: -12px;
  z-index: 99;
  padding: 2px 4px;
  left: 5px;
  text-transform: inherit;
  margin: 0;
  background: transparent;
  &::after {
    position: absolute;
    content: '';
    width: 100%;
    height: 3px;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 70%;
    background: ${(props) =>
    getLabelBGColors(props.disabled, props.labelBGColor)};
    z-index: -1;
  }
  span {
    color: ${colors.brand};
    width: 9px;
    height: 8px;
    font-size: 20px;
    letter-spacing: 0;
    line-height: 14px;
    position: absolute;
    background: none;
    right: -5px;
    top: 2px;
  }
`

export const InputWrapper = styled.div`
  position: relative;
`

export const ButtonWrapper = styled.div`
  display: flex;
`

export const Button = styled.button`
  border: 0;
  background: transparent;
  cursor: pointer;
  padding: 1px 3px 1px 6px;
`
export const HintText = styled.div`
  color: ${colors.medium_gray_2};
  font-size: 14px;
  letter-spacing: 0;
  line-height: 20px;
  font-family: ${typography.type.motiva_light};
`

export const ShowHidePWD = styled.div`
  display: flex;
  margin: 5px;
  align-self: center;
  cursor: pointer;
  width: 30px;
`
export const MainWrapper = styled.div`
  position: relative;
  margin: 3px 0;
`
export const Input = styled.input`
  display: flex;
  height: 100%;
  width: 100%;
  border: 0;
  margin: 0;
  padding: 0;
  background: inherit;
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &:focus {
    outline: none;
  }
  ${(props) =>
    props.type === 'number' &&
    `
    -moz-appearance:textfield;
`}
  ${(props) =>
    props.type === 'password' &&
    `
    ::-ms-reveal {
      display: none;
    }
`}
  text-transform: ${(props) =>
    props.convertToUppercase ? 'uppercase' : 'initial'};
`
export const InputTagContainer = styled.div`
  flex: 1;
`

export const StyledButton = styled.button`
  white-space: nowrap;
  border: 1px solid #969696;
  border-radius: 30px;
  padding: 4px 8px;
  font-size: 14px;
  margin: 3px 5px 3px 0;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const IconWrapper = styled.div`
  background: ${colors.light_blue};
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 3px;
`