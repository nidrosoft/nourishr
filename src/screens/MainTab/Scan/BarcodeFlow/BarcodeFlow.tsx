import React, { useState, useEffect } from 'react';
import { ProcessingScreen } from './ProcessingScreen';
import { ResultsScreen } from './ResultsScreen';
import { BarcodeProductData } from './types';

interface BarcodeFlowProps {
  imageUri: string;
  barcode: string;
  onClose: () => void;
}

// Mock product data - In production, this would come from an API
const mockProductData: BarcodeProductData = {
  barcode: '722252100016',
  productName: 'Chocolate Chip Energy Bar',
  brand: 'Clif Bar',
  servingSize: '68g',
  servingsPerContainer: 1,
  
  // Nutrition per serving
  calories: 260,
  protein: 9,
  carbs: 44,
  fat: 5,
  fiber: 4,
  sugar: 21,
  sodium: 150,
  
  // Micronutrients
  micronutrients: [
    { name: 'Vitamin D', amount: 0, unit: 'mcg', dailyValue: 0 },
    { name: 'Calcium', amount: 60, unit: 'mg', dailyValue: 6 },
    { name: 'Iron', amount: 2.7, unit: 'mg', dailyValue: 15 },
    { name: 'Potassium', amount: 230, unit: 'mg', dailyValue: 6 },
  ],
  
  // Product info
  ingredients: 'Organic Brown Rice Syrup, Organic Rolled Oats, Soy Protein Isolate, Organic Cane Syrup, Organic Roasted Soybeans, Rice Flour, Organic Soy Flour, Organic Oat Fiber, Organic Milled Flaxseed, Organic Sunflower Oil, Natural Flavors, Chocolate Chips (Cane Sugar, Unsweetened Chocolate, Cocoa Butter, Soy Lecithin, Natural Flavor), Sea Salt, Barley Malt Extract, Soy Lecithin.',
  allergens: ['Soy', 'Contains tree nuts'],
  
  // Diet compatibility
  dietCompatibility: {
    vegan: false,
    vegetarian: true,
    glutenFree: false,
    dairyFree: true,
    nutFree: false,
  },
};

export const BarcodeFlow: React.FC<BarcodeFlowProps> = ({ imageUri, barcode, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [productData, setProductData] = useState<BarcodeProductData | null>(null);

  useEffect(() => {
    // Simulate API call to fetch product data
    const timer = setTimeout(() => {
      setProductData(mockProductData);
      setIsProcessing(false);
    }, 2500); // 2.5 seconds processing time

    return () => clearTimeout(timer);
  }, [barcode]);

  const handleSave = () => {
    console.log('Saving product to diary...');
    // TODO: Implement save functionality
    onClose();
  };

  if (isProcessing || !productData) {
    return <ProcessingScreen imageUri={imageUri} />;
  }

  return (
    <ResultsScreen
      imageUri={imageUri}
      productData={productData}
      onClose={onClose}
      onSave={handleSave}
    />
  );
};
