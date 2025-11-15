import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { colors, typography, spacing, radius } from '../../../../theme';
import { NourishrIcon } from '../../../../components';

interface SuggestedMeal {
  id: string;
  name: string;
  image: string;
  ingredientsInPantry: number;
  cookTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface SuggestedMealsSectionProps {
  meals: SuggestedMeal[];
  onRefresh: () => void;
  onMealPress: (mealId: string) => void;
}

export const SuggestedMealsSection: React.FC<SuggestedMealsSectionProps> = ({
  meals,
  onRefresh,
  onMealPress,
}) => {
  if (meals.length === 0) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return '#4CAF50';
      case 'Medium':
        return '#FF9800';
      case 'Hard':
        return '#E63946';
      default:
        return colors.gray60;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Suggested Meals</Text>
          <Text style={styles.subtitle}>Based on your pantry</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <View style={styles.refreshIconContainer}>
            <NourishrIcon name="Refresh" size={18} color={colors.primary} />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {meals.map((meal) => (
          <TouchableOpacity
            key={meal.id}
            style={styles.mealCard}
            onPress={() => onMealPress(meal.id)}
            activeOpacity={0.7}
          >
            <Image source={{ uri: meal.image }} style={styles.mealImage} />
            <View style={styles.mealContent}>
              <Text style={styles.mealName} numberOfLines={2}>
                {meal.name}
              </Text>
              <View style={styles.pantryBadge}>
                <NourishrIcon name="ShoppingCart" size={12} color="#4CAF50" />
                <Text style={styles.pantryText}>
                  Uses {meal.ingredientsInPantry} ingredients you have
                </Text>
              </View>
              <View style={styles.mealMeta}>
                <View style={styles.metaItem}>
                  <NourishrIcon name="Clock" size={14} color="#FF9500" />
                  <Text style={styles.metaTimeText}>{meal.cookTime} min</Text>
                </View>
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(meal.difficulty) + '20' }]}>
                  <Text style={[styles.difficultyText, { color: getDifficultyColor(meal.difficulty) }]}>
                    {meal.difficulty}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.black,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    ...typography.caption,
    color: colors.gray60,
    fontSize: 13,
  },
  refreshButton: {
    padding: 0,
  },
  refreshIconContainer: {
    backgroundColor: colors.white,
    padding: spacing.sm,
    borderRadius: radius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  mealCard: {
    width: 260,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.gray20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
  },
  mealImage: {
    width: '100%',
    height: 140,
    backgroundColor: colors.gray10,
  },
  mealContent: {
    padding: spacing.md,
  },
  mealName: {
    ...typography.h4,
    color: colors.black,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  pantryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs / 2,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: radius.md,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  pantryText: {
    ...typography.caption,
    color: '#2D6A4F',
    fontSize: 11,
    fontWeight: '600',
  },
  mealMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs / 2,
  },
  metaText: {
    ...typography.caption,
    color: colors.gray60,
    fontSize: 12,
  },
  metaTimeText: {
    ...typography.caption,
    color: '#FF9500',
    fontSize: 12,
    fontWeight: '600',
  },
  difficultyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: radius.sm,
  },
  difficultyText: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '600',
  },
});
