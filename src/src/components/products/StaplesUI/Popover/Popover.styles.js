import styled from 'styled-components'
import ReactPopover from 'react-tooltip'
import { typography } from '../styles/fonts'

export const ReactPopoverStyled = styled(ReactPopover)`
  box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.3);
  cursor: default;
  font-family: ${typography.type.motiva};
  font-size: ${typography.size.lg}!important;
  max-width: ${(props) => `${props.maxWidth}px` || ''};
  min-width: ${(props) => `${props.minWidth}px` || ''};
  padding: 8px !important;
  pointer-events: auto !important;
  text-align: left;
  opacity: 0 !important;
  &.place-top {
    :after {
      filter: drop-shadow(0px 2px 1px rgba(0, 0, 0, 0.2));
    }
  }
  &.place-bottom {
    :after {
      filter: drop-shadow(0px -2px 1px rgba(0, 0, 0, 0.2));
    }
  }
  &.place-left {
    :after {
      filter: drop-shadow(2px 0px 1px rgba(0, 0, 0, 0.2));
    }
  }
  &.place-right {
    :after {
      filter: drop-shadow(-2px 0px 1px rgba(0, 0, 0, 0.2));
    }
  }
  :before {
    display: ${(props) => (props.showCaret ? 'block' : 'none')};
  }
  :after {
    display: ${(props) => (props.showCaret ? 'block' : 'none')};
  }
  &.__react_component_tooltip.show {
    opacity: 1 !important;
  }
`

export const StyledPopoverWrapper = styled.div`
  ${(props) => (props.customCSS ? props.customCSS : '')};
`
export const StyledTriggerWrapper = styled.span`
  :hover {
    cursor: pointer;
  }
`
