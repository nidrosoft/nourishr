import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, radius } from '../../../../theme';

interface Collection {
  id: string;
  title: string;
  image: string;
}

interface CollectionsCarouselProps {
  collections: Collection[];
  onCollectionPress: (id: string) => void;
}

export const CollectionsCarousel: React.FC<CollectionsCarouselProps> = ({ collections, onCollectionPress }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {collections.map((collection) => (
        <TouchableOpacity
          key={collection.id}
          style={styles.card}
          onPress={() => onCollectionPress(collection.id)}
          activeOpacity={0.9}
        >
          <Image source={{ uri: collection.image }} style={styles.image} resizeMode="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            style={styles.overlay}
          >
            <Text style={styles.title} numberOfLines={2}>
              {collection.title}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingRight: spacing.lg,
  },
  card: {
    width: 160,
    height: 120,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginRight: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.sm,
    justifyContent: 'flex-end',
  },
  title: {
    ...typography.bodyMedium,
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
    lineHeight: 18,
  },
});
