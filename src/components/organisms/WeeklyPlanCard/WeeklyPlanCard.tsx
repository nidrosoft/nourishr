import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radius } from '../../../theme';
import { NourishrIcon } from '../../atoms/Icon';

interface WeeklyPlanCardProps {
  onPress: () => void;
}

export const WeeklyPlanCard: React.FC<WeeklyPlanCardProps> = ({ onPress }) => {
  return (
    <View style={styles.weeklyPlanCard}>
      <View style={styles.weeklyPlanHeader}>
        <Text style={styles.weeklyPlanEmoji}>🗓️</Text>
        <View style={styles.weeklyPlanHeaderText}>
          <Text style={styles.weeklyPlanTitle}>Your Personalized Meal Plan</Text>
          <Text style={styles.weeklyPlanSubtitle}>7 days • Balanced nutrition</Text>
        </View>
      </View>
      <View style={styles.weeklyPlanDays}>
        {['Mon', 'Tue', 'Wed', 'Thu'].map((day) => (
          <View key={day} style={styles.dayChip}>
            <Text style={styles.dayChipText}>{day}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.weeklyPlanButton} onPress={onPress}>
        <Text style={styles.weeklyPlanButtonText}>View Full Plan</Text>
        <NourishrIcon name="ArrowRight" size={16} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  weeklyPlanCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  weeklyPlanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  weeklyPlanEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  weeklyPlanHeaderText: {
    flex: 1,
  },
  weeklyPlanTitle: {
    ...typography.bodyMedium,
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 2,
  },
  weeklyPlanSubtitle: {
    ...typography.caption,
    color: colors.gray60,
  },
  weeklyPlanDays: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  dayChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.gray20,
    borderRadius: radius.sm,
  },
  dayChipText: {
    ...typography.caption,
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray80,
  },
  weeklyPlanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.md,
    gap: spacing.xs,
  },
  weeklyPlanButtonText: {
    ...typography.bodyMedium,
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
  },
});
