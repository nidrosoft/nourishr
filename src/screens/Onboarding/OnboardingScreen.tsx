import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, radius } from '../../theme';
import { PrimaryButton, NourishrIcon } from '../../components';
import { useApp } from '../../context/AppContext';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  title: string;
  subtitle: string;
  icon: string;
  gradientColors: string[];
  floatingIcons?: string[];
}

const slides: OnboardingSlide[] = [
  {
    title: 'Eat Smarter. Live Better.',
    subtitle:
      'Nourishr learns your tastes, habits, cravings, and lifestyle and builds a food world that is made just for you.',
    icon: 'Sparkles',
    gradientColors: ['#FF9500', '#FFB84D', '#FFCC80'],
    floatingIcons: ['🍎', '🥑', '🍕', '🥗', '🍜'],
  },
  {
    title: 'Your Personal Food Intelligence.',
    subtitle:
      'From what is in your fridge to what you are craving tonight, Nourishr uses AI to suggest meals that fit your diet, your goals, and your routine.',
    icon: 'Brain',
    gradientColors: ['#FF6B6B', '#FF8E8E', '#FFB1B1'],
    floatingIcons: ['🥕', '🍳', '🍱'],
  },
  {
    title: 'One App. Endless Options.',
    subtitle:
      'Whether you want a recipe you can cook now or a meal you can order instantly, Nourishr brings everything together in one smart place.',
    icon: 'Chef',
    gradientColors: ['#4ECDC4', '#6FD9D1', '#90E5DE'],
    floatingIcons: ['🍳', '📦', '🚗'],
  },
  {
    title: 'Eat Well Without Thinking Twice.',
    subtitle:
      'Get calorie insights, allergy protection, ingredient scanning, and personalized weekly meal rotations all automatically tailored to you.',
    icon: 'Shield',
    gradientColors: ['#95E1D3', '#A8E8DD', '#BBEFE7'],
    floatingIcons: ['🛡️', '📊', '🔍'],
  },
  {
    title: 'Built Around Your Lifestyle.',
    subtitle:
      'Tell us your dietary needs, dislikes, and cooking habits and we will handle the rest. Welcome to food that fits your life perfectly.',
    icon: 'Star',
    gradientColors: ['#A8E6CF', '#B8ECD7', '#C8F2DF'],
    floatingIcons: ['🌟', '💚', '🎯'],
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onComplete,
}) => {
  const { setIsFirstLaunch, setIsAuthenticated } = useApp();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: width * (currentIndex + 1),
        animated: true,
      });
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setIsFirstLaunch(false);
    onComplete();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with Stepper and Skip */}
      <View style={styles.header}>
        <View style={styles.stepper}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.stepperBar,
                index === currentIndex
                  ? styles.stepperBarActive
                  : index < currentIndex
                  ? styles.stepperBarCompleted
                  : styles.stepperBarInactive,
              ]}
            />
          ))}
        </View>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
          <NourishrIcon name="ArrowRight" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {slides.map((slide, index) => (
          <View key={index} style={styles.slide}>
            {/* Title and Subtitle - Top */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.subtitle}>{slide.subtitle}</Text>
            </View>

            {/* Illustration with Gradient - Bottom */}
            <View style={styles.illustrationContainer}>
              <LinearGradient
                colors={slide.gradientColors}
                style={styles.gradientCircle}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <NourishrIcon name={slide.icon as any} size={80} color="#FFFFFF" />
                
                {/* Floating Icons */}
                {slide.floatingIcons && slide.floatingIcons.map((emoji, i) => (
                  <Text key={i} style={[styles.floatingIcon, styles[`floatingIcon${i}` as keyof typeof styles]]}>
                    {emoji}
                  </Text>
                ))}
              </LinearGradient>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.footer}>
        <PrimaryButton
          title={currentIndex === slides.length - 1 ? 'Get Started' : 'Continue'}
          onPress={handleNext}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  stepper: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  stepperBar: {
    width: 40,
    height: 4,
    borderRadius: radius.sm,
  },
  stepperBarActive: {
    backgroundColor: colors.primary,
  },
  stepperBarCompleted: {
    backgroundColor: colors.primary,
  },
  stepperBarInactive: {
    backgroundColor: colors.gray30,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  skipText: {
    ...typography.bodyMedium,
    color: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  gradientCircle: {
    width: 300,
    height: 300,
    borderRadius: 150,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  floatingIcon: {
    position: 'absolute',
    fontSize: 32,
  },
  floatingIcon0: {
    top: 20,
    left: 30,
  },
  floatingIcon1: {
    top: 40,
    right: 40,
  },
  floatingIcon2: {
    bottom: 30,
    left: 40,
  },
  floatingIcon3: {
    bottom: 50,
    right: 30,
  },
  floatingIcon4: {
    top: 120,
    left: 10,
  },
  textContainer: {
    paddingTop: spacing.md,
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.headingL,
    color: colors.black,
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.body,
    color: colors.gray60,
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
});
