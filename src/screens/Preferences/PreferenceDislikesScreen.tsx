import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing, radius } from '../../theme';
import { NourishrIcon, PrimaryButton, PreferenceHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';

type PreferenceDislikesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PreferenceDislikes'>;

interface PreferenceDislikesScreenProps {
  navigation: PreferenceDislikesScreenNavigationProp;
}

interface DislikeItem {
  id: string;
  label: string;
  preference?: 'never' | 'rarely';
}

const DISLIKED_INGREDIENTS = [
  { id: 'cilantro', label: 'Cilantro' },
  { id: 'mushrooms', label: 'Mushrooms' },
  { id: 'olives', label: 'Olives' },
  { id: 'onions', label: 'Onions' },
  { id: 'garlic', label: 'Garlic' },
  { id: 'tofu', label: 'Tofu' },
  { id: 'tomatoes', label: 'Tomatoes' },
  { id: 'cheese', label: 'Cheese' },
  { id: 'seafood', label: 'Seafood' },
  { id: 'spicy-food', label: 'Spicy food' },
  { id: 'sweet-sauces', label: 'Sweet sauces' },
];

const DISLIKED_TEXTURES = [
  { id: 'soups', label: 'Soups' },
  { id: 'stews', label: 'Stews' },
  { id: 'raw-foods', label: 'Raw foods' },
  { id: 'smoky-flavor', label: 'Smoky flavor' },
  { id: 'slimy', label: 'Slimy' },
  { id: 'overly-creamy', label: 'Overly creamy' },
  { id: 'crunchy', label: 'Crunchy' },
];

export const PreferenceDislikesScreen: React.FC<PreferenceDislikesScreenProps> = ({ navigation, route }) => {
  const gender = route.params?.gender;
  const [selectedIngredients, setSelectedIngredients] = useState<DislikeItem[]>([]);
  const [selectedTextures, setSelectedTextures] = useState<DislikeItem[]>([]);
  const [customDislikes, setCustomDislikes] = useState<DislikeItem[]>([]);
  const [showPreferenceModal, setShowPreferenceModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [currentDislikeId, setCurrentDislikeId] = useState<string>('');
  const [currentDislikeType, setCurrentDislikeType] = useState<'ingredient' | 'texture' | 'custom'>('ingredient');
  const [customDislikeInput, setCustomDislikeInput] = useState('');

  const isDislikeSelected = (id: string, type: 'ingredient' | 'texture') => {
    if (type === 'ingredient') {
      return selectedIngredients.some(d => d.id === id);
    }
    return selectedTextures.some(d => d.id === id);
  };

  const getDislikePreference = (id: string, type: 'ingredient' | 'texture' | 'custom') => {
    let item;
    if (type === 'ingredient') {
      item = selectedIngredients.find(d => d.id === id);
    } else if (type === 'texture') {
      item = selectedTextures.find(d => d.id === id);
    } else {
      item = customDislikes.find(d => d.id === id);
    }
    return item?.preference;
  };

  const handleDislinkeTap = (id: string, label: string, type: 'ingredient' | 'texture') => {
    setCurrentDislikeId(id);
    setCurrentDislikeType(type);
    setShowPreferenceModal(true);
  };

  const handlePreferenceSelect = (preference: 'never' | 'rarely') => {
    if (currentDislikeType === 'ingredient') {
      const ingredient = DISLIKED_INGREDIENTS.find(i => i.id === currentDislikeId);
      if (ingredient) {
        setSelectedIngredients(prev => {
          const existing = prev.find(d => d.id === currentDislikeId);
          if (existing) {
            return prev.map(d => d.id === currentDislikeId ? { ...d, preference } : d);
          }
          return [...prev, { id: currentDislikeId, label: ingredient.label, preference }];
        });
      }
    } else if (currentDislikeType === 'texture') {
      const texture = DISLIKED_TEXTURES.find(t => t.id === currentDislikeId);
      if (texture) {
        setSelectedTextures(prev => {
          const existing = prev.find(d => d.id === currentDislikeId);
          if (existing) {
            return prev.map(d => d.id === currentDislikeId ? { ...d, preference } : d);
          }
          return [...prev, { id: currentDislikeId, label: texture.label, preference }];
        });
      }
    } else {
      setCustomDislikes(prev =>
        prev.map(d => d.id === currentDislikeId ? { ...d, preference } : d)
      );
    }
    
    setShowPreferenceModal(false);
  };

  const handleRemoveDislike = (id: string, type: 'ingredient' | 'texture' | 'custom') => {
    if (type === 'ingredient') {
      setSelectedIngredients(prev => prev.filter(d => d.id !== id));
    } else if (type === 'texture') {
      setSelectedTextures(prev => prev.filter(d => d.id !== id));
    } else {
      setCustomDislikes(prev => prev.filter(d => d.id !== id));
    }
  };

  const addCustomDislike = () => {
    if (customDislikeInput.trim()) {
      const id = `custom-${Date.now()}`;
      setCurrentDislikeId(id);
      setCurrentDislikeType('custom');
      setCustomDislikes(prev => [...prev, { id, label: customDislikeInput.trim() }]);
      setCustomDislikeInput('');
      setShowCustomModal(false);
      // Show preference modal for the new custom dislike
      setTimeout(() => setShowPreferenceModal(true), 300);
    }
  };

  const isValid = true; // Optional screen

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <PreferenceHeader
        currentStep={5}
        totalSteps={10}
        icon="DislikeTag"
        onClose={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>What do you dislike or never want to see?</Text>
        <Text style={styles.subtitle}>
          Tell us what you hate so we can avoid suggesting it. Your taste preferences help us personalize your experience.
        </Text>

        {/* Ingredients You Hate */}
        <Text style={styles.sectionTitle}>Ingredients you hate</Text>
        <Text style={styles.sectionSubtitle}>Tap to set how strongly you dislike it</Text>
        <View style={styles.chipsContainer}>
          {DISLIKED_INGREDIENTS.map(ingredient => {
            const selected = isDislikeSelected(ingredient.id, 'ingredient');
            const preference = getDislikePreference(ingredient.id, 'ingredient');
            
            return (
              <TouchableOpacity
                key={ingredient.id}
                style={[
                  styles.chip,
                  selected && styles.chipSelected,
                  preference === 'never' && styles.chipNever,
                  preference === 'rarely' && styles.chipRarely,
                ]}
                onPress={() => handleDislinkeTap(ingredient.id, ingredient.label, 'ingredient')}
                onLongPress={() => selected && handleRemoveDislike(ingredient.id, 'ingredient')}
              >
                <Text style={[
                  styles.chipLabel,
                  selected && styles.chipLabelSelected,
                ]}>
                  {ingredient.label}
                </Text>
                {selected && preference && (
                  <View style={styles.preferenceBadge}>
                    <Text style={styles.preferenceBadgeText}>
                      {preference === 'never' ? '🚫' : '⚠️'}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Textures / Formats You Dislike */}
        <Text style={styles.sectionTitle}>Textures / formats you dislike</Text>
        <Text style={styles.sectionSubtitle}>Select meal formats or textures you prefer to avoid</Text>
        <View style={styles.chipsContainer}>
          {DISLIKED_TEXTURES.map(texture => {
            const selected = isDislikeSelected(texture.id, 'texture');
            const preference = getDislikePreference(texture.id, 'texture');
            
            return (
              <TouchableOpacity
                key={texture.id}
                style={[
                  styles.chip,
                  selected && styles.chipSelected,
                  preference === 'never' && styles.chipNever,
                  preference === 'rarely' && styles.chipRarely,
                ]}
                onPress={() => handleDislinkeTap(texture.id, texture.label, 'texture')}
                onLongPress={() => selected && handleRemoveDislike(texture.id, 'texture')}
              >
                <Text style={[
                  styles.chipLabel,
                  selected && styles.chipLabelSelected,
                ]}>
                  {texture.label}
                </Text>
                {selected && preference && (
                  <View style={styles.preferenceBadge}>
                    <Text style={styles.preferenceBadgeText}>
                      {preference === 'never' ? '🚫' : '⚠️'}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Custom Dislikes */}
        {customDislikes.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Custom dislikes</Text>
            <View style={styles.customDislikesContainer}>
              {customDislikes.map(dislike => (
                <TouchableOpacity
                  key={dislike.id}
                  style={[
                    styles.customDislikeTag,
                    dislike.preference === 'never' && styles.customDislikeTagNever,
                    dislike.preference === 'rarely' && styles.customDislikeTagRarely,
                  ]}
                  onPress={() => {
                    setCurrentDislikeId(dislike.id);
                    setCurrentDislikeType('custom');
                    setShowPreferenceModal(true);
                  }}
                >
                  <Text style={styles.customDislikeText}>
                    {dislike.preference === 'never' ? '🚫' : '⚠️'} {dislike.label}
                  </Text>
                  <TouchableOpacity onPress={() => handleRemoveDislike(dislike.id, 'custom')}>
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
          <Text style={styles.addCustomText}>Add custom ingredient you dislike</Text>
        </TouchableOpacity>

        {/* Legend */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <Text style={styles.legendIcon}>🚫</Text>
            <Text style={styles.legendText}>Never show</Text>
          </View>
          <View style={styles.legendItem}>
            <Text style={styles.legendIcon}>⚠️</Text>
            <Text style={styles.legendText}>Show rarely</Text>
          </View>
        </View>

        {/* Info Box */}
        {(selectedIngredients.length > 0 || selectedTextures.length > 0 || customDislikes.length > 0) && (
          <View style={styles.infoBox}>
            <NourishrIcon name="InfoCircle" size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              We'll respect your preferences - items marked "Never" won't appear, and "Rarely" items will be minimized.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title="Next"
          onPress={() => navigation.navigate('PreferenceLoves', { gender })}
          disabled={!isValid}
        />
      </View>

      {/* Preference Selection Modal */}
      <Modal
        visible={showPreferenceModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPreferenceModal(false)}
      >
        <View style={styles.preferenceModalOverlay}>
          <TouchableOpacity 
            style={styles.preferenceModalBackdrop}
            activeOpacity={1}
            onPress={() => setShowPreferenceModal(false)}
          />
          <View style={styles.preferenceModalContent}>
            <Text style={styles.preferenceModalTitle}>How much do you dislike this?</Text>
            <Text style={styles.preferenceModalSubtitle}>Choose your preference level</Text>
            
            <TouchableOpacity
              style={styles.preferenceOption}
              onPress={() => handlePreferenceSelect('never')}
            >
              <View style={styles.preferenceOptionIcon}>
                <Text style={styles.preferenceOptionEmoji}>🚫</Text>
              </View>
              <View style={styles.preferenceOptionContent}>
                <Text style={styles.preferenceOptionTitle}>Never show</Text>
                <Text style={styles.preferenceOptionDescription}>
                  I hate this - never suggest meals with it
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.preferenceOption}
              onPress={() => handlePreferenceSelect('rarely')}
            >
              <View style={styles.preferenceOptionIcon}>
                <Text style={styles.preferenceOptionEmoji}>⚠️</Text>
              </View>
              <View style={styles.preferenceOptionContent}>
                <Text style={styles.preferenceOptionTitle}>Show rarely</Text>
                <Text style={styles.preferenceOptionDescription}>
                  I dislike it but can tolerate it occasionally
                </Text>
              </View>
            </TouchableOpacity>

            {(isDislikeSelected(currentDislikeId, 'ingredient') || 
              isDislikeSelected(currentDislikeId, 'texture') ||
              customDislikes.some(d => d.id === currentDislikeId)) && (
              <TouchableOpacity
                style={styles.preferenceRemoveButton}
                onPress={() => {
                  handleRemoveDislike(currentDislikeId, currentDislikeType);
                  setShowPreferenceModal(false);
                }}
              >
                <Text style={styles.preferenceRemoveText}>Remove this item</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      {/* Custom Dislike Modal */}
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
              <Text style={styles.modalTitle}>Add custom dislike</Text>
              <TouchableOpacity onPress={() => setShowCustomModal(false)}>
                <NourishrIcon name="CloseSquare" size={24} color={colors.black} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>
              Enter an ingredient or food you dislike
            </Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="e.g., Brussels sprouts, Anchovies"
              value={customDislikeInput}
              onChangeText={setCustomDislikeInput}
              autoFocus
              onSubmitEditing={addCustomDislike}
              returnKeyType="done"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setCustomDislikeInput('');
                  setShowCustomModal(false);
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalAddButton, !customDislikeInput.trim() && styles.modalAddButtonDisabled]}
                onPress={addCustomDislike}
                disabled={!customDislikeInput.trim()}
              >
                <Text style={styles.modalAddText}>Add Dislike</Text>
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
  sectionTitle: { ...typography.bodyMedium, fontSize: 18, fontWeight: '600', color: colors.black, marginTop: spacing.lg, marginBottom: spacing.xs },
  sectionSubtitle: { ...typography.caption, fontSize: 14, color: colors.gray60, marginBottom: spacing.md },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderWidth: 2, borderColor: colors.gray20, borderRadius: radius.full, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, gap: spacing.xs },
  chipSelected: { borderColor: colors.primary, backgroundColor: '#FFF5E6' },
  chipNever: { borderColor: colors.error, backgroundColor: '#FFE5E5' },
  chipRarely: { borderColor: '#FFA500', backgroundColor: '#FFF5E6' },
  chipLabel: { ...typography.body, fontSize: 15, fontWeight: '500', color: colors.black },
  chipLabelSelected: { fontWeight: '600' },
  preferenceBadge: { marginLeft: spacing.xs },
  preferenceBadgeText: { fontSize: 14 },
  customDislikesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  customDislikeTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, borderRadius: radius.full, paddingVertical: spacing.xs, paddingLeft: spacing.md, paddingRight: spacing.sm, gap: spacing.xs },
  customDislikeTagNever: { backgroundColor: colors.error },
  customDislikeTagRarely: { backgroundColor: '#FFA500' },
  customDislikeText: { ...typography.body, fontSize: 14, fontWeight: '500', color: colors.white },
  addCustomButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white, borderWidth: 2, borderColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, gap: spacing.sm, borderStyle: 'dashed', marginTop: spacing.md },
  addCustomText: { ...typography.bodyMedium, fontSize: 15, fontWeight: '600', color: colors.primary },
  legendContainer: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.lg, marginBottom: spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  legendIcon: { fontSize: 16 },
  legendText: { ...typography.caption, fontSize: 13, color: colors.gray60 },
  infoBox: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#FFF5E6', borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.md, marginBottom: spacing.xl, gap: spacing.sm },
  infoText: { ...typography.caption, fontSize: 14, color: colors.gray70, lineHeight: 20, flex: 1 },
  buttonContainer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, paddingTop: spacing.md, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.gray20 },
  
  // Preference Modal
  preferenceModalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  preferenceModalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  preferenceModalContent: { backgroundColor: colors.white, borderRadius: radius.xl, padding: spacing.xl, marginHorizontal: spacing.lg, width: '85%', maxWidth: 400 },
  preferenceModalTitle: { ...typography.headingLG, fontSize: 24, fontWeight: '700', color: colors.black, marginBottom: spacing.xs, textAlign: 'center' },
  preferenceModalSubtitle: { ...typography.body, fontSize: 15, color: colors.gray60, marginBottom: spacing.lg, textAlign: 'center' },
  preferenceOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.gray10, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm },
  preferenceOptionIcon: { width: 48, height: 48, borderRadius: radius.md, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  preferenceOptionEmoji: { fontSize: 24 },
  preferenceOptionContent: { flex: 1 },
  preferenceOptionTitle: { ...typography.bodyMedium, fontSize: 16, fontWeight: '600', color: colors.black, marginBottom: 2 },
  preferenceOptionDescription: { ...typography.caption, fontSize: 13, color: colors.gray60, lineHeight: 18 },
  preferenceRemoveButton: { marginTop: spacing.md, paddingVertical: spacing.sm, alignItems: 'center' },
  preferenceRemoveText: { ...typography.bodyMedium, fontSize: 15, fontWeight: '600', color: colors.error },
  
  // Custom Dislike Modal
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
