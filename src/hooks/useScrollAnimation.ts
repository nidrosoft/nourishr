import { useRef } from 'react';
import { Animated } from 'react-native';

export const useScrollAnimation = () => {
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  return {
    scrollY,
    headerOpacity,
    handleScroll,
  };
};
