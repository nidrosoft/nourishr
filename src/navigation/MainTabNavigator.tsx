import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme';
import { NourishrIcon } from '../components';
import { MainTabParamList, HomeStackParamList } from './types';
import { HomeScreen, MealDetailScreen as HomeMealDetail } from '../screens/MainTab/Home';
import { DiscoverScreen } from '../screens/MainTab/Discover/DiscoverScreen';
import { ScanBottomSheet } from '../screens/MainTab/Scan/ScanBottomSheet';
import { PlanScreen } from '../screens/MainTab/Plan/PlanScreen';
import { ProfileScreen, SettingsScreen } from '../screens/MainTab/Profile';

const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const ProfileStack = createNativeStackNavigator();

// Home Stack
const HomeStackNavigator = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="HomeMain"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <HomeStack.Screen
      name="MealDetail"
      component={HomeMealDetail}
      options={{ headerShown: false }}
    />
  </HomeStack.Navigator>
);

// Profile Stack
const ProfileStackNavigator = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen
      name="ProfileMain"
      component={ProfileScreen}
      options={{ headerShown: false }}
    />
    <ProfileStack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ headerShown: false }}
    />
  </ProfileStack.Navigator>
);

// Dummy component for Scan tab (never rendered)
const ScanPlaceholder = () => null;

export const MainTabNavigator: React.FC = () => {
  const [scanVisible, setScanVisible] = useState(false);
  
  const handleTabPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleScanPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setScanVisible(true);
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.gray60,
          tabBarStyle: {
            backgroundColor: colors.white,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            borderTopWidth: 1,
            borderTopColor: colors.line,
            borderLeftWidth: 1,
            borderLeftColor: colors.line,
            borderRightWidth: 1,
            borderRightColor: colors.line,
            paddingTop: 16,
            paddingBottom: 24,
            paddingHorizontal: 20,
            height: 90,
            position: 'absolute',
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: '600',
            marginTop: 4,
          },
          headerShown: false,
        }}
        screenListeners={{
          tabPress: handleTabPress,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStackNavigator}
          options={{
            tabBarIcon: ({ focused }) => (
              <NourishrIcon 
                name="Home" 
                size={24} 
                color={focused ? colors.primary : colors.gray60} 
              />
            ),
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.gray60,
          }}
        />
        <Tab.Screen
          name="Discover"
          component={DiscoverScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <NourishrIcon 
                name="SearchNormal" 
                size={24} 
                color={focused ? colors.primary : colors.gray60} 
              />
            ),
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.gray60,
          }}
        />
        <Tab.Screen
          name="Scan"
          component={ScanPlaceholder}
          options={{
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={handleScanPress}
                style={styles.scanButtonContainer}
              >
                <View style={styles.scanButton}>
                  <LinearGradient
                    colors={['#FF9500', '#FD6A2F']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.scanGradient}
                  >
                    <NourishrIcon 
                      name="Camera" 
                      size={28} 
                      color={colors.white} 
                    />
                  </LinearGradient>
                </View>
              </TouchableOpacity>
            ),
            tabBarLabel: 'Scan',
          }}
        />
        <Tab.Screen
          name="Plan"
          component={PlanScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <NourishrIcon 
                name="Calendar" 
                size={24} 
                color={focused ? colors.primary : colors.gray60} 
              />
            ),
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.gray60,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileStackNavigator}
          options={{
            tabBarIcon: ({ focused }) => (
              <NourishrIcon 
                name="User" 
                size={24} 
                color={focused ? colors.primary : colors.gray60} 
              />
            ),
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.gray60,
          }}
        />
      </Tab.Navigator>

      {/* Scan Bottom Sheet Overlay */}
      <ScanBottomSheet 
        visible={scanVisible} 
        onClose={() => setScanVisible(false)} 
      />
    </>
  );
};

const styles = StyleSheet.create({
  scanButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
