import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../../../theme';
import { CategoryChip, MealCard } from '../../../components';
import { useApp } from '../../../context/AppContext';
import { Meal } from '../../../types';
import {
  MainTabParamList,
  FavoritesStackParamList,
} from '../../../navigation/types';

type FavoritesScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<FavoritesStackParamList, 'FavoritesMain'>,
  BottomTabNavigationProp<MainTabParamList>
>;

type FavoritesScreenProps = {
  navigation: FavoritesScreenNavigationProp;
};

type FilterType = 'all' | 'recipe' | 'delivery';

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  navigation,
}) => {
  const { aiRecommendationService } = useApp();
  const [filter, setFilter] = useState<FilterType>('all');
  const [favorites, setFavorites] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      // In real app, this would fetch user's favorites
      const allMeals = await aiRecommendationService.getMealSuggestions();
      // Mock: just take first 3 as favorites
      setFavorites(allMeals.slice(0, 3).map((m) => ({ ...m, isFavorite: true })));
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFavorites = favorites.filter((meal) => {
    if (filter === 'all') return true;
    return meal.type === filter;
  });

  const handleMealPress = (meal: Meal) => {
    navigation.navigate('MealDetail', { meal });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
        <Text style={styles.subtitle}>Your saved meals</Text>
      </View>

      {/* Filter */}
      <View style={styles.filterContainer}>
        <CategoryChip
          label="All"
          selected={filter === 'all'}
          onPress={() => setFilter('all')}
        />
        <CategoryChip
          label="Cook"
          selected={filter === 'recipe'}
          onPress={() => setFilter('recipe')}
        />
        <CategoryChip
          label="Order"
          selected={filter === 'delivery'}
          onPress={() => setFilter('delivery')}
        />
      </View>

      {/* List */}
      {loading ? (
        <Text style={styles.emptyText}>Loading favorites...</Text>
      ) : filteredFavorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.emptySubtext}>
            Start adding meals to your favorites!
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredFavorites}
          renderItem={({ item }) => (
            <MealCard meal={item} onPress={() => handleMealPress(item)} />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    ...typography.headingL,
    color: colors.black,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.gray70,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    ...typography.headingS,
    color: colors.gray60,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.gray60,
    textAlign: 'center',
  },
});
