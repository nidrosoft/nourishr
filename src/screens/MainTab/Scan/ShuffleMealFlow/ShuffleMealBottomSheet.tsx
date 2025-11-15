import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius } from '../../../../theme';
import { slideUpBottomSheet, slideDownBottomSheet } from '../../../../theme/animations';
import { NourishrIcon } from '../../../../components';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const heightAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(SCREEN_HEIGHT);
      slideUpBottomSheet(slideAnim, 0).start();
    } else {
      slideDownBottomSheet(slideAnim, SCREEN_HEIGHT).start();
      // Reset state when closed
      setTimeout(() => {
        setFlowState('options');
        setSelectedMealTypes([]);
        setSelectedMoods([]);
        setCustomMood('');
        setShowCustomMoodInput(false);
      }, 300);
    }
  }, [visible]);

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
            description: 'the clean cute breakfast you needed',
            tags: ['10 min', 'High protein', 'Uses what you have', 'Low calories'],
            calories: 280,
            time: '10 min',
          },
          {
            id: '2',
            name: 'Avocado Toast Supreme',
            description: 'because basic can still be delicious 🥑',
            tags: ['5 min', 'Healthy fats', 'Quick', 'Vegetarian'],
            calories: 320,
            time: '5 min',
          },
          {
            id: '3',
            name: 'Berry Smoothie Bowl',
            description: 'Instagram-worthy and actually tasty 📸',
            tags: ['8 min', 'Antioxidants', 'Refreshing', 'Vegan'],
            calories: 250,
            time: '8 min',
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

    // Expand height and start shuffling
    Animated.timing(heightAnim, {
      toValue: 0.85,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setFlowState('shuffling');
  };

  const handleRollAgain = () => {
    setFlowState('shuffling');
  };

  const handleMealTap = (meal: any) => {
    // TODO: Navigate to meal detail view
    console.log('Open meal detail:', meal);
  };

  const getBottomSheetHeight = () => {
    if (flowState === 'options') return SCREEN_HEIGHT * 0.6;
    if (flowState === 'shuffling') return SCREEN_HEIGHT * 0.85;
    return SCREEN_HEIGHT * 0.85;
  };

  if (!visible) return null;

  return (
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
          {
            height: getBottomSheetHeight(),
            transform: [{ translateY: slideAnim }],
          },
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
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.shufflingContainer}>
      <Animated.View style={[styles.slotMachine, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.slotEmoji}>🎰</Text>
      </Animated.View>
      <Text style={styles.loadingMessage}>{loadingMessage}</Text>
    </View>
  );
};

// RESULTS PANEL COMPONENT
const ResultsPanel: React.FC<{
  meals: any[];
  onMealTap: (meal: any) => void;
  onRollAgain: () => void;
  onClose: () => void;
}> = ({ meals, onMealTap, onRollAgain, onClose }) => {
  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Here's what I found for you 😋</Text>
        <Text style={styles.headerSubtext}>Tap one to explore or roll again.</Text>
      </View>

      {/* Meal Cards */}
      <View style={styles.mealsContainer}>
        {meals.map((meal) => (
          <TouchableOpacity
            key={meal.id}
            style={styles.mealCard}
            onPress={() => onMealTap(meal)}
          >
            <View style={styles.mealCardHeader}>
              <View style={styles.mealCardInfo}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealDescription}>{meal.description}</Text>
              </View>
              <NourishrIcon name="ArrowRight2" size={24} color={colors.primary} />
            </View>
            <View style={styles.mealTags}>
              {meal.tags.map((tag: string, index: number) => (
                <View key={index} style={styles.mealTag}>
                  <Text style={styles.mealTagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.resultActions}>
        <TouchableOpacity style={styles.rollAgainButton} onPress={onRollAgain}>
          <Text style={styles.rollAgainButtonText}>Roll again 🔄</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={onClose}>
          <Text style={styles.saveButtonText}>Save for later ⭐</Text>
        </TouchableOpacity>
      </View>
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
    gap: spacing.xs,
  },
  mealTag: {
    backgroundColor: colors.gray10,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: radius.sm,
  },
  mealTagText: {
    ...typography.caption,
    color: colors.gray70,
  },
  resultActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  rollAgainButton: {
    flex: 1,
    backgroundColor: colors.primary,
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
  saveButton: {
    flex: 1,
    backgroundColor: colors.white,
    paddingVertical: spacing.md + 2,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    ...typography.bodyMedium,
    color: colors.primary,
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
