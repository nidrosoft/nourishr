import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  Platform,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../../../../theme';
import { NourishrIcon } from '../../../../components';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CameraScreenProps {
  visible: boolean;
  onClose: () => void;
  onCapture: (imageUri: string) => void;
}

export const CameraScreen: React.FC<CameraScreenProps> = ({
  visible,
  onClose,
  onCapture,
}) => {
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [showGuidelines, setShowGuidelines] = useState(false);

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });
        if (photo?.uri) {
          onCapture(photo.uri);
        }
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  const handleUploadPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onCapture(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  if (!visible) return null;

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <NourishrIcon name="Camera" size={64} color={colors.gray40} />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need access to your camera to scan your meal
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
      >
        {/* Top Bar */}
        <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
          <TouchableOpacity style={styles.backIconButton} onPress={onClose}>
            <NourishrIcon name="ArrowLeft" size={28} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Scanning Frame - Corner Brackets */}
        <View style={styles.scanFrame}>
          {/* Top Left Corner */}
          <View style={[styles.corner, styles.cornerTopLeft]}>
            <View style={styles.cornerBracket} />
          </View>
          
          {/* Top Right Corner */}
          <View style={[styles.corner, styles.cornerTopRight]}>
            <View style={styles.cornerBracket} />
          </View>
          
          {/* Bottom Left Corner */}
          <View style={[styles.corner, styles.cornerBottomLeft]}>
            <View style={styles.cornerBracket} />
          </View>
          
          {/* Bottom Right Corner */}
          <View style={[styles.corner, styles.cornerBottomRight]}>
            <View style={styles.cornerBracket} />
          </View>
        </View>

        {/* Overlay Text */}
        <View style={styles.overlayTextContainer}>
          <Text style={styles.overlayText}>Point your camera at your meal 🍽️</Text>
        </View>

        {/* Bottom Controls */}
        <View style={[styles.bottomControls, { paddingBottom: insets.bottom + spacing.lg }]}>
          <TouchableOpacity
            style={styles.guidelinesButton}
            onPress={() => setShowGuidelines(true)}
          >
            <NourishrIcon name="InfoCircle" size={24} color={colors.white} />
            <Text style={styles.controlText}>Guidelines</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shutterButton} onPress={handleTakePicture}>
            <View style={styles.shutterInner} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPhoto}>
            <NourishrIcon name="Gallery" size={24} color={colors.white} />
            <Text style={styles.controlText}>Upload</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      {/* Guidelines Modal */}
      <Modal
        visible={showGuidelines}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGuidelines(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowGuidelines(false)}
        >
          <View style={styles.guidelinesCard}>
            <View style={styles.guidelinesHeader}>
              <NourishrIcon name="InfoCircle" size={24} color={colors.primary} />
              <Text style={styles.guidelinesTitle}>Tips for better accuracy</Text>
            </View>
            <View style={styles.guidelinesList}>
              <View style={styles.guidelineItem}>
                <Text style={styles.guidelineBullet}>•</Text>
                <Text style={styles.guidelineText}>Take photo from above</Text>
              </View>
              <View style={styles.guidelineItem}>
                <Text style={styles.guidelineBullet}>•</Text>
                <Text style={styles.guidelineText}>Include the whole plate</Text>
              </View>
              <View style={styles.guidelineItem}>
                <Text style={styles.guidelineBullet}>•</Text>
                <Text style={styles.guidelineText}>Good lighting helps</Text>
              </View>
              <View style={styles.guidelineItem}>
                <Text style={styles.guidelineBullet}>•</Text>
                <Text style={styles.guidelineText}>Keep background clean</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.guidelinesCloseButton}
              onPress={() => setShowGuidelines(false)}
            >
              <Text style={styles.guidelinesCloseText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  backIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    position: 'absolute',
    top: '15%',
    left: '8%',
    right: '8%',
    bottom: '20%',
  },
  corner: {
    position: 'absolute',
    width: 50,
    height: 50,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    transform: [{ scaleX: -1 }],
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    transform: [{ scaleY: -1 }],
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    transform: [{ scaleX: -1 }, { scaleY: -1 }],
  },
  cornerBracket: {
    width: 50,
    height: 50,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: colors.white,
    borderTopLeftRadius: 12,
  },
  overlayTextContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    transform: [{ translateY: -20 }],
  },
  overlayText: {
    ...typography.h3,
    color: colors.white,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  guidelinesButton: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  uploadButton: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  controlText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '600',
  },
  shutterButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
  },
  shutterInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.white,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.white,
  },
  permissionTitle: {
    ...typography.h2,
    color: colors.black,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  permissionText: {
    ...typography.body,
    color: colors.gray60,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 24,
    marginBottom: spacing.md,
  },
  permissionButtonText: {
    ...typography.bodyMedium,
    color: colors.white,
    fontWeight: '600',
  },
  backButton: {
    paddingVertical: spacing.sm,
  },
  backButtonText: {
    ...typography.body,
    color: colors.gray60,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  guidelinesCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 320,
  },
  guidelinesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  guidelinesTitle: {
    ...typography.h4,
    color: colors.black,
    fontWeight: '600',
  },
  guidelinesList: {
    marginBottom: spacing.lg,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  guidelineBullet: {
    ...typography.body,
    color: colors.primary,
    marginRight: spacing.sm,
    fontWeight: '700',
  },
  guidelineText: {
    ...typography.body,
    color: colors.gray70,
    flex: 1,
  },
  guidelinesCloseButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 24,
    alignItems: 'center',
  },
  guidelinesCloseText: {
    ...typography.bodyMedium,
    color: colors.white,
    fontWeight: '600',
  },
});
