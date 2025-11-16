# Database Columns Analysis - Missing Data Investigation

## 🔍 **Overview**
After completing onboarding, several database columns remain empty. This document analyzes each empty column, identifies the root cause, and provides solutions.

---

## ✅ **WORKING CORRECTLY**

### 1. **Religious Dietary Rules** ✅
- **Column**: `religious_dietary_rules`
- **Screen**: PreferenceDietScreen (Step 3)
- **Status**: **WORKING**
- **Code**: Lines 83-84 in PreferenceDietScreen.tsx
  ```typescript
  religiousDietaryRules: selectedRules,  // ["halal", "no-pork", etc.]
  ```
- **Service**: Lines 161 in PreferencesService.ts
  ```typescript
  religious_dietary_rules: data.religiousDietaryRules,
  ```
- **Conclusion**: ✅ This IS being saved. If empty, user didn't select any options.

---

### 2. **Custom Dietary Rules** ✅
- **Column**: `custom_dietary_rules`
- **Screen**: PreferenceDietScreen (Step 3)
- **Status**: **WORKING**
- **Code**: Lines 84 in PreferenceDietScreen.tsx
  ```typescript
  customDietaryRules: customRules,  // User-typed custom rules
  ```
- **Service**: Lines 162 in PreferencesService.ts
  ```typescript
  custom_dietary_rules: data.customDietaryRules,
  ```
- **Conclusion**: ✅ This IS being saved. If empty, user didn't add custom rules.

---

### 3. **Health Goals** ✅
- **Column**: `health_goals`
- **Screen**: PreferenceLifestyleScreen (Step 8)
- **Status**: **WORKING BUT MISMATCH**
- **Issue**: Screen sends `selectedGoals` but service expects `healthGoals`
- **Screen Code**: Line 56 in PreferenceLifestyleScreen.tsx
  ```typescript
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  ```
- **Service Code**: Line 248 in PreferencesService.ts
  ```typescript
  health_goals: data.healthGoals,  // ❌ MISMATCH!
  ```
- **Problem**: Screen NEVER sends `healthGoals` in the save call (line 105-116)
- **Conclusion**: ⚠️ **BROKEN** - Data exists but not being sent

---

## ❌ **NOT WORKING - NEEDS FIXING**

### 4. **Disliked Cuisines** ❌
- **Column**: `disliked_cuisines`
- **Screen**: PreferenceDislikesScreen (Step 5)
- **Status**: **NOT BEING SAVED**
- **Issue**: Screen only saves ingredients and textures, NOT cuisines
- **Screen Code**: Lines 147-149 in PreferenceDislikesScreen.tsx
  ```typescript
  await preferencesService.saveDislikes({
    dislikedIngredients: selectedIngredients,
    dislikedTextures: selectedTextures,
    dislikeNotes: dislikeNotes || undefined,
    // ❌ MISSING: dislikedCuisines
  });
  ```
- **Service Expects**: Line 194 in PreferencesService.ts
  ```typescript
  disliked_cuisines: data.dislikedCuisines,
  ```
- **Conclusion**: ❌ **BROKEN** - Screen doesn't have cuisine selection UI or doesn't send it

---

### 5. **Loved Ingredients** ❌
- **Column**: `loved_ingredients`
- **Screen**: PreferenceLovesScreen (Step 6)
- **Status**: **NOT BEING SAVED**
- **Issue**: Screen sends empty array
- **Screen Code**: Line 108 in PreferenceLovesScreen.tsx
  ```typescript
  await preferencesService.saveLoves({
    lovedIngredients: [],  // ❌ ALWAYS EMPTY!
    lovedCuisines: [...selectedCuisines, ...customCuisines],
    lovedFlavors: [...],  // ✅ Fixed
    loveNotes: loveNotes || undefined,
  });
  ```
- **Service Expects**: Line 211 in PreferencesService.ts
  ```typescript
  loved_ingredients: data.lovedIngredients,
  ```
- **Conclusion**: ❌ **BROKEN** - Screen doesn't have ingredient selection UI or sends empty array

---

### 6. **Location Coordinates** ❌
- **Column**: `location_coordinates`
- **Screen**: PreferenceLocationScreen (Step 9)
- **Status**: **NOT BEING SAVED**
- **Issue**: Screen captures coordinates but NEVER sends them
- **Screen State**: Line 29 in PreferenceLocationScreen.tsx
  ```typescript
  const [locationCoords, setLocationCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  ```
