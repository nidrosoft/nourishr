import { 
  withSpring, 
  withTiming, 
  Easing,
  SharedValue,
  WithSpringConfig,
  WithTimingConfig,
} from 'react-native-reanimated';

// Animation durations (in milliseconds)
export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 400,
  bottomSheet: 350,
  toast: 250,
  pageTransition: 250,
};

// Easing functions (Reanimated compatible)
export const EASING_FUNCTIONS = {
  easeInOut: Easing.bezier(0.4, 0.0, 0.2, 1),
  easeOut: Easing.bezier(0.0, 0.0, 0.2, 1),
  easeIn: Easing.bezier(0.4, 0.0, 1, 1),
  linear: Easing.linear,
};

// Spring configurations
export const SPRING_CONFIGS = {
  default: {
    damping: 11,
    stiffness: 65,
    mass: 1,
  } as WithSpringConfig,
  bouncy: {
    damping: 10,
    stiffness: 80,
    mass: 1,
  } as WithSpringConfig,
  gentle: {
    damping: 15,
    stiffness: 50,
    mass: 1,
  } as WithSpringConfig,
  stiff: {
    damping: 7,
    stiffness: 100,
    mass: 1,
  } as WithSpringConfig,
};

// Bottom Sheet Animations (Reanimated 3)
export const slideUpBottomSheet = (
  animatedValue: SharedValue<number>,
  toValue: number = 0
) => {
  'worklet';
  animatedValue.value = withSpring(toValue, SPRING_CONFIGS.default);
};

export const slideDownBottomSheet = (
  animatedValue: SharedValue<number>,
  toValue: number,
  duration: number = ANIMATION_DURATION.bottomSheet
) => {
  'worklet';
  animatedValue.value = withTiming(toValue, {
    duration,
    easing: EASING_FUNCTIONS.easeInOut,
  });
};

// Toast Animations (Reanimated 3)
export const slideDownToast = (
  animatedValue: SharedValue<number>,
  toValue: number = 0
) => {
  'worklet';
  animatedValue.value = withSpring(toValue, SPRING_CONFIGS.bouncy);
};

export const slideUpToast = (
  animatedValue: SharedValue<number>,
  toValue: number,
  duration: number = ANIMATION_DURATION.toast
) => {
  'worklet';
  animatedValue.value = withTiming(toValue, {
    duration,
    easing: EASING_FUNCTIONS.easeOut,
  });
};

// Fade Animations (Reanimated 3)
export const fadeIn = (
  animatedValue: SharedValue<number>,
  duration: number = ANIMATION_DURATION.normal
) => {
  'worklet';
  animatedValue.value = withTiming(1, {
    duration,
    easing: EASING_FUNCTIONS.easeOut,
  });
};

export const fadeOut = (
  animatedValue: SharedValue<number>,
  duration: number = ANIMATION_DURATION.normal
) => {
  'worklet';
  animatedValue.value = withTiming(0, {
    duration,
    easing: EASING_FUNCTIONS.easeIn,
  });
};

// Scale Animations (Reanimated 3)
export const scaleIn = (
  animatedValue: SharedValue<number>
) => {
  'worklet';
  animatedValue.value = withSpring(1, SPRING_CONFIGS.stiff);
};

export const scaleOut = (
  animatedValue: SharedValue<number>,
  duration: number = ANIMATION_DURATION.fast
) => {
  'worklet';
  animatedValue.value = withTiming(0, {
    duration,
    easing: EASING_FUNCTIONS.easeIn,
  });
};
