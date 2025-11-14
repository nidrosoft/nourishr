# Nourishr App - Comprehensive Refactoring Plan

## Executive Summary
After analyzing the entire codebase (43 .tsx files, 9 .ts files), several files exceed 500 lines and require immediate refactoring. The largest files are:
- **HomeScreen.tsx**: 1,414 lines ⚠️ CRITICAL
- **CookWhatIHaveFlow.tsx**: 1,141 lines ⚠️ CRITICAL
- **PreferenceIdentityScreen.tsx**: 574 lines ⚠️ HIGH
- **PreferenceLifestyleScreen.tsx**: 557 lines ⚠️ HIGH
- **PreferenceLocationScreen.tsx**: 540 lines ⚠️ HIGH
- **PhoneSignUpScreen.tsx**: 520 lines ⚠️ HIGH

---

## Phase 1: Critical Refactoring (Immediate Action Required)

### 1.1 HomeScreen.tsx (1,414 lines → Target: <300 lines)

**Current Issues:**
- Massive component with multiple responsibilities
- Hardcoded data arrays (FOOD_CATEGORIES, FEATURED_MEALS, ORDER_NOW_MEALS, COOK_NOW_MEALS, TRENDING_MEALS)
- Complex scroll animations
- Multiple sections (header, categories, featured, order, cook, trending)
- No separation of concerns

**Refactoring Strategy:**

#### A. Create Data Layer
```
src/data/
├── categories.ts          # FOOD_CATEGORIES constant
├── meals.ts              # All meal data (featured, order, cook, trending)
└── index.ts              # Export all data
```

#### B. Create Micro Components
```
src/screens/MainTab/Home/components/
├── HomeHeader/
│   ├── HomeHeader.tsx              # Main header with gradient
│   ├── SearchBar.tsx               # Search input component
│   ├── NotificationBadge.tsx       # Bell icon with badge
│   └── index.ts
├── CategorySection/
│   ├── CategorySection.tsx         # Category horizontal scroll
│   ├── CategoryCard.tsx            # Individual category item
│   └── index.ts
├── FeaturedSection/
│   ├── FeaturedSection.tsx         # Featured meals section
│   ├── FeaturedCard.tsx            # Large featured meal card
│   └── index.ts
├── MealSection/
│   ├── MealSection.tsx             # Reusable section (Order/Cook/Trending)
│   ├── MealSectionHeader.tsx       # Section title with "View All"
│   └── index.ts
├── AnimatedStatusBar/
│   ├── AnimatedStatusBar.tsx       # Status bar with scroll animation
│   └── useScrollAnimation.ts       # Custom hook for scroll logic
└── index.ts
```

#### C. Create Custom Hooks
```
src/screens/MainTab/Home/hooks/
├── useHomeData.ts          # Data fetching/management
├── useScrollAnimation.ts   # Scroll animation logic
├── useCategoryFilter.ts    # Category filtering logic
└── index.ts
```

#### D. Create Types
```
src/screens/MainTab/Home/types/
├── home.types.ts           # HomeScreen specific types
└── index.ts
```

#### E. Refactored Structure
```typescript
// HomeScreen.tsx (Target: ~200 lines)
import { HomeHeader } from './components/HomeHeader';
import { CategorySection } from './components/CategorySection';
import { FeaturedSection } from './components/FeaturedSection';
import { MealSection } from './components/MealSection';
import { useHomeData, useScrollAnimation } from './hooks';

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { categories, featured, orderNow, cookNow, trending } = useHomeData();
  const { scrollY, statusBarStyle, headerOpacity } = useScrollAnimation();
  
  return (
    <View>
      <AnimatedStatusBar scrollY={scrollY} />
      <ScrollView onScroll={handleScroll}>
        <HomeHeader opacity={headerOpacity} />
        <CategorySection categories={categories} />
        <FeaturedSection meals={featured} />
        <MealSection title="Order Now" meals={orderNow} type="order" />
        <MealSection title="Cook Now" meals={cookNow} type="cook" />
        <MealSection title="Trending" meals={trending} type="trending" />
      </ScrollView>
    </View>
  );
};
```

---

