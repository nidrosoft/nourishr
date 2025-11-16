import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserPreferences } from '../types';
import { authService } from '../services/AuthService';
import {
  AuthService,
  UserPreferencesService,
  MockUserPreferencesService,
  AIRecommendationService,
  MockAIRecommendationService,
  AIChatService,
  MockAIChatService,
  FoodScanService,
  MockFoodScanService,
} from '../services';

interface AppContextType {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  isFirstLaunch: boolean;
  hasCompletedPreferences: boolean;
  isLoading: boolean;

  // Services
  authService: AuthService;
  preferencesService: UserPreferencesService;
  aiRecommendationService: AIRecommendationService;
  aiChatService: AIChatService;
  foodScanService: FoodScanService;

  // Actions
  setUser: (user: User | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  setIsFirstLaunch: (value: boolean) => void;
  setHasCompletedPreferences: (value: boolean) => void;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [hasCompletedPreferences, setHasCompletedPreferences] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize services
  // authService is imported from AuthService.ts (real Supabase implementation)
  const preferencesService = new MockUserPreferencesService();
  const aiRecommendationService = new MockAIRecommendationService();
  const aiChatService = new MockAIChatService();
  const foodScanService = new MockFoodScanService();

  useEffect(() => {
    // Simulate checking stored auth state
    const checkAuthState = async () => {
      try {
        // In real app, check AsyncStorage for tokens/user data
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // For now, always start fresh
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking auth state:', error);
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setIsAuthenticated(false);
      setHasCompletedPreferences(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value: AppContextType = {
    user,
    isAuthenticated,
    isFirstLaunch,
    hasCompletedPreferences,
    isLoading,
    authService,
    preferencesService,
    aiRecommendationService,
    aiChatService,
    foodScanService,
    setUser,
    setIsAuthenticated,
    setIsFirstLaunch,
    setHasCompletedPreferences,
    signOut,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
