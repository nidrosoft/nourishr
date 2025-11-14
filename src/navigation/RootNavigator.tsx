import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useApp } from '../context/AppContext';
import { RootStackParamList } from './types';
import { SplashScreen } from '../screens/Splash/SplashScreen';
import { OnboardingScreen } from '../screens/Onboarding/OnboardingScreen';
import { WelcomeScreen } from '../screens/Onboarding/WelcomeScreen';
import { AccountSetupScreen } from '../screens/Onboarding/AccountSetupScreen';
import { PreferenceIdentityScreen } from '../screens/Preferences/PreferenceIdentityScreen';
import { PreferenceHouseholdScreen } from '../screens/Preferences/PreferenceHouseholdScreen';
import { PreferenceDietScreen } from '../screens/Preferences/PreferenceDietScreen';
import { PreferenceAllergiesIntolerancesScreen } from '../screens/Preferences/PreferenceAllergiesIntolerancesScreen';
import { PreferenceDislikesScreen } from '../screens/Preferences/PreferenceDislikesScreen';
import { PreferenceLovesScreen } from '../screens/Preferences/PreferenceLovesScreen';
import { PreferenceCookingStyleScreen } from '../screens/Preferences/PreferenceCookingStyleScreen';
import { PreferenceLifestyleScreen } from '../screens/Preferences/PreferenceLifestyleScreen';
import { PreferenceLocationScreen } from '../screens/Preferences/PreferenceLocationScreen';
import { PreferenceSummaryScreen } from '../screens/Preferences/PreferenceSummaryScreen';
import { AuthStackNavigator } from './AuthStackNavigator';
import { MainTabNavigator } from './MainTabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const {
    isAuthenticated,
    isFirstLaunch,
    hasCompletedPreferences,
    isLoading,
  } = useApp();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (!isLoading && showSplash) {
      // Splash will call setShowSplash(false) after timeout
    }
  }, [isLoading, showSplash]);

  if (showSplash || isLoading) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isFirstLaunch && (
        <Stack.Screen 
          name="Onboarding"
          options={{ headerShown: false }}
        >
          {(props) => (
            <OnboardingScreen
              {...props}
              onComplete={() => props.navigation.replace('AuthStack')}
            />
          )}
        </Stack.Screen>
      )}
      
      {!isAuthenticated && (
        <>
          <Stack.Screen 
            name="AuthStack" 
            component={AuthStackNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Welcome" 
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="PreferenceIdentity" 
            component={PreferenceIdentityScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="PreferenceHousehold" 
            component={PreferenceHouseholdScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="PreferenceDiet" 
            component={PreferenceDietScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="PreferenceAllergiesIntolerances" 
            component={PreferenceAllergiesIntolerancesScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="PreferenceDislikes" 
            component={PreferenceDislikesScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="PreferenceLoves" 
            component={PreferenceLovesScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="PreferenceCookingStyle" 
            component={PreferenceCookingStyleScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="PreferenceLifestyle" 
            component={PreferenceLifestyleScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="PreferenceLocation" 
            component={PreferenceLocationScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="PreferenceSummary" 
            component={PreferenceSummaryScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="AccountSetup" 
            component={AccountSetupScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
      
      {isAuthenticated && (
        <Stack.Screen 
          name="MainTab" 
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};