### 1.2 CookWhatIHaveFlow.tsx (1,141 lines → Target: <300 lines)

**Current Issues:**
- Single massive component handling 4-step flow
- 75+ country data hardcoded
- Complex state management
- Multiple sub-screens in one file
- Duplicate styling logic

**Refactoring Strategy:**

#### A. Create Data Layer
```
src/data/
├── cuisines.ts            # All 75+ countries/cuisines
└── index.ts
```

#### B. Create Step Components
```
src/screens/MainTab/Scan/CookWhatIHaveFlow/
├── CookWhatIHaveFlow.tsx                    # Main orchestrator (~150 lines)
├── components/
│   ├── FlowHeader/
│   │   ├── FlowHeader.tsx                   # Header with close button
│   │   ├── StepIndicator.tsx                # Progress bars
│   │   └── index.ts
│   ├── PhotoStep/
│   │   ├── PhotoStep.tsx                    # Step 1 main component
│   │   ├── PhotoGrid.tsx                    # Photo thumbnail grid
│   │   ├── PhotoActions.tsx                 # Take/Select buttons
│   │   └── index.ts
│   ├── IngredientStep/
│   │   ├── IngredientStep.tsx               # Step 2 main component
│   │   ├── IngredientList.tsx               # List of ingredients
│   │   ├── IngredientItem.tsx               # Single ingredient with checkbox
│   │   ├── ManualIngredientInput.tsx        # Add manual ingredient
│   │   └── index.ts
│   ├── CuisineStep/
│   │   ├── CuisineStep.tsx                  # Step 3 main component
│   │   ├── CuisineSearchBar.tsx             # Search input
│   │   ├── CuisinePills.tsx                 # Horizontal scrollable pills
│   │   ├── CuisinePill.tsx                  # Single pill component
│   │   └── index.ts
│   ├── ReviewStep/
│   │   ├── ReviewStep.tsx                   # Step 4 main component
│   │   ├── ReviewSection.tsx                # Reusable section wrapper
│   │   ├── PhotosSummary.tsx                # Photos review
│   │   ├── IngredientsSummary.tsx           # Ingredients review
│   │   ├── CuisineSummary.tsx               # Cuisine review
│   │   └── index.ts
│   ├── FlowFooter/
│   │   ├── FlowFooter.tsx                   # Footer with buttons
│   │   ├── BackButton.tsx                   # Back button
│   │   ├── NextButton.tsx                   # Next/Submit button
│   │   └── index.ts
│   └── index.ts
├── hooks/
│   ├── useFlowState.ts                      # Flow state management
│   ├── usePhotoCapture.ts                   # Photo capture logic
│   ├── useIngredientDetection.ts            # AI ingredient detection
│   ├── useCuisineSearch.ts                  # Cuisine search/filter
│   └── index.ts
├── types/
│   ├── flow.types.ts                        # Flow-specific types
│   └── index.ts
└── index.ts
```

#### C. Create Shared Utilities
```
src/screens/MainTab/Scan/CookWhatIHaveFlow/utils/
├── imageProcessing.ts     # Image handling utilities
├── validation.ts          # Step validation logic
└── index.ts
```

---

### 1.3 Preference Screens Refactoring (574-540 lines each)

**Current Issues:**
- Repetitive code across all preference screens
- Similar patterns for selection UI
- Hardcoded data in each screen
- No shared components

**Refactoring Strategy:**

#### A. Create Shared Preference Components
```
src/screens/Preferences/components/
├── PreferenceLayout/
│   ├── PreferenceLayout.tsx         # Common layout wrapper
│   ├── PreferenceProgress.tsx       # Progress indicator
│   └── index.ts
├── SelectionGrid/
│   ├── SelectionGrid.tsx            # Reusable grid for selections
│   ├── SelectionCard.tsx            # Card with icon/emoji
│   ├── SelectionPill.tsx            # Pill-style selection
│   └── index.ts
├── PreferenceFooter/
│   ├── PreferenceFooter.tsx         # Footer with buttons
│   └── index.ts
└── index.ts
```

