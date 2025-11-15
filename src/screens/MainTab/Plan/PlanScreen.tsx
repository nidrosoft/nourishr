import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, radius } from '../../../theme';
import { NourishrIcon } from '../../../components';
import { SuggestedMealsSection } from './components/SuggestedMealsSection';
import { PantryCard } from './components/PantryCard';
import { WeeklyPlanCard } from './components/WeeklyPlanCard';
import { FavoritesCard } from './components/FavoritesCard';
import { ErrorBanner } from './components/ErrorBanner';
import { PlanSettingsScreen } from './PlanSettingsScreen';
import { PantryScreen } from './PantryScreen';
import { WeeklyPlanScreen } from './WeeklyPlanScreen';
import { FavoritesScreenFull } from './FavoritesScreenFull';
import { AddItemBottomSheet } from './components/AddItemBottomSheet';

// Mock data - Replace with actual API calls
const mockSuggestedMeals = [
  {
    id: '1',
    name: 'Quick Pasta with Garlic',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
    ingredientsInPantry: 6,
    cookTime: 15,
    difficulty: 'Easy' as const,
  },
  {
    id: '2',
    name: 'Veggie Omelette',
    image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400',
    ingredientsInPantry: 4,
    cookTime: 10,
    difficulty: 'Easy' as const,
  },
  {
    id: '3',
    name: 'Chicken Fried Rice',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
    ingredientsInPantry: 7,
    cookTime: 20,
    difficulty: 'Medium' as const,
  },
];

const mockPantryItems = [
  { id: '1', name: 'Eggs', emoji: '🥚' },
  { id: '2', name: 'Tomato sauce', emoji: '🍅' },
  { id: '3', name: 'Rice', emoji: '🍚' },
  { id: '4', name: 'Oats', emoji: '🌾' },
  { id: '5', name: 'Chicken', emoji: '🍗' },
  { id: '6', name: 'Onions', emoji: '🧅' },
];

const mockWeekPlan = [
  { day: 'Monday', dayShort: 'Mon', meal: 'Spaghetti Carbonara', mealEmoji: '🍝' },
  { day: 'Tuesday', dayShort: 'Tue', meal: 'Chicken Salad', mealEmoji: '🥗' },
  { day: 'Wednesday', dayShort: 'Wed', meal: 'Taco Bowl', mealEmoji: '🌮' },
  { day: 'Thursday', dayShort: 'Thu' },
  { day: 'Friday', dayShort: 'Fri', meal: 'Veggie Stir Fry', mealEmoji: '🥘' },
];

const mockFavorites = [
  {
    id: '1',
    name: 'Margherita Pizza',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    cookTime: 25,
  },
  {
    id: '2',
    name: 'Caesar Salad',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
    cookTime: 15,
  },
  {
    id: '3',
    name: 'Beef Tacos',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
    cookTime: 20,
  },
];

export const PlanScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<'no-internet' | 'ai-failed' | 'pantry-failed' | null>(null);
  const [cookingStreak, setCookingStreak] = useState(3);
  const [showSettings, setShowSettings] = useState(false);
  const [showPantry, setShowPantry] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showWeeklyPlan, setShowWeeklyPlan] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Uncomment to test error states:
      // setError('ai-failed');
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleRefreshMeals = () => {
    console.log('Refreshing meal suggestions...');
  };

  const handleMealPress = (mealId: string) => {
    console.log('Meal pressed:', mealId);
  };

  const handleViewPantry = () => {
    // Use requestAnimationFrame for smoother transition
    requestAnimationFrame(() => {
      setShowPantry(true);
    });
  };

  const handleAddItem = () => {
    setShowAddItem(true);
  };

  const handleAddItemComplete = (name: string, emoji: string) => {
    console.log('Item added:', name, emoji);
    // TODO: Add item to pantry state
    setShowAddItem(false);
  };

  const handleScanItem = () => {
    console.log('Scan item - Open scan bottom sheet for pantry');
    // TODO: Open ScanBottomSheet with pantry mode
    // This should open the scan flow and add items to pantry
  };

  const handleViewFullWeek = () => {
    requestAnimationFrame(() => {
      setShowWeeklyPlan(true);
    });
  };

  const handleAddMeal = (day: string) => {
    console.log('Add meal for:', day);
  };

  const handleViewAllFavorites = () => {
    requestAnimationFrame(() => {
      setShowFavorites(true);
    });
  };

  const handleRecipePress = (recipeId: string) => {
    console.log('Recipe pressed:', recipeId);
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleDismissError = () => {
    setError(null);
  };

  return (
    <View style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#FF9500', '#FD6A2F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + spacing.md }]}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Plan</Text>
            <Text style={styles.headerSubtitle}>Based on your pantry, here are today's ideas</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.streakBadge}>
              <NourishrIcon name="Flash" size={16} color="#FF9500" />
              <Text style={styles.streakText}>{cookingStreak} days</Text>
            </View>
            <TouchableOpacity style={styles.settingsButton} onPress={() => setShowSettings(true)}>
              <NourishrIcon name="Setting2" size={24} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Error Banner */}
        {error && (
          <ErrorBanner
            type={error}
            onRetry={error !== 'no-internet' ? handleRetry : undefined}
            onDismiss={handleDismissError}
          />
        )}

        {/* Suggested Meals - Only show if pantry has items and no AI error */}
        {mockPantryItems.length > 0 && error !== 'ai-failed' && (
          <SuggestedMealsSection
            meals={mockSuggestedMeals}
            onRefresh={handleRefreshMeals}
            onMealPress={handleMealPress}
          />
        )}

        {/* My Pantry */}
        {error !== 'pantry-failed' && (
          <PantryCard
            items={mockPantryItems}
            totalCount={12}
            expiringCount={2}
            onViewAll={handleViewPantry}
            onAddItem={handleAddItem}
            onScanItem={handleScanItem}
          />
        )}

        {/* Weekly Plan */}
        <WeeklyPlanCard
          weekPlan={mockWeekPlan}
          onViewFullWeek={handleViewFullWeek}
          onAddMeal={handleAddMeal}
        />

        {/* Favorites */}
        <FavoritesCard
          favorites={mockFavorites}
          onViewAll={handleViewAllFavorites}
          onRecipePress={handleRecipePress}
        />
      </ScrollView>

      {/* Settings Modal */}
      {showSettings && (
        <PlanSettingsScreen onClose={() => setShowSettings(false)} />
      )}

      {/* Pantry Screen */}
      {showPantry && (
        <PantryScreen onClose={() => setShowPantry(false)} />
      )}

      {/* Weekly Plan Screen */}
      {showWeeklyPlan && (
        <WeeklyPlanScreen onClose={() => setShowWeeklyPlan(false)} />
      )}

      {/* Favorites Screen */}
      {showFavorites && (
        <FavoritesScreenFull onClose={() => setShowFavorites(false)} />
      )}

      {/* Add Item Bottom Sheet */}
      <AddItemBottomSheet
        visible={showAddItem}
        onClose={() => setShowAddItem(false)}
        onAdd={handleAddItemComplete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    ...typography.headingL,
    color: colors.white,
    fontSize: 32,
    fontWeight: '700',
    marginBottom: spacing.xs / 2,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.white,
    fontSize: 14,
    opacity: 0.9,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs / 2,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: radius.full,
  },
  streakText: {
    ...typography.caption,
    color: '#FF9500',
    fontSize: 12,
    fontWeight: '700',
  },
  settingsButton: {
    padding: spacing.xs / 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.lg,
  },
});
