export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
}

export interface UserPreferences {
  dietTypes: string[];
  allergies: string[];
  favoriteCuisines: string[];
  mealsPerDay: number;
  rotationWindow: string;
}

export interface Meal {
  id: string;
  title: string;
  image: string;
  type: 'recipe' | 'delivery';
  cuisine?: string;
  prepTime?: number;
  calories?: number;
  healthTags?: string[];
  deliveryETA?: number;
  restaurant?: string;
  ingredients?: string[];
  instructions?: string[];
  isFavorite?: boolean;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpPayload extends AuthCredentials {
  fullName: string;
  confirmPassword: string;
}

export interface PhoneAuthPayload {
  phone: string;
  code?: string;
}
