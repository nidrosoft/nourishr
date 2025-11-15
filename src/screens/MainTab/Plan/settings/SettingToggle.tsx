import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { colors, typography, spacing } from '../../../../theme';

interface SettingToggleProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export const SettingToggle: React.FC<SettingToggleProps> = ({ label, value, onValueChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.gray30, true: '#FFD699' }}
        thumbColor={value ? colors.primary : colors.white}
        ios_backgroundColor={colors.gray30}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray10,
  },
  label: {
    ...typography.body,
    color: colors.black,
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
});
