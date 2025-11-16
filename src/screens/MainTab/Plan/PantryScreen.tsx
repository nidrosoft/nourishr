import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, radius } from '../../../theme';
import { NourishrIcon } from '../../../components';
import { AddItemBottomSheet } from './components/AddItemBottomSheet';
import { Toast } from '../../../components/organisms/Toast';
import { useToast } from '../../../hooks/useToast';
import { CategoryView } from './components/pantry/CategoryView';
import { ExpiringSoonSection } from './components/pantry/ExpiringSoonSection';

interface PantryItem {
  id: string;
  name: string;
  emoji: string;
  addedDate: string;
  category?: string;
  quantity?: string;
  expirationDate?: Date | null;
  note?: string;
}

interface PantryBatch {
  date: string;
  dateLabel: string;
  items: PantryItem[];
}

interface PantryScreenProps {
  onClose: () => void;
}

// Mock data organized by batches
const mockPantryBatches: PantryBatch[] = [
  {
    date: '2024-11-14',
    dateLabel: 'Today',
    items: [
      { id: '1', name: 'Eggs', emoji: '🥚', addedDate: '2024-11-14' },
      { id: '2', name: 'Milk', emoji: '🥛', addedDate: '2024-11-14' },
      { id: '3', name: 'Bread', emoji: '🍞', addedDate: '2024-11-14' },
    ],
  },
  {
    date: '2024-11-10',
    dateLabel: 'Nov 10, 2024',
    items: [
      { id: '4', name: 'Tomato sauce', emoji: '🍅', addedDate: '2024-11-10' },
      { id: '5', name: 'Rice', emoji: '🍚', addedDate: '2024-11-10' },
      { id: '6', name: 'Chicken', emoji: '🍗', addedDate: '2024-11-10' },
      { id: '7', name: 'Onions', emoji: '🧅', addedDate: '2024-11-10' },
    ],
  },
  {
    date: '2024-11-05',
    dateLabel: 'Nov 5, 2024',
    items: [
      { id: '8', name: 'Oats', emoji: '🌾', addedDate: '2024-11-05' },
      { id: '9', name: 'Pasta', emoji: '🍝', addedDate: '2024-11-05' },
      { id: '10', name: 'Olive Oil', emoji: '🫒', addedDate: '2024-11-05' },
    ],
  },
];

