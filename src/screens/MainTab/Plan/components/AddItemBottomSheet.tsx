import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius } from '../../../../theme';
import { NourishrIcon } from '../../../../components';
import { FormField } from './bottomsheet/FormField';
import { CategoryPicker } from './bottomsheet/CategoryPicker';
import { DatePicker } from './bottomsheet/DatePicker';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT * 0.85;

interface PantryItemData {
  name: string;
  emoji: string;
  category: string;
  quantity: string;
  expirationDate: Date | null;
  note: string;
  addToShoppingBatch: boolean;
}

interface AddItemBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (data: PantryItemData) => void;
}

const EMOJI_OPTIONS = [
  '🥚', '🥛', '🍞', '🧈', '🧀', '🥓', '🍗', '🍖', '🥩', '🍤',
  '🍅', '🥒', '🥕', '🌽', '🥔', '🧅', '🧄', '🥦', '🥬', '🫑',
  '🍎', '🍌', '🍊', '🍋', '🍇', '🍓', '🫐', '🍑', '🥭', '🍍',
  '🍚', '🍝', '🍞', '🥐', '🥖', '🥨', '🥯', '🧇', '🥞', '🍕',
  '🫒', '🥜', '🌰', '🍯', '🥫', '🧂', '🧈', '🌾', '🫘', '🥗',
];

export const AddItemBottomSheet: React.FC<AddItemBottomSheetProps> = ({
  visible,
  onClose,
  onAdd,
}) => {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(BOTTOM_SHEET_HEIGHT)).current;
  const [itemName, setItemName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🥚');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [note, setNote] = useState('');
  const [addToShoppingBatch, setAddToShoppingBatch] = useState(false);

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(BOTTOM_SHEET_HEIGHT);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: BOTTOM_SHEET_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleAdd = () => {
    if (itemName.trim() && category) {
      onAdd({
        name: itemName.trim(),
        emoji: selectedEmoji,
        category,
        quantity: quantity.trim(),
        expirationDate,
        note: note.trim(),
        addToShoppingBatch,
      });
      // Reset form
      setItemName('');
      setSelectedEmoji('🥚');
      setCategory('');
      setQuantity('');
      setExpirationDate(null);
      setNote('');
      setAddToShoppingBatch(false);
    }
  };

  const handleClose = () => {
    setItemName('');
    setSelectedEmoji('🥚');
    setCategory('');
    setQuantity('');
    setExpirationDate(null);
    setNote('');
    setAddToShoppingBatch(false);
    onClose();
  };

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={handleClose} />

      <Animated.View
        style={[
          styles.bottomSheet,
          {
            paddingBottom: insets.bottom + spacing.lg,
            transform: [{ translateY: slideAnim }],
          },
        ]}
        pointerEvents="auto"
      >
        <View style={styles.handle} />

        <View style={styles.header}>
          <Text style={styles.title}>Add Item to Pantry</Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <NourishrIcon name="CloseCircle" size={28} color={colors.gray60} />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
          {/* Item Name Input */}
          <FormField
            label="Item Name"
            required
            placeholder="e.g., Eggs, Milk, Bread..."
            value={itemName}
            onChangeText={setItemName}
            autoFocus
            returnKeyType="next"
          />

          {/* Emoji Selector */}
          <View style={styles.emojiSection}>
            <Text style={styles.label}>Select Emoji *</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.emojiScroll}
            >
              {EMOJI_OPTIONS.map((emoji, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.emojiButton,
                    selectedEmoji === emoji && styles.emojiButtonSelected,
                  ]}
                  onPress={() => setSelectedEmoji(emoji)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.emoji}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Category */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Category *</Text>
            <CategoryPicker value={category} onChange={setCategory} />
          </View>

          {/* Quantity */}
          <FormField
            label="Quantity"
            placeholder="e.g., 12, 1 carton, 500g..."
            value={quantity}
            onChangeText={setQuantity}
            returnKeyType="next"
          />

          {/* Expiration Date */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Expiration Date</Text>
            <DatePicker value={expirationDate} onChange={setExpirationDate} />
          </View>

          {/* Note */}
          <FormField
            label="Add Note"
            placeholder="Any special notes..."
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
            returnKeyType="done"
          />

          {/* Shopping Batch Toggle */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Add to shopping batch?</Text>
            <Switch
              value={addToShoppingBatch}
              onValueChange={setAddToShoppingBatch}
              trackColor={{ false: colors.gray30, true: '#FFD699' }}
              thumbColor={addToShoppingBatch ? colors.primary : colors.white}
              ios_backgroundColor={colors.gray30}
            />
          </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Add Button - Fixed at bottom */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.addButton, (!itemName.trim() || !category) && styles.addButtonDisabled]}
            onPress={handleAdd}
            disabled={!itemName.trim() || !category}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>Add to Pantry</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: BOTTOM_SHEET_HEIGHT,
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.black,
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: spacing.xs / 2,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.sm,
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl + spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray10,
  },
  inputSection: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.bodyMedium,
    color: colors.gray70,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  toggleLabel: {
    ...typography.body,
    color: colors.black,
    fontSize: 15,
    fontWeight: '500',
  },
  emojiSection: {
    marginBottom: spacing.lg,
  },
  emojiScroll: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  emojiButton: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.gray10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiButtonSelected: {
    backgroundColor: '#FFF4E6',
    borderColor: colors.primary,
  },
  emoji: {
    fontSize: 28,
  },
  preview: {
    marginBottom: spacing.xl,
  },
  previewLabel: {
    ...typography.bodyMedium,
    color: colors.gray70,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  previewCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  previewEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  previewName: {
    ...typography.body,
    color: colors.gray70,
    fontSize: 16,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonDisabled: {
    backgroundColor: colors.gray30,
    shadowOpacity: 0,
    elevation: 0,
  },
  addButtonText: {
    ...typography.h4,
    color: colors.white,
    fontSize: 17,
    fontWeight: '600',
  },
});
