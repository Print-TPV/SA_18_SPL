import styled from 'styled-components'
import { colors } from '../styles/colors'
import { typography } from '../styles/fonts'

export const Container = styled.ul`
  list-style-type: none;
  margin-block-start: 0;
  margin-block-end: 0;
  margin-inline-start: 0;
  margin-inline-end: 0;
  padding-inline-start: 0;
  ${(props) => (props.customCSS ? props.customCSS : '')};
`
export const AccordionItemWrapper = styled.li`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  ${({ variant }) =>
    variant === 'gray'
      ? `background-color: ${colors.light_gray_2};
    border: 1px solid ${colors.light_gray_1};
    border-radius: 7px;`
      : `background-color: ${colors.white};`}
      ${(props) => (props.customCSS ? props.customCSS : '')};
`

export const AccordionHeader = styled.div`
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: start;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  z-index: 2;
  font-family: ${typography.type.motiva_medium};
  font-size: ${typography.size.lg};
  &:focus {
    outline: 1px dashed #000;
    outline-offset: 1px;
    z-index: 3;
  }
  &:hover {
    background-color: ${({ variant }) =>
      variant === 'gray' ? `${colors.light_gray_transparent}` : `${colors.light_blue}`};
  }

  ${({ breakpoint }) =>
    (breakpoint === 'sm' ||
    breakpoint === 'xs') &&
      `
    padding: 12px 14px;
    font-size:${typography.size.md};
    text-align: left;
`}
 ${(props) => (props.customCSS ? props.customCSS : '')};
`
export const TitleWrapper= styled.div`
display: flex;
      justify-content: space-between;
      flex-direction: row;
      width: 100%;
`

export const Arrow = styled.div`
  padding: 0 8px;
  align-self: center;
  ${({ breakpoint }) =>
    (breakpoint === 'sm' ||
    breakpoint === 'xs') &&
      `
          svg {
          width: 10px;
          height: 10px;
        }
`}
`

const getOverFlowProperty = ({ open, maxHeight }) => {
  if (open) {
    return 'visible'
  }
  if (maxHeight) {
    return 'auto'
  }
  return 'hidden'
}

export const AccordionBody = styled.div`
  transition: height 0.225s cubic-bezier(0.15, 0.5, 0.5, 1);
  overflow: ${(props) => getOverFlowProperty(props)};
  width: 100%;
  position: relative;
  ${({ open, childProp }) =>
    open ? (childProp === false ? 'height: 50vh' : 'min-height: auto') : 'height: 1px'};
  ${({ childProp }) =>
    childProp === false &&
    `
    background-color: ${colors.light_gray_2};
    display: flex;
    justify-content: center;
    align-items: center;`}
  &:focus {
    outline: none;
  }
  &:after {
    position : absolute;
    content : '';
    bottom: 0;
    border-bottom: ${({ variant }) => (variant === 'gray' ? 'none' : `1px solid ${colors.light_gray_1}`)};
    width: calc(100% - 30px);
    left: 0;
    right: 0;
    margin: 0 auto;
  }
`
export const AccordionContainer = styled.div`
  padding: 0 16px 16px 16px;
  ${({ childProp, maxWidth }) => childProp === true && `max-width: ${maxWidth};`}
  ${({ breakpoint }) =>
    (breakpoint === 'sm' ||
    breakpoint === 'xs') &&
      `
   max-width: 100%;
   font-size:${typography.size.sm};
`}
display: ${(props) => (props.open ? 'show': 'none')};
 ${(props) => (props.customCSS ? props.customCSS : '')};
`

export const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${colors.light_gray_2};
`
export const LoadingContainer = styled.div`
  padding: 16px;
  font-family: ${typography.type.motiva_light};
`
export const SubTitleWrapper = styled.div`
font-size:${typography.size.sm};
line-height: 16px;
font-family: ${typography.type.motiva_light};
color:${colors.black};
`
