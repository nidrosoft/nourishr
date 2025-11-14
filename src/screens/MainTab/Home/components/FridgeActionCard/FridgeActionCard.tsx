import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radius } from '../../../../../theme';
import { NourishrIcon } from '../../../../../components';

interface FridgeActionCardProps {
  onPress: () => void;
}

export const FridgeActionCard: React.FC<FridgeActionCardProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.fridgeActionCard} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.fridgeActionContent}>
        <Text style={styles.fridgeActionEmoji}>🧊</Text>
        <View style={styles.fridgeActionText}>
          <Text style={styles.fridgeActionTitle}>What's in your fridge?</Text>
          <Text style={styles.fridgeActionSubtitle}>Get instant meal ideas</Text>
        </View>
      </View>
      <NourishrIcon name="ArrowRight" size={20} color={colors.gray60} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fridgeActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.gray10,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray20,
  },
  fridgeActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fridgeActionEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  fridgeActionText: {
    flex: 1,
  },
  fridgeActionTitle: {
    ...typography.bodyMedium,
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 2,
  },
  fridgeActionSubtitle: {
    ...typography.caption,
    color: colors.gray60,
  },
});
