import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { colors, typography, spacing, radius } from '../../../theme';
import { PrimaryButton, NourishrIcon } from '../../../components';
import { HomeStackParamList } from '../../../navigation/types';

type MealDetailScreenProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'MealDetail'>;
  route: RouteProp<HomeStackParamList, 'MealDetail'>;
};

export const MealDetailScreen: React.FC<MealDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { meal } = route.params;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image */}
        <View style={styles.imageContainer}>
          {meal.image ? (
            <Image source={{ uri: meal.image }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <NourishrIcon name="Gallery" size={48} color={colors.gray40} />
            </View>
          )}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <NourishrIcon name="ArrowLeft" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>{meal.title}</Text>

          {/* Meta Info */}
          <View style={styles.metaContainer}>
            {meal.prepTime && (
              <View style={styles.metaItem}>
                <NourishrIcon name="Clock" size={20} color={colors.gray60} />
                <Text style={styles.metaText}>{meal.prepTime} min</Text>
              </View>
            )}
            {meal.deliveryETA && (
              <View style={styles.metaItem}>
                <NourishrIcon name="Timer1" size={20} color={colors.gray60} />
                <Text style={styles.metaText}>{meal.deliveryETA} min</Text>
              </View>
            )}
            {meal.calories && (
              <View style={styles.metaItem}>
                <NourishrIcon name="Activity" size={20} color={colors.gray60} />
                <Text style={styles.metaText}>{meal.calories} cal</Text>
              </View>
            )}
          </View>

          {/* Restaurant (for delivery) */}
          {meal.type === 'delivery' && meal.restaurant && (
            <View style={styles.restaurantContainer}>
              <NourishrIcon name="Shop" size={20} color={colors.gray70} />
              <Text style={styles.restaurantText}>{meal.restaurant}</Text>
            </View>
          )}

          {/* Health Tags */}
          {meal.healthTags && meal.healthTags.length > 0 && (
            <View style={styles.tagsContainer}>
              {meal.healthTags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Ingredients (for recipes) */}
          {meal.type === 'recipe' && meal.ingredients && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              {meal.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.listText}>{ingredient}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Instructions (for recipes) */}
          {meal.type === 'recipe' && meal.instructions && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Instructions</Text>
              {meal.instructions.map((instruction, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.listText}>{instruction}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Button */}
      <View style={styles.footer}>
        <PrimaryButton
          title={meal.type === 'recipe' ? 'Start cooking' : 'Order now'}
          onPress={() => {
            // Handle action
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: colors.gray20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    ...typography.headingL,
    color: colors.black,
    marginBottom: spacing.md,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
    marginBottom: spacing.sm,
  },
  metaText: {
    ...typography.body,
    color: colors.gray70,
    marginLeft: spacing.sm,
  },
  restaurantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  restaurantText: {
    ...typography.bodyMedium,
    color: colors.gray70,
    marginLeft: spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  tag: {
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  tagText: {
    ...typography.captionMedium,
    color: colors.darkBlue,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.headingS,
    color: colors.black,
    marginBottom: spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    marginTop: 8,
    marginRight: spacing.sm,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  stepNumberText: {
    ...typography.captionMedium,
    color: colors.white,
  },
  listText: {
    ...typography.body,
    color: colors.gray80,
    flex: 1,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
});
