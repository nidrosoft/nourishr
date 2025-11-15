import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { colors, typography, spacing } from '../../../../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const LOADING_MESSAGES = [
  'Analyzing your meal… 🔬',
  'Breaking down nutrients…',
  'Detecting ingredients…',
  'Estimating calories…',
  'Calculating macros…',
  'Identifying vitamins…',
];

interface ProcessingScreenProps {
  imageUri: string;
}

export const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ imageUri }) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const scanOpacityAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Vertical scanning line animation - continuous loop (up and down)
    Animated.loop(
      Animated.sequence([
        // Scan down
        Animated.parallel([
          Animated.timing(scanLineAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(scanOpacityAnim, {
            toValue: 0.8,
            duration: 2000,
            useNativeDriver: false,
          }),
        ]),
        // Scan up
        Animated.parallel([
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(scanOpacityAnim, {
            toValue: 0.8,
            duration: 2000,
            useNativeDriver: false,
          }),
        ]),
      ])
    ).start();

    // Cycle through loading messages every 2.5 seconds
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);

    return () => {
      clearInterval(messageInterval);
    };
  }, []);

  useEffect(() => {
    // Fade animation when message changes
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [currentMessage]);

  // Calculate frame dimensions (15% from top, 20% from bottom = 65% height)
  const frameTop = SCREEN_HEIGHT * 0.15;
  const frameBottom = SCREEN_HEIGHT * 0.8;
  const frameHeight = frameBottom - frameTop;

  const scanLinePosition = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, frameHeight],
  });

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image source={{ uri: imageUri }} style={styles.backgroundImage} />

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

        {/* Scanned Area Overlay (green tint) */}
        <Animated.View
          style={[
            styles.scanOverlay,
            {
              height: scanLinePosition,
              opacity: scanOpacityAnim,
            },
          ]}
        />

        {/* Scanning Line - inside frame */}
        <Animated.View
          style={[
            styles.scanLine,
            {
              top: scanLinePosition,
              opacity: scanOpacityAnim,
            },
          ]}
        >
          <View style={styles.scanLineGlow} />
        </Animated.View>
      </View>

      {/* Overlay */}
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* Loading Message */}
          <Animated.View
            style={[
              styles.messageContainer,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <Text style={styles.loadingMessage}>{LOADING_MESSAGES[currentMessage]}</Text>
          </Animated.View>

          {/* Subtext */}
          <Text style={styles.subtext}>This usually takes a few seconds</Text>
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
  scanFrame: {
    position: 'absolute',
    top: '15%',
    left: '8%',
    right: '8%',
    bottom: '20%',
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
    height: 3,
  },
  scanLineGlow: {
    width: '100%',
    height: 2,
    backgroundColor: '#00FF00',
    shadowColor: '#00FF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 10,
  },
  scanOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0, 255, 0, 0.15)',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingBottom: spacing.xl * 3,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  messageContainer: {
    marginBottom: spacing.md,
  },
  loadingMessage: {
    ...typography.h3,
    color: colors.white,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 20,
  },
  subtext: {
    ...typography.body,
    color: colors.white,
    opacity: 0.7,
    textAlign: 'center',
  },
});
