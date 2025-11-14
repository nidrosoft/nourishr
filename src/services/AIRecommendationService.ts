import { Meal } from '../types';

export interface AIRecommendationService {
  getMealSuggestions(params?: {
    cuisine?: string;
    ingredients?: string[];
    mealType?: 'recipe' | 'delivery' | 'all';
  }): Promise<Meal[]>;
}

export class MockAIRecommendationService implements AIRecommendationService {
  private mockMeals: Meal[] = [
    {
      id: '1',
      title: 'Grilled Chicken Bowl',
      image: 'https://via.placeholder.com/300x200',
      type: 'recipe',
      cuisine: 'American',
      prepTime: 25,
      calories: 450,
      healthTags: ['High Protein', 'Low Carb'],
      ingredients: ['Chicken breast', 'Rice', 'Broccoli', 'Olive oil'],
      instructions: [
        'Season chicken with salt and pepper',
        'Grill chicken for 6-7 minutes per side',
        'Cook rice according to package',
        'Steam broccoli',
        'Assemble bowl and drizzle with olive oil',
      ],
    },
    {
      id: '2',
      title: 'Margherita Pizza',
      image: 'https://via.placeholder.com/300x200',
      type: 'delivery',
      cuisine: 'Italian',
      deliveryETA: 30,
      calories: 650,
      restaurant: "Mario's Pizzeria",
    },
    {
      id: '3',
      title: 'Thai Green Curry',
      image: 'https://via.placeholder.com/300x200',
      type: 'recipe',
      cuisine: 'Thai',
      prepTime: 35,
      calories: 520,
      healthTags: ['Spicy', 'Vegetarian'],
      ingredients: ['Coconut milk', 'Green curry paste', 'Vegetables', 'Tofu'],
      instructions: [
        'Heat curry paste in pan',
        'Add coconut milk and bring to simmer',
        'Add vegetables and tofu',
        'Cook for 15 minutes',
        'Serve with rice',
      ],
    },
    {
      id: '4',
      title: 'Sushi Combo',
      image: 'https://via.placeholder.com/300x200',
      type: 'delivery',
      cuisine: 'Japanese',
      deliveryETA: 25,
      calories: 480,
      restaurant: 'Sushi Express',
    },
    {
      id: '5',
      title: 'Mediterranean Salad',
      image: 'https://via.placeholder.com/300x200',
      type: 'recipe',
      cuisine: 'Mediterranean',
      prepTime: 15,
      calories: 320,
      healthTags: ['Healthy', 'Quick'],
      ingredients: ['Lettuce', 'Tomatoes', 'Cucumber', 'Feta', 'Olives'],
      instructions: [
        'Chop all vegetables',
        'Mix in a large bowl',
        'Add feta and olives',
        'Drizzle with olive oil and lemon',
      ],
    },
    {
      id: '6',
      title: 'Beef Tacos',
      image: 'https://via.placeholder.com/300x200',
      type: 'delivery',
      cuisine: 'Mexican',
      deliveryETA: 20,
      calories: 580,
      restaurant: 'Taco Fiesta',
    },
  ];

  async getMealSuggestions(params?: {
    cuisine?: string;
    ingredients?: string[];
    mealType?: 'recipe' | 'delivery' | 'all';
  }): Promise<Meal[]> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    let filtered = [...this.mockMeals];

    if (params?.mealType && params.mealType !== 'all') {
      filtered = filtered.filter((meal) => meal.type === params.mealType);
    }

    if (params?.cuisine) {
      filtered = filtered.filter(
        (meal) =>
          meal.cuisine?.toLowerCase() === params.cuisine?.toLowerCase()
      );
    }

    // Shuffle for variety
    return filtered.sort(() => Math.random() - 0.5);
  }
}
