import { Dimensions } from 'react-native';

export const BLACK_COLOR = '#4D4C4C';
export const BG_COLOR = '#11068e';
export const WINDOW_WIDTH = Dimensions.get('window').width;
export const WINDOW_HEIGHT = Dimensions.get('window').height;
export const MSwidth = WINDOW_WIDTH / 375;
export const MSheight = WINDOW_HEIGHT / 667;

export const smallFont = {
  fontSize: 12 * MSwidth,
  lineHeight: 20,
  letterSpacing: 0.16,
  color: 'white',
};
export const mediumFont = {
  fontSize: 14 * MSwidth,
  letterSpacing: 0.16,
  color: 'white',
};
export const largeFont = {
  fontSize: 46 * MSwidth,
  letterSpacing: 0.16,
  color: 'white',
};