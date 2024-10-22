import styled from 'styled-components'
import { typography } from '../styles/fonts'
import { colors } from '../styles/colors'
import { BREAKPOINTS } from '../utility/helpers'

export const StyledDropdownMenu = styled.div`
  font-family: ${typography.type.motiva_light};
  margin-top: 8px;
  flex-flow: column nowrap;
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.25);
  position: absolute;
  z-index: 9995;
  background-color: ${colors.white};
  overflow-y: auto;
  width: 100%;
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  &:focus {
    outline: none;
  }
  ${(props) => (props.align === 'right' ? 'right: 0px;' : '')}
`

export const StyledDropdownItem = styled.div`
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: ${(props) => (props.size === 'sm' ? '14px' : '16px')};
  font-family: inherit;
  padding: 7px 9px;
  background: ${(props) => (props.index === props.dropdownIndex ? colors.light_blue : 'transparent')};
  &:hover {
    background: ${colors.light_blue};
  }
  &:focus {
    outline: none;
  }
  & > span {
    padding: 6px;
  }
  display: flex;
  span {
    padding: 0 6px;
  }
`

export const WithoutIconStyleWrap = styled.div`
  min-width: 28px;
`
export const BoldSpan = styled.span`
  padding: 0;
  span {
    padding: 0;
    font-family: ${typography.type.motiva_medium};
  }
`

export const AddEntryIcon = styled.span`
  margin-top: -2px;
  transform: rotateZ(45deg);
`

export const SubText = styled.div`
  font-size: 14px;
  color: ${colors.dark_gray_2};
  padding-left: 10px;
  @media all and (max-width: ${BREAKPOINTS.xs}px) {
    padding: 0 6px;
  }
`

export const StyledFlex = styled.div`
  display: flex;
  @media all and (max-width: ${BREAKPOINTS.xs}px) {
    flex-direction: column;
  }
`