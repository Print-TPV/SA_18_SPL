/* eslint-disable no-confusing-arrow */
import styled from 'styled-components'
import { colors } from '../styles/colors'

export const BackDrop = styled.div`
  position: fixed;
  top: ${(props) => (props.showSubHeader ? '60px' : '0')};
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 65535;
  visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.show ? '1' : '0')};
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 500ms ease;
`

const getWidth = (props) => {
  if (props.show && props.fullscreen) {
    return '100%'
  }
  if (props.show) {
    return '744px'
  }
  return '200px'
}

export const Wrapper = styled.div`
  background: ${colors.white};
  width: ${(props) => getWidth(props)};
  height: ${(props) => (props.fullscreen ? '100%' : 'auto')};
  box-shadow: 0 0 6px rgba(155, 155, 155, 0.7);
  position: relative;
  border-radius: ${(props) => (props.fullscreen ? '0' : '12px')};
  visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.show ? '1' : '0')};
  transition: opacity 500ms ease;
  ${props => props.customCSS ? props.customCSS : ''};
`

export const Body = styled.div`
  padding: 12px 12px 24px 12px;
  max-height: 90vh;
  overflow: auto;
`
export const CloseBar = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const CloseBtn = styled.button`
  margin-top: 12px;
  margin-right: 12px;
  padding: unset;
  cursor: pointer;
  font-size: 0.86em;
  background: transparent;
  border: none;
`

export const BtnWrapper = styled.div`
  display: flex;
  padding: 24px;
`

export const AlignBtnTxt = styled.span`
  padding: 0 0 0 5px;
`
