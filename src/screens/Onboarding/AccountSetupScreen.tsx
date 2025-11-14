import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../../theme';
import { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../context/AppContext';

type AccountSetupScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AccountSetup'
>;

interface AccountSetupScreenProps {
  navigation: AccountSetupScreenNavigationProp;
}

const SETUP_STEPS = [
  { text: 'Setting up your account...', icon: '⚙️', duration: 1000 },
  { text: 'Analyzing your preferences...', icon: '🧠', duration: 1000 },
  { text: 'Finding perfect meals for you...', icon: '🔍', duration: 1000 },
  { text: 'Discovering local restaurants...', icon: '📍', duration: 1000 },
  { text: 'Almost ready...', icon: '✨', duration: 1000 },
];

export const AccountSetupScreen: React.FC<AccountSetupScreenProps> = ({ navigation }) => {
  const { setIsAuthenticated } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progress, {
      toValue: 100,
      duration: 5000,
      useNativeDriver: false,
    }).start();

    // Cycle through steps
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < SETUP_STEPS.length - 1) {
          // Fade out
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            // Fade in
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }).start();
          });
          return prev + 1;
        }
        return prev;
      });
    }, 1000);

    // Navigate to main app after 5 seconds
    const navigationTimeout = setTimeout(() => {
      setIsAuthenticated(true);
      // The RootNavigator will handle navigation to MainTab
    }, 5000);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(navigationTimeout);
    };
  }, []);

  const progressWidth = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <LinearGradient
      colors={['#FF9500', '#FD6A2F']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>nourishr.</Text>
            <Text style={styles.subtitle}>Your account is being set up</Text>
          </View>

        {/* Animated Step */}
        <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
          <Text style={styles.stepIcon}>{SETUP_STEPS[currentStep].icon}</Text>
          <Text style={styles.stepText}>{SETUP_STEPS[currentStep].text}</Text>
        </Animated.View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressWidth,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round((currentStep + 1) / SETUP_STEPS.length * 100)}%
          </Text>
        </View>

        {/* Loading Dots */}
        <View style={styles.dotsContainer}>
          {[0, 1, 2].map((i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  opacity: progress.interpolate({
                    inputRange: [i * 10, (i + 1) * 10, (i + 2) * 10],
                    outputRange: [0.3, 1, 0.3],
                  }),
                },
              ]}
            />
          ))}
        </View>

        {/* Fun Facts */}
        <View style={styles.factContainer}>
          <Text style={styles.factLabel}>Did you know?</Text>
          <Text style={styles.factText}>
            The average person makes over 200 food decisions every day. We're here to make them easier!
          </Text>
        </View>
      </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: spacing.xxl * 2,
    alignItems: 'center',
  },
  logoText: {
    ...typography.headingXL,
    fontSize: 56,
    fontWeight: '700',
    letterSpacing: -1,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  stepContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
    minHeight: 120,
  },
  stepIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  stepText: {
    ...typography.headingM,
    fontSize: 20,
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: 4,
  },
  progressText: {
    ...typography.body,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.white,
  },
  factContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: spacing.lg,
    marginTop: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  factLabel: {
    ...typography.bodyMedium,
    fontSize: 14,
    fontWeight: '700',
    color: colors.black,
    marginBottom: spacing.xs,
  },
  factText: {
    ...typography.body,
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.8)',
    lineHeight: 20,
  },
});
