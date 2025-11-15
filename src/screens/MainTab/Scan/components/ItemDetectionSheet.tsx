import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, TextInput, ScrollView, Modal, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius } from '../../../../theme';
import { NourishrIcon } from '../../../../components';

interface DetectedItem {
  name: string;
  emoji: string;
  category: string;
  quantity: string;
  unit: string;
  confidence: number;
}

interface ItemDetectionSheetProps {
  item: DetectedItem;
  onAdd: (item: any) => void;
  onCancel: () => void;
}

const CATEGORIES = [
  { label: 'Dairy & Eggs', value: 'dairy', emoji: '🥛' },
  { label: 'Vegetables', value: 'vegetables', emoji: '🥕' },
  { label: 'Fruits', value: 'fruits', emoji: '🍎' },
  { label: 'Meat & Poultry', value: 'meat', emoji: '🍗' },
  { label: 'Pantry Staples', value: 'pantry', emoji: '🍝' },
  { label: 'Frozen', value: 'frozen', emoji: '❄️' },
  { label: 'Spices', value: 'spices', emoji: '🌶️' },
  { label: 'Beverages', value: 'beverages', emoji: '🥤' },
];

const UNITS = ['pieces', 'pack', 'bottle', 'kg', 'g', 'L', 'ml', 'can', 'box'];

export const ItemDetectionSheet: React.FC<ItemDetectionSheetProps> = ({ item, onAdd, onCancel }) => {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState(item.name);
  const [emoji, setEmoji] = useState(item.emoji);
  const [category, setCategory] = useState(item.category);
  const [quantity, setQuantity] = useState(parseInt(item.quantity) || 1);
  const [unit, setUnit] = useState(item.unit);
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const slideAnim = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
  }, []);

  const handleAdd = async () => {
    // Haptic feedback
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    const itemData = {
      id: Date.now().toString(),
      name,
      emoji,
      category,
      quantity: `${quantity}`,
      unit,
      expirationDate: expirationDate ? expirationDate.toISOString() : null,
      addedDate: new Date().toISOString(),
    };
    onAdd(itemData);
  };

  const handleCancel = () => {
    Animated.timing(slideAnim, {
      toValue: 600,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onCancel();
    });
  };

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => setQuantity(Math.max(1, quantity - 1));

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setExpirationDate(selectedDate);
      if (Platform.OS === 'ios') {
        setShowDatePicker(false);
      }
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select date';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleUnitSelect = (selectedUnit: string) => {
    setUnit(selectedUnit);
    setShowUnitPicker(false);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom + spacing.lg,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.handle} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>We found:</Text>
          <View style={styles.detectedItem}>
            <Text style={styles.detectedEmoji}>{emoji}</Text>
            <Text style={styles.detectedName}>{name}</Text>
            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceText}>{Math.round(item.confidence * 100)}% match</Text>
            </View>
          </View>
        </View>

        {/* Name Field */}
        <View style={styles.field}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Item name"
            placeholderTextColor={colors.gray40}
          />
        </View>

        {/* Category */}
        <View style={styles.field}>
          <Text style={styles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.value}
                style={[styles.categoryPill, category === cat.label && styles.categoryPillActive]}
                onPress={() => setCategory(cat.label)}
              >
                <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                <Text style={[styles.categoryText, category === cat.label && styles.categoryTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quantity & Unit */}
        <View style={styles.row}>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>Quantity</Text>
            <View style={styles.quantityControl}>
              <TouchableOpacity style={styles.quantityButton} onPress={decrementQuantity}>
                <NourishrIcon name="Minus" size={16} color={colors.gray70} />
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <TouchableOpacity style={styles.quantityButton} onPress={incrementQuantity}>
                <NourishrIcon name="Add" size={16} color={colors.gray70} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.field, { flex: 1, marginLeft: spacing.md }]}>
            <Text style={styles.label}>Unit</Text>
            <TouchableOpacity style={styles.unitSelector} onPress={() => setShowUnitPicker(true)}>
              <Text style={styles.unitText}>{unit}</Text>
              <NourishrIcon name="ArrowDown2" size={16} color={colors.gray60} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Optional: Expiration Date */}
        <View style={styles.field}>
          <Text style={styles.label}>Expiration Date (Optional)</Text>
          <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
            <NourishrIcon name="Calendar" size={16} color={colors.gray60} />
            <Text style={styles.dateText}>
              {formatDate(expirationDate)}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>Add to Pantry</Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={expirationDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {/* Unit Picker Modal */}
      <Modal
        visible={showUnitPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowUnitPicker(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setShowUnitPicker(false)}
        >
          <View style={styles.unitPickerContainer}>
            <View style={styles.unitPickerHeader}>
              <Text style={styles.unitPickerTitle}>Select Unit</Text>
              <TouchableOpacity onPress={() => setShowUnitPicker(false)}>
                <NourishrIcon name="CloseCircle" size={24} color={colors.gray60} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {UNITS.map((unitOption) => (
                <TouchableOpacity
                  key={unitOption}
                  style={[styles.unitOption, unit === unitOption && styles.unitOptionActive]}
                  onPress={() => handleUnitSelect(unitOption)}
                >
                  <Text style={[styles.unitOptionText, unit === unitOption && styles.unitOptionTextActive]}>
                    {unitOption}
                  </Text>
                  {unit === unitOption && (
                    <NourishrIcon name="TickCircle" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl * 2,
    borderTopRightRadius: radius.xl * 2,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.gray20,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
  },
  headerTitle: {
    ...typography.body,
    color: colors.gray60,
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  detectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detectedEmoji: {
    fontSize: 32,
  },
  detectedName: {
    ...typography.h3,
    fontSize: 24,
    fontWeight: '700',
    color: colors.black,
  },
  confidenceBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  confidenceText: {
    ...typography.bodyMedium,
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '600',
  },
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.bodyMedium,
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray90,
    marginBottom: spacing.xs,
  },
  input: {
    ...typography.body,
    fontSize: 16,
    color: colors.black,
    backgroundColor: colors.gray10,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colors.gray10,
  },
  categoryScroll: {
    marginTop: spacing.xs,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.gray10,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryPillActive: {
    backgroundColor: '#FFF4E6',
    borderColor: colors.primary,
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryText: {
    ...typography.body,
    fontSize: 13,
    color: colors.gray70,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.gray10,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  quantityButton: {
    padding: spacing.xs,
  },
  quantityValue: {
    ...typography.h4,
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
    marginHorizontal: spacing.md,
    minWidth: 30,
    textAlign: 'center',
  },
  unitSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.gray10,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colors.gray10,
  },
  unitText: {
    ...typography.body,
    fontSize: 16,
    color: colors.black,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.gray10,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colors.gray10,
  },
  dateText: {
    ...typography.body,
    fontSize: 16,
    color: colors.gray60,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.gray10,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...typography.h4,
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray70,
  },
  addButton: {
    flex: 2,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  addButtonText: {
    ...typography.h4,
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  unitPickerContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl * 2,
    borderTopRightRadius: radius.xl * 2,
    paddingBottom: spacing.xl,
    maxHeight: '60%',
  },
  unitPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray10,
  },
  unitPickerTitle: {
    ...typography.h3,
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
  },
  unitOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray10,
  },
  unitOptionActive: {
    backgroundColor: '#FFF4E6',
  },
  unitOptionText: {
    ...typography.body,
    fontSize: 16,
    color: colors.black,
  },
  unitOptionTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
});
