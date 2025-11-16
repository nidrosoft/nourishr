# Button System - Complete Guide

## Overview
The app now has a complete, consistent button system with three button variants, all using the brand gradient and fully rounded corners.

---

## 🎨 Button Variants

### **1. PrimaryButton** (Solid Gradient)
**Use for**: Main actions, primary CTAs, important actions

**Visual**:
- Background: Orange to red-orange gradient (`#FF9500` → `#FD6A2F`)
- Text: White
- Shape: Fully rounded pill (borderRadius: 999)
- Size: 56px min height

**Example**:
```tsx
import { PrimaryButton } from '../components';

<PrimaryButton
  title="Continue"
  onPress={handleContinue}
  loading={isLoading}
  disabled={!isValid}
  fullWidth={true}
/>
```

**Props**:
- `title`: string - Button text
- `onPress`: () => void - Click handler
- `loading?`: boolean - Shows spinner
- `disabled?`: boolean - Disables button
- `fullWidth?`: boolean - Default: true
- `style?`: ViewStyle - Custom container styles
- `textStyle?`: TextStyle - Custom text styles

---

### **2. SecondaryButton** (Gradient Border)
**Use for**: Secondary actions, cancel buttons, alternative options

**Visual**:
- Background: White
- Border: 2px gradient border (`#FF9500` → `#FD6A2F`)
- Text: Primary color (`#FF9500`)
- Shape: Fully rounded pill (borderRadius: 999)
- Size: 56px min height (52px inner + 2px border each side)

**Example**:
```tsx
import { SecondaryButton } from '../components';

<SecondaryButton
  title="Skip"
  onPress={handleSkip}
  loading={isLoading}
  disabled={false}
  fullWidth={true}
/>
```

**Props**:
- `title`: string - Button text
- `onPress`: () => void - Click handler
- `loading?`: boolean - Shows spinner
- `disabled?`: boolean - Disables button
- `fullWidth?`: boolean - Default: true
- `style?`: ViewStyle - Custom container styles
- `textStyle?`: TextStyle - Custom text styles

**Technical Implementation**:
Uses a gradient wrapper with white inner view to create the border effect:
```tsx
<LinearGradient> {/* Gradient border */}
  <View> {/* White background */}
    <Text>Button Text</Text>
  </View>
</LinearGradient>
```

---

### **3. TertiaryButton** (Gradient Text)
**Use for**: Tertiary actions, text links, subtle CTAs, inline actions

**Visual**:
- Background: Transparent
- Text: Gradient text (`#FF9500` → `#FD6A2F`)
- Shape: No border, minimal padding
- Size: 44px min height (smaller, more compact)

**Example**:
```tsx
import { TertiaryButton } from '../components';

<TertiaryButton
  title="Learn More"
  onPress={handleLearnMore}
  loading={isLoading}
  disabled={false}
  fullWidth={false} // Default: false for tertiary
/>
```

**Props**:
- `title`: string - Button text
- `onPress`: () => void - Click handler
- `loading?`: boolean - Shows spinner
- `disabled?`: boolean - Disables button
- `fullWidth?`: boolean - Default: false
- `style?`: ViewStyle - Custom container styles
- `textStyle?`: TextStyle - Custom text styles

**Technical Implementation**:
Uses MaskedView to apply gradient to text:
```tsx
<MaskedView maskElement={<Text>Button Text</Text>}>
  <LinearGradient colors={['#FF9500', '#FD6A2F']}>
    <Text style={{ opacity: 0 }}>Button Text</Text>
  </LinearGradient>
</MaskedView>
```

---

## 📁 File Structure

```
src/
  components/
    atoms/
      Button/
        ├── PrimaryButton.tsx    ✅ Solid gradient button
        ├── SecondaryButton.tsx  ✅ Gradient border button
        ├── TertiaryButton.tsx   ✅ Gradient text button
        └── index.ts             ✅ Exports all buttons
```

**Removed**:
- ❌ `/src/components/PrimaryButton.tsx` (duplicate, removed)

---

## 🎯 Usage Guidelines

### **When to Use Each Button**

#### **PrimaryButton**
✅ Sign Up / Sign In  
✅ Continue / Next  
✅ Save / Submit  
✅ Confirm / Complete  
✅ Get Started  
✅ Main CTA on any screen  

#### **SecondaryButton**
✅ Cancel  
✅ Skip  
✅ Go Back  
✅ Alternative action  
✅ Edit / Change  
✅ Secondary option in a choice  

#### **TertiaryButton**
✅ Learn More  
✅ See Details  
✅ Resend Code  
✅ Forgot Password  
✅ Help / Support  
✅ Inline text actions  

---

## 🎨 Visual Hierarchy

**Screen with Multiple Buttons**:
```tsx
<View>
  {/* Primary action - most prominent */}
  <PrimaryButton title="Create Account" onPress={handleSignUp} />
  
  {/* Secondary action - less prominent */}
  <SecondaryButton title="Sign In Instead" onPress={handleSignIn} />
  
  {/* Tertiary action - subtle */}
  <TertiaryButton title="Learn More" onPress={handleLearnMore} />
</View>
```

---

## 🔧 Customization Examples

### **Custom Width**
```tsx
<PrimaryButton
  title="Submit"
  onPress={handleSubmit}
  fullWidth={false}
  style={{ width: 200 }}
/>
```

