import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, typography, spacing, radius } from '../../../../theme';
import { NourishrIcon } from '../../../../components';

interface Meal {
  id: string;
  name: string;
  image: string;
  ingredientsInPantry: number;
  cookTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'breakfast' | 'lunch' | 'dinner';
}

interface DayMealCardProps {
  meal: Meal;
  onViewRecipe: () => void;
  onReplace: () => void;
}


const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy':
      return '#4CAF50';
    case 'Medium':
      return '#FF9500';
    case 'Hard':
      return '#E63946';
    default:
      return colors.gray60;
  }
};

export const DayMealCard: React.FC<DayMealCardProps> = ({ meal, onViewRecipe, onReplace }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onViewRecipe} activeOpacity={0.8}>
      <TouchableOpacity style={styles.replaceButton} onPress={onReplace}>
        <NourishrIcon name="Refresh" size={18} color={colors.primary} />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Image source={{ uri: meal.image }} style={styles.image} resizeMode="cover" />
        
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {meal.name}
          </Text>
          
          <View style={styles.pantryBadge}>
            <NourishrIcon name="ShoppingCart" size={12} color="#4CAF50" />
            <Text style={styles.pantryText}>Uses {meal.ingredientsInPantry} of your ingredients</Text>
          </View>

          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <NourishrIcon name="Clock" size={14} color="#FF9500" />
              <Text style={styles.metaTime}>{meal.cookTime} min</Text>
            </View>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(meal.difficulty) + '20' },
              ]}
            >
              <Text style={[styles.difficultyText, { color: getDifficultyColor(meal.difficulty) }]}>
                {meal.difficulty}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.viewButton} onPress={onViewRecipe}>
            <Text style={styles.viewButtonText}>View Recipe</Text>
            <NourishrIcon name="ArrowRight" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    position: 'relative',
  },
  replaceButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    padding: spacing.xs,
    zIndex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: radius.lg,
    backgroundColor: colors.gray10,
  },
  info: {
    flex: 1,
  },
  name: {
    ...typography.h4,
    color: colors.black,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  pantryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs / 2,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  pantryText: {
    ...typography.caption,
    color: '#2E7D32',
    fontSize: 11,
    fontWeight: '600',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs / 2,
  },
  metaTime: {
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
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs / 2,
  },
  viewButtonText: {
    ...typography.bodyMedium,
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
