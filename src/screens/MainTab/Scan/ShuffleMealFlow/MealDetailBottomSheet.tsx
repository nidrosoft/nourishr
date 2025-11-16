import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { HapticFeedback } from '../../../../utils/haptics';
import { colors, typography, spacing, radius, shadows, iosRadius } from '../../../../theme';
import { NourishrIcon } from '../../../../components';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MealDetailBottomSheetProps {
  visible: boolean;
  meal: {
    id: string;
    name: string;
    description: string;
    tags: string[];
    calories: number;
    time: string;
    image?: string;
    category?: string;
    subcategory?: string;
    rating?: number;
    priceRange?: string;
    promo?: string;
  };
  onClose: () => void;
}

export const MealDetailBottomSheet: React.FC<MealDetailBottomSheetProps> = ({
  visible,
  meal,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const [isSaved, setIsSaved] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  
  // Animation values
  const translateY = useSharedValue(1000);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Slide up animation - smooth timing to match slide down
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withTiming(0, { duration: 300 });
    } else {
      // Slide down animation
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(1000, { duration: 300 });
    }
  }, [visible]);

  const handleClose = () => {
    // Trigger close animation then call onClose
    opacity.value = withTiming(0, { duration: 200 });
    translateY.value = withTiming(1000, { duration: 300 }, () => {
      runOnJS(onClose)();
    });
  };

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleOrderNow = async () => {
    await HapticFeedback.medium();
    
    // Show delivery app options
    Alert.alert(
      'Order from',
      'Choose your preferred delivery service',
      [
        {
          text: 'UberEats',
          onPress: () => openDeliveryApp('ubereats'),
        },
        {
          text: 'DoorDash',
          onPress: () => openDeliveryApp('doordash'),
        },
        {
          text: 'Grubhub',
          onPress: () => openDeliveryApp('grubhub'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const openDeliveryApp = async (app: string) => {
    const appUrls: { [key: string]: string } = {
      ubereats: 'ubereats://',
      doordash: 'doordash://',
      grubhub: 'grubhub://',
    };

    const webUrls: { [key: string]: string } = {
      ubereats: 'https://www.ubereats.com',
      doordash: 'https://www.doordash.com',
      grubhub: 'https://www.grubhub.com',
    };

    try {
      const canOpen = await Linking.canOpenURL(appUrls[app]);
      if (canOpen) {
        await Linking.openURL(appUrls[app]);
      } else {
        // Fallback to web
        await Linking.openURL(webUrls[app]);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open delivery app');
    }
  };

  const handleSave = async () => {
    if (isSaved) {
      await HapticFeedback.light();
    } else {
      await HapticFeedback.success();
    }
    setIsSaved(!isSaved);
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const truncateDescription = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength || isDescriptionExpanded) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (!visible) return null;

  // Use real food image
  const foodImage = meal.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80';

  return (
    <View style={styles.container}>
      {/* Overlay */}
      <Animated.View style={[styles.overlay, animatedOverlayStyle]}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={handleClose}
        />
      </Animated.View>

      {/* Bottom Sheet */}
      <Animated.View style={[styles.bottomSheet, animatedSheetStyle, { paddingBottom: insets.bottom + spacing.lg }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
        >
          {/* White Container for Image */}
          <View style={styles.imageContainer}>
            {/* Image Card */}
            <View style={styles.imageCard}>
              <Image source={{ uri: foodImage }} style={styles.mealImage} />
              
              {/* Back Arrow Button */}
              <TouchableOpacity style={styles.backButton} onPress={handleClose}>
                <View style={styles.iconContainer}>
                  <NourishrIcon
                    name="ArrowLeft"
                    size={20}
                    color={colors.black}
                  />
                </View>
              </TouchableOpacity>

              {/* Menu Detail Title */}
              <View style={styles.menuDetailContainer}>
                <Text style={styles.menuDetailText}>Menu Detail</Text>
              </View>

              {/* Heart Save Button */}
              <TouchableOpacity style={styles.heartButton} onPress={handleSave}>
                <View style={styles.iconContainer}>
                  <NourishrIcon
                    name="Heart"
                    size={20}
                    color={isSaved ? colors.primary : colors.black}
                    variant={isSaved ? 'Bold' : 'Linear'}
                  />
                </View>
              </TouchableOpacity>

              {/* Promo Badge */}
              {meal.promo && (
                <View style={styles.promoBadge}>
                  <Text style={styles.promoText}>{meal.promo}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Content Card */}
          <View style={styles.contentCard}>
            {/* Category */}
            <Text style={styles.categoryText}>{meal.category || 'Breakfast'}</Text>

            {/* Meal Name & Price Badge */}
            <View style={styles.nameRow}>
              <Text style={styles.mealName}>{meal.name}</Text>
              {meal.priceRange && (
                <View style={styles.priceBadge}>
                  <Text style={styles.priceBadgeText}>{meal.priceRange}</Text>
                </View>
              )}
            </View>

            {/* Stats Row: Rating, Calories, Time */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Ratings</Text>
                <View style={styles.statValueRow}>
                  <Text style={styles.statIcon}>⭐</Text>
                  <Text style={styles.statValue}>{meal.rating || 4.8}</Text>
                </View>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Calories</Text>
                <View style={styles.statValueRow}>
                  <Text style={styles.statIcon}>🔥</Text>
                  <Text style={styles.statValue}>{meal.calories}kcal</Text>
                </View>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Time</Text>
                <View style={styles.statValueRow}>
                  <Text style={styles.statIcon}>⏱️</Text>
                  <Text style={styles.statValue}>{meal.time}</Text>
                </View>
              </View>
            </View>

            {/* Info Badges: Distance, Restaurant, Popularity */}
            <View style={styles.infoBadgesRow}>
              <View style={styles.distanceBadge}>
                <NourishrIcon name="Location" size={14} color="#1976D2" />
                <Text style={styles.distanceBadgeText}>1.2 mi away</Text>
              </View>
              <View style={styles.restaurantBadge}>
                <NourishrIcon name="Home2" size={14} color="#7B1FA2" />
                <Text style={styles.restaurantBadgeText}>Panera Bread</Text>
              </View>
              <View style={styles.popularityBadge}>
                <NourishrIcon name="Crown" size={14} color="#E65100" />
                <Text style={styles.popularityBadgeText}>Popular</Text>
              </View>
            </View>

            {/* Description */}
            <View style={styles.descriptionSection}>
              <Text style={styles.description}>
                {truncateDescription(meal.description)}
              </Text>
              {meal.description.length > 120 && (
                <TouchableOpacity onPress={toggleDescription}>
                  <Text style={styles.readMoreButton}>
                    {isDescriptionExpanded ? 'Read Less' : 'Read More'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Order Now Button */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleOrderNow} activeOpacity={0.9}>
            <LinearGradient
              colors={['#FF9500', '#FD6A2F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.orderButton}
            >
              <Text style={styles.orderButtonText}>Order Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#EAEAEA',
    borderTopLeftRadius: Platform.OS === 'ios' ? iosRadius.sheet : 56,
    borderTopRightRadius: Platform.OS === 'ios' ? iosRadius.sheet : 56,
    maxHeight: '92%',
    ...shadows.xl,
  },
  scrollContent: {
    paddingTop: 0,
    paddingHorizontal: 0,
  },
  imageContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: Platform.OS === 'ios' ? iosRadius.sheet : 56,
    borderTopRightRadius: Platform.OS === 'ios' ? iosRadius.sheet : 56,
    borderBottomLeftRadius: Platform.OS === 'ios' ? iosRadius.card : 56,
    borderBottomRightRadius: Platform.OS === 'ios' ? iosRadius.card : 56,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  imageCard: {
    width: '100%',
    aspectRatio: 1.15,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: colors.gray10,
  },
  mealImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    zIndex: 10,
  },
  iconContainer: {
    width: Math.min(40, SCREEN_WIDTH * 0.1),
    height: Math.min(40, SCREEN_WIDTH * 0.1),
    borderRadius: Math.min(20, SCREEN_WIDTH * 0.05),
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuDetailContainer: {
    position: 'absolute',
    top: spacing.lg,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 5,
  },
  menuDetailText: {
    ...typography.bodyMedium,
    color: colors.black,
    fontSize: Math.min(16, SCREEN_WIDTH * 0.042),
    fontWeight: '600',
  },
  heartButton: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    zIndex: 10,
  },
  promoBadge: {
    position: 'absolute',
    top: spacing.lg + 50,
    right: spacing.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  promoText: {
    ...typography.caption,
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  contentCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: Platform.OS === 'ios' ? iosRadius.card : 56,
    borderTopRightRadius: Platform.OS === 'ios' ? iosRadius.card : 56,
    padding: spacing.lg,
    marginHorizontal: 0,
    marginTop: -spacing.xs,
    marginBottom: 0,
    paddingBottom: spacing.xl * 2,
    ...shadows.md,
  },
  categoryText: {
    ...typography.caption,
    color: colors.gray60,
    fontSize: 13,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  mealName: {
    ...typography.h2,
    fontSize: Math.min(22, SCREEN_WIDTH * 0.058),
    fontWeight: '700',
    color: colors.black,
    flex: 1,
    marginRight: spacing.sm,
  },
  priceBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
  },
  priceBadgeText: {
    ...typography.caption,
    color: colors.white,
    fontSize: Math.min(14, SCREEN_WIDTH * 0.037),
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: spacing.xl,
    marginBottom: spacing.lg,
    paddingHorizontal: 0,
  },
  statItem: {
    alignItems: 'flex-start',
  },
  statLabel: {
    ...typography.caption,
    color: colors.gray60,
    fontSize: Math.min(12, SCREEN_WIDTH * 0.032),
    fontWeight: '500',
    marginBottom: spacing.xs - 2,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs - 4,
  },
  statIcon: {
    fontSize: 14,
  },
  statValue: {
    ...typography.body,
    color: colors.black,
    fontSize: Math.min(14, SCREEN_WIDTH * 0.037),
    fontWeight: '600',
  },
  infoBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs - 2,
    backgroundColor: '#E3F2FD',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs - 1,
    borderRadius: radius.full,
  },
  distanceBadgeText: {
    ...typography.caption,
    color: '#1976D2',
    fontSize: Math.min(13, SCREEN_WIDTH * 0.034),
    fontWeight: '600',
  },
  restaurantBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs - 2,
    backgroundColor: '#F3E5F5',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs - 1,
    borderRadius: radius.full,
  },
  restaurantBadgeText: {
    ...typography.caption,
    color: '#7B1FA2',
    fontSize: Math.min(13, SCREEN_WIDTH * 0.034),
    fontWeight: '600',
  },
  popularityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs - 2,
    backgroundColor: '#FFF3E0',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs - 1,
    borderRadius: radius.full,
  },
  popularityBadgeText: {
    ...typography.caption,
    color: '#E65100',
    fontSize: Math.min(13, SCREEN_WIDTH * 0.034),
    fontWeight: '600',
  },
  descriptionSection: {
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.gray70,
    fontSize: Math.min(15, SCREEN_WIDTH * 0.039),
    lineHeight: Math.min(23, SCREEN_WIDTH * 0.061),
    marginBottom: spacing.xs,
  },
  readMoreButton: {
    ...typography.body,
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray10,
  },
  orderButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md + 4,
    borderRadius: radius.full,
  },
  orderButtonText: {
    ...typography.bodyMedium,
    color: colors.white,
    fontSize: 17,
    fontWeight: '600',
  },
});
