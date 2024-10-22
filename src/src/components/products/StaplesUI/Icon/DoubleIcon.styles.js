import styled from 'styled-components'

export const Double = styled.div`
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  top: 0;
  left: 0;
  position: relative;
  > svg, div {
    position: absolute;
  }
  ${(props) => props.customCSS}
`
