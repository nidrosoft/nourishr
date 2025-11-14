# Nourishr Development Roadmap

## ✅ Phase 1: Frontend Architecture (COMPLETED)

- [x] Project setup with Expo + TypeScript
- [x] Design system (colors, typography, spacing)
- [x] Reusable components
- [x] Navigation structure
- [x] All screens implemented
- [x] Mock services
- [x] Context/state management

---

## 🚧 Phase 2: Backend Integration (NEXT)

### 2.1 Supabase Setup
- [ ] Create Supabase project
- [ ] Install dependencies: `@supabase/supabase-js`
- [ ] Create environment variables file
- [ ] Set up Supabase client

### 2.2 Database Schema
```sql
-- Users table (handled by Supabase Auth)

-- User Preferences
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  diet_types TEXT[],
  allergies TEXT[],
  favorite_cuisines TEXT[],
  meals_per_day INTEGER,
  rotation_window TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Meals
CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT NOT NULL, -- 'recipe' or 'delivery'
  cuisine TEXT,
  prep_time INTEGER,
  calories INTEGER,
  health_tags TEXT[],
  delivery_eta INTEGER,
  restaurant TEXT,
  ingredients TEXT[],
  instructions TEXT[],
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User Favorites
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  meal_id UUID REFERENCES meals NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, meal_id)
);

-- Meal History
CREATE TABLE meal_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  meal_id UUID REFERENCES meals NOT NULL,
  action TEXT NOT NULL, -- 'viewed', 'cooked', 'ordered'
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2.3 Authentication
- [ ] Replace `MockAuthService` with real Supabase auth
- [ ] Implement email/password auth
- [ ] Implement phone auth (Twilio integration)
- [ ] Add password reset flow
- [ ] Store auth tokens securely (AsyncStorage)
- [ ] Handle token refresh

### 2.4 User Preferences
- [ ] Replace `MockUserPreferencesService`
- [ ] Implement save preferences to Supabase
- [ ] Implement fetch preferences from Supabase
- [ ] Add update preferences functionality

### 2.5 Row Level Security (RLS)
```sql
-- User Preferences RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Similar policies for user_favorites and meal_history
```

---

## 🤖 Phase 3: AI Integration

### 3.1 OpenAI Setup
- [ ] Get OpenAI API key
- [ ] Install: `npm install openai`
- [ ] Create Edge Function for secure API calls
- [ ] Set up environment variables

### 3.2 Meal Recommendations
- [ ] Create recommendation algorithm
- [ ] Consider user preferences
- [ ] Factor in meal history
- [ ] Implement rotation logic
- [ ] Cache recommendations

**Edge Function Example:**
```typescript
// supabase/functions/recommend-meals/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from '@supabase/supabase-js'

