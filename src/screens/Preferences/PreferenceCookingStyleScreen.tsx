import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Slider from '@react-native-community/slider';
import { colors, typography, spacing, radius } from '../../theme';
import { NourishrIcon, PrimaryButton, PreferenceHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';

type PreferenceCookingStyleScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PreferenceCookingStyle'>;

interface PreferenceCookingStyleScreenProps {
  navigation: PreferenceCookingStyleScreenNavigationProp;
}

const SKILL_LEVELS = [
  { id: 'beginner', label: 'Beginner', description: 'Just starting out' },
  { id: 'comfortable', label: 'Comfortable', description: 'Know the basics' },
  { id: 'pro', label: 'Pro home cook', description: 'Confident in kitchen' },
];

const TIME_OPTIONS = ['10 min', '20 min', '30 min', '45+ min'];

const EQUIPMENT_OPTIONS = [
  { id: 'oven', label: 'Oven' },
  { id: 'stovetop', label: 'Stovetop' },
  { id: 'microwave', label: 'Microwave' },
  { id: 'air-fryer', label: 'Air fryer' },
  { id: 'instant-pot', label: 'Instant Pot/Pressure cooker' },
  { id: 'slow-cooker', label: 'Slow cooker' },
  { id: 'blender', label: 'Blender' },
  { id: 'grill', label: 'Grill' },
];

const PREP_TOLERANCE = [
  { id: 'minimal', label: 'Minimal prep', description: 'Quick & easy' },
  { id: 'okay', label: 'Okay with chopping', description: 'Some prep work' },
  { id: 'love', label: 'Love long recipes', description: 'Enjoy the process' },
];

export const PreferenceCookingStyleScreen: React.FC<PreferenceCookingStyleScreenProps> = ({ navigation, route }) => {
  const gender = route.params?.gender;
  const [skillLevel, setSkillLevel] = useState<string>('');
  const [timePerMeal, setTimePerMeal] = useState(1); // 0=10min, 1=20min, 2=30min, 3=45+min
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [customEquipment, setCustomEquipment] = useState<string[]>([]);
  const [prepTolerance, setPrepTolerance] = useState<string>('');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customEquipmentInput, setCustomEquipmentInput] = useState('');

  const [showSkillSection, setShowSkillSection] = useState(true);
  const [showTimeSection, setShowTimeSection] = useState(true);
  const [showEquipmentSection, setShowEquipmentSection] = useState(true);
  const [showPrepSection, setShowPrepSection] = useState(true);

  const toggleEquipment = (id: string) => {
    setSelectedEquipment(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const addCustomEquipment = () => {
    if (customEquipmentInput.trim()) {
      setCustomEquipment(prev => [...prev, customEquipmentInput.trim()]);
      setCustomEquipmentInput('');
      setShowCustomModal(false);
    }
  };

  const removeCustomEquipment = (equipment: string) => {
    setCustomEquipment(prev => prev.filter(item => item !== equipment));
  };

  const isValid = skillLevel !== '' && selectedEquipment.length > 0 && prepTolerance !== '';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <PreferenceHeader
        currentStep={7}
        totalSteps={10}
        icon="Setting"
        onClose={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Let's talk about your cooking</Text>
        <Text style={styles.subtitle}>
          Help us recommend recipes that match your skills, time, and kitchen setup. This ensures every suggestion is realistic for you.
        </Text>

        {/* Section 1: Skill Level */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setShowSkillSection(!showSkillSection)}
        >
          <View style={styles.sectionHeaderLeft}>
            <NourishrIcon name="Award" size={20} color={colors.black} variant="bold" />
            <Text style={styles.sectionTitle}>Skill level</Text>
          </View>
          <NourishrIcon 
            name={showSkillSection ? "ArrowUp2" : "ArrowDown2"} 
            size={20} 
            color={colors.gray60} 
          />
        </TouchableOpacity>

        {showSkillSection && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionSubtitle}>How would you describe your cooking experience?</Text>
            <View style={styles.skillCardsContainer}>
              {SKILL_LEVELS.map(skill => (
                <TouchableOpacity
                  key={skill.id}
                  style={[styles.skillCard, skillLevel === skill.id && styles.skillCardSelected]}
                  onPress={() => setSkillLevel(skill.id)}
                >
                  <Text style={[styles.skillCardLabel, skillLevel === skill.id && styles.skillCardLabelSelected]}>
                    {skill.label}
                  </Text>
                  <Text style={[styles.skillCardDescription, skillLevel === skill.id && styles.skillCardDescriptionSelected]}>
                    {skill.description}
                  </Text>
                  {skillLevel === skill.id && (
                    <View style={styles.skillCardCheckmark}>
                      <NourishrIcon name="TickCircle" size={20} color={colors.primary} variant="bold" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Section 2: Time per Meal */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setShowTimeSection(!showTimeSection)}
        >
          <View style={styles.sectionHeaderLeft}>
            <NourishrIcon name="Clock" size={20} color={colors.black} variant="bold" />
            <Text style={styles.sectionTitle}>Time per meal (weekdays)</Text>
          </View>
          <NourishrIcon 
            name={showTimeSection ? "ArrowUp2" : "ArrowDown2"} 
            size={20} 
            color={colors.gray60} 
          />
        </TouchableOpacity>

        {showTimeSection && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionSubtitle}>How much time do you typically have for cooking?</Text>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={3}
                step={1}
                value={timePerMeal}
                onValueChange={setTimePerMeal}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.gray20}
                thumbTintColor={colors.primary}
              />
              <Text style={styles.sliderValue}>{TIME_OPTIONS[timePerMeal]}</Text>
            </View>
          </View>
        )}

        {/* Section 3: Available Equipment */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setShowEquipmentSection(!showEquipmentSection)}
        >
          <View style={styles.sectionHeaderLeft}>
            <NourishrIcon name="Category" size={20} color={colors.black} variant="bold" />
            <Text style={styles.sectionTitle}>Available equipment</Text>
          </View>
          <NourishrIcon 
            name={showEquipmentSection ? "ArrowUp2" : "ArrowDown2"} 
            size={20} 
            color={colors.gray60} 
          />
        </TouchableOpacity>

        {showEquipmentSection && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionSubtitle}>Select all kitchen equipment you have access to</Text>
            <View style={styles.chipsContainer}>
              {EQUIPMENT_OPTIONS.map(equipment => (
                <TouchableOpacity
                  key={equipment.id}
                  style={[styles.chip, selectedEquipment.includes(equipment.id) && styles.chipSelected]}
                  onPress={() => toggleEquipment(equipment.id)}
                >
                  <Text style={[styles.chipLabel, selectedEquipment.includes(equipment.id) && styles.chipLabelSelected]}>
                    {equipment.label}
                  </Text>
                  {selectedEquipment.includes(equipment.id) && (
                    <View style={styles.chipCheckmark}>
                      <NourishrIcon name="TickCircle" size={16} color={colors.primary} variant="bold" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {customEquipment.length > 0 && (
              <View style={styles.customEquipmentContainer}>
                {customEquipment.map((equipment, index) => (
                  <View key={index} style={styles.customEquipmentTag}>
                    <Text style={styles.customEquipmentText}>{equipment}</Text>
                    <TouchableOpacity onPress={() => removeCustomEquipment(equipment)}>
                      <NourishrIcon name="CloseCircle" size={18} color={colors.white} />
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
              <Text style={styles.addCustomText}>Add custom equipment</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Section 4: Prep Tolerance */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setShowPrepSection(!showPrepSection)}
        >
          <View style={styles.sectionHeaderLeft}>
            <NourishrIcon name="Timer" size={20} color={colors.black} variant="bold" />
            <Text style={styles.sectionTitle}>Prep tolerance</Text>
          </View>
          <NourishrIcon 
            name={showPrepSection ? "ArrowUp2" : "ArrowDown2"} 
            size={20} 
            color={colors.gray60} 
          />
        </TouchableOpacity>

        {showPrepSection && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionSubtitle}>How much prep work are you comfortable with?</Text>
            <View style={styles.prepCardsContainer}>
              {PREP_TOLERANCE.map(prep => (
                <TouchableOpacity
                  key={prep.id}
                  style={[styles.prepCard, prepTolerance === prep.id && styles.prepCardSelected]}
                  onPress={() => setPrepTolerance(prep.id)}
                >
                  <Text style={[styles.prepCardLabel, prepTolerance === prep.id && styles.prepCardLabelSelected]}>
                    {prep.label}
                  </Text>
                  <Text style={[styles.prepCardDescription, prepTolerance === prep.id && styles.prepCardDescriptionSelected]}>
                    {prep.description}
                  </Text>
                  {prepTolerance === prep.id && (
                    <View style={styles.prepCardCheckmark}>
                      <NourishrIcon name="TickCircle" size={20} color={colors.primary} variant="bold" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Info Box */}
        {isValid && (
          <View style={styles.infoBox}>
            <NourishrIcon name="InfoCircle" size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              We'll only suggest recipes that match your skill level, time constraints, and available equipment.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title="Next"
          onPress={() => navigation.navigate('PreferenceLifestyle', { gender })}
          disabled={!isValid}
        />
      </View>

      {/* Custom Equipment Modal */}
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
              <Text style={styles.modalTitle}>Add custom equipment</Text>
              <TouchableOpacity onPress={() => setShowCustomModal(false)}>
                <NourishrIcon name="CloseSquare" size={24} color={colors.black} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>
              Enter kitchen equipment you have (e.g., Food processor, Wok)
            </Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="e.g., Food processor, Wok, Rice cooker"
              value={customEquipmentInput}
              onChangeText={setCustomEquipmentInput}
              autoFocus
              onSubmitEditing={addCustomEquipment}
              returnKeyType="done"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setCustomEquipmentInput('');
                  setShowCustomModal(false);
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalAddButton, !customEquipmentInput.trim() && styles.modalAddButtonDisabled]}
                onPress={addCustomEquipment}
                disabled={!customEquipmentInput.trim()}
              >
                <Text style={styles.modalAddText}>Add Equipment</Text>
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
  
  // Section Header
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.gray10, borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.lg, marginBottom: spacing.sm },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  sectionTitle: { ...typography.bodyMedium, fontSize: 18, fontWeight: '600', color: colors.black },
  sectionContent: { marginBottom: spacing.md },
  sectionSubtitle: { ...typography.caption, fontSize: 14, color: colors.gray60, marginBottom: spacing.md },
  
  // Skill Cards
  skillCardsContainer: { gap: spacing.sm },
  skillCard: { backgroundColor: colors.white, borderWidth: 2, borderColor: colors.gray20, borderRadius: radius.lg, padding: spacing.md, position: 'relative' },
  skillCardSelected: { borderColor: colors.primary, backgroundColor: '#FFF5E6' },
  skillCardLabel: { ...typography.bodyMedium, fontSize: 16, fontWeight: '600', color: colors.black, marginBottom: 2 },
  skillCardLabelSelected: { color: colors.primary },
  skillCardDescription: { ...typography.caption, fontSize: 14, color: colors.gray60 },
  skillCardDescriptionSelected: { color: colors.primary },
  skillCardCheckmark: { position: 'absolute', top: spacing.md, right: spacing.md },
  
  // Time Slider
  sliderContainer: { marginBottom: spacing.md },
  slider: { width: '100%', height: 40 },
  sliderValue: { ...typography.body, fontSize: 18, fontWeight: '600', color: colors.primary, textAlign: 'center', marginTop: spacing.sm },
  
  // Equipment Chips
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderWidth: 2, borderColor: colors.gray20, borderRadius: radius.full, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, gap: spacing.xs },
  chipSelected: { borderColor: colors.primary, backgroundColor: '#FFF5E6' },
  chipLabel: { ...typography.body, fontSize: 15, fontWeight: '500', color: colors.black },
  chipLabelSelected: { color: colors.primary, fontWeight: '600' },
  chipCheckmark: { marginLeft: spacing.xs },
  
  // Custom Equipment
  customEquipmentContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  customEquipmentTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, borderRadius: radius.full, paddingVertical: spacing.xs, paddingLeft: spacing.md, paddingRight: spacing.sm, gap: spacing.xs },
  customEquipmentText: { ...typography.body, fontSize: 14, fontWeight: '500', color: colors.white },
  addCustomButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white, borderWidth: 2, borderColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, gap: spacing.sm, borderStyle: 'dashed' },
  addCustomText: { ...typography.bodyMedium, fontSize: 15, fontWeight: '600', color: colors.primary },
  
  // Prep Cards
  prepCardsContainer: { gap: spacing.sm },
  prepCard: { backgroundColor: colors.white, borderWidth: 2, borderColor: colors.gray20, borderRadius: radius.lg, padding: spacing.md, position: 'relative' },
  prepCardSelected: { borderColor: colors.primary, backgroundColor: '#FFF5E6' },
  prepCardLabel: { ...typography.bodyMedium, fontSize: 16, fontWeight: '600', color: colors.black, marginBottom: 2 },
  prepCardLabelSelected: { color: colors.primary },
  prepCardDescription: { ...typography.caption, fontSize: 14, color: colors.gray60 },
  prepCardDescriptionSelected: { color: colors.primary },
  prepCardCheckmark: { position: 'absolute', top: spacing.md, right: spacing.md },
  
  // Info Box
  infoBox: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#FFF5E6', borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.lg, marginBottom: spacing.xl, gap: spacing.sm },
  infoText: { ...typography.caption, fontSize: 14, color: colors.gray70, lineHeight: 20, flex: 1 },
  buttonContainer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, paddingTop: spacing.md, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.gray20 },
  
  // Custom Equipment Modal
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
