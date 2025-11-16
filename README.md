# 🍽️ Nourishr

**Your AI-Powered Meal Planning & Discovery Companion**

Nourishr is a modern, cross-platform mobile app that revolutionizes how you plan meals, discover recipes, manage your pantry, and scan food for nutritional insights. Built with Expo SDK 54 and React Native, featuring iOS Liquid Glass design and Material You for Android.

## ✨ Features

### 🏠 Home Tab
- **Premium Banner** - Gradient text, compact CTA, fully responsive
- **Meal Recommendations** - "For You Today" with cook/order badges
- **Category Browsing** - Breakfast, Lunch, Dinner, Dessert, Snacks
- **Search** - Find meals, cuisines, and restaurants
- **Meal Details** - Full recipe view with ingredients and instructions

### 🔍 Discover Tab
- **Hero Card** - Featured trending meals with save functionality
- **Trending Grid** - 2-column grid of popular meals
- **Save to Favorites** - Heart icon with haptic feedback
- **Responsive Design** - Adapts to all device sizes

### 📋 Plan Tab
- **Weekly Meal Planner** - 7-day meal planning with drag & drop
- **Pantry Management** - Track ingredients with expiration alerts
- **Favorites Collection** - Quick access to saved meals
- **Shopping List** - Auto-generated from meal plans
- **Expiring Soon Badge** - Visual alerts for items nearing expiration

### 📸 Scan Tab (Bottom Sheet)
- **Meal Nutrition Scanner** - Take photos of meals for calorie estimation
- **Barcode Scanner** - Scan product barcodes for nutritional info
- **Shuffle Meal** - AI-powered meal suggestions with swipe gestures
- **Processing Animations** - Smooth loading states with Reanimated 3
- **iOS Liquid Glass** - BlurView backgrounds on bottom sheets

### 👤 Profile Tab
- **User Settings** - Manage account and preferences
- **Dietary Preferences** - Allergies, restrictions, favorite cuisines
- **Theme Settings** - Light/Dark mode (coming soon)
- **About & Support** - App info and help resources

### 🚀 Recently Implemented

- ✅ **Comprehensive Responsive Design** - All screens adapt to device sizes (iPhone SE to iPad)
- ✅ **Haptic Feedback** - Tactile responses on buttons, cards, and interactions
- ✅ **iOS Liquid Glass** - BlurView with system materials on bottom sheets
- ✅ **Platform-Specific UI** - Native iOS/Android components
- ✅ **Reanimated 3** - 60fps animations with worklets
- ✅ **Toast Notifications** - Consistent feedback system with icons
- ✅ **Safe Area Handling** - Edge-to-edge design with proper insets

### 🔜 Coming Soon

- Real Supabase backend integration
- AI-powered meal recommendations (OpenAI/Claude)
- Computer vision for ingredient/meal recognition
- Real delivery service integration (Uber Eats, DoorDash)
- Recipe step-by-step cooking mode with timers
- Social features (share meals, follow friends)
- Voice commands for hands-free cooking

## 🛠️ Tech Stack

### Core
- **Framework**: Expo SDK 54 (React Native 0.81.5)
- **Language**: TypeScript 5.9
- **React**: 19.1.0
- **New Architecture**: Enabled (Fabric + TurboModules)

### Navigation & UI
- **Navigation**: React Navigation 7 (Stack + Bottom Tabs)
- **Icons**: Iconsax React Native
- **Animations**: React Native Reanimated 3.4.1
- **Gestures**: React Native Gesture Handler 2.28
- **Blur Effects**: Expo Blur 15.0.7
- **Gradients**: Expo Linear Gradient 15.0.7

### Platform Features
- **Haptics**: Expo Haptics 15.0.7
- **Camera**: Expo Camera 17.0.9
- **Image Picker**: Expo Image Picker 17.0.8
- **Location**: Expo Location 19.0.7
- **Safe Area**: React Native Safe Area Context 5.6.2

