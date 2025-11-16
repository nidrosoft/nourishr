import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { colors, typography, spacing, radius, shadows, iosRadius } from '../../../../theme';
import { isSmallDevice } from '../../../../utils/responsive';
import { NourishrIcon } from '../../../../components';
import { HapticFeedback } from '../../../../utils/haptics';

interface DayPlan {
  day: string;
  dayShort: string;
  meal?: string;
  mealEmoji?: string;
}

interface WeeklyPlanCardProps {
  weekPlan: DayPlan[];
  onViewFullWeek: () => void;
  onAddMeal: (day: string) => void;
}

export const WeeklyPlanCard: React.FC<WeeklyPlanCardProps> = ({
  weekPlan,
  onViewFullWeek,
  onAddMeal,
}) => {
  const hasAnyMeals = weekPlan.some((day) => day.meal);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>This Week</Text>
        {hasAnyMeals && (
          <TouchableOpacity onPress={() => {
            HapticFeedback.light();
            onViewFullWeek();
          }}>
            <Text style={styles.viewAllText}>View full week →</Text>
          </TouchableOpacity>
        )}
      </View>

      {hasAnyMeals ? (
        <View style={styles.daysContainer}>
          {weekPlan.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dayRow}
              onPress={() => {
                if (!day.meal) {
                  HapticFeedback.light();
                  onAddMeal(day.day);
                }
              }}
              activeOpacity={0.7}
            >
              <View style={styles.dayInfo}>
                <Text style={styles.dayLabel}>{day.dayShort}</Text>
                {day.meal ? (
                  <View style={styles.mealInfo}>
                    <Text style={styles.mealEmoji}>{day.mealEmoji}</Text>
                    <Text style={styles.mealName} numberOfLines={1}>
                      {day.meal}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.emptyMeal}>
                    <NourishrIcon name="Add" size={14} color={colors.gray50} />
                    <Text style={styles.emptyMealText}>Add meal</Text>
                  </View>
                )}
              </View>
              <NourishrIcon name="ArrowRight" size={16} color={colors.gray40} />
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <NourishrIcon name="Calendar" size={48} color={colors.gray40} />
          <Text style={styles.emptyTitle}>No meals planned yet</Text>
          <Text style={styles.emptySubtitle}>
            Plan your meals for the week to stay organized
          </Text>
          <TouchableOpacity style={styles.emptyButton} onPress={onViewFullWeek}>
            <Text style={styles.emptyButtonText}>Start Planning</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: Platform.OS === 'ios' ? iosRadius.card : radius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.black,
    fontSize: isSmallDevice ? 18 : 20,
    fontWeight: '700',
  },
  viewAllText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
    fontSize: isSmallDevice ? 13 : 14,
  },
  daysContainer: {
    gap: spacing.xs,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.gray10,
    borderRadius: radius.md,
  },
  dayInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  dayLabel: {
    ...typography.bodyMedium,
    color: colors.gray70,
    fontWeight: '600',
    fontSize: isSmallDevice ? 13 : 14,
    width: 40,
  },
  mealInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  mealEmoji: {
    fontSize: isSmallDevice ? 16 : 18,
  },
  mealName: {
    ...typography.body,
    color: colors.black,
    fontSize: isSmallDevice ? 14 : 15,
    fontWeight: '500',
    flex: 1,
  },
  emptyMeal: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  emptyMealText: {
    ...typography.body,
    color: colors.gray50,
    fontSize: isSmallDevice ? 13 : 14,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.black,
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: '600',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.gray60,
    fontSize: isSmallDevice ? 13 : 14,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
  },
  emptyButtonText: {
    ...typography.bodyMedium,
    color: colors.white,
    fontWeight: '600',
    fontSize: isSmallDevice ? 14 : 15,
  },
});
