import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, radius, spacing } from '../../../theme';

interface CategoryChipProps {
  label: string;
  emoji?: string;
  selected?: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  label,
  emoji,
  selected = false,
  onPress,
  style,
}) => {
  const chipContent = (
    <>
      {emoji && <Text style={styles.emoji}>{emoji}</Text>}
      <Text
        style={[
          styles.text,
          selected ? styles.textSelected : styles.textUnselected,
        ]}
      >
        {label}
      </Text>
    </>
  );

  if (selected) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={style}>
        <LinearGradient
          colors={['#FF9500', '#FD6A2F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.chip, styles.chipSelected]}
        >
          {chipContent}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.chip, styles.chipUnselected, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {chipContent}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.full,
    marginRight: spacing.sm,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chipSelected: {
    // Gradient applied via LinearGradient component
  },
  chipUnselected: {
    backgroundColor: colors.gray20,
    borderWidth: 1,
    borderColor: colors.gray30,
  },
  emoji: {
    fontSize: 16,
  },
  text: {
    ...typography.bodyMedium,
    fontSize: 15,
    fontWeight: '600',
  },
  textSelected: {
    color: colors.white,
  },
  textUnselected: {
    color: colors.gray80,
  },
});
