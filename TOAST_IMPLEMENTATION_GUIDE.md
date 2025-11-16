# 🎯 Toast Notification Implementation Guide

## Toast Design System

### Styling
- **Background:** Black (`#111111`)
- **Icon Container:** White circular background (32x32px)
- **Icon Colors:**
  - ✅ **Success:** Green (`#10B981`)
  - ❌ **Error:** Red (`#EF4444`)
  - ⚠️ **Warning:** Orange (`#F59E0B`)
  - ℹ️ **Info:** Blue (`#3B82F6`)
- **Message:** White text, medium weight
- **Duration:** 3 seconds
- **Position:** Top of screen with safe area insets

---

## Actions Requiring Toast Notifications

### 1. **Plan Screen** (`/src/screens/MainTab/Plan/`)

#### PantryScreen
- ✅ **Add Item** - "Item added to pantry!"
- ❌ **Delete Item** - "Item removed from pantry"
- ✅ **Scan Item** - "Item scanned successfully!"

#### WeeklyPlanScreen
- ✅ **Generate Plan** - "Weekly plan generated!"
- ✅ **Refresh Plan** - "Plan refreshed!"
- ❌ **Remove Meal** - "Meal removed from plan"
- ✅ **Replace Meal** - "Meal replaced successfully!"

#### FavoritesScreenFull
- ✅ **Add to Favorites** - "Added to favorites!"
- ❌ **Remove from Favorites** - "Removed from favorites"

---

### 2. **Home Screen** (`/src/screens/MainTab/Home/`)

#### MealSection
- ✅ **Save Meal** - "Meal saved to favorites!"
- ❌ **Unsave Meal** - "Meal removed from favorites"

---

### 3. **Discover Screen** (`/src/screens/MainTab/Discover/`)

#### TrendingGrid
- ✅ **Save Item** - "Saved to favorites!"
- ❌ **Unsave Item** - "Removed from favorites"

---

### 4. **Scan Flow** (`/src/screens/MainTab/Scan/`)

#### ShuffleMealFlow
- ✅ **Save Meal** - "Meal saved!"
- ✅ **Order Meal** - "Order placed successfully!"

#### MealNutritionFlow
- ✅ **Scan Complete** - "Nutrition info retrieved!"
- ⚠️ **Scan Warning** - "Some ingredients couldn't be identified"
- ❌ **Scan Error** - "Failed to scan. Please try again."

---

### 5. **Profile Screen** (`/src/screens/MainTab/Profile/`)

#### Settings
- ✅ **Save Settings** - "Settings saved!"
- ✅ **Update Profile** - "Profile updated!"
- ⚠️ **Logout** - "Logged out successfully"

---

## Usage Example

```typescript
import { useToast } from '../../../hooks/useToast';
import { Toast } from '../../../components/organisms/Toast';

const MyComponent = () => {
  const { toast, showSuccess, showError, showWarning, hideToast } = useToast();

  const handleSave = () => {
    // Your save logic
    showSuccess('Item saved successfully!');
  };

  const handleDelete = () => {
    // Your delete logic
    showError('Item removed');
  };

  const handleWarning = () => {
    showWarning('Please check your input');
  };

  return (
    <>
      {/* Your component JSX */}
      
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
    </>
  );
};
```

---

## Implementation Priority

### Phase 1: High Priority (User Actions)
1. ✅ Save/Unsave in Favorites
2. ✅ Add/Remove items in Pantry
3. ✅ Save meals in Shuffle Flow
4. ❌ Delete actions across the app

### Phase 2: Medium Priority (Confirmations)
1. ✅ Generate/Refresh plans
2. ✅ Update settings
3. ✅ Scan completions

### Phase 3: Low Priority (Info/Warnings)
1. ℹ️ Info messages
2. ⚠️ Warning messages
3. ⚠️ Validation messages

---

## Toast Messages Library

### Success Messages
- "Saved to favorites!"
- "Added to pantry!"
- "Meal saved!"
- "Plan generated!"
- "Settings saved!"
- "Profile updated!"
- "Item added successfully!"

### Error Messages
- "Removed from favorites"
- "Item deleted"
- "Meal removed"
- "Failed to save. Please try again."
- "Something went wrong"

### Warning Messages
- "Please check your input"
- "Some items couldn't be processed"
- "Connection unstable"

### Info Messages
- "Loading..."
- "Processing..."
- "Syncing data..."

---

## Next Steps

1. ✅ Update Toast component with new styling (DONE)
2. ⏳ Implement toasts in PantryScreen
3. ⏳ Implement toasts in WeeklyPlanScreen
4. ⏳ Implement toasts in FavoritesScreenFull
5. ⏳ Implement toasts in Home/Discover screens
6. ⏳ Implement toasts in Scan flows
7. ⏳ Test all toast notifications

---

**Status:** Toast component updated with new design system. Ready for implementation across the app! 🎉
