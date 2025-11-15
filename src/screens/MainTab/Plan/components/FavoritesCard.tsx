import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, typography, spacing, radius } from '../../../../theme';
import { NourishrIcon } from '../../../../components';

interface FavoriteRecipe {
  id: string;
  name: string;
  image: string;
  cookTime: number;
}

interface FavoritesCardProps {
  favorites: FavoriteRecipe[];
  onViewAll: () => void;
  onRecipePress: (recipeId: string) => void;
}

export const FavoritesCard: React.FC<FavoritesCardProps> = ({
  favorites,
  onViewAll,
  onRecipePress,
}) => {
  const previewFavorites = favorites.slice(0, 3);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites ⭐</Text>
        {favorites.length > 0 && (
          <TouchableOpacity onPress={onViewAll}>
            <Text style={styles.viewAllText}>See all →</Text>
          </TouchableOpacity>
        )}
      </View>

      {favorites.length > 0 ? (
        <>
          <View style={styles.gridContainer}>
            {previewFavorites.map((recipe) => (
              <TouchableOpacity
                key={recipe.id}
                style={styles.recipeCard}
                onPress={() => onRecipePress(recipe.id)}
                activeOpacity={0.7}
              >
                <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                <View style={styles.recipeOverlay}>
                  <Text style={styles.recipeName} numberOfLines={2}>
                    {recipe.name}
                  </Text>
                  <View style={styles.recipeTime}>
                    <NourishrIcon name="Timer" size={12} color={colors.white} />
                    <Text style={styles.recipeTimeText}>{recipe.cookTime} min</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          {favorites.length > 3 && (
            <Text style={styles.countText}>
              +{favorites.length - 3} more favorites
            </Text>
          )}
        </>
      ) : (
        <View style={styles.emptyState}>
          <NourishrIcon name="Star" size={48} color={colors.gray40} />
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptySubtitle}>
            Save recipes you love to find them easily later
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
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
    fontSize: 20,
    fontWeight: '700',
  },
  viewAllText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  gridContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  recipeCard: {
    flex: 1,
    height: 140,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.gray10,
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  recipeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: spacing.sm,
    justifyContent: 'flex-end',
  },
  recipeName: {
    ...typography.bodyMedium,
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: spacing.xs / 2,
    lineHeight: 16,
  },
  recipeTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs / 2,
  },
  recipeTimeText: {
    ...typography.caption,
    color: colors.white,
    fontSize: 11,
    fontWeight: '500',
  },
  countText: {
    ...typography.caption,
    color: colors.gray60,
    fontSize: 12,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.black,
    fontSize: 18,
    fontWeight: '600',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.gray60,
    fontSize: 14,
    textAlign: 'center',
  },
});
