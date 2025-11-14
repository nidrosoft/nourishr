import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius } from '../../../theme';
import { NourishrIcon } from '../../../components';
import { CookWhatIHaveFlow } from './CookWhatIHaveFlow';

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
    id: 'cook-what-i-have',
    icon: 'ShoppingCart',
    title: 'Cook What I Have',
    description: 'Snap photos of your ingredients and discover delicious dishes you can make by country or cuisine.',
    backgroundColor: '#FFE5E5',
    iconColor: '#E63946',
  },
  {
    id: 'plate',
    icon: 'Cup',
    title: 'Plate / meal calories',
    description: 'Quick estimate of calories for a single plate or bowl.',
    backgroundColor: '#FFF4E6',
    iconColor: '#F77F00',
  },
  {
    id: 'nutrition',
    icon: 'SearchNormal',
    title: 'Nutrition breakdown',
    description: 'Get calories, macros and key nutrients for a meal.',
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
  {
    id: 'manual',
    icon: 'Edit2',
    title: 'Add ingredients manually',
    description: 'Type or pick ingredients if you do not want to use the camera.',
    backgroundColor: '#FFF9C4',
    iconColor: '#F9A825',
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
  const slideAnim = useRef(new Animated.Value(BOTTOM_SHEET_HEIGHT)).current;

  React.useEffect(() => {
    if (visible) {
      // Slide up
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else {
      // Slide down
      Animated.timing(slideAnim, {
        toValue: BOTTOM_SHEET_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const handleModeSelect = (modeId: string) => {
    setSelectedMode(modeId);
    
    if (modeId === 'cook-what-i-have') {
      // Open the Cook What I Have flow
      setShowCookWhatIHaveFlow(true);
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

  if (!visible && !showCookWhatIHaveFlow) return null;

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
            transform: [{ translateY: slideAnim }],
          }
        ]}
        pointerEvents="auto"
      >
        <View style={styles.bottomSheetHandle} />
        
        <View style={styles.bottomSheetHeader}>
          <View style={styles.bottomSheetTitleContainer}>
            <Text style={styles.bottomSheetTitle}>What do you want to scan?</Text>
            <Text style={styles.bottomSheetSubtitle}>Choose what you want to scan below</Text>
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
              <NourishrIcon name="ChevronRight" size={20} color={colors.gray60} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Cook What I Have Flow */}
      <CookWhatIHaveFlow
        visible={showCookWhatIHaveFlow}
        onClose={handleCloseCookWhatIHaveFlow}
      />
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
  loadingText: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.white,
  },
  permissionTitle: {
    ...typography.headingM,
    color: colors.black,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  permissionDescription: {
    ...typography.body,
    color: colors.gray60,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
  },
  permissionButtonText: {
    ...typography.bodyMedium,
    color: colors.white,
    fontWeight: '600',
  },
  backgroundOverlay: {
    flex: 1,
    backgroundColor: colors.gray20,
  },
  topBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  topBarTitle: {
    ...typography.headingM,
    color: colors.white,
    fontWeight: '700',
    marginBottom: 4,
  },
  topBarSubtitle: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scanGuide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 280,
    height: 280,
    borderWidth: 3,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    backgroundColor: 'transparent',
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