#### B. Create Data Layer
```
src/data/preferences/
├── identities.ts          # Identity options
├── lifestyles.ts          # Lifestyle options
├── locations.ts           # Location/country data
├── diets.ts              # Diet types
├── allergies.ts          # Allergies & intolerances
├── cookingStyles.ts      # Cooking style options
├── household.ts          # Household data
└── index.ts
```

#### C. Create Shared Hooks
```
src/screens/Preferences/hooks/
├── usePreferenceSelection.ts    # Selection state management
├── usePreferenceNavigation.ts   # Navigation logic
├── usePreferenceValidation.ts   # Validation logic
└── index.ts
```

#### D. Refactored Example
```typescript
// PreferenceIdentityScreen.tsx (Target: ~150 lines)
import { PreferenceLayout, SelectionGrid } from './components';
import { usePreferenceSelection } from './hooks';
import { IDENTITY_OPTIONS } from '../../data/preferences';

export const PreferenceIdentityScreen = () => {
  const { selected, toggle, isValid } = usePreferenceSelection();
  
  return (
    <PreferenceLayout
      title="Tell us about yourself"
      progress={1/10}
      onNext={handleNext}
      isValid={isValid}
    >
      <SelectionGrid
        options={IDENTITY_OPTIONS}
        selected={selected}
        onToggle={toggle}
        multiSelect
      />
    </PreferenceLayout>
  );
};
```

---

## Phase 2: Component Library Enhancement

### 2.1 Create Atomic Design System
```
src/components/
├── atoms/                 # Basic building blocks
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── IconButton.tsx
│   │   ├── PillButton.tsx
│   │   └── index.ts
│   ├── Input/
│   │   ├── TextInput.tsx
│   │   ├── SearchInput.tsx
│   │   └── index.ts
│   ├── Icon/
│   │   ├── Icon.tsx
│   │   └── index.ts
│   ├── Badge/
│   │   ├── Badge.tsx
│   │   ├── NotificationBadge.tsx
│   │   └── index.ts
│   └── index.ts
├── molecules/             # Combinations of atoms
│   ├── Card/
│   │   ├── MealCard.tsx
│   │   ├── CategoryCard.tsx
│   │   ├── SelectionCard.tsx
│   │   └── index.ts
│   ├── ListItem/
│   │   ├── IngredientListItem.tsx
│   │   ├── SettingsListItem.tsx
│   │   └── index.ts
│   ├── Header/
│   │   ├── ScreenHeader.tsx
│   │   ├── SectionHeader.tsx
│   │   └── index.ts
│   └── index.ts
├── organisms/             # Complex components
│   ├── Navigation/
│   │   ├── TabBar.tsx
│   │   ├── TopBar.tsx
│   │   └── index.ts
│   ├── BottomSheet/
│   │   ├── BottomSheet.tsx
│   │   ├── BottomSheetHeader.tsx
│   │   └── index.ts
│   └── index.ts
└── index.ts
```

---

## Phase 3: State Management & Data Layer

### 3.1 Create Zustand Stores (Replace Context API)
```
src/store/
├── slices/
│   ├── authSlice.ts           # Authentication state
│   ├── userSlice.ts           # User profile & preferences
│   ├── mealsSlice.ts          # Meals data
│   ├── scanSlice.ts           # Scan flow state
│   ├── favoritesSlice.ts      # Favorites
│   └── index.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useUser.ts
│   ├── useMeals.ts
│   └── index.ts
└── index.ts
```

### 3.2 API Service Layer
```
src/services/api/
├── client/
│   ├── apiClient.ts           # Axios instance
│   ├── interceptors.ts        # Request/response interceptors
│   └── index.ts
├── endpoints/
│   ├── auth.api.ts
│   ├── meals.api.ts
│   ├── scan.api.ts
│   ├── preferences.api.ts
│   └── index.ts
└── index.ts
```

---

## Phase 4: TypeScript Enhancement

### 4.1 Comprehensive Type Definitions
```
src/types/
├── api/
│   ├── requests.ts            # API request types
│   ├── responses.ts           # API response types
│   └── index.ts
├── models/
│   ├── user.ts               # User model
│   ├── meal.ts               # Meal model
│   ├── ingredient.ts         # Ingredient model
│   ├── recipe.ts             # Recipe model
│   └── index.ts
├── ui/
│   ├── navigation.ts         # Navigation types
│   ├── components.ts         # Component prop types
│   └── index.ts
└── index.ts
```

