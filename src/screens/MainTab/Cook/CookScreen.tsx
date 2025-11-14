import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing, radius } from '../../../theme';
import {
  TextField,
  PrimaryButton,
  CategoryChip,
  MealCard,
  NourishrIcon,
} from '../../../components';
import { useApp } from '../../../context/AppContext';
import { Meal } from '../../../types';
import { MainTabParamList, CookStackParamList } from '../../../navigation/types';

type CookScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<CookStackParamList, 'CookMain'>,
  BottomTabNavigationProp<MainTabParamList>
>;

type CookScreenProps = {
  navigation: CookScreenNavigationProp;
};

const CUISINES = [
  'Italian',
  'Asian',
  'Mexican',
  'American',
  'Mediterranean',
  'Indian',
  'Japanese',
  'Thai',
];

export const CookScreen: React.FC<CookScreenProps> = ({ navigation }) => {
  const { aiRecommendationService } = useApp();
  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [selectedCuisine, setSelectedCuisine] = useState<string>('');
  const [recipes, setRecipes] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      setIngredients([...ingredients, ingredientInput.trim()]);
      setIngredientInput('');
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleScanIngredients = () => {
    Alert.alert(
      'Coming Soon',
      'Ingredient scanning with AI will be available soon!'
    );
  };

  const handleFindRecipes = async () => {
    if (ingredients.length === 0) {
      Alert.alert('Error', 'Please add at least one ingredient');
      return;
    }

    try {
      setLoading(true);
      const results = await aiRecommendationService.getMealSuggestions({
        ingredients,
        cuisine: selectedCuisine,
        mealType: 'recipe',
      });
      setRecipes(results);
    } catch (error) {
      Alert.alert('Error', 'Failed to find recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleMealPress = (meal: Meal) => {
    navigation.navigate('MealDetail', { meal });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Cook at home</Text>
          <Text style={styles.subtitle}>
            Enter your ingredients and we'll find the perfect recipe
          </Text>

          {/* Ingredient Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your ingredients</Text>
            <View style={styles.inputRow}>
              <TextField
                placeholder="Add an ingredient"
                value={ingredientInput}
                onChangeText={setIngredientInput}
                onSubmitEditing={handleAddIngredient}
                style={styles.ingredientInput}
                containerStyle={styles.ingredientInputContainer}
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddIngredient}
              >
                <NourishrIcon name="Add" size={24} color={colors.white} />
              </TouchableOpacity>
            </View>

            {/* Scan Button */}
            <TouchableOpacity
              style={styles.scanButton}
              onPress={handleScanIngredients}
            >
              <NourishrIcon name="Camera" size={20} color={colors.darkBlue} />
              <Text style={styles.scanButtonText}>Scan ingredients</Text>
            </TouchableOpacity>

            {/* Ingredient Chips */}
            {ingredients.length > 0 && (
              <View style={styles.ingredientsContainer}>
                {ingredients.map((ingredient, index) => (
                  <View key={index} style={styles.ingredientChip}>
                    <Text style={styles.ingredientChipText}>{ingredient}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveIngredient(index)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <NourishrIcon
                        name="CloseSquare"
                        size={16}
                        color={colors.gray60}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Cuisine Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose cuisine (optional)</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cuisinesContainer}
            >
              {CUISINES.map((cuisine) => (
                <CategoryChip
                  key={cuisine}
                  label={cuisine}
                  selected={selectedCuisine === cuisine}
                  onPress={() =>
                    setSelectedCuisine(
                      selectedCuisine === cuisine ? '' : cuisine
                    )
                  }
                />
              ))}
            </ScrollView>
          </View>

          {/* Find Recipes Button */}
          <PrimaryButton
            title="Find recipes"
            onPress={handleFindRecipes}
            loading={loading}
            disabled={ingredients.length === 0}
          />

          {/* Results */}
          {recipes.length > 0 && (
            <View style={styles.resultsSection}>
              <Text style={styles.resultsTitle}>
                Found {recipes.length} recipes
              </Text>
              <FlatList
                data={recipes}
                renderItem={({ item }) => (
                  <MealCard meal={item} onPress={() => handleMealPress(item)} />
                )}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    ...typography.headingL,
    color: colors.black,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.gray70,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.headingS,
    color: colors.black,
    marginBottom: spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  ingredientInputContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  ingredientInput: {
    paddingVertical: spacing.sm,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.darkBlue,
    marginTop: spacing.md,
  },
  scanButtonText: {
    ...typography.bodyMedium,
    color: colors.darkBlue,
    marginLeft: spacing.sm,
  },
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
  },
  ingredientChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  ingredientChipText: {
    ...typography.bodyMedium,
    color: colors.gray80,
    marginRight: spacing.sm,
  },
  cuisinesContainer: {
    paddingVertical: spacing.sm,
  },
  resultsSection: {
    marginTop: spacing.xl,
  },
  resultsTitle: {
    ...typography.headingS,
    color: colors.black,
    marginBottom: spacing.md,
  },
});
