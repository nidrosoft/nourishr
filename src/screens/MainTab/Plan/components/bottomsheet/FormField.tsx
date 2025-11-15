import React from 'react';
import { View, Text, StyleSheet, TextInput, TextInputProps } from 'react-native';
import { colors, typography, spacing, radius } from '../../../../../theme';

interface FormFieldProps extends TextInputProps {
  label: string;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({ label, required, ...inputProps }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.gray50}
        {...inputProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.bodyMedium,
    color: colors.gray70,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  required: {
    color: '#E63946',
  },
  input: {
    ...typography.body,
    backgroundColor: colors.gray10,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.black,
    borderWidth: 2,
    borderColor: 'transparent',
  },
});
