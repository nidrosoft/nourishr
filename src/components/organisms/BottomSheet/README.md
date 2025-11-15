# BottomSheet Component

A reusable, animated bottom sheet component with sticky footer support.

## Features

- ✅ Smooth slide-up/slide-down animations
- ✅ Drag handle indicator
- ✅ Scrollable content area
- ✅ Optional sticky footer for CTAs
- ✅ Configurable height
- ✅ Optional close button
- ✅ Dark overlay backdrop
- ✅ Safe area insets support
- ✅ Consistent styling across the app

## Usage

### Basic Example

```tsx
import { BottomSheet } from '@/components/organisms';

function MyScreen() {
  const [visible, setVisible] = useState(false);

  return (
    <BottomSheet
      visible={visible}
      onClose={() => setVisible(false)}
      title="My Bottom Sheet"
      subtitle="Optional subtitle text"
    >
      <Text>Your content goes here</Text>
    </BottomSheet>
  );
}
```

### With Sticky Footer Button

```tsx
<BottomSheet
  visible={visible}
  onClose={() => setVisible(false)}
  title="Select Options"
  subtitle="Choose your preferences"
  footer={
    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
      <Text style={styles.buttonText}>Submit</Text>
    </TouchableOpacity>
  }
>
  {/* Your form fields */}
  <View>
    <Text>Option 1</Text>
    <Text>Option 2</Text>
  </View>
</BottomSheet>
```

### Custom Height

```tsx
<BottomSheet
  visible={visible}
  onClose={() => setVisible(false)}
  title="Large Content"
  height={0.8} // 80% of screen height
>
  <Text>Lots of content...</Text>
</BottomSheet>
```

### Without Close Button

```tsx
<BottomSheet
  visible={visible}
  onClose={() => setVisible(false)}
  title="No Close Button"
  showCloseButton={false}
>
  <Text>Content</Text>
</BottomSheet>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | required | Controls visibility of the bottom sheet |
| `onClose` | `() => void` | required | Callback when sheet should close |
| `title` | `string` | required | Main title text |
| `subtitle` | `string` | optional | Subtitle text below title |
| `height` | `number` | `0.6` | Sheet height as percentage of screen (0-1) |
| `children` | `ReactNode` | required | Scrollable content |
| `footer` | `ReactNode` | optional | Sticky footer content (e.g., buttons) |
| `showCloseButton` | `boolean` | `true` | Show/hide close button in header |

## Styling

The component uses the app's theme system:
- Colors from `theme/colors.ts`
- Typography from `theme/typography.ts`
- Spacing from `theme/layout.ts`
- Animations from `theme/animations.ts`

### Recommended Heights

- **Small content** (1-2 sections): `0.5` (50%)
- **Medium content** (3-4 sections): `0.6` (60%) - **Default**
- **Large content** (5+ sections): `0.7-0.8` (70-80%)
- **Full screen**: `0.9` (90%)

## Best Practices

1. **Use sticky footer for CTAs**: Place primary action buttons in the `footer` prop to keep them always visible
2. **Keep content scrollable**: Don't overfill the sheet - let users scroll if needed
3. **Consistent heights**: Use standard heights (0.5, 0.6, 0.7, 0.8) for consistency
4. **Clear titles**: Use descriptive, action-oriented titles
5. **Subtitles for context**: Add subtitles to explain what the sheet is for

## Example: Form with Submit Button

```tsx
<BottomSheet
  visible={showForm}
  onClose={() => setShowForm(false)}
  title="Add New Item"
  subtitle="Fill in the details below"
  height={0.65}
  footer={
    <TouchableOpacity 
      style={styles.submitButton} 
      onPress={handleSubmit}
    >
      <Text style={styles.submitText}>Add Item</Text>
    </TouchableOpacity>
  }
>
  <View style={styles.form}>
    <TextInput placeholder="Name" />
    <TextInput placeholder="Description" />
    <TextInput placeholder="Price" />
  </View>
</BottomSheet>

const styles = StyleSheet.create({
  form: {
    gap: spacing.md,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md + 2,
    borderRadius: radius.full,
    alignItems: 'center',
  },
  submitText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '600',
  },
});
```

## Notes

- The overlay automatically closes the sheet when tapped
- Safe area insets are handled automatically for the footer
- Animations use the app's standard animation utilities
- The drag handle is always visible at the top
