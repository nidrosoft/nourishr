import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Debug logging
console.log('=== SUPABASE CONFIG ===');
console.log('URL:', supabaseUrl);
console.log('Anon Key (first 20 chars):', supabaseAnonKey.substring(0, 20) + '...');
console.log('Anon Key length:', supabaseAnonKey.length);
console.log('=======================');

if (!supabaseUrl || !supabaseAnonKey) {
  const error = 'Missing Supabase environment variables. Please check your .env.local file.';
  console.error(error);
  console.error('URL exists:', !!supabaseUrl);
  console.error('Key exists:', !!supabaseAnonKey);
  throw new Error(error);
}

if (supabaseAnonKey === 'your-anon-key-here') {
  const error = 'Please replace "your-anon-key-here" with your actual Supabase anon key in .env.local';
  console.error(error);
  throw new Error(error);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
