import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, radius } from '../../../../theme';
import { NourishrIcon } from '../../../../components';
import { isSmallDevice } from '../../../../utils/responsive';

interface HeroCardProps {
  title: string;
  subtitle: string;
  image: string;
  onPress: () => void;
}

export const HeroCard: React.FC<HeroCardProps> = ({ title, subtitle, image, onPress }) => {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
      
      {/* Heart Icon */}
      <TouchableOpacity
        style={styles.heartButton}
        onPress={() => setIsSaved(!isSaved)}
        activeOpacity={0.8}
      >
        <NourishrIcon
          name="Heart"
          size={24}
          color={isSaved ? colors.primary : colors.white}
        />
      </TouchableOpacity>

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.overlay}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: isSmallDevice ? 180 : 200,
    borderRadius: radius.xl + 4,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: isSmallDevice ? 36 : 40,
    height: isSmallDevice ? 36 : 40,
    borderRadius: isSmallDevice ? 18 : 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    justifyContent: 'flex-end',
  },
  title: {
    ...typography.h2,
    fontSize: isSmallDevice ? 20 : 24,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    fontSize: isSmallDevice ? 13 : 14,
    color: colors.white,
    opacity: 0.9,
  },
});
