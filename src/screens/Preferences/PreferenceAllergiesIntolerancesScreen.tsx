import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing, radius } from '../../theme';
import { NourishrIcon, PrimaryButton, PreferenceHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';

type PreferenceAllergiesIntolerancesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PreferenceAllergiesIntolerances'>;

interface PreferenceAllergiesIntolerancesScreenProps {
  navigation: PreferenceAllergiesIntolerancesScreenNavigationProp;
}

interface AllergyItem {
  id: string;
  label: string;
  severity?: 'allergic' | 'sensitive';
}

const COMMON_ALLERGENS = [
  { id: 'peanuts', label: 'Peanuts' },
  { id: 'tree-nuts', label: 'Tree nuts' },
  { id: 'dairy', label: 'Dairy' },
  { id: 'lactose', label: 'Lactose' },
  { id: 'eggs', label: 'Eggs' },
  { id: 'gluten', label: 'Gluten / Wheat' },
  { id: 'soy', label: 'Soy' },
  { id: 'shellfish', label: 'Shellfish' },
  { id: 'fish', label: 'Fish' },
  { id: 'sesame', label: 'Sesame' },
  { id: 'mustard', label: 'Mustard' },
  { id: 'sulphites', label: 'Sulphites' },
];

export const PreferenceAllergiesIntolerancesScreen: React.FC<PreferenceAllergiesIntolerancesScreenProps> = ({ navigation, route }) => {
  const gender = route.params?.gender;
  const [selectedAllergies, setSelectedAllergies] = useState<AllergyItem[]>([]);
  const [customAllergies, setCustomAllergies] = useState<AllergyItem[]>([]);
  const [showSeverityModal, setShowSeverityModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [currentAllergyId, setCurrentAllergyId] = useState<string>('');
  const [customAllergyInput, setCustomAllergyInput] = useState('');

  const isAllergySelected = (id: string) => {
    return selectedAllergies.some(a => a.id === id) || customAllergies.some(a => a.id === id);
  };

  const getAllergySeverity = (id: string) => {
    const allergy = [...selectedAllergies, ...customAllergies].find(a => a.id === id);
    return allergy?.severity;
  };

  const handleAllergyTap = (id: string, label: string) => {
    if (isAllergySelected(id)) {
      // If already selected, show severity modal
      setCurrentAllergyId(id);
      setShowSeverityModal(true);
    } else {
      // First selection, show severity modal
      setCurrentAllergyId(id);
      setShowSeverityModal(true);
    }
  };

  const handleSeveritySelect = (severity: 'allergic' | 'sensitive') => {
    const allergen = COMMON_ALLERGENS.find(a => a.id === currentAllergyId);
    const customAllergen = customAllergies.find(a => a.id === currentAllergyId);
    
    if (allergen) {
      setSelectedAllergies(prev => {
        const existing = prev.find(a => a.id === currentAllergyId);
        if (existing) {
          return prev.map(a => a.id === currentAllergyId ? { ...a, severity } : a);
        }
        return [...prev, { id: currentAllergyId, label: allergen.label, severity }];
      });
    } else if (customAllergen) {
      setCustomAllergies(prev =>
        prev.map(a => a.id === currentAllergyId ? { ...a, severity } : a)
      );
    }
    
    setShowSeverityModal(false);
  };

  const handleRemoveAllergy = (id: string) => {
    setSelectedAllergies(prev => prev.filter(a => a.id !== id));
    setCustomAllergies(prev => prev.filter(a => a.id !== id));
  };

  const addCustomAllergy = () => {
    if (customAllergyInput.trim()) {
      const id = `custom-${Date.now()}`;
      setCurrentAllergyId(id);
      setCustomAllergies(prev => [...prev, { id, label: customAllergyInput.trim() }]);
      setCustomAllergyInput('');
      setShowCustomModal(false);
      // Show severity modal for the new custom allergy
      setTimeout(() => setShowSeverityModal(true), 300);
    }
  };

  const isValid = true; // Optional screen, can skip

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <PreferenceHeader
        currentStep={4}
        totalSteps={10}
        icon="Warning2"
        onClose={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Anything you're allergic or sensitive to?</Text>
        <Text style={styles.subtitle}>
          Help us keep you safe by telling us about any allergies or food sensitivities. Tap an item to set severity.
        </Text>

        {/* Common Allergens */}
        <Text style={styles.sectionTitle}>Common allergens</Text>
        <View style={styles.chipsContainer}>
          {COMMON_ALLERGENS.map(allergen => {
            const selected = isAllergySelected(allergen.id);
            const severity = getAllergySeverity(allergen.id);
            
            return (
              <TouchableOpacity
                key={allergen.id}
                style={[
                  styles.chip,
                  selected && styles.chipSelected,
                  severity === 'allergic' && styles.chipAllergic,
                  severity === 'sensitive' && styles.chipSensitive,
                ]}
                onPress={() => handleAllergyTap(allergen.id, allergen.label)}
                onLongPress={() => selected && handleRemoveAllergy(allergen.id)}
              >
                <Text style={[
                  styles.chipLabel,
                  selected && styles.chipLabelSelected,
                ]}>
                  {allergen.label}
                </Text>
                {selected && severity && (
                  <View style={styles.severityBadge}>
                    <Text style={styles.severityBadgeText}>
                      {severity === 'allergic' ? '⚠️' : '⚡'}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Custom Allergies */}
        {customAllergies.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Custom ingredients</Text>
            <View style={styles.customAllergiesContainer}>
              {customAllergies.map(allergy => (
                <TouchableOpacity
                  key={allergy.id}
                  style={[
                    styles.customAllergyTag,
                    allergy.severity === 'allergic' && styles.customAllergyTagAllergic,
                    allergy.severity === 'sensitive' && styles.customAllergyTagSensitive,
                  ]}
                  onPress={() => {
                    setCurrentAllergyId(allergy.id);
                    setShowSeverityModal(true);
                  }}
                >
                  <Text style={styles.customAllergyText}>
                    {allergy.severity === 'allergic' ? '⚠️' : '⚡'} {allergy.label}
                  </Text>
                  <TouchableOpacity onPress={() => handleRemoveAllergy(allergy.id)}>
                    <NourishrIcon name="CloseCircle" size={18} color={colors.white} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <TouchableOpacity
          style={styles.addCustomButton}
          onPress={() => setShowCustomModal(true)}
        >
          <NourishrIcon name="Add" size={20} color={colors.primary} />
          <Text style={styles.addCustomText}>Add custom ingredient to avoid for health</Text>
        </TouchableOpacity>

        {/* Legend */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <Text style={styles.legendIcon}>⚠️</Text>
            <Text style={styles.legendText}>Allergic (avoid completely)</Text>
          </View>
          <View style={styles.legendItem}>
            <Text style={styles.legendIcon}>⚡</Text>
            <Text style={styles.legendText}>Sensitive (limit intake)</Text>
          </View>
        </View>

        {/* Info Box */}
        {(selectedAllergies.length > 0 || customAllergies.length > 0) && (
          <View style={styles.infoBox}>
            <NourishrIcon name="Shield" size={20} color={colors.error} />
            <Text style={styles.infoText}>
              We'll never recommend meals containing ingredients you're allergic to. Sensitive items will be limited.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title="Next"
          onPress={() => navigation.navigate('PreferenceDislikes', { gender })}
          disabled={!isValid}
        />
      </View>

      {/* Severity Selection Modal */}
      <Modal
        visible={showSeverityModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSeverityModal(false)}
      >
        <View style={styles.severityModalOverlay}>
          <TouchableOpacity 
            style={styles.severityModalBackdrop}
            activeOpacity={1}
            onPress={() => setShowSeverityModal(false)}
          />
          <View style={styles.severityModalContent}>
            <Text style={styles.severityModalTitle}>How severe is this?</Text>
            <Text style={styles.severityModalSubtitle}>Choose the severity level</Text>
            
            <TouchableOpacity
              style={styles.severityOption}
              onPress={() => handleSeveritySelect('allergic')}
            >
              <View style={styles.severityOptionIcon}>
                <Text style={styles.severityOptionEmoji}>⚠️</Text>
              </View>
              <View style={styles.severityOptionContent}>
                <Text style={styles.severityOptionTitle}>Allergic</Text>
                <Text style={styles.severityOptionDescription}>
                  Avoid completely - can cause serious reaction
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.severityOption}
              onPress={() => handleSeveritySelect('sensitive')}
            >
              <View style={styles.severityOptionIcon}>
                <Text style={styles.severityOptionEmoji}>⚡</Text>
              </View>
              <View style={styles.severityOptionContent}>
                <Text style={styles.severityOptionTitle}>Sensitive</Text>
                <Text style={styles.severityOptionDescription}>
                  Limit intake - causes discomfort or intolerance
                </Text>
              </View>
            </TouchableOpacity>

            {isAllergySelected(currentAllergyId) && (
              <TouchableOpacity
                style={styles.severityRemoveButton}
                onPress={() => {
                  handleRemoveAllergy(currentAllergyId);
                  setShowSeverityModal(false);
                }}
              >
                <Text style={styles.severityRemoveText}>Remove this item</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      {/* Custom Ingredient Modal */}
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
              <Text style={styles.modalTitle}>Add custom ingredient</Text>
              <TouchableOpacity onPress={() => setShowCustomModal(false)}>
                <NourishrIcon name="CloseSquare" size={24} color={colors.black} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>
              Enter an ingredient you need to avoid for health reasons
            </Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="e.g., Corn, Nightshades, MSG"
              value={customAllergyInput}
              onChangeText={setCustomAllergyInput}
              autoFocus
              onSubmitEditing={addCustomAllergy}
              returnKeyType="done"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setCustomAllergyInput('');
                  setShowCustomModal(false);
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalAddButton, !customAllergyInput.trim() && styles.modalAddButtonDisabled]}
                onPress={addCustomAllergy}
                disabled={!customAllergyInput.trim()}
              >
                <Text style={styles.modalAddText}>Add Ingredient</Text>
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
  sectionTitle: { ...typography.bodyMedium, fontSize: 18, fontWeight: '600', color: colors.black, marginTop: spacing.lg, marginBottom: spacing.md },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderWidth: 2, borderColor: colors.gray20, borderRadius: radius.full, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, gap: spacing.xs },
  chipSelected: { borderColor: colors.primary, backgroundColor: '#FFF5E6' },
  chipAllergic: { borderColor: colors.error, backgroundColor: '#FFE5E5' },
  chipSensitive: { borderColor: '#FFA500', backgroundColor: '#FFF5E6' },
  chipLabel: { ...typography.body, fontSize: 15, fontWeight: '500', color: colors.black },
  chipLabelSelected: { fontWeight: '600' },
  severityBadge: { marginLeft: spacing.xs },
  severityBadgeText: { fontSize: 14 },
  customAllergiesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  customAllergyTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, borderRadius: radius.full, paddingVertical: spacing.xs, paddingLeft: spacing.md, paddingRight: spacing.sm, gap: spacing.xs },
  customAllergyTagAllergic: { backgroundColor: colors.error },
  customAllergyTagSensitive: { backgroundColor: '#FFA500' },
  customAllergyText: { ...typography.body, fontSize: 14, fontWeight: '500', color: colors.white },
  addCustomButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white, borderWidth: 2, borderColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, gap: spacing.sm, borderStyle: 'dashed', marginTop: spacing.md },
  addCustomText: { ...typography.bodyMedium, fontSize: 15, fontWeight: '600', color: colors.primary },
  legendContainer: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.lg, marginBottom: spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  legendIcon: { fontSize: 16 },
  legendText: { ...typography.caption, fontSize: 13, color: colors.gray60 },
  infoBox: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#FFE5E5', borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.md, marginBottom: spacing.xl, gap: spacing.sm },
  infoText: { ...typography.caption, fontSize: 14, color: colors.gray70, lineHeight: 20, flex: 1 },
  buttonContainer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, paddingTop: spacing.md, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.gray20 },
  
  // Severity Modal
  severityModalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  severityModalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  severityModalContent: { backgroundColor: colors.white, borderRadius: radius.xl, padding: spacing.xl, marginHorizontal: spacing.lg, width: '85%', maxWidth: 400 },
  severityModalTitle: { ...typography.headingLG, fontSize: 24, fontWeight: '700', color: colors.black, marginBottom: spacing.xs, textAlign: 'center' },
  severityModalSubtitle: { ...typography.body, fontSize: 15, color: colors.gray60, marginBottom: spacing.lg, textAlign: 'center' },
  severityOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.gray10, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm },
  severityOptionIcon: { width: 48, height: 48, borderRadius: radius.md, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  severityOptionEmoji: { fontSize: 24 },
  severityOptionContent: { flex: 1 },
  severityOptionTitle: { ...typography.bodyMedium, fontSize: 16, fontWeight: '600', color: colors.black, marginBottom: 2 },
  severityOptionDescription: { ...typography.caption, fontSize: 13, color: colors.gray60, lineHeight: 18 },
  severityRemoveButton: { marginTop: spacing.md, paddingVertical: spacing.sm, alignItems: 'center' },
  severityRemoveText: { ...typography.bodyMedium, fontSize: 15, fontWeight: '600', color: colors.error },
  
  // Custom Ingredient Modal
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
