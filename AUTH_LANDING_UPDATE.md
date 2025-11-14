# Auth Landing Screen Update

## Overview
Complete redesign of the authentication landing screen with video background and modern UI matching the provided screenshot.

## Key Features

### 🎥 **Video Background**
- **File**: `assets/images/nourishlanding.mp4`
- **Behavior**: Loops continuously, muted, full-screen
- **Coverage**: Extends to status bar (edge-to-edge)
- **Overlay**: Semi-transparent dark overlay (50% opacity) for text readability

### 📱 **Screen Structure**

#### **Top Section**
1. **App Name**: "Nourishr"
   - Large, bold, white text (56px)
   - Centered positioning

2. **Description**: 3-sentence value proposition
   - "Say goodbye to meal planning stress. Get instant, personalized meal suggestions tailored to your taste, ingredients, and mood. Whether you're cooking at home or ordering out, we've got you covered."
   - White text with 90% opacity
   - Centered, readable line height

#### **Bottom Section**

1. **Sign up with Phone Number** (Primary CTA)
   - Orange gradient button (#FF9500 → #FD6A2F)
   - Phone icon from Iconsax
   - White text: "Sign up with Phone Number"
   - Rounded corners (radius.xl)
   - Full width

2. **Subtitle under phone button**
   - "✨ Quick & easy - no hassle, just your phone number"
   - Small, white text with 80% opacity

3. **Divider**
   - Horizontal lines with "or" text in center
   - White with 30% opacity lines
   - White text with 70% opacity

4. **Continue with Google** (Secondary CTA)
   - White background button
   - Google "G" icon (blue #4285F4)
   - Black text: "Continue with Google"
   - Rounded corners (radius.xl)
   - Full width

5. **Sign In Link**
   - "Already have an account? **Sign In**"
   - White text, bold "Sign In"
   - Centered

6. **Disclaimer**
   - "By signing up, you agree to our **Terms**. See how we use your data in our **Privacy Policy**."
   - Small white text with 70% opacity
   - Underlined links
   - Centered

## Technical Implementation

### Dependencies
- ✅ `expo-av` - Video playback
- ✅ `expo-linear-gradient` - Gradient button
- ✅ `iconsax-react-native` - Phone icon

### Video Setup
```typescript
<Video
  ref={videoRef}
  source={require('../../../assets/images/nourishlanding.mp4')}
  resizeMode={ResizeMode.COVER}
  isLooping
  shouldPlay
  isMuted
/>
```

### Gradient Button
```typescript
<LinearGradient
  colors={['#FF9500', '#FD6A2F']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 0 }}
>
  <NourishrIcon name="Call" size={20} color={colors.white} />
  <Text>Sign up with Phone Number</Text>
</LinearGradient>
```

## Navigation Flow

**After Onboarding** → **Auth Landing** → User chooses:
1. **Phone Sign Up** → PhoneSignUpScreen
2. **Google Sign Up** → SignUpScreen (will integrate Google OAuth)
3. **Sign In** → SignInScreen

## Design Consistency

### Colors
- **Primary Gradient**: #FF9500 → #FD6A2F (matches splash screen)
- **White Text**: All text is white for contrast against video
- **Overlay**: Dark semi-transparent for readability

### Typography
- **Logo**: 56px, bold, white
- **Description**: 16px, white, 90% opacity
- **Buttons**: Medium weight, appropriate for each button type
- **Disclaimer**: Caption size, 70% opacity

### Spacing
- Consistent use of design system spacing
- Proper padding for readability
- Balanced top and bottom sections

### Button Styling
- **Phone Button**: Gradient with icon, rounded
- **Google Button**: White with Google colors, rounded
- Both use `radius.xl` for modern look
- Full width for easy tapping

## User Experience

### Visual Flow
1. User sees engaging video background
2. Clear app name and value proposition
3. Prominent phone sign-up option (fastest)
4. Alternative Google sign-up
5. Easy access to sign in for existing users
6. Clear terms and privacy information

### Accessibility
- High contrast white text on dark overlay
- Large touch targets for buttons
- Clear visual hierarchy
- Readable font sizes

## Future Enhancements
- [ ] Integrate real Google OAuth
- [ ] Add Apple Sign In option
- [ ] Implement actual Terms and Privacy Policy links
- [ ] Add loading states for auth actions
- [ ] Consider adding fade-in animations

---

**Result**: A modern, professional authentication landing screen with engaging video background that clearly communicates the app's value and provides easy sign-up options! 🎬✨
