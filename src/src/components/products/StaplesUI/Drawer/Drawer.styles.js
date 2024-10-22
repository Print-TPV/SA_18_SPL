import styled, { css } from 'styled-components'
import { slide } from '../styles/animation'
import { typography } from '../styles/fonts'
import { colors, textColorByBackground } from '../styles/colors'

const getKeyframes = (open, side, max) => {
  let start = 0
  let end = 0
  const negMax = `-${max}`
  if (side === 'right') {
    start = open ? max : 0
    end = open ? 0 : max
  } else {
    start = open ? negMax : 0
    end = open ? 0 : negMax
  }
  return slide(start, end)
}

const DRAWER_SIZES = {
  xl: '944px',
  lg: '744px',
  md: '600px',
  sm: '480px',
}

export const slideAnimation = css`
  animation: ${(props) => getKeyframes(props.isOpen, props.side, '300em')} 0.6s cubic-bezier(1, 0.01, 0.01, 1) forwards;
  transition: width 1.1s ease;
`

export const Container = styled.div`
  width: ${(props) =>
    props.size === 'sm'
      ? DRAWER_SIZES.sm
      : props.size === 'md'
      ? DRAWER_SIZES.md
      : props.size === 'lg'
      ? DRAWER_SIZES.lg
      : DRAWER_SIZES.xl};
  box-shadow: 0 0 6px hsl(0deg 0% 61% / 70%);
  position: fixed;
  border-radius: 3px;
  transform: translateX(300em);
  ${(props) => (props.side === 'left' ? 'left: 0;' : 'right: 0;')}
  top: 0;
  height: 100%;
  z-index: 75540;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => colors[props.backgroundColor]};
  color: ${(props) => textColorByBackground[props.backgroundColor]};
  ${(props) => (props.status ? slideAnimation : '')}

  @media all and (max-width: ${DRAWER_SIZES.sm}) {
    width: 100vw;
  }
  ${(props) =>
    props.size === 'md'
      ? `@media all and (max-width: ${DRAWER_SIZES.md}) {
      width: 100vw;
    }`
      : ''}
  ${(props) =>
    props.size === 'lg'
      ? `@media all and (max-width: ${DRAWER_SIZES.lg}) {
      width: 100vw;
    }`
      : ''}
  ${(props) =>
    props.size === 'xl'
      ? `@media all and (max-width: ${DRAWER_SIZES.xl}) {
      width: 100vw;
    }`
      : ''}
  ${(props) => (props.customCSS ? props.customCSS : '')};
`

export const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 75535;
  visibility: ${(props) => (props.isOpen ? 'visible' : 'hidden')};
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.5);
`

export const Footer = styled.div`
  display: flex;
  width: 100%;
  bottom: 0;
  border-radius: 0;
  box-shadow: 0 0 6px hsla(0, 0%, 61%, 0.7);
  height: auto;
  padding: 12px 24px;
  flex-direction: row;
  justify-content: flex-end;
  position: relative;
  z-index: 9;
  button {
    margin-left: 12px;
  }
  ${(props) => (props.customCSS ? props.customCSS : '')};
`

export const StickyHeader = styled.div`
  box-shadow: 0 9px 14px 0 rgb(0 0 0 / 8%);
  flex-grow: 0;
  padding: 12px 24px;
  z-index: 12000;
  background: white;
  ${(props) => (props.customCSS ? props.customCSS : '')};
`

export const Body = styled.div`
  padding: 12px 24px;
  flex-grow: 1;
  font-size: 14px;
  overflow-y: scroll;
  overflow-x: hidden;
  height: 100%;
  position: relative;
  ${(props) => (props.customCSS ? props.customCSS : '')};
`

export const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 24px;
  background: ${(props) => (props.headerBg === 'white' ? colors.white : props.theme.components.drawer.color)};
  color: ${(props) => (props.headerBg === 'white' ? colors.black : props.theme.components.drawer.text)};
  letter-spacing: 0.6px;
  text-align: center;
  line-height: 24px;
  font-family: ${typography.type.motiva_medium};
  font-size: 16px;
  flex-grow: 0;
  min-height: 64px;
  height: 64px;
  z-index: 12000;
  ${(props) =>
    props.centerTitle
      ? `justify-content: space-between;
      div {
        margin-left: auto;
      } `
      : `
   div,
  span {
    padding: 0 12px 0 0;
  }
  `}

  ${(props) => (props.customCSS ? props.customCSS : '')};

  @media all and (max-width: ${DRAWER_SIZES.sm}) {
    padding: 0 12px;
  }
`

export const Close = styled.button.attrs((props) => ({
  type: props.type || 'button',
}))`
  display: flex;
  margin-left: auto;
  right: 24px;
  cursor: pointer;
  padding: 0 12px 0 0;
  background: transparent;
  border: 0;
  ${(props) => (props.customCSS ? props.customCSS : '')};
  @media all and (max-width: ${DRAWER_SIZES.sm}) {
    right: 12px;
  }
  &:focus {
    outline: 1px dashed ${colors.black} !important;
  }
`
