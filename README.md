# Nourishr

An AI-powered meal assistant that helps you decide what to eat, whether cooking at home or ordering delivery.

## Features

### Current Implementation (Phase 1 - Frontend)

- **Onboarding Flow**: Welcome screens introducing the app's key features
- **Authentication**: 
  - Email/password sign up and sign in
  - Phone number authentication
  - Password reset
- **User Preferences**: Dietary preferences, allergies, favorite cuisines, meal rotation settings
- **Home Tab**: Daily meal suggestions (mix of recipes and delivery options)
- **Cook Tab**: Recipe finder based on available ingredients
- **AI Chef Tab**: Live chat with AI cooking assistant
- **Favorites Tab**: Saved meals and recipes
- **Profile Tab**: User settings and account management

### Coming Soon

- Real Supabase backend integration
- AI-powered meal recommendations (OpenAI/Claude)
- Ingredient scanning with computer vision
- Calorie estimation from photos
- Real delivery service integration
- Recipe step-by-step cooking mode

## Tech Stack

- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **Icons**: Iconsax React Native
- **State Management**: React Context
- **Backend (Future)**: Supabase
- **AI (Future)**: OpenAI/Claude API

## Project Structure

```
nourishr/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── PrimaryButton.tsx
│   │   ├── SecondaryButton.tsx
│   │   ├── TextField.tsx
│   │   ├── CategoryChip.tsx
│   │   ├── MealCard.tsx
│   │   └── NourishrIcon.tsx
│   ├── context/             # React Context providers
│   │   └── AppContext.tsx
│   ├── navigation/          # Navigation setup
│   │   ├── RootNavigator.tsx
│   │   ├── AuthStackNavigator.tsx
│   │   ├── MainTabNavigator.tsx
│   │   └── types.ts
│   ├── screens/             # App screens
│   │   ├── Splash/
│   │   ├── Onboarding/
│   │   ├── Auth/
│   │   ├── Preferences/
│   │   └── MainTab/
│   │       ├── Home/
│   │       ├── Cook/
│   │       ├── AIChat/
│   │       ├── Favorites/
│   │       └── Profile/
│   ├── services/            # Service layer (currently mocked)
│   │   ├── AuthService.ts
│   │   ├── UserPreferencesService.ts
│   │   ├── AIRecommendationService.ts
│   │   ├── AIChatService.ts
│   │   └── FoodScanService.ts
│   ├── theme/               # Design system
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── layout.ts
│   │   └── index.ts
│   └── types/               # TypeScript types
│       └── index.ts
├── App.tsx
└── app.json
```

## Design System

### Colors

- **Primary**: #F6737D (Coral pink)
- **Secondary**: #F6F8FE (Light blue)
- **Dark Blue**: #4038FF
- **Success**: #00C566
- **Error**: #E53935
- **Warning**: #FACC15

### Typography

- Heading XL: 32px, Bold
- Heading L: 28px, Bold
- Heading M: 24px, Semibold
- Heading S: 20px, Semibold
- Body: 16px, Regular
- Caption: 12px, Regular

### Spacing

- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- xxl: 48px

### Border Radius

- sm: 8px
- md: 12px
- lg: 16px (used for buttons and cards)
- xl: 24px
- full: 9999px (circular)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
cd nourishr
npm install
```

### Running the App

```bash
# Start Expo development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## Mock Services

All services are currently mocked for frontend development:

- **AuthService**: Simulates authentication with 1-second delays
- **UserPreferencesService**: Stores preferences in memory
- **AIRecommendationService**: Returns hardcoded meal suggestions
- **AIChatService**: Echoes messages with canned responses
- **FoodScanService**: Returns random ingredients and calorie estimates

## Navigation Flow

```
Splash Screen
    ↓
First Launch? → Onboarding → Auth Landing
    ↓
Not Authenticated? → Auth Stack (Sign In/Sign Up)
    ↓
No Preferences? → Preferences Setup
    ↓
Main Tab Navigator (Home, Cook, AI Chef, Favorites, Profile)
```

## Future Enhancements

1. **Backend Integration**
   - Set up Supabase project
   - Implement real authentication
   - Create database schema for users, meals, preferences
   - Add Row Level Security policies

2. **AI Integration**
   - Connect to OpenAI/Claude API
   - Implement meal recommendation algorithm
   - Add conversational AI for cooking assistance
   - Integrate computer vision for ingredient/calorie scanning

3. **Delivery Integration**
   - Partner with delivery services (Uber Eats, DoorDash)
   - Implement real-time menu fetching
   - Add order placement functionality

4. **Enhanced Features**
   - Meal planning calendar
   - Shopping list generation
   - Nutrition tracking
   - Social features (share recipes)
   - Voice commands

## Contributing

This is a personal project, but suggestions and feedback are welcome!

## License

MIT License
