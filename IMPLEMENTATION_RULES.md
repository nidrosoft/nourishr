# 🎯 IMPLEMENTATION RULES - MANDATORY CHECKLIST

## ⚠️ CRITICAL: Always Follow These Steps

### Rule #1: Check Expo SDK 54 Documentation FIRST
**BEFORE implementing ANY Expo-related feature:**

```bash
# Use Context7 to check official docs
mcp1_get-library-docs with context7CompatibleLibraryID: /websites/expo_dev_versions_v54_0_0
```

**Topics to check:**
- Installation commands
- Version compatibility
- Configuration requirements
- API usage examples
- Platform-specific requirements

### Rule #2: Verify Package Versions
**ALWAYS use `npx expo install` for Expo packages:**

```bash
# ✅ CORRECT
npx expo install react-native-reanimated react-native-worklets

# ❌ WRONG
npm install react-native-reanimated
```

### Rule #3: Check for Required Peer Dependencies
**Example: Reanimated requires Worklets**
- Don't assume single package installation
- Check docs for companion packages
- Install all required dependencies together

### Rule #4: Verify Babel Configuration
**Check if package needs Babel plugin:**
- Reanimated: Requires `react-native-reanimated/plugin`
- Must be LAST in plugins array
- Check docs for specific config

### Rule #5: Clear Cache After Major Changes
**Always clear cache when:**
- Installing new native modules
- Changing Babel config
- Switching package versions

```bash
rm -rf .expo node_modules/.cache
npx expo start -c
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Before Writing Code:
- [ ] Check Expo SDK 54 docs via Context7
- [ ] Verify correct package versions
- [ ] Check for peer dependencies
- [ ] Review API changes from previous versions
- [ ] Check platform-specific requirements

### During Implementation:
- [ ] Follow official examples from docs
- [ ] Use exact API as documented
- [ ] Don't assume APIs from memory
- [ ] Test on both iOS and Android if applicable

### After Implementation:
- [ ] Clear cache and restart Metro
- [ ] Test on actual device/simulator
- [ ] Check for deprecation warnings
- [ ] Verify no console errors

---

## 🚨 Common Mistakes to AVOID

### ❌ DON'T:
1. Install packages without checking docs
2. Use `npm install` for Expo packages
3. Assume API compatibility without verification
4. Skip peer dependencies
5. Forget to clear cache after native changes
6. Use old API patterns from memory

### ✅ DO:
1. Always check Context7 documentation first
2. Use `npx expo install` for all Expo packages
3. Install all required dependencies together
4. Follow official examples exactly
5. Clear cache after native module changes
6. Test immediately after implementation

---

## 📚 Context7 Query Templates

### For Package Installation:
```
Topic: "[package-name] installation version compatibility SDK 54"
```

### For API Usage:
```
Topic: "[feature-name] API usage examples configuration"
```

### For Platform-Specific:
```
Topic: "[feature-name] iOS Android platform-specific requirements"
```

### For Troubleshooting:
```
Topic: "[error-message] troubleshooting common issues"
```

---

## 🎯 Reanimated-Specific Rules

### Installation:
```bash
# ALWAYS install both packages together
npx expo install react-native-reanimated react-native-worklets
```

### Babel Config:
```javascript
// Must be LAST plugin
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    'react-native-reanimated/plugin',  // MUST BE LAST!
  ],
};
```

### API Usage:
- Use `useSharedValue()` not `useRef(new Animated.Value())`
- Use `useAnimatedStyle()` for styles
- Use `withSpring()` / `withTiming()` not `Animated.spring()`
- Use `runOnJS()` for callbacks
- Add `'worklet'` directive for worklet functions

---

## 📊 Version Compatibility Matrix

| Package | Expo SDK 54 Version |
|---------|---------------------|
| react-native-reanimated | ~4.1.1 |
| react-native-worklets | (auto-installed) |
| react-native-gesture-handler | ~2.22.0 |
| expo-blur | ~15.0.7 |
| expo-haptics | ~15.0.7 |

**Always verify with:** `npx expo install [package] --check`

---

## 🔄 Migration Workflow

1. **Check Docs** → Use Context7
2. **Install Correctly** → Use `npx expo install`
3. **Configure** → Follow official examples
4. **Clear Cache** → `npx expo start -c`
5. **Test** → Verify on device
6. **Document** → Note any issues

---

## ✅ Success Criteria

Before marking implementation complete:
- [ ] Documentation checked via Context7
- [ ] Correct packages installed
- [ ] Babel configured (if needed)
- [ ] Cache cleared
- [ ] App runs without errors
- [ ] Feature works as expected
- [ ] No deprecation warnings
- [ ] Tested on target platform(s)

---

**REMEMBER: When in doubt, CHECK THE DOCS via Context7!** 📚✨
