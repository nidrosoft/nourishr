import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, radius } from '../../../theme';
import { NourishrIcon } from '../../../components';
import { SettingSection } from './settings/SettingSection';
import { SettingOption } from './settings/SettingOption';
import { SettingToggle } from './settings/SettingToggle';
import { CuisineSlider } from './settings/CuisineSlider';
import { Toast } from './settings/Toast';

interface PlanSettingsScreenProps {
  onClose: () => void;
}

export const PlanSettingsScreen: React.FC<PlanSettingsScreenProps> = ({ onClose }) => {
  const insets = useSafeAreaInsets();
  
  // State management
  const [refreshFrequency, setRefreshFrequency] = useState('daily');
  const [includeBreakfast, setIncludeBreakfast] = useState(true);
  const [includeLunch, setIncludeLunch] = useState(true);
  const [includeDinner, setIncludeDinner] = useState(true);
  const [pantryStrictness, setPantryStrictness] = useState('balanced');
  const [showHealthier, setShowHealthier] = useState(false);
  const [hideHighSugar, setHideHighSugar] = useState(false);
  const [autoShopping, setAutoShopping] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [expiringAlerts, setExpiringAlerts] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showSuccessToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleResetPlan = () => {
    console.log('Reset meal plan');
  };

  const handleEditDiet = () => {
    console.log('Edit dietary preferences');
  };

  const handleEditAllergies = () => {
    console.log('Edit allergies');
  };

  const handleEditExcluded = () => {
    console.log('Edit excluded ingredients');
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#FF9500', '#FD6A2F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + spacing.md }]}
      >
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <NourishrIcon name="ArrowLeft" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plan Settings</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Meal Plan Refresh Frequency */}
        <SettingSection
          title="Meal Plan Refresh"
          subtitle="How often should we refresh your meal ideas?"
        >
          <SettingOption
            label="Every day"
            selected={refreshFrequency === 'daily'}
            onPress={() => {
              setRefreshFrequency('daily');
              showSuccessToast('Your changes have been updated');
            }}
          />
          <SettingOption
            label="Every 3 days"
            selected={refreshFrequency === '3days'}
            onPress={() => {
              setRefreshFrequency('3days');
              showSuccessToast('Your changes have been updated');
            }}
          />
          <SettingOption
            label="Once a week"
            selected={refreshFrequency === 'weekly'}
            onPress={() => {
              setRefreshFrequency('weekly');
              showSuccessToast('Your changes have been updated');
            }}
          />
          <SettingOption
            label="Only when I manually refresh"
            selected={refreshFrequency === 'manual'}
            onPress={() => {
              setRefreshFrequency('manual');
              showSuccessToast('Your changes have been updated');
            }}
          />
          <SettingOption
            label="Ask me each time"
            selected={refreshFrequency === 'ask'}
            onPress={() => {
              setRefreshFrequency('ask');
              showSuccessToast('Your changes have been updated');
            }}
          />
        </SettingSection>

        {/* 2. Meals to Include */}
        <SettingSection title="Meals to Include" subtitle="Which meals should appear in your plan?">
          <SettingToggle
            label="Breakfast"
            value={includeBreakfast}
            onValueChange={setIncludeBreakfast}
          />
          <SettingToggle
            label="Lunch"
            value={includeLunch}
            onValueChange={setIncludeLunch}
          />
          <SettingToggle
            label="Dinner"
            value={includeDinner}
            onValueChange={setIncludeDinner}
          />
        </SettingSection>

        {/* 3. Dietary Overview */}
        <SettingSection title="Dietary Overview" subtitle="Your diet preferences and restrictions">
          <TouchableOpacity style={styles.editRow} onPress={handleEditDiet}>
            <View style={styles.editRowLeft}>
              <Text style={styles.editRowLabel}>Diet Type</Text>
              <Text style={styles.editRowValue}>Vegetarian</Text>
            </View>
            <NourishrIcon name="ArrowRight" size={20} color={colors.gray60} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.editRow} onPress={handleEditAllergies}>
            <View style={styles.editRowLeft}>
              <Text style={styles.editRowLabel}>Allergies</Text>
              <Text style={styles.editRowValue}>Nuts, Shellfish</Text>
            </View>
            <NourishrIcon name="ArrowRight" size={20} color={colors.gray60} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.editRow} onPress={handleEditExcluded}>
            <View style={styles.editRowLeft}>
              <Text style={styles.editRowLabel}>Excluded Ingredients</Text>
              <Text style={styles.editRowValue}>Mushrooms, Olives</Text>
            </View>
            <NourishrIcon name="ArrowRight" size={20} color={colors.gray60} />
          </TouchableOpacity>
        </SettingSection>

        {/* 4. Pantry Usage Strictness */}
        <SettingSection
          title="Pantry Usage Rules"
          subtitle="How strict should recipes be about using your pantry?"
        >
          <SettingOption
            label="Strict"
            description="Only recipes using mostly what I have"
            selected={pantryStrictness === 'strict'}
            onPress={() => {
              setPantryStrictness('strict');
              showSuccessToast('Your changes have been updated');
            }}
          />
          <SettingOption
            label="Balanced"
            description="Mix of pantry + 1–2 new items"
            selected={pantryStrictness === 'balanced'}
            onPress={() => {
              setPantryStrictness('balanced');
              showSuccessToast('Your changes have been updated');
            }}
          />
          <SettingOption
            label="Flexible"
            description="Show any recipe, pantry optional"
            selected={pantryStrictness === 'flexible'}
            onPress={() => {
              setPantryStrictness('flexible');
              showSuccessToast('Your changes have been updated');
            }}
          />
          <SettingOption
            label="Surprise me"
            description="No rules, just fun meals"
            selected={pantryStrictness === 'surprise'}
            onPress={() => {
              setPantryStrictness('surprise');
              showSuccessToast('Your changes have been updated');
            }}
          />
        </SettingSection>

        {/* 5. Cuisine Preferences */}
        <SettingSection
          title="Cuisine Preferences"
          subtitle="Which cuisines should appear more often?"
        >
          <CuisineSlider label="Italian" value={0.7} />
          <CuisineSlider label="African" value={0.3} />
          <CuisineSlider label="Asian" value={0.8} />
          <CuisineSlider label="Latin" value={0.5} />
          <CuisineSlider label="American" value={0.6} />
          <CuisineSlider label="Indian" value={0.4} />
          <CuisineSlider label="Mediterranean" value={0.9} />
          <CuisineSlider label="Middle Eastern" value={0.5} />
        </SettingSection>

        {/* 6. Health & Calorie Goals */}
        <SettingSection title="Health & Calorie Goals" subtitle="Customize your nutrition preferences">
          <TouchableOpacity style={styles.editRow}>
            <View style={styles.editRowLeft}>
              <Text style={styles.editRowLabel}>Daily Calorie Target</Text>
              <Text style={styles.editRowValue}>2000 kcal</Text>
            </View>
            <NourishrIcon name="ArrowRight" size={20} color={colors.gray60} />
          </TouchableOpacity>
          
          <SettingToggle
            label="Show healthier options first"
            value={showHealthier}
            onValueChange={setShowHealthier}
          />
          <SettingToggle
            label="Hide high-sugar meals"
            value={hideHighSugar}
            onValueChange={setHideHighSugar}
          />
        </SettingSection>

        {/* 7. Shopping Automations */}
        <SettingSection title="Shopping Automations" subtitle="Manage missing ingredients">
          <SettingToggle
            label="Suggest missing items to buy"
            value={autoShopping}
            onValueChange={setAutoShopping}
          />
          <View style={styles.comingSoonRow}>
            <Text style={styles.comingSoonLabel}>Auto-generate shopping list</Text>
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>Coming Soon</Text>
            </View>
          </View>
        </SettingSection>

        {/* 8. Notifications */}
        <SettingSection title="Notifications" subtitle="Stay updated with your plan">
          <SettingToggle
            label="Remind me to check my plan"
            value={reminders}
            onValueChange={setReminders}
          />
          <SettingToggle
            label="Notify when ingredients are expiring"
            value={expiringAlerts}
            onValueChange={setExpiringAlerts}
          />
        </SettingSection>

        {/* 9. Reset Plan */}
        <View style={styles.resetSection}>
          <TouchableOpacity style={styles.resetButton} onPress={handleResetPlan}>
            <NourishrIcon name="Refresh" size={20} color="#E63946" />
            <Text style={styles.resetButtonText}>Reset Meal Plan</Text>
          </TouchableOpacity>
          <Text style={styles.resetDescription}>
            Clear current plan and regenerate from scratch
          </Text>
        </View>
      </ScrollView>
      
      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        visible={showToast}
        onHide={() => setShowToast(false)}
      />
      </View>
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
    backgroundColor: colors.white,
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
  headerTitle: {
    ...typography.h2,
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.lg,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray10,
  },
  editRowLeft: {
    flex: 1,
  },
  editRowLabel: {
    ...typography.body,
    color: colors.gray70,
    fontSize: 14,
    marginBottom: 2,
  },
  editRowValue: {
    ...typography.bodyMedium,
    color: colors.black,
    fontSize: 15,
    fontWeight: '600',
  },
  comingSoonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    opacity: 0.5,
  },
  comingSoonLabel: {
    ...typography.body,
    color: colors.gray70,
    fontSize: 14,
  },
  comingSoonBadge: {
    backgroundColor: colors.gray10,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: radius.sm,
  },
  comingSoonText: {
    ...typography.caption,
    color: colors.gray60,
    fontSize: 11,
    fontWeight: '600',
  },
  resetSection: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    backgroundColor: '#FFE5E5',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#E63946',
  },
  resetButtonText: {
    ...typography.bodyMedium,
    color: '#E63946',
    fontWeight: '600',
    fontSize: 15,
  },
  resetDescription: {
    ...typography.caption,
    color: colors.gray60,
    fontSize: 12,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
