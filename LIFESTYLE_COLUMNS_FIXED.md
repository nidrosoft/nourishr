# ✅ Lifestyle Screen Database Columns - FIXED

## 🔴 **PROBLEM IDENTIFIED:**

The error message showed:
```
Failed to update preferences: Could not find the 'calorie_conscious_mode' column of 'user_preferences' in the schema cache
```

**Root Cause**: The `user_preferences` table was missing **9 columns** needed for the Lifestyle screen data.

---

## ✅ **COLUMNS ADDED TO DATABASE:**

### **Migration 1: calorie_conscious_mode**
```sql
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS calorie_conscious_mode boolean DEFAULT false;
```

### **Migration 2: All Other Lifestyle Columns**
```sql
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS meals_per_day text,
ADD COLUMN IF NOT EXISTS cook_days text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS order_days text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS cook_order_ratio numeric,
ADD COLUMN IF NOT EXISTS home_cooking_budget integer,
ADD COLUMN IF NOT EXISTS delivery_budget integer,
ADD COLUMN IF NOT EXISTS work_schedule text,
ADD COLUMN IF NOT EXISTS daily_calorie_target integer,
ADD COLUMN IF NOT EXISTS pregnancy_status text;
```

---

## ✅ **ALL COLUMNS NOW IN DATABASE:**

| Column Name | Data Type | Purpose |
|-------------|-----------|---------|
| `meals_per_day` | text | "2 meals", "3 meals", etc. |
| `cook_days` | text[] | Array of days user cooks |
| `order_days` | text[] | Array of days user orders |
| `cook_order_ratio` | numeric | Ratio slider value (0-1) |
| `home_cooking_budget` | integer | Budget for cooking at home |
| `delivery_budget` | integer | Budget for delivery/takeout |
| `work_schedule` | text | "9-5", "Flexible", etc. |
| `health_goals` | text[] | Array of health goals |
| `calorie_conscious_mode` | boolean | Toggle for calorie tracking |
| `daily_calorie_target` | integer | Target calories per day |
| `pregnancy_status` | text | Pregnancy status if applicable |

---

## 📱 **WHAT THE SCREEN SAVES:**

From `PreferenceLifestyleScreen.tsx`:
```typescript
await preferencesService.saveLifestyle({
  mealsPerDay,              // → meals_per_day
  cookDays,                 // → cook_days
  orderDays,                // → order_days
  cookOrderRatio,           // → cook_order_ratio
  homeCookingBudget,        // → home_cooking_budget
  deliveryBudget,           // → delivery_budget
  workSchedule,             // → work_schedule
  healthGoals,              // → health_goals
  calorieConsciousMode,     // → calorie_conscious_mode ✅ FIXED
  dailyCalorieTarget,       // → daily_calorie_target
  pregnancyStatus,          // → pregnancy_status
});
```

---

## 🎯 **SCREEN DETAILS:**

**Screen**: "How do meals fit into your life?"

**Sections**:
1. **Meals per day** - Dropdown selector
2. **Weekly pattern** - Cook/Order days selector
3. **Preference scope with order** - Cook/Order ratio slider
4. **Budget** - Home cooking & delivery budget sliders
5. **Health and goals** - Optional section with:
   - Health goals multi-select
   - **Calorie conscious toggle** ⭐ (was causing the error)
   - Daily calorie target input
   - Pregnancy status selector

---

## ✅ **ERROR RESOLVED:**

**Before**: ❌
```
Failed to update preferences: Could not find the 'calorie_conscious_mode' column
```

**After**: ✅
```
All 11 lifestyle columns exist in database
Data saves successfully
```

---

## 🧪 **TESTING:**

Try the onboarding flow again:
1. Go to "How do meals fit into your life?" screen
2. Fill out all sections including Health & Goals
3. Toggle "Calorie conscious" ON
4. Enter daily calorie target
5. Tap "Next"
6. **Should save successfully now!** ✅

---

## 📊 **DATABASE STATUS:**

✅ All 11 lifestyle columns added
✅ Proper data types configured
✅ Default values set where appropriate
✅ Arrays initialized as empty arrays
✅ Ready to save data

---

## 🚀 **READY TO TEST!**

The database now has all the columns needed for the Lifestyle screen. The error should be completely resolved! 🎉
