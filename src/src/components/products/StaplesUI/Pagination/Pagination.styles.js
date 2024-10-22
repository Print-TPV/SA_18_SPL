import styled from 'styled-components'
import { colors } from '../styles/colors'
import { DropDownBtn } from '../Quantity/Quantity.styles'
import {BREAKPOINTS} from '../utility/helpers';

export const PaginationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  ${(props) => (props.customCSS ? props.customCSS : '')};
`
export const PaginationText = styled.div`
  font-size: 16px;
  margin: 0;
  text-align: center;
  color: ${colors.black};
  span {
    padding: 0 5px;
    font-weight: bold;
  }
`
export const PaginationControlWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: ${(props) => (props.showLabel ? '15px' : 0)};
`

export const PaginationControl = styled.a`
  background: ${colors.white};
  border-radius: 50%;
  box-shadow: 0 1px 4px 0 rgb(0 0 0 / 12%);
  height: 32px;
  width: 32px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: 0;
  cursor: pointer;
  ${(props) => (props.custCSS ? props.custCSS : '')};
  ${(props) =>
    props.disabled && {
      opacity: '0.5',
      cursor: 'none',
      'pointer-events': 'none',
      background: colors.light_gray_2,
      'box-shadow': 'none' 
    }};
  &:focus {
    outline: ${(props) => (props.disabled ? '0' : 'rgb(0, 0, 0) dashed 1px')};
  }
  &:focus:not(:focus-visible) {
    outline: ${(props) => (props.disabled ? '0' : 'rgb(0, 0, 0) dashed 1px')};
  }
`
export const CountText = styled.div`
  display: inline-flex;
  align-items: center;
  padding: ${(props) => (props.size === 'sm' ? '0 12px' : '0 20px')};
  font-size: ${(props) => (props.size === 'sm' ? '14px' : '16px')};
`

export const ViewAll = styled.button`
  margin-left: 4px;
  font-size: 16px;
  color: ${colors.ink_blue};
  border: 0;
  background: ${colors.white};
`

export const SelectionContainer = styled.span`
  padding: ${(props) => (props.size === 'sm' ? '0 4px' : '0 16px')};
  ${DropDownBtn} {
    width: ${(props) => (props.size === 'sm' ? '82px' : '90px')};
    height: ${(props) => (props.size === 'sm' ? '32px' : '44px')};
  }
`