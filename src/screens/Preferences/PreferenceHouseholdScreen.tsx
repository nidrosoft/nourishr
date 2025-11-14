import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing, radius } from '../../theme';
import { NourishrIcon, PrimaryButton, PreferenceHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';

type PreferenceHouseholdScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PreferenceHousehold'>;

interface PreferenceHouseholdScreenProps {
  navigation: PreferenceHouseholdScreenNavigationProp;
}

const HOUSEHOLD_SIZE_OPTIONS = [
  { id: 'solo', label: 'Just Me', value: 1 },
  { id: 'couple', label: '2 People', value: 2 },
  { id: 'family', label: 'Family (3-5)', value: 4 },
  { id: 'large', label: 'Big Household (6+)', value: 6 },
  { id: 'custom', label: 'Custom', value: 0 },
];

const HOUSEHOLD_MEMBERS = [
  { id: 'adults', label: 'Adults' },
  { id: 'kids', label: 'Kids' },
  { id: 'elders', label: 'Elders' },
  { id: 'roommates', label: 'Roommates' },
  { id: 'partner', label: 'Partner' },
];

export const PreferenceHouseholdScreen: React.FC<PreferenceHouseholdScreenProps> = ({ navigation, route }) => {
  const gender = route.params?.gender;
  const [householdSize, setHouseholdSize] = useState<string>('');
  const [customSize, setCustomSize] = useState<number>(1);
  const [householdMembers, setHouseholdMembers] = useState<string[]>([]);
  const [servingSize, setServingSize] = useState<number>(2);

  const toggleMember = (id: string) => {
    setHouseholdMembers(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const incrementCustomSize = () => {
    if (customSize < 20) setCustomSize(prev => prev + 1);
  };

  const decrementCustomSize = () => {
    if (customSize > 1) setCustomSize(prev => prev - 1);
  };

  const incrementServingSize = () => {
    if (servingSize < 8) setServingSize(prev => prev + 1);
  };

  const decrementServingSize = () => {
    if (servingSize > 1) setServingSize(prev => prev - 1);
  };

  const isValid = householdSize !== '' && householdMembers.length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <PreferenceHeader
        currentStep={2}
        totalSteps={10}
        icon="People"
        onClose={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Who do we cook and order for?</Text>
        <Text style={styles.subtitle}>
          Help us understand your household so we can recommend the right portions and meal options
        </Text>

        {/* Household Size */}
        <Text style={styles.sectionTitle}>Number of people you usually eat with</Text>
        <View style={styles.chipsContainer}>
          {HOUSEHOLD_SIZE_OPTIONS.map(option => (
            <TouchableOpacity
              key={option.id}
              style={[styles.chip, householdSize === option.id && styles.chipSelected]}
              onPress={() => setHouseholdSize(option.id)}
            >
              <Text style={[styles.chipLabel, householdSize === option.id && styles.chipLabelSelected]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Size Stepper */}
        {householdSize === 'custom' && (
          <View style={styles.stepperContainer}>
            <Text style={styles.stepperLabel}>How many people?</Text>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={decrementCustomSize}
                disabled={customSize <= 1}
              >
                <NourishrIcon name="Minus" size={20} color={customSize <= 1 ? colors.gray40 : colors.black} />
              </TouchableOpacity>
              <Text style={styles.stepperValue}>{customSize}</Text>
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={incrementCustomSize}
                disabled={customSize >= 20}
              >
                <NourishrIcon name="Add" size={20} color={customSize >= 20 ? colors.gray40 : colors.black} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Household Members */}
        <Text style={styles.sectionTitle}>Who are they?</Text>
        <View style={styles.chipsContainer}>
          {HOUSEHOLD_MEMBERS.map(member => (
            <TouchableOpacity
              key={member.id}
              style={[styles.chip, householdMembers.includes(member.id) && styles.chipSelected]}
              onPress={() => toggleMember(member.id)}
            >
              <Text style={[styles.chipLabel, householdMembers.includes(member.id) && styles.chipLabelSelected]}>
                {member.label}
              </Text>
              {householdMembers.includes(member.id) && (
                <View style={styles.chipCheckmark}>
                  <NourishrIcon name="TickCircle" size={16} color={colors.primary} variant="bold" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Default Serving Size */}
        <Text style={styles.sectionTitle}>Default serving size</Text>
        <View style={styles.servingSizeContainer}>
          <TouchableOpacity
            style={styles.servingButton}
            onPress={decrementServingSize}
            disabled={servingSize <= 1}
          >
            <NourishrIcon name="Minus" size={20} color={servingSize <= 1 ? colors.gray40 : colors.white} />
          </TouchableOpacity>
          <View style={styles.servingDisplay}>
            <Text style={styles.servingValue}>{servingSize}</Text>
            <Text style={styles.servingLabel}>{servingSize === 1 ? 'serving' : 'servings'}</Text>
          </View>
          <TouchableOpacity
            style={styles.servingButton}
            onPress={incrementServingSize}
            disabled={servingSize >= 8}
          >
            <NourishrIcon name="Add" size={20} color={servingSize >= 8 ? colors.gray40 : colors.white} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title="Next"
          onPress={() => navigation.navigate('PreferenceDiet', { gender })}
          disabled={!isValid}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.headingXL,
    fontSize: 32,
    fontWeight: '700',
    color: colors.black,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    fontSize: 16,
    color: colors.gray60,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  sectionTitle: {
    ...typography.bodyMedium,
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionSubtitle: {
    ...typography.caption,
    fontSize: 14,
    color: colors.gray60,
    marginBottom: spacing.md,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.gray20,
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: '#FFF5E6',
  },
  chipLabel: {
    ...typography.body,
    fontSize: 15,
    fontWeight: '500',
    color: colors.black,
  },
  chipLabelSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  chipCheckmark: {
    marginLeft: spacing.xs,
  },
  stepperContainer: {
    backgroundColor: colors.gray10,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  stepperLabel: {
    ...typography.bodyMedium,
    fontSize: 15,
    fontWeight: '600',
    color: colors.black,
    marginBottom: spacing.sm,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  stepperButton: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperValue: {
    ...typography.headingLG,
    fontSize: 32,
    fontWeight: '700',
    color: colors.black,
    minWidth: 60,
    textAlign: 'center',
  },
  servingSizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray10,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  servingButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  servingDisplay: {
    alignItems: 'center',
    marginHorizontal: spacing.lg,
  },
  servingValue: {
    ...typography.headingXL,
    fontSize: 36,
    fontWeight: '700',
    color: colors.primary,
  },
  servingLabel: {
    ...typography.body,
    fontSize: 14,
    color: colors.gray60,
    marginTop: 2,
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray20,
  },
});
