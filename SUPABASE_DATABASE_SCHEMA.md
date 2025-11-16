# 🗄️ NOURISHR - SUPABASE DATABASE SCHEMA
## Complete Database Design for AI-Powered Meal Planning App

**Date:** November 15, 2025  
**Database:** Supabase (PostgreSQL)  
**Auth:** Supabase Auth + Twilio (Phone) + Google OAuth  

---

## 📋 TABLE OF CONTENTS
1. [Authentication & Users](#authentication--users)
2. [User Preferences (Onboarding Data)](#user-preferences-onboarding-data)
3. [Pantry Management](#pantry-management)
4. [Meal Planning](#meal-planning)
5. [Favorites & Saved Items](#favorites--saved-items)
6. [Scan History](#scan-history)
7. [AI Interactions](#ai-interactions)
8. [Notifications & Reminders](#notifications--reminders)
9. [Relationships & Indexes](#relationships--indexes)
10. [Row Level Security (RLS)](#row-level-security-rls)

---

## 🔐 AUTHENTICATION & USERS

### Table: `users` (Extends Supabase Auth)
**Purpose:** Core user profile and identity information

```sql
CREATE TABLE users (
  -- Primary Key (matches Supabase auth.users.id)
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Identity Information (Screen 1: PreferenceIdentity)
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
  cultural_background TEXT, -- Same as country, but can be different
  
  -- Contact & Auth
  email TEXT UNIQUE,
  phone_number TEXT UNIQUE,
  auth_provider TEXT NOT NULL CHECK (auth_provider IN ('email', 'phone', 'google')),
  
  -- Profile
  avatar_url TEXT,
  bio TEXT,
  
  -- Onboarding Status
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_step INTEGER DEFAULT 0,
  preferences_completed BOOLEAN DEFAULT FALSE,
  
  -- Account Status
  is_premium BOOLEAN DEFAULT FALSE,
  premium_expires_at TIMESTAMP WITH TIME ZONE,
  trial_used BOOLEAN DEFAULT FALSE,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE,
  
  -- Soft Delete
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_phone ON users(phone_number) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_premium ON users(is_premium) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_created_at ON users(created_at);

-- Trigger for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## 🎯 USER PREFERENCES (ONBOARDING DATA)

### Table: `user_preferences`
**Purpose:** Complete user preferences from 10-screen onboarding flow

```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  
  -- Screen 2: Household Information
  household_size INTEGER NOT NULL DEFAULT 1 CHECK (household_size >= 1 AND household_size <= 20),
  household_type TEXT CHECK (household_type IN ('solo', 'couple', 'family', 'large', 'custom')),
  household_members TEXT[] DEFAULT '{}', -- ['adults', 'kids', 'elders', 'roommates', 'partner']
  default_serving_size INTEGER NOT NULL DEFAULT 2 CHECK (default_serving_size >= 1 AND default_serving_size <= 8),
  
  -- Screen 3: Diet Patterns
  diet_patterns TEXT[] DEFAULT '{}', -- ['vegetarian', 'vegan', 'keto', 'low-carb', 'mediterranean', etc.]
  religious_dietary_rules TEXT[] DEFAULT '{}', -- ['halal', 'kosher', 'no-pork', 'no-beef', etc.]
  custom_dietary_rules TEXT[] DEFAULT '{}', -- User-defined rules
  
  -- Screen 4: Allergies & Intolerances
  allergies JSONB DEFAULT '[]'::JSONB, -- [{ "id": "peanuts", "label": "Peanuts", "severity": "allergic" }]
  custom_allergies JSONB DEFAULT '[]'::JSONB, -- [{ "id": "custom-123", "label": "Mango", "severity": "sensitive" }]
  
  -- Screen 5: Dislikes
  disliked_ingredients TEXT[] DEFAULT '{}',
  disliked_cuisines TEXT[] DEFAULT '{}',
  disliked_textures TEXT[] DEFAULT '{}', -- ['mushy', 'slimy', 'crunchy', etc.]
  dislike_notes TEXT,
  
  -- Screen 6: Loves (Favorite Foods)
  loved_ingredients TEXT[] DEFAULT '{}',
  loved_cuisines TEXT[] DEFAULT '{}',
  loved_flavors TEXT[] DEFAULT '{}', -- ['spicy', 'sweet', 'savory', 'umami', etc.]
  love_notes TEXT,
  
  -- Screen 7: Cooking Style
  cooking_skill_level TEXT CHECK (cooking_skill_level IN ('beginner', 'comfortable', 'pro')),
  time_per_meal_minutes INTEGER DEFAULT 20 CHECK (time_per_meal_minutes IN (10, 20, 30, 45)),
  available_equipment TEXT[] DEFAULT '{}', -- ['oven', 'stovetop', 'air-fryer', 'instant-pot', etc.]
  custom_equipment TEXT[] DEFAULT '{}',
  prep_tolerance TEXT CHECK (prep_tolerance IN ('minimal', 'okay', 'love')),
  
  -- Screen 8: Lifestyle
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'lightly-active', 'moderately-active', 'very-active', 'extremely-active')),
  health_goals TEXT[] DEFAULT '{}', -- ['lose-weight', 'gain-muscle', 'maintain', 'improve-health', etc.]
  meal_frequency INTEGER DEFAULT 3 CHECK (meal_frequency >= 1 AND meal_frequency <= 6),
  snack_preference TEXT CHECK (snack_preference IN ('never', 'rarely', 'sometimes', 'often', 'always')),
  hydration_goal_liters NUMERIC(3,1) DEFAULT 2.0,
  
  -- Screen 9: Location & Delivery
  city_neighborhood TEXT,
  location_coordinates GEOGRAPHY(POINT),
  delivery_distance_preference TEXT CHECK (delivery_distance_preference IN ('nearby', '20min', '30min', 'any')),
  favorite_restaurants TEXT[] DEFAULT '{}',
  
  -- Screen 10: Summary & Additional
  meal_rotation_days INTEGER DEFAULT 7 CHECK (meal_rotation_days >= 3 AND meal_rotation_days <= 30),
  variety_preference TEXT CHECK (variety_preference IN ('low', 'medium', 'high')),
  budget_per_meal_usd NUMERIC(6,2),
  
  -- AI Prompt Context
  ai_context_summary TEXT, -- Generated summary for AI prompts
  last_ai_context_update TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_user_preferences_location ON user_preferences USING GIST(location_coordinates);

-- Trigger
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## 🥫 PANTRY MANAGEMENT

### Table: `pantry_items`
**Purpose:** Track user's pantry inventory with expiration dates

```sql
CREATE TABLE pantry_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Item Information
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('produce', 'dairy', 'meat', 'grains', 'canned', 'frozen', 'spices', 'condiments', 'snacks', 'beverages', 'other')),
  quantity NUMERIC(10,2) DEFAULT 1,
  unit TEXT, -- 'pieces', 'kg', 'lbs', 'oz', 'ml', 'liters', etc.
  
  -- Barcode & Product Info
  barcode TEXT,
  product_name TEXT,
  brand TEXT,
  image_url TEXT,
  
  -- Expiration Tracking
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
  
  -- Storage Location
  storage_location TEXT CHECK (storage_location IN ('pantry', 'fridge', 'freezer', 'counter')),
  
  -- Status
  is_consumed BOOLEAN DEFAULT FALSE,
  consumed_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Soft Delete
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_pantry_items_user_id ON pantry_items(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_pantry_items_expiring ON pantry_items(user_id, expiration_date) WHERE deleted_at IS NULL AND is_consumed = FALSE;
CREATE INDEX idx_pantry_items_category ON pantry_items(user_id, category) WHERE deleted_at IS NULL;
CREATE INDEX idx_pantry_items_barcode ON pantry_items(barcode) WHERE deleted_at IS NULL;

-- Trigger
CREATE TRIGGER update_pantry_items_updated_at
  BEFORE UPDATE ON pantry_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## 📅 MEAL PLANNING

### Table: `meal_plans`
**Purpose:** Weekly meal planning with AI-generated or user-selected meals

```sql
CREATE TABLE meal_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Plan Information
  plan_name TEXT,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_meal_plans_user_id ON meal_plans(user_id);
CREATE INDEX idx_meal_plans_week ON meal_plans(user_id, week_start_date, week_end_date);
CREATE INDEX idx_meal_plans_active ON meal_plans(user_id, is_active);
```

### Table: `planned_meals`
**Purpose:** Individual meals in the weekly plan

```sql
CREATE TABLE planned_meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meal_plan_id UUID NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Meal Details
  meal_date DATE NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  meal_name TEXT NOT NULL,
  meal_description TEXT,
  meal_image_url TEXT,
  
  -- Source
  source_type TEXT CHECK (source_type IN ('ai-generated', 'user-selected', 'favorite', 'recipe', 'restaurant')),
  source_id UUID, -- Reference to recipes or restaurants table (future)
  
  -- Nutrition (if available)
  calories INTEGER,
  protein_grams NUMERIC(6,2),
  carbs_grams NUMERIC(6,2),
  fat_grams NUMERIC(6,2),
  
  -- Cooking Info
  prep_time_minutes INTEGER,
  cook_time_minutes INTEGER,
  servings INTEGER DEFAULT 1,
  
  -- Ingredients
  ingredients JSONB DEFAULT '[]'::JSONB, -- [{ "name": "Chicken", "quantity": 500, "unit": "g" }]
  
  -- Status
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_planned_meals_plan_id ON planned_meals(meal_plan_id);
CREATE INDEX idx_planned_meals_user_id ON planned_meals(user_id);
CREATE INDEX idx_planned_meals_date ON planned_meals(user_id, meal_date);
CREATE INDEX idx_planned_meals_type ON planned_meals(user_id, meal_type);
```

---

## ⭐ FAVORITES & SAVED ITEMS

### Table: `favorites`
**Purpose:** User's saved meals, recipes, and restaurants

```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Favorite Details
  item_type TEXT NOT NULL CHECK (item_type IN ('recipe', 'restaurant-dish', 'ai-suggestion', 'custom')),
  item_name TEXT NOT NULL,
  item_description TEXT,
  item_image_url TEXT,
  
  -- Source
  source_id TEXT, -- External ID from API or internal ID
  source_api TEXT, -- 'spoonacular', 'uber-eats', 'ai-generated', etc.
  
  -- Recipe Details (if applicable)
  ingredients JSONB DEFAULT '[]'::JSONB,
  instructions TEXT,
  prep_time_minutes INTEGER,
  cook_time_minutes INTEGER,
  servings INTEGER,
  
  -- Nutrition
  calories INTEGER,
  protein_grams NUMERIC(6,2),
  carbs_grams NUMERIC(6,2),
  fat_grams NUMERIC(6,2),
  
  -- Restaurant Details (if applicable)
  restaurant_name TEXT,
  restaurant_address TEXT,
  restaurant_cuisine TEXT,
  delivery_time_minutes INTEGER,
  price_usd NUMERIC(8,2),
  
  -- User Notes
  user_notes TEXT,
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  times_cooked INTEGER DEFAULT 0,
  last_cooked_at TIMESTAMP WITH TIME ZONE,
  
  -- Tags
  tags TEXT[] DEFAULT '{}',
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Soft Delete
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_favorites_user_id ON favorites(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_favorites_type ON favorites(user_id, item_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_favorites_tags ON favorites USING GIN(tags) WHERE deleted_at IS NULL;
```

---

## 📸 SCAN HISTORY

### Table: `scan_history`
**Purpose:** Track all barcode and meal nutrition scans

```sql
CREATE TABLE scan_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Scan Type
  scan_type TEXT NOT NULL CHECK (scan_type IN ('barcode', 'meal-nutrition', 'ingredient-recognition')),
  
  -- Barcode Scan
  barcode TEXT,
  product_name TEXT,
  brand TEXT,
  product_image_url TEXT,
  
  -- Meal Nutrition Scan
  meal_image_url TEXT,
  meal_name TEXT,
  estimated_calories INTEGER,
  estimated_protein_grams NUMERIC(6,2),
  estimated_carbs_grams NUMERIC(6,2),
  estimated_fat_grams NUMERIC(6,2),
  
  -- Ingredient Recognition
  detected_ingredients TEXT[] DEFAULT '{}',
  confidence_score NUMERIC(3,2), -- 0.00 to 1.00
  
  -- API Response
  api_provider TEXT, -- 'openfoodfacts', 'openai-vision', 'google-vision', etc.
  api_response JSONB, -- Full API response for reference
  
  -- User Actions
  added_to_pantry BOOLEAN DEFAULT FALSE,
  added_to_favorites BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_scan_history_user_id ON scan_history(user_id);
CREATE INDEX idx_scan_history_type ON scan_history(user_id, scan_type);
CREATE INDEX idx_scan_history_barcode ON scan_history(barcode);
CREATE INDEX idx_scan_history_created_at ON scan_history(user_id, created_at DESC);
```

---

## 🤖 AI INTERACTIONS

### Table: `ai_chat_sessions`
**Purpose:** Track AI chat conversations

```sql
CREATE TABLE ai_chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Session Info
  session_title TEXT,
  session_type TEXT CHECK (session_type IN ('cooking-help', 'meal-suggestion', 'recipe-modification', 'general')),
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_ai_chat_sessions_user_id ON ai_chat_sessions(user_id);
CREATE INDEX idx_ai_chat_sessions_active ON ai_chat_sessions(user_id, is_active);
```

### Table: `ai_chat_messages`
**Purpose:** Individual messages in AI chat

```sql
CREATE TABLE ai_chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES ai_chat_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Message Details
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  
  -- AI Metadata
  model TEXT, -- 'gpt-4', 'claude-3', etc.
  tokens_used INTEGER,
  response_time_ms INTEGER,
  
  -- Context
  context_used JSONB, -- User preferences, pantry items, etc. used for this message
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ai_chat_messages_session_id ON ai_chat_messages(session_id);
CREATE INDEX idx_ai_chat_messages_user_id ON ai_chat_messages(user_id);
CREATE INDEX idx_ai_chat_messages_created_at ON ai_chat_messages(session_id, created_at);
```

---

## 🔔 NOTIFICATIONS & REMINDERS

### Table: `user_notifications`
**Purpose:** System notifications and reminders

```sql
CREATE TABLE user_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Notification Details
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
  
  -- Action
  action_type TEXT, -- 'view-pantry', 'view-plan', 'view-recipe', etc.
  action_data JSONB, -- Additional data for the action
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  is_dismissed BOOLEAN DEFAULT FALSE,
  dismissed_at TIMESTAMP WITH TIME ZONE,
  
  -- Delivery
  sent_at TIMESTAMP WITH TIME ZONE,
  delivery_method TEXT[] DEFAULT '{}', -- ['push', 'email', 'in-app']
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX idx_user_notifications_unread ON user_notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_user_notifications_type ON user_notifications(user_id, notification_type);
CREATE INDEX idx_user_notifications_created_at ON user_notifications(user_id, created_at DESC);
```

---

## 🔗 HELPER FUNCTIONS

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate AI context summary from user preferences
CREATE OR REPLACE FUNCTION generate_ai_context_summary(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_summary TEXT;
  v_prefs RECORD;
BEGIN
  SELECT * INTO v_prefs FROM user_preferences WHERE user_id = p_user_id;
  
  v_summary := format(
    'User Profile: %s diet, cooking skill: %s, household size: %s, allergies: %s, loves: %s, dislikes: %s',
    array_to_string(v_prefs.diet_patterns, ', '),
    v_prefs.cooking_skill_level,
    v_prefs.household_size,
    (SELECT string_agg(value->>'label', ', ') FROM jsonb_array_elements(v_prefs.allergies)),
    array_to_string(v_prefs.loved_cuisines, ', '),
    array_to_string(v_prefs.disliked_ingredients, ', ')
  );
  
  RETURN v_summary;
END;
$$ LANGUAGE plpgsql;
```

---

## 🔒 ROW LEVEL SECURITY (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE pantry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE planned_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- User Preferences
CREATE POLICY "Users can view own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Pantry Items
CREATE POLICY "Users can manage own pantry" ON pantry_items
  FOR ALL USING (auth.uid() = user_id);

-- Meal Plans
CREATE POLICY "Users can manage own meal plans" ON meal_plans
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own planned meals" ON planned_meals
  FOR ALL USING (auth.uid() = user_id);

-- Favorites
CREATE POLICY "Users can manage own favorites" ON favorites
  FOR ALL USING (auth.uid() = user_id);

-- Scan History
CREATE POLICY "Users can view own scan history" ON scan_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scans" ON scan_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- AI Chat
CREATE POLICY "Users can manage own chat sessions" ON ai_chat_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own chat messages" ON ai_chat_messages
  FOR ALL USING (auth.uid() = user_id);

-- Notifications
CREATE POLICY "Users can view own notifications" ON user_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON user_notifications
  FOR UPDATE USING (auth.uid() = user_id);
```

---

## 📊 SUMMARY

### Total Tables: 11
1. ✅ `users` - Core user profiles
2. ✅ `user_preferences` - Complete onboarding data
3. ✅ `pantry_items` - Pantry inventory
4. ✅ `meal_plans` - Weekly plans
5. ✅ `planned_meals` - Individual meals
6. ✅ `favorites` - Saved items
7. ✅ `scan_history` - All scans
8. ✅ `ai_chat_sessions` - Chat sessions
9. ✅ `ai_chat_messages` - Chat messages
10. ✅ `user_notifications` - Notifications
11. ✅ (Future) `recipes`, `restaurants`, `shopping_lists`

### Key Features:
- ✅ Complete onboarding data capture (10 screens)
- ✅ Pantry management with expiration tracking
- ✅ Weekly meal planning
- ✅ Barcode & nutrition scanning
- ✅ AI chat history
- ✅ Favorites & saved meals
- ✅ Notifications & reminders
- ✅ Row Level Security
- ✅ Optimized indexes
- ✅ Soft deletes where needed
- ✅ Generated columns for computed values
- ✅ JSONB for flexible data structures

---

**This schema is production-ready and optimized for AI-powered meal planning!** 🎉
