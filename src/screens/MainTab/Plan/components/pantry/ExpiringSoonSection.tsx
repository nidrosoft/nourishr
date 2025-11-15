import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radius } from '../../../../../theme';
import { NourishrIcon } from '../../../../../components';

interface PantryItem {
  id: string;
  name: string;
  emoji: string;
  expirationDate?: Date | null;
}

interface ExpiringSoonSectionProps {
  items: PantryItem[];
  onItemPress: (itemId: string) => void;
}

const getDaysUntilExpiration = (date: Date | null | undefined): number => {
  if (!date) return 999;
  const now = new Date();
  const expDate = new Date(date);
  return Math.floor((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

export const ExpiringSoonSection: React.FC<ExpiringSoonSectionProps> = ({ items, onItemPress }) => {
  // Filter items expiring within 7 days
  const expiringItems = items
    .filter((item) => {
      const days = getDaysUntilExpiration(item.expirationDate);
      return days >= 0 && days <= 7;
    })
    .sort((a, b) => getDaysUntilExpiration(a.expirationDate) - getDaysUntilExpiration(b.expirationDate));

  if (expiringItems.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <NourishrIcon name="Warning2" size={20} color="#E63946" />
        <Text style={styles.title}>Expiring Soon</Text>
        <Text style={styles.count}>{expiringItems.length} items</Text>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {expiringItems.map((item) => {
          const daysUntil = getDaysUntilExpiration(item.expirationDate);
          const isUrgent = daysUntil <= 1;
          
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, isUrgent && styles.cardUrgent]}
              onPress={() => onItemPress(item.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.badge, isUrgent ? styles.badgeRed : styles.badgeOrange]}>
                <Text style={styles.badgeText}>
                  {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil}d`}
                </Text>
              </View>
              <Text style={styles.emoji}>{item.emoji}</Text>
              <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.black,
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  count: {
    ...typography.caption,
    color: colors.gray60,
    fontSize: 12,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  card: {
    width: 100,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFA500',
    position: 'relative',
  },
  cardUrgent: {
    borderColor: '#E63946',
    backgroundColor: '#FFF5F5',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: radius.full,
  },
  badgeRed: {
    backgroundColor: '#E63946',
  },
  badgeOrange: {
    backgroundColor: '#FF9500',
  },
  badgeText: {
    ...typography.caption,
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  emoji: {
    fontSize: 32,
    marginVertical: spacing.xs,
  },
  name: {
    ...typography.caption,
    color: colors.gray70,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});
