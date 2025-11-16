import { supabase } from '../config/supabase';

/**
 * Comprehensive Preferences Service
 * Handles all user preference data with progressive saving and resume capability
 */

export interface UserIdentityData {
  firstName: string;
  lastName?: string;
  email: string;
  dateOfBirth: string; // ISO date string
  gender: string;
  country: string;
  culturalBackground?: string;
}

export interface HouseholdData {
  householdSize: number;
  householdType: string;
  householdMembers: string[];
  defaultServingSize: number;
}

export interface DietData {
  dietPatterns: string[];
  religiousDietaryRules: string[];
  customDietaryRules: string[];
}

export interface AllergiesData {
  allergies: Array<{ name: string; severity: string }>;
  customAllergies: Array<{ name: string; severity: string }>;
}

export interface DislikesData {
  dislikedIngredients: string[];
  dislikedCuisines: string[];
  dislikedTextures: string[];
  dislikeNotes?: string;
}

export interface LovesData {
  lovedIngredients: string[];
  lovedCuisines: string[];
  lovedFlavors: string[];
  loveNotes?: string;
}

export interface CookingStyleData {
  cookingSkillLevel: string;
  timePerMealMinutes: number;
  kitchenEquipment: string[];
  prepTolerance: string;
}

export interface LifestyleData {
  mealsPerDay: string;
  cookDays: string[];
  orderDays: string[];
  cookOrderRatio: number;
  homeCookingBudget: number;
  deliveryBudget: number;
  workSchedule: string;
  healthGoals: string[];
  calorieConsciousMode: boolean;
  dailyCalorieTarget?: number;
  pregnancyStatus?: string | null;
}

export interface LocationData {
  cityNeighborhood: string;
  preciseAddress?: string;
  locationCoordinates?: { latitude: number; longitude: number };
  deliveryDistancePreference: string; // 'nearby', '20min', '30min', 'any'
}

export interface CompletePreferencesData {
  identity?: UserIdentityData;
  household?: HouseholdData;
  diet?: DietData;
  allergies?: AllergiesData;
  dislikes?: DislikesData;
  loves?: LovesData;
  cookingStyle?: CookingStyleData;
  lifestyle?: LifestyleData;
  location?: LocationData;
}

class PreferencesService {
  private userId: string | null = null;

  /**
   * Initialize service with user ID
   */
  async initialize(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    this.userId = user.id;
    console.log('PreferencesService initialized for user:', this.userId);
  }

