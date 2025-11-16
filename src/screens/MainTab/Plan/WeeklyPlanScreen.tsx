import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, radius } from '../../../theme';
import { NourishrIcon } from '../../../components';
import { Toast } from '../../../components/organisms/Toast';
import { useToast } from '../../../hooks/useToast';
import { DayMealCard } from './components/DayMealCard';

interface Meal {
  id: string;
  name: string;
  image: string;
  ingredientsInPantry: number;
  cookTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'breakfast' | 'lunch' | 'dinner';
}

interface DayPlan {
  day: string;
  date: string;
  lastUpdated: string;
  meals: Meal[];
}

interface WeeklyPlanScreenProps {
  onClose: () => void;
}

// Mock data for filled state
const mockWeeklyPlan: DayPlan[] = [
  {
    day: 'Monday',
    date: 'Nov 14',
    lastUpdated: 'Generated today',
    meals: [
      {
        id: 'm1',
        name: 'Avocado Toast with Eggs',
        image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400',
        ingredientsInPantry: 5,
        cookTime: 10,
        difficulty: 'Easy',
        type: 'breakfast',
      },
      {
        id: 'm2',
        name: 'Chicken Caesar Salad',
        image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
        ingredientsInPantry: 6,
        cookTime: 15,
        difficulty: 'Easy',
        type: 'lunch',
      },
      {
        id: 'm3',
        name: 'Spaghetti Carbonara',
        image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
        ingredientsInPantry: 7,
        cookTime: 25,
        difficulty: 'Medium',
        type: 'dinner',
      },
    ],
  },
  {
    day: 'Tuesday',
    date: 'Nov 15',
    lastUpdated: 'Generated today',
    meals: [
      {
        id: 't1',
        name: 'Greek Yogurt Bowl',
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
        ingredientsInPantry: 4,
        cookTime: 5,
        difficulty: 'Easy',
        type: 'breakfast',
      },
      {
        id: 't2',
        name: 'Veggie Wrap',
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400',
        ingredientsInPantry: 5,
        cookTime: 10,
        difficulty: 'Easy',
        type: 'lunch',
      },
      {
        id: 't3',
        name: 'Grilled Salmon',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
        ingredientsInPantry: 6,
        cookTime: 20,
        difficulty: 'Medium',
        type: 'dinner',
      },
    ],
  },
  {
    day: 'Wednesday',
    date: 'Nov 16',
    lastUpdated: 'Generated today',
    meals: [
      {
        id: 'w1',
        name: 'Pancakes with Berries',
        image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400',
        ingredientsInPantry: 6,
        cookTime: 15,
        difficulty: 'Easy',
        type: 'breakfast',
      },
      {
        id: 'w2',
        name: 'Taco Bowl',
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
        ingredientsInPantry: 8,
        cookTime: 20,
        difficulty: 'Medium',
        type: 'lunch',
      },
      {
        id: 'w3',
        name: 'Chicken Stir Fry',
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
        ingredientsInPantry: 7,
        cookTime: 25,
        difficulty: 'Medium',
        type: 'dinner',
      },
    ],
  },
  {
    day: 'Thursday',
    date: 'Nov 17',
    lastUpdated: 'Generated today',
    meals: [
      {
        id: 'th1',
        name: 'Oatmeal with Fruits',
        image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400',
        ingredientsInPantry: 5,
        cookTime: 10,
        difficulty: 'Easy',
        type: 'breakfast',
      },
      {
        id: 'th2',
        name: 'Caprese Sandwich',
        image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400',
        ingredientsInPantry: 4,
        cookTime: 10,
        difficulty: 'Easy',
        type: 'lunch',
      },
      {
        id: 'th3',
        name: 'Beef Tacos',
        image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400',
        ingredientsInPantry: 7,
        cookTime: 30,
        difficulty: 'Medium',
        type: 'dinner',
      },
    ],
  },
  {
    day: 'Friday',
    date: 'Nov 18',
    lastUpdated: 'Generated today',
    meals: [
      {
        id: 'f1',
        name: 'Smoothie Bowl',
        image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400',
        ingredientsInPantry: 6,
        cookTime: 5,
        difficulty: 'Easy',
        type: 'breakfast',
      },
      {
        id: 'f2',
        name: 'Margherita Pizza',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
        ingredientsInPantry: 5,
        cookTime: 25,
        difficulty: 'Medium',
        type: 'lunch',
      },
      {
        id: 'f3',
        name: 'Shrimp Scampi',
        image: 'https://images.unsplash.com/photo-1633504581786-316c8002b1b2?w=400',
        ingredientsInPantry: 6,
        cookTime: 20,
        difficulty: 'Medium',
        type: 'dinner',
      },
    ],
  },
  {
    day: 'Saturday',
    date: 'Nov 19',
    lastUpdated: 'Generated today',
    meals: [
      {
        id: 's1',
        name: 'French Toast',
        image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400',
        ingredientsInPantry: 5,
        cookTime: 15,
        difficulty: 'Easy',
        type: 'breakfast',
      },
      {
        id: 's2',
        name: 'BBQ Chicken Wings',
        image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400',
        ingredientsInPantry: 4,
        cookTime: 35,
        difficulty: 'Medium',
        type: 'lunch',
      },
      {
        id: 's3',
        name: 'Lasagna',
        image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400',
        ingredientsInPantry: 8,
        cookTime: 45,
        difficulty: 'Hard',
        type: 'dinner',
      },
    ],
  },
  {
    day: 'Sunday',
    date: 'Nov 20',
    lastUpdated: 'Generated today',
    meals: [
      {
        id: 'su1',
        name: 'Eggs Benedict',
        image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400',
        ingredientsInPantry: 6,
        cookTime: 20,
        difficulty: 'Medium',
        type: 'breakfast',
      },
      {
        id: 'su2',
        name: 'Greek Salad',
        image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
        ingredientsInPantry: 7,
        cookTime: 10,
        difficulty: 'Easy',
        type: 'lunch',
      },
      {
        id: 'su3',
        name: 'Roast Chicken',
        image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400',
        ingredientsInPantry: 5,
        cookTime: 60,
        difficulty: 'Hard',
        type: 'dinner',
      },
    ],
  },
];