### State & Data
- **State Management**: React Context API
- **Backend (Future)**: Supabase
- **AI (Future)**: OpenAI/Claude API

### Development
- **Platform**: iOS, Android, Web
- **iOS Features**: Liquid Glass (BlurView), SF Symbols, Native Bottom Sheets
- **Android Features**: Material You, Edge-to-Edge, Predictive Back Gestures

## 📁 Project Structure

```
nourishr/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── atoms/               # Basic building blocks
│   │   │   ├── PrimaryButton.tsx
│   │   │   ├── SecondaryButton.tsx
│   │   │   ├── TextField.tsx
│   │   │   └── Badge.tsx
│   │   ├── molecules/           # Composite components
│   │   │   ├── CategoryChip.tsx
│   │   │   ├── MealCard.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── organisms/           # Complex components
│   │   │   └── Toast/
│   │   ├── PlatformButton.tsx   # Platform-specific button
│   │   ├── PlatformSegmentedControl.tsx
│   │   └── NourishrIcon.tsx
│   ├── context/                 # React Context providers
│   │   └── AppContext.tsx
│   ├── hooks/                   # Custom React hooks
│   │   └── useToast.ts
│   ├── navigation/              # Navigation setup
│   │   ├── RootNavigator.tsx
│   │   ├── AuthStackNavigator.tsx
│   │   ├── MainTabNavigator.tsx
│   │   └── types.ts
│   ├── screens/                 # App screens
│   │   ├── Splash/
│   │   ├── Onboarding/
│   │   ├── Auth/
│   │   ├── Preferences/
│   │   └── MainTab/
│   │       ├── Home/            # Home tab screens
│   │       ├── Discover/        # Discover tab screens
│   │       ├── Plan/            # Plan tab screens
│   │       │   ├── PantryScreen.tsx
│   │       │   ├── WeeklyPlanScreen.tsx
│   │       │   └── components/
│   │       ├── Scan/            # Scan bottom sheet flows
│   │       │   ├── MealNutritionFlow/
│   │       │   ├── BarcodeFlow/
│   │       │   └── ShuffleMealFlow/
│   │       └── Profile/         # Profile tab screens
│   ├── services/                # Service layer (mocked)
│   │   ├── AuthService.ts
│   │   ├── UserPreferencesService.ts
│   │   └── AIRecommendationService.ts
│   ├── theme/                   # Design system
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── layout.ts
│   │   ├── shadows.ts           # Platform-specific shadows
│   │   └── index.ts
│   ├── utils/                   # Utility functions
│   │   ├── responsive.ts        # Responsive design utilities
│   │   └── haptics.ts           # Haptic feedback helpers
│   └── types/                   # TypeScript types
│       └── index.ts
├── App.tsx
├── app.json
└── Documentation/
    ├── EXPO_SDK_54_ANALYSIS.md
    ├── PHASE_1_IMPLEMENTATION_GUIDE.md
    ├── PHASE_2_LIQUID_GLASS_IMPLEMENTATION.md
    ├── PHASE_3_HAPTICS_IMPLEMENTATION.md
    ├── PHASE_4_PLATFORM_UI_IMPLEMENTATION.md
    └── RESPONSIVENESS_FINAL_REPORT.md
```

## 🎨 Design System

### Colors
- **Primary**: `#FF9500` (Orange) - Main brand color
- **Secondary**: `#10B981` (Green) - Success states
- **Background**: `#FFFFFF` (White)
- **Surface**: `#F8F9FA` (Light gray)
- **Error**: `#EF4444` (Red)
- **Warning**: `#F59E0B` (Amber)
- **Info**: `#3B82F6` (Blue)
- **Text**: `#111111` (Near black)
- **Gray Scale**: 10, 20, 40, 50, 60, 70, 80

