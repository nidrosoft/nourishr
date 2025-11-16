import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { colors, typography, spacing, radius } from '../../../../theme';
import { NourishrIcon } from '../../../../components';
import { MealDetailBottomSheet } from './MealDetailBottomSheet';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type MealType = 'breakfast' | 'brunch' | 'lunch' | 'dinner' | 'snack' | 'dessert' | 'drink';
type Mood =
  | 'lazy'
  | 'healthy'
  | 'quick'
  | 'comfort'
  | 'fruity'
  | 'protein'
  | 'light'
  | 'spicy'
  | 'sweet'
  | 'savory'
  | 'fresh'
  | 'indulgent'
  | 'surprise';

interface ShuffleMealBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

const MEAL_TYPES: { id: MealType; label: string; emoji: string }[] = [
  { id: 'breakfast', label: 'Breakfast', emoji: '🌅' },
  { id: 'brunch', label: 'Brunch', emoji: '🥐' },
  { id: 'lunch', label: 'Lunch', emoji: '☀️' },
  { id: 'dinner', label: 'Dinner', emoji: '🌙' },
  { id: 'snack', label: 'Snack', emoji: '🍿' },
  { id: 'dessert', label: 'Dessert', emoji: '🍰' },
  { id: 'drink', label: 'Drink/Smoothie', emoji: '🥤' },
];

const MOODS: { id: Mood; label: string; emoji: string }[] = [
  { id: 'lazy', label: 'Hungry but lazy', emoji: '😴' },
  { id: 'healthy', label: 'Something healthy', emoji: '🥦' },
  { id: 'quick', label: 'Quick & easy', emoji: '⚡' },
  { id: 'comfort', label: 'Comfort food', emoji: '🍲' },
  { id: 'light', label: 'Light & fresh', emoji: '✨' },
  { id: 'protein', label: 'High protein', emoji: '💪' },
  { id: 'fruity', label: 'Fruity', emoji: '🍉' },
  { id: 'spicy', label: 'Spicy', emoji: '🌶️' },
  { id: 'sweet', label: 'Sweet tooth', emoji: '🍬' },
  { id: 'savory', label: 'Savory', emoji: '🧂' },
  { id: 'fresh', label: 'Fresh & crisp', emoji: '🥗' },
  { id: 'indulgent', label: 'Indulgent', emoji: '😋' },
  { id: 'surprise', label: 'Surprise me', emoji: '🤯' },
];

const LOADING_MESSAGES = [
  "Checking what your stomach wants 👀",
  "Asking the food gods for ideas 🔮",
  "Mixing delicious options…",
  "Cooking up suggestions…",
  "Hang tight… I'm cooking ideas 🔥",
  "Scanning the universe for deliciousness 🌎",
  "Your taste buds are about to thank you 👅",
  "Finding meals that won't disappoint 💅",
];

type FlowState = 'options' | 'shuffling' | 'results';

