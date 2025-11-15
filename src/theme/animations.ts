import { Animated, Easing } from 'react-native';

// Animation durations (in milliseconds)
export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 400,
  bottomSheet: 350,
  toast: 250,
  pageTransition: 250,
};

// Easing functions
export const EASING = {
  easeInOut: Easing.bezier(0.4, 0.0, 0.2, 1),
  easeOut: Easing.bezier(0.0, 0.0, 0.2, 1),
  easeIn: Easing.bezier(0.4, 0.0, 1, 1),
  spring: Easing.elastic(1),
};

// Bottom Sheet Animation
export const slideUpBottomSheet = (
  animatedValue: Animated.Value,
  toValue: number = 0,
  duration: number = ANIMATION_DURATION.bottomSheet
) => {
  return Animated.spring(animatedValue, {
    toValue,
    useNativeDriver: true,
    tension: 65,
    friction: 11,
    velocity: 2,
  });
};

export const slideDownBottomSheet = (
  animatedValue: Animated.Value,
  toValue: number,
  duration: number = ANIMATION_DURATION.bottomSheet
) => {
  return Animated.timing(animatedValue, {
    toValue,
    duration,
    easing: EASING.easeInOut,
    useNativeDriver: true,
  });
};

// Toast Animation
export const slideDownToast = (
  animatedValue: Animated.Value,
  duration: number = ANIMATION_DURATION.toast
) => {
  return Animated.spring(animatedValue, {
    toValue: 0,
    useNativeDriver: true,
    tension: 80,
    friction: 10,
  });
};

export const slideUpToast = (
  animatedValue: Animated.Value,
  toValue: number,
  duration: number = ANIMATION_DURATION.toast
) => {
  return Animated.timing(animatedValue, {
    toValue,
    duration,
    easing: EASING.easeOut,
    useNativeDriver: true,
  });
};

// Fade Animation
export const fadeIn = (
  animatedValue: Animated.Value,
  duration: number = ANIMATION_DURATION.normal
) => {
  return Animated.timing(animatedValue, {
    toValue: 1,
    duration,
    easing: EASING.easeOut,
    useNativeDriver: true,
  });
};

export const fadeOut = (
  animatedValue: Animated.Value,
  duration: number = ANIMATION_DURATION.normal
) => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    easing: EASING.easeIn,
    useNativeDriver: true,
  });
};

// Scale Animation
export const scaleIn = (
  animatedValue: Animated.Value,
  duration: number = ANIMATION_DURATION.fast
) => {
  return Animated.spring(animatedValue, {
    toValue: 1,
    useNativeDriver: true,
    tension: 100,
    friction: 7,
  });
};

export const scaleOut = (
  animatedValue: Animated.Value,
  duration: number = ANIMATION_DURATION.fast
) => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    easing: EASING.easeIn,
    useNativeDriver: true,
  });
};
