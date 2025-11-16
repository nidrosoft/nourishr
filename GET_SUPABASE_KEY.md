# 🔑 HOW TO GET YOUR SUPABASE ANON KEY

## Quick Steps:

1. **Go to Supabase Dashboard**
   ```
   https://supabase.com/dashboard
   ```

2. **Select Your Project**
   - Click on "nourishr-production" (or your project name)
   - Project ID: `djtfefcugrocjkypthcf`

3. **Navigate to API Settings**
   - Click on "Project Settings" (gear icon in sidebar)
   - Click on "API" tab

4. **Copy Your Keys**
   - **Project URL:** `https://djtfefcugrocjkypthcf.supabase.co`
   - **anon/public key:** Copy this long string (starts with `eyJ...`)

5. **Update `.env.local`**
   ```bash
   EXPO_PUBLIC_SUPABASE_URL=https://djtfefcugrocjkypthcf.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

6. **Restart Your Dev Server**
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart
   npm start
   ```

---

## ⚠️ IMPORTANT NOTES:

### Safe to Expose:
- ✅ **Project URL** - Safe to commit to Git
- ✅ **anon/public key** - Safe to use in client app

### NEVER Expose:
- ❌ **service_role key** - Keep this secret!
- ❌ Never commit service_role key to Git
- ❌ Only use service_role key on server-side

---

## 📱 Testing the App:

Once you've added the anon key:

1. **Start the app:**
   ```bash
   npm start
   ```

2. **Navigate to Phone Sign Up**
   - Open the app
   - Click "Sign up with phone"

3. **Enter your phone number**
   - Select country code
   - Enter your real phone number

4. **Receive OTP**
   - You should receive an SMS with a 6-digit code
   - The code should auto-fill (Android/iOS)

5. **Verify**
   - Code verifies automatically
   - New users go to onboarding
   - Existing users go to dashboard

---

## 🐛 If It Doesn't Work:

### Check Twilio Configuration:
1. Go to Supabase Dashboard
2. Authentication > Providers
3. Verify "Phone" is enabled
4. Check Twilio credentials are correct

### Check Environment Variables:
```bash
# Make sure .env.local exists and has correct values
cat .env.local

# Should show:
# EXPO_PUBLIC_SUPABASE_URL=https://djtfefcugrocjkypthcf.supabase.co
# EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### Restart Everything:
```bash
# 1. Stop dev server (Ctrl+C)
# 2. Clear Metro cache
npx expo start --clear

# 3. Rebuild app if needed
# iOS: npx expo run:ios
# Android: npx expo run:android
```

---

## ✅ You're Ready!

Once the anon key is added, the phone authentication will work with:
- ✅ Real OTP via Twilio
- ✅ Auto-detection on Android & iOS
- ✅ User creation in database
- ✅ Beautiful error handling

**Happy coding!** 🚀
