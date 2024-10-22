// Handy CSS animations for micro-interactions
import { css, keyframes } from 'styled-components'
import { colors } from './colors'

export const easing = {
  rubber: 'cubic-bezier(0.175, 0.885, 0.335, 1.05)',
  standard: 'ease-in-out'
}

// Keyframes

export const slide = (start, end) => keyframes`
  0% { transform: translateX(${start}); }
  100% { transform: translateX(${end}); }
`

export const rotate360 = keyframes`
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
`

export const glow = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: .4; }
`

export const float = keyframes`
  0% { transform: translateY(1px); }
  25% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
  100% { transform: translateY(1px); }
`

// used for Button
export const ripple = keyframes`
  from { opacity: 0.4; transform: scale(0); }
  to { opacity: 0; transform: scale(10); }
`

export const jiggle = keyframes`
  0%, 100% { transform:translate3d(0,0,0); }
  12.5%, 62.5% { transform:translate3d(-4px,0,0); }
  37.5%, 87.5% {  transform: translate3d(4px,0,0);  }
`

export const shake = keyframes`
  0% { transform:rotate(-3deg) }
  1.68421% { transform:rotate(3deg) }
  2.10526% { transform:rotate(6deg) }
  3.78947% { transform:rotate(-6deg) }
  4.21053% { transform:rotate(-6deg) }
  5.89474% { transform:rotate(6deg) }
  6.31579% { transform:rotate(6deg) }
  8% { transform:rotate(-6deg) }
  8.42105% { transform:rotate(-6deg) }
  10.10526% { transform:rotate(6deg) }
  10.52632% { transform:rotate(6deg) }
  12.21053% { transform:rotate(-6deg) }
  12.63158% { transform:rotate(-6deg) }
  14.31579% { transform:rotate(6deg) }
  15.78947% { transform:rotate(0deg) }
  100% { transform:rotate(0deg) }
`

export const expandToastBar = () => keyframes`
  0% {top: -48px}
  100% {top: 0}
  `

export const collapseToastBar = () => keyframes`
  0% {top: 0}
  100% {top: -48px}
`

export const spin = keyframes`
  0% { transform: rotate(360deg); }
  100% { transform: rotate(0deg); }
`

// Animations 

export const inlineGlow = css`
  animation: ${glow} 1.5s ease-in-out infinite;
  background: ${colors.mediumlight};
  color: transparent;
  cursor: progress;
`

export const fadeIn = keyframes`
  0%   { display: block; opacity: 0;  }
  30% { display: block; opacity: .3; }
  60% { display: block; opacity: .6; }
  80% { display: block; opacity: .8; }
  100% { display: block; opacity: 1; } 
`

