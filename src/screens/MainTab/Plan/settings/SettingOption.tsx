import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius } from '../../../../theme';
import { NourishrIcon } from '../../../../components';

interface SettingOptionProps {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
}

export const SettingOption: React.FC<SettingOptionProps> = ({
  label,
  description,
  selected,
  onPress,
}) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.containerSelected]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
        {description && (
          <Text style={[styles.description, selected && styles.descriptionSelected]}>
            {description}
          </Text>
        )}
      </View>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.xs,
    backgroundColor: colors.white,
  },
  containerSelected: {
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    marginRight: spacing.md,
  },
  label: {
    ...typography.body,
    color: colors.gray70,
    fontSize: 15,
    fontWeight: '500',
  },
  labelSelected: {
    color: colors.black,
    fontWeight: '600',
  },
  description: {
    ...typography.caption,
    color: colors.gray60,
    fontSize: 12,
    marginTop: 2,
  },
  descriptionSelected: {
    color: colors.gray70,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.gray30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
});
