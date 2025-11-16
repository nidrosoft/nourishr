-- Add all missing cooking style columns to user_preferences table

-- Add cooking_skill_level column
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS cooking_skill_level TEXT;

-- Add time_per_meal_minutes column
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS time_per_meal_minutes INTEGER;

-- Add kitchen_equipment column (array of text)
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS kitchen_equipment TEXT[];

-- Add prep_tolerance column
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS prep_tolerance TEXT;

-- Add comments to document the columns
COMMENT ON COLUMN user_preferences.cooking_skill_level IS 'User cooking skill level: beginner, comfortable, pro';
COMMENT ON COLUMN user_preferences.time_per_meal_minutes IS 'Average time user wants to spend per meal in minutes';
COMMENT ON COLUMN user_preferences.kitchen_equipment IS 'Array of kitchen equipment user has available';
COMMENT ON COLUMN user_preferences.prep_tolerance IS 'User preference for recipe preparation complexity: minimal, okay, love';
