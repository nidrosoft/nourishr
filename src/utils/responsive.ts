import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Device breakpoints
export const DEVICE_SIZES = {
  SMALL: 375,   // iPhone SE, small Android phones
  MEDIUM: 390,  // iPhone 12/13/14
  LARGE: 428,   // iPhone 14 Pro Max
  TABLET: 768,  // iPad mini
};

// Check device size
export const isSmallDevice = SCREEN_WIDTH < DEVICE_SIZES.SMALL;
export const isMediumDevice = SCREEN_WIDTH >= DEVICE_SIZES.SMALL && SCREEN_WIDTH < DEVICE_SIZES.LARGE;
export const isLargeDevice = SCREEN_WIDTH >= DEVICE_SIZES.LARGE && SCREEN_WIDTH < DEVICE_SIZES.TABLET;
export const isTablet = SCREEN_WIDTH >= DEVICE_SIZES.TABLET;

// Responsive font scaling
const scale = SCREEN_WIDTH / 390; // Base on iPhone 12/13/14

export const normalize = (size: number): number => {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

// Responsive spacing
export const responsiveSpacing = {
  xs: isSmallDevice ? 4 : 6,
  sm: isSmallDevice ? 8 : 12,
  md: isSmallDevice ? 12 : 16,
  lg: isSmallDevice ? 16 : 24,
  xl: isSmallDevice ? 24 : 32,
  xxl: isSmallDevice ? 32 : 48,
};

// Responsive font sizes
export const responsiveFontSize = {
  xs: normalize(10),
  sm: normalize(12),
  base: normalize(14),
  md: normalize(16),
  lg: normalize(18),
  xl: normalize(20),
  xxl: normalize(24),
  xxxl: normalize(32),
};

// Responsive dimensions
export const responsiveDimensions = {
  cardHeight: isSmallDevice ? 180 : 200,
  bannerHeight: isSmallDevice ? 140 : 160,
  iconSize: {
    sm: isSmallDevice ? 16 : 20,
    md: isSmallDevice ? 20 : 24,
    lg: isSmallDevice ? 28 : 32,
    xl: isSmallDevice ? 40 : 48,
  },
  buttonHeight: {
    sm: isSmallDevice ? 36 : 40,
    md: isSmallDevice ? 44 : 48,
    lg: isSmallDevice ? 52 : 56,
  },
};

// Get responsive value based on device size
export const getResponsiveValue = <T,>(values: {
  small?: T;
  medium?: T;
  large?: T;
  tablet?: T;
  default: T;
}): T => {
  if (isTablet && values.tablet) return values.tablet;
  if (isLargeDevice && values.large) return values.large;
  if (isMediumDevice && values.medium) return values.medium;
  if (isSmallDevice && values.small) return values.small;
  return values.default;
};

// Screen dimensions
export const screenDimensions = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
};
