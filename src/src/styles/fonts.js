import { createGlobalStyle } from 'styled-components'
import MotivaLight from '../assets/fonts/motivasans-light-webfont.woff2'
import MotivaMedium from '../assets/fonts/motivasans-medium-webfont.woff2'
import MotivaMediumLight from '../assets/fonts/motivasans-mediumitalic-webfont.woff2'
import MotivaBold from '../assets/fonts/motivasans-bold-webfont.woff2'
import MotivaExtraBold from '../assets/fonts/motivasans-extrabold-webfont.woff2'

export const FontStyles = createGlobalStyle`
@font-face {
    font-family: 'Motiva-Light';
    src:  url(${MotivaLight}) format('woff2');
    font-weight: normal;
    font-style: normal;
}
@font-face {
    font-family: 'Motiva-Medium';
    src:  url(${MotivaMedium}) format('woff2');
    font-weight: normal;
    font-style: normal;
}
@font-face {
    font-family: 'Motiva-Medium-Italic';
    src:  url(${MotivaMediumLight}) format('woff2');
    font-weight: normal;
    font-style: normal;
}
@font-face {
    font-family: 'Motiva-Bold';
    src:  url(${MotivaBold}) format('woff2');
    font-weight: normal;
    font-style: normal;
}
@font-face {
    font-family: 'Motiva-Extra-Bold';
    src:  url(${MotivaExtraBold}) format('woff2');
    font-weight: normal;
    font-style: normal;
}`