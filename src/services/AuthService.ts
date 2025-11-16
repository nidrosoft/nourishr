import { supabase } from '../config/supabase';
import { User, AuthCredentials, SignUpPayload, PhoneAuthPayload } from '../types';

export interface AuthService {
  signIn(credentials: AuthCredentials): Promise<User>;
  signUp(payload: SignUpPayload): Promise<User>;
  signInWithPhone(payload: PhoneAuthPayload): Promise<User>;
  sendPhoneOTP(phone: string): Promise<void>;
  verifyPhoneOTP(phone: string, otp: string): Promise<User>;
  checkPhoneExists(phone: string): Promise<boolean>;
  sendPasswordReset(email: string): Promise<void>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}

export class SupabaseAuthService implements AuthService {
  /**
   * Check if a phone number is already registered
   */
  async checkPhoneExists(phone: string): Promise<boolean> {
    try {
      // Query the users table to see if this phone number exists
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('phone_number', phone)
        .maybeSingle();

      if (error) {
        console.error('Error checking phone:', error);
        return false;
      }

      return data !== null;
    } catch (error) {
      console.error('Error in checkPhoneExists:', error);
      return false;
    }
  }

  /**
   * Send OTP to phone number via Twilio (configured in Supabase)
   */
  async sendPhoneOTP(phone: string): Promise<void> {
    const { error } = await supabase.auth.signInWithOtp({
      phone,
    });

    if (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Verify OTP and sign in/sign up user
   */
  async verifyPhoneOTP(phone: string, otp: string): Promise<User> {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms',
    });

    if (error) {
      throw this.handleAuthError(error);
    }

    if (!data.user) {
      throw new Error('Authentication failed. Please try again.');
    }

    // Check if user profile exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    // If user doesn't exist, create profile
    if (!existingUser) {
      console.log('Creating new user profile for:', data.user.id);
      const { data: newUser, error: insertError } = await supabase.from('users').insert({
        id: data.user.id,
        phone_number: phone,
        auth_provider: 'phone',
        first_name: '', // Will be filled during onboarding
        date_of_birth: '2000-01-01', // Placeholder, will be updated
        gender: 'Prefer not to say', // Placeholder
        country: 'US', // Placeholder
        onboarding_completed: false,
        onboarding_step: 0,
      }).select().single();

      if (insertError) {
        console.error('Failed to create user profile:', insertError);
        throw new Error(`Failed to create user profile: ${insertError.message}`);
      }
      
      console.log('User profile created successfully:', newUser);
      return this.mapSupabaseUserToUser(data.user, newUser);
    }

    return this.mapSupabaseUserToUser(data.user, existingUser);
  }

  async signIn(credentials: AuthCredentials): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw this.handleAuthError(error);
    }

    if (!data.user) {
      throw new Error('Authentication failed');
    }

    // Get user profile
    const { data: userProfile } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return this.mapSupabaseUserToUser(data.user, userProfile);
  }

  async signUp(payload: SignUpPayload): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
    });

    if (error) {
      throw this.handleAuthError(error);
    }

    if (!data.user) {
      throw new Error('Sign up failed');
    }

    // Create user profile
    const { error: insertError } = await supabase.from('users').insert({
      id: data.user.id,
      email: payload.email,
      first_name: payload.fullName.split(' ')[0] || '',
      last_name: payload.fullName.split(' ').slice(1).join(' ') || null,
      auth_provider: 'email',
      date_of_birth: '2000-01-01', // Placeholder
      gender: 'Prefer not to say', // Placeholder
      country: 'US', // Placeholder
      onboarding_completed: false,
      onboarding_step: 0,
    });

    if (insertError) {
      throw new Error('Failed to create user profile');
    }

    return this.mapSupabaseUserToUser(data.user, null);
  }

  async signInWithPhone(payload: PhoneAuthPayload): Promise<User> {
    if (payload.code) {
      return this.verifyPhoneOTP(payload.phone, payload.code);
    } else {
      await this.sendPhoneOTP(payload.phone);
      throw new Error('OTP_SENT'); // Special error to indicate OTP was sent
    }
  }

  async sendPasswordReset(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      throw this.handleAuthError(error);
    }
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw this.handleAuthError(error);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data: userProfile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    return this.mapSupabaseUserToUser(user, userProfile);
  }

  private mapSupabaseUserToUser(supabaseUser: any, profile: any): User {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || profile?.email || '',
      fullName: profile
        ? `${profile.first_name} ${profile.last_name || ''}`.trim()
        : '',
      phone: supabaseUser.phone || profile?.phone_number,
      onboardingCompleted: profile?.onboarding_completed || false,
      onboardingStep: profile?.onboarding_step || 0,
    };
  }

  private handleAuthError(error: any): Error {
    // Map Supabase errors to user-friendly messages
    const errorMessages: Record<string, string> = {
      'Invalid login credentials': 'Invalid phone number or verification code',
      'User already registered': 'This phone number is already registered',
      'Email not confirmed': 'Please verify your email address',
      'Invalid OTP': 'The verification code is incorrect',
      'OTP expired': 'The verification code has expired. Please request a new one.',
      'Too many requests': 'Too many attempts. Please try again later.',
    };

    const message = errorMessages[error.message] || error.message || 'An error occurred';
    
    const customError = new Error(message);
    (customError as any).code = error.code || 'UNKNOWN_ERROR';
    (customError as any).status = error.status;
    
    return customError;
  }
}

// Export singleton instance
export const authService = new SupabaseAuthService();
