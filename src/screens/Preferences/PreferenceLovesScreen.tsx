import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Slider from '@react-native-community/slider';
import { colors, typography, spacing, radius } from '../../theme';
import { NourishrIcon, PrimaryButton, PreferenceHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { preferencesService } from '../../services';

type PreferenceLovesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PreferenceLoves'>;

interface PreferenceLovesScreenProps {
  navigation: PreferenceLovesScreenNavigationProp;
}

const FAVORITE_CUISINES = [
  { id: 'italian', label: 'Italian' },
  { id: 'mexican', label: 'Mexican' },
  { id: 'american', label: 'American' },
  { id: 'french', label: 'French' },
  { id: 'mediterranean', label: 'Mediterranean' },
  { id: 'indian', label: 'Indian' },
  { id: 'chinese', label: 'Chinese' },
  { id: 'japanese', label: 'Japanese' },
  { id: 'korean', label: 'Korean' },
  { id: 'thai', label: 'Thai' },
  { id: 'middle-eastern', label: 'Middle Eastern' },
  { id: 'african', label: 'African' },
  { id: 'caribbean', label: 'Caribbean' },
  { id: 'latin', label: 'Latin' },
  { id: 'other', label: 'Other' },
];

const MEAL_TYPES = [
  { id: 'bowl', label: 'Bowl' },
  { id: 'salad', label: 'Salad' },
  { id: 'burger', label: 'Burger' },
  { id: 'pasta', label: 'Pasta' },
  { id: 'wrap-taco', label: 'Wrap/Taco' },
  { id: 'soup', label: 'Soup' },
  { id: 'stir-fry', label: 'Stir-fry' },
  { id: 'curries', label: 'Curries' },
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'desserts', label: 'Desserts' },
];

const FAVORITE_INGREDIENTS = [
  { id: 'garlic', label: 'Garlic' },
  { id: 'cheese', label: 'Cheese' },
  { id: 'avocado', label: 'Avocado' },
  { id: 'bacon', label: 'Bacon' },
  { id: 'chicken', label: 'Chicken' },
  { id: 'beef', label: 'Beef' },
  { id: 'seafood', label: 'Seafood' },
  { id: 'eggs', label: 'Eggs' },
  { id: 'tomatoes', label: 'Tomatoes' },
  { id: 'pasta', label: 'Pasta' },
  { id: 'rice', label: 'Rice' },
  { id: 'potatoes', label: 'Potatoes' },
  { id: 'herbs', label: 'Fresh herbs' },
  { id: 'spices', label: 'Spices' },
  { id: 'chocolate', label: 'Chocolate' },
  { id: 'nuts', label: 'Nuts' },
];

const SPICE_LEVELS = ['Mild', 'Medium', 'Spicy', 'Very spicy'];

