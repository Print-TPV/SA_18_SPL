import styled from 'styled-components'
import { typography } from '../styles/fonts'
import { BREAKPOINTS } from '../utility/helpers'
import { colors, getLabelBGColors } from '../styles/colors'

export const StyledDropdownContainer = styled.div`
  position: relative;
  display: inline-block;
  width: max-content;
  ${(props) =>
    props.dropDownType === 'delivery' &&
    `
   @media all and (max-width: ${BREAKPOINTS.xs}px) {
    width:auto;
  }`}
  ${(props) => (props.customCSS ? props.customCSS : '')};
`
const borderColor = (props, hover) => {
  if (props.withoutContainer) {
    return 0
  }
  if (props.errorMsg) {
    return `1px solid ${colors.staples_red}`
  }
  if (!props.disabled && hover) {
    return `2px solid ${colors.ink_blue}`
  }
  return `1px solid ${colors.medium_gray_1}`
}

export const StyledDropdownButton = styled.div`
  font-family: ${(props) =>
    props.labelFontfamily === 'motiva' ? typography.type.motiva : typography.type.motiva_light};
  position: relative;
  display: inline-flex;
  justify-content: right;
  width: 100%;
  & > div {
    width: 100%;
  & > span {
    display: inline-flex;
    padding-right: 5px;
    font-size:  ${(props) => (props.labelFontsize ? props.labelFontsize : '14px')};
  }
  & div[role='button'] {
    cursor: ${(props) => (!props.disabled ? 'pointer' : 'default')};
    height: ${(props) => (props.size === 'sm' ? '38px' : props.height)};
    width: ${(props) => props.width};
    font-family: inherit;
    color: ${(props) => (!props.disabled ? colors.black : colors.medium_gray_1)};
    border-radius: 3px;
    padding: ${(props) =>
      props.size === 'sm'
        ? '3px 4px 3px 8px'
        : props.dropDownType === 'typeAhead'
        ? '0 4px 0 0'
        : '12px 4px 12px 12px'};
    border: ${(props) => borderColor(props)};
    font-size: ${(props) => (props.labelFontsize ? props.labelFontsize : props.size === 'sm' ? '14px' : '16px')};
    background: ${(props) => (!props.disabled ? 'transparent' : colors.light_gray_2)};
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    &:hover,
    &:focus {
      border: ${(props) => borderColor(props, true)};
      outline: ${(props) => (props.withoutContainer ? `1px dashed ${colors.black} ` : 'none')};
    }
    & span {
      padding-right: 6px;
    }
  }
  label {
    font-family: inherit;
    font-size:  ${(props) => (props.labelFontsize ? props.labelFontsize : '14px')};
    line-height: 14px;
    font-weight: 300;
    background: ${(props) => getLabelBGColors(props.disabled, props.labelBGColor)};
    position: absolute;
    top: -12px;
    display: block;
    padding: 0 6px;
    margin-left: 9px;
    width: max-content;
    min-height: auto;
    max-width: 97%;
    overflow: hidden;
    text-overflow: ellipsis;
    text-transform: initial;
    white-space: nowrap;
  }
`

export const TextWrapper = styled.div`
  flex: 1 1 auto;
  width: 1%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

export const Input = styled.input`
  background: transparent;
  border: 0;
  padding: 12px 0 12px 12px;
  flex: 1 1 auto;
  width: 1%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  cursor: ${(props) => (props.dropDownType !== 'typeAhead' ? 'pointer' : 'text')};
  &:focus {
    outline: 0;
  }
  &:placeholder-shown {
    text-overflow: ellipsis;
  }
`

export const Required = styled.span`
  color: ${colors.staples_red};
  width: 9px;
  height: 20px;
  font-size: 20px;
  letter-spacing: 0;
  line-height: 14px;
  position: absolute;
  background: none;
  right: -1px;
  top: 2px;
`