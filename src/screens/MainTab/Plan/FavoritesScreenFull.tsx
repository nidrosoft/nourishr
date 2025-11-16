import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, radius } from '../../../theme';
import { NourishrIcon } from '../../../components';
import { Toast } from '../../../components/organisms/Toast';
import { useToast } from '../../../hooks/useToast';

interface FavoriteMeal {
  id: string;
  name: string;
  image: string;
  ingredients: number;
  cookTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  region: string;
}

interface FavoritesScreenFullProps {
  onClose: () => void;
}

const mockFavorites: FavoriteMeal[] = [
  {
    id: '1',
    name: 'Avocado Toast with Eggs',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400',
    ingredients: 5,
    cookTime: 10,
    difficulty: 'Easy',
    category: 'breakfast',
    calories: 320,
    protein: 15,
    region: 'American',
  },
  {
    id: '2',
    name: 'Chicken Caesar Salad',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
    ingredients: 8,
    cookTime: 15,
    difficulty: 'Easy',
    category: 'lunch',
    calories: 280,
    protein: 32,
    region: 'Italian',
  },
  {
    id: '3',
    name: 'Spaghetti Carbonara',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
    ingredients: 7,
    cookTime: 25,
    difficulty: 'Medium',
    category: 'dinner',
    calories: 520,
    protein: 28,
    region: 'Italian',
  },
  {
    id: '4',
    name: 'Greek Yogurt Bowl',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
    ingredients: 6,
    cookTime: 5,
    difficulty: 'Easy',
    category: 'breakfast',
    calories: 250,
    protein: 18,
    region: 'Greek',
  },
  {
    id: '5',
    name: 'Grilled Salmon',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    ingredients: 6,
    cookTime: 20,
    difficulty: 'Medium',
    category: 'dinner',
    calories: 380,
    protein: 42,
    region: 'Asian',
  },
  {
    id: '6',
    name: 'Veggie Wrap',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400',
    ingredients: 5,
    cookTime: 10,
    difficulty: 'Easy',
    category: 'lunch',
    calories: 220,
    protein: 12,
    region: 'American',
  },
  {
    id: '7',
    name: 'Smoothie Bowl',
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400',
    ingredients: 6,
    cookTime: 5,
    difficulty: 'Easy',
    category: 'breakfast',
    calories: 280,
    protein: 10,
    region: 'Tropical',
  },
  {
    id: '8',
    name: 'Beef Tacos',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400',
    ingredients: 7,
    cookTime: 30,
    difficulty: 'Medium',
    category: 'dinner',
    calories: 450,
    protein: 35,
    region: 'Mexican',
  },
];

type FilterType = 'all' | 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'low-cal' | 'high-protein' | 'quick' | 'region';

