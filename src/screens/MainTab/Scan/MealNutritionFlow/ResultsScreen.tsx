import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { colors, typography, spacing, radius } from '../../../../theme';
import { NourishrIcon } from '../../../../components';
import { NutritionData } from './types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ResultsScreenProps {
  imageUri: string;
  nutritionData: NutritionData;
  onClose: () => void;
  onSave: () => void;
  onEdit: () => void;
  onUseForRecipes: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  imageUri,
  nutritionData,
  onClose,
  onSave,
  onEdit,
  onUseForRecipes,
}) => {
  const insets = useSafeAreaInsets();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return '#2D6A4F';
    if (score >= 60) return '#F77F00';
    return '#E63946';
  };

  return (
    <View style={styles.container}>
      {/* Compact Header with Photo Card and Gradient Background */}
      <LinearGradient
        colors={['#FF9500', '#FD6A2F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.compactHeader, { paddingTop: insets.top }]}
      >
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <NourishrIcon name="CloseCircle" size={24} color={colors.white} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          {/* Small Photo Card */}
          <View style={styles.photoCard}>
            <Image source={{ uri: imageUri }} style={styles.photoCardImage} />
          </View>

          {/* Meal Info */}
          <View style={styles.mealInfo}>
            <Text style={styles.mealName} numberOfLines={1}>
              {nutritionData.mealName}
            </Text>
            <Text style={styles.mealMeta}>
              {nutritionData.cuisineType} • {nutritionData.category}
            </Text>
            {nutritionData.description && (
              <Text style={styles.mealDescription} numberOfLines={2}>
                {nutritionData.description}
              </Text>
            )}
          </View>
        </View>
      </LinearGradient>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Info Card */}
        <View style={styles.keyDetailsCard}>
          <Text style={styles.sectionTitle}>Quick Info</Text>
          
          <View style={styles.keyDetailsRow}>
            {/* 1. Diet Compatibility */}
            <View style={styles.detailItem}>
              <Text style={styles.detailTopLabel}>Diet</Text>
              <View style={styles.detailBadgeGreen}>
                <Text style={styles.detailBadgeTextGreen}>
                  {nutritionData.dietCompatibility.vegan ? 'Vegan' : 'Non-vegan'}
                </Text>
              </View>
            </View>

            {/* 2. Cuisine Type */}
            <View style={styles.detailItem}>
              <Text style={styles.detailTopLabel}>Cuisine</Text>
              <View style={styles.detailBadgeOrange}>
                <Text style={styles.detailBadgeTextOrange}>{nutritionData.cuisineType}</Text>
              </View>
            </View>

            {/* 3. Cooking Difficulty */}
            <View style={styles.detailItem}>
              <Text style={styles.detailTopLabel}>Cooking</Text>
              <View style={styles.detailBadgePurple}>
                <Text style={styles.detailBadgeTextPurple}>Easy</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Stats Card */}
        <View style={styles.quickStatsCard}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
            
            {/* Circular Ring Progress */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.statsScroll}
              contentContainerStyle={styles.statsScrollContent}
            >
            {/* Calories */}
            <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
              <View style={styles.ringContainer}>
                <Svg width={100} height={100}>
                  {/* Background Ring */}
                  <Circle
                    cx={50}
                    cy={50}
                    r={42}
                    stroke="#FFE0B2"
                    strokeWidth={5}
                    fill="none"
                  />
                  {/* Progress Ring - 80% example */}
                  <Circle
                    cx={50}
                    cy={50}
                    r={42}
                    stroke="#FF9800"
                    strokeWidth={8}
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 42 * 0.8} ${2 * Math.PI * 42}`}
                    strokeLinecap="round"
                    rotation="-90"
                    origin="50, 50"
                  />
                </Svg>
                <View style={styles.ringContent}>
                  <Text style={styles.ringPercentage}>80%</Text>
                  <Text style={[styles.ringValue, { color: '#FF9800' }]}>{nutritionData.calories}</Text>
                </View>
              </View>
              <Text style={styles.statLabel}>Calories</Text>
            </View>

            {/* Protein */}
            <View style={[styles.statCard, { backgroundColor: '#FCE4EC' }]}>
              <View style={styles.ringContainer}>
                <Svg width={100} height={100}>
                  <Circle
                    cx={50}
                    cy={50}
                    r={42}
                    stroke="#F8BBD0"
                    strokeWidth={5}
                    fill="none"
                  />
                  <Circle
                    cx={50}
                    cy={50}
                    r={42}
                    stroke="#E91E63"
                    strokeWidth={8}
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 42 * 0.35} ${2 * Math.PI * 42}`}
                    strokeLinecap="round"
                    rotation="-90"
                    origin="50, 50"
                  />
                </Svg>
                <View style={styles.ringContent}>
                  <Text style={styles.ringPercentage}>35%</Text>
                  <Text style={[styles.ringValue, { color: '#E91E63' }]}>{nutritionData.protein}g</Text>
                </View>
              </View>
              <Text style={styles.statLabel}>Protein</Text>
            </View>

            {/* Carbs */}
            <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
              <View style={styles.ringContainer}>
                <Svg width={100} height={100}>
                  <Circle
                    cx={50}
                    cy={50}
                    r={42}
                    stroke="#C8E6C9"
                    strokeWidth={5}
                    fill="none"
                  />
                  <Circle
                    cx={50}
                    cy={50}
                    r={42}
                    stroke="#4CAF50"
                    strokeWidth={8}
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 42 * 0.28} ${2 * Math.PI * 42}`}
                    strokeLinecap="round"
                    rotation="-90"
                    origin="50, 50"
                  />
                </Svg>
                <View style={styles.ringContent}>
                  <Text style={styles.ringPercentage}>28%</Text>
                  <Text style={[styles.ringValue, { color: '#4CAF50' }]}>{nutritionData.carbs}g</Text>
                </View>
              </View>
              <Text style={styles.statLabel}>Carbs</Text>
            </View>

            {/* Fat */}
            <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
              <View style={styles.ringContainer}>
                <Svg width={100} height={100}>
                  <Circle
                    cx={50}
                    cy={50}
                    r={42}
                    stroke="#FFE0B2"
                    strokeWidth={5}
                    fill="none"
                  />
                  <Circle
                    cx={50}
                    cy={50}
                    r={42}
                    stroke="#FF9800"
                    strokeWidth={8}
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 42 * 0.18} ${2 * Math.PI * 42}`}
                    strokeLinecap="round"
                    rotation="-90"
                    origin="50, 50"
                  />
                </Svg>
                <View style={styles.ringContent}>
                  <Text style={styles.ringPercentage}>18%</Text>
                  <Text style={[styles.ringValue, { color: '#FF9800' }]}>{nutritionData.fat}g</Text>
                </View>
              </View>
              <Text style={styles.statLabel}>Fat</Text>
            </View>

            {/* Health Score */}
            <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
              <View style={styles.ringContainer}>
                <Svg width={100} height={100}>
                  <Circle
                    cx={50}
                    cy={50}
                    r={42}
                    stroke="#BBDEFB"
                    strokeWidth={5}
                    fill="none"
                  />
                  <Circle
                    cx={50}
                    cy={50}
                    r={42}
                    stroke="#2196F3"
                    strokeWidth={8}
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 42 * (nutritionData.healthScore / 100)} ${2 * Math.PI * 42}`}
                    strokeLinecap="round"
                    rotation="-90"
                    origin="50, 50"
                  />
                </Svg>
                <View style={styles.ringContent}>
                  <Text style={styles.ringPercentage}>{nutritionData.healthScore}%</Text>
                  <Text style={[styles.ringValueSmall, { color: '#2196F3' }]}>Score</Text>
                </View>
              </View>
              <Text style={styles.statLabel}>Health Score</Text>
            </View>
          </ScrollView>
          </View>

          {/* Detected Ingredients */}
          <View style={styles.detectedIngredientsCard}>
            <Text style={styles.sectionTitle}>Detected Ingredients</Text>
            <View style={styles.ingredientsList}>
            {nutritionData.ingredients.map((ingredient, index) => {
              // Define color palette for ingredients with soft and strong variants
              const ingredientColors = [
                { strong: '#FF9800', soft: '#FFE0B2' }, // Orange
                { strong: '#E91E63', soft: '#F8BBD0' }, // Pink
                { strong: '#4CAF50', soft: '#C8E6C9' }, // Green
                { strong: '#2196F3', soft: '#BBDEFB' }, // Blue
                { strong: '#9C27B0', soft: '#E1BEE7' }, // Purple
                { strong: '#FF5722', soft: '#FFCCBC' }, // Deep Orange
              ];
              const colors = ingredientColors[index % ingredientColors.length];
              
              return (
                <View key={index} style={styles.ingredientItem}>
                  <View style={styles.ingredientInfo}>
                    <Text style={styles.ingredientName}>{ingredient.name}</Text>
                    <Text style={styles.ingredientConfidence}>{Math.round(ingredient.confidence)}% confident</Text>
                  </View>
                  {/* Background bar (soft color) */}
                  <View style={[styles.confidenceBarBackground, { backgroundColor: colors.soft }]} />
                  {/* Progress bar (strong color) */}
                  <View
                    style={[
                      styles.confidenceBar,
                      { width: `${ingredient.confidence}%`, backgroundColor: colors.strong },
                    ]}
                  />
                </View>
              );
            })}
            </View>
            <TouchableOpacity style={styles.editButton} onPress={onEdit}>
              <NourishrIcon name="Edit" size={18} color={colors.primary} />
              <Text style={styles.editButtonText}>Edit ingredients</Text>
            </TouchableOpacity>
          </View>

        {/* Expandable Sections Card */}
        <View style={styles.expandableSectionsCard}>
          <Text style={styles.sectionTitle}>Nutrition Details</Text>
          
          {/* Macros */}
          <TouchableOpacity
            style={[styles.expandableSection, styles.expandableSectionFirst]}
            onPress={() => toggleSection('macros')}
            activeOpacity={0.7}
          >
          <View style={styles.expandableHeader}>
            <Text style={styles.expandableTitle}>Macronutrients</Text>
            <NourishrIcon
              name={expandedSections.has('macros') ? 'ArrowUp' : 'ArrowDown'}
              size={20}
              color={colors.gray60}
            />
          </View>
          {expandedSections.has('macros') && (
            <View style={styles.expandableContent}>
              <View style={styles.macroRow}>
                <Text style={styles.macroLabel}>Protein</Text>
                <Text style={styles.macroValue}>{nutritionData.protein}g</Text>
              </View>
              <View style={styles.macroRow}>
                <Text style={styles.macroLabel}>Carbohydrates</Text>
                <Text style={styles.macroValue}>{nutritionData.carbs}g</Text>
              </View>
              <View style={styles.macroRow}>
                <Text style={styles.macroLabel}>Fat</Text>
                <Text style={styles.macroValue}>{nutritionData.fat}g</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>

        {/* Micronutrients */}
        <TouchableOpacity
          style={styles.expandableSection}
          onPress={() => toggleSection('micros')}
          activeOpacity={0.7}
        >
          <View style={styles.expandableHeader}>
            <Text style={styles.expandableTitle}>Micronutrients</Text>
            <NourishrIcon
              name={expandedSections.has('micros') ? 'ArrowUp' : 'ArrowDown'}
              size={20}
              color={colors.gray60}
            />
          </View>
          {expandedSections.has('micros') && (
            <View style={styles.expandableContent}>
              {nutritionData.micronutrients.map((nutrient, index) => (
                <View key={index} style={styles.macroRow}>
                  <Text style={styles.macroLabel}>{nutrient.name}</Text>
                  <Text style={styles.macroValue}>
                    {nutrient.amount}{nutrient.unit}
                    {nutrient.dailyValue && ` (${nutrient.dailyValue}% DV)`}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </TouchableOpacity>

        {/* Allergens */}
        {nutritionData.allergens.length > 0 && (
          <View style={styles.allergensSection}>
            <View style={styles.allergensHeader}>
              <NourishrIcon name="Warning2" size={20} color="#E63946" />
              <Text style={styles.allergensTitle}>Allergen Warnings</Text>
            </View>
            <View style={styles.allergensList}>
              {nutritionData.allergens.map((allergen, index) => (
                <View key={index} style={styles.allergenChip}>
                  <Text style={styles.allergenText}>{allergen}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Diet Compatibility */}
        <TouchableOpacity
          style={styles.expandableSection}
          onPress={() => toggleSection('diet')}
          activeOpacity={0.7}
        >
          <View style={styles.expandableHeader}>
            <Text style={styles.expandableTitle}>Diet Compatibility</Text>
            <NourishrIcon
              name={expandedSections.has('diet') ? 'ArrowUp' : 'ArrowDown'}
              size={20}
              color={colors.gray60}
            />
          </View>
          {expandedSections.has('diet') && (
            <View style={styles.expandableContent}>
              {Object.entries(nutritionData.dietCompatibility).map(([diet, compatible]) => (
                <View key={diet} style={styles.dietRow}>
                  <Text style={styles.dietLabel}>{diet.charAt(0).toUpperCase() + diet.slice(1)}</Text>
                  <View style={[styles.dietBadge, { backgroundColor: compatible ? '#E8F5E9' : '#FFE5E5' }]}>
                    <Text style={[styles.dietBadgeText, { color: compatible ? '#2D6A4F' : '#E63946' }]}>
                      {compatible ? '✓ Yes' : '✗ No'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </TouchableOpacity>
        </View>

        {/* Accuracy Check */}
        <View style={styles.accuracySection}>
            <Text style={styles.accuracyTitle}>Is this accurate?</Text>
            <View style={styles.accuracyButtons}>
              <TouchableOpacity style={styles.accuracyButtonYes} onPress={onSave}>
                <NourishrIcon name="TickCircle" size={20} color={colors.white} />
                <Text style={styles.accuracyButtonTextYes}>Yes, looks good</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.accuracyButtonEdit} onPress={onEdit}>
                <NourishrIcon name="Edit" size={20} color={colors.primary} />
                <Text style={styles.accuracyButtonTextEdit}>Edit portions</Text>
              </TouchableOpacity>
            </View>
          </View>
      </ScrollView>

      {/* Fixed Bottom Actions */}
      <View style={[styles.bottomActions, { paddingBottom: insets.bottom + spacing.md }]}>
        <TouchableOpacity onPress={onSave} activeOpacity={0.8}>
          <LinearGradient
            colors={['#FF9500', '#FD6A2F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>Save to my day 📅</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.secondaryActions}>
          <TouchableOpacity style={styles.secondaryButton}>
            <NourishrIcon name="Star" size={18} color={colors.gray70} />
            <Text style={styles.secondaryButtonText}>Favorite</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={onUseForRecipes}>
            <NourishrIcon name="Refresh" size={18} color={colors.gray70} />
            <Text style={styles.secondaryButtonText}>Use for recipes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  compactHeader: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: spacing.xs,
    marginBottom: spacing.sm,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  photoCard: {
    width: 100,
    height: 100,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.gray10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  photoCardImage: {
    width: '100%',
    height: '100%',
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    ...typography.h3,
    color: colors.white,
    fontWeight: '700',
    fontSize: 20,
    marginBottom: spacing.xs / 2,
  },
  mealMeta: {
    ...typography.caption,
    color: colors.white,
    fontSize: 13,
    marginBottom: spacing.xs,
    opacity: 0.9,
  },
  mealDescription: {
    ...typography.body,
    color: colors.white,
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.85,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  keyDetailsCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 15,
  },
  keyDetailsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  detailTopLabel: {
    ...typography.caption,
    color: colors.gray60,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  detailBadgeGreen: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailBadgeBlue: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailBadgeOrange: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailBadgePurple: {
    backgroundColor: '#F3E5F5',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailEmoji: {
    fontSize: 12,
  },
  detailBadgeTextGreen: {
    ...typography.caption,
    color: '#2D6A4F',
    fontWeight: '600',
    fontSize: 12,
  },
  detailBadgeTextBlue: {
    ...typography.caption,
    color: '#1565C0',
    fontWeight: '600',
    fontSize: 12,
    flexShrink: 1,
  },
  detailBadgeTextOrange: {
    ...typography.caption,
    color: '#E65100',
    fontWeight: '600',
    fontSize: 12,
  },
  detailBadgeTextPurple: {
    ...typography.caption,
    color: '#6A1B9A',
    fontWeight: '600',
    fontSize: 12,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.black,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  statsScroll: {
    marginHorizontal: -spacing.lg,
  },
  statsScrollContent: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  statCard: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    minWidth: 120,
    alignItems: 'center',
    height: 160,
    justifyContent: 'space-between',
  },
  ringContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringPercentage: {
    ...typography.h3,
    color: colors.black,
    fontWeight: '700',
    fontSize: 18,
    marginBottom: spacing.xs / 2,
  },
  ringValue: {
    ...typography.body,
    fontWeight: '600',
    fontSize: 13,
  },
  ringValueSmall: {
    ...typography.caption,
    color: colors.gray70,
    fontSize: 12,
  },
  statLabel: {
    ...typography.body,
    color: colors.black,
    fontSize: 14,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  section: {
    marginBottom: spacing.lg,
  },
  quickStatsCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  detectedIngredientsCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  expandableSectionsCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  ingredientsList: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  ingredientItem: {
    position: 'relative',
  },
  ingredientInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  ingredientName: {
    ...typography.body,
    color: colors.black,
    fontWeight: '600',
    fontSize: 15,
  },
  ingredientConfidence: {
    ...typography.caption,
    color: colors.gray60,
    fontSize: 13,
    fontWeight: '500',
  },
  confidenceBarBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 8,
    borderRadius: radius.md,
  },
  confidenceBar: {
    height: 8,
    borderRadius: radius.md,
    position: 'relative',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  editButtonText: {
    ...typography.bodyMedium,
    color: colors.primary,
    fontWeight: '600',
  },
  expandableSection: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray20,
  },
  expandableSectionFirst: {
    paddingTop: spacing.sm,
  },
  expandableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expandableTitle: {
    ...typography.h4,
    color: colors.black,
    fontWeight: '600',
    fontSize: 16,
  },
  expandableContent: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  macroLabel: {
    ...typography.body,
    color: colors.gray70,
  },
  macroValue: {
    ...typography.bodyMedium,
    color: colors.black,
    fontWeight: '600',
  },
  allergensSection: {
    backgroundColor: '#FFE5E5',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  allergensHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  allergensTitle: {
    ...typography.bodyMedium,
    color: '#E63946',
    fontWeight: '600',
  },
  allergensList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  allergenChip: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: radius.full,
  },
  allergenText: {
    ...typography.caption,
    color: '#E63946',
    fontWeight: '600',
  },
  dietRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  dietLabel: {
    ...typography.body,
    color: colors.gray70,
  },
  dietBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: radius.sm,
  },
  dietBadgeText: {
    ...typography.caption,
    fontWeight: '600',
    fontSize: 12,
  },
  accuracySection: {
    marginBottom: spacing.lg,
  },
  accuracyTitle: {
    ...typography.h4,
    color: colors.black,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  accuracyButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  accuracyButtonYes: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
  },
  accuracyButtonTextYes: {
    ...typography.bodyMedium,
    color: colors.white,
    fontWeight: '600',
  },
  accuracyButtonEdit: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  accuracyButtonTextEdit: {
    ...typography.bodyMedium,
    color: colors.primary,
    fontWeight: '600',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray20,
  },
  primaryButton: {
    paddingVertical: spacing.md + 2,
    borderRadius: radius.full,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  primaryButtonText: {
    ...typography.h4,
    color: colors.white,
    fontSize: 17,
    fontWeight: '600',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.gray10,
  },
  secondaryButtonText: {
    ...typography.caption,
    color: colors.gray70,
    fontWeight: '600',
  },
});