export const ShuffleMealBottomSheet: React.FC<ShuffleMealBottomSheetProps> = ({
  visible,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const [flowState, setFlowState] = useState<FlowState>('options');
  const [selectedMealTypes, setSelectedMealTypes] = useState<MealType[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<Mood[]>([]);
  const [customMood, setCustomMood] = useState('');
  const [showCustomMoodInput, setShowCustomMoodInput] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [shuffledMeals, setShuffledMeals] = useState<any[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [showMealDetail, setShowMealDetail] = useState(false);

  const translateY = useSharedValue(SCREEN_HEIGHT);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, { duration: 200 });  // Fast animation
    } else {
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 200 });
      // Reset state when closed
      setTimeout(() => {
        setFlowState('options');
        setSelectedMealTypes([]);
        setSelectedMoods([]);
        setCustomMood('');
        setShowCustomMoodInput(false);
      }, 200);
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    if (flowState === 'shuffling') {
      // Rotate loading messages
      const interval = setInterval(() => {
        setLoadingMessage(
          LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]
        );
      }, 1500);

      // Simulate API call
      setTimeout(() => {
        // Mock meal data
        const mockMeals = [
          {
            id: '1',
            name: 'Greek Yogurt Parfait',
            description: 'A perfectly balanced breakfast that combines creamy Greek yogurt with fresh berries and crunchy granola. This protein-packed meal will keep you energized all morning while satisfying your sweet tooth in the healthiest way possible.',
            tags: ['10 min', 'High protein', 'Uses what you have', 'Low calories'],
            calories: 280,
            time: '10 min',
            category: 'Breakfast',
            subcategory: 'Healthy Bowl',
            rating: 4.8,
            priceRange: '$10 - $15',
          },
          {
            id: '2',
            name: 'Avocado Toast Supreme',
            description: 'Elevate your basic avocado toast with perfectly ripe avocados, a drizzle of olive oil, and a sprinkle of red pepper flakes. This simple yet sophisticated dish delivers healthy fats and incredible flavor that proves basic can be absolutely delicious.',
            tags: ['5 min', 'Healthy fats', 'Quick', 'Vegetarian'],
            calories: 320,
            time: '5 min',
            category: 'Brunch',
            subcategory: 'Toast',
            rating: 4.6,
            priceRange: '$8 - $12',
            promo: 'Popular',
          },
          {
            id: '3',
            name: 'Berry Smoothie Bowl',
            description: 'A vibrant blend of mixed berries, banana, and almond milk topped with your favorite toppings. Not only is it Instagram-worthy, but it\'s packed with antioxidants and natural sweetness that will make your taste buds dance.',
            tags: ['8 min', 'Antioxidants', 'Refreshing', 'Vegan'],
            calories: 250,
            time: '8 min',
            category: 'Breakfast',
            subcategory: 'Smoothie Bowl',
            rating: 4.9,
            priceRange: '$12 - $18',
          },
        ];
        setShuffledMeals(mockMeals);
        setFlowState('results');
        clearInterval(interval);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [flowState]);

  const toggleMealType = (type: MealType) => {
    setSelectedMealTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleMood = (mood: Mood) => {
    setSelectedMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    );
  };

  const addCustomMood = () => {
    if (customMood.trim()) {
      // Custom mood is stored separately and will be sent to AI
      setShowCustomMoodInput(false);
    }
  };

  const removeCustomMood = () => {
    setCustomMood('');
    setShowCustomMoodInput(false);
  };

  const handleShuffle = () => {
    // If no meal type selected, default based on time
    if (selectedMealTypes.length === 0) {
      const hour = new Date().getHours();
      let defaultMeal: MealType;
      if (hour >= 5 && hour < 11) defaultMeal = 'breakfast';
      else if (hour >= 11 && hour < 16) defaultMeal = 'lunch';
      else if (hour >= 16 && hour < 22) defaultMeal = 'dinner';
      else defaultMeal = 'snack';
      setSelectedMealTypes([defaultMeal]);
    }

    // Start shuffling
    setFlowState('shuffling');
  };

  const handleRollAgain = () => {
    setFlowState('shuffling');
  };

  const handleMealTap = async (meal: any) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedMeal(meal);
    setShowMealDetail(true);
  };

  const getBottomSheetHeight = () => {
    if (flowState === 'options') return SCREEN_HEIGHT * 0.6;
    if (flowState === 'shuffling') return SCREEN_HEIGHT * 0.85;
    return SCREEN_HEIGHT * 0.85;
  };

  if (!visible) return null;

  return (
    <>
      <View style={styles.container} pointerEvents="box-none">
      {/* Dark Overlay */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      />

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          styles.bottomSheet,
          animatedStyle,
        ]}
      >
        {/* Handle */}
        <View style={styles.handle} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {flowState === 'options' && (
            <OptionsPanel
              selectedMealTypes={selectedMealTypes}
              selectedMoods={selectedMoods}
              customMood={customMood}
              showCustomMoodInput={showCustomMoodInput}
              onToggleMealType={toggleMealType}
              onToggleMood={toggleMood}
              onCustomMoodChange={setCustomMood}
              onAddCustomMood={addCustomMood}
              onRemoveCustomMood={removeCustomMood}
              onShowCustomMoodInput={() => setShowCustomMoodInput(true)}
              onClose={onClose}
            />
          )}

          {flowState === 'shuffling' && (
            <ShufflingPanel loadingMessage={loadingMessage} />
          )}

          {flowState === 'results' && (
            <ResultsPanel
              meals={shuffledMeals}
              onMealTap={handleMealTap}
              onRollAgain={handleRollAgain}
              onClose={onClose}
            />
          )}
        </ScrollView>

        {/* Sticky Footer with CTA Button */}
        {flowState === 'options' && (
          <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
            <TouchableOpacity onPress={handleShuffle} activeOpacity={0.8}>
              <LinearGradient
                colors={['#FF9500', '#FD6A2F']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.shuffleButton}
              >
                <Text style={styles.shuffleButtonText}>Let's see what you got!</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </View>

    {/* Meal Detail Bottom Sheet */}
    {showMealDetail && selectedMeal && (
      <MealDetailBottomSheet
        visible={showMealDetail}
        meal={selectedMeal}
        onClose={() => setShowMealDetail(false)}
      />
    )}
  </>
  );
};

// OPTIONS PANEL COMPONENT
const OptionsPanel: React.FC<{
  selectedMealTypes: MealType[];
  selectedMoods: Mood[];
  customMood: string;
  showCustomMoodInput: boolean;
  onToggleMealType: (type: MealType) => void;
  onToggleMood: (mood: Mood) => void;
  onCustomMoodChange: (text: string) => void;
  onAddCustomMood: () => void;
  onRemoveCustomMood: () => void;
  onShowCustomMoodInput: () => void;
  onClose: () => void;
}> = ({ 
  selectedMealTypes, 
  selectedMoods, 
  customMood,
  showCustomMoodInput,
  onToggleMealType, 
  onToggleMood,
  onCustomMoodChange,
  onAddCustomMood,
  onRemoveCustomMood,
  onShowCustomMoodInput,
  onClose,
}) => {
  return (
    <>
      {/* Sheet Header */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Let's find something delicious 😋</Text>
          <Text style={styles.subtitle}>
            Tell me the vibe + the meal, and I'll do the magic.
          </Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <NourishrIcon name="CloseCircle" size={24} color={colors.gray60} />
        </TouchableOpacity>
      </View>

      {/* Meal Type Selector */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>What's this meal for?</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.mealTypeScroll}
          contentContainerStyle={styles.mealTypeScrollContent}
        >
          {MEAL_TYPES.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.mealTypeButton,
                selectedMealTypes.includes(type.id) && styles.mealTypeButtonActive,
              ]}
              onPress={() => onToggleMealType(type.id)}
            >
              <Text style={styles.mealTypeEmoji}>{type.emoji}</Text>
              <Text
                style={[
                  styles.mealTypeLabel,
                  selectedMealTypes.includes(type.id) && styles.mealTypeLabelActive,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.microcopy}>
          Pick one or mix a couple — totally up to you.
        </Text>
      </View>

      {/* Mood Picker */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>What's the vibe today?</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.moodScroll}
        >
          {MOODS.map((mood) => (
            <TouchableOpacity
              key={mood.id}
              style={[
                styles.moodPill,
                selectedMoods.includes(mood.id) && styles.moodPillActive,
              ]}
              onPress={() => onToggleMood(mood.id)}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text
                style={[
                  styles.moodLabel,
                  selectedMoods.includes(mood.id) && styles.moodLabelActive,
                ]}
              >
                {mood.label}
              </Text>
            </TouchableOpacity>
          ))}
          
          {/* Add Custom Mood Button */}
          {!showCustomMoodInput && !customMood && (
            <TouchableOpacity
              style={styles.addCustomMoodButton}
              onPress={onShowCustomMoodInput}
            >
              <NourishrIcon name="Add" size={16} color={colors.primary} />
              <Text style={styles.addCustomMoodText}>Custom vibe</Text>
            </TouchableOpacity>
          )}
          
          {/* Custom Mood Chip */}
          {customMood && !showCustomMoodInput && (
            <View style={[styles.moodPill, styles.customMoodPill]}>
              <Text style={styles.customMoodLabel}>{customMood}</Text>
              <TouchableOpacity onPress={onRemoveCustomMood}>
                <NourishrIcon name="CloseCircle" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
        
        {/* Custom Mood Input */}
        {showCustomMoodInput && (
          <View style={styles.customMoodInputContainer}>
            <TextInput
              style={styles.customMoodInput}
              placeholder="Type your vibe..."
              value={customMood}
              onChangeText={onCustomMoodChange}
              autoFocus
              onSubmitEditing={onAddCustomMood}
              returnKeyType="done"
            />
            <TouchableOpacity onPress={onAddCustomMood} style={styles.addMoodIconButton}>
              <NourishrIcon name="CheckmarkCircle" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        )}
        
        <Text style={styles.microcopy}>
          Pick multiple vibes or add your own!
        </Text>
      </View>

    </>
  );
};

// SHUFFLING PANEL COMPONENT
const ShufflingPanel: React.FC<{ loadingMessage: string }> = ({ loadingMessage }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,  // Infinite loop
      true // Reverse
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.shufflingContainer}>
      <Animated.View style={[styles.slotMachine, animatedStyle]}>
        <Text style={styles.slotEmoji}>🎰</Text>
      </Animated.View>
      <Text style={styles.loadingMessage}>{loadingMessage}</Text>
    </View>
  );
};

// Helper function to get tag colors
const getTagColors = (tag: string) => {
  const tagLower = tag.toLowerCase();
  
  // Time-based tags
  if (tagLower.includes('min')) {
    return { bg: '#FFF4E6', text: '#F59E0B' }; // Amber
  }
  // Protein/nutrition tags
  if (tagLower.includes('protein') || tagLower.includes('calories')) {
    return { bg: '#DBEAFE', text: '#3B82F6' }; // Blue
  }
  // Health/diet tags
  if (tagLower.includes('healthy') || tagLower.includes('fats') || tagLower.includes('antioxidants')) {
    return { bg: '#D1FAE5', text: '#10B981' }; // Green
  }
  // Speed/convenience tags
  if (tagLower.includes('quick') || tagLower.includes('uses what you have')) {
    return { bg: '#FCE7F3', text: '#EC4899' }; // Pink
  }
  // Diet type tags
  if (tagLower.includes('vegan') || tagLower.includes('vegetarian')) {
    return { bg: '#E0E7FF', text: '#6366F1' }; // Indigo
  }
  // Refreshing/fresh tags
  if (tagLower.includes('refreshing')) {
    return { bg: '#CFFAFE', text: '#06B6D4' }; // Cyan
  }
  
  // Default
  return { bg: '#F3F4F6', text: '#6B7280' }; // Gray
};

// RESULTS PANEL COMPONENT
const ResultsPanel: React.FC<{
  meals: any[];
  onMealTap: (meal: any) => void;
  onRollAgain: () => void;
  onClose: () => void;
}> = ({ meals, onMealTap, onRollAgain, onClose }) => {
  const [savedMeals, setSavedMeals] = React.useState<Set<string>>(new Set());

  const handleSaveMeal = async (mealId: string) => {
    const newSaved = new Set(savedMeals);
    if (newSaved.has(mealId)) {
      newSaved.delete(mealId);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      newSaved.add(mealId);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // TODO: Show toast notification "Saved to your favorites!"
    }
    setSavedMeals(newSaved);
  };

  return (
    <>
      {/* Header with Close Button */}
      <View style={styles.resultsHeaderContainer}>
        <View style={styles.resultsHeader}>
          <Text style={styles.title}>Here is what we found for you 😋</Text>
          <Text style={styles.subtitle}>Tap one to explore or roll again.</Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <NourishrIcon name="CloseCircle" size={28} color={colors.gray60} />
        </TouchableOpacity>
      </View>

      {/* Meal Cards */}
      <View style={styles.mealsContainer}>
        {meals.map((meal) => (
          <TouchableOpacity
            key={meal.id}
            style={styles.mealCard}
            onPress={() => onMealTap(meal)}
          >
            {/* Heart Icon */}
            <TouchableOpacity
              style={styles.heartButton}
              onPress={() => handleSaveMeal(meal.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <NourishrIcon
                name={savedMeals.has(meal.id) ? "Heart" : "Heart"}
                size={24}
                color={savedMeals.has(meal.id) ? colors.primary : colors.gray40}
                variant={savedMeals.has(meal.id) ? "Bold" : "Linear"}
              />
            </TouchableOpacity>
            <View style={styles.mealCardHeader}>
              <View style={styles.mealCardInfo}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealDescription} numberOfLines={1} ellipsizeMode="tail">
                  {meal.description}
                </Text>
              </View>
            </View>
            <View style={styles.mealTags}>
              {meal.tags.map((tag: string, index: number) => {
                const tagColors = getTagColors(tag);
                return (
                  <View key={index} style={[styles.mealTag, { backgroundColor: tagColors.bg }]}>
                    <Text style={[styles.mealTagText, { color: tagColors.text }]}>{tag}</Text>
                  </View>
                );
              })}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Roll Again Button */}
      <TouchableOpacity onPress={onRollAgain}>
        <LinearGradient
          colors={['#FF9500', '#FD6A2F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.rollAgainButton}
        >
          <Text style={styles.rollAgainButtonText}>Roll again</Text>
        </LinearGradient>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.gray30,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    ...typography.headingM,
    color: colors.black,
    fontWeight: '700',
    marginBottom: 4,
    fontSize: 20,
  },
  headerSubtext: {
    ...typography.caption,
    color: colors.gray60,
    fontSize: 14,
    marginBottom: spacing.md,
  },
  resultsHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  resultsHeader: {
    flex: 1,
    marginRight: spacing.sm,
  },
  closeButton: {
    padding: spacing.xs,
  },
  title: {
    ...typography.h2,
    color: colors.black,
    fontSize: 21,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.gray60,
    fontSize: 16,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionLabel: {
    ...typography.h4,
    color: colors.black,
    marginBottom: spacing.md,
    fontSize: 18,
    fontWeight: '600',
  },
  mealTypeScroll: {
    marginBottom: spacing.sm,
  },
  mealTypeScrollContent: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  mealTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    backgroundColor: colors.white,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.gray30,
  },
  mealTypeButtonActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  mealTypeEmoji: {
    fontSize: 16,
    marginRight: spacing.xs / 2,
  },
  mealTypeLabel: {
    ...typography.bodyMedium,
    color: colors.gray70,
    fontSize: 14,
  },
  mealTypeLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  microcopy: {
    ...typography.caption,
    color: colors.gray60,
    fontStyle: 'italic',
    fontSize: 14,
  },
  moodScroll: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  moodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    backgroundColor: colors.white,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.gray30,
  },
  moodPillActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  moodEmoji: {
    fontSize: 14,
    marginRight: spacing.xs / 2,
  },
  moodLabel: {
    ...typography.body,
    color: colors.gray70,
    fontSize: 14,
  },
  moodLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray20,
  },
  shuffleButton: {
    paddingVertical: spacing.md + 2,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shuffleButtonText: {
    ...typography.h4,
    color: colors.white,
    fontSize: 17,
    fontWeight: '600',
  },
  shufflingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  slotMachine: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  slotEmoji: {
    fontSize: 80,
  },
  loadingMessage: {
    ...typography.h4,
    color: colors.gray70,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  mealsContainer: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  mealCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  heartButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    zIndex: 10,
    padding: spacing.xs,
  },
  mealCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  mealCardInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  mealName: {
    ...typography.h4,
    color: colors.black,
    marginBottom: spacing.xs / 2,
    fontSize: 18,
    fontWeight: '600',
  },
  mealDescription: {
    ...typography.body,
    color: colors.gray60,
    fontSize: 15,
  },
  mealTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  mealTag: {
    backgroundColor: colors.gray10,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  mealTagText: {
    ...typography.caption,
    color: colors.gray70,
    fontSize: 11,
    fontWeight: '500',
  },
  rollAgainButton: {
    width: '100%',
    paddingVertical: spacing.md + 2,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rollAgainButtonText: {
    ...typography.bodyMedium,
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  closeButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  addCustomMoodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    backgroundColor: colors.white,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    gap: spacing.xs / 2,
  },
  addCustomMoodText: {
    ...typography.body,
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  customMoodPill: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
    gap: spacing.xs / 2,
  },
  customMoodLabel: {
    ...typography.body,
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  customMoodInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  customMoodInput: {
    flex: 1,
    ...typography.body,
    color: colors.gray80,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  addMoodIconButton: {
    padding: spacing.xs / 2,
  },
});
