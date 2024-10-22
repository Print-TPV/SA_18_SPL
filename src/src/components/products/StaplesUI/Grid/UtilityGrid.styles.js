import styled from 'styled-components'
import { BREAKPOINTS } from '../utility/helpers'

export const GridContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas: 
    "grid-card-1 grid-card-3 grid-card-4"
    "grid-card-2 grid-card-3 grid-card-5";

    @media all and (max-width: ${BREAKPOINTS.md}px) {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr 1fr;
      grid-template-areas: 
        "grid-card-1 grid-card-3"
        "grid-card-2 grid-card-3"
        "grid-card-4 grid-card-5";
    }
  
    @media all and (max-width: ${BREAKPOINTS.sm}px) {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1fr 2fr 1fr 1fr;
      grid-template-areas: 
        "grid-card-1"
        "grid-card-2"
        "grid-card-3"
        "grid-card-4"
        "grid-card-5";
    }
    ${props => props.customCSS ? props.customCSS : ''}
`

export const CardWrapper = styled.div`
  padding: 0;
  margin: 0;
  grid-area: ${props => props.name};

  > div {
    min-height: ${props => props.name.endsWith('3') ? 456 : 222}px;
  }
  @media all and (max-width: ${BREAKPOINTS.xs}px) {
    > div {
      min-height: ${props => props.name.endsWith('3') ? 340 : 166}px;
    }
  }
`