### 4.2 Strict TypeScript Configuration
```json
// tsconfig.json updates
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

---

## Phase 5: Database Schema Design

### 5.1 Supabase Schema
```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User Preferences Table
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  identity JSONB,              -- Array of identity selections
  lifestyle JSONB,             -- Lifestyle preferences
  location JSONB,              -- Location data
  diet_type VARCHAR(50),       -- Diet type
  allergies JSONB,             -- Array of allergies
  intolerances JSONB,          -- Array of intolerances
  dislikes JSONB,              -- Array of dislikes
  loves JSONB,                 -- Array of loves
  cooking_style VARCHAR(50),   -- Cooking style
  household JSONB,             -- Household info
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Meals Table
CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  image_url TEXT,
  type VARCHAR(20),            -- 'ORDER', 'COOK'
  cuisine VARCHAR(100),
  prep_time INTEGER,           -- in minutes
  cook_time INTEGER,           -- in minutes
  servings INTEGER,
  calories INTEGER,
  rating DECIMAL(2,1),
  price DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Ingredients Table
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  category VARCHAR(100),
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Recipe Ingredients (Junction Table)
CREATE TABLE recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meal_id UUID REFERENCES meals(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity VARCHAR(50),
  unit VARCHAR(50),
  notes TEXT,
  UNIQUE(meal_id, ingredient_id)
);

-- Recipe Steps Table
CREATE TABLE recipe_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meal_id UUID REFERENCES meals(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  instruction TEXT NOT NULL,
  image_url TEXT,
  duration INTEGER,            -- in minutes
  UNIQUE(meal_id, step_number)
);

-- User Favorites Table
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  meal_id UUID REFERENCES meals(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, meal_id)
);

-- Scan History Table
CREATE TABLE scan_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  scan_type VARCHAR(50),       -- 'cook-what-i-have', 'barcode', etc.
  photos JSONB,                -- Array of photo URLs
  detected_ingredients JSONB,  -- AI detected ingredients
  selected_cuisine VARCHAR(100),
  results JSONB,               -- Generated dishes
  created_at TIMESTAMP DEFAULT NOW()
);

-- Meal Plans Table
CREATE TABLE meal_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  meal_type VARCHAR(20),       -- 'breakfast', 'lunch', 'dinner', 'snack'
  meal_id UUID REFERENCES meals(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date, meal_type)
);

-- Indexes for performance
CREATE INDEX idx_meals_type ON meals(type);
CREATE INDEX idx_meals_cuisine ON meals(cuisine);
CREATE INDEX idx_meals_rating ON meals(rating DESC);
CREATE INDEX idx_user_favorites_user ON user_favorites(user_id);
CREATE INDEX idx_scan_history_user ON scan_history(user_id);
CREATE INDEX idx_meal_plans_user_date ON meal_plans(user_id, date);
```

### 5.2 Database Service Layer
```
src/services/database/
├── supabase.ts               # Supabase client
├── queries/
│   ├── users.queries.ts
│   ├── meals.queries.ts
│   ├── preferences.queries.ts
│   ├── favorites.queries.ts
│   └── index.ts
├── mutations/
│   ├── users.mutations.ts
│   ├── preferences.mutations.ts
│   ├── favorites.mutations.ts
│   └── index.ts
└── index.ts
```

---

## Phase 6: Performance Optimization

### 6.1 Code Splitting & Lazy Loading
```typescript
// Lazy load heavy screens
const HomeScreen = lazy(() => import('./screens/MainTab/Home/HomeScreen'));
const CookWhatIHaveFlow = lazy(() => import('./screens/MainTab/Scan/CookWhatIHaveFlow'));
```

### 6.2 Memoization Strategy
```typescript
// Use React.memo for expensive components
export const MealCard = React.memo(MealCardComponent);

// Use useMemo for expensive calculations
const filteredMeals = useMemo(() => 
  meals.filter(meal => meal.type === selectedType),
  [meals, selectedType]
);

