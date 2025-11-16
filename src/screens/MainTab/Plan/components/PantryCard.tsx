import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { colors, typography, spacing, radius, shadows, iosRadius } from '../../../../theme';
import { NourishrIcon } from '../../../../components';
import { HapticFeedback } from '../../../../utils/haptics';
import { isSmallDevice } from '../../../../utils/responsive';

interface PantryItem {
  id: string;
  name: string;
  emoji: string;
}

interface PantryCardProps {
  items: PantryItem[];
  totalCount: number;
  expiringCount: number;
  onViewAll: () => void;
  onAddItem: () => void;
  onScanItem: () => void;
}

export const PantryCard: React.FC<PantryCardProps> = ({
  items,
  totalCount,
  expiringCount,
  onViewAll,
  onAddItem,
  onScanItem,
}) => {
  const previewItems = items.slice(0, 6);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>My Pantry 🧺</Text>
        {expiringCount > 0 && (
          <View style={styles.expiringBadge}>
            <NourishrIcon name="Warning2" size={12} color="#E63946" />
            <Text style={styles.expiringText}>{expiringCount} expiring soon</Text>
          </View>
        )}
      </View>

      {previewItems.length > 0 ? (
        <>
          <View style={styles.itemsContainer}>
            {previewItems.map((item) => (
              <View key={item.id} style={styles.itemChip}>
                <Text style={styles.itemText}>
                  {item.emoji} {item.name}
                </Text>
              </View>
            ))}
          </View>

          <Text style={styles.countText}>
            {totalCount} items total
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.primaryAction} onPress={() => {
              HapticFeedback.light();
              onViewAll();
            }}>
              <Text style={styles.primaryActionText}>View All</Text>
              <NourishrIcon name="ArrowRight" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.secondaryActions}>
            <TouchableOpacity style={styles.textButton} onPress={() => {
              HapticFeedback.light();
              onAddItem();
            }}>
              <NourishrIcon name="Add" size={16} color={colors.gray70} />
              <Text style={styles.textButtonText}>Add item</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.textButton} onPress={onScanItem}>
              <NourishrIcon name="Scan" size={16} color={colors.gray70} />
              <Text style={styles.textButtonText}>Scan item</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyState}>
          <NourishrIcon name="ShoppingCart" size={48} color={colors.gray40} />
          <Text style={styles.emptyTitle}>Your pantry is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add ingredients to get personalized meal suggestions
          </Text>
          <View style={styles.emptyActions}>
            <TouchableOpacity style={styles.emptyButton} onPress={onAddItem}>
              <NourishrIcon name="Add" size={18} color={colors.white} />
              <Text style={styles.emptyButtonText}>Add item</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.emptyButtonOutline} onPress={() => {
              HapticFeedback.light();
              onScanItem();
            }}>
              <NourishrIcon name="Scan" size={18} color={colors.primary} />
              <Text style={styles.emptyButtonOutlineText}>Scan item</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: Platform.OS === 'ios' ? iosRadius.card : radius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.black,
    fontSize: isSmallDevice ? 18 : 20,
    fontWeight: '700',
  },
  expiringBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs / 2,
    backgroundColor: '#FFE5E5',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: radius.md,
  },
  expiringText: {
    ...typography.caption,
    color: '#E63946',
    fontSize: isSmallDevice ? 10 : 11,
    fontWeight: '600',
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  itemChip: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  itemText: {
    ...typography.body,
    color: colors.gray70,
    fontSize: isSmallDevice ? 13 : 14,
    fontWeight: '500',
  },
  countText: {
    ...typography.caption,
    color: colors.gray60,
    fontSize: isSmallDevice ? 11 : 12,
    marginBottom: spacing.md,
  },
  actions: {
    marginBottom: spacing.sm,
  },
  primaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  primaryActionText: {
    ...typography.bodyMedium,
    color: colors.primary,
    fontWeight: '600',
    fontSize: isSmallDevice ? 14 : 15,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
    marginTop: spacing.xs,
  },
  textButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs / 2,
    paddingVertical: spacing.xs,
  },
  textButtonText: {
    ...typography.body,
    color: colors.gray70,
    fontWeight: '600',
    fontSize: isSmallDevice ? 13 : 14,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.black,
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: '600',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.gray60,
    fontSize: isSmallDevice ? 13 : 14,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  emptyActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
  },
  emptyButtonText: {
    ...typography.bodyMedium,
    color: colors.white,
    fontWeight: '600',
    fontSize: isSmallDevice ? 14 : 15,
  },
  emptyButtonOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  emptyButtonOutlineText: {
    ...typography.bodyMedium,
    color: colors.primary,
    fontWeight: '600',
    fontSize: isSmallDevice ? 14 : 15,
  },
});
