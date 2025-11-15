import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { NourishrIcon } from '../Icon';
import { colors, typography, spacing } from '../../../theme';

export type BadgeType = 'cook' | 'order' | 'time';

interface BadgeProps {
  type: BadgeType;
  text: string;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ type, text, style }) => {
  const getBadgeConfig = () => {
    switch (type) {
      case 'cook':
        return {
          icon: 'Home' as const,
          backgroundColor: colors.primary,
        };
      case 'order':
        return {
          icon: 'Bag' as const,
          backgroundColor: '#10B981',
        };
      case 'time':
        return {
          icon: 'Clock' as const,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <View style={[styles.badge, { backgroundColor: config.backgroundColor }, style]}>
      <NourishrIcon name={config.icon} size={12} color={colors.white} />
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.5,
  },
});
