import { getKeyVals } from '../utility/helpers'

// Global style variables
export const colors = {
  white: '#fff',
  black: '#000',
  brand: '#c00',
  secondary_black: '#00000C',
  brand_text: 'white',
  dark_gray_1: '#4d4d4f',
  dark_gray_2: '#757575',
  medium_gray_1: '#969696',
  medium_gray_2: '#bcbcbc',
  light_gray_1: '#ddd',
  light_gray_2: '#f3f3f3',
  light_gray_3: '#ececec',
  link_blue: '#086dd2',
  staples_blue: '#10A0D1',
  light_blue: '#ecf4fd',
  staples_red: '#c00',
  dark_red: '#a30000',
  medium_red_1: '#e35555',
  medium_red_2: '#f59191',
  light_red_1: '#f7baba',
  light_red_2: '#fbebeb',
  magenta: '#832F68',
  medium_magenta_1: '#B17097',
  medium_magenta_2: '#D19DBB',
  light_magenta_1: '#E8C9DD',
  light_magenta_2: '#FBF2F9',
  yellow: '#F09E00',
  medium_yellow_1: '#F5BE2F',
  medium_yellow_2: '#F9D26F',
  light_yellow_1: '#F7E2AC',
  light_yellow_2: '#FBF4DA',
  navy: '#486190',
  medium_navy_1: '#6F8DC8',
  medium_navy_2: '#9AB2E1',
  light_navy_1: '#C1D3F4',
  light_navy_2: '#E9F0FD',
  green: '#5A970D',
  medium_green_1: '#8CBF3C',
  medium_green_2: '#AED76F',
  light_green_1: '#CDE9A1',
  light_green_2: '#EEF8E0',
  teal: '#378274',
  medium_teal_1: '#6FB8AB',
  medium_teal_2: '#9ED6CC',
  light_teal_1: '#C0EBE3',
  light_teal_2: '#E4FAF6',
  earth: '#784E4E',
  medium_earth_1: '#A58080',
  medium_earth_2: '#BDA1A1',
  light_earth_1: '#DFCACA',
  light_earth_2: '#FFF2F2',
  forest: '#478140',
  medium_forest_1: '#65A75C',
  medium_forest_2: '#80C687',
  light_forest_1: '#A9DEAF',
  light_forest_2: '#E0F7E2',
  orange: '#C74D00',
  medium_orange_1: '#F07120',
  medium_orange_2: '#FF9450',
  light_orange_1: '#FFB78A',
  light_orange_2: '#FFECE0',
  purple: '#4B5197',
  medium_purple_1: '#757CD2',
  medium_purple_2: '#A3A9EC',
  light_purple_1: '#D0D3FA',
  light_purple_2: '#F1F2FF',
  pink: '#BB3394',
  medium_pink_1: '#DE7BC2',
  medium_pink_2: '#F9A6E1',
  light_pink_1: '#FFC6EF',
  light_pink_2: '#FFECFA',
  negative: '#DD1700',
  medium_negative: '#F5BAB3',
  light_negative: '#FFEFED',
  warning: '#F47F20',
  medium_warning: '#FED471',
  light_warning: '#FFF6DF',
  info: '#529EEB',
  medium_info: '#A9CFF5',
  light_info: '#EDF6FF',
  positive: '#4CBF2F',
  medium_positive: '#A6DF97',
  light_positive: '#EFFBEC',
  hitouch_orange: '#f60',
  dark_rewards: '#c08b28',
  rewards: '#e0b769',
  easy_rewards: '#5B0069',
  light_rewards: '#ffd173',
  easy_rewards_primary_blue: '#0058D8',
  premium: '#2A78C6',
  select: '#0e7477',
  premium_1: '#0056AC',
  ink_gray: '#969697',
  ink_light_black: '#686666',
  ink_light_gray: '#ddd',
  ink_violet: '#ac7ad8',
  ink_cyan: '#00aff3',
  ink_light_cyan: '#7cd8fc',
  ink_magenta: '#ed3596',
  ink_light_magenta: '#ff9dd0',
  ink_yellow: '#ffbe43',
  ink_light_yellow: '#ffdf86',
  ink_red: '#f60015',
  ink_blue: '#086dd2',
  ink_green: '#4cbf2f',
  ink_orange: '#f47f20',
  ink_black: '#000',
  neutral_gray: '#9b9b9b',
  transparent: 'transparent',
  gray_transparent: 'rgba(0, 0, 0, 0.2)',
  light_gray_transparent: 'rgba(0, 0, 0, 0.1)',
  activate: '#5B0069',
}

