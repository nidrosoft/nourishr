export interface FoodScanService {
  scanIngredientsFromImage(imageUri: string): Promise<string[]>;
  estimateCaloriesFromImage(imageUri: string): Promise<number>;
}

export class MockFoodScanService implements FoodScanService {
  private mockIngredients = [
    'Tomatoes',
    'Onions',
    'Garlic',
    'Chicken breast',
    'Rice',
    'Bell peppers',
    'Carrots',
    'Broccoli',
  ];

  async scanIngredientsFromImage(imageUri: string): Promise<string[]> {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Return random subset of ingredients
    const count = Math.floor(Math.random() * 4) + 3;
    return this.mockIngredients
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
  }

  async estimateCaloriesFromImage(imageUri: string): Promise<number> {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Return random calorie estimate
    return Math.floor(Math.random() * 500) + 200;
  }
}