type ViewMode = 'list' | 'grid' | 'week' | 'month';

export const WeeklyPlanScreen: React.FC<WeeklyPlanScreenProps> = ({ onClose }) => {
  const insets = useSafeAreaInsets();
  const [weekPlan, setWeekPlan] = useState(mockWeeklyPlan);
  const [isEmpty, setIsEmpty] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
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

  const handleRefresh = () => {
    console.log('Refresh weekly plan');
    showSuccess('Plan refreshed!');
  };

  const handleSettings = () => {
    console.log('Open weekly plan settings');
  };

  const handleViewRecipe = (mealId: string) => {
    console.log('View recipe:', mealId);
  };

  const handleReplaceMeal = (mealId: string) => {
    console.log('Replace meal:', mealId);
    showSuccess('Meal replaced successfully!');
  };

  const handleGeneratePlan = () => {
    console.log('Generate weekly plan');
    setIsEmpty(false);
    showSuccess('Weekly plan generated!');
  };

  if (isEmpty) {
    return (
      <View style={styles.modalContainer}>
        <Animated.View
          style={[
            styles.container,
            animatedStyle,
          ]}
        >
          <LinearGradient
            colors={['#FF9500', '#FD6A2F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.header, { paddingTop: insets.top + spacing.md }]}
          >
            <TouchableOpacity style={styles.backButton} onPress={handleClose}>
              <NourishrIcon name="ArrowLeft" size={24} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>This Week</Text>
            <View style={styles.headerSpacer} />
          </LinearGradient>

          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🍽️</Text>
            <Text style={styles.emptyTitle}>Let's get your week sorted</Text>
            <Text style={styles.emptySubtitle}>
              Generate a meal plan based on what you have.
            </Text>
            <TouchableOpacity style={styles.generateButton} onPress={handleGeneratePlan}>
              <Text style={styles.generateButtonText}>Generate Weekly Plan</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.modalContainer}>
      <Animated.View
        style={[
          styles.container,
          animatedStyle,
        ]}
      >
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
            <Text style={styles.headerTitle}>This Week</Text>
            <Text style={styles.headerSubtitle}>Based on your pantry & preferences</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton} onPress={handleRefresh}>
              <NourishrIcon name="Refresh" size={22} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleSettings}>
              <NourishrIcon name="Setting2" size={22} color={colors.white} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* View Mode Switcher */}
        <View style={styles.viewSwitcher}>
          <TouchableOpacity
            style={[styles.viewButton, viewMode === 'list' && styles.viewButtonActive]}
            onPress={() => setViewMode('list')}
          >
            <NourishrIcon name="Menu" size={18} color={viewMode === 'list' ? colors.primary : colors.gray60} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewButton, viewMode === 'grid' && styles.viewButtonActive]}
            onPress={() => setViewMode('grid')}
          >
            <NourishrIcon name="Category" size={18} color={viewMode === 'grid' ? colors.primary : colors.gray60} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewButton, viewMode === 'week' && styles.viewButtonActive]}
            onPress={() => setViewMode('week')}
          >
            <NourishrIcon name="Calendar" size={18} color={viewMode === 'week' ? colors.primary : colors.gray60} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewButton, viewMode === 'month' && styles.viewButtonActive]}
            onPress={() => setViewMode('month')}
          >
            <NourishrIcon name="CalendarEdit" size={18} color={viewMode === 'month' ? colors.primary : colors.gray60} />
          </TouchableOpacity>
        </View>

        {/* Content based on view mode */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + spacing.xl }]}
          showsVerticalScrollIndicator={false}
        >
          {viewMode === 'list' && weekPlan.map((dayPlan, index) => (
            <View key={dayPlan.day} style={styles.daySection}>
              <View style={styles.dayHeader}>
                <View>
                  <Text style={styles.dayName}>{dayPlan.day}</Text>
                  <Text style={styles.dayDate}>{dayPlan.date}</Text>
                </View>
                <Text style={styles.lastUpdated}>{dayPlan.lastUpdated}</Text>
              </View>

              <View style={styles.mealsContainer}>
                {dayPlan.meals.map((meal) => (
                  <DayMealCard
                    key={meal.id}
                    meal={meal}
                    onViewRecipe={() => handleViewRecipe(meal.id)}
                    onReplace={() => handleReplaceMeal(meal.id)}
                  />
                ))}
              </View>
            </View>
          ))}

          {/* Grid View */}
          {viewMode === 'grid' && (
            <View style={styles.gridContainer}>
              {weekPlan.flatMap(day => day.meals).map((meal) => (
                <TouchableOpacity key={meal.id} style={styles.gridCard} onPress={() => handleViewRecipe(meal.id)}>
                  <Image source={{ uri: meal.image }} style={styles.gridImage} resizeMode="cover" />
                  <Text style={styles.gridTitle} numberOfLines={2}>{meal.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Week View */}
          {viewMode === 'week' && (
            <View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weekDaysScroll}>
                {weekPlan.map((day, index) => (
                  <TouchableOpacity
                    key={day.day}
                    style={[styles.weekDayTab, selectedDay === day.day && styles.weekDayTabActive]}
                    onPress={() => setSelectedDay(selectedDay === day.day ? null : day.day)}
                  >
                    <Text style={[styles.weekDayName, selectedDay === day.day && styles.weekDayNameActive]}>
                      {day.day.substring(0, 3)}
                    </Text>
                    <Text style={[styles.weekDayDate, selectedDay === day.day && styles.weekDayDateActive]}>
                      {day.date}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {selectedDay && weekPlan.find(d => d.day === selectedDay)?.meals.map((meal) => (
                <View key={meal.id} style={styles.weekMealCard}>
                  <DayMealCard
                    meal={meal}
                    onViewRecipe={() => handleViewRecipe(meal.id)}
                    onReplace={() => handleReplaceMeal(meal.id)}
                  />
                </View>
              ))}

              {!selectedDay && (
                <View style={styles.weekEmptyState}>
                  <Text style={styles.weekEmptyText}>👆 Tap a day to view meals</Text>
                </View>
              )}
            </View>
          )}

          {/* Month View */}
          {viewMode === 'month' && (
            <View style={styles.monthContainer}>
              <Text style={styles.monthTitle}>November 2024</Text>
              <View style={styles.monthGrid}>
                {weekPlan.map((day, index) => (
                  <TouchableOpacity
                    key={day.day}
                    style={styles.monthDay}
                    onPress={() => setSelectedDay(selectedDay === day.day ? null : day.day)}
                  >
                    <Text style={styles.monthDayNumber}>{14 + index}</Text>
                    <Text style={styles.monthDayName}>{day.day.substring(0, 3)}</Text>
                    <View style={styles.monthMealDots}>
                      {day.meals.map((_, i) => (
                        <View key={i} style={styles.monthMealDot} />
                      ))}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {selectedDay && (
                <View style={styles.monthMealsSection}>
                  <Text style={styles.monthMealsTitle}>{selectedDay}'s Meals</Text>
                  {weekPlan.find(d => d.day === selectedDay)?.meals.map((meal) => (
                    <View key={meal.id} style={styles.monthMealCard}>
                      <DayMealCard
                        meal={meal}
                        onViewRecipe={() => handleViewRecipe(meal.id)}
                        onReplace={() => handleReplaceMeal(meal.id)}
                      />
                    </View>
                  ))}
                </View>
              )}
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
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.white,
    fontSize: 12,
    opacity: 0.9,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconButton: {
    padding: spacing.xs,
  },
  headerSpacer: {
    width: 80,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.lg,
  },
  daySection: {
    marginBottom: spacing.xl,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  dayName: {
    ...typography.h3,
    color: colors.black,
    fontSize: 22,
    fontWeight: '700',
  },
  dayDate: {
    ...typography.caption,
    color: colors.gray60,
    fontSize: 13,
    marginTop: 2,
  },
  lastUpdated: {
    ...typography.caption,
    color: colors.gray50,
    fontSize: 11,
  },
  mealsContainer: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl * 2,
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
  generateButton: {
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
  generateButtonText: {
    ...typography.h4,
    color: colors.white,
    fontSize: 17,
    fontWeight: '600',
  },
  // View Switcher Styles
  viewSwitcher: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray10,
  },
  viewButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.gray10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewButtonActive: {
    backgroundColor: '#FFF4E6',
  },
  // Grid View Styles
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.sm,
    gap: spacing.sm,
  },
  gridCard: {
    width: '31%',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gridImage: {
    width: '100%',
    height: 100,
    backgroundColor: colors.gray10,
  },
  gridTitle: {
    ...typography.bodyMedium,
    fontSize: 12,
    padding: spacing.xs,
    color: colors.gray90,
  },
  // Week View Styles
  weekDaysScroll: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  weekDayTab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginRight: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    alignItems: 'center',
    minWidth: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  weekDayTabActive: {
    backgroundColor: colors.primary,
  },
  weekDayName: {
    ...typography.bodyMedium,
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray90,
    marginBottom: 2,
  },
  weekDayNameActive: {
    color: colors.white,
  },
  weekDayDate: {
    ...typography.body,
    fontSize: 12,
    color: colors.gray60,
  },
  weekDayDateActive: {
    color: colors.white,
    opacity: 0.9,
  },
  weekMealCard: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  weekEmptyState: {
    padding: spacing.xl * 2,
    alignItems: 'center',
  },
  weekEmptyText: {
    ...typography.body,
    fontSize: 16,
    color: colors.gray60,
  },
  // Month View Styles
  monthContainer: {
    padding: spacing.lg,
  },
  monthTitle: {
    ...typography.h3,
    fontSize: 20,
    fontWeight: '700',
    color: colors.black,
    marginBottom: spacing.lg,
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  monthDay: {
    width: '13%',
    aspectRatio: 1,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  monthDayNumber: {
    ...typography.bodyMedium,
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
  },
  monthDayName: {
    ...typography.body,
    fontSize: 9,
    color: colors.gray60,
    marginTop: 2,
  },
  monthMealDots: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 4,
  },
  monthMealDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  monthMealsSection: {
    marginTop: spacing.xl,
  },
  monthMealsTitle: {
    ...typography.h4,
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
    marginBottom: spacing.md,
  },
  monthMealCard: {
    marginBottom: spacing.md,
  },
});
