import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing } from '../../theme';
import { useApp } from '../../context/AppContext';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const { isLoading } = useApp();
  const [displayedLogo, setDisplayedLogo] = useState('');
  const [displayedTagline, setDisplayedTagline] = useState('');
  const [showTagline, setShowTagline] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  const logoText = 'Nourishr';
  const taglineText = 'Dinner, solved.';

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // Type out logo - faster animation (60ms per letter)
      let logoIndex = 0;
      const logoInterval = setInterval(() => {
        if (logoIndex < logoText.length) {
          setDisplayedLogo(logoText.slice(0, logoIndex + 1));
          // Haptic feedback on each letter
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          logoIndex++;
        } else {
          clearInterval(logoInterval);
          // Start tagline after logo is complete
          setTimeout(() => {
            setShowTagline(true);
            let taglineIndex = 0;
            const taglineInterval = setInterval(() => {
              if (taglineIndex < taglineText.length) {
                setDisplayedTagline(taglineText.slice(0, taglineIndex + 1));
                // Lighter haptic for tagline
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                taglineIndex++;
              } else {
                clearInterval(taglineInterval);
              }
            }, 80); // Slightly slower for tagline
          }, 300); // Small pause before tagline
        }
      }, 60); // Faster logo animation

      // Complete after 5 seconds total
      const timer = setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onComplete();
      }, 5000);

      return () => {
        clearInterval(logoInterval);
        clearTimeout(timer);
      };
    }
  }, [isLoading, onComplete]);

  return (
    <LinearGradient
      colors={['#FF9500', '#FD6A2F']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View style={styles.content}>
        <Text style={styles.logo}>
          {displayedLogo}
          {showCursor && <Text style={styles.cursor}>|</Text>}
        </Text>
        {showTagline && (
          <Text style={styles.tagline}>{displayedTagline}</Text>
        )}
      </View>
      <ActivityIndicator
        size="large"
        color={colors.white}
        style={styles.loader}
      />
      <View style={styles.footer}>
        <Text style={styles.footerText}>BY CYRIAC ZEH</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    minHeight: 100,
  },
  logo: {
    ...typography.headingXL,
    fontSize: 48,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.sm,
    minHeight: 56,
  },
  cursor: {
    ...typography.headingXL,
    fontSize: 48,
    fontWeight: '300',
    color: colors.white,
    opacity: 0.7,
  },
  tagline: {
    ...typography.body,
    color: colors.white,
    opacity: 0.9,
    marginTop: spacing.xs,
  },
  loader: {
    position: 'absolute',
    bottom: spacing.xxl + 40,
  },
  footer: {
    position: 'absolute',
    bottom: spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    ...typography.caption,
    color: colors.white,
    opacity: 0.8,
    letterSpacing: 1.5,
    fontWeight: '600',
  },
});
