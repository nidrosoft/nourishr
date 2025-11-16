# Email & Cultural Background Analysis

## 🔍 **CURRENT ISSUES IDENTIFIED:**

### **Issue 1: Duplicate Fields - `country` vs `cultural_background`**
- ✅ **We ARE capturing**: `country` (e.g., "United States")
- ❌ **We ARE NOT capturing**: `cultural_background` (always NULL)
- **Problem**: Redundant fields - both serve the same purpose

### **Issue 2: Missing Email Capture for Phone Sign-Up**
- ✅ **Google Sign-Up**: Email captured automatically from Google
- ❌ **Phone Sign-Up**: No email captured during onboarding
- **Problem**: Cannot send password reset emails to phone users

---

## 📊 **DATABASE CURRENT STATE:**

### **`users` table has:**
```sql
email: text (nullable)
phone_number: text (nullable)
country: text
cultural_background: text (nullable) -- ❌ ALWAYS NULL
```

### **Current Auth Flows:**

**1. Email/Google Sign-Up:**
```typescript
// AuthService.ts line 145-156
await supabase.from('users').insert({
  id: data.user.id,
  email: payload.email,  // ✅ Email captured
  auth_provider: 'email',
  // ... other fields
});
```

**2. Phone Sign-Up:**
```typescript
// AuthService.ts line 82-92
await supabase.from('users').insert({
  id: data.user.id,
  phone_number: phone,  // ✅ Phone captured
  auth_provider: 'phone',
  // ❌ NO EMAIL FIELD
  // ... other fields
});
```

---

## ✅ **RECOMMENDED SOLUTIONS:**

### **Solution 1: Remove `cultural_background` Column**
**Reasoning:**
- `country` already captures this information
- Keeping both creates confusion and null data
- Cleaner database schema

**Action:**
- Remove `cultural_background` from `UserIdentityData` interface
- Remove from `saveIdentity()` method
- (Optional) Drop column from database via migration

---

### **Solution 2: Add Email Field to Onboarding**
**Reasoning:**
- Required for password recovery
- Required for email notifications
- Best practice to have both phone AND email

**Implementation Plan:**

#### **A. Update PreferenceIdentityScreen UI:**
Add email field between First Name and Date of Birth:
```tsx
{/* First Name */}
<TextField ... />

{/* Email Address */}  // ⭐ NEW
<View style={styles.fieldContainer}>
  <Text style={styles.fieldLabel}>
    Email Address <Text style={styles.required}>*</Text>
  </Text>
  <Text style={styles.fieldHint}>
    Required for account recovery and notifications
  </Text>
  <TextField
    value={email}
    onChangeText={setEmail}
    placeholder="your.email@example.com"
    keyboardType="email-address"
    autoCapitalize="none"
    autoCorrect={false}
  />
</View>

{/* Date of Birth */}
<TouchableOpacity ... />
```

#### **B. Logic for Email Field:**

**For Phone Sign-Up Users:**
- Field is empty and editable
- User MUST enter email
- Validation: email format check

**For Google Sign-Up Users:**
- Field is pre-filled from Google account
- Field is disabled/read-only (grayed out)
- Shows checkmark icon to indicate verified

#### **C. Update Interfaces:**
```typescript
// PreferencesService.ts
export interface UserIdentityData {
  firstName: string;
  lastName?: string;
  email: string;  // ⭐ ADD THIS (required)
  dateOfBirth: string;
  gender: string;
  country: string;
  // culturalBackground?: string;  // ❌ REMOVE THIS
}
```

#### **D. Update Save Method:**
```typescript
// PreferencesService.ts - saveIdentity()
await this.upsertUser({
  first_name: data.firstName,
  last_name: data.lastName || null,
  email: data.email,  // ⭐ ADD THIS
  date_of_birth: data.dateOfBirth,
  gender: data.gender,
  country: data.country,
  // cultural_background: data.culturalBackground || null,  // ❌ REMOVE
  onboarding_step: 1,
  updated_at: new Date().toISOString(),
});
```

---

## 🎯 **IMPLEMENTATION STEPS:**

### **Step 1: Update PreferenceIdentityScreen**
1. Add `email` state
2. Add email TextField UI
3. Add email validation (format check)
4. Pre-fill email if user signed up with Google
5. Make field read-only for Google users
6. Update `isValid` check to include email
7. Pass email to `saveIdentity()`

### **Step 2: Update PreferencesService**
1. Remove `culturalBackground` from `UserIdentityData` interface
2. Add `email: string` to `UserIdentityData` interface
3. Update `saveIdentity()` to save email
4. Remove `cultural_background` from database update

### **Step 3: Update AuthService (Optional Enhancement)**
1. When creating phone user profile, add placeholder email
2. Email will be updated during onboarding

---

## 📱 **USER EXPERIENCE FLOW:**

### **Scenario 1: Phone Sign-Up**
1. User signs up with phone number
2. Verifies OTP
3. **Onboarding Screen 1:**
   - First Name: [Enter]
   - Last Name: [Enter] (optional)
   - **Email: [Enter]** ⭐ REQUIRED
   - Date of Birth: [Select]
   - Gender: [Select]
   - Country: [Search & Select]
4. Email saved to database ✅

### **Scenario 2: Google Sign-Up**
1. User signs up with Google
2. **Onboarding Screen 1:**
   - First Name: [Pre-filled from Google]
   - Last Name: [Pre-filled from Google]
   - **Email: [Pre-filled, Read-only] ✓** ⭐ AUTO-FILLED
   - Date of Birth: [Select]
   - Gender: [Select]
   - Country: [Search & Select]
3. Email already in database ✅

---

## ✅ **BENEFITS:**

1. **Cleaner Database**: Remove unused `cultural_background` column
2. **Password Recovery**: All users have email for password reset
3. **Email Notifications**: Can send meal plans, updates, etc.
4. **Better UX**: Google users see their email auto-filled
5. **Data Completeness**: No more NULL emails for phone users

---

## 🚨 **VALIDATION RULES:**

### **Email Validation:**
```typescript
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
```

### **Updated isValid Check:**
```typescript
const isValid = 
  firstName.trim().length > 0 && 
  email.trim().length > 0 && 
  isValidEmail(email) &&  // ⭐ NEW
  dateOfBirth !== null && 
  calculatedAge !== null && 
  calculatedAge >= 13 && 
  selectedGender !== null && 
  selectedCountry !== null;
```

---

## 📝 **NEXT STEPS:**

Would you like me to:
1. ✅ Remove `cultural_background` field
2. ✅ Add email field to PreferenceIdentityScreen
3. ✅ Update PreferencesService interfaces
4. ✅ Implement email validation
5. ✅ Add logic to pre-fill email for Google users

**Ready to implement?** 🚀