### **Custom Text Style**
```tsx
<SecondaryButton
  title="Cancel"
  onPress={handleCancel}
  textStyle={{ fontSize: 14, fontWeight: '500' }}
/>
```

### **Loading State**
```tsx
<PrimaryButton
  title="Processing..."
  onPress={handleSubmit}
  loading={isSubmitting}
  disabled={isSubmitting}
/>
```

### **Disabled State**
```tsx
<PrimaryButton
  title="Continue"
  onPress={handleContinue}
  disabled={!isFormValid}
/>
```

---

## 🎨 Design Specifications

### **Colors**
- **Gradient Start**: `#FF9500` (Orange)
- **Gradient End**: `#FD6A2F` (Red-Orange)
- **Text (Primary)**: `#FFFFFF` (White)
- **Text (Secondary)**: `#FF9500` (Primary color)
- **Background (Secondary)**: `#FFFFFF` (White)

### **Dimensions**
- **Border Radius**: `999` (Fully rounded pill)
- **Min Height**: 
  - Primary/Secondary: `56px`
  - Tertiary: `44px`
- **Padding Vertical**: `16px` (spacing.md)
- **Padding Horizontal**: `24px` (spacing.lg)
- **Border Width** (Secondary): `2px`

### **Typography**
- **Font Size**: `16px`
- **Font Weight**: `600` (Semi-bold)
- **Line Height**: `24px`

---

## 🚀 Implementation Details

### **Gradient Configuration**
All buttons use the same gradient from the splash screen:
```tsx
colors={['#FF9500', '#FD6A2F']}
start={{ x: 0, y: 0 }}
end={{ x: 1, y: 1 }}
```

### **Fully Rounded Corners**
All buttons use `borderRadius: 999` for a perfect pill shape that adapts to any button size.

### **Accessibility**
- All buttons support `disabled` state with 50% opacity
- Loading states show ActivityIndicator
- Touch feedback with `activeOpacity`
- Proper minimum touch target size (44-56px)

### **Performance**
- Gradient rendered once, no re-renders
- Optimized with `overflow: 'hidden'` for clipping
- Minimal style calculations

---

## 📦 Dependencies

### **Required Packages**
```json
{
  "expo-linear-gradient": "~15.0.7",
  "@react-native-masked-view/masked-view": "0.3.2"
}
```

### **Installation** (if needed)
```bash
npx expo install expo-linear-gradient @react-native-masked-view/masked-view
```

---

## ✅ Testing Checklist

### **Visual Tests**
- [ ] PrimaryButton shows gradient background
- [ ] PrimaryButton is fully rounded (pill shape)
- [ ] SecondaryButton shows gradient border
- [ ] SecondaryButton has white background
- [ ] TertiaryButton shows gradient text
- [ ] All buttons maintain shape at different widths

### **Interaction Tests**
- [ ] Buttons respond to touch
- [ ] Loading state shows spinner
- [ ] Disabled state prevents interaction
- [ ] Disabled state shows reduced opacity
- [ ] Touch feedback (activeOpacity) works

### **Responsive Tests**
- [ ] fullWidth={true} spans container width
- [ ] fullWidth={false} fits content
- [ ] Buttons work on different screen sizes
- [ ] Text doesn't overflow or wrap unexpectedly

---

## 🎯 Best Practices

### **DO**
✅ Use PrimaryButton for main actions  
✅ Use SecondaryButton for alternative actions  
✅ Use TertiaryButton for subtle/inline actions  
✅ Provide clear, action-oriented labels  
✅ Show loading state during async operations  
✅ Disable buttons when action isn't available  
✅ Use fullWidth for mobile-first layouts  

### **DON'T**
❌ Use multiple PrimaryButtons on same screen  
❌ Use vague labels like "OK" or "Submit"  
❌ Override gradient colors (maintain consistency)  
❌ Make buttons too small (< 44px height)  
❌ Forget to handle loading/disabled states  
❌ Use TertiaryButton for critical actions  

---

## 🔄 Migration Guide

### **From Old PrimaryButton**
**Before**:
```tsx
<PrimaryButton title="Continue" onPress={handleNext} />
// Solid orange, rounded corners
```

**After**:
```tsx
<PrimaryButton title="Continue" onPress={handleNext} />
// Gradient orange-to-red, fully rounded pill
```
✅ **No code changes needed!** Just reload the app.

### **From Old SecondaryButton**
**Before**:
```tsx
<SecondaryButton 
  title="Cancel" 
  onPress={handleCancel}
  borderColor={colors.primary}
/>
```

**After**:
```tsx
<SecondaryButton 
  title="Cancel" 
  onPress={handleCancel}
/>
// Gradient border, white background, no borderColor prop
```
⚠️ **Remove `borderColor` prop** - now uses gradient automatically.

---

## 🎉 Summary

The button system is now:
- ✅ **Consistent**: All buttons use the brand gradient
- ✅ **Modern**: Fully rounded pill shapes
- ✅ **Flexible**: Three variants for different use cases
- ✅ **Accessible**: Proper states and touch targets
- ✅ **Performant**: Optimized rendering
- ✅ **Beautiful**: Matches splash screen aesthetic

**Ready to use across the entire app!** 🚀✨
