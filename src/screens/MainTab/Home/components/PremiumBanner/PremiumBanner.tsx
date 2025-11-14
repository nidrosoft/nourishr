import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { colors, typography, spacing, radius } from '../../../../../theme';

export const PremiumBanner: React.FC = () => {
  return (
    <View style={styles.premiumBannerContainer}>
      <View style={styles.premiumBanner}>
        <View style={styles.premiumContent}>
          <MaskedView
            maskElement={
              <Text style={styles.premiumTitle}>Go to premium now!</Text>
            }
          >
            <LinearGradient
              colors={['#FFD700', '#10B981']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={[styles.premiumTitle, { opacity: 0 }]}>Go to premium now!</Text>
            </LinearGradient>
          </MaskedView>
          <Text style={styles.premiumSubtitle}>
            Cook with love, bring the flavors{'\n'}of the world to your table.
          </Text>
          <TouchableOpacity style={styles.premiumButton}>
            <Text style={styles.premiumButtonText}>Start 5-day FREE Trial</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.premiumImageContainer}>
          <Text style={styles.premiumEmoji}>🍗</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  premiumBannerContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  premiumBanner: {
    backgroundColor: colors.black,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  premiumContent: {
    flex: 1,
  },
  premiumTitle: {
    ...typography.h2,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  premiumSubtitle: {
    ...typography.body,
    fontSize: 14,
    color: colors.gray60,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  premiumButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  premiumButtonText: {
    ...typography.body,
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  premiumImageContainer: {
    marginLeft: spacing.md,
  },
  premiumEmoji: {
    fontSize: 64,
  },
});
