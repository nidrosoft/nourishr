import { TextStyle } from 'react-native';

export const typography: Record<string, TextStyle> = {
  headingXL: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  headingL: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  },
  headingM: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  headingS: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  bodySecondary: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  captionMedium: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
};
