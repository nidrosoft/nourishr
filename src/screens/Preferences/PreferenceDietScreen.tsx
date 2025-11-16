import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing, radius } from '../../theme';
import { NourishrIcon, PrimaryButton, PreferenceHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { preferencesService } from '../../services';

type PreferenceDietScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PreferenceDiet'>;

interface PreferenceDietScreenProps {
  navigation: PreferenceDietScreenNavigationProp;
}

const DIET_PATTERNS = [
  { id: 'none', label: 'No specific diet' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'pescatarian', label: 'Pescatarian' },
  { id: 'flexitarian', label: 'Flexitarian' },
  { id: 'keto', label: 'Keto' },
  { id: 'low-carb', label: 'Low-carb' },
  { id: 'low-fat', label: 'Low-fat' },
  { id: 'mediterranean', label: 'Mediterranean' },
  { id: 'high-protein', label: 'High-protein' },
  { id: 'paleo', label: 'Paleo' },
  { id: 'whole30', label: 'Whole30' },
];

const RELIGIOUS_RULES = [
  { id: 'halal', label: 'Halal' },
  { id: 'kosher', label: 'Kosher' },
  { id: 'no-pork', label: 'No pork' },
  { id: 'no-beef', label: 'No beef' },
  { id: 'no-alcohol', label: 'No alcohol' },
  { id: 'no-shellfish', label: 'No shellfish' },
];

export const PreferenceDietScreen: React.FC<PreferenceDietScreenProps> = ({ navigation, route }) => {
  const gender = route.params?.gender;
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [customRules, setCustomRules] = useState<string[]>([]);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customRuleInput, setCustomRuleInput] = useState('');
  const [showReligiousSection, setShowReligiousSection] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleDiet = (id: string) => {
    setSelectedDiets(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleRule = (id: string) => {
    setSelectedRules(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const addCustomRule = () => {
    if (customRuleInput.trim()) {
      setCustomRules(prev => [...prev, customRuleInput.trim()]);
      setCustomRuleInput('');
      setShowCustomModal(false);
    }
  };

  const removeCustomRule = (rule: string) => {
    setCustomRules(prev => prev.filter(item => item !== rule));
  };

  const isValid = selectedDiets.length > 0;

  const handleNext = async () => {
    if (!isValid) return;

    setLoading(true);
    try {
      await preferencesService.saveDiet({
        dietPatterns: selectedDiets,
        religiousDietaryRules: selectedRules,
        customDietaryRules: customRules,
      });

      console.log('Diet data saved successfully');
      navigation.navigate('PreferenceAllergiesIntolerances', { gender });
    } catch (error: any) {
      console.error('Failed to save diet:', error);
      alert(`Failed to save: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <PreferenceHeader
        currentStep={3}
        totalSteps={10}
        icon="Health"
        onClose={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>How do you eat?</Text>
        <Text style={styles.subtitle}>
          Tell us about your dietary preferences and any rules you follow. This helps us recommend meals that fit your lifestyle.
        </Text>

        {/* Primary Diet Pattern */}
        <Text style={styles.sectionTitle}>Primary diet pattern</Text>
        <Text style={styles.sectionSubtitle}>Select all that apply to you</Text>
        <View style={styles.chipsContainer}>
          {DIET_PATTERNS.map(diet => (
            <TouchableOpacity
              key={diet.id}
              style={[styles.chip, selectedDiets.includes(diet.id) && styles.chipSelected]}
              onPress={() => toggleDiet(diet.id)}
            >
              <Text style={[styles.chipLabel, selectedDiets.includes(diet.id) && styles.chipLabelSelected]}>
                {diet.label}
              </Text>
              {selectedDiets.includes(diet.id) && (
                <View style={styles.chipCheckmark}>
                  <NourishrIcon name="TickCircle" size={16} color={colors.primary} variant="bold" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Religious / Ethical Rules Toggle */}
        <TouchableOpacity
          style={styles.toggleSection}
          onPress={() => setShowReligiousSection(!showReligiousSection)}
        >
          <View style={styles.toggleHeader}>
            <NourishrIcon 
              name="Book" 
              size={20} 
              color={colors.black} 
              variant="bold" 
            />
            <Text style={styles.toggleTitle}>Religious / Ethical rules</Text>
          </View>
          <NourishrIcon 
            name={showReligiousSection ? "ArrowUp2" : "ArrowDown2"} 
            size={20} 
            color={colors.gray60} 
          />
        </TouchableOpacity>

        {showReligiousSection && (
          <View style={styles.expandedSection}>
            <Text style={styles.sectionSubtitle}>Select any dietary laws or ethical rules you follow</Text>
            <View style={styles.chipsContainer}>
              {RELIGIOUS_RULES.map(rule => (
                <TouchableOpacity
                  key={rule.id}
                  style={[styles.chip, selectedRules.includes(rule.id) && styles.chipSelected]}
                  onPress={() => toggleRule(rule.id)}
                >
                  <Text style={[styles.chipLabel, selectedRules.includes(rule.id) && styles.chipLabelSelected]}>
                    {rule.label}
                  </Text>
                  {selectedRules.includes(rule.id) && (
                    <View style={styles.chipCheckmark}>
                      <NourishrIcon name="TickCircle" size={16} color={colors.primary} variant="bold" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Custom Rules */}
        <View style={styles.customRulesSection}>
          <Text style={styles.sectionTitle}>Custom dietary rules</Text>
          <Text style={styles.sectionSubtitle}>Add any specific foods or ingredients you avoid</Text>
          
          {customRules.length > 0 && (
            <View style={styles.customRulesContainer}>
              {customRules.map((rule, index) => (
                <View key={index} style={styles.customRuleTag}>
                  <Text style={styles.customRuleText}>{rule}</Text>
                  <TouchableOpacity onPress={() => removeCustomRule(rule)}>
                    <NourishrIcon name="CloseCircle" size={18} color={colors.gray60} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.addCustomButton}
            onPress={() => setShowCustomModal(true)}
          >
            <NourishrIcon name="Add" size={20} color={colors.primary} />
            <Text style={styles.addCustomText}>Add custom rule</Text>
          </TouchableOpacity>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <NourishrIcon name="InfoCircle" size={20} color={colors.primary} />
          <Text style={styles.infoText}>
            These rules are hard constraints - we'll never recommend meals that violate them.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title={loading ? "Saving..." : "Next"}
          onPress={handleNext}
          disabled={!isValid || loading}
        />
      </View>

      {/* Custom Rule Modal */}
      <Modal
        visible={showCustomModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCustomModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={() => setShowCustomModal(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add custom rule</Text>
              <TouchableOpacity onPress={() => setShowCustomModal(false)}>
                <NourishrIcon name="CloseSquare" size={24} color={colors.black} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>
              Enter a food or ingredient you want to avoid
            </Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="e.g., No red meat, No fried food"
              value={customRuleInput}
              onChangeText={setCustomRuleInput}
              autoFocus
              onSubmitEditing={addCustomRule}
              returnKeyType="done"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setCustomRuleInput('');
                  setShowCustomModal(false);
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalAddButton, !customRuleInput.trim() && styles.modalAddButtonDisabled]}
                onPress={addCustomRule}
                disabled={!customRuleInput.trim()}
              >
                <Text style={styles.modalAddText}>Add Rule</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  content: { flex: 1, paddingHorizontal: spacing.lg },
  title: { ...typography.headingXL, fontSize: 32, fontWeight: '700', color: colors.black, marginBottom: spacing.sm },
  subtitle: { ...typography.body, fontSize: 16, color: colors.gray60, marginBottom: spacing.xl, lineHeight: 22 },
  sectionTitle: { ...typography.bodyMedium, fontSize: 18, fontWeight: '600', color: colors.black, marginTop: spacing.lg, marginBottom: spacing.sm },
  sectionSubtitle: { ...typography.caption, fontSize: 14, color: colors.gray60, marginBottom: spacing.md },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderWidth: 2, borderColor: colors.gray20, borderRadius: radius.full, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, gap: spacing.xs },
  chipSelected: { borderColor: colors.primary, backgroundColor: '#FFF5E6' },
  chipLabel: { ...typography.body, fontSize: 15, fontWeight: '500', color: colors.black },
  chipLabelSelected: { color: colors.primary, fontWeight: '600' },
  chipCheckmark: { marginLeft: spacing.xs },
  toggleSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.gray10, borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.lg, marginBottom: spacing.sm },
  toggleHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  toggleTitle: { ...typography.bodyMedium, fontSize: 16, fontWeight: '600', color: colors.black },
  expandedSection: { marginBottom: spacing.md },
  customRulesSection: { marginTop: spacing.lg, marginBottom: spacing.md },
  customRulesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  customRuleTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, borderRadius: radius.full, paddingVertical: spacing.xs, paddingLeft: spacing.md, paddingRight: spacing.sm, gap: spacing.xs },
  customRuleText: { ...typography.body, fontSize: 14, fontWeight: '500', color: colors.white },
  addCustomButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white, borderWidth: 2, borderColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, gap: spacing.sm, borderStyle: 'dashed' },
  addCustomText: { ...typography.bodyMedium, fontSize: 15, fontWeight: '600', color: colors.primary },
  infoBox: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#FFF5E6', borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.lg, marginBottom: spacing.xl, gap: spacing.sm },
  infoText: { ...typography.caption, fontSize: 14, color: colors.gray70, lineHeight: 20, flex: 1 },
  buttonContainer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, paddingTop: spacing.md, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.gray20 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { backgroundColor: colors.white, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing.xl, paddingBottom: spacing.xxl },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  modalTitle: { ...typography.headingLG, fontSize: 24, fontWeight: '700', color: colors.black },
  modalSubtitle: { ...typography.body, fontSize: 15, color: colors.gray60, marginBottom: spacing.lg },
  modalInput: { ...typography.body, fontSize: 16, backgroundColor: colors.gray10, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.lg, minHeight: 48 },
  modalButtons: { flexDirection: 'row', gap: spacing.md },
  modalCancelButton: { flex: 1, backgroundColor: colors.gray10, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center' },
  modalCancelText: { ...typography.bodyMedium, fontSize: 16, fontWeight: '600', color: colors.black },
  modalAddButton: { flex: 1, backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center' },
  modalAddButtonDisabled: { backgroundColor: colors.gray30 },
  modalAddText: { ...typography.bodyMedium, fontSize: 16, fontWeight: '600', color: colors.white },
});
