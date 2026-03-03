const palette = {
  neutral100: '#FFFFFF',
  neutral200: '#F4F2F1',
  neutral300: '#D7CEC9',
  neutral400: '#B6ACA6',
  neutral500: '#978F8A',
  neutral600: '#564E4A',
  neutral700: '#3C3836',
  neutral800: '#191015',
  neutral900: '#000000',

  primary100: '#F4E0D9',
  primary200: '#E8C1B4',
  primary300: '#DDA28E',
  primary400: '#D28468',
  primary500: '#C76542',
  primary600: '#A54F31',

  secondary100: '#DCDDE9',
  secondary200: '#BCC0D6',
  secondary300: '#9196B9',
  secondary400: '#626894',
  secondary500: '#41476E',

  accent100: '#FFEED4',
  accent200: '#FFE1B2',
  accent300: '#FDD495',
  accent400: '#FBC878',
  accent500: '#FFBB50',

  angry100: '#F2D6CD',
  angry500: '#C03403',
  dullGreen: '#8ca765',

  overlay20: 'rgba(25, 16, 21, 0.2)',
  overlay50: 'rgba(25, 16, 21, 0.5)',

  carrot: 'rgb(216, 93, 90)',

  danger: '#ea5455',
  success: '#28C76F',
  primary: '#f99b40',
  warning: '#FFFF00',
  secondary: '#45556f',
  actionColor: '#6b9879',
  lightPrimary: ' #fefbf4',
  lightSecondary: '#d0d8e5',

  //Appointment Status
  active: '#9faac9',
  activeText: '#32394c',

  lateCancelled1: '#966c32',
  lateCancelledText1: '#452b08',

  lateShow: '#d89765',
  lateShowText: '#96501b',

  complete: '#a8b581',
  completeText: '#576436',

  noShow: ' #ad6966',

  lateCancelled: '#dc8885',
  lateCancelledText: '#7d3d25',

  color1: '#dc8887',
  color6: ' #743332',

  color2: '#9faac9',
  color7: '#32394c',
} as const;

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: 'rgba(0, 0, 0, 0)',
  /**
   * The default text color in many components.
   */
  text: palette.neutral800,
  /**
   * Secondary text information.
   */
  textDim: palette.neutral600,
  /**
   * The default color of the screen background.
   */
  background: 'rgb(253,251,245)', //palette.neutral200,
  /**
   * The default border color.
   */
  border: palette.neutral900,
  /**
   * The main tinting color.
   */
  tint: palette.primary500,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   * Error messages.
   */
  error: palette.angry500,
  /**
   * Error Background.
   *
   */
  errorBackground: palette.angry100,
  /**
   * Grey.
   *
   */
  grey: palette.secondary300,
  green: 'rgb(170,180,135)',
  lightGreen: '#85c556',
  darkGreen: '#304D05',
  brown: 'rgb(107,55,52)',
  lightGrey: 'rgb(169,169,172)',
  lightGrey2: 'rgb(209,216,228)',
  icon: 'rgb(72,84,109)',
  pink: '#f0e7fa',
  red: '#F32929',
  dullGreen: palette.dullGreen,
  black: palette.neutral900,
  white: palette.neutral100,
  smoke: 'rgb(249,249,249)',
  primary: palette.secondary400,
  active: palette.active,
  activeText: palette.activeText,
  lateCancelled: palette.lateCancelled,
  lateCancelledText: palette.lateCancelledText,
  lateShow: palette.lateShow,
  lateShowText: palette.lateShowText,
  complete: palette.complete,
  completeText: palette.completeText,
  noShow: palette.noShow,
  noShowText: palette.noShow,
  carrot: palette.carrot,
  orange: palette.primary,
  whiteVariant: palette.neutral200,
};
