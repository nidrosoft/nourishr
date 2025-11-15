import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, typography, spacing, radius } from '../../../../../theme';
import { NourishrIcon } from '../../../../../components';

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const handleClear = () => {
    onChange(null);
    setShowPicker(false);
  };

  return (
    <View>
      <TouchableOpacity style={styles.picker} onPress={() => setShowPicker(true)}>
        <View style={styles.pickerContent}>
          <NourishrIcon name="Calendar" size={20} color={value ? colors.primary : colors.gray50} />
          <Text style={[styles.label, !value && styles.placeholder]}>
            {value ? formatDate(value) : 'Select expiration date'}
          </Text>
        </View>
        {value && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <NourishrIcon name="CloseCircle" size={20} color={colors.gray50} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          minimumDate={new Date()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.gray10,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  pickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  label: {
    ...typography.body,
    color: colors.black,
    fontSize: 16,
  },
  placeholder: {
    color: colors.gray50,
  },
  clearButton: {
    padding: spacing.xs / 2,
  },
});
