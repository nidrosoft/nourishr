import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, typography, radius, spacing } from '../theme';
import { Meal } from '../types';
import { NourishrIcon } from './NourishrIcon';

interface MealCardProps {
  meal: Meal;
  onPress: () => void;
}

export const MealCard: React.FC<MealCardProps> = ({ meal, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        {meal.image ? (
          <Image source={{ uri: meal.image }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <NourishrIcon name="Gallery" size={32} color={colors.gray40} />
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {meal.title}
        </Text>
        
        <View style={styles.meta}>
          {meal.type === 'recipe' && meal.prepTime && (
            <View style={styles.metaItem}>
              <NourishrIcon name="Clock" size={14} color={colors.gray60} />
              <Text style={styles.metaText}>{meal.prepTime} min</Text>
            </View>
          )}
          
          {meal.type === 'delivery' && meal.deliveryETA && (
            <View style={styles.metaItem}>
              <NourishrIcon name="Timer1" size={14} color={colors.gray60} />
              <Text style={styles.metaText}>{meal.deliveryETA} min</Text>
            </View>
          )}
          
          {meal.calories && (
            <View style={styles.metaItem}>
              <NourishrIcon name="Activity" size={14} color={colors.gray60} />
              <Text style={styles.metaText}>{meal.calories} cal</Text>
            </View>
          )}
        </View>
        
        <View style={styles.footer}>
          <View
            style={[
              styles.badge,
              meal.type === 'recipe' ? styles.badgeCook : styles.badgeOrder,
            ]}
          >
            <NourishrIcon
              name={meal.type === 'recipe' ? 'Home' : 'Bag'}
              size={12}
              color={colors.white}
            />
            <Text style={styles.badgeText}>
              {meal.type === 'recipe' ? 'Cook' : 'Order'}
            </Text>
          </View>
          
          {meal.type === 'delivery' && meal.restaurant && (
            <Text style={styles.restaurant} numberOfLines={1}>
              {meal.restaurant}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 160,
    backgroundColor: colors.gray20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray20,
  },
  content: {
    padding: spacing.md,
  },
  title: {
    ...typography.headingS,
    color: colors.black,
    marginBottom: spacing.sm,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  metaText: {
    ...typography.caption,
    color: colors.gray60,
    marginLeft: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  badgeCook: {
    backgroundColor: colors.darkBlue,
  },
  badgeOrder: {
    backgroundColor: colors.primary,
  },
  badgeText: {
    ...typography.captionMedium,
    color: colors.white,
    marginLeft: spacing.xs,
  },
  restaurant: {
    ...typography.caption,
    color: colors.gray60,
    flex: 1,
    marginLeft: spacing.sm,
  },
});
