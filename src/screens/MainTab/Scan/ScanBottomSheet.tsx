import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors, typography, spacing, radius } from '../../../theme';
import { NourishrIcon } from '../../../components';
import { CookWhatIHaveFlow } from './CookWhatIHaveFlow';
import { ShuffleMealBottomSheet } from './ShuffleMealFlow';
import { MealNutritionFlow } from './MealNutritionFlow';
import { BarcodeFlow } from './BarcodeFlow';
import { SmartPantryScan } from './SmartPantryScan';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT * 0.75;

type ScanMode = {
  id: string;
  icon: string;
  title: string;
  description: string;
  backgroundColor: string;
  iconColor: string;
};

const SCAN_MODES: ScanMode[] = [
  {
    id: 'shuffle-meal',
    icon: 'Refresh',
    title: 'Show Me What to Eat',
    description: 'Get personalized meal suggestions for breakfast, lunch, and dinner based on your preferences.',
    backgroundColor: '#FFF4E6',
    iconColor: '#F77F00',
  },
  {
    id: 'cook-what-i-have',
    icon: 'ShoppingCart',
    title: 'Cook What I Have',
    description: 'Snap photos of your ingredients and discover delicious dishes you can make by country or cuisine.',
    backgroundColor: '#FFE5E5',
    iconColor: '#E63946',
  },
  {
    id: 'meal-nutrition',
    icon: 'Health',
    title: 'Meal Nutrition Analysis',
    description: 'Get complete nutrition breakdown including calories, macros, and key nutrients for your meal.',
    backgroundColor: '#E8F5E9',
    iconColor: '#2D6A4F',
  },
  {
    id: 'barcode',
    icon: 'Barcode',
    title: 'Barcode (packaged food)',
    description: 'Scan the barcode for precise nutrition and serving sizes.',
    backgroundColor: '#E3F2FD',
    iconColor: '#1565C0',
  },
  {
    id: 'pantry',
    icon: 'Home2',
    title: 'Smart Pantry',
    description: 'Scan several items to build or update your pantry inventory.',
    backgroundColor: '#F3E5F5',
    iconColor: '#7B1FA2',
  },
];

interface ScanBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

