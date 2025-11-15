// Types for Meal Nutrition Analysis Flow

export type FlowState = 'camera' | 'processing' | 'results' | 'error';

export interface NutritionData {
  mealName: string;
  description?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  healthScore: number;
  ingredients: DetectedIngredient[];
  micronutrients: Micronutrient[];
  allergens: string[];
  dietCompatibility: DietCompatibility;
  portionSize: string;
  servings: number;
  cuisineType: string;
  category: string;
  confidence: number;
  suggestions?: string[];
}

export interface DetectedIngredient {
  name: string;
  confidence: number;
}

export interface Micronutrient {
  name: string;
  amount: string;
  unit: string;
  dailyValue?: number;
}

export interface DietCompatibility {
  vegan: boolean;
  vegetarian: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  keto: boolean;
  paleo: boolean;
  halal: boolean;
  kosher: boolean;
}
