# 🚀 SUPABASE IMPLEMENTATION GUIDE
## Step-by-Step Database Setup for Nourishr

**Date:** November 15, 2025  
**Prerequisites:** Supabase account, Node.js, npm

---

## 📋 TABLE OF CONTENTS
1. [Supabase Project Setup](#supabase-project-setup)
2. [Authentication Configuration](#authentication-configuration)
3. [Database Migration](#database-migration)
4. [API Integration Recommendations](#api-integration-recommendations)
5. [Environment Variables](#environment-variables)
6. [Testing the Database](#testing-the-database)

---

## 🔧 SUPABASE PROJECT SETUP

### Step 1: Create Supabase Project
```bash
# 1. Go to https://supabase.com
# 2. Click "New Project"
# 3. Fill in:
#    - Name: nourishr-production
#    - Database Password: [STRONG PASSWORD - SAVE THIS!]
#    - Region: Choose closest to your users
# 4. Wait for project to be created (~2 minutes)
```

### Step 2: Install Supabase Client
```bash
cd nourishr
npm install @supabase/supabase-js
```

### Step 3: Get Project Credentials
```bash
# In Supabase Dashboard:
# 1. Go to Project Settings > API
# 2. Copy:
#    - Project URL
#    - anon/public key
#    - service_role key (KEEP SECRET!)
```

---

## 🔐 AUTHENTICATION CONFIGURATION

### Enable Auth Providers

#### 1. Email Authentication (Already enabled by default)
```sql
-- No additional setup needed
```

#### 2. Phone Authentication (Twilio)
```bash
# In Supabase Dashboard:
# 1. Go to Authentication > Providers
# 2. Enable "Phone"
# 3. Choose Twilio as provider
# 4. Add Twilio credentials:
#    - Account SID
#    - Auth Token
#    - Phone Number (for sending SMS)
```

**Twilio Setup:**
```bash
# 1. Create Twilio account: https://www.twilio.com/try-twilio
# 2. Get a phone number
# 3. Copy Account SID and Auth Token
# 4. Add to Supabase Phone Auth settings
```

#### 3. Google OAuth
```bash
# In Supabase Dashboard:
# 1. Go to Authentication > Providers
# 2. Enable "Google"
# 3. Add Google OAuth credentials:
#    - Client ID
#    - Client Secret
```

**Google OAuth Setup:**
```bash
# 1. Go to Google Cloud Console: https://console.cloud.google.com
# 2. Create new project or select existing
# 3. Enable Google+ API
# 4. Create OAuth 2.0 credentials
# 5. Add authorized redirect URIs:
#    - https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
# 6. Copy Client ID and Client Secret
```

---

## 💾 DATABASE MIGRATION

### Migration File 1: Core Tables
**File:** `supabase/migrations/001_create_core_tables.sql`

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Users table (extends auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT,
  full_name TEXT GENERATED ALWAYS AS (
    CASE 
      WHEN last_name IS NOT NULL THEN first_name || ' ' || last_name
      ELSE first_name
    END
  ) STORED,
  date_of_birth DATE NOT NULL,
  age INTEGER GENERATED ALWAYS AS (
    DATE_PART('year', AGE(CURRENT_DATE, date_of_birth))::INTEGER
  ) STORED,
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Non-binary', 'Prefer not to say')),
  country TEXT NOT NULL,
  cultural_background TEXT,
  email TEXT UNIQUE,
  phone_number TEXT UNIQUE,
  auth_provider TEXT NOT NULL CHECK (auth_provider IN ('email', 'phone', 'google')),
  avatar_url TEXT,
  bio TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_step INTEGER DEFAULT 0,
  preferences_completed BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  premium_expires_at TIMESTAMP WITH TIME ZONE,
  trial_used BOOLEAN DEFAULT FALSE,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_phone ON users(phone_number) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_premium ON users(is_premium) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_created_at ON users(created_at);

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### Migration File 2: User Preferences
**File:** `supabase/migrations/002_create_user_preferences.sql`

```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  household_size INTEGER NOT NULL DEFAULT 1 CHECK (household_size >= 1 AND household_size <= 20),
  household_type TEXT CHECK (household_type IN ('solo', 'couple', 'family', 'large', 'custom')),
  household_members TEXT[] DEFAULT '{}',
  default_serving_size INTEGER NOT NULL DEFAULT 2 CHECK (default_serving_size >= 1 AND default_serving_size <= 8),
  diet_patterns TEXT[] DEFAULT '{}',
  religious_dietary_rules TEXT[] DEFAULT '{}',
  custom_dietary_rules TEXT[] DEFAULT '{}',
  allergies JSONB DEFAULT '[]'::JSONB,
  custom_allergies JSONB DEFAULT '[]'::JSONB,
  disliked_ingredients TEXT[] DEFAULT '{}',
  disliked_cuisines TEXT[] DEFAULT '{}',
  disliked_textures TEXT[] DEFAULT '{}',
  dislike_notes TEXT,
  loved_ingredients TEXT[] DEFAULT '{}',
  loved_cuisines TEXT[] DEFAULT '{}',
  loved_flavors TEXT[] DEFAULT '{}',
  love_notes TEXT,
  cooking_skill_level TEXT CHECK (cooking_skill_level IN ('beginner', 'comfortable', 'pro')),
  time_per_meal_minutes INTEGER DEFAULT 20 CHECK (time_per_meal_minutes IN (10, 20, 30, 45)),
  available_equipment TEXT[] DEFAULT '{}',
  custom_equipment TEXT[] DEFAULT '{}',
  prep_tolerance TEXT CHECK (prep_tolerance IN ('minimal', 'okay', 'love')),
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'lightly-active', 'moderately-active', 'very-active', 'extremely-active')),
  health_goals TEXT[] DEFAULT '{}',
  meal_frequency INTEGER DEFAULT 3 CHECK (meal_frequency >= 1 AND meal_frequency <= 6),
  snack_preference TEXT CHECK (snack_preference IN ('never', 'rarely', 'sometimes', 'often', 'always')),
  hydration_goal_liters NUMERIC(3,1) DEFAULT 2.0,
  city_neighborhood TEXT,
  location_coordinates GEOGRAPHY(POINT),
  delivery_distance_preference TEXT CHECK (delivery_distance_preference IN ('nearby', '20min', '30min', 'any')),
  favorite_restaurants TEXT[] DEFAULT '{}',
  meal_rotation_days INTEGER DEFAULT 7 CHECK (meal_rotation_days >= 3 AND meal_rotation_days <= 30),
  variety_preference TEXT CHECK (variety_preference IN ('low', 'medium', 'high')),
  budget_per_meal_usd NUMERIC(6,2),
  ai_context_summary TEXT,
  last_ai_context_update TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_user_preferences_location ON user_preferences USING GIST(location_coordinates);

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);
```

### Migration File 3: Pantry & Meal Planning
**File:** `supabase/migrations/003_create_pantry_and_meals.sql`

```sql
-- Pantry Items
CREATE TABLE pantry_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('produce', 'dairy', 'meat', 'grains', 'canned', 'frozen', 'spices', 'condiments', 'snacks', 'beverages', 'other')),
  quantity NUMERIC(10,2) DEFAULT 1,
  unit TEXT,
  barcode TEXT,
  product_name TEXT,
  brand TEXT,
  image_url TEXT,
  purchase_date DATE,
  expiration_date DATE,
  days_until_expiration INTEGER GENERATED ALWAYS AS (
    CASE 
      WHEN expiration_date IS NOT NULL THEN (expiration_date - CURRENT_DATE)::INTEGER
      ELSE NULL
    END
  ) STORED,
  is_expiring_soon BOOLEAN GENERATED ALWAYS AS (
    CASE 
      WHEN expiration_date IS NOT NULL AND (expiration_date - CURRENT_DATE) <= 7 THEN TRUE
      ELSE FALSE
    END
  ) STORED,
  storage_location TEXT CHECK (storage_location IN ('pantry', 'fridge', 'freezer', 'counter')),
  is_consumed BOOLEAN DEFAULT FALSE,
  consumed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_pantry_items_user_id ON pantry_items(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_pantry_items_expiring ON pantry_items(user_id, expiration_date) WHERE deleted_at IS NULL AND is_consumed = FALSE;
CREATE INDEX idx_pantry_items_category ON pantry_items(user_id, category) WHERE deleted_at IS NULL;
CREATE INDEX idx_pantry_items_barcode ON pantry_items(barcode) WHERE deleted_at IS NULL;

CREATE TRIGGER update_pantry_items_updated_at
  BEFORE UPDATE ON pantry_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE pantry_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own pantry" ON pantry_items
  FOR ALL USING (auth.uid() = user_id);

-- Meal Plans
CREATE TABLE meal_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_name TEXT,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_meal_plans_user_id ON meal_plans(user_id);
CREATE INDEX idx_meal_plans_week ON meal_plans(user_id, week_start_date, week_end_date);
CREATE INDEX idx_meal_plans_active ON meal_plans(user_id, is_active);

ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own meal plans" ON meal_plans
  FOR ALL USING (auth.uid() = user_id);

-- Planned Meals
CREATE TABLE planned_meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meal_plan_id UUID NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  meal_date DATE NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  meal_name TEXT NOT NULL,
  meal_description TEXT,
  meal_image_url TEXT,
  source_type TEXT CHECK (source_type IN ('ai-generated', 'user-selected', 'favorite', 'recipe', 'restaurant')),
  source_id UUID,
  calories INTEGER,
  protein_grams NUMERIC(6,2),
  carbs_grams NUMERIC(6,2),
  fat_grams NUMERIC(6,2),
  prep_time_minutes INTEGER,
  cook_time_minutes INTEGER,
  servings INTEGER DEFAULT 1,
  ingredients JSONB DEFAULT '[]'::JSONB,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_planned_meals_plan_id ON planned_meals(meal_plan_id);
CREATE INDEX idx_planned_meals_user_id ON planned_meals(user_id);
CREATE INDEX idx_planned_meals_date ON planned_meals(user_id, meal_date);
CREATE INDEX idx_planned_meals_type ON planned_meals(user_id, meal_type);

ALTER TABLE planned_meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own planned meals" ON planned_meals
  FOR ALL USING (auth.uid() = user_id);
```

### Migration File 4: Favorites, Scans, AI, Notifications
**File:** `supabase/migrations/004_create_favorites_scans_ai_notifications.sql`

```sql
-- Favorites
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('recipe', 'restaurant-dish', 'ai-suggestion', 'custom')),
  item_name TEXT NOT NULL,
  item_description TEXT,
  item_image_url TEXT,
  source_id TEXT,
  source_api TEXT,
  ingredients JSONB DEFAULT '[]'::JSONB,
  instructions TEXT,
  prep_time_minutes INTEGER,
  cook_time_minutes INTEGER,
  servings INTEGER,
  calories INTEGER,
  protein_grams NUMERIC(6,2),
  carbs_grams NUMERIC(6,2),
  fat_grams NUMERIC(6,2),
  restaurant_name TEXT,
  restaurant_address TEXT,
  restaurant_cuisine TEXT,
  delivery_time_minutes INTEGER,
  price_usd NUMERIC(8,2),
  user_notes TEXT,
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  times_cooked INTEGER DEFAULT 0,
  last_cooked_at TIMESTAMP WITH TIME ZONE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_favorites_user_id ON favorites(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_favorites_type ON favorites(user_id, item_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_favorites_tags ON favorites USING GIN(tags) WHERE deleted_at IS NULL;

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own favorites" ON favorites
  FOR ALL USING (auth.uid() = user_id);

-- Scan History
CREATE TABLE scan_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scan_type TEXT NOT NULL CHECK (scan_type IN ('barcode', 'meal-nutrition', 'ingredient-recognition')),
  barcode TEXT,
  product_name TEXT,
  brand TEXT,
  product_image_url TEXT,
  meal_image_url TEXT,
  meal_name TEXT,
  estimated_calories INTEGER,
  estimated_protein_grams NUMERIC(6,2),
  estimated_carbs_grams NUMERIC(6,2),
  estimated_fat_grams NUMERIC(6,2),
  detected_ingredients TEXT[] DEFAULT '{}',
  confidence_score NUMERIC(3,2),
  api_provider TEXT,
  api_response JSONB,
  added_to_pantry BOOLEAN DEFAULT FALSE,
  added_to_favorites BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_scan_history_user_id ON scan_history(user_id);
CREATE INDEX idx_scan_history_type ON scan_history(user_id, scan_type);
CREATE INDEX idx_scan_history_barcode ON scan_history(barcode);
CREATE INDEX idx_scan_history_created_at ON scan_history(user_id, created_at DESC);

ALTER TABLE scan_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scan history" ON scan_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scans" ON scan_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- AI Chat Sessions
CREATE TABLE ai_chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_title TEXT,
  session_type TEXT CHECK (session_type IN ('cooking-help', 'meal-suggestion', 'recipe-modification', 'general')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_ai_chat_sessions_user_id ON ai_chat_sessions(user_id);
CREATE INDEX idx_ai_chat_sessions_active ON ai_chat_sessions(user_id, is_active);

ALTER TABLE ai_chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own chat sessions" ON ai_chat_sessions
  FOR ALL USING (auth.uid() = user_id);

-- AI Chat Messages
CREATE TABLE ai_chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES ai_chat_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  model TEXT,
  tokens_used INTEGER,
  response_time_ms INTEGER,
  context_used JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ai_chat_messages_session_id ON ai_chat_messages(session_id);
CREATE INDEX idx_ai_chat_messages_user_id ON ai_chat_messages(user_id);
CREATE INDEX idx_ai_chat_messages_created_at ON ai_chat_messages(session_id, created_at);

ALTER TABLE ai_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own chat messages" ON ai_chat_messages
  FOR ALL USING (auth.uid() = user_id);

-- User Notifications
CREATE TABLE user_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN (
    'expiring-item',
    'meal-rotation',
    'weekly-plan-reminder',
    'shopping-list',
    'recipe-suggestion',
    'premium-trial',
    'system'
  )),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_type TEXT,
  action_data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  is_dismissed BOOLEAN DEFAULT FALSE,
  dismissed_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  delivery_method TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX idx_user_notifications_unread ON user_notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_user_notifications_type ON user_notifications(user_id, notification_type);
CREATE INDEX idx_user_notifications_created_at ON user_notifications(user_id, created_at DESC);

ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON user_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON user_notifications
  FOR UPDATE USING (auth.uid() = user_id);
```

---

## 🔌 API INTEGRATION RECOMMENDATIONS

### 1. Barcode Scanning API
**Recommended:** Open Food Facts API (Free)

```typescript
// src/services/BarcodeAPIService.ts
const OPEN_FOOD_FACTS_API = 'https://world.openfoodfacts.org/api/v0';

export async function scanBarcode(barcode: string) {
  const response = await fetch(`${OPEN_FOOD_FACTS_API}/product/${barcode}.json`);
  const data = await response.json();
  
  if (data.status === 1) {
    return {
      barcode,
      productName: data.product.product_name,
      brand: data.product.brands,
      imageUrl: data.product.image_url,
      calories: data.product.nutriments.energy_kcal_100g,
      protein: data.product.nutriments.proteins_100g,
      carbs: data.product.nutriments.carbohydrates_100g,
      fat: data.product.nutriments.fat_100g,
    };
  }
  
  return null;
}
```

### 2. Meal Nutrition Scanning (AI Vision)
**Recommended:** OpenAI Vision API

```typescript
// src/services/MealVisionAPIService.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeMealImage(imageBase64: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-vision-preview',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Analyze this meal image and provide: 1) Meal name, 2) Estimated calories, 3) Protein (g), 4) Carbs (g), 5) Fat (g), 6) Main ingredients. Format as JSON.',
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`,
            },
          },
        ],
      },
    ],
    max_tokens: 500,
  });
  
  return JSON.parse(response.choices[0].message.content);
}
```

### 3. AI Meal Recommendations
**Recommended:** OpenAI GPT-4 or Claude 3

```typescript
// src/services/AIRecommendationService.ts
export async function generateMealRecommendations(userContext: any) {
  const systemPrompt = `You are a meal recommendation AI. User profile:
  - Diet: ${userContext.diet_patterns.join(', ')}
  - Allergies: ${userContext.allergies.map(a => a.label).join(', ')}
  - Cooking skill: ${userContext.cooking_skill_level}
  - Time available: ${userContext.time_per_meal_minutes} minutes
  - Household size: ${userContext.household_size}
  - Loves: ${userContext.loved_cuisines.join(', ')}
  - Dislikes: ${userContext.disliked_ingredients.join(', ')}
  
  Suggest 5 meals that fit this profile.`;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'What should I eat today?' },
    ],
  });
  
  return response.choices[0].message.content;
}
```

---

## 🔑 ENVIRONMENT VARIABLES

Create `.env.local`:

```bash
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# Twilio (for phone auth - configured in Supabase)
# No need to add here, configured in Supabase dashboard

