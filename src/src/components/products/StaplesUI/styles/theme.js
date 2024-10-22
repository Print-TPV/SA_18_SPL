import { colors, textColorByBackground } from './colors'

export const themes = {
  default: {
    id: 'def1',
    name: 'default',
    components: {
      color: colors.staples_red,
      colorName: 'staples_red',
      button: {
        background: {
          primary: colors.staples_red,
          secondary: colors.white,
          text: colors.transparent,
          reward: colors.rewards,
          outlined: colors.white,
          premium: colors.premium,
        },
        hover: {
          primary: colors.negative,
          secondary: colors.white,
          text: colors.light_gray_2,
          reward: colors.light_rewards,
          premium: colors.premium_1,
        },
        textColor: {
          primary: textColorByBackground['staples_red'],
          secondary: textColorByBackground['white'],
          text: textColorByBackground['transparent'],
          reward: textColorByBackground['rewards'],
          outlined: textColorByBackground['white'],
          premium: textColorByBackground['black'],
        },
      },
      icon: {
        brandcolor: colors.staples_red,
        brandcolorname: 'staples_red',
      },
      spinner: {
        brandcolor: colors.staples_red,
      },
      timer: {
        color: colors.staples_red,
      },
      drawer: {
        color: colors.staples_red,
        text: textColorByBackground['staples_red'],
      },
      link: {
        color: textColorByBackground['staples_red'],
      },
    },
  },
  HIT: {
    id: 'hit2',
    name: 'hitouch',
    components: {
      color: colors.hitouch_orange,
      colorName: 'hitouch_orange',
      button: {
        background: {
          primary: colors.hitouch_orange,
          secondary: colors.white,
          text: colors.transparent,
          reward: colors.rewards,
        },
        hover: {
          primary: colors.medium_orange_2,
          secondary: colors.white,
          text: colors.light_gray_1,
          reward: colors.light_rewards,
        },
        textColor: {
          primary: textColorByBackground['hitouch_orange'],
          secondary: textColorByBackground['white'],
          text: textColorByBackground['transparent'],
          reward: textColorByBackground['rewards'],
        },
      },
      icon: {
        brandcolor: colors.hitouch_orange,
        brandcolorname: 'hitouch_orange',
      },
      spinner: {
        brandcolor: colors.hitouch_orange,
      },
      timer: {
        color: colors.hitouch_orange,
      },
      drawer: {
        color: colors.hitouch_orange,
        text: textColorByBackground['hitouch_orange'],
      },
      link: {
        color: textColorByBackground['hitouch_orange'],
      },
    },
  },
  SWS: {
    id: 'sws3',
    name: 'Southwest',
    components: {
      color: colors.navy,
      colorName: 'navy',
      button: {
        background: {
          primary: colors.navy,
          secondary: colors.white,
          text: colors.transparent,
          reward: colors.rewards,
        },
        hover: {
          primary: colors.medium_navy_1,
          secondary: colors.white,
          text: colors.light_gray_1,
          reward: colors.light_rewards,
        },
        textColor: {
          primary: textColorByBackground['navy'],
          secondary: textColorByBackground['white'],
          text: textColorByBackground['transparent'],
          reward: textColorByBackground['rewards'],
        },
      },
      icon: {
        brandcolor: colors.navy,
        brandcolorname: 'navy',
      },
      spinner: {
        brandcolor: colors.navy,
      },
      timer: {
        color: colors.navy,
      },
      drawer: {
        color: colors.navy,
        text: textColorByBackground['navy'],
      },
      link: {
        color: textColorByBackground['navy'],
      },
    },
  },
}
