import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing } from '../theme';
import { NourishrIcon } from './NourishrIcon';

interface PreferenceHeaderProps {
  currentStep: number;
  totalSteps: number;
  icon: string;
  onClose: () => void;
}

export const PreferenceHeader: React.FC<PreferenceHeaderProps> = ({
  currentStep,
  totalSteps,
  icon,
  onClose,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={onClose}
      >
        <NourishrIcon name="CloseSquare" size={24} color={colors.black} />
      </TouchableOpacity>
      <View style={styles.headerLeft}>
        <View style={styles.headerIconCircle}>
          <NourishrIcon name={icon as any} size={24} color={colors.black} variant="bold" />
        </View>
        {/* Segmented Progress Indicator */}
        <View style={styles.segmentedProgress}>
          {[...Array(totalSteps)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressSegment,
                index < currentStep && styles.progressSegmentActive,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: spacing.lg,
    padding: spacing.sm,
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  headerIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.black,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentedProgress: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
  },
  progressSegment: {
    height: 4,
    flex: 1,
    backgroundColor: colors.gray20,
    borderRadius: 2,
  },
  progressSegmentActive: {
    backgroundColor: colors.primary,
  },
});