export const colorNames = Object.keys(colors)

export const colorObjArray = getKeyVals(colors)

export const textColorByBackground = {
  white: 'black',
  black: 'white',
  secondary_black: 'white',
  dark_gray_1: 'white',
  dark_gray_2: 'white',
  medium_gray_1: 'black',
  medium_gray_2: 'black',
  light_gray_1: 'black',
  light_gray_2: 'black',
  light_gray_3: 'black',
  link_blue: 'white',
  gray_gradient: 'black',
  staples_red: 'white',
  staples_blue: 'black',
  dark_red: 'white',
  medium_red_1: 'black',
  medium_red_2: 'white',
  light_red_1: 'black',
  light_red_2: 'black',
  magenta: 'white',
  medium_magenta_1: 'black',
  medium_magenta_2: 'black',
  light_magenta_1: 'black',
  light_magenta_2: 'black',
  yellow: 'black',
  medium_yellow_1: 'black',
  medium_yellow_2: 'black',
  light_yellow_1: 'black',
  light_yellow_2: 'black',
  navy: 'white',
  medium_navy_1: 'black',
  medium_navy_2: 'black',
  light_navy_1: 'black',
  light_navy_2: 'black',
  green: 'black',
  medium_green_1: 'black',
  medium_green_2: 'black',
  light_green_1: 'black',
  light_green_2: 'black',
  teal: 'white',
  medium_teal_1: 'black',
  medium_teal_2: 'black',
  light_teal_1: 'black',
  light_teal_2: 'black',
  earth: 'white',
  medium_earth_1: 'black',
  medium_earth_2: 'black',
  light_earth_1: 'black',
  light_earth_2: 'black',
  forest: 'white',
  medium_forest_1: 'black',
  medium_forest_2: 'black',
  light_forest_1: 'black',
  light_forest_2: 'black',
  orange: 'white',
  medium_orange_1: 'black',
  medium_orange_2: 'black',
  light_orange_1: 'black',
  light_orange_2: 'black',
  purple: 'white',
  medium_purple_1: 'black',
  medium_purple_2: 'black',
  light_purple_1: 'black',
  light_purple_2: 'black',
  pink: 'white',
  medium_pink_1: 'black',
  medium_pink_2: 'black',
  light_pink_1: 'black',
  light_pink_2: 'black',
  negative: 'white',
  medium_negative: 'black',
  light_negative: 'black',
  warning: 'black',
  medium_warning: 'black',
  light_warning: 'black',
  info: 'black',
  medium_info: 'black',
  light_info: 'black',
  positive: 'black',
  medium_positive: 'black',
  light_positive: 'black',
  hitouch_orange: 'white',
  dark_rewards: 'black',
  rewards: 'black',
  easy_rewards: 'white',
  light_rewards: 'black',
  premium: 'white',
  select: 'white',
  light_blue: 'black',
  ink_gray: 'black',
  ink_light_black: 'white',
  ink_light_gray: 'black',
  ink_violet: 'black',
  ink_cyan: 'black',
  ink_light_cyan: 'black',
  ink_magenta: 'black',
  ink_light_magenta: 'black',
  ink_yellow: 'black',
  ink_light_yellow: 'black',
  ink_red: 'black',
  ink_blue: 'white',
  ink_green: 'black',
  ink_orange: 'black',
  ink_black: 'white',
  transparent: 'black',
  gray_transparent: 'black',
  light_gray_transparent: 'black',
  activate: ''
}

export function getLabelBGColors(disabled, labelBGColor) {
  if (disabled) {
    return colors.light_gray_2
  }
  if (labelBGColor) {
    return colors[labelBGColor]
  }
  return colors.white
}
