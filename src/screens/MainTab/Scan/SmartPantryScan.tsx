import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors, typography, spacing, radius } from '../../../theme';
import { NourishrIcon } from '../../../components';
import { ItemDetectionSheet } from './components/ItemDetectionSheet';
import { Toast } from './components/Toast';

interface SmartPantryScanProps {
  onClose: () => void;
  onItemAdded: (item: any) => void;
}

export const SmartPantryScan: React.FC<SmartPantryScanProps> = ({ onClose, onItemAdded }) => {
  const insets = useSafeAreaInsets();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedItem, setDetectedItem] = useState<any>(null);
  const [showDetectionSheet, setShowDetectionSheet] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const cameraRef = useRef<any>(null);
  const scale = useSharedValue(1);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    // Pulse animation for scan button (Reanimated 3)
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,  // Infinite loop
      true // Reverse
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleCapture = async () => {
    if (!cameraRef.current || isProcessing) return;

    setIsProcessing(true);

    // Simulate AI detection (replace with actual AI call)
    setTimeout(() => {
      const mockDetectedItem = {
        name: 'Eggs',
        emoji: '🥚',
        category: 'Dairy & Eggs',
        quantity: '12',
        unit: 'pieces',
        confidence: 0.95,
      };

      setDetectedItem(mockDetectedItem);
      setShowDetectionSheet(true);
      setIsProcessing(false);
    }, 1500);
  };

  const handleAddItem = (item: any) => {
    onItemAdded(item);
    setShowDetectionSheet(false);
    setDetectedItem(null);
    
    // Show toast notification
    setToastMessage(`${item.emoji} ${item.name} added to pantry!`);
    setShowToast(true);
    
    // Camera stays open for next scan
  };

  const handleCancelDetection = () => {
    setShowDetectionSheet(false);
    setDetectedItem(null);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>No access to camera</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing="back">
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <NourishrIcon name="ArrowLeft" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Smart Pantry Scan</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Scan Frame */}
        <View style={styles.scanFrame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>

        {/* Bottom Section */}
        <View style={[styles.bottomSection, { paddingBottom: insets.bottom + spacing.xl }]}>
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>
              Point at one item at a time
            </Text>
            <Text style={styles.instructionSubtext}>
              Like milk, pasta, eggs. I'll detect and add it.
            </Text>
          </View>

          {/* Capture Button */}
          <View style={styles.captureContainer}>
            <Animated.View style={pulseStyle}>
              <TouchableOpacity
                style={[styles.captureButton, isProcessing && styles.captureButtonProcessing]}
                onPress={handleCapture}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <View style={styles.processingIndicator}>
                    <Text style={styles.processingText}>Analyzing...</Text>
                  </View>
                ) : (
                  <View style={styles.captureInner} />
                )}
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </CameraView>

      {/* Item Detection Bottom Sheet */}
      {showDetectionSheet && detectedItem && (
        <ItemDetectionSheet
          item={detectedItem}
          onAdd={handleAddItem}
          onCancel={handleCancelDetection}
        />
      )}

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        visible={showToast}
        onHide={() => setShowToast(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  camera: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 40,
  },
  scanFrame: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    right: '10%',
    height: 250,
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: colors.primary,
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingTop: spacing.xl,
  },
  instructionContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  instructionText: {
    ...typography.h4,
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  instructionSubtext: {
    ...typography.body,
    color: colors.white,
    fontSize: 14,
    opacity: 0.8,
    textAlign: 'center',
  },
  captureContainer: {
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.primary,
  },
  captureButtonProcessing: {
    opacity: 0.7,
  },
  captureInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
  },
  processingIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingText: {
    ...typography.bodyMedium,
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  permissionText: {
    ...typography.body,
    color: colors.white,
    fontSize: 16,
    textAlign: 'center',
    marginTop: spacing.xl * 3,
  },
  closeButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    marginTop: spacing.xl,
    alignSelf: 'center',
  },
  closeButtonText: {
    ...typography.h4,
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
