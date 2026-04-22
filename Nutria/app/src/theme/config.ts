import type { ViewStyle } from 'react-native';
import { Platform } from 'react-native';

export const colors = {
  bg: '#faf9f5',
  surface: '#fffef9',
  text: '#2b2620',
  textMuted: '#6b6358',
  accent: '#c65d3c',
  accentMuted: '#d4896f',
  sage1: '#eae4d6',
  sage2: '#d8cdb3',
  border: '#e5dfd2',
  warn: '#b8860b',
  danger: '#a8432f',
  success: '#4a7c59',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  /** Logo / hero tiles — matches SVG rx≈32 on 160 box in design HTML */
  brand: 22,
};

/** Soft card lift — design HTML uses subtle rgba shadows */
export const cardShadow: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#2b2620',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
  },
  android: { elevation: 3 },
  default: {},
});