export const FavoritesScreenFull: React.FC<FavoritesScreenFullProps> = ({ onClose }) => {
  const insets = useSafeAreaInsets();
  const [favorites, setFavorites] = useState(mockFavorites);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isEmpty, setIsEmpty] = useState(false);
  const translateX = useSharedValue(1000);
  const { toast, showSuccess, showError, hideToast } = useToast();

  useEffect(() => {
    // Simple slide in from right - no fade, no blank screen
    translateX.value = withTiming(0, {
      duration: 300,
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleClose = () => {
    translateX.value = withTiming(1000, {
      duration: 250,
    }, () => {
      runOnJS(onClose)();
    });
  };

  const handleRemoveFavorite = (id: string) => {
    setFavorites(favorites.filter(meal => meal.id !== id));
    showError('Removed from favorites');
  };

  const handleViewRecipe = (id: string) => {
    console.log('View recipe:', id);
  };

  const getFilteredMeals = () => {
    switch (activeFilter) {
      case 'breakfast':
      case 'lunch':
      case 'dinner':
        return favorites.filter(meal => meal.category === activeFilter);
      case 'snacks':
        return favorites.filter(meal => meal.category === 'snack');
      case 'low-cal':
        return favorites.filter(meal => meal.calories < 300);
      case 'high-protein':
        return favorites.filter(meal => meal.protein > 25);
      case 'quick':
        return favorites.filter(meal => meal.cookTime <= 15);
      default:
        return favorites;
    }
  };

  const filteredMeals = getFilteredMeals();

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

  return (
    <View style={styles.modalContainer}>
      <Animated.View
        style={[
          styles.container,
          animatedStyle,
        ]}
      >
        {/* Header */}
        <LinearGradient
          colors={['#FF9500', '#FD6A2F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + spacing.md }]}
        >
          <TouchableOpacity style={styles.backButton} onPress={handleClose}>
            <NourishrIcon name="ArrowLeft" size={24} color={colors.white} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Favorites</Text>
            <Text style={styles.headerSubtitle}>Your go-to meals, all in one place</Text>
          </View>
          <View style={styles.headerSpacer} />
        </LinearGradient>

        {/* Filter Pills */}
        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            <TouchableOpacity
              style={[styles.filterPill, activeFilter === 'all' && styles.filterPillActive]}
              onPress={() => setActiveFilter('all')}
            >
              <Text style={[styles.filterText, activeFilter === 'all' && styles.filterTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterPill, activeFilter === 'breakfast' && styles.filterPillActive]}
              onPress={() => setActiveFilter('breakfast')}
            >
              <Text style={[styles.filterText, activeFilter === 'breakfast' && styles.filterTextActive]}>
                Breakfast
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterPill, activeFilter === 'lunch' && styles.filterPillActive]}
              onPress={() => setActiveFilter('lunch')}
            >
              <Text style={[styles.filterText, activeFilter === 'lunch' && styles.filterTextActive]}>
                Lunch
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterPill, activeFilter === 'dinner' && styles.filterPillActive]}
              onPress={() => setActiveFilter('dinner')}
            >
              <Text style={[styles.filterText, activeFilter === 'dinner' && styles.filterTextActive]}>
                Dinner
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterPill, activeFilter === 'snacks' && styles.filterPillActive]}
              onPress={() => setActiveFilter('snacks')}
            >
              <Text style={[styles.filterText, activeFilter === 'snacks' && styles.filterTextActive]}>
                Snacks
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterPill, activeFilter === 'low-cal' && styles.filterPillActive]}
              onPress={() => setActiveFilter('low-cal')}
            >
              <Text style={[styles.filterText, activeFilter === 'low-cal' && styles.filterTextActive]}>
                Low Calorie
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterPill, activeFilter === 'high-protein' && styles.filterPillActive]}
              onPress={() => setActiveFilter('high-protein')}
            >
              <Text style={[styles.filterText, activeFilter === 'high-protein' && styles.filterTextActive]}>
                High Protein
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterPill, activeFilter === 'quick' && styles.filterPillActive]}
              onPress={() => setActiveFilter('quick')}
            >
              <Text style={[styles.filterText, activeFilter === 'quick' && styles.filterTextActive]}>
                Quick Meals
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + spacing.xl }]}
          showsVerticalScrollIndicator={false}
        >
          {isEmpty ? (
            // Empty State
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>❤️</Text>
              <Text style={styles.emptyTitle}>Save meals you love</Text>
              <Text style={styles.emptySubtitle}>
                They'll show up here for easy access.
              </Text>
              <TouchableOpacity style={styles.exploreButton}>
                <Text style={styles.exploreButtonText}>Explore Meals</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // 2-Column Grid
            <View style={styles.gridContainer}>
              {filteredMeals.map((meal) => (
                <TouchableOpacity
                  key={meal.id}
                  style={styles.mealCard}
                  onPress={() => handleViewRecipe(meal.id)}
                  onLongPress={() => handleRemoveFavorite(meal.id)}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: meal.image }} style={styles.mealImage} resizeMode="cover" />
                  
                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => handleRemoveFavorite(meal.id)}
                  >
                    <NourishrIcon name="Heart" size={18} color={colors.primary} />
                  </TouchableOpacity>

                  <View style={styles.mealInfo}>
                    <Text style={styles.mealName} numberOfLines={2}>
                      {meal.name}
                    </Text>

                    <View style={styles.badges}>
                      <View style={styles.badge}>
                        <NourishrIcon name="ShoppingCart" size={10} color={colors.gray60} />
                        <Text style={styles.badgeText}>{meal.ingredients} ingredients</Text>
                      </View>
                      <View style={styles.badge}>
                        <NourishrIcon name="Clock" size={10} color={colors.gray60} />
                        <Text style={styles.badgeText}>{meal.cookTime} min</Text>
                      </View>
                    </View>

                    <View style={styles.difficultyBadge}>
                      <View style={[styles.difficultyDot, { backgroundColor: getDifficultyColor(meal.difficulty) }]} />
                      <Text style={[styles.difficultyText, { color: getDifficultyColor(meal.difficulty) }]}>
                        {meal.difficulty}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </Animated.View>
      
      {/* Toast Notification */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.white,
    zIndex: 1000,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h2,
    color: colors.white,
    fontSize: 24,
    fontWeight: '700',
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.white,
    fontSize: 13,
    opacity: 0.9,
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },
  filterContainer: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray10,
    height: 52,
  },
  filterScroll: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    gap: spacing.sm,
    alignItems: 'center',
  },
  filterPill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    backgroundColor: colors.gray10,
    borderWidth: 1,
    borderColor: 'transparent',
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterPillActive: {
    backgroundColor: '#FFF4E6',
    borderColor: colors.primary,
  },
  filterText: {
    ...typography.body,
    color: colors.gray70,
    fontSize: 14,
    fontWeight: '500',
  },
  filterTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  mealCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
    marginBottom: spacing.md,
  },
  mealImage: {
    width: '100%',
    height: 120,
    backgroundColor: colors.gray10,
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  mealInfo: {
    padding: spacing.sm,
  },
  mealName: {
    ...typography.h4,
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
    marginBottom: spacing.xs,
    lineHeight: 18,
  },
  badges: {
    gap: 2,
    marginBottom: spacing.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    ...typography.body,
    fontSize: 11,
    color: colors.gray60,
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  difficultyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  difficultyText: {
    ...typography.bodyMedium,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl * 2,
    paddingTop: spacing.xl * 3,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.black,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.gray60,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  exploreButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md + 2,
    borderRadius: radius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  exploreButtonText: {
    ...typography.h4,
    color: colors.white,
    fontSize: 17,
    fontWeight: '600',
  },
});
