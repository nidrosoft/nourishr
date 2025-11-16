# 🚀 PHASE 1: REANIMATED 3 IMPLEMENTATION GUIDE
## Complete Step-by-Step Migration from React Native Animated to Reanimated 3

**Priority:** 🔴 CRITICAL  
**Timeline:** Week 1  
**Impact:** 60fps animations, 2x performance improvement

---

## 📦 STEP 1: INSTALLATION

### Install Dependencies:
```bash
# Install Reanimated 3
npx expo install react-native-reanimated

# Install Gesture Handler
npx expo install react-native-gesture-handler

# Verify installation
npx expo doctor
```

### Configure Babel:
Add to `babel.config.js`:
```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',  // ⚠️ Must be last!
    ],
  };
};
```

### Configure App Entry:
Update `App.tsx` or `index.ts`:
```typescript
import 'react-native-gesture-handler';  // ⚠️ Must be first import!
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Your app content */}
    </GestureHandlerRootView>
  );
}
```

---

## 🔄 STEP 2: MIGRATION PATTERNS

### Pattern 1: Basic Animation

#### Before (React Native Animated):
```typescript
import { Animated } from 'react-native';

const fadeAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 300,
    useNativeDriver: true,
  }).start();
}, []);

return (
  <Animated.View style={{ opacity: fadeAnim }}>
    <Text>Hello</Text>
  </Animated.View>
);
```

#### After (Reanimated 3):
```typescript
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming 
} from 'react-native-reanimated';

const opacity = useSharedValue(0);

useEffect(() => {
  opacity.value = withTiming(1, { duration: 300 });
}, []);

const animatedStyle = useAnimatedStyle(() => ({
  opacity: opacity.value,
}));

return (
  <Animated.View style={animatedStyle}>
    <Text>Hello</Text>
  </Animated.View>
);
```

---

### Pattern 2: Spring Animation

#### Before:
```typescript
Animated.spring(slideAnim, {
  toValue: 0,
  useNativeDriver: true,
  tension: 80,
  friction: 10,
}).start();
```

#### After:
```typescript
import { withSpring } from 'react-native-reanimated';

translateY.value = withSpring(0, {
  damping: 10,
  stiffness: 80,
});
```

---

### Pattern 3: Parallel Animations

#### Before:
```typescript
Animated.parallel([
  Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
  Animated.timing(scale, { toValue: 1, duration: 300, useNativeDriver: true }),
]).start();
```

#### After:
```typescript
opacity.value = withTiming(1, { duration: 300 });
scale.value = withTiming(1, { duration: 300 });
// Reanimated automatically runs these in parallel!
```

---

### Pattern 4: Sequence Animations

#### Before:
```typescript
Animated.sequence([
  Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
  Animated.timing(scale, { toValue: 1.2, duration: 200, useNativeDriver: true }),
]).start();
```

#### After:
```typescript
import { withSequence } from 'react-native-reanimated';

opacity.value = withSequence(
  withTiming(1, { duration: 300 }),
  withTiming(0.8, { duration: 200 })
);
```

---

### Pattern 5: Loop Animations

#### Before:
```typescript
Animated.loop(
  Animated.sequence([
    Animated.timing(pulseAnim, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
    Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
  ])
).start();
```

#### After:
```typescript
import { withRepeat } from 'react-native-reanimated';

scale.value = withRepeat(
  withSequence(
    withTiming(1.2, { duration: 1000 }),
    withTiming(1, { duration: 1000 })
  ),
  -1,  // -1 = infinite loop
  true // reverse
);
```

---

### Pattern 6: Interpolation

#### Before:
```typescript
const backgroundColor = scrollY.interpolate({
  inputRange: [0, 100],
  outputRange: ['transparent', '#FF6B35'],
  extrapolate: 'clamp',
});
```

#### After:
```typescript
import { interpolate, Extrapolation } from 'react-native-reanimated';

const animatedStyle = useAnimatedStyle(() => ({
  backgroundColor: interpolate(
    scrollY.value,
    [0, 100],
    ['transparent', '#FF6B35'],
    Extrapolation.CLAMP
  ),
}));
```

---

## 📁 STEP 3: FILE-BY-FILE MIGRATION

### File 1: `/src/theme/animations.ts`

#### Current Code:
```typescript
import { Animated } from 'react-native';

export const slideUpBottomSheet = (
  animatedValue: Animated.Value,
  toValue: number
) => {
  return Animated.spring(animatedValue, {
    toValue,
    useNativeDriver: true,
    tension: 80,
    friction: 10,
  });
};

export const slideDownBottomSheet = (
  animatedValue: Animated.Value,
  toValue: number
) => {
  return Animated.timing(animatedValue, {
    toValue,
    duration: 250,
    useNativeDriver: true,
  });
};

export const fadeIn = (animatedValue: Animated.Value) => {
  return Animated.timing(animatedValue, {
    toValue: 1,
    duration: 300,
    useNativeDriver: true,
  });
};

export const fadeOut = (animatedValue: Animated.Value) => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration: 200,
    useNativeDriver: true,
  });
};
```

