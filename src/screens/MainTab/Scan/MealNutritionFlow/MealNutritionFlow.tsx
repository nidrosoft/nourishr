import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { CameraScreen } from './CameraScreen';
import { ProcessingScreen } from './ProcessingScreen';
import { ResultsScreen } from './ResultsScreen';
import { FlowState, NutritionData } from './types';

interface MealNutritionFlowProps {
  visible: boolean;
  onClose: () => void;
}

// Mock nutrition data for now - will be replaced with actual AI analysis
const mockNutritionData: NutritionData = {
  mealName: 'Grilled Chicken Salad',
  description: 'A fresh and healthy salad featuring grilled chicken breast, mixed greens, and colorful vegetables with a light dressing.',
  calories: 420,
  protein: 35,
  carbs: 28,
  fat: 18,
  healthScore: 85,
  ingredients: [
    { name: 'Grilled chicken breast', confidence: 92 },
    { name: 'Mixed greens', confidence: 88 },
    { name: 'Cherry tomatoes', confidence: 85 },
    { name: 'Cucumber', confidence: 78 },
    { name: 'Olive oil dressing', confidence: 65 },
  ],
  micronutrients: [
    { name: 'Vitamin A', amount: '120', unit: 'mcg', dailyValue: 15 },
    { name: 'Vitamin C', amount: '45', unit: 'mg', dailyValue: 50 },
    { name: 'Iron', amount: '3.2', unit: 'mg', dailyValue: 18 },
    { name: 'Calcium', amount: '85', unit: 'mg', dailyValue: 8 },
  ],
  allergens: [],
  dietCompatibility: {
    vegan: false,
    vegetarian: false,
    glutenFree: true,
    dairyFree: true,
    keto: false,
    paleo: true,
    halal: true,
    kosher: true,
  },
  portionSize: '1 large bowl',
  servings: 1,
  cuisineType: 'Mediterranean',
  category: 'Lunch',
  confidence: 87,
  suggestions: [
    'Add quinoa for more complex carbs',
    'Include avocado for healthy fats',
  ],
};

export const MealNutritionFlow: React.FC<MealNutritionFlowProps> = ({ visible, onClose }) => {
  const [flowState, setFlowState] = useState<FlowState>('camera');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);

  useEffect(() => {
    if (visible) {
      // Reset state when flow becomes visible
      setFlowState('camera');
      setCapturedImage(null);
      setNutritionData(null);
    }
  }, [visible]);

  const handleCapture = async (imageUri: string) => {
    setCapturedImage(imageUri);
    setFlowState('processing');

    // Simulate AI processing - 5 seconds to show full scanning animation
    setTimeout(() => {
      setNutritionData(mockNutritionData);
      setFlowState('results');
    }, 5000);

    // TODO: Replace with actual AI analysis
    // const result = await analyzeNutrition(imageUri);
    // setNutritionData(result);
    // setFlowState('results');
  };

  const handleSave = () => {
    // TODO: Save to user's daily log
    console.log('Saving nutrition data:', nutritionData);
    onClose();
  };

  const handleEdit = () => {
    // TODO: Open edit portions modal
    console.log('Edit portions');
  };

  const handleUseForRecipes = () => {
    // TODO: Navigate to recipe generation with this meal data
    console.log('Use for recipes:', nutritionData);
    onClose();
  };

  const handleClose = () => {
    setFlowState('camera');
    setCapturedImage(null);
    setNutritionData(null);
    onClose();
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      {flowState === 'camera' && (
        <CameraScreen
          visible={true}
          onClose={handleClose}
          onCapture={handleCapture}
        />
      )}

      {flowState === 'processing' && capturedImage && (
        <ProcessingScreen imageUri={capturedImage} />
      )}

      {flowState === 'results' && capturedImage && nutritionData && (
        <ResultsScreen
          imageUri={capturedImage}
          nutritionData={nutritionData}
          onClose={handleClose}
          onSave={handleSave}
          onEdit={handleEdit}
          onUseForRecipes={handleUseForRecipes}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2000,
  },
});
