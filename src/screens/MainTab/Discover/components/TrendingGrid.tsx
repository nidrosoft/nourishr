import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, typography, spacing, radius } from '../../../../theme';
import { NourishrIcon } from '../../../../components';

interface TrendingItem {
  id: string;
  title: string;
  tag: string;
  image: string;
}

interface TrendingGridProps {
  items: TrendingItem[];
  onItemPress: (id: string) => void;
}

export const TrendingGrid: React.FC<TrendingGridProps> = ({ items, onItemPress }) => {
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());

  const toggleSave = (id: string) => {
    setSavedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <View style={styles.grid}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.card, index % 2 === 0 ? styles.cardLeft : styles.cardRight]}
          onPress={() => onItemPress(item.id)}
          activeOpacity={0.9}
        >
          <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
          
          {/* Heart Icon */}
          <TouchableOpacity
            style={styles.heartButton}
            onPress={() => toggleSave(item.id)}
            activeOpacity={0.8}
          >
            <NourishrIcon
              name="Heart"
              size={20}
              color={savedItems.has(item.id) ? colors.primary : colors.white}
            />
          </TouchableOpacity>

          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={styles.tagContainer}>
              <Text style={styles.tag}>{item.tag}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  card: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLeft: {
    marginRight: spacing.xs,
  },
  cardRight: {
    marginLeft: spacing.xs,
  },
  image: {
    width: '100%',
    height: 140,
    backgroundColor: colors.gray10,
  },
  heartButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  content: {
    padding: spacing.sm,
  },
  title: {
    ...typography.bodyMedium,
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
    marginBottom: spacing.xs,
    lineHeight: 18,
  },
  tagContainer: {
    alignSelf: 'flex-start',
  },
  tag: {
    ...typography.body,
    fontSize: 11,
    color: colors.primary,
    backgroundColor: '#FFF4E6',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
});
