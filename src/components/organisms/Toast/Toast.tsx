import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NourishrIcon } from '../../atoms/Icon';
import { colors, typography, spacing, radius } from '../../../theme';

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
        containerColor: '#FFFFFF', // White container
      };
    case 'error':
      return {
        icon: 'CloseCircle' as const,
        iconColor: '#EF4444', // Red
        containerColor: '#FFFFFF', // White container
      };
    case 'warning':
      return {
        icon: 'Warning2' as const,
        iconColor: '#F59E0B', // Orange
        containerColor: '#FFFFFF', // White container
      };
    case 'info':
    default:
      return {
        icon: 'InfoCircle' as const,
        iconColor: '#3B82F6', // Blue
        containerColor: '#FFFFFF', // White container
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
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        Animated.timing(translateY, {
          toValue: -100,
          duration: 250,
          useNativeDriver: true,
        }).start(() => {
          onHide?.();
        });
      }, duration);

      return () => clearTimeout(timer);
    } else {
      // Slide up immediately
      Animated.timing(translateY, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }).start();
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
        <View style={[styles.iconContainer, { backgroundColor: config.containerColor }]}>
          <NourishrIcon name={config.icon} size={20} color={config.iconColor} />
        </View>
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
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    ...typography.body,
    color: colors.white,
    marginLeft: spacing.md,
    flex: 1,
    fontWeight: '500',
  },
});
