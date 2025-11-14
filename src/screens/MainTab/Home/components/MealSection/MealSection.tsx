import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, radius } from '../../../../../theme';
import { Badge } from '../../../../../components';

interface Meal {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  type: string;
  time: string;
  rating: number;
  price: number;
}

interface MealSectionProps {
  title: string;
  meals: Meal[];
  onMealPress: (mealId: number) => void;
  onViewAllPress: () => void;
}

export const MealSection: React.FC<MealSectionProps> = ({
  title,
  meals,
  onMealPress,
  onViewAllPress,
}) => {
  return (
    <View style={styles.section}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity onPress={onViewAllPress}>
          <Text style={styles.seeAllLink}>See All</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Scrollable Meal Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        {meals.map((meal) => (
          <TouchableOpacity
            key={meal.id}
            style={styles.mealCard}
            activeOpacity={0.9}
            onPress={() => onMealPress(meal.id)}
          >
            {/* Full Background Image */}
            <Image
              source={{ uri: meal.image }}
              style={styles.mealImage}
              resizeMode="cover"
            />

            {/* Dark Gradient Overlay */}
            <LinearGradient
              colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.75)']}
              style={styles.mealCardOverlay}
            />

            {/* Badges at Top */}
            <View style={styles.mealBadgeContainer}>
              <Badge type={meal.type.toLowerCase() as 'cook' | 'order'} text={meal.type} />
              <Badge type="time" text={meal.time} />
            </View>

            {/* Content at Bottom */}
            <View style={styles.mealCardContent}>
              <Text style={styles.mealCardTitle} numberOfLines={1}>
                {meal.title}
              </Text>
              <Text style={styles.mealCardSubtitle} numberOfLines={1}>
                {meal.subtitle}
              </Text>
              <View style={styles.mealCardFooter}>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingEmoji}>⭐</Text>
                  <Text style={styles.ratingText}>{meal.rating}</Text>
                </View>
                <Text style={styles.mealCardPrice}>${meal.price}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray80,
  },
  seeAllLink: {
    ...typography.body,
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  horizontalScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  mealCard: {
    width: 240,
    height: 320,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.gray20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mealImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  mealCardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
  mealBadgeContainer: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mealCardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
  },
  mealCardTitle: {
    ...typography.bodyLarge,
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
  },
  mealCardSubtitle: {
    ...typography.caption,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: spacing.sm,
  },
  mealCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingEmoji: {
    fontSize: 16,
  },
  ratingText: {
    ...typography.caption,
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
    marginLeft: 4,
  },
  mealCardPrice: {
    ...typography.bodyMedium,
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
});