# Google OAuth (configured in Supabase)
# No need to add here, configured in Supabase dashboard
```

---

## ✅ TESTING THE DATABASE

### Test Script
```typescript
// scripts/test-database.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

async function testDatabase() {
  // Test 1: Create user preferences
  const { data: prefs, error: prefsError } = await supabase
    .from('user_preferences')
    .insert({
      user_id: 'test-user-id',
      household_size: 2,
      diet_patterns: ['vegetarian'],
      cooking_skill_level: 'beginner',
    })
    .select();
  
  console.log('Preferences created:', prefs);
  
  // Test 2: Add pantry item
  const { data: pantry, error: pantryError } = await supabase
    .from('pantry_items')
    .insert({
      user_id: 'test-user-id',
      name: 'Milk',
      category: 'dairy',
      expiration_date: '2025-11-20',
    })
    .select();
  
  console.log('Pantry item added:', pantry);
  
  // Test 3: Query expiring items
  const { data: expiring } = await supabase
    .from('pantry_items')
    .select('*')
    .eq('user_id', 'test-user-id')
    .eq('is_expiring_soon', true);
  
  console.log('Expiring items:', expiring);
}

testDatabase();
```

---

## 🎉 NEXT STEPS

1. ✅ Run all migration files in Supabase SQL Editor
2. ✅ Configure authentication providers
3. ✅ Set up environment variables
4. ✅ Install Supabase client in app
5. ✅ Replace mock services with real Supabase calls
6. ✅ Test authentication flows
7. ✅ Test database operations
8. ✅ Integrate OpenAI for AI features
9. ✅ Integrate barcode scanning API
10. ✅ Deploy and test!

**Your database is ready for production!** 🚀
