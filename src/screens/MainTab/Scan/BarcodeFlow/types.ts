export interface BarcodeProductData {
  barcode: string;
  productName: string;
  brand: string;
  imageUri?: string;
  servingSize: string;
  servingsPerContainer: number;
  
  // Nutrition per serving
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  
  // Micronutrients
  micronutrients: Array<{
    name: string;
    amount: number;
    unit: string;
    dailyValue?: number;
  }>;
  
  // Product info
  ingredients: string; // Full ingredients list as text
  allergens: string[];
  
  // Diet compatibility
  dietCompatibility: {
    vegan: boolean;
    vegetarian: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
    nutFree: boolean;
  };
}

export interface ServingOption {
  label: string;
  multiplier: number;
}