- **Screen Save**: Lines 228-232 in PreferenceLocationScreen.tsx
  ```typescript
  await preferencesService.saveLocation({
    cityNeighborhood,
    preciseAddress,
    deliveryDistance,
    // ❌ MISSING: locationCoords
  });
  ```
- **Service Interface**: Lines 70-75 in PreferencesService.ts
  ```typescript
  export interface LocationData {
    timezone: string;
    preferred Units: string;
    preferredCurrency: string;
    language: string;
    // ❌ NO location_coordinates field!
  }
  ```
- **Conclusion**: ❌ **BROKEN** - Complete mismatch between screen and service

---

### 7. **City Neighborhood** ❌
- **Column**: `city_neighborhood`
- **Screen**: PreferenceLocationScreen (Step 9)
- **Status**: **NOT BEING SAVED**
- **Issue**: Screen sends it but service interface doesn't accept it
- **Screen Sends**: Line 229 in PreferenceLocationScreen.tsx
  ```typescript
  cityNeighborhood,  // ✅ Has value like "La Mesa, CA"
  ```
- **Service Interface**: Lines 70-75 in PreferencesService.ts
  ```typescript
  export interface LocationData {
    timezone: string;      // ❌ Screen doesn't send
    preferredUnits: string; // ❌ Screen doesn't send
    preferredCurrency: string; // ❌ Screen doesn't send
    language: string;      // ❌ Screen doesn't send
    // ❌ NO cityNeighborhood field!
  }
  ```
- **Conclusion**: ❌ **BROKEN** - Complete interface mismatch

---

### 8. **Delivery Distance Preference** ❌
- **Column**: `delivery_distance_preference`
- **Screen**: PreferenceLocationScreen (Step 9)
- **Status**: **NOT BEING SAVED**
- **Issue**: Same as above - service interface mismatch
- **Screen Sends**: Line 231 in PreferenceLocationScreen.tsx
  ```typescript
  deliveryDistance,  // ✅ Has value 0-3
  ```
- **Service Interface**: Doesn't accept this field
- **Conclusion**: ❌ **BROKEN** - Interface mismatch

---

### 9. **Favorite Restaurants** ❓
- **Column**: `favorite_restaurants`
- **Screen**: **NONE FOUND**
- **Status**: **NO UI EXISTS**
- **Conclusion**: ❓ **OLD COLUMN** - Not part of current onboarding flow

---

## 📊 **SUMMARY TABLE**

| Column | Screen | Status | Issue |
|--------|--------|--------|-------|
| `religious_dietary_rules` | PreferenceDiet | ✅ Working | None |
| `custom_dietary_rules` | PreferenceDiet | ✅ Working | None |
| `health_goals` | PreferenceLifestyle | ⚠️ Broken | Not sent in save call |
| `disliked_cuisines` | PreferenceDislikes | ❌ Broken | Not sent (no UI?) |
| `loved_ingredients` | PreferenceLoves | ❌ Broken | Always empty array |
| `location_coordinates` | PreferenceLocation | ❌ Broken | Interface mismatch |
| `city_neighborhood` | PreferenceLocation | ❌ Broken | Interface mismatch |
| `delivery_distance_preference` | PreferenceLocation | ❌ Broken | Interface mismatch |
| `favorite_restaurants` | None | ❓ Old | No screen exists |

---

## 🔧 **ROOT CAUSES**

### **Problem 1: Location Service Interface Mismatch**
The `PreferenceLocationScreen` captures:
- ✅ `cityNeighborhood` (e.g., "La Mesa, CA")
- ✅ `locationCoords` (latitude/longitude)
- ✅ `deliveryDistance` (0-3 index)
- ✅ `preciseAddress` (optional)

But `PreferencesService.saveLocation()` expects:
- ❌ `timezone`
- ❌ `preferredUnits`
- ❌ `preferredCurrency`
- ❌ `language`

**These are completely different!**

---

### **Problem 2: Lifestyle Service Interface Mismatch**
The `PreferenceLifestyleScreen` sends:
- ✅ `mealsPerDay`
- ✅ `cookDays`
- ✅ `orderDays`
- ✅ `cookOrderRatio`
- ✅ `homeCookingBudget`
- ✅ `deliveryBudget`
- ✅ `selectedWorkSchedule`
- ✅ `calorieConsciousMode`
- ✅ `dailyCalorieTarget`
- ✅ `pregnancyStatus`
- ❌ `selectedGoals` (NOT sent!)

