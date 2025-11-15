import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius } from '../../../../theme';
import { NourishrIcon } from '../../../../components';

interface ToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, visible, onHide }) => {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      // Slide down
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();

      // Auto hide after 2 seconds
      const timer = setTimeout(() => {
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onHide();
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

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
      <View style={styles.content}>
        <NourishrIcon name="TickCircle" size={20} color="#4CAF50" />
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
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E8F5E9',
  },
  message: {
    ...typography.body,
    color: colors.black,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
});