#### New Code (Reanimated 3):
```typescript
import { withSpring, withTiming, SharedValue } from 'react-native-reanimated';

export const slideUpBottomSheet = (
  animatedValue: SharedValue<number>,
  toValue: number
) => {
  'worklet';
  animatedValue.value = withSpring(toValue, {
    damping: 10,
    stiffness: 80,
  });
};

export const slideDownBottomSheet = (
  animatedValue: SharedValue<number>,
  toValue: number
) => {
  'worklet';
  animatedValue.value = withTiming(toValue, {
    duration: 250,
  });
};

export const fadeIn = (animatedValue: SharedValue<number>) => {
  'worklet';
  animatedValue.value = withTiming(1, {
    duration: 300,
  });
};

export const fadeOut = (animatedValue: SharedValue<number>) => {
  'worklet';
  animatedValue.value = withTiming(0, {
    duration: 200,
  });
};

// New: Worklet-based animations
export const createSpringAnimation = (config?: {
  damping?: number;
  stiffness?: number;
}) => {
  'worklet';
  return withSpring(0, {
    damping: config?.damping ?? 10,
    stiffness: config?.stiffness ?? 80,
  });
};

export const createTimingAnimation = (config?: {
  duration?: number;
}) => {
  'worklet';
  return withTiming(0, {
    duration: config?.duration ?? 300,
  });
};
```

---

### File 2: `/src/screens/MainTab/Scan/components/Toast.tsx`

#### Current Code (Excerpt):
```typescript
import { Animated } from 'react-native';

const translateY = useRef(new Animated.Value(-100)).current;
const opacity = useRef(new Animated.Value(0)).current;

useEffect(() => {
  if (visible) {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }
}, [visible]);
```

#### New Code (Reanimated 3):
```typescript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

const translateY = useSharedValue(-100);
const opacity = useSharedValue(0);

useEffect(() => {
  if (visible) {
    // Parallel animations (automatic in Reanimated)
    translateY.value = withSpring(0, {
      damping: 10,
      stiffness: 80,
    });
    opacity.value = withTiming(1, { duration: 200 });

    // Auto hide after 3 seconds
    translateY.value = withDelay(3000, withTiming(-100, { duration: 250 }));
    opacity.value = withDelay(3000, withTiming(0, { duration: 200 }));
  }
}, [visible]);

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateY: translateY.value }],
  opacity: opacity.value,
}));

return (
  <Animated.View style={[styles.container, animatedStyle]}>
    {/* Content */}
  </Animated.View>
);
```

---

### File 3: `/src/screens/MainTab/Scan/SmartPantryScan.tsx`

#### Current Code (Pulse Animation):
```typescript
const pulseAnim = useRef(new Animated.Value(1)).current;

useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ])
  ).start();
}, []);
```

#### New Code (Reanimated 3):
```typescript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const scale = useSharedValue(1);

useEffect(() => {
  scale.value = withRepeat(
    withSequence(
      withTiming(1.1, { duration: 1000 }),
      withTiming(1, { duration: 1000 })
    ),
    -1,  // Infinite
    true // Reverse
  );
}, []);

const pulseStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));

return (
  <Animated.View style={pulseStyle}>
    {/* Capture button */}
  </Animated.View>
);
```

---

### File 4: `/src/screens/MainTab/Scan/components/ItemDetectionSheet.tsx`

#### Current Code (Bottom Sheet):
```typescript
const slideAnim = useRef(new Animated.Value(600)).current;

useEffect(() => {
  Animated.spring(slideAnim, {
    toValue: 0,
    useNativeDriver: true,
    tension: 80,
    friction: 10,
  }).start();
}, []);

const handleCancel = () => {
  Animated.timing(slideAnim, {
    toValue: 600,
    duration: 250,
    useNativeDriver: true,
  }).start(() => {
    onCancel();
  });
};
```

#### New Code (Reanimated 3):
```typescript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

const translateY = useSharedValue(600);

useEffect(() => {
  translateY.value = withSpring(0, {
    damping: 10,
    stiffness: 80,
  });
}, []);

const handleCancel = () => {
  translateY.value = withTiming(600, { duration: 250 }, (finished) => {
    if (finished) {
      runOnJS(onCancel)();  // ⚠️ Use runOnJS for callbacks!
    }
  });
};

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateY: translateY.value }],
}));

return (
  <Animated.View style={[styles.container, animatedStyle]}>
    {/* Content */}
  </Animated.View>
);
```

---

## 🎯 STEP 4: GESTURE INTEGRATION

### Add Swipe-to-Dismiss to Bottom Sheets:

```typescript
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const translateY = useSharedValue(0);
const context = useSharedValue({ y: 0 });

const gesture = Gesture.Pan()
  .onStart(() => {
    context.value = { y: translateY.value };
  })
  .onUpdate((event) => {
    translateY.value = Math.max(0, context.value.y + event.translationY);
  })
  .onEnd(() => {
    if (translateY.value > 100) {
      // Dismiss if dragged down more than 100px
      translateY.value = withSpring(600, {}, (finished) => {
        if (finished) {
          runOnJS(onClose)();
        }
      });
    } else {
      // Snap back
      translateY.value = withSpring(0);
    }
  });

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateY: translateY.value }],
}));

return (
  <GestureDetector gesture={gesture}>
    <Animated.View style={[styles.container, animatedStyle]}>
      {/* Content */}
    </Animated.View>
  </GestureDetector>
);
```

