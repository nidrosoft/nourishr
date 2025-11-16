export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  onboardingCompleted?: boolean;
  onboardingStep?: number;
}

export interface UserPreferences {
  dietTypes: string[];
  allergies: string[];
  favoriteCuisines: string[];
  mealsPerDay: number;
  rotationWindow: string;
}
