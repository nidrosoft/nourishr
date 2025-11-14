# Cook What I Have - Feature Documentation

## Overview
A complete multi-step flow that allows users to scan their ingredients and discover dishes they can make based on their available items and preferred cuisine.

## Files Created/Modified

### New Files
1. **`/src/screens/MainTab/Scan/CookWhatIHaveFlow.tsx`**
   - Complete 4-step bottom sheet flow
   - Camera and gallery integration
   - AI ingredient detection simulation
   - Cuisine selection
   - Results display

### Modified Files
1. **`/src/screens/MainTab/Scan/ScanBottomSheet.tsx`**
   - Updated "Ingredients in my kitchen" to "Cook What I Have"
   - Added flow trigger logic
   - Integrated CookWhatIHaveFlow component

2. **`/package.json`**
   - Added `expo-image-picker` dependency

## Flow Structure

### Step 1: Photos (Add Ingredients)
**Purpose:** Capture or select photos of ingredients

**Features:**
- Photo grid displaying up to 10 photos
- "Take photo" button (launches camera)
- "Select from gallery" button (opens photo library)
- Manual ingredient entry with text input
- Real-time ingredient chips display
- Photo counter (X / 10)
- Remove photo functionality

**Validation:**
- Must have at least 1 photo OR 1 manual ingredient to proceed

**UI Elements:**
- Progress stepper: 1/4
- Step label: "Photos"
- Next button (disabled if no photos/ingredients)

---

### Step 2: Ingredients Review
**Purpose:** Review and adjust detected ingredients

**Features:**
- List of all detected/added ingredients
- Checkbox to include/exclude each item
- Trash icon to remove ingredients
- "Add more ingredients" button (returns to Step 1)
- Empty state if no ingredients

**Validation:**
- Must have at least 1 selected ingredient to proceed

**UI Elements:**
- Progress stepper: 2/4
- Step label: "Ingredients"
- Back button
- Next button (disabled if no selected ingredients)

**Ingredient Item:**
```
[✓] Tomatoes                    [🗑️]
[✓] Chicken breast              [🗑️]
[ ] Onions (deselected)         [🗑️]
```

---

### Step 3: Cuisine Selection
**Purpose:** Choose preferred cuisine or country

**Features:**
- Grid of 10 cuisine cards with emojis
- Search functionality (future enhancement)
- "Surprise me!" button for random selection
- Visual selection state

**Available Cuisines:**
- 🇮🇹 Italian
- 🇲🇽 Mexican
- 🇯🇵 Japanese
- 🇹🇭 Thai
- 🇮🇳 Indian
- 🇨🇳 Chinese
- 🇫🇷 French
- 🇨🇲 Cameroonian
- 🇲🇦 Moroccan
- 🇬🇷 Greek

**Validation:**
- Must select at least 1 cuisine to proceed

**UI Elements:**
- Progress stepper: 3/4
- Step label: "Cuisine"
- Back button
- Next button changes to "See dishes" (disabled if no cuisine selected)

---

### Step 4: Results
**Purpose:** Display AI-generated dish recommendations

**Features:**
- Placeholder for AI-generated dishes
- Shows selected cuisine
- Recipe cards (to be implemented)

**UI Elements:**
- Progress stepper: 4/4
- Step label: "Dishes"
- Back button

**Future Implementation:**
- Recipe cards with:
  - Dish name and image
  - Country/cuisine tag
  - Cooking time
  - Difficulty level
  - Ingredient match indicator
  - Missing ingredients list
  - "Start cooking" button
  - "Swap cuisine" button

---

## Technical Implementation

### Camera & Gallery Integration

**Dependencies:**
```json
{
  "expo-image-picker": "~17.0.7"
}
```

**Permissions Required:**
- Camera access (for taking photos)
- Media library access (for selecting from gallery)

**Image Configuration:**
```typescript
{
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.8,
}
```

### AI Ingredient Detection

**Current Implementation:**
- Mock simulation with random ingredient selection
- Detects 2-4 ingredients per photo

**Mock Ingredients:**
- Tomatoes
- Chicken breast
- Onions
- Garlic
- Spinach
- Rice

**Future Integration:**
Replace `simulateIngredientDetection()` with actual AI API:
```typescript
const detectIngredients = async (imageUri: string) => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'ingredient.jpg',
  });

  const response = await fetch('YOUR_AI_API_ENDPOINT', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  return data.ingredients;
};
```

### State Management

**Key States:**
```typescript
const [currentStep, setCurrentStep] = useState<CookWhatIHaveStep>('photos');
const [photos, setPhotos] = useState<string[]>([]);
const [ingredients, setIngredients] = useState<Ingredient[]>([]);
const [manualIngredient, setManualIngredient] = useState('');
const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
```

**Ingredient Type:**
```typescript
type Ingredient = {
  id: string;
  name: string;
  quantity?: string;
  isSelected: boolean;
  imageUri?: string;
};
```

### Navigation Flow

```
ScanBottomSheet (Mode Selector)
    ↓ (User taps "Cook What I Have")
CookWhatIHaveFlow
    ↓
Step 1: Photos → Step 2: Ingredients → Step 3: Cuisine → Step 4: Results
    ↑                ↑                    ↑
    └────────────────┴────────────────────┘
         (Back button navigation)
```

---

## User Experience

### OfferUp-Inspired Design
- Multi-step progress indicator
- Smooth animations (spring/timing)
- All within single bottom sheet
- No page navigation
- Clear step labels
- Disabled state for buttons
- Visual feedback on selections

### Validation Rules
1. **Step 1 → 2:** At least 1 photo OR 1 manual ingredient
2. **Step 2 → 3:** At least 1 selected ingredient
3. **Step 3 → 4:** At least 1 cuisine selected

