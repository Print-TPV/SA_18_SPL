import styled from 'styled-components'
import ReactTooltip from 'react-tooltip'
// import { typography } from '../../styles/fonts'
import { typography } from '../styles/fonts'

export const ReactTooltipStyled = styled(ReactTooltip)`
  box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.3);
  font-family: ${(effect) =>
    effect === 'float' ? typography.type.motiva_light : typography.type.motiva};
  font-size: ${(props) =>
    props.behavior === 'float'
      ? typography.size.sm
      : typography.size.lg}!important;
  max-width: ${(props) => `${props.maxWidth}px` || ''};
  padding: ${(props) =>
    props.behavior === 'float' ? '1px 6px' : '8px'}!important;
  pointer-events: auto !important;
  text-align: left;
  opacity: 0 !important;
  overflow-wrap: break-word;
  &.place-top {
    :after {
      filter: none !important;
    }
  }
  &.place-bottom {
    :after {
      filter: none !important;
    }
  }
  &.place-left {
    :after {
      filter: none !important;
    }
  }
  &.place-right {
    :after {
      filter: none !important;
    }
  }
  :before {
    display: ${(props) => (props.behavior === 'solid' ? 'block' : 'none')};
    background-color: transparent !important;
  }
  :after {
    display: ${(props) => (props.behavior === 'solid' ? 'block' : 'none')};
  }
  &.__react_component_tooltip.show {
    opacity: 1 !important;
  }
  ${props => props.customCSS ? props.customCSS : ''};
`

export const StyledTooltipWrapper = styled.div`
  ${(props) => (props.customCSS ? props.customCSS : '')};
`
export const StyledTriggerWrapper = styled.span`
:hover{
  cursor: pointer;
}
`