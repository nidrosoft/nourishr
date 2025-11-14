# Nourishr Splash Screen Animation

## Overview
Beautiful 5-second splash screen with typewriter animation and haptic feedback.

## Animation Timeline

### Phase 1: Logo Typing (0-0.5s)
- **Duration**: ~480ms (8 letters × 60ms each)
- **Text**: "Nourishr"
- **Speed**: 60ms per character (FASTER as requested)
- **Effect**: Each letter appears one by one
- **Haptic**: Light impact feedback on each letter
- **Visual**: Blinking cursor ("|") appears after text

### Phase 2: Pause (0.5-0.8s)
- **Duration**: 300ms
- **Effect**: Small pause after logo completes
- **Visual**: Cursor continues blinking

### Phase 3: Tagline Typing (0.8-1.9s)
- **Duration**: ~1120ms (14 characters × 80ms each)
- **Text**: "Dinner, solved."
- **Speed**: 80ms per character (slightly slower than logo)
- **Effect**: Tagline appears below logo
- **Haptic**: Light impact feedback on each character

### Phase 4: Display (1.9-5.0s)
- **Duration**: ~3.1s
- **Effect**: Full text displayed with blinking cursor
- **Visual**: Loading spinner at bottom

### Phase 5: Completion (5.0s)
- **Haptic**: Success notification feedback
- **Action**: Navigate to next screen

## Visual Elements

### Gradient Background
- **Colors**: #FF9500 → #FD6A2F (vibrant orange gradient)
- **Direction**: Top to bottom

### Logo
- **Font Size**: 48px
- **Font Weight**: 700 (Bold)
- **Color**: White
- **Position**: Center

### Cursor
- **Character**: "|"
- **Font Size**: 48px
- **Font Weight**: 300 (Light)
- **Opacity**: 0.7
- **Animation**: Blinks every 500ms

### Tagline
- **Text**: "Dinner, solved."
- **Font Size**: 16px
- **Color**: White
- **Opacity**: 0.9
- **Position**: Below logo

### Footer
- **Text**: "BY CYRIAC ZEH"
- **Font Size**: 12px
- **Letter Spacing**: 1.5px
- **Position**: Bottom center

### Loading Spinner
- **Color**: White
- **Size**: Large
- **Position**: Above footer

## Haptic Feedback

### Light Impact (Each Character)
- Triggered on every letter typed
- Creates tactile feedback for typing effect
- Makes the experience more engaging

### Success Notification (Completion)
- Triggered when animation completes
- Signals transition to next screen
- Provides satisfying conclusion

## Technical Implementation

### State Management
- `displayedLogo`: Current visible logo text
- `displayedTagline`: Current visible tagline text
- `showTagline`: Controls tagline visibility
- `showCursor`: Controls cursor blinking

### Intervals
- **Logo Interval**: 60ms (faster typing)
- **Tagline Interval**: 80ms (slightly slower)
- **Cursor Blink**: 500ms (smooth blinking)
- **Total Duration**: 5000ms (5 seconds)

### Cleanup
All intervals and timers are properly cleaned up to prevent memory leaks.

## User Experience

### Visual Flow
1. User sees gradient background
2. Logo types in quickly with cursor
3. Brief pause for emphasis
4. Tagline types in below
5. Everything displays together
6. Smooth transition to app

### Tactile Flow
1. Feel each letter as it types
2. Rhythm creates anticipation
3. Success haptic signals completion
4. Natural transition feel

## Customization Options

### Speed Adjustments
- **Logo**: Change `60` in logoInterval
- **Tagline**: Change `80` in taglineInterval
- **Cursor**: Change `500` in cursor blink

### Duration
- **Total**: Change `5000` in completion timer
- Adjust pause between logo and tagline

### Haptics
- **Intensity**: Change `ImpactFeedbackStyle.Light` to `.Medium` or `.Heavy`
- **Disable**: Remove `Haptics.impactAsync()` calls

## Performance

- Minimal re-renders
- Efficient interval management
- Proper cleanup on unmount
- Smooth 60fps animation
- No memory leaks

---

**Result**: A polished, professional splash screen that creates an engaging first impression with smooth animations and satisfying haptic feedback! 🎨✨
