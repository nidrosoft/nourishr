import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Circle } from 'react-native-svg';
import { colors, spacing, typography, radius } from '../../../../theme';
import { NourishrIcon } from '../../../../components/NourishrIcon';
import { BarcodeProductData, ServingOption } from './types';

interface ResultsScreenProps {
  imageUri: string;
  productData: BarcodeProductData;
  onClose: () => void;
  onSave: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  imageUri,
  productData,
  onClose,
  onSave,
}) => {
  const insets = useSafeAreaInsets();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <View style={styles.container}>
      {/* Header with Gradient Background */}
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
          {/* Product Photo */}
          <View style={styles.photoCard}>
            <Image
              source={{ uri: imageUri || 'https://via.placeholder.com/80' }}
              style={styles.photoCardImage}
            />
          </View>

          {/* Product Info */}
          <View style={styles.productInfo}>
            <Text style={styles.brandName} numberOfLines={1}>
              {productData.brand}
            </Text>
            <Text style={styles.productName} numberOfLines={2}>
              {productData.productName}
            </Text>
            <Text style={styles.barcodeNumber}>
              Barcode: {productData.barcode}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Info Card */}
        <View style={styles.productInfoCard}>
          <Text style={styles.sectionTitle}>Product Info</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Serving Size</Text>
            <View style={styles.infoBadge}>
              <Text style={styles.infoBadgeText}>{productData.servingSize}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Servings Per Container</Text>
            <View style={styles.infoBadge}>
              <Text style={styles.infoBadgeText}>{productData.servingsPerContainer}</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats Card */}
        <View style={styles.quickStatsCard}>
          <Text style={styles.sectionTitle}>Nutrition Facts</Text>

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
                  <Circle cx={50} cy={50} r={42} stroke="#FFE0B2" strokeWidth={5} fill="none" />
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
                  <Text style={styles.ringPercentage}>100%</Text>
                  <Text style={[styles.ringValue, { color: '#FF9800' }]}>
                    {productData.calories}
                  </Text>
                </View>
              </View>
              <Text style={styles.statLabel}>Calories</Text>
            </View>

            {/* Protein */}
            <View style={[styles.statCard, { backgroundColor: '#FCE4EC' }]}>
              <View style={styles.ringContainer}>
                <Svg width={100} height={100}>
                  <Circle cx={50} cy={50} r={42} stroke="#F8BBD0" strokeWidth={5} fill="none" />
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
                  <Text style={[styles.ringValue, { color: '#E91E63' }]}>
                    {productData.protein}g
                  </Text>
                </View>
              </View>
              <Text style={styles.statLabel}>Protein</Text>
            </View>

            {/* Carbs */}
            <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
              <View style={styles.ringContainer}>
                <Svg width={100} height={100}>
                  <Circle cx={50} cy={50} r={42} stroke="#C8E6C9" strokeWidth={5} fill="none" />
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
                  <Text style={[styles.ringValue, { color: '#4CAF50' }]}>
                    {productData.carbs}g
                  </Text>
                </View>
              </View>
              <Text style={styles.statLabel}>Carbs</Text>
            </View>

            {/* Fat */}
            <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
              <View style={styles.ringContainer}>
                <Svg width={100} height={100}>
                  <Circle cx={50} cy={50} r={42} stroke="#FFE0B2" strokeWidth={5} fill="none" />
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
                  <Text style={[styles.ringValue, { color: '#FF9800' }]}>
                    {productData.fat}g
                  </Text>
                </View>
              </View>
              <Text style={styles.statLabel}>Fat</Text>
            </View>
          </ScrollView>
        </View>

        {/* Safety Check Card - User-specific warnings */}
        {productData.allergens.length > 0 && (
          <View style={styles.safetyCard}>
            <View style={styles.safetyHeader}>
              <NourishrIcon name="Warning2" size={24} color="#E63946" />
              <Text style={styles.safetyTitle}>Safety Check</Text>
            </View>
            <Text style={styles.safetyDescription}>
              This product contains ingredients that may not be safe for you based on your profile.
            </Text>
            <View style={styles.allergensList}>
              {productData.allergens.map((allergen, index) => (
                <View key={index} style={styles.allergenChip}>
                  <Text style={styles.allergenText}>⚠️ {allergen}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Ingredients Card */}
        <View style={styles.ingredientsCard}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <Text style={styles.ingredientsText}>{productData.ingredients}</Text>
        </View>

        {/* Nutrition Details Card */}
        <View style={styles.nutritionDetailsCard}>
          <Text style={styles.sectionTitle}>Nutrition Details</Text>

          {/* Macronutrients */}
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
                  <Text style={styles.macroValue}>{productData.protein}g</Text>
                </View>
                <View style={styles.macroRow}>
                  <Text style={styles.macroLabel}>Carbohydrates</Text>
                  <Text style={styles.macroValue}>{productData.carbs}g</Text>
                </View>
                <View style={styles.macroRow}>
                  <Text style={styles.macroLabel}>Fat</Text>
                  <Text style={styles.macroValue}>{productData.fat}g</Text>
                </View>
                <View style={styles.macroRow}>
                  <Text style={styles.macroLabel}>Fiber</Text>
                  <Text style={styles.macroValue}>{productData.fiber}g</Text>
                </View>
                <View style={styles.macroRow}>
                  <Text style={styles.macroLabel}>Sugar</Text>
                  <Text style={styles.macroValue}>{productData.sugar}g</Text>
                </View>
                <View style={styles.macroRow}>
                  <Text style={styles.macroLabel}>Sodium</Text>
                  <Text style={styles.macroValue}>{productData.sodium}mg</Text>
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
                {productData.micronutrients.map((nutrient, index) => (
                  <View key={index} style={styles.macroRow}>
                    <Text style={styles.macroLabel}>{nutrient.name}</Text>
                    <Text style={styles.macroValue}>
                      {nutrient.amount}
                      {nutrient.unit}
                      {nutrient.dailyValue && ` (${nutrient.dailyValue}% DV)`}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>


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
                {Object.entries(productData.dietCompatibility).map(([diet, compatible]) => (
                  <View key={diet} style={styles.dietRow}>
                    <Text style={styles.dietLabel}>
                      {diet.charAt(0).toUpperCase() + diet.slice(1).replace(/([A-Z])/g, ' $1')}
                    </Text>
                    <View
                      style={[
                        styles.dietBadge,
                        { backgroundColor: compatible ? '#E8F5E9' : '#FFE5E5' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.dietBadgeText,
                          { color: compatible ? '#2D6A4F' : '#E63946' },
                        ]}
                      >
                        {compatible ? '✓ Yes' : '✗ No'}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>
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
            <Text style={styles.primaryButtonText}>Save to my day</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.secondaryActions}>
          <TouchableOpacity style={styles.secondaryButton}>
            <NourishrIcon name="Star" size={18} color={colors.gray70} />
            <Text style={styles.secondaryButtonText}>Favorite</Text>
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
    paddingBottom: spacing.lg,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: spacing.xs,
    marginBottom: spacing.sm,
  },
  headerContent: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  photoCard: {
    width: 80,
    height: 80,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  photoCardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productInfo: {
    flex: 1,
  },
  brandName: {
    ...typography.caption,
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.9,
    marginBottom: spacing.xs / 2,
  },
  productName: {
    ...typography.h3,
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.xs / 2,
  },
  barcodeNumber: {
    ...typography.caption,
    color: colors.white,
    fontSize: 11,
    opacity: 0.8,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  productInfoCard: {
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    ...typography.body,
    color: colors.gray70,
    fontSize: 14,
  },
  infoBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
  },
  infoBadgeText: {
    ...typography.body,
    color: '#1565C0',
    fontWeight: '600',
    fontSize: 14,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.black,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.md,
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
  statLabel: {
    ...typography.body,
    color: colors.black,
    fontSize: 14,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  safetyCard: {
    backgroundColor: '#FFE5E5',
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: '#E63946',
  },
  safetyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  safetyTitle: {
    ...typography.h3,
    color: '#E63946',
    fontWeight: '700',
    fontSize: 18,
  },
  safetyDescription: {
    ...typography.body,
    color: '#C1121F',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  allergensList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  allergenChip: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#E63946',
  },
  allergenText: {
    ...typography.body,
    color: '#E63946',
    fontWeight: '600',
    fontSize: 14,
  },
  ingredientsCard: {
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
  ingredientsText: {
    ...typography.body,
    color: colors.gray70,
    fontSize: 14,
    lineHeight: 20,
  },
  nutritionDetailsCard: {
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
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
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
    justifyContent: 'center',
    gap: spacing.lg,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  secondaryButtonText: {
    ...typography.body,
    color: colors.gray70,
    fontWeight: '600',
  },
});
