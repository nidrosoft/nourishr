import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, radius } from '../../../../../theme';
import { ItemCard } from './ItemCard';

interface PantryItem {
  id: string;
  name: string;
  emoji: string;
  category?: string;
  quantity?: string;
  expirationDate?: Date | null;
}

interface CategoryGroup {
  category: string;
  icon: string;
  items: PantryItem[];
}

interface CategoryViewProps {
  items: PantryItem[];
  onItemPress: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  dairy: '🥚',
  meat: '🍗',
  vegetables: '🥕',
  fruits: '🍎',
  grains: '🍞',
  condiments: '🫒',
  snacks: '🍪',
  beverages: '🥤',
  other: '📦',
};

export const CategoryView: React.FC<CategoryViewProps> = ({ items, onItemPress, onDeleteItem }) => {
  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, PantryItem[]>);

  const categories: CategoryGroup[] = Object.entries(groupedItems).map(([category, categoryItems]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    icon: CATEGORY_ICONS[category] || '📦',
    items: categoryItems,
  }));

  return (
    <View style={styles.container}>
      {categories.map((group) => (
        <View key={group.category} style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryIcon}>{group.icon}</Text>
            <Text style={styles.categoryTitle}>{group.category}</Text>
            <Text style={styles.categoryCount}>{group.items.length} items</Text>
          </View>
          <View style={styles.itemsGrid}>
            {group.items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onPress={() => onItemPress(item.id)}
                onDelete={() => onDeleteItem(item.id)}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
  },
  categorySection: {
    marginBottom: spacing.md,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryTitle: {
    ...typography.h3,
    color: colors.black,
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  categoryCount: {
    ...typography.caption,
    color: colors.gray60,
    fontSize: 12,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
