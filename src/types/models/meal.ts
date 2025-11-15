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
