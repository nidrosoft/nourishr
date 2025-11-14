import { Meal } from '../types';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  AuthStack: undefined;
  Welcome: undefined;
  PreferenceIdentity: undefined;
  PreferenceHousehold: { gender?: string };
  PreferenceDiet: { gender?: string };
  PreferenceAllergiesIntolerances: { gender?: string };
  PreferenceDislikes: { gender?: string };
  PreferenceLoves: { gender?: string };
  PreferenceCookingStyle: { gender?: string };
  PreferenceLifestyle: { gender?: string };
  PreferenceLocation: undefined;
  PreferenceSummary: undefined;
  AccountSetup: undefined;
  MainTab: undefined;
};

export type AuthStackParamList = {
  AuthLanding: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  PhoneSignUp: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Discover: undefined;
  Scan: undefined;
  Plan: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  MealDetail: { meal: Meal };
};

export type CookStackParamList = {
  CookMain: undefined;
  MealDetail: { meal: Meal };
};

export type FavoritesStackParamList = {
  FavoritesMain: undefined;
  MealDetail: { meal: Meal };
};
