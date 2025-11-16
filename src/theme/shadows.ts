import { Platform, ViewStyle } from 'react-native';
import { colors } from './colors';

/**
 * iOS-specific shadow styles
 * iOS uses shadow properties, Android uses elevation
 */

export const shadows = {
  // Small shadow - for subtle depth
  sm: Platform.OS === 'ios' ? {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  } : {
    elevation: 2,
  },

  // Medium shadow - for cards
  md: Platform.OS === 'ios' ? {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  } : {
    elevation: 4,
  },

  // Large shadow - for floating elements
  lg: Platform.OS === 'ios' ? {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  } : {
    elevation: 8,
  },

  // Extra large shadow - for modals/bottom sheets
  xl: Platform.OS === 'ios' ? {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  } : {
    elevation: 16,
  },

  // Colored shadow - for primary actions (iOS only)
  primary: Platform.OS === 'ios' ? {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  } : {
    elevation: 4,
  },
} as const;

/**
 * iOS-specific touch target size
 * iOS HIG recommends 44pt minimum
 */
export const touchTarget = {
  ios: 44,
  android: 48,
  minimum: Platform.OS === 'ios' ? 44 : 48,
} as const;

/**
 * iOS-specific corner radius for different components
 */
export const iosRadius = {
  button: 12,
  card: 16,
  modal: 28,
  sheet: 28,
  input: 10,
} as const;
