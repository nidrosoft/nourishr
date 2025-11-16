import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { colors, typography, spacing, radius } from '../../../../theme';
import { NourishrIcon } from '../../../../components';

interface ToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, visible, onHide }) => {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Slide in with spring animation
      translateY.value = withSpring(0, {
        damping: 10,
        stiffness: 80,
      });
      opacity.value = withTiming(1, { duration: 200 });

      // Auto hide after 3 seconds
      translateY.value = withDelay(
        3000,
        withTiming(-100, { duration: 250 }, (finished) => {
          if (finished) {
            runOnJS(onHide)();
          }
        })
      );
      opacity.value = withDelay(3000, withTiming(0, { duration: 200 }));
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: insets.top + spacing.md,
        },
        animatedStyle,
      ]}
    >
      <View style={styles.iconContainer}>
        <NourishrIcon name="TickCircle" size={20} color={colors.white} />
      </View>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: '#4CAF50',
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 9999,
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  message: {
    ...typography.bodyMedium,
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
});