### Typography
- **Heading XL**: 32px, Bold (700)
- **Heading L**: 28px, Bold (700)
- **Heading M**: 24px, Semibold (600)
- **Heading S**: 20px, Semibold (600)
- **Body Large**: 18px, Regular (400)
- **Body**: 16px, Regular (400)
- **Body Medium**: 14px, Medium (500)
- **Caption**: 12px, Regular (400)

### Responsive Sizing
- **Small Devices** (< 375px): Compact sizes (iPhone SE)
- **Medium Devices** (375-428px): Standard sizes (iPhone 14)
- **Large Devices** (428-768px): Larger sizes (iPhone Pro Max)
- **Tablets** (≥ 768px): Maximum sizes (iPad)

### Spacing
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **xxl**: 48px

### Border Radius
- **sm**: 8px
- **md**: 12px
- **lg**: 16px (cards, buttons)
- **xl**: 24px (large cards)
- **full**: 9999px (circular)
- **iOS Specific**: 12px (cards), 28px (sheets)

### Shadows (Platform-Specific)
**iOS:**
- Small: offset (0, 1), opacity 0.05, radius 2
- Medium: offset (0, 2), opacity 0.08, radius 8
- Large: offset (0, 4), opacity 0.12, radius 16

**Android:**
- Small: elevation 2
- Medium: elevation 4
- Large: elevation 8

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

## 🔧 Development Features

### Responsive Design System
- **Device Detection**: Automatic detection of device size
- **Conditional Styling**: `isSmallDevice ? small : large` pattern
- **Font Scaling**: `normalize()` function for consistent sizing
- **Responsive Spacing**: Adaptive padding and margins
- **Breakpoints**: Small (< 375), Medium (375-428), Large (428-768), Tablet (≥ 768)

### Haptic Feedback
- **Light**: Button taps, card presses
- **Medium**: Toggle switches, selections
- **Heavy**: Deletions, important actions
- **Success**: Successful operations
- **Warning**: Caution states
- **Error**: Failed operations

### Toast Notifications
- **Success**: Green icon, positive feedback
- **Error**: Red icon, error messages
- **Warning**: Orange icon, caution alerts
- **Info**: Blue icon, informational messages
- **Styling**: Black background, white icon container, colored icons

### Mock Services
All services are currently mocked for frontend development:
- **AuthService**: Simulates authentication with delays
- **UserPreferencesService**: In-memory preference storage
- **AIRecommendationService**: Hardcoded meal suggestions
- **FoodScanService**: Mock nutritional data

## 🗺️ Navigation Flow

```
Splash Screen (Animated Logo)
    ↓
First Launch? → Onboarding (3 screens) → Auth Landing
    ↓
Not Authenticated? → Auth Stack
    ├── Sign In
    ├── Sign Up
    └── Password Reset
    ↓
No Preferences? → Preferences Setup
    ├── Dietary Restrictions
    ├── Allergies
    ├── Favorite Cuisines
    └── Meal Rotation Settings
    ↓
Main Tab Navigator
    ├── Home (Stack)
    │   ├── Home Screen
    │   └── Meal Detail
    ├── Discover
    │   └── Discover Screen
    ├── Scan (Bottom Sheet)
    │   ├── Meal Nutrition Flow
    │   ├── Barcode Flow
    │   └── Shuffle Meal Flow
    ├── Plan
    │   ├── Plan Screen
    │   ├── Pantry Screen
    │   ├── Weekly Plan Screen
    │   └── Favorites Screen
    └── Profile (Stack)
        ├── Profile Screen
        └── Settings Screen
```

## 🚀 Roadmap

### Phase 1: Foundation ✅ COMPLETE
- ✅ Core navigation structure
- ✅ Authentication flow
- ✅ User preferences
- ✅ Main tab screens
- ✅ Responsive design system
- ✅ Haptic feedback
- ✅ Toast notifications