serve(async (req) => {
  const { userId, preferences } = await req.json()
  
  // Fetch user data
  // Call OpenAI API
  // Return personalized recommendations
})
```

### 3.3 AI Chat Assistant
- [ ] Replace `MockAIChatService`
- [ ] Implement streaming responses
- [ ] Add conversation context
- [ ] Store chat history
- [ ] Add cooking tips database

**Implementation:**
```typescript
const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: 'You are a helpful cooking assistant...' },
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ],
  stream: true
})
```

### 3.4 Recipe Generation
- [ ] Generate recipes from ingredients
- [ ] Consider cuisine preferences
- [ ] Provide step-by-step instructions
- [ ] Estimate cooking time and difficulty

---

## 📸 Phase 4: Computer Vision

### 4.1 Image Picker Setup
- [ ] Install: `npx expo install expo-image-picker expo-camera`
- [ ] Request camera permissions
- [ ] Implement image picker UI
- [ ] Add image preview

### 4.2 Ingredient Detection
- [ ] Integrate OpenAI Vision API or Google Cloud Vision
- [ ] Parse ingredients from images
- [ ] Handle multiple ingredients
- [ ] Add confidence scores
- [ ] Allow manual corrections

**OpenAI Vision Example:**
```typescript
const response = await openai.chat.completions.create({
  model: "gpt-4-vision-preview",
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "List all food ingredients in this image" },
        { type: "image_url", image_url: { url: imageBase64 } }
      ]
    }
  ]
})
```

### 4.3 Calorie Estimation
- [ ] Implement food recognition
- [ ] Estimate portion sizes
- [ ] Calculate calories
- [ ] Show nutritional breakdown
- [ ] Store estimates in database

---

## 🚚 Phase 5: Delivery Integration

### 5.1 Research & Planning
- [ ] Research Uber Eats API
- [ ] Research DoorDash API
- [ ] Check API availability and costs
- [ ] Determine integration approach

### 5.2 Restaurant Search
- [ ] Implement location services
- [ ] Search nearby restaurants
- [ ] Filter by cuisine
- [ ] Show delivery times and fees

### 5.3 Menu Integration
- [ ] Fetch restaurant menus
- [ ] Parse menu items
- [ ] Show prices and descriptions
- [ ] Handle menu updates

### 5.4 Order Placement (if available)
- [ ] Implement cart functionality
- [ ] Add payment integration (Stripe)
- [ ] Place orders through API
- [ ] Track order status

---

## ✨ Phase 6: Enhanced Features

### 6.1 Favorites System
- [ ] Add/remove favorites
- [ ] Sync with Supabase
- [ ] Show favorite count
- [ ] Sort by date added

### 6.2 Meal History
- [ ] Track viewed meals
- [ ] Track cooked meals
- [ ] Track ordered meals
- [ ] Show history timeline

### 6.3 Meal Planning
- [ ] Weekly meal planner
- [ ] Drag-and-drop interface
- [ ] Generate shopping lists
- [ ] Calendar integration

### 6.4 Shopping Lists
- [ ] Auto-generate from recipes
- [ ] Categorize by store section
- [ ] Check off items
- [ ] Share lists

### 6.5 Nutrition Tracking
- [ ] Daily calorie tracking
- [ ] Macro breakdown
- [ ] Weekly/monthly reports
- [ ] Goal setting

### 6.6 Social Features
- [ ] Share recipes
- [ ] Rate meals
- [ ] Leave reviews
- [ ] Follow other users

### 6.7 Notifications
- [ ] Meal suggestions reminders
- [ ] Cooking timers
- [ ] Delivery updates
- [ ] Weekly meal plan ready

---

## 🎨 Phase 7: Polish & Optimization

### 7.1 Performance
- [ ] Implement image caching
- [ ] Add loading skeletons
- [ ] Optimize list rendering (FlatList)
- [ ] Reduce bundle size
- [ ] Add offline support

### 7.2 Animations
- [ ] Install: `react-native-reanimated`
- [ ] Add screen transitions
- [ ] Animate list items
- [ ] Add micro-interactions
- [ ] Implement gesture handlers

### 7.3 Error Handling
- [ ] Add error boundaries
- [ ] Implement retry logic
- [ ] Show user-friendly errors
- [ ] Add crash reporting (Sentry)

### 7.4 Testing
- [ ] Unit tests (Jest)
- [ ] Component tests (React Native Testing Library)
- [ ] E2E tests (Detox)
- [ ] API integration tests

### 7.5 Accessibility
- [ ] Add screen reader support
- [ ] Improve color contrast
- [ ] Add haptic feedback
- [ ] Test with VoiceOver/TalkBack

---

## 🚀 Phase 8: Launch Preparation

### 8.1 App Store Setup
- [ ] Create Apple Developer account
- [ ] Create Google Play Developer account
- [ ] Design app icon
- [ ] Create screenshots
- [ ] Write app description

### 8.2 Build & Deploy
- [ ] Configure EAS Build
- [ ] Create production builds
- [ ] Test on real devices
- [ ] Submit to App Store
- [ ] Submit to Play Store

### 8.3 Marketing
- [ ] Create landing page
- [ ] Set up social media
- [ ] Create demo video
- [ ] Write blog posts
- [ ] Reach out to food bloggers

### 8.4 Analytics
- [ ] Add analytics (Mixpanel/Amplitude)
- [ ] Track key metrics
- [ ] Set up A/B testing
- [ ] Monitor user behavior

---

## 📊 Success Metrics

### User Engagement
- Daily active users (DAU)
- Weekly active users (WAU)
- Session duration
- Meals viewed per session
- Recipes cooked
- Orders placed

### Retention
- Day 1, 7, 30 retention
- Churn rate
- Feature adoption

### Business
- Revenue (if monetized)
- Conversion rate
- Customer lifetime value (LTV)
- Cost per acquisition (CPA)

---

## 🔧 Technical Debt & Improvements

### Code Quality
- [ ] Add ESLint configuration
- [ ] Add Prettier
- [ ] Set up pre-commit hooks (Husky)
- [ ] Add TypeScript strict mode
- [ ] Improve error types

### Documentation
- [ ] Add JSDoc comments
- [ ] Create component storybook
- [ ] Document API endpoints
- [ ] Create architecture diagrams

### CI/CD
- [ ] Set up GitHub Actions
- [ ] Automate testing
- [ ] Automate builds
- [ ] Automate deployments

---

## 💡 Future Ideas

- Voice commands ("Hey Nourishr, find me a recipe")
- AR cooking instructions (overlay on real kitchen)
- Smart appliance integration
- Meal kit delivery integration
- Restaurant reservations
- Wine/drink pairing suggestions
- Dietary coaching
- Meal prep optimization
- Leftover management
- Seasonal ingredient suggestions

---

**Current Status: Phase 1 Complete ✅**
**Next Up: Phase 2 - Backend Integration 🚧**
