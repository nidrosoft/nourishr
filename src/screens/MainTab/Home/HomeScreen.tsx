import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, Animated } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing } from '../../../theme';
import { useApp } from '../../../context/AppContext';
import { Meal } from '../../../types';
import { MainTabParamList, HomeStackParamList } from '../../../navigation/types';
import { HomeHeader, PremiumBanner, CategorySection, FridgeActionCard, WeeklyPlanCard, MealSection } from './components';
import { useHomeData, useScrollAnimation } from './hooks';

type HomeScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, 'HomeMain'>,
  BottomTabNavigationProp<MainTabParamList>
>;

type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useApp();
  const insets = useSafeAreaInsets();
  const [statusBarStyle, setStatusBarStyle] = useState<'light-content' | 'dark-content'>('light-content');
  
  // Custom hooks
  const { categories, featured, orderNow, cookNow, trending } = useHomeData();
  const { scrollY, headerOpacity, handleScroll } = useScrollAnimation();

  // Handlers
  const handleCategoryPress = (categoryId: string) => {
    console.log('Category pressed:', categoryId);
    // TODO: Navigate to category screen or filter meals
  };

  const handleMealPress = (mealId: number) => {
    console.log('Meal pressed:', mealId);
    // TODO: Navigate to meal detail
    // navigation.navigate('MealDetail', { mealId });
  };

  const handleViewAll = (section: string) => {
    console.log('View all pressed:', section);
    // TODO: Navigate to view all screen
  };

  const handleNotificationPress = () => {
    console.log('Notifications pressed');
    // TODO: Navigate to notifications
  };

  const handleSearchPress = () => {
    console.log('Search pressed');
    // TODO: Navigate to search or open search modal
  };

  const handleFridgePress = () => {
    console.log('Fridge pressed');
    // TODO: Navigate to Cook What I Have flow
  };

  const handleWeeklyPlanPress = () => {
    console.log('Weekly plan pressed');
    // TODO: Navigate to weekly meal plan
  };

  // Update status bar style based on scroll
  React.useEffect(() => {
    const listenerId = scrollY.addListener(({ value }) => {
      if (value > 50 && statusBarStyle === 'light-content') {
        setStatusBarStyle('dark-content');
      } else if (value <= 50 && statusBarStyle === 'dark-content') {
        setStatusBarStyle('light-content');
      }
    });

    return () => scrollY.removeListener(listenerId);
  }, [scrollY, statusBarStyle]);

  // Interpolate status bar background
  const statusBarBackgroundColor = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)'],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle={statusBarStyle} translucent backgroundColor="transparent" />
      
      {/* Animated Status Bar Background */}
      <Animated.View 
        style={[
          styles.statusBarOverlay,
          { 
            height: insets.top,
            backgroundColor: statusBarBackgroundColor,
          }
        ]} 
        pointerEvents="none"
      />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        style={styles.scrollView}
      >
        {/* Header */}
        <HomeHeader
          userName={user?.fullName?.split(' ')[0]}
          onNotificationPress={handleNotificationPress}
          onSearchPress={handleSearchPress}
          notificationCount={3}
        />

        {/* Premium Banner */}
        <PremiumBanner />

        {/* Categories */}
        <CategorySection
          categories={categories}
          onCategoryPress={handleCategoryPress}
        />

        {/* Featured Meals */}
        <MealSection
          title="For You Today"
          meals={featured}
          onMealPress={handleMealPress}
          onViewAllPress={() => handleViewAll('featured')}
        />

        {/* Fridge Action Card */}
        <FridgeActionCard onPress={handleFridgePress} />

        {/* Order Now */}
        <MealSection
          title="Order Now 🚀"
          meals={orderNow}
          onMealPress={handleMealPress}
          onViewAllPress={() => handleViewAll('order')}
        />

        {/* Cook Now */}
        <MealSection
          title="Cook Now 🍳"
          meals={cookNow}
          onMealPress={handleMealPress}
          onViewAllPress={() => handleViewAll('cook')}
        />

        {/* Trending */}
        <MealSection
          title="Trending 🔥"
          meals={trending}
          onMealPress={handleMealPress}
          onViewAllPress={() => handleViewAll('trending')}
        />

        {/* Weekly Plan */}
        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.md }}>
          <WeeklyPlanCard onPress={handleWeeklyPlanPress} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  statusBarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
});