export const ScanBottomSheet: React.FC<ScanBottomSheetProps> = ({ visible, onClose }) => {
  const insets = useSafeAreaInsets();
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [showCookWhatIHaveFlow, setShowCookWhatIHaveFlow] = useState(false);
  const [showShuffleMealFlow, setShowShuffleMealFlow] = useState(false);
  const [showMealNutritionFlow, setShowMealNutritionFlow] = useState(false);
  const [showBarcodeFlow, setShowBarcodeFlow] = useState(false);
  const [showSmartPantryScan, setShowSmartPantryScan] = useState(false);
  const translateY = useSharedValue(BOTTOM_SHEET_HEIGHT);

  useEffect(() => {
    if (visible) {
      // Slide up fast
      translateY.value = withTiming(0, { duration: 200 });
    } else {
      // Slide down fast
      translateY.value = withTiming(BOTTOM_SHEET_HEIGHT, { duration: 200 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleModeSelect = (modeId: string) => {
    setSelectedMode(modeId);
    
    if (modeId === 'cook-what-i-have') {
      // Open the Cook What I Have flow
      setShowCookWhatIHaveFlow(true);
      // Close the mode selector after a short delay
      setTimeout(() => {
        onClose();
      }, 100);
    } else if (modeId === 'shuffle-meal') {
      // Open the Shuffle Meal flow
      setShowShuffleMealFlow(true);
      // Close the mode selector after a short delay
      setTimeout(() => {
        onClose();
      }, 100);
    } else if (modeId === 'meal-nutrition') {
      // Open the Meal Nutrition Analysis flow
      setShowMealNutritionFlow(true);
      // Close the mode selector after a short delay
      setTimeout(() => {
        onClose();
      }, 100);
    } else if (modeId === 'barcode') {
      // Open the Barcode flow
      setShowBarcodeFlow(true);
      // Close the mode selector after a short delay
      setTimeout(() => {
        onClose();
      }, 100);
    } else if (modeId === 'pantry') {
      // Open the Smart Pantry Scan flow
      setShowSmartPantryScan(true);
      // Close the mode selector after a short delay
      setTimeout(() => {
        onClose();
      }, 100);
    } else {
      // TODO: Navigate to other scan mode screens with camera activation
      console.log('Selected mode:', modeId);
      onClose();
    }
  };

  const handleCloseCookWhatIHaveFlow = () => {
    setShowCookWhatIHaveFlow(false);
  };

  const handleCloseShuffleMealFlow = () => {
    setShowShuffleMealFlow(false);
  };

  const handleCloseMealNutritionFlow = () => {
    setShowMealNutritionFlow(false);
  };

  const handleCloseBarcodeFlow = () => {
    setShowBarcodeFlow(false);
  };

  const handleCloseSmartPantryScan = () => {
    setShowSmartPantryScan(false);
  };

  const handleItemAdded = (item: any) => {
    console.log('Item added to pantry:', item);
    // TODO: Add to pantry state
  };

  if (!visible && !showCookWhatIHaveFlow && !showShuffleMealFlow && !showMealNutritionFlow && !showBarcodeFlow && !showSmartPantryScan) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Dark Overlay */}
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1}
        onPress={onClose}
      />
      
      {/* Bottom Sheet - Mode Picker */}
      <Animated.View 
        style={[
          styles.bottomSheet, 
          { 
            paddingBottom: insets.bottom + spacing.lg,
          },
          animatedStyle,
        ]}
        pointerEvents="auto"
      >
        <View style={styles.bottomSheetHandle} />
        
        <View style={styles.bottomSheetHeader}>
          <View style={styles.bottomSheetTitleContainer}>
            <Text style={styles.bottomSheetTitle}>What would you like to do?</Text>
            <Text style={styles.bottomSheetSubtitle}>Choose an action to get started</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <NourishrIcon name="CloseCircle" size={28} color={colors.gray60} />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={styles.modeList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.modeListContent}
        >
          {SCAN_MODES.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={styles.modeItem}
              onPress={() => handleModeSelect(mode.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.modeIconContainer, { backgroundColor: mode.backgroundColor }]}>
                <NourishrIcon name={mode.icon as any} size={24} color={mode.iconColor} />
              </View>
              <View style={styles.modeContent}>
                <Text style={styles.modeTitle}>{mode.title}</Text>
                <Text style={styles.modeDescription}>{mode.description}</Text>
              </View>
              <NourishrIcon name="ArrowRight" size={20} color={colors.gray60} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Cook What I Have Flow */}
      <CookWhatIHaveFlow
        visible={showCookWhatIHaveFlow}
        onClose={handleCloseCookWhatIHaveFlow}
      />

      {/* Shuffle Meal Flow */}
      <ShuffleMealBottomSheet
        visible={showShuffleMealFlow}
        onClose={handleCloseShuffleMealFlow}
      />

      {/* Meal Nutrition Flow */}
      <MealNutritionFlow
        visible={showMealNutritionFlow}
        onClose={handleCloseMealNutritionFlow}
      />

      {/* Barcode Flow */}
      {showBarcodeFlow && (
        <BarcodeFlow
          imageUri="https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400"
          barcode="722252100016"
          onClose={handleCloseBarcodeFlow}
        />
      )}

      {/* Smart Pantry Scan */}
      {showSmartPantryScan && (
        <SmartPantryScan
          onClose={handleCloseSmartPantryScan}
          onItemAdded={handleItemAdded}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: BOTTOM_SHEET_HEIGHT,
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.gray20,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  bottomSheetTitleContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  bottomSheetTitle: {
    ...typography.headingM,
    color: colors.black,
    fontWeight: '700',
    marginBottom: 4,
  },
  bottomSheetSubtitle: {
    ...typography.caption,
    color: colors.gray60,
  },
  closeButton: {
    padding: 4,
  },
  modeList: {
    flex: 1,
  },
  modeListContent: {
    paddingBottom: spacing.md,
  },
  modeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  modeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  modeContent: {
    flex: 1,
  },
  modeTitle: {
    ...typography.bodyMedium,
    color: colors.black,
    fontWeight: '600',
    marginBottom: 4,
  },
  modeDescription: {
    ...typography.caption,
    color: colors.gray60,
    lineHeight: 16,
  },
});
