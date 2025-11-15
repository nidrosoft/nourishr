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
