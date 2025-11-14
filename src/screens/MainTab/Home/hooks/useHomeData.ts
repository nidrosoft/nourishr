import { FOOD_CATEGORIES } from '../../../../data/categories';
import { 
  FEATURED_MEALS, 
  ORDER_NOW_MEALS, 
  COOK_NOW_MEALS, 
  TRENDING_MEALS 
} from '../../../../data/meals';

export const useHomeData = () => {
  // In a real app, this would fetch from an API
  // For now, we're using static data
  
  return {
    categories: FOOD_CATEGORIES,
    featured: FEATURED_MEALS,
    orderNow: ORDER_NOW_MEALS,
    cookNow: COOK_NOW_MEALS,
    trending: TRENDING_MEALS,
  };
};
