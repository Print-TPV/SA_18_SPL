import styled, { css } from 'styled-components'
import { colors } from '../styles/colors'
import { spin } from '../styles/animation'
import smLoader from '../../../../assets/images/sm.gif'
import lgLoader from '../../../../assets/images/lg.gif'

export const SpinnerWrapper = styled.div`
  width: ${(props) => (props.size === 'sm' ? '48px' : '80px')};
  height: ${(props) => (props.size === 'sm' ? '48px' : '80px')};
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  border-radius: 100%;
  margin: 0 auto;
  position: relative;
  background-color: ${colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  ${props => props.customCSS ? props.customCSS : ''};
`

export const ThemedSpinner = styled.div`
  width: ${(props) => (props.size === 'sm' ? '24px' : '40px')};
  ${(props) =>
    props.theme.name === 'default' ? `
    height: ${props.size === 'sm' ? '16px' : '28px'};
    background-image: url(${props.size === 'sm' ? smLoader : lgLoader});
    background-repeat: no-repeat;
    background-size: contain;` :
    css`
          animation: ${spin} 1s linear 0s infinite reverse;
          background-color: ${props.color === 'brand' ? props.theme.components.spinner.brandcolor : colors[props.color]};
          height: ${props.size === 'sm' ? '24px' : '40px'};
          border-radius: 50%;
          background: conic-gradient(
            white 30%,
            ${props.color === 'brand' ? props.theme.components.spinner.brandcolor : colors[props.color]}
          );
          position: relative;
          &:after {
            content: '';
            height: 80%;
            width: 80%;
            border-radius: 50%;
            background: white;
            left: 10%;
            top: 10%;
            position: absolute;
          }
          &:before {
            content: '';
            border-radius: 50%;
            background: ${props.color === 'brand' ? props.theme.components.spinner.brandcolor : colors[props.color]};
            height: 10%;
            width: 10%;
            top: 0;
            left: 45%;
            position: absolute;
          }
        `}
`