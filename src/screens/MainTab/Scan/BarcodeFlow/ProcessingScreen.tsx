import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Easing, Image } from 'react-native';
import { colors, spacing, typography } from '../../../../theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

interface ProcessingScreenProps {
  imageUri: string;
}

export const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ imageUri }) => {
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Continuous vertical scanning animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation for the barcode icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const scanLineTranslateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCREEN_HEIGHT * 0.5],
  });

  return (
    <View style={styles.container}>
      {/* Background Image with Overlay */}
      <Image source={{ uri: imageUri }} style={styles.backgroundImage} blurRadius={10} />
      <View style={styles.overlay} />

      {/* Scanning Frame */}
      <View style={styles.scanFrame}>
        {/* Corner Brackets */}
        <View style={[styles.corner, styles.cornerTopLeft]}>
          <View style={styles.cornerBracket} />
        </View>
        <View style={[styles.corner, styles.cornerTopRight]}>
          <View style={styles.cornerBracket} />
        </View>
        <View style={[styles.corner, styles.cornerBottomLeft]}>
          <View style={styles.cornerBracket} />
        </View>
        <View style={[styles.corner, styles.cornerBottomRight]}>
          <View style={styles.cornerBracket} />
        </View>

        {/* Animated Scan Line */}
        <Animated.View
          style={[
            styles.scanLine,
            {
              transform: [{ translateY: scanLineTranslateY }],
            },
          ]}
        />

        {/* Barcode Icon with Pulse */}
        <Animated.View
          style={[
            styles.barcodeIconContainer,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <View style={styles.barcodeIcon}>
            <View style={[styles.barcodeLine, { width: 4 }]} />
            <View style={[styles.barcodeLine, { width: 2 }]} />
            <View style={[styles.barcodeLine, { width: 6 }]} />
            <View style={[styles.barcodeLine, { width: 3 }]} />
            <View style={[styles.barcodeLine, { width: 5 }]} />
            <View style={[styles.barcodeLine, { width: 2 }]} />
            <View style={[styles.barcodeLine, { width: 4 }]} />
            <View style={[styles.barcodeLine, { width: 3 }]} />
          </View>
        </Animated.View>
      </View>

      {/* Status Text */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusTitle}>Reading Barcode...</Text>
        <Text style={styles.statusSubtitle}>Fetching product information</Text>
        
        {/* Loading Dots */}
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  backgroundImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  scanFrame: {
    position: 'absolute',
    top: '15%',
    left: '8%',
    right: '8%',
    bottom: '35%',
    zIndex: 10,
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
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  barcodeIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -40,
    marginTop: -30,
  },
  barcodeIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
  },
  barcodeLine: {
    height: 40,
    backgroundColor: colors.black,
    borderRadius: 1,
  },
  statusContainer: {
    position: 'absolute',
    bottom: '20%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  statusTitle: {
    ...typography.h2,
    color: colors.white,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  statusSubtitle: {
    ...typography.body,
    color: colors.white,
    opacity: 0.8,
    fontSize: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
});
