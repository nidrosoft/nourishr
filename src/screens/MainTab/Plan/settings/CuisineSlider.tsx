import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing } from '../../../../theme';

interface CuisineSliderProps {
  label: string;
  value: number;
  onChange?: (value: number) => void;
}

export const CuisineSlider: React.FC<CuisineSliderProps> = ({ label, value: initialValue, onChange }) => {
  const [value, setValue] = useState(initialValue);
  const lastHapticValue = useRef(initialValue);

  const handleValueChange = (newValue: number) => {
    // Trigger haptic feedback every 0.1 change
    const roundedValue = Math.round(newValue * 10) / 10;
    if (Math.abs(roundedValue - lastHapticValue.current) >= 0.1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      lastHapticValue.current = roundedValue;
    }
    
    setValue(newValue);
    onChange?.(newValue);
  };

  const getIntensityLabel = () => {
    if (value < 0.3) return 'Rarely';
    if (value < 0.6) return 'Sometimes';
    if (value < 0.8) return 'Often';
    return 'Very Often';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.intensity}>{getIntensityLabel()}</Text>
      </View>
      <Slider
        style={styles.slider}
        value={value}
        onValueChange={handleValueChange}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.gray20}
        thumbTintColor={colors.primary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.body,
    color: colors.black,
    fontSize: 15,
    fontWeight: '500',
  },
  intensity: {
    ...typography.caption,
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  slider: {
    width: '100%',
    height: 40,
  },
});
