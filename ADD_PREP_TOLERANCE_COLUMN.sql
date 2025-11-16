-- Add prep_tolerance column to user_preferences table
-- This stores the user's preference for recipe preparation complexity
-- Values: 'minimal', 'okay', 'love'

ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS prep_tolerance TEXT;

-- Add comment to document the column
COMMENT ON COLUMN user_preferences.prep_tolerance IS 'User preference for recipe preparation complexity: minimal, okay, love';
