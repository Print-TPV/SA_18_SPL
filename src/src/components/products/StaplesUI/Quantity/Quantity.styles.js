import styled from 'styled-components'
import { colors } from '../styles/colors'
import { typography } from '../styles/fonts'

export const Wrapper = styled.div`
  ${props => props.customCSS ? props.customCSS : ''};
`

export const ContainerWrapper = styled.div`
  position: relative;
  width: max-content;
  ${(props) =>
    props.disabled &&
    `
      color: ${colors.neutral_gray};
    `}
`
export const ErrorMessage = styled.div`
  color: ${colors.brand};
  position: absolute;
  width: 200%;
  ${(props) =>
    (props.errorPosition === 'right' ||
      props.errorPosition === 'left') &&
    `
        top: 13px;
      `}
${(props) =>
    props.errorPosition === 'right' &&
    `
      bottom: 12px;
      left: 92px;
    `}
${(props) =>
    props.errorPosition === 'left' &&
    `
      right: 15px;
    `}
    ${(props) =>
    props.errorPosition === 'top' &&
    `
        bottom: 55px;
      `}
`
export const InputContainer = styled.div`
  display: flex;
  font-family: ${typography.type.motiva_light};
`

export const Label = styled.label`
  font-family: inherit;
  font-size: 14px;
  line-height: 14px;
  font-weight: 300;
  background: linear-gradient(
    transparent 80%,
    ${colors.white} 80%,
    ${colors.white} 100%
  );
  position: absolute;
  top: -12px;
  display: block;
  padding: 0 6px;
  margin-left: ${props => props.size === 'xs' || props.size === 'sm' ? '5px' : '9px'};
  width: max-content;
  min-height: auto;
  ${(props) =>
    props.disabled &&
    `
      background: linear-gradient(
        transparent 80%,
        ${colors.light_gray_2} 80%,
        ${colors.light_gray_2} 100%
      );
    `}
`
export const QtyNumber = styled.div`
  height: ${props => props.size === 'xs' || props.size === 'sm' ? '30px' : '44px'};
  padding-top: ${props => props.size === 'xs' || props.size === 'sm' ? '3px' : '10px'};
  width: ${props => props.size === 'xs' || props.size === 'sm' ? '28px' : '32px'};
  cursor: text; 
  ${(props) =>
    props.disabled &&
    `
      color: ${colors.neutral_gray};
    `}
`
export const DropDownBtn = styled.div`
  display: flex;
  flex-direction: row;
  height: ${props =>props.size === 'xs' ? '28px' : props.size === 'sm' ? '32px' : '46px'};
  font-family: inherit;
  color: ${colors.black};
  border-radius: 3px;
  padding: 12px 4px 12px 8px;
  border: 1px solid ${colors.neutral_gray};
  font-size: ${props => props.size === 'xs' || props.size === 'sm' ? '14px' : '16px'};
  width:  ${props => props.size === 'xs' || props.size === 'sm'? '68px' : '86px'}; 
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  ${(props) =>
    props.disabled &&
    `
      border-width: 1px;
      border-color: ${colors.neutral_gray};
      background: ${colors.light_gray_2};
      cursor: default;
      &:hover {
        border-width: 1px;
        border-color: ${colors.neutral_gray};
      }
    `}
  ${(props) =>
    props.errorMessage &&
    `
      border-color: ${colors.brand};
    `}
`

export const OptionsContainer = styled.div`
  font-family: ${typography.type.motiva_light};
  font-size: ${props => props.size === 'xs' || props.size === 'sm' ? '14px' : '16px'};
  margin-top: 8px;
  flex-flow: column nowrap;
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.25);
  position: absolute;
  z-index: 9995;
  background-color: ${colors.white};
  white-space: nowrap;
  min-width: 98px;
  overflow-y: auto;
  display: none;
  bottom: ${(props) => props.position === 'up' ? 'calc(100% + 15px)' : 'initial'};
  ${(props) => props.alignment === 'right' && 'right: 0;'}
  &:focus {
    outline: none;
  }
  ${(props) =>
    props.open &&
    `
      display: flex;
    `}
  ${(props) =>
    props.maxHeight &&
    `
      max-height: ${props.maxHeight};
    `}
${(props) =>
    props.errorPosition &&
    `
      max-height: calc(100% + 15px);
    `}
${(props) =>
    props.errorPosition === 'left' &&
    `
      margin-left: 100%;
    `}
`

export const SelectedOption = styled.span`
  padding: 6px;
`

export const DropDownOption = styled.div`
  border: none;
  width: auto;
  cursor: pointer;
  background: transparent;
  text-align: left;
  font-family: inherit;
  padding: 7px 20px 7px 28px;
  min-height: 38px;
  &:focus-visible {
    outline: none;
  }
  &:hover,
  &:focus:not(${SelectedOption})
  &:focus:not(:focus-visible)
  {
    background: ${colors.light_blue};
    outline: none;
  }
  ${(props) =>
    props.selected &&
    `
      padding: 7px 0 7px 0;
      background: ${colors.light_blue};
    `}
  ${(props) =>
    props.highlighted &&
    `
      background: ${colors.light_blue};
    `}
`

export const InputStyle = styled.input`
  height: ${props =>props.size === 'xs' ? '28px' : props.size === 'sm' ? '32px' : '46px'};
  font-family: inherit;
  font-size: ${props => props.size === 'xs' || props.size === 'sm' ? '14px' : '16px'};
  color: ${colors.black};
  border-radius: 3px;
  padding: 12px 4px 12px 8px;
  border: 1px solid ${colors.neutral_gray};
  width:  ${props => props.size === 'xs' || props.size === 'sm' ? '68px' : '86px'}; 
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;

  &:focus {
    outline: 0;
    background: ${colors.light_blue};
    border-color: ${(props) =>
    props.errorMessage ? colors.brand : colors.ink_blue};
  }
  &:hover {
    border-color: ${(props) =>
    props.errorMessage ? colors.brand : colors.ink_blue};
  }
  ${(props) =>
    props.disabled &&
    `
      border-width: 1px;
      border-color: ${colors.neutral_gray};
      background: ${colors.light_gray_2};
      cursor: default;
      &:hover {
        border-width: 1px;
        border-color: ${colors.neutral_gray};
      }
    `}
`