  /**
   * Save user identity data (Step 1)
   */
  async saveIdentity(data: UserIdentityData): Promise<void> {
    await this.ensureInitialized();
    console.log('Saving identity data:', data);

    // Update users table
    const { error: userError } = await supabase
      .from('users')
      .update({
        first_name: data.firstName,
        last_name: data.lastName || null,
        email: data.email,
        date_of_birth: data.dateOfBirth,
        gender: data.gender,
        country: data.country,
        cultural_background: data.culturalBackground || null,
        onboarding_step: 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', this.userId);

    if (userError) {
      console.error('Failed to save identity:', userError);
      throw new Error(`Failed to save identity: ${userError.message}`);
    }

    console.log('Identity data saved successfully');
  }

  /**
   * Save household data (Step 2)
   */
  async saveHousehold(data: HouseholdData): Promise<void> {
    await this.ensureInitialized();
    console.log('Saving household data:', data);

    await this.upsertPreferences({
      household_size: data.householdSize,
      household_type: data.householdType,
      household_members: data.householdMembers,
      default_serving_size: data.defaultServingSize,
    });

    await this.updateOnboardingStep(2);
    console.log('Household data saved successfully');
  }

  /**
   * Save diet data (Step 3)
   */
  async saveDiet(data: DietData): Promise<void> {
    await this.ensureInitialized();
    console.log('Saving diet data:', data);

    await this.upsertPreferences({
      diet_patterns: data.dietPatterns,
      religious_dietary_rules: data.religiousDietaryRules,
      custom_dietary_rules: data.customDietaryRules,
    });

    await this.updateOnboardingStep(3);
    console.log('Diet data saved successfully');
  }

  /**
   * Save allergies data (Step 4)
   */
  async saveAllergies(data: AllergiesData): Promise<void> {
    await this.ensureInitialized();
    console.log('Saving allergies data:', data);

    await this.upsertPreferences({
      allergies: data.allergies,
      custom_allergies: data.customAllergies,
    });

    await this.updateOnboardingStep(4);
    console.log('Allergies data saved successfully');
  }

  /**
   * Save dislikes data (Step 5)
   */
  async saveDislikes(data: DislikesData): Promise<void> {
    await this.ensureInitialized();
    console.log('Saving dislikes data:', data);

    await this.upsertPreferences({
      disliked_ingredients: data.dislikedIngredients,
      disliked_cuisines: data.dislikedCuisines,
      disliked_textures: data.dislikedTextures,
      dislike_notes: data.dislikeNotes || null,
    });

    await this.updateOnboardingStep(5);
    console.log('Dislikes data saved successfully');
  }

  /**
   * Save loves data (Step 6)
   */
  async saveLoves(data: LovesData): Promise<void> {
    await this.ensureInitialized();
    console.log('Saving loves data:', data);

    await this.upsertPreferences({
      loved_ingredients: data.lovedIngredients,
      loved_cuisines: data.lovedCuisines,
      loved_flavors: data.lovedFlavors,
      love_notes: data.loveNotes || null,
    });

    await this.updateOnboardingStep(6);
    console.log('Loves data saved successfully');
  }

  /**
   * Save cooking style data (Step 7)
   */
  async saveCookingStyle(data: CookingStyleData): Promise<void> {
    await this.ensureInitialized();
    console.log('Saving cooking style data:', data);

    await this.upsertPreferences({
      cooking_skill_level: data.cookingSkillLevel,
      time_per_meal_minutes: data.timePerMealMinutes,
      kitchen_equipment: data.kitchenEquipment,
      prep_tolerance: data.prepTolerance,
    });

    await this.updateOnboardingStep(7);
    console.log('Cooking style data saved successfully');
  }

  /**
   * Save lifestyle data (Step 8)
   */
  async saveLifestyle(data: LifestyleData): Promise<void> {
    await this.ensureInitialized();
    console.log('Saving lifestyle data:', data);

    await this.upsertPreferences({
      meals_per_day: data.mealsPerDay,
      cook_days: data.cookDays,
      order_days: data.orderDays,
      cook_order_ratio: data.cookOrderRatio,
      home_cooking_budget: data.homeCookingBudget,
      delivery_budget: data.deliveryBudget,
      work_schedule: data.workSchedule,
      health_goals: data.healthGoals,
      calorie_conscious_mode: data.calorieConsciousMode,
      daily_calorie_target: data.dailyCalorieTarget || null,
      pregnancy_status: data.pregnancyStatus || null,
    });

    await this.updateOnboardingStep(8);
    console.log('Lifestyle data saved successfully');
  }

  /**
   * Save location data (Step 9)
   */
  async saveLocation(data: LocationData): Promise<void> {
    await this.ensureInitialized();
    console.log('Saving location data:', data);

    // Extract city name from cityNeighborhood (e.g., "La Mesa, California" -> "La Mesa")
    const cityName = data.cityNeighborhood.split(',')[0].trim();
    
    // Default delivery radius to 20 miles (standard for Uber Eats, DoorDash, etc.)
    const deliveryRadiusMiles = 20;

    await this.upsertPreferences({
      city_neighborhood: data.cityNeighborhood,
      location_city: cityName,
      precise_address: data.preciseAddress || null,
      delivery_radius_miles: deliveryRadiusMiles,
      delivery_distance_preference: data.deliveryDistancePreference,
      // Skip location_coordinates to avoid geometry parsing errors
      // We'll use city name + radius for AI prompts instead
    });

    await this.updateOnboardingStep(9);
    console.log('Location data saved successfully');
  }

  /**
   * Complete onboarding - mark as finished
   */
  async completeOnboarding(): Promise<void> {
    await this.ensureInitialized();
    console.log('Completing onboarding');

    const { error } = await supabase
      .from('users')
      .update({
        onboarding_completed: true,
        preferences_completed: true,
        onboarding_step: 10,
        updated_at: new Date().toISOString(),
      })
      .eq('id', this.userId);

    if (error) {
      console.error('Failed to complete onboarding:', error);
      throw new Error(`Failed to complete onboarding: ${error.message}`);
    }

    console.log('Onboarding completed successfully');
  }

  /**
   * Get current preferences
   */
  async getPreferences(): Promise<any> {
    await this.ensureInitialized();

    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', this.userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
      console.error('Failed to get preferences:', error);
      throw new Error(`Failed to get preferences: ${error.message}`);
    }

    return data || null;
  }

  /**
   * Get current onboarding step
   */
  async getOnboardingStep(): Promise<number> {
    await this.ensureInitialized();

    const { data, error } = await supabase
      .from('users')
      .select('onboarding_step')
      .eq('id', this.userId)
      .single();

    if (error) {
      console.error('Failed to get onboarding step:', error);
      return 0;
    }

    return data?.onboarding_step || 0;
  }

  /**
   * Private helper: Upsert preferences (insert or update)
   */
  private async upsertPreferences(data: any): Promise<void> {
    // Check if preferences exist
    const { data: existing } = await supabase
      .from('user_preferences')
      .select('id')
      .eq('user_id', this.userId)
      .single();

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from('user_preferences')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', this.userId);

      if (error) {
        console.error('Failed to update preferences:', error);
        throw new Error(`Failed to update preferences: ${error.message}`);
      }
    } else {
      // Insert new
      const { error } = await supabase
        .from('user_preferences')
        .insert({
          user_id: this.userId,
          ...data,
        });

      if (error) {
        console.error('Failed to insert preferences:', error);
        throw new Error(`Failed to insert preferences: ${error.message}`);
      }
    }
  }

  /**
   * Private helper: Update onboarding step
   */
  private async updateOnboardingStep(step: number): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({
        onboarding_step: step,
        updated_at: new Date().toISOString(),
      })
      .eq('id', this.userId);

    if (error) {
      console.error('Failed to update onboarding step:', error);
      throw new Error(`Failed to update onboarding step: ${error.message}`);
    }
  }

  /**
   * Private helper: Ensure service is initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.userId) {
      await this.initialize();
    }
  }
}

// Export singleton instance
export const preferencesService = new PreferencesService();
