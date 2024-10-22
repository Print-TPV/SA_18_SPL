import styled from 'styled-components'
import { colors } from '../styles/colors'

export const StyledLink = styled.div`
  display: inline-block;
  ${(props) => !props.disabled ? 'cursor: pointer;' : ''}
  letter-spacing: 0;
  margin: 0 6px;
  ${(props) => props.disabled ? `color: ${colors.dark_gray_2};` : ''}
  font-size: ${(props) => (props.size === 'sm' ? '12px' : props.size === 'md' ? '14px' : '16px')};
  line-height: ${(props) => (props.size === 'sm' ? '18px' : props.size === 'md' ? '20px' : '24px')};
  a,
  a:link,
  a:visited,
  a:active {
    color: ${(props) => colors[props.color]};
    text-decoration: ${({ underline }) => underline ? 'underline' : 'none'} !important;

    &:hover {
      color: ${(props) => colors[props.color]};
      text-decoration: ${({ underline }) => underline ? 'none' : 'underline'} !important;
    }
  }
  a:focus {
    outline: 1px dashed ${colors.black};
  }
  a:focus:not(:focus-visible) {
    outline: 1px dashed ${colors.black};
  }
  ${(props) => (props.customCSS ? props.customCSS : '')};
`