import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius } from '../../../theme';
import { NourishrIcon } from '../../../components';
import { HeroCard } from './components/HeroCard';
import { CuisineGrid } from './components/CuisineGrid';
import { TrendingGrid } from './components/TrendingGrid';
import { CollectionsCarousel } from './components/CollectionsCarousel';

type FilterChip = {
  id: string;
  label: string;
  icon: string;
};

type Collection = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  count: string;
};

const FILTER_CHIPS: FilterChip[] = [
  { id: 'quick', label: 'Quick Meals', icon: 'Flash' },
  { id: 'healthy', label: 'Healthy Choices', icon: 'Heart' },
  { id: 'world', label: 'World Cuisine', icon: 'Global' },
  { id: 'favorites', label: 'Favorites', icon: 'Star' },
  { id: 'trending', label: 'Trending Now', icon: 'TrendUp' },
  { id: 'calories', label: 'Under 500 Cal', icon: 'Activity' },
  { id: 'cuisines', label: 'Cuisines', icon: 'Category' },
  { id: 'diet', label: 'Diet', icon: 'Health' },
  { id: 'difficulty', label: 'Difficulty', icon: 'Level' },
  { id: 'time', label: 'Time', icon: 'Clock' },
];

const COLLECTIONS: Collection[] = [
  {
    id: '1',
    title: 'Comfort Food',
    subtitle: 'Simple & quick recipes',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    count: '24 recipes',
  },
  {
    id: '2',
    title: 'Lean & Clean Meals',
    subtitle: 'Delicious under $10',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
    count: '32 recipes',
  },
  {
    id: '3',
    title: 'Seasonal Favorites',
    subtitle: 'Build muscle & strength',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800',
    count: '18 recipes',
  },
  {
    id: '4',
    title: 'Date Night Ideas',
    subtitle: 'Fresh winter favorites',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    count: '28 recipes',
  },
];

const TRENDING_ITEMS = [
  {
    id: '1',
    title: 'High-Protein Lunches',
    tag: '30+ recipes',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  },
  {
    id: '2',
    title: 'Under 20 Minutes',
    tag: 'Quick & Easy',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
  },
  {
    id: '3',
    title: 'Budget-Friendly Bowls',
    tag: 'Under $10',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
  },
  {
    id: '4',
    title: 'Meal Prep Sunday',
    tag: 'Batch Cooking',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
  },
  {
    id: '5',
    title: 'One-Pan Dinners',
    tag: 'Easy Cleanup',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
  },
  {
    id: '6',
    title: 'Vegetarian Delights',
    tag: 'Plant-Based',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
  },
];

export const DiscoverScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Header with Gradient */}
      <LinearGradient
        colors={[colors.primary, '#FF7A00']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradientHeader, { paddingTop: insets.top + spacing.md }]}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <NourishrIcon name="SearchNormal" size={20} color={colors.gray60} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search dishes, ingredients, cuisines..."
            placeholderTextColor={colors.gray60}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <NourishrIcon name="CloseCircle" size={20} color={colors.gray60} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {FILTER_CHIPS.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                selectedFilter === filter.id && styles.filterChipActive,
              ]}
              onPress={() =>
                setSelectedFilter(selectedFilter === filter.id ? null : filter.id)
              }
            >
              <NourishrIcon
                name={filter.icon as any}
                size={16}
                color={selectedFilter === filter.id ? colors.white : colors.gray80}
              />
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === filter.id && styles.filterChipTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      {/* Content */}
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={true}
      >
        {/* Discover New Meals - Hero Card */}
        <View style={styles.section}>
          <HeroCard
            title="30-Minute Dinners"
            subtitle="Quick & delicious meals for busy weeknights"
            image="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800"
            onPress={() => console.log('Hero card pressed')}
          />
        </View>

        {/* Explore by Cuisine */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore by Cuisine</Text>
          <CuisineGrid
            onCuisinePress={(id) => console.log('Cuisine pressed:', id)}
          />
        </View>

        {/* Trending This Week */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending This Week</Text>
          <TrendingGrid
            items={TRENDING_ITEMS}
            onItemPress={(id) => console.log('Trending item pressed:', id)}
          />
        </View>

        {/* Collections */}
        <View style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Collections</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <CollectionsCarousel
            collections={COLLECTIONS}
            onCollectionPress={(id) => console.log('Collection pressed:', id)}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  gradientHeader: {
    paddingBottom: spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.black,
  },
  filtersContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.full,
    gap: spacing.xs,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    ...typography.bodySmall,
    color: colors.gray80,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: colors.white,
  },
  content: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    paddingBottom: spacing.xl * 2,
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  lastSection: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.headingM,
    color: colors.black,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  seeAllText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  horizontalScroll: {
    gap: spacing.md,
  },
  popularCard: {
    width: 280,
    height: 180,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  popularImage: {
    width: '100%',
    height: '100%',
  },
  popularOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
  },
  popularTitle: {
    ...typography.headingS,
    color: colors.white,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  popularSubtitle: {
    ...typography.bodySmall,
    color: colors.white,
  },
  cuisineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  cuisineCard: {
    width: '47%',
    backgroundColor: colors.secondary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
  },
  cuisineIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cuisineText: {
    ...typography.bodyMedium,
    color: colors.black,
    fontWeight: '600',
  },
  collectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  collectionImage: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
  },
  collectionContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  collectionTitle: {
    ...typography.bodyMedium,
    color: colors.black,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  collectionSubtitle: {
    ...typography.bodySmall,
    color: colors.gray60,
    marginBottom: spacing.xs,
  },
  collectionCount: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
});