### Error Handling
- Permission denied alerts
- Maximum photo limit (10)
- Photo capture/selection errors
- Clear error messages

---

## Next Steps for Full Implementation

### 1. AI Integration
- [ ] Integrate real AI ingredient detection API
- [ ] Handle API errors and loading states
- [ ] Add confidence scores for detected ingredients
- [ ] Allow quantity adjustments

### 2. Recipe Generation
- [ ] Integrate AI recipe generation API
- [ ] Create recipe card components
- [ ] Implement recipe detail screen
- [ ] Add "Start cooking" flow
- [ ] Implement step-by-step cooking instructions

### 3. Enhanced Features
- [ ] Multiple cuisine selection
- [ ] Cuisine search functionality
- [ ] Save favorite recipes
- [ ] Share recipes
- [ ] Dietary restrictions filter
- [ ] Cooking time filter
- [ ] Difficulty level filter

### 4. Performance Optimization
- [ ] Image compression before upload
- [ ] Caching for detected ingredients
- [ ] Lazy loading for recipe results
- [ ] Offline mode support

### 5. Analytics
- [ ] Track photo uploads
- [ ] Track ingredient detection accuracy
- [ ] Track cuisine preferences
- [ ] Track recipe views/starts

---

## Testing Checklist

### Functional Testing
- [ ] Camera permission flow
- [ ] Gallery permission flow
- [ ] Photo capture works
- [ ] Photo selection works
- [ ] Photo removal works
- [ ] Manual ingredient entry works
- [ ] Ingredient selection/deselection works
- [ ] Ingredient removal works
- [ ] Cuisine selection works
- [ ] Back navigation works
- [ ] Next button validation works
- [ ] Flow completion works
- [ ] Flow cancellation works

### Edge Cases
- [ ] Maximum 10 photos limit
- [ ] No photos, only manual ingredients
- [ ] No manual ingredients, only photos
- [ ] All ingredients deselected
- [ ] Permission denied scenarios
- [ ] Network errors
- [ ] Large image files
- [ ] Rapid button tapping

### UI/UX Testing
- [ ] Animations are smooth
- [ ] Progress indicator updates correctly
- [ ] Step labels update correctly
- [ ] Buttons enable/disable correctly
- [ ] Empty states display correctly
- [ ] Error messages are clear
- [ ] Loading states are visible

---

## API Integration Guide

### Ingredient Detection API
**Endpoint:** `POST /api/detect-ingredients`

**Request:**
```typescript
{
  image: File, // Base64 or multipart/form-data
  options?: {
    confidence_threshold: number, // 0-1
    max_ingredients: number,
  }
}
```

**Response:**
```typescript
{
  ingredients: [
    {
      name: string,
      confidence: number,
      quantity?: string,
      category?: string,
    }
  ],
  processing_time: number,
}
```

### Recipe Generation API
**Endpoint:** `POST /api/generate-recipes`

**Request:**
```typescript
{
  ingredients: string[],
  cuisine: string,
  dietary_restrictions?: string[],
  max_recipes?: number,
}
```

**Response:**
```typescript
{
  recipes: [
    {
      id: string,
      name: string,
      description: string,
      image_url: string,
      cuisine: string,
      cooking_time: number,
      difficulty: 'easy' | 'medium' | 'hard',
      ingredients_used: string[],
      ingredients_missing: string[],
      match_percentage: number,
      instructions: string[],
      nutrition?: {
        calories: number,
        protein: number,
        carbs: number,
        fat: number,
      }
    }
  ]
}
```

---

## Design System

### Colors
- Primary: `#FF9500` (Orange)
- Primary Light: `#FFF4E6`
- Success: `#2D6A4F` (Green)
- Error: `#E63946` (Red)
- Gray scales: `gray10` to `gray80`

### Typography
- H2: Step titles
- H3: Header title
- H4: Section titles
- Body: Descriptions and labels
- Caption: Helper text

### Spacing
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- xxl: 48px

### Radius
- md: 12px
- full: 9999px (rounded buttons)
- xl: 24px (bottom sheet)

---

## Accessibility

### Screen Reader Support
- [ ] Add accessibility labels to all buttons
- [ ] Add accessibility hints for complex interactions
- [ ] Announce step changes
- [ ] Announce ingredient detection results

### Keyboard Navigation
- [ ] Tab order follows logical flow
- [ ] Enter key submits forms
- [ ] Escape key closes bottom sheet

### Visual Accessibility
- [ ] Sufficient color contrast
- [ ] Large touch targets (44x44pt minimum)
- [ ] Clear focus indicators
- [ ] Support for larger text sizes

---

## Known Limitations

1. **Photo Limit:** Maximum 10 photos per session
2. **Single Selection:** Can only select one photo at a time from gallery
3. **Mock AI:** Currently using simulated ingredient detection
4. **No Persistence:** State resets when flow is closed
5. **No History:** Previous scans are not saved

---

## Support & Troubleshooting

### Common Issues

**Issue:** Camera not opening
**Solution:** Check camera permissions in device settings

**Issue:** Photos not appearing
**Solution:** Check media library permissions

**Issue:** Ingredients not detected
**Solution:** Ensure good lighting and clear photos

**Issue:** Flow crashes on photo selection
**Solution:** Check image file size and format

---

## Version History

### v1.0.0 (Current)
- Initial implementation
- 4-step flow
- Camera and gallery integration
- Mock AI ingredient detection
- Cuisine selection
- Basic validation

### Planned for v1.1.0
- Real AI integration
- Recipe generation
- Recipe detail screens
- Save favorites
- Share functionality
