import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { colors, typography, spacing } from '../../../../../theme';

interface Category {
  id: string;
  name: string;
  image: any;
}

interface CategorySectionProps {
  categories: Category[];
  onCategoryPress: (categoryId: string) => void;
  selectedCategoryId?: string;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  categories,
  onCategoryPress,
  selectedCategoryId,
}) => {
  return (
    <View style={styles.categoriesSection}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryItem}
            onPress={() => onCategoryPress(category.id)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.categoryCircle,
                selectedCategoryId === category.id && styles.categoryCircleActive,
              ]}
            >
              <Image
                source={category.image}
                style={styles.categoryImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.categoryLabel}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  categoriesSection: {
    marginBottom: spacing.lg,
  },
  categoriesContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  categoryItem: {
    alignItems: 'center',
    width: 80,
  },
  categoryCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E4DED6',
    borderWidth: 2,
    borderColor: '#E4DED6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  categoryCircleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryImage: {
    width: 48,
    height: 48,
  },
  categoryLabel: {
    ...typography.caption,
    fontSize: 12,
    color: colors.black,
    textAlign: 'center',
    fontWeight: '500',
  },
});