export const PantryScreen: React.FC<PantryScreenProps> = ({ onClose }) => {
  const insets = useSafeAreaInsets();
  const [showAddItem, setShowAddItem] = useState(false);
  const [batches, setBatches] = useState(mockPantryBatches);
  const translateX = useSharedValue(1000);
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    // Simple slide in from right - no fade, no blank screen
    translateX.value = withTiming(0, {
      duration: 300,
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleClose = () => {
    translateX.value = withTiming(1000, {
      duration: 250,
    }, () => {
      runOnJS(onClose)();
    });
  };

  const handleDeleteItem = (batchDate: string, itemId: string) => {
    setBatches((prev) =>
      prev.map((batch) =>
        batch.date === batchDate
          ? { ...batch, items: batch.items.filter((item) => item.id !== itemId) }
          : batch
      ).filter((batch) => batch.items.length > 0)
    );
    showError('Item removed from pantry');
  };

  const handleAddItemComplete = (data: any) => {
    console.log('Item added:', data);
    const newItem = {
      id: Date.now().toString(),
      name: data.name,
      emoji: data.emoji,
      addedDate: new Date().toISOString().split('T')[0],
    };

    const today = new Date().toISOString().split('T')[0];
    const todayBatch = batches.find((batch) => batch.date === today);

    if (todayBatch) {
      setBatches((prev) =>
        prev.map((batch) =>
          batch.date === today ? { ...batch, items: [...batch.items, newItem] } : batch
        )
      );
    } else {
      const newBatch: PantryBatch = {
        date: today,
        dateLabel: 'Today',
        items: [newItem],
      };
      setBatches((prev) => [newBatch, ...prev]);
    }

    setShowAddItem(false);
    showSuccess('Item added to pantry!');
  };

  const getTotalItems = () => {
    return batches.reduce((total, batch) => total + batch.items.length, 0);
  };

  const getDaysUntilExpiration = (date: Date | null | undefined): number => {
    if (!date) return 999;
    const now = new Date();
    const expDate = new Date(date);
    return Math.floor((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getFilteredItems = () => {
    const allItems = batches.flatMap((b) => b.items);

    switch (activeFilter) {
      case 'expiring':
        // Show items expiring within 7 days
        return allItems.filter((item) => {
          const days = getDaysUntilExpiration(item.expirationDate);
          return days >= 0 && days <= 7;
        }).sort((a, b) => 
          getDaysUntilExpiration(a.expirationDate) - getDaysUntilExpiration(b.expirationDate)
        );
      
      case 'recent':
        // Show items added in last 7 days, sorted by newest first
        return allItems.sort((a, b) => 
          new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
        );
      
      default:
        return allItems;
    }
  };

  return (
    <View style={styles.modalContainer}>
      <Animated.View 
        style={[
          styles.container,
          animatedStyle,
        ]}
      >
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#FF9500', '#FD6A2F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + spacing.md }]}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleClose}>
          <NourishrIcon name="ArrowLeft" size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>My Pantry</Text>
          <Text style={styles.headerSubtitle}>{getTotalItems()} items total</Text>
        </View>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      {/* Filter Pills */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
          style={styles.filterScrollView}
        >
        <TouchableOpacity
          style={[styles.filterPill, activeFilter === 'all' && styles.filterPillActive]}
          onPress={() => setActiveFilter('all')}
        >
          <Text style={styles.filterEmoji}>📦</Text>
          <Text style={[styles.filterText, activeFilter === 'all' && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterPill, activeFilter === 'expiring' && styles.filterPillActive]}
          onPress={() => setActiveFilter('expiring')}
        >
          <Text style={styles.filterEmoji}>⏰</Text>
          <Text style={[styles.filterText, activeFilter === 'expiring' && styles.filterTextActive]}>
            Expiring Soon
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterPill, activeFilter === 'category' && styles.filterPillActive]}
          onPress={() => setActiveFilter('category')}
        >
          <Text style={styles.filterEmoji}>🏷️</Text>
          <Text style={[styles.filterText, activeFilter === 'category' && styles.filterTextActive]}>
            By Category
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterPill, activeFilter === 'batches' && styles.filterPillActive]}
          onPress={() => setActiveFilter('batches')}
        >
          <Text style={styles.filterEmoji}>🛒</Text>
          <Text style={[styles.filterText, activeFilter === 'batches' && styles.filterTextActive]}>
            Purchase Batches
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterPill, activeFilter === 'recent' && styles.filterPillActive]}
          onPress={() => setActiveFilter('recent')}
        >
          <Text style={styles.filterEmoji}>✨</Text>
          <Text style={[styles.filterText, activeFilter === 'recent' && styles.filterTextActive]}>
            Recently Added
          </Text>
        </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Expiring Soon Section - Always show if items are expiring */}
        {activeFilter === 'all' && (
          <ExpiringSoonSection
            items={batches.flatMap((b) => b.items)}
            onItemPress={(id) => console.log('Item pressed:', id)}
          />
        )}

        {/* Category View */}
        {activeFilter === 'category' && (
          <CategoryView
            items={batches.flatMap((b) => b.items)}
            onItemPress={(id) => console.log('Item pressed:', id)}
            onDeleteItem={(id) => {
              // Find which batch contains this item and delete it
              batches.forEach((batch) => {
                if (batch.items.some((item) => item.id === id)) {
                  handleDeleteItem(batch.date, id);
                }
              });
            }}
          />
        )}

        {/* Purchase Batches View (Default/All) */}
        {(activeFilter === 'all' || activeFilter === 'batches' || activeFilter === 'recent') && batches.map((batch, index) => (
          <View key={batch.date} style={[styles.batchCard, index === 0 && styles.firstBatchCard]}>
            <View style={styles.batchHeader}>
              <View style={styles.batchHeaderLeft}>
                <NourishrIcon name="Calendar" size={18} color={colors.gray60} />
                <Text style={styles.batchDate}>{batch.dateLabel}</Text>
              </View>
              <Text style={styles.batchCount}>{batch.items.length} items</Text>
            </View>

            <View style={styles.itemsGrid}>
              {batch.items.map((item) => (
                <View key={item.id} style={styles.itemCard}>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteItem(batch.date, item.id)}
                  >
                    <NourishrIcon name="CloseCircle" size={18} color={colors.gray50} />
                  </TouchableOpacity>
                  <Text style={styles.itemEmoji}>{item.emoji}</Text>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {batches.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyBasket}>🧺</Text>
            <Text style={styles.emptyTitle}>Your pantry is feeling lonely 👀</Text>
            <Text style={styles.emptySubtitle}>
              Add what you have so we can help you cook smarter.
            </Text>
            <View style={styles.emptyActions}>
              <TouchableOpacity style={styles.emptyScanButton} onPress={() => console.log('Scan')}>
                <NourishrIcon name="Scan" size={20} color={colors.white} />
                <Text style={styles.emptyScanText}>Scan item</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.emptyAddButton} onPress={() => setShowAddItem(true)}>
                <NourishrIcon name="Add" size={20} color={colors.primary} />
                <Text style={styles.emptyAddText}>Add item manually</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 80 }]}
        onPress={() => setShowAddItem(true)}
        activeOpacity={0.9}
      >
        <View style={styles.fabGradient}>
          <NourishrIcon name="Add" size={28} color={colors.white} />
        </View>
      </TouchableOpacity>

      {/* Add Item Bottom Sheet */}
      <AddItemBottomSheet
        visible={showAddItem}
        onClose={() => setShowAddItem(false)}
        onAdd={handleAddItemComplete}
      />
      
      {/* Toast Notification */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.white,
    zIndex: 1000,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h2,
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.white,
    fontSize: 13,
    opacity: 0.9,
  },
  headerSpacer: {
    width: 40,
  },
  filterContainer: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray10,
    height: 44,
  },
  filterScrollView: {
    flex: 1,
  },
  filterScroll: {
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  filterPill: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    backgroundColor: colors.gray10,
    borderWidth: 1,
    borderColor: 'transparent',
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
  },
  filterEmoji: {
    fontSize: 14,
  },
  filterPillActive: {
    backgroundColor: '#FFF4E6',
    borderColor: colors.primary,
  },
  filterText: {
    ...typography.body,
    color: colors.gray70,
    fontSize: 14,
    fontWeight: '500',
  },
  filterTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
  },
  batchCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  firstBatchCard: {
    marginTop: spacing.sm,
  },
  batchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray10,
  },
  batchHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  batchDate: {
    ...typography.h4,
    color: colors.black,
    fontSize: 16,
    fontWeight: '600',
  },
  batchCount: {
    ...typography.caption,
    color: colors.gray60,
    fontSize: 12,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  itemCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: radius.lg,
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    padding: 2,
  },
  itemEmoji: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  itemName: {
    ...typography.caption,
    color: colors.gray70,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
    paddingHorizontal: spacing.xl,
  },
  emptyBasket: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.black,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.gray60,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  emptyActions: {
    width: '100%',
    gap: spacing.md,
  },
  emptyScanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.black,
    paddingVertical: spacing.md + 2,
    borderRadius: radius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyScanText: {
    ...typography.bodyMedium,
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    paddingVertical: spacing.md + 2,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  emptyAddText: {
    ...typography.bodyMedium,
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
  },
});
