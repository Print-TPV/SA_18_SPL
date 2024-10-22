import styled from 'styled-components'
import { colors } from '../styles/colors'

export const ErrorWrapper = styled.div`
  display: inline-flex;
  width: inherit;
`
export const ErrorText = styled.div`
  font-size: ${(props) => props.size === 'sm' ? '12px' : props.size === 'md' ? '14px' : '16px'};
  font-weight: 300;
  color:  ${props => colors[props.color]};
  margin-left: 6px;
  margin-top: 4px;
  line-height: 16px;
  letter-spacing: 0.43px;
  word-break: break-word;
  ${props => props.customCSS ? props.customCSS : ''}
`