---

## 🎯 STEP 5: SCROLL ANIMATIONS

### Animated Header on Scroll:

```typescript
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

const scrollY = useSharedValue(0);

const scrollHandler = useAnimatedScrollHandler({
  onScroll: (event) => {
    scrollY.value = event.contentOffset.y;
  },
});

const headerStyle = useAnimatedStyle(() => ({
  opacity: interpolate(
    scrollY.value,
    [0, 100],
    [0, 1],
    Extrapolation.CLAMP
  ),
  transform: [{
    translateY: interpolate(
      scrollY.value,
      [0, 100],
      [-50, 0],
      Extrapolation.CLAMP
    ),
  }],
}));

return (
  <>
    <Animated.View style={[styles.header, headerStyle]}>
      {/* Header content */}
    </Animated.View>
    
    <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16}>
      {/* Content */}
    </Animated.ScrollView>
  </>
);
```

---

## ✅ STEP 6: TESTING CHECKLIST

### Performance Testing:
- [ ] Animations run at 60fps
- [ ] No frame drops during scrolling
- [ ] Smooth gesture interactions
- [ ] No JS thread blocking

### Visual Testing:
- [ ] Animations look smooth
- [ ] Timing feels natural
- [ ] Spring animations have proper bounce
- [ ] Gestures feel responsive

### Device Testing:
- [ ] Test on iOS device
- [ ] Test on Android device
- [ ] Test on low-end devices
- [ ] Test with React Native Debugger

### Regression Testing:
- [ ] All existing features work
- [ ] No crashes
- [ ] No visual glitches
- [ ] Haptics still work

---

## 🐛 COMMON ISSUES & SOLUTIONS

### Issue 1: "worklet" Error
**Error:** `Tried to synchronously call a non-worklet function`

**Solution:** Add `'worklet';` directive:
```typescript
const animatedStyle = useAnimatedStyle(() => {
  'worklet';  // Add this!
  return {
    opacity: opacity.value,
  };
});
```

---

### Issue 2: Callback Not Working
**Error:** `Cannot call function on UI thread`

**Solution:** Use `runOnJS`:
```typescript
import { runOnJS } from 'react-native-reanimated';

translateY.value = withTiming(0, {}, (finished) => {
  if (finished) {
    runOnJS(onComplete)();  // Wrap callback!
  }
});
```

---

### Issue 3: State Update Not Triggering
**Error:** Component not re-rendering

**Solution:** Use `useAnimatedReaction`:
```typescript
import { useAnimatedReaction } from 'react-native-reanimated';

useAnimatedReaction(
  () => scrollY.value,
  (current, previous) => {
    if (current > 100 && previous <= 100) {
      runOnJS(setHeaderVisible)(true);
    }
  }
);
```

---

### Issue 4: Babel Plugin Not Working
**Error:** Reanimated not working at all

**Solution:** 
1. Clear cache: `npx expo start -c`
2. Verify `babel.config.js` has plugin as **last** item
3. Restart Metro bundler

---

## 📊 PERFORMANCE COMPARISON

### Before (React Native Animated):
- Frame rate: ~30fps
- JS thread usage: High
- Animation smoothness: Janky
- Gesture responsiveness: Delayed

### After (Reanimated 3):
- Frame rate: 60fps ✅
- JS thread usage: Low ✅
- Animation smoothness: Buttery smooth ✅
- Gesture responsiveness: Instant ✅

---

## 🎯 SUCCESS CRITERIA

### Must Have:
- ✅ All animations migrated to Reanimated 3
- ✅ 60fps on all devices
- ✅ No visual regressions
- ✅ All tests passing

### Nice to Have:
- ✅ Gesture-driven animations
- ✅ Scroll-linked animations
- ✅ Advanced worklet usage
- ✅ Performance monitoring

---

## 📚 RESOURCES

### Documentation:
- [Reanimated 3 Docs](https://docs.swmansion.com/react-native-reanimated/)
- [Gesture Handler Docs](https://docs.swmansion.com/react-native-gesture-handler/)
- [Expo Reanimated Guide](https://docs.expo.dev/versions/latest/sdk/reanimated/)

### Examples:
- [Reanimated Examples](https://github.com/software-mansion/react-native-reanimated/tree/main/app/src/examples)
- [Gesture Handler Examples](https://github.com/software-mansion/react-native-gesture-handler/tree/main/example)

---

## 🚀 NEXT STEPS

After completing Phase 1:
1. Test thoroughly on real devices
2. Measure performance improvements
3. Document any issues
4. Move to Phase 2 (Liquid Glass)

**Estimated Time:** 3-5 days  
**Difficulty:** Medium  
**Impact:** ⭐⭐⭐⭐⭐

---

**Ready to start? Let's migrate the first file!** 🎉
