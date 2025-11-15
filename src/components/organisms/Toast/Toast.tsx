import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NourishrIcon } from '../../atoms/Icon';
import { colors, typography, spacing, radius } from '../../../theme';
import { slideDownToast, slideUpToast } from '../../../theme/animations';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onHide?: () => void;
}

const getToastConfig = (type: ToastType) => {
  switch (type) {
    case 'success':
      return {
        icon: 'TickCircle' as const,
        iconColor: '#10B981', // Green
      };
    case 'error':
      return {
        icon: 'CloseCircle' as const,
        iconColor: '#EF4444', // Red
      };
    case 'warning':
      return {
        icon: 'Warning2' as const,
        iconColor: '#F59E0B', // Orange
      };
    case 'info':
    default:
      return {
        icon: 'InfoCircle' as const,
        iconColor: '#3B82F6', // Blue
      };
  }
};

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onHide,
}) => {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-100)).current;
  const config = getToastConfig(type);

  useEffect(() => {
    if (visible) {
      // Slide down
      slideDownToast(translateY).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        slideUpToast(translateY, -100).start(() => {
          onHide?.();
        });
      }, duration);

      return () => clearTimeout(timer);
    } else {
      // Slide up immediately
      slideUpToast(translateY, -100).start();
    }
  }, [visible, translateY, duration, onHide]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: insets.top + spacing.sm,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.toast}>
        <NourishrIcon name={config.icon} size={24} color={config.iconColor} />
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.black,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  message: {
    ...typography.body,
    color: colors.white,
    marginLeft: spacing.md,
    flex: 1,
  },
});
