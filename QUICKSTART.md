# Nourishr - Quick Start Guide

## What You Have

A fully functional **Expo + React Native** app with:

✅ Complete navigation structure (Splash → Onboarding → Auth → Preferences → Main App)
✅ All screens implemented with proper layouts
✅ Design system with colors, typography, and reusable components
✅ Mock services for all backend functionality
✅ TypeScript throughout
✅ Bottom tab navigation with 5 tabs
✅ Iconsax icons integrated

## Running the App

### 1. Start the Development Server

```bash
cd nourishr
npm start
```

### 2. Choose Your Platform

Press:
- `i` for iOS Simulator (Mac only)
- `a` for Android Emulator
- `w` for Web browser

Or scan the QR code with Expo Go app on your phone.

## Testing the App Flow

### First Launch Experience

1. **Splash Screen** (2 seconds)
   - Shows "Nourishr" logo with tagline

2. **Onboarding** (3 slides)
   - Swipe through feature highlights
   - Tap "Get started"

3. **Auth Landing**
   - Choose "Sign up", "Sign in", or "Phone number"

4. **Sign Up** (recommended for testing)
   - Enter any name, email, and password
   - Mock service accepts any credentials

5. **Preferences Setup**
   - Select diet types (required)
   - Choose allergies, cuisines, meals per day
   - Set rotation window
   - Tap "Save & continue"

6. **Main App** (Bottom Tabs)
   - **Home**: Browse meal suggestions, tap to view details
   - **Cook**: Add ingredients, select cuisine, find recipes
   - **AI Chef**: Chat with mock AI assistant
   - **Favorites**: View saved meals (mock data)
   - **Profile**: View profile, sign out

## Mock Data & Behavior

### Authentication
- **Any credentials work** - the mock service accepts everything
- Sign in/sign up have 1-second delays to simulate API calls
- Phone auth accepts code `123456`

### Meal Suggestions
- 6 hardcoded meals (3 recipes, 3 delivery)
- Randomly shuffled on each load
- Tap refresh icon to reload

### AI Chat
- Echoes your messages with canned responses
- 1-second delay to simulate AI thinking

### Ingredients Scanning
- Shows "Coming Soon" alert
- Future: will use camera + AI

## Key Files to Know

### Navigation
- `src/navigation/RootNavigator.tsx` - Main navigation logic
- `src/navigation/MainTabNavigator.tsx` - Bottom tabs setup

### Context
- `src/context/AppContext.tsx` - Global state management

### Services (All Mocked)
- `src/services/AuthService.ts`
- `src/services/AIRecommendationService.ts`
- `src/services/AIChatService.ts`

### Theme
- `src/theme/colors.ts` - Color palette
- `src/theme/typography.ts` - Text styles
- `src/theme/layout.ts` - Spacing and radius

## Customizing

### Change Colors
Edit `src/theme/colors.ts`:
```typescript
primary: '#F6737D',  // Change to your brand color
```

### Add More Mock Meals
Edit `src/services/AIRecommendationService.ts`:
```typescript
private mockMeals: Meal[] = [
  // Add more meal objects here
];
```

### Modify Onboarding
Edit `src/screens/Onboarding/OnboardingScreen.tsx`:
```typescript
const slides: OnboardingSlide[] = [
  // Customize slides
];
```

## Next Steps

### Phase 2: Backend Integration

1. **Set up Supabase**
   ```bash
   npm install @supabase/supabase-js
   ```
   - Create Supabase project
   - Add auth tables
   - Replace mock services

2. **Add AI Integration**
   ```bash
   npm install openai
   ```
   - Get OpenAI API key
   - Replace mock AI services

3. **Add Image Picker**
   ```bash
   npx expo install expo-image-picker
   ```
   - Implement ingredient scanning
   - Add calorie estimation

### Phase 3: Polish

- Add loading skeletons
- Implement pull-to-refresh
- Add animations (react-native-reanimated)
- Implement real favorites system
- Add meal history tracking

## Troubleshooting

### Metro bundler issues
```bash
npm start -- --clear
```

### iOS build issues
```bash
cd ios && pod install && cd ..
```

### TypeScript errors
```bash
npx tsc --noEmit
```

### Reset everything
```bash
rm -rf node_modules
npm install
npm start -- --clear
```

## Demo Credentials

Since everything is mocked, use any credentials:

- **Email**: test@example.com
- **Password**: password123
- **Phone Code**: 123456

## Support

For issues or questions:
1. Check the main README.md
2. Review the code comments
3. Check Expo documentation: https://docs.expo.dev

---

**Happy coding! 🍽️**