// Use useCallback for event handlers
const handlePress = useCallback(() => {
  navigation.navigate('MealDetail', { id });
}, [id, navigation]);
```

### 6.3 Image Optimization
```
src/utils/
├── imageOptimization.ts      # Image compression & caching
└── index.ts
```

---

## Phase 7: Testing Infrastructure

### 7.1 Testing Setup
```
src/__tests__/
├── components/
│   ├── atoms/
│   ├── molecules/
│   └── organisms/
├── screens/
│   ├── Home/
│   ├── Scan/
│   └── Preferences/
├── hooks/
├── services/
└── utils/
```

### 7.2 Test Utilities
```
src/test-utils/
├── renderWithProviders.tsx   # Test wrapper with providers
├── mockData.ts               # Mock data for tests
├── mockNavigation.ts         # Mock navigation
└── index.ts
```

---

## Implementation Timeline

### Week 1-2: Critical Refactoring
- [ ] Refactor HomeScreen.tsx
- [ ] Refactor CookWhatIHaveFlow.tsx
- [ ] Create data layer for both

### Week 3-4: Preference Screens
- [ ] Create shared preference components
- [ ] Refactor all 10 preference screens
- [ ] Create preference data layer

### Week 5-6: Component Library
- [ ] Build atomic design system
- [ ] Migrate existing components
- [ ] Create Storybook documentation

### Week 7-8: State Management
- [ ] Implement Zustand stores
- [ ] Migrate from Context API
- [ ] Create API service layer

### Week 9-10: Database & Backend
- [ ] Set up Supabase schema
- [ ] Create database service layer
- [ ] Implement data synchronization

### Week 11-12: TypeScript & Testing
- [ ] Add comprehensive types
- [ ] Set up testing infrastructure
- [ ] Write unit & integration tests

---

## Success Metrics

### Code Quality
- ✅ No file exceeds 300 lines
- ✅ All components follow single responsibility principle
- ✅ 80%+ code reusability across screens
- ✅ TypeScript strict mode enabled
- ✅ 70%+ test coverage

### Performance
- ✅ Initial load time < 2s
- ✅ Screen transitions < 100ms
- ✅ Memory usage < 150MB
- ✅ 60 FPS animations

### Developer Experience
- ✅ Clear component hierarchy
- ✅ Consistent naming conventions
- ✅ Comprehensive documentation
- ✅ Easy onboarding for new developers

---

## File Structure After Refactoring

```
src/
├── components/
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── index.ts
├── data/
│   ├── categories.ts
│   ├── meals.ts
│   ├── cuisines.ts
│   ├── preferences/
│   └── index.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useDebounce.ts
│   ├── useImagePicker.ts
│   └── index.ts
├── navigation/
├── screens/
│   ├── Auth/
│   ├── MainTab/
│   │   ├── Home/
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   ├── Scan/
│   │   │   ├── CookWhatIHaveFlow/
│   │   │   │   ├── CookWhatIHaveFlow.tsx
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   ├── types/
│   │   │   │   └── index.ts
│   │   │   └── ScanBottomSheet.tsx
│   │   └── ...
│   ├── Preferences/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── screens/
│   └── ...
├── services/
│   ├── api/
│   ├── database/
│   ├── ai/
│   └── index.ts
├── store/
│   ├── slices/
│   ├── hooks/
│   └── index.ts
├── types/
│   ├── api/
│   ├── models/
│   ├── ui/
│   └── index.ts
├── utils/
│   ├── validation.ts
│   ├── formatting.ts
│   ├── imageProcessing.ts
│   └── index.ts
└── theme/
```

---

## Next Steps

1. **Review & Approve** this refactoring plan
2. **Prioritize** which phase to start with
3. **Create** feature branches for each major refactoring
4. **Implement** incrementally to avoid breaking changes
5. **Test** thoroughly after each phase
6. **Document** all new components and patterns

---

## Notes

- All refactoring should be done incrementally
- Maintain backward compatibility during migration
- Create comprehensive tests before refactoring
- Document all breaking changes
- Use feature flags for gradual rollout
