import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Slider from '@react-native-community/slider';
import { colors, typography, spacing, radius } from '../../theme';
import { NourishrIcon, PrimaryButton, PreferenceHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { preferencesService } from '../../services';

type PreferenceLifestyleScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PreferenceLifestyle'>;

interface PreferenceLifestyleScreenProps {
  navigation: PreferenceLifestyleScreenNavigationProp;
}

const MEALS_PER_DAY = [
  { id: '1', label: '1' },
  { id: '2', label: '2' },
  { id: '3', label: '3' },
  { id: '4', label: '4+' },
];

const DAYS_OF_WEEK = [
  { id: 'mon', label: 'Mon', icon: 'Calendar' },
  { id: 'tue', label: 'Tue', icon: 'Calendar' },
  { id: 'wed', label: 'Wed', icon: 'Calendar' },
  { id: 'thu', label: 'Thu', icon: 'Calendar' },
  { id: 'fri', label: 'Fri', icon: 'Calendar' },
  { id: 'sat', label: 'Sat', icon: 'Calendar' },
  { id: 'sun', label: 'Sun', icon: 'Calendar' },
];

const HEALTH_GOALS = [
  { id: 'lose-weight', label: 'Lose weight' },
  { id: 'maintain', label: 'Maintain' },
  { id: 'gain-muscle', label: 'Gain muscle' },
  { id: 'eat-better', label: 'Just eat better' },
  { id: 'save-time', label: 'Save time' },
  { id: 'save-money', label: 'Save money' },
  { id: 'try-new-food', label: 'Try new food' },
  { id: 'eat-healthier', label: 'Eat healthier' },
];

export const PreferenceLifestyleScreen: React.FC<PreferenceLifestyleScreenProps> = ({ navigation, route }) => {
  const gender = route.params?.gender;
  const isFemale = gender === 'Female';
  
  const [mealsPerDay, setMealsPerDay] = useState('3');
  const [cookDays, setCookDays] = useState<string[]>([]);
  const [orderDays, setOrderDays] = useState<string[]>([]);
  const [cookOrderRatio, setCookOrderRatio] = useState(0.5); // 0=Mostly cook, 0.5=Balanced, 1=Mostly order
  const [homeCookingBudget, setHomeCookingBudget] = useState(15); // $5-$500
  const [deliveryBudget, setDeliveryBudget] = useState(30); // $10-$500
  const [selectedWorkSchedule, setSelectedWorkSchedule] = useState<string>('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [calorieConsciousMode, setCalorieConsciousMode] = useState(false);
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState(2000); // 1200-3500
  const [pregnancyStatus, setPregnancyStatus] = useState<string | null>(null); // 'pregnant', 'breastfeeding', 'none'

  const [showMealsSection, setShowMealsSection] = useState(true);
  const [showWeeklySection, setShowWeeklySection] = useState(true);
  const [showRatioSection, setShowRatioSection] = useState(true);
  const [showBudgetSection, setShowBudgetSection] = useState(true);
  const [showHealthSection, setShowHealthSection] = useState(true);

  const toggleCookDay = (day: string) => {
    if (cookDays.includes(day)) {
      setCookDays(prev => prev.filter(d => d !== day));
    } else {
      setCookDays(prev => [...prev, day]);
      setOrderDays(prev => prev.filter(d => d !== day));
    }
  };

  const toggleOrderDay = (day: string) => {
    if (orderDays.includes(day)) {
      setOrderDays(prev => prev.filter(d => d !== day));
    } else {
      setOrderDays(prev => [...prev, day]);
      setCookDays(prev => prev.filter(d => d !== day));
    }
  };

  const toggleGoal = (id: string) => {
    setSelectedGoals(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const getCookOrderLabel = () => {
    if (cookOrderRatio < 0.33) return 'Mostly cook';
    if (cookOrderRatio > 0.67) return 'Mostly order';
    return 'Balanced';
  };

  const isValid = mealsPerDay !== '';

  const handleNext = async () => {
    if (!isValid) return;

    setLoading(true);
    try {
      await preferencesService.saveLifestyle({
        mealsPerDay,
        cookDays,
        orderDays,
        cookOrderRatio,
        homeCookingBudget,
        deliveryBudget,
        workSchedule: selectedWorkSchedule,
        healthGoals: selectedGoals,
        calorieConsciousMode,
        dailyCalorieTarget,
        pregnancyStatus,
      });

      console.log('Lifestyle data saved successfully');
      navigation.navigate('PreferenceLocation');
    } catch (error: any) {
      console.error('Failed to save lifestyle:', error);
      alert(`Failed to save: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <PreferenceHeader
        currentStep={8}
        totalSteps={10}
        icon="Activity"
        onClose={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>How do meals fit into your life?</Text>
        <Text style={styles.subtitle}>
          Tell us about your eating habits, budget, and lifestyle so we can tailor recommendations to your daily routine.
        </Text>

        {/* Section 1: Meals per Day */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setShowMealsSection(!showMealsSection)}
        >
          <View style={styles.sectionHeaderLeft}>
            <NourishrIcon name="Cup" size={20} color={colors.black} variant="bold" />
            <Text style={styles.sectionTitle}>Meals per day</Text>
          </View>
          <NourishrIcon 
            name={showMealsSection ? "ArrowUp2" : "ArrowDown2"} 
            size={20} 
            color={colors.gray60} 
          />
        </TouchableOpacity>

        {showMealsSection && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionSubtitle}>How many meals do you typically eat per day?</Text>
            <View style={styles.toggleButtonsContainer}>
              {MEALS_PER_DAY.map(meal => (
                <TouchableOpacity
                  key={meal.id}
                  style={[styles.toggleButton, mealsPerDay === meal.id && styles.toggleButtonSelected]}
                  onPress={() => setMealsPerDay(meal.id)}
                >
                  <Text style={[styles.toggleButtonLabel, mealsPerDay === meal.id && styles.toggleButtonLabelSelected]}>
                    {meal.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Section 2: Weekly Pattern */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setShowWeeklySection(!showWeeklySection)}
        >
          <View style={styles.sectionHeaderLeft}>
            <NourishrIcon name="Calendar" size={20} color={colors.black} variant="bold" />
            <Text style={styles.sectionTitle}>Weekly pattern</Text>
          </View>
          <NourishrIcon 
            name={showWeeklySection ? "ArrowUp2" : "ArrowDown2"} 
            size={20} 
            color={colors.gray60} 
          />
        </TouchableOpacity>

        {showWeeklySection && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionSubtitle}>Mark days you usually cook vs order</Text>
            <View style={styles.weekContainer}>
              {DAYS_OF_WEEK.map(day => {
                const isCook = cookDays.includes(day.id);
                const isOrder = orderDays.includes(day.id);
                
                return (
                  <View key={day.id} style={styles.dayContainer}>
                    <Text style={styles.dayLabel}>{day.label}</Text>
                    <View style={styles.dayButtons}>
                      <TouchableOpacity
                        style={[styles.dayButton, styles.cookButton, isCook && styles.cookButtonSelected]}
                        onPress={() => toggleCookDay(day.id)}
                      >
                        <NourishrIcon name="Home" size={16} color={isCook ? colors.white : colors.gray60} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.dayButton, styles.orderButton, isOrder && styles.orderButtonSelected]}
                        onPress={() => toggleOrderDay(day.id)}
                      >
                        <NourishrIcon name="Bag" size={16} color={isOrder ? colors.white : colors.gray60} />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendIcon, styles.cookButton, styles.cookButtonSelected]}>
                  <NourishrIcon name="Home" size={14} color={colors.white} />
                </View>
                <Text style={styles.legendText}>Cook</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendIcon, styles.orderButton, styles.orderButtonSelected]}>
                  <NourishrIcon name="Bag" size={14} color={colors.white} />
                </View>
                <Text style={styles.legendText}>Order</Text>
              </View>
            </View>
          </View>
        )}

        {/* Section 3: Cook vs Order Preference */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setShowRatioSection(!showRatioSection)}
        >
          <View style={styles.sectionHeaderLeft}>
            <NourishrIcon name="Setting" size={20} color={colors.black} variant="bold" />
            <Text style={styles.sectionTitle}>Preference: Cook vs Order</Text>
          </View>
          <NourishrIcon 
            name={showRatioSection ? "ArrowUp2" : "ArrowDown2"} 
            size={20} 
            color={colors.gray60} 
          />
        </TouchableOpacity>

        {showRatioSection && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionSubtitle}>What's your ideal balance?</Text>
            <View style={styles.sliderContainer}>
              <View style={styles.sliderRow}>
                <Text style={styles.sliderEndLabel}>Mostly cook</Text>
                <Slider
                  style={styles.sliderFlex}
                  minimumValue={0}
                  maximumValue={1}
                  value={cookOrderRatio}
                  onValueChange={setCookOrderRatio}
                  minimumTrackTintColor={colors.primary}
                  maximumTrackTintColor={colors.gray20}
                  thumbTintColor={colors.primary}
                />
                <Text style={styles.sliderEndLabel}>Mostly order</Text>
              </View>
              <Text style={styles.sliderValue}>{getCookOrderLabel()}</Text>
            </View>
          </View>
        )}

        {/* Section 4: Budget */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setShowBudgetSection(!showBudgetSection)}
        >
          <View style={styles.sectionHeaderLeft}>
            <NourishrIcon name="Wallet" size={20} color={colors.black} variant="bold" />
            <Text style={styles.sectionTitle}>Budget</Text>
          </View>
          <NourishrIcon 
            name={showBudgetSection ? "ArrowUp2" : "ArrowDown2"} 
            size={20} 
            color={colors.gray60} 
          />
        </TouchableOpacity>

        {showBudgetSection && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionSubtitle}>Set your meal budget preferences</Text>
            
            {/* Home Cooking Budget */}
            <View style={styles.budgetContainer}>
              <Text style={styles.budgetLabel}>Per-meal budget for home cooking</Text>
              <Slider
                style={styles.slider}
                minimumValue={5}
                maximumValue={500}
                step={5}
                value={homeCookingBudget}
                onValueChange={setHomeCookingBudget}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.gray20}
                thumbTintColor={colors.primary}
              />
              <Text style={styles.budgetValue}>${homeCookingBudget}</Text>
            </View>

            {/* Delivery Budget */}
            <View style={styles.budgetContainer}>
              <Text style={styles.budgetLabel}>Per-order budget for delivery</Text>
              <Slider
                style={styles.slider}
                minimumValue={10}
                maximumValue={500}
                step={5}
                value={deliveryBudget}
                onValueChange={setDeliveryBudget}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.gray20}
                thumbTintColor={colors.primary}
              />
              <Text style={styles.budgetValue}>${deliveryBudget}</Text>
            </View>
          </View>
        )}

        {/* Section 5: Health & Goals */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setShowHealthSection(!showHealthSection)}
        >
          <View style={styles.sectionHeaderLeft}>
            <NourishrIcon name="Heart" size={20} color={colors.black} variant="bold" />
            <Text style={styles.sectionTitle}>Health & goals</Text>
            <View style={styles.optionalBadge}>
              <Text style={styles.optionalText}>Optional</Text>
            </View>
          </View>
          <NourishrIcon 
            name={showHealthSection ? "ArrowUp2" : "ArrowDown2"} 
            size={20} 
            color={colors.gray60} 
          />
        </TouchableOpacity>

        {showHealthSection && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionSubtitle}>Select your health goals (optional but valuable)</Text>
            <View style={styles.chipsContainer}>
              {HEALTH_GOALS.map(goal => (
                <TouchableOpacity
                  key={goal.id}
                  style={[styles.chip, selectedGoals.includes(goal.id) && styles.chipSelected]}
                  onPress={() => toggleGoal(goal.id)}
                >
                  <Text style={[styles.chipLabel, selectedGoals.includes(goal.id) && styles.chipLabelSelected]}>
                    {goal.label}
                  </Text>
                  {selectedGoals.includes(goal.id) && (
                    <View style={styles.chipCheckmark}>
                      <NourishrIcon name="TickCircle" size={16} color={colors.primary} variant="bold" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Calorie-Conscious Mode */}
            <View style={styles.calorieToggleContainer}>
              <View style={styles.calorieToggleLeft}>
                <Text style={styles.calorieToggleTitle}>Turn on calorie-conscious mode</Text>
                <Text style={styles.calorieToggleSubtitle}>Get calorie-aware meal suggestions</Text>
              </View>
              <Switch
                value={calorieConsciousMode}
                onValueChange={setCalorieConsciousMode}
                trackColor={{ false: colors.gray20, true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>

            {/* Calorie Target Slider */}
            {calorieConsciousMode && (
              <View style={styles.calorieSliderContainer}>
                <Text style={styles.calorieSliderLabel}>Rough daily calorie target?</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={1200}
                  maximumValue={3500}
                  step={50}
                  value={dailyCalorieTarget}
                  onValueChange={setDailyCalorieTarget}
                  minimumTrackTintColor={colors.primary}
                  maximumTrackTintColor={colors.gray20}
                  thumbTintColor={colors.primary}
                />
                <Text style={styles.calorieSliderValue}>{dailyCalorieTarget} cal/day</Text>
              </View>
            )}

            {/* Pregnancy/Breastfeeding Status - Only show for females */}
            {isFemale && (
              <View style={styles.pregnancyContainer}>
                <Text style={styles.pregnancyLabel}>Special nutritional needs?</Text>
                <Text style={styles.pregnancyHint}>
                  Helps us provide appropriate nutritional recommendations
                </Text>
                <View style={styles.pregnancyChipsContainer}>
                  <TouchableOpacity
                    style={[
                      styles.pregnancyChip,
                      pregnancyStatus === 'pregnant' && styles.pregnancyChipSelected
                    ]}
                    onPress={() => setPregnancyStatus(pregnancyStatus === 'pregnant' ? null : 'pregnant')}
                  >
                    <Text style={[
                      styles.pregnancyChipText,
                      pregnancyStatus === 'pregnant' && styles.pregnancyChipTextSelected
                    ]}>
                      🤰 Pregnant
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.pregnancyChip,
                      pregnancyStatus === 'breastfeeding' && styles.pregnancyChipSelected
                    ]}
                    onPress={() => setPregnancyStatus(pregnancyStatus === 'breastfeeding' ? null : 'breastfeeding')}
                  >
                    <Text style={[
                      styles.pregnancyChipText,
                      pregnancyStatus === 'breastfeeding' && styles.pregnancyChipTextSelected
                    ]}>
                      🤱 Breastfeeding
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.pregnancyChip,
                      pregnancyStatus === 'none' && styles.pregnancyChipSelected
                    ]}
                    onPress={() => setPregnancyStatus(pregnancyStatus === 'none' ? null : 'none')}
                  >
                    <Text style={[
                      styles.pregnancyChipText,
                      pregnancyStatus === 'none' && styles.pregnancyChipTextSelected
                    ]}>
                      None
                    </Text>
                  </TouchableOpacity>
                </View>
                {pregnancyStatus && pregnancyStatus !== 'none' && (
                  <View style={styles.pregnancyInfoBox}>
                    <NourishrIcon name="InfoCircle" size={16} color={colors.primary} />
                    <Text style={styles.pregnancyInfoText}>
                      {pregnancyStatus === 'pregnant' 
                        ? 'We\'ll recommend meals with increased folate, iron, and calcium'
                        : 'We\'ll suggest meals with extra calories and nutrients for milk production'}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {/* Info Box */}
        {isValid && (
          <View style={styles.infoBox}>
            <NourishrIcon name="InfoCircle" size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              This helps us schedule meal plans, suggest ordering options, and match recommendations to your budget and health goals.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title={loading ? "Saving..." : "Next"}
          onPress={handleNext}
          disabled={!isValid || loading}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  content: { flex: 1, paddingHorizontal: spacing.lg },
  title: { ...typography.headingXL, fontSize: 32, fontWeight: '700', color: colors.black, marginBottom: spacing.sm },
  subtitle: { ...typography.body, fontSize: 16, color: colors.gray60, marginBottom: spacing.xl, lineHeight: 22 },
  
  // Section Header
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.gray10, borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.lg, marginBottom: spacing.sm },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  sectionTitle: { ...typography.bodyMedium, fontSize: 18, fontWeight: '600', color: colors.black },
  sectionContent: { marginBottom: spacing.md },
  sectionSubtitle: { ...typography.caption, fontSize: 14, color: colors.gray60, marginBottom: spacing.md },
  optionalBadge: { backgroundColor: colors.gray20, borderRadius: radius.sm, paddingHorizontal: spacing.xs, paddingVertical: 2 },
  optionalText: { ...typography.caption, fontSize: 11, fontWeight: '600', color: colors.gray60 },
  
  // Toggle Buttons (Meals per Day)
  toggleButtonsContainer: { flexDirection: 'row', gap: spacing.sm },
  toggleButton: { flex: 1, backgroundColor: colors.white, borderWidth: 2, borderColor: colors.gray20, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center' },
  toggleButtonSelected: { borderColor: colors.primary, backgroundColor: '#FFF5E6' },
  toggleButtonLabel: { ...typography.bodyMedium, fontSize: 18, fontWeight: '600', color: colors.black },
  toggleButtonLabelSelected: { color: colors.primary },
  
  // Weekly Pattern
  weekContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  dayContainer: { alignItems: 'center', gap: spacing.xs },
  dayLabel: { ...typography.caption, fontSize: 12, fontWeight: '600', color: colors.gray60 },
  dayButtons: { flexDirection: 'column', gap: 4 },
  dayButton: { width: 36, height: 36, borderRadius: radius.md, justifyContent: 'center', alignItems: 'center', borderWidth: 2 },
  cookButton: { borderColor: colors.gray20, backgroundColor: colors.white },
  cookButtonSelected: { borderColor: '#10B981', backgroundColor: '#10B981' },
  orderButton: { borderColor: colors.gray20, backgroundColor: colors.white },
  orderButtonSelected: { borderColor: colors.primary, backgroundColor: colors.primary },
  legendContainer: { flexDirection: 'row', gap: spacing.lg, justifyContent: 'center', marginTop: spacing.sm },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  legendIcon: { width: 24, height: 24, borderRadius: radius.sm, justifyContent: 'center', alignItems: 'center', borderWidth: 2 },
  legendText: { ...typography.caption, fontSize: 13, color: colors.gray60 },
  
  // Sliders
  sliderContainer: { marginBottom: spacing.md },
  sliderRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  slider: { width: '100%', height: 40 },
  sliderFlex: { flex: 1, height: 40 },
  sliderValue: { ...typography.body, fontSize: 18, fontWeight: '600', color: colors.primary, textAlign: 'center', marginTop: spacing.sm },
  sliderEndLabel: { ...typography.caption, fontSize: 13, color: colors.gray60, minWidth: 80 },
  
  // Budget
  budgetContainer: { marginBottom: spacing.lg },
  budgetLabel: { ...typography.bodyMedium, fontSize: 16, fontWeight: '600', color: colors.black, marginBottom: spacing.sm },
  budgetValue: { ...typography.body, fontSize: 20, fontWeight: '700', color: colors.primary, textAlign: 'center', marginTop: spacing.xs },
  
  // Health Goals
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderWidth: 2, borderColor: colors.gray20, borderRadius: radius.full, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, gap: spacing.xs },
  chipSelected: { borderColor: colors.primary, backgroundColor: '#FFF5E6' },
  chipLabel: { ...typography.body, fontSize: 15, fontWeight: '500', color: colors.black },
  chipLabelSelected: { color: colors.primary, fontWeight: '600' },
  chipCheckmark: { marginLeft: spacing.xs },
  
  // Calorie Toggle
  calorieToggleContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.gray10, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md },
  calorieToggleLeft: { flex: 1 },
  calorieToggleTitle: { ...typography.bodyMedium, fontSize: 16, fontWeight: '600', color: colors.black, marginBottom: 2 },
  calorieToggleSubtitle: { ...typography.caption, fontSize: 13, color: colors.gray60 },
  
  // Calorie Target
  calorieTargetContainer: { marginTop: spacing.md },
  calorieTargetLabel: { ...typography.bodyMedium, fontSize: 16, fontWeight: '600', color: colors.black, marginBottom: spacing.sm },
  calorieTargetValue: { ...typography.body, fontSize: 20, fontWeight: '700', color: colors.primary, textAlign: 'center', marginTop: spacing.xs },
  
  // Pregnancy/Breastfeeding
  pregnancyContainer: { marginTop: spacing.lg },
  pregnancyLabel: { ...typography.bodyMedium, fontSize: 16, fontWeight: '600', color: colors.black, marginBottom: spacing.xs },
  pregnancyHint: { ...typography.caption, fontSize: 13, color: colors.gray60, marginBottom: spacing.sm, lineHeight: 18 },
  pregnancyChipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.sm },
  pregnancyChip: { backgroundColor: colors.white, borderWidth: 2, borderColor: colors.gray20, borderRadius: radius.lg, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, minHeight: 44, justifyContent: 'center', alignItems: 'center' },
  pregnancyChipSelected: { backgroundColor: '#FFF5E6', borderColor: colors.primary },
  pregnancyChipText: { ...typography.body, fontSize: 15, fontWeight: '500', color: colors.gray70 },
  pregnancyChipTextSelected: { color: colors.primary, fontWeight: '600' },
  pregnancyInfoBox: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#FFF5E6', borderRadius: radius.md, padding: spacing.sm, gap: spacing.xs },
  pregnancyInfoText: { ...typography.caption, fontSize: 13, color: colors.gray70, lineHeight: 18, flex: 1 },
  
  // Calorie Slider
  calorieSliderContainer: { marginTop: spacing.md },
  calorieSliderLabel: { ...typography.bodyMedium, fontSize: 15, fontWeight: '600', color: colors.black, marginBottom: spacing.sm },
  calorieSliderValue: { ...typography.body, fontSize: 18, fontWeight: '600', color: colors.primary, textAlign: 'center', marginTop: spacing.sm },
  
  // Info Box
  infoBox: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#FFF5E6', borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.lg, gap: spacing.sm },
  infoText: { ...typography.caption, fontSize: 14, color: colors.gray70, lineHeight: 20, flex: 1 },
  
  buttonContainer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, paddingTop: spacing.md, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.gray20 },
});