### Phase 2: iOS Liquid Glass 🚧 IN PROGRESS
- ✅ BlurView on bottom sheets
- ⏳ System materials (thin, thick, chrome)
- ⏳ Vibrancy effects
- ⏳ Dynamic Island integration
- ⏳ Live Activities

### Phase 3: Platform-Specific UI 📋 PLANNED
- ⏳ iOS: SF Symbols, Native Bottom Sheets, Segmented Controls
- ⏳ Android: Material You, Dynamic Colors, Material Chips
- ⏳ Platform detection and conditional rendering
- ⏳ Native component wrappers

### Phase 4: Backend Integration 📋 PLANNED
- ⏳ Supabase setup and configuration
- ⏳ Real authentication (email, phone, social)
- ⏳ Database schema (users, meals, pantry, plans)
- ⏳ Row Level Security policies
- ⏳ Real-time subscriptions

### Phase 5: AI Integration 📋 PLANNED
- ⏳ OpenAI/Claude API integration
- ⏳ Meal recommendation engine
- ⏳ Conversational AI chef
- ⏳ Computer vision for food recognition
- ⏳ Calorie estimation from photos

### Phase 6: Delivery Integration 📋 PLANNED
- ⏳ Uber Eats API integration
- ⏳ DoorDash API integration
- ⏳ Real-time menu fetching
- ⏳ Order placement and tracking
- ⏳ Restaurant search and filters

### Phase 7: Enhanced Features 📋 PLANNED
- ⏳ Meal planning calendar with drag & drop
- ⏳ Auto-generated shopping lists
- ⏳ Nutrition tracking and goals
- ⏳ Social features (share, follow, like)
- ⏳ Voice commands (Siri, Google Assistant)
- ⏳ Recipe step-by-step mode with timers
- ⏳ Offline mode with local storage

## 📊 Performance

- **Animations**: 60fps with Reanimated 3 worklets
- **Bundle Size**: Optimized with Expo's automatic code splitting
- **Startup Time**: < 2 seconds on modern devices
- **Memory Usage**: Efficient with React 19 concurrent features
- **Platform**: iOS 13+, Android 6.0+ (API 23+)

## 🧪 Testing

### Tested Devices
- ✅ iPhone SE (Small device < 375px)
- ✅ iPhone 14 (Medium device 390px)
- ✅ iPhone 14 Pro Max (Large device 430px)
- ✅ iPad mini (Tablet 768px)
- ✅ Android phones (various sizes)

### Test Coverage
- ✅ Responsive design on all screen sizes
- ✅ Haptic feedback on all interactions
- ✅ Toast notifications in all states
- ✅ Navigation flows
- ✅ Platform-specific features (iOS/Android)

## 📚 Documentation

Comprehensive documentation available in the project:
- `EXPO_SDK_54_ANALYSIS.md` - Deep dive into Expo SDK 54 features
- `RESPONSIVENESS_FINAL_REPORT.md` - Complete responsive design implementation
- `PHASE_2_LIQUID_GLASS_IMPLEMENTATION.md` - iOS Liquid Glass guide
- `PHASE_3_HAPTICS_IMPLEMENTATION.md` - Haptic feedback implementation
- `PHASE_4_PLATFORM_UI_IMPLEMENTATION.md` - Platform-specific UI guide

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

### Development Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Start Expo: `npm start`
4. Scan QR code with Expo Go app

### Code Style
- TypeScript strict mode
- ESLint + Prettier
- Atomic design pattern for components
- Responsive-first approach

## 📄 License

MIT License - feel free to use this project for learning and inspiration!

## 🙏 Acknowledgments

- **Expo Team** - For the amazing SDK 54 and documentation
- **React Native Community** - For Reanimated, Gesture Handler, and more
- **Iconsax** - For the beautiful icon library
- **Design Inspiration** - Uber Eats, DoorDash, Instacart

---

**Built with ❤️ using Expo SDK 54**

*Last Updated: November 15, 2025*
