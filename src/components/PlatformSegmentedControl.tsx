import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { colors, typography, spacing, radius } from '../theme';

interface PlatformSegmentedControlProps {
  values: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  style?: any;
}

export const PlatformSegmentedControl: React.FC<PlatformSegmentedControlProps> = ({
  values,
  selectedIndex,
  onChange,
  style,
}) => {
  if (Platform.OS === 'ios') {
    // Use native iOS segmented control
    return (
      <SegmentedControl
        values={values}
        selectedIndex={selectedIndex}
        onChange={(event) => {
          onChange(event.nativeEvent.selectedSegmentIndex);
        }}
        style={[styles.iosSegmentedControl, style]}
        tintColor={colors.primary}
        backgroundColor={colors.gray10}
        fontStyle={{
          color: colors.gray70,
          fontSize: 14,
          fontWeight: '500',
        }}
        activeFontStyle={{
          color: colors.white,
          fontSize: 14,
          fontWeight: '600',
        }}
      />
    );
  }

  // Android: Use Material Design chips
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.androidChipContainer, style]}
    >
      {values.map((value, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.androidChip,
            selectedIndex === index && styles.androidChipSelected,
          ]}
          onPress={() => onChange(index)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.androidChipText,
              selectedIndex === index && styles.androidChipTextSelected,
            ]}
          >
            {value}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  iosSegmentedControl: {
    height: 32,
  },
  androidChipContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  androidChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.gray10,
    borderWidth: 1,
    borderColor: colors.gray20,
  },
  androidChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  androidChipText: {
    ...typography.bodyS,
    color: colors.gray70,
    fontWeight: '500',
  },
  androidChipTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
});
