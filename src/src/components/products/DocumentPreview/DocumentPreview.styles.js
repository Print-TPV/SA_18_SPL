import styled from 'styled-components'
import { checkStandardPageSize, getStandardPageSize } from "../Simpleprint/PreviewHelper"
export const PageLabel = styled.span`
    font-size: 16px;
    font-weight: 300;
    line-height: 24px;
    font-family: "Motiva",sans-serif;
    margin-bottom:6px;
   ${(props)=> {return `width: ${props.width}`}};
    color: #000;`
export const PageLabelWrapper = styled.div`
    width:100%;
    display:flex;`

export const StyledDiv = styled.div`
    background: white;
    box-shadow: 0px 1.971px 11.824px 0px rgba(0, 0, 0, 0.15);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    object-fit: contain;
    ${(props) => {
    return props.paperBackground ? `background-color: ${props.paperBackground};` : ''
  }}
  ${(props) => {
    if (!checkStandardPageSize(props.pageSize)) {
      return `{
        padding: ${props.isPrintToEdge ? '0' : props.padding};
        flex-shrink: 0;
        min-height: 10vh;
        height: ${props.pageOrientation === 'Landscape' ? '' : 'calc(90vh - 200px)'};
        width: ${props.pageOrientation === 'Landscape' && props.nextPage === null ? 'calc(100vh - 200px)' : ''};
        max-height: 100vh;
        aspect-ratio:${props.pageOrientation === 'Landscape' ? `${props.aspectRatio[1]}/${props.aspectRatio[0]}` : `${props.aspectRatio[0]}/${props.aspectRatio[1]}`};
        }`
    } else {
      switch (getStandardPageSize(props.pageSize)) {
        case 'Letter': return `{
            padding: ${props.isPrintToEdge ? '0' : props.padding};
            flex-shrink: 0;
            min-height: 10vh;
            height: ${props.pageOrientation === 'Landscape' ? '' : 'calc(90vh - 200px)'};
            width: ${props.pageOrientation === 'Landscape' && (props.nextPage === null || props.currentPage === -1 || props.nextPage === 0 ||props.nextPage === -1 ||props.currentPage === null) ? 'calc(100vh - 200px)' : ''};
            max-height: 100vh;
            aspect-ratio:${props.pageOrientation === 'Landscape' ? '11/8.5' : '8.5/11'};
            }`
        case 'Legal': return `{
            padding: ${props.isPrintToEdge ? '0' : props.padding};
            flex-shrink: 0;
            min-height: 10vh;
            width: ${props.pageOrientation === 'Landscape' && props.nextPage === null ? 'calc(100vh - 100px)' : ''};
            height: ${props.pageOrientation === 'Landscape' ? '' : 'calc(90vh - 200px)'};
            max-height: 100vh;
            aspect-ratio:${props.pageOrientation === 'Landscape' ? '14/8.5' : '8.5/14'};

            }`
        case 'Ledger': return `{
            padding: ${props.isPrintToEdge ? '0' : props.padding};
            flex-shrink: 0;
            min-height: 10vh;
            width: ${props.pageOrientation === 'Landscape' && props.nextPage === null ? 'calc(100vh - 100px)' : ''};
            height: ${props.pageOrientation === 'Landscape' ? '' : 'calc(90vh - 200px)'};
            max-height: 100vh;
            aspect-ratio:${props.pageOrientation === 'Landscape' ? '17/11' : '11/17'};
            }`
        case 'Statement': return `{
              padding: ${props.isPrintToEdge ? '0' : props.padding};
              flex-shrink: 0;
              min-height: 10vh;
              height: calc(90vh - 200px);
              max-height: 100vh;
              aspect-ratio:${props.pageOrientation === 'Landscape' ? '8.5/5.5' : '5.5/8.5'};
              }`
        case 'Quarter': return `{
              padding: ${props.isPrintToEdge ? '0' : props.padding};
              flex-shrink: 0;
              min-height: 10vh;
              height: calc(90vh - 200px);
              max-height: 100vh;
              aspect-ratio:${props.pageOrientation === 'Landscape' ? '5.5/4.25' : '4.25/5.5'};
              }`
        default: return null;
      }
    }
  }}
    ${(props) => {
     return props.float === 'left' && props.nextPage ? 'margin-right: 4px' : props.float === 'right' && props.nextPage ? 'margin-left: 4px' : ''
  }}
  ${(props) => (props.customCSS ? props.customCSS : '')}`

export const StyledImage = styled.img`
    object-fit: contain;
    max-width: 100%;
    max-height: 100%;
    height: calc(90vh - 200px) !important;
    ${(props) => {
    return props.pageOrientation === 'Landscape' && props.isPortrait && props.sides === 'HeadToFoot' ? 'transform: rotateZ(-270deg) scale(1.3); width: 100%; height: 100%; object-fit: contain; transform-origin: center center;'
      : props.pageOrientation === 'Landscape' && props.isPortrait && props.sides === 'HeadToHead' ? 'transform: rotateZ(270deg) scale(1.3); width: 100%; height: 100%; object-fit: contain; transform-origin: center center;'
        : props.pageOrientation === 'Landscape' && props.isPortrait ? 'transform: rotateZ(-90deg) scale(1.3); width: 100%; height: 100%; object-fit: contain; transform-origin: center center;'
          : props.pageOrientation === 'Landscape' && !props.isPortrait && props.sides === 'HeadToFoot' ? 'transform: rotateZ(180deg); width: 100%; height: 100%; object-fit: contain; transform-origin: center center;'
            : ''
  }}
      ${(props) => {
    return props.pageOrientation === 'Portrait' && props.isPortrait && props.sides === 'HeadToFoot' ? 'transform: rotateZ(180deg); width: 100%; height: 100%; object-fit: contain; transform-origin: center center;'
      : props.pageOrientation === 'Portrait' && !props.isPortrait && props.sides === 'HeadToFoot' ? 'transform: rotateZ(270deg) scale(1.3); width: 100%; height: 100%; object-fit: contain; transform-origin: center center;'
        : props.pageOrientation === 'Portrait' && !props.isPortrait ? 'transform: rotateZ(90deg) scale(1.3); width: 100%; height: 100%; object-fit: contain; transform-origin: center center;'
          : ''
  }}
    ${(props) => {
    return props.paperBackground ? 'mix-blend-mode: multiply;' : ''
  }}
    ${(props) => {
    return props.isColorPrint ? 'filter: grayscale(0%);' : 'filter: grayscale(100%);'
  }}
    ${(props) => (props.customCSS ? props.customCSS : '')}`

export const OverlayContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    object-fit: contain;
    position:relative;
    flex-direction:row; 
    ${(props) => {
    return props.width ? `width:${props.width}px;` : ''
  }}
    ${(props) => {
    return props.height ? `height:${props.height}px;` : ''
  }}
    ${(props) => {
    return `transform:scale(${props.scale});`
  }}
${(props) => (props.customCSS ? props.customCSS : '')}`

export const OverlayImage = styled.img`
  object-fit: contain;
  position: absolute;
  z-index: ${(props) => (props.zIndex ? props.zIndex : 1)};
  ${(props) => (props.customCSS ? props.customCSS : '')}
`;

export const DocumentPreviewMainContainer = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
${(props) => (props.customCSS ? props.customCSS : '')}
${(props) => (props.isSstkProduct ? 'padding: 24px 24px 0;' : 'padding: 24px;')}`

export const PreviewContainer = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
   max-width:100%;
   max-height:100%;
   ${(props) => (props.customCSS ? props.customCSS : '')}`