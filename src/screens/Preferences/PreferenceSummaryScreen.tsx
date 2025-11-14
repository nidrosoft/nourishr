import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing, radius } from '../../theme';
import { NourishrIcon, PrimaryButton, PreferenceHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';

type PreferenceSummaryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PreferenceSummary'>;

interface PreferenceSummaryScreenProps {
  navigation: PreferenceSummaryScreenNavigationProp;
}

interface SummaryCard {
  id: string;
  title: string;
  icon: string;
  items: string[];
  route: keyof RootStackParamList;
  step: number;
}

export const PreferenceSummaryScreen: React.FC<PreferenceSummaryScreenProps> = ({ navigation }) => {
  // Mock data - in a real app, this would come from context/state management
  const summaryCards: SummaryCard[] = [
    {
      id: 'identity',
      title: 'Your Profile',
      icon: 'Profile',
      items: ['Name & preferences', 'Household size', 'Dietary restrictions'],
      route: 'PreferenceIdentity',
      step: 1
    },
    {
      id: 'diet',
      title: 'Diet & Rules',
      icon: 'DocumentText',
      items: ['Dietary patterns', 'Religious rules', 'Custom restrictions'],
      route: 'PreferenceDiet',
      step: 3
    },
    {
      id: 'allergies',
      title: 'Allergies & Avoid List',
      icon: 'Warning2',
      items: ['Allergens & intolerances', 'Things you dislike', 'Severity levels'],
      route: 'PreferenceAllergiesIntolerances',
      step: 4
    },
    {
      id: 'loves',
      title: 'Favorite Cuisines & Flavors',
      icon: 'Heart',
      items: ['Preferred cuisines', 'Flavor profiles', 'Favorite meal types'],
      route: 'PreferenceLoves',
      step: 6
    },
    {
      id: 'cooking',
      title: 'Cooking Style',
      icon: 'Setting',
      items: ['Skill level', 'Time per meal', 'Kitchen equipment', 'Prep tolerance'],
      route: 'PreferenceCookingStyle',
      step: 7
    },
    {
      id: 'lifestyle',
      title: 'Lifestyle & Budget',
      icon: 'Activity',
      items: ['Meals per day', 'Cook vs order ratio', 'Budget preferences', 'Health goals'],
      route: 'PreferenceLifestyle',
      step: 8
    },
    {
      id: 'location',
      title: 'Location & Delivery',
      icon: 'Location',
      items: ['Primary location', 'Delivery radius', 'Address preferences'],
      route: 'PreferenceLocation',
      step: 9
    }
  ];

  const handleEdit = (route: keyof RootStackParamList) => {
    navigation.navigate(route);
  };

  const handleFinish = () => {
    // Navigate to account setup or main app
    navigation.navigate('AccountSetup');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <PreferenceHeader
        currentStep={10}
        totalSteps={10}
        icon="TickSquare"
        onClose={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Review your preferences</Text>
        <Text style={styles.subtitle}>
          Everything looks good? You can always edit these later in your profile settings.
        </Text>

        {/* Summary Cards */}
        <View style={styles.cardsContainer}>
          {summaryCards.map((card, index) => (
            <View key={card.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <View style={styles.iconContainer}>
                    <NourishrIcon name={card.icon as any} size={20} color={colors.primary} variant="bold" />
                  </View>
                  <View style={styles.cardTitleContainer}>
                    <Text style={styles.cardTitle}>{card.title}</Text>
                    <Text style={styles.cardStep}>Step {card.step} of 10</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit(card.route)}
                >
                  <NourishrIcon name="Edit" size={16} color={colors.primary} />
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.cardContent}>
                {card.items.map((item, itemIndex) => (
                  <View key={itemIndex} style={styles.cardItem}>
                    <View style={styles.bulletPoint} />
                    <Text style={styles.cardItemText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <NourishrIcon name="InfoCircle" size={20} color={colors.primary} />
          <Text style={styles.infoText}>
            Your preferences help us personalize meal recommendations, recipes, and ordering suggestions just for you.
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <NourishrIcon name="TickCircle" size={24} color={colors.primary} variant="bold" />
            <Text style={styles.statNumber}>{summaryCards.length}</Text>
            <Text style={styles.statLabel}>Sections Complete</Text>
          </View>
          <View style={styles.statCard}>
            <NourishrIcon name="Star" size={24} color={colors.primary} variant="bold" />
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>Profile Ready</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.secondaryButtonText}>Go Back</Text>
        </TouchableOpacity>
        <View style={styles.primaryButtonWrapper}>
          <PrimaryButton
            title="Looks good! Finish setup"
            onPress={handleFinish}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  content: { flex: 1, paddingHorizontal: spacing.lg },
  title: { ...typography.headingXL, fontSize: 32, fontWeight: '700', color: colors.black, marginBottom: spacing.sm },
  subtitle: { ...typography.body, fontSize: 16, color: colors.gray60, marginBottom: spacing.xl, lineHeight: 22 },
  
  // Cards Container
  cardsContainer: { gap: spacing.md, marginBottom: spacing.lg },
  
  // Card
  card: { backgroundColor: colors.white, borderWidth: 2, borderColor: colors.gray20, borderRadius: radius.xl, padding: spacing.lg, gap: spacing.md },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  iconContainer: { width: 48, height: 48, borderRadius: radius.lg, backgroundColor: '#FFF5E6', justifyContent: 'center', alignItems: 'center' },
  cardTitleContainer: { flex: 1 },
  cardTitle: { ...typography.bodyMedium, fontSize: 18, fontWeight: '700', color: colors.black, marginBottom: 2 },
  cardStep: { ...typography.caption, fontSize: 12, color: colors.gray60 },
  
  // Edit Button
  editButton: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: '#FFF5E6', borderRadius: radius.md, paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, borderWidth: 1, borderColor: colors.primary },
  editButtonText: { ...typography.caption, fontSize: 13, fontWeight: '600', color: colors.primary },
  
  // Card Content
  cardContent: { gap: spacing.xs },
  cardItem: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  bulletPoint: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary, marginTop: 6 },
  cardItemText: { ...typography.body, fontSize: 15, color: colors.gray70, lineHeight: 22, flex: 1 },
  
  // Info Box
  infoBox: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#FFF5E6', borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.lg, gap: spacing.sm },
  infoText: { ...typography.caption, fontSize: 14, color: colors.gray70, lineHeight: 20, flex: 1 },
  
  // Stats
  statsContainer: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
  statCard: { flex: 1, backgroundColor: colors.gray10, borderRadius: radius.lg, padding: spacing.lg, alignItems: 'center', gap: spacing.xs },
  statNumber: { ...typography.headingLG, fontSize: 28, fontWeight: '700', color: colors.black },
  statLabel: { ...typography.caption, fontSize: 13, color: colors.gray60, textAlign: 'center' },
  
  // Buttons
  buttonContainer: { flexDirection: 'row', paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, paddingTop: spacing.md, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.gray20, gap: spacing.md },
  secondaryButton: { flex: 1, backgroundColor: colors.gray10, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center', justifyContent: 'center' },
  secondaryButtonText: { ...typography.bodyMedium, fontSize: 16, fontWeight: '600', color: colors.black },
  primaryButtonWrapper: { flex: 2 },
});
