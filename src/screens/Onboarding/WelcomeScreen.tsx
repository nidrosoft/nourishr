import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing, radius } from '../../theme';
import { RootStackParamList } from '../../navigation/types';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Welcome'
>;

interface WelcomeScreenProps {
  navigation: WelcomeScreenNavigationProp;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const handleGetStarted = () => {
    navigation.navigate('PreferenceIdentity');
  };

  return (
    <LinearGradient
      colors={['#FF9500', '#FD6A2F']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome Title */}
          <Text style={styles.title}>Welcome to nourishr!</Text>
          
          <Text style={styles.subtitle}>
            Your personal AI-powered meal companion
          </Text>

        {/* Benefits */}
        <View style={styles.benefitsContainer}>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>🍽️</Text>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Personalized Recommendations</Text>
              <Text style={styles.benefitText}>
                Get meal suggestions tailored to your taste, dietary needs, and preferences
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>🤖</Text>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>AI-Powered Assistant</Text>
              <Text style={styles.benefitText}>
                Chat with our intelligent assistant for instant cooking advice and recipe ideas
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>📍</Text>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Local & Delivery Options</Text>
              <Text style={styles.benefitText}>
                Discover nearby restaurants or get ingredients delivered to your door
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>❤️</Text>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Save Your Favorites</Text>
              <Text style={styles.benefitText}>
                Keep track of meals you love and build your personal recipe collection
              </Text>
            </View>
          </View>
        </View>

        {/* Data Collection Notice */}
        <View style={styles.noticeContainer}>
          <Text style={styles.noticeText}>
            To provide you with the best experience, we'll ask a few questions about your food preferences, dietary restrictions, and cooking habits.
          </Text>
        </View>
      </ScrollView>

      {/* CTA Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleGetStarted}
          activeOpacity={0.9}
        >
          <Text style={styles.buttonText}>Let's Do It!</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  title: {
    ...typography.headingXL,
    fontSize: 32,
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  subtitle: {
    ...typography.body,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: spacing.xxl,
    lineHeight: 22,
  },
  benefitsContainer: {
    marginBottom: spacing.xl,
  },
  benefitItem: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  benefitIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    ...typography.bodyMedium,
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  benefitText: {
    ...typography.body,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 20,
  },
  noticeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  noticeText: {
    ...typography.body,
    fontSize: 14,
    color: colors.white,
    lineHeight: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: 'transparent',
  },
  button: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    ...typography.bodyMedium,
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
});