export const PreferenceLovesScreen: React.FC<PreferenceLovesScreenProps> = ({ navigation, route }) => {
  const gender = route.params?.gender;
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [customCuisines, setCustomCuisines] = useState<string[]>([]);
  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>([]);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customCuisineInput, setCustomCuisineInput] = useState('');
  const [loveNotes, setLoveNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Flavor profile sliders (0-3 for spice, 0-1 for others)
  const [spiceLevel, setSpiceLevel] = useState(1); // 0=Mild, 1=Medium, 2=Spicy, 3=Very spicy
  const [sweetSavory, setSweetSavory] = useState(0.3); // 0=More savory, 1=More sweet
  const [comfortExperimental, setComfortExperimental] = useState(0.5); // 0=Classic, 1=Adventurous

  const [showCuisineSection, setShowCuisineSection] = useState(true);
  const [showIngredientsSection, setShowIngredientsSection] = useState(true);
  const [showFlavorSection, setShowFlavorSection] = useState(true);
  const [showMealTypeSection, setShowMealTypeSection] = useState(true);

  const toggleCuisine = (id: string) => {
    setSelectedCuisines(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleIngredient = (id: string) => {
    setSelectedIngredients(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleMealType = (id: string) => {
    setSelectedMealTypes(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const addCustomCuisine = () => {
    if (customCuisineInput.trim()) {
      setCustomCuisines(prev => [...prev, customCuisineInput.trim()]);
      setCustomCuisineInput('');
      setShowCustomModal(false);
    }
  };

  const removeCustomCuisine = (cuisine: string) => {
    setCustomCuisines(prev => prev.filter(item => item !== cuisine));
  };

  const isValid = selectedCuisines.length > 0 || customCuisines.length > 0 || selectedMealTypes.length > 0;

  const handleNext = async () => {
    if (!isValid) return;

    setLoading(true);
    try {
      // Build flavor profile data from sliders
      const flavorProfile = {
        spiceLevel: SPICE_LEVELS[spiceLevel], // Convert index to label: "Mild", "Medium", "Spicy", "Very spicy"
        sweetSavory: Math.round(sweetSavory * 100), // Convert 0-1 to 0-100 percentage
        comfortExperimental: Math.round(comfortExperimental * 100), // Convert 0-1 to 0-100 percentage
      };

      await preferencesService.saveLoves({
        lovedIngredients: selectedIngredients,
        lovedCuisines: [...selectedCuisines, ...customCuisines],
        lovedFlavors: [
          `Spice: ${flavorProfile.spiceLevel}`,
          `Sweet/Savory: ${flavorProfile.sweetSavory}% sweet`,
          `Comfort/Experimental: ${flavorProfile.comfortExperimental}% adventurous`,
        ],
        loveNotes: loveNotes || undefined,
      });

      console.log('Loves data saved successfully:', flavorProfile);
      navigation.navigate('PreferenceCookingStyle', { gender });
    } catch (error: any) {
      console.error('Failed to save loves:', error);
      alert(`Failed to save: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <PreferenceHeader
        currentStep={6}
        totalSteps={10}
        icon="Heart"
        onClose={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>What gets you excited to eat?</Text>
        <Text style={styles.subtitle}>
          Tell us what you love! Your favorite cuisines, flavors, and meal types help us recommend dishes you'll enjoy.
        </Text>

        {/* Section 1: Favorite Cuisines */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setShowCuisineSection(!showCuisineSection)}
        >
          <View style={styles.sectionHeaderLeft}>
            <NourishrIcon name="Global" size={20} color={colors.black} variant="bold" />
            <Text style={styles.sectionTitle}>Favorite cuisines</Text>
          </View>
          <NourishrIcon 
            name={showCuisineSection ? "ArrowUp2" : "ArrowDown2"} 
            size={20} 
            color={colors.gray60} 
          />
        </TouchableOpacity>

        {showCuisineSection && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionSubtitle}>Select all cuisines you enjoy</Text>
            <View style={styles.chipsContainer}>
              {FAVORITE_CUISINES.map(cuisine => (
                <TouchableOpacity
                  key={cuisine.id}
                  style={[styles.chip, selectedCuisines.includes(cuisine.id) && styles.chipSelected]}
                  onPress={() => toggleCuisine(cuisine.id)}
                >
                  <Text style={[styles.chipLabel, selectedCuisines.includes(cuisine.id) && styles.chipLabelSelected]}>
                    {cuisine.label}
                  </Text>
                  {selectedCuisines.includes(cuisine.id) && (
                    <View style={styles.chipCheckmark}>
                      <NourishrIcon name="TickCircle" size={16} color={colors.primary} variant="bold" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {customCuisines.length > 0 && (
              <View style={styles.customCuisinesContainer}>
                {customCuisines.map((cuisine, index) => (
                  <View key={index} style={styles.customCuisineTag}>
                    <Text style={styles.customCuisineText}>{cuisine}</Text>
                    <TouchableOpacity onPress={() => removeCustomCuisine(cuisine)}>
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
              <Text style={styles.addCustomText}>Add custom cuisine</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Section 2: Favorite Ingredients */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setShowIngredientsSection(!showIngredientsSection)}
        >
          <View style={styles.sectionHeaderLeft}>
            <NourishrIcon name="Cup" size={20} color={colors.black} variant="bold" />
            <Text style={styles.sectionTitle}>Favorite ingredients</Text>
          </View>
          <NourishrIcon 
            name={showIngredientsSection ? "ArrowUp2" : "ArrowDown2"} 
            size={20} 
            color={colors.gray60} 
          />
        </TouchableOpacity>

        {showIngredientsSection && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionSubtitle}>Select ingredients you love</Text>
            <View style={styles.chipsContainer}>
              {FAVORITE_INGREDIENTS.map(ingredient => (
                <TouchableOpacity
                  key={ingredient.id}
                  style={[styles.chip, selectedIngredients.includes(ingredient.id) && styles.chipSelected]}
                  onPress={() => toggleIngredient(ingredient.id)}
                >
                  <Text style={[styles.chipLabel, selectedIngredients.includes(ingredient.id) && styles.chipLabelSelected]}>
                    {ingredient.label}
                  </Text>
                  {selectedIngredients.includes(ingredient.id) && (
                    <View style={styles.chipCheckmark}>
                      <NourishrIcon name="TickCircle" size={16} color={colors.primary} variant="bold" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Section 3: Flavor Profile */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setShowFlavorSection(!showFlavorSection)}
        >
          <View style={styles.sectionHeaderLeft}>
            <NourishrIcon name="Star" size={20} color={colors.black} variant="bold" />
            <Text style={styles.sectionTitle}>Flavor profile</Text>
          </View>
          <NourishrIcon 
            name={showFlavorSection ? "ArrowUp2" : "ArrowDown2"} 
            size={20} 
            color={colors.gray60} 
          />
        </TouchableOpacity>

        {showFlavorSection && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionSubtitle}>Adjust sliders to match your taste preferences</Text>
            
            {/* Spice Level */}
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Spice level</Text>
              <View style={styles.sliderRow}>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={3}
                  step={1}
                  value={spiceLevel}
                  onValueChange={setSpiceLevel}
                  minimumTrackTintColor={colors.primary}
                  maximumTrackTintColor={colors.gray20}
                  thumbTintColor={colors.primary}
                />
              </View>
              <Text style={styles.sliderValue}>{SPICE_LEVELS[spiceLevel]}</Text>
            </View>

            {/* Sweet vs Savory */}
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Sweet vs savory</Text>
              <View style={styles.sliderRow}>
                <Text style={styles.sliderEndLabel}>More savory</Text>
                <Slider
                  style={styles.sliderFlex}
                  minimumValue={0}
                  maximumValue={1}
                  value={sweetSavory}
                  onValueChange={setSweetSavory}
                  minimumTrackTintColor={colors.primary}
                  maximumTrackTintColor={colors.gray20}
                  thumbTintColor={colors.primary}
                />
                <Text style={styles.sliderEndLabel}>More sweet</Text>
              </View>
            </View>

            {/* Comfort vs Experimental */}
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Comfort vs experimental</Text>
              <View style={styles.sliderRow}>
                <Text style={styles.sliderEndLabel}>Classic</Text>
                <Slider
                  style={styles.sliderFlex}
                  minimumValue={0}
                  maximumValue={1}
                  value={comfortExperimental}
                  onValueChange={setComfortExperimental}
                  minimumTrackTintColor={colors.primary}
                  maximumTrackTintColor={colors.gray20}
                  thumbTintColor={colors.primary}
                />
                <Text style={styles.sliderEndLabel}>Adventurous</Text>
              </View>
            </View>
          </View>
        )}

        {/* Section 3: Favorite Meal Types */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setShowMealTypeSection(!showMealTypeSection)}
        >
          <View style={styles.sectionHeaderLeft}>
            <NourishrIcon name="Category" size={20} color={colors.black} variant="bold" />
            <Text style={styles.sectionTitle}>Favorite meal types</Text>
          </View>
          <NourishrIcon 
            name={showMealTypeSection ? "ArrowUp2" : "ArrowDown2"} 
            size={20} 
            color={colors.gray60} 
          />
        </TouchableOpacity>

        {showMealTypeSection && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionSubtitle}>Select meal formats you love</Text>
            <View style={styles.chipsContainer}>
              {MEAL_TYPES.map(mealType => (
                <TouchableOpacity
                  key={mealType.id}
                  style={[styles.chip, selectedMealTypes.includes(mealType.id) && styles.chipSelected]}
                  onPress={() => toggleMealType(mealType.id)}
                >
                  <Text style={[styles.chipLabel, selectedMealTypes.includes(mealType.id) && styles.chipLabelSelected]}>
                    {mealType.label}
                  </Text>
                  {selectedMealTypes.includes(mealType.id) && (
                    <View style={styles.chipCheckmark}>
                      <NourishrIcon name="TickCircle" size={16} color={colors.primary} variant="bold" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Info Box */}
        {(selectedCuisines.length > 0 || customCuisines.length > 0 || selectedMealTypes.length > 0) && (
          <View style={styles.infoBox}>
            <NourishrIcon name="InfoCircle" size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              We'll prioritize these preferences when recommending meals. The more you share, the better we can personalize!
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

      {/* Custom Cuisine Modal */}
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
              <Text style={styles.modalTitle}>Add custom cuisine</Text>
              <TouchableOpacity onPress={() => setShowCustomModal(false)}>
                <NourishrIcon name="CloseSquare" size={24} color={colors.black} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>
              Enter a cuisine you love (e.g., Cameroonian, Peruvian)
            </Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="e.g., Cameroonian, Peruvian, Vietnamese"
              value={customCuisineInput}
              onChangeText={setCustomCuisineInput}
              autoFocus
              onSubmitEditing={addCustomCuisine}
              returnKeyType="done"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setCustomCuisineInput('');
                  setShowCustomModal(false);
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalAddButton, !customCuisineInput.trim() && styles.modalAddButtonDisabled]}
                onPress={addCustomCuisine}
                disabled={!customCuisineInput.trim()}
              >
                <Text style={styles.modalAddText}>Add Cuisine</Text>
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
  
  // Chips
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderWidth: 2, borderColor: colors.gray20, borderRadius: radius.full, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, gap: spacing.xs },
  chipSelected: { borderColor: colors.primary, backgroundColor: '#FFF5E6' },
  chipLabel: { ...typography.body, fontSize: 15, fontWeight: '500', color: colors.black },
  chipLabelSelected: { color: colors.primary, fontWeight: '600' },
  chipCheckmark: { marginLeft: spacing.xs },
  
  // Custom Cuisines
  customCuisinesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  customCuisineTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, borderRadius: radius.full, paddingVertical: spacing.xs, paddingLeft: spacing.md, paddingRight: spacing.sm, gap: spacing.xs },
  customCuisineText: { ...typography.body, fontSize: 14, fontWeight: '500', color: colors.white },
  addCustomButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white, borderWidth: 2, borderColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, gap: spacing.sm, borderStyle: 'dashed' },
  addCustomText: { ...typography.bodyMedium, fontSize: 15, fontWeight: '600', color: colors.primary },
  
  // Sliders
  sliderContainer: { marginBottom: spacing.lg },
  sliderLabel: { ...typography.bodyMedium, fontSize: 16, fontWeight: '600', color: colors.black, marginBottom: spacing.sm },
  sliderRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  slider: { flex: 1, height: 40 },
  sliderFlex: { flex: 1, height: 40 },
  sliderValue: { ...typography.body, fontSize: 15, fontWeight: '600', color: colors.primary, textAlign: 'center', marginTop: spacing.xs },
  sliderEndLabel: { ...typography.caption, fontSize: 13, color: colors.gray60, minWidth: 80 },
  
  // Info Box
  infoBox: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#FFF5E6', borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.lg, marginBottom: spacing.xl, gap: spacing.sm },
  infoText: { ...typography.caption, fontSize: 14, color: colors.gray70, lineHeight: 20, flex: 1 },
  buttonContainer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, paddingTop: spacing.md, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.gray20 },
  
  // Custom Cuisine Modal
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
