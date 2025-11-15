import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { colors, typography, spacing, radius } from '../../../../../theme';
import { NourishrIcon } from '../../../../../components';

interface CategoryPickerProps {
  value: string;
  onChange: (category: string) => void;
}

const CATEGORIES = [
  { id: 'dairy', label: 'Dairy & Eggs', icon: '🥚' },
  { id: 'meat', label: 'Meat & Protein', icon: '🍗' },
  { id: 'vegetables', label: 'Vegetables', icon: '🥬' },
  { id: 'fruits', label: 'Fruits', icon: '🍎' },
  { id: 'grains', label: 'Grains & Bread', icon: '🍞' },
  { id: 'condiments', label: 'Condiments & Oils', icon: '🫒' },
  { id: 'snacks', label: 'Snacks & Sweets', icon: '🍪' },
  { id: 'beverages', label: 'Beverages', icon: '🥤' },
  { id: 'other', label: 'Other', icon: '📦' },
];

export const CategoryPicker: React.FC<CategoryPickerProps> = ({ value, onChange }) => {
  const [showModal, setShowModal] = useState(false);

  const selectedCategory = CATEGORIES.find((cat) => cat.id === value);

  const handleSelect = (categoryId: string) => {
    onChange(categoryId);
    setShowModal(false);
  };

  return (
    <>
      <TouchableOpacity style={styles.picker} onPress={() => setShowModal(true)}>
        <View style={styles.pickerContent}>
          {selectedCategory && (
            <>
              <Text style={styles.icon}>{selectedCategory.icon}</Text>
              <Text style={styles.label}>{selectedCategory.label}</Text>
            </>
          )}
          {!selectedCategory && <Text style={styles.placeholder}>Select category</Text>}
        </View>
        <NourishrIcon name="ArrowDown" size={20} color={colors.gray60} />
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <NourishrIcon name="CloseCircle" size={24} color={colors.gray60} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.categoryList}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryItem,
                    value === category.id && styles.categoryItemSelected,
                  ]}
                  onPress={() => handleSelect(category.id)}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={styles.categoryLabel}>{category.label}</Text>
                  {value === category.id && (
                    <NourishrIcon name="TickCircle" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
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
  icon: {
    fontSize: 20,
  },
  label: {
    ...typography.body,
    color: colors.black,
    fontSize: 16,
  },
  placeholder: {
    ...typography.body,
    color: colors.gray50,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    maxHeight: '70%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray10,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.black,
    fontSize: 18,
    fontWeight: '700',
  },
  categoryList: {
    maxHeight: 400,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray10,
  },
  categoryItemSelected: {
    backgroundColor: '#FFF4E6',
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryLabel: {
    ...typography.body,
    color: colors.black,
    fontSize: 16,
    flex: 1,
  },
});