But `PreferencesService.saveLifestyle()` expects:
- ❌ `activityLevel`
- ❌ `healthGoals` (different from selectedGoals!)
- ❌ `sleepHoursPerNight`
- ❌ `stressLevel`
- ❌ `workSchedule`
- ❌ `mealTimingPreferences`

**These are completely different!**

---

### **Problem 3: Missing UI Components**
- **Disliked Cuisines**: Screen may not have UI for selecting disliked cuisines (only ingredients/textures)
- **Loved Ingredients**: Screen may not have UI for selecting loved ingredients (only cuisines)

---

## ✅ **SOLUTIONS**

### **Fix 1: Update Location Service Interface**
```typescript
// PreferencesService.ts - Update LocationData interface
export interface LocationData {
  cityNeighborhood: string;
  preciseAddress?: string;
  locationCoordinates?: { latitude: number; longitude: number };
  deliveryDistancePreference: number; // 0-3
}

// Update saveLocation method
async saveLocation(data: LocationData): Promise<void> {
  await this.ensureInitialized();
  console.log('Saving location data:', data);

  await this.upsertPreferences({
    city_neighborhood: data.cityNeighborhood,
    precise_address: data.preciseAddress || null,
    location_coordinates: data.locationCoordinates || null,
    delivery_distance_preference: data.deliveryDistancePreference,
  });

  await this.updateOnboardingStep(9);
  console.log('Location data saved successfully');
}
```

### **Fix 2: Update Location Screen Save Call**
```typescript
// PreferenceLocationScreen.tsx - Update handleNext
await preferencesService.saveLocation({
  cityNeighborhood,
  preciseAddress,
  locationCoordinates: locationCoords,
  deliveryDistancePreference: deliveryDistance,
});
```

---

### **Fix 3: Update Lifestyle Service Interface**
```typescript
// PreferencesService.ts - Update LifestyleData interface
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

// Update saveLifestyle method
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
```

### **Fix 4: Update Lifestyle Screen Save Call**
```typescript
// PreferenceLifestyleScreen.tsx - Update handleNext
await preferencesService.saveLifestyle({
  mealsPerDay,
  cookDays,
  orderDays,
  cookOrderRatio,
  homeCookingBudget,
  deliveryBudget,
  workSchedule: selectedWorkSchedule,
  healthGoals: selectedGoals,  // ✅ ADD THIS
  calorieConsciousMode,
  dailyCalorieTarget,
  pregnancyStatus,
});
```

---

### **Fix 5: Add Disliked Cuisines to Dislikes Screen**
Check if PreferenceDislikesScreen has UI for cuisines. If yes, update save call:
```typescript
await preferencesService.saveDislikes({
  dislikedIngredients: selectedIngredients,
  dislikedCuisines: selectedCuisines,  // ✅ ADD THIS
  dislikedTextures: selectedTextures,
  dislikeNotes: dislikeNotes || undefined,
});
```

---

### **Fix 6: Add Loved Ingredients to Loves Screen**
Check if PreferenceLovesScreen has UI for ingredients. If yes, update save call:
```typescript
await preferencesService.saveLoves({
  lovedIngredients: selectedIngredients,  // ✅ ADD THIS (not empty array)
  lovedCuisines: [...selectedCuisines, ...customCuisines],
  lovedFlavors: [...],
  loveNotes: loveNotes || undefined,
});
```

---

## 🎯 **ACTION PLAN**

1. ✅ **Fix Location Service** - Update interface and save method
2. ✅ **Fix Location Screen** - Send coordinates and delivery distance
3. ✅ **Fix Lifestyle Service** - Update interface to match screen data
4. ✅ **Fix Lifestyle Screen** - Send health goals
5. ❓ **Check Dislikes Screen** - Verify if cuisine UI exists
6. ❓ **Check Loves Screen** - Verify if ingredient UI exists
7. ❓ **Favorite Restaurants** - Decide if this is old column to delete

---

## 📝 **NOTES**

- **Religious dietary rules**: Already working ✅
- **Custom dietary rules**: Already working ✅
- **Location data**: Major interface mismatch - needs complete rewrite
- **Lifestyle data**: Partial mismatch - missing health goals
- **Favorite restaurants**: No UI found - likely old/unused column

The main issue is that the **service interfaces don't match what the screens are actually sending**. This is a design/architecture problem that needs to be fixed at the service layer.
