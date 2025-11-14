import { User, AuthCredentials, SignUpPayload, PhoneAuthPayload } from '../types';

export interface AuthService {
  signIn(credentials: AuthCredentials): Promise<User>;
  signUp(payload: SignUpPayload): Promise<User>;
  signInWithPhone(payload: PhoneAuthPayload): Promise<User>;
  sendPasswordReset(email: string): Promise<void>;
  signOut(): Promise<void>;
}

export class MockAuthService implements AuthService {
  async signIn(credentials: AuthCredentials): Promise<User> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock validation
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }

    // Return mock user
    return {
      id: '1',
      email: credentials.email,
      fullName: 'John Doe',
    };
  }

  async signUp(payload: SignUpPayload): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (payload.password !== payload.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    return {
      id: '1',
      email: payload.email,
      fullName: payload.fullName,
    };
  }

  async signInWithPhone(payload: PhoneAuthPayload): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!payload.phone) {
      throw new Error('Phone number is required');
    }

    // If code is provided, validate it (mock)
    if (payload.code && payload.code !== '123456') {
      throw new Error('Invalid verification code');
    }

    return {
      id: '1',
      email: '',
      fullName: 'Phone User',
      phone: payload.phone,
    };
  }

  async sendPasswordReset(email: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!email) {
      throw new Error('Email is required');
    }

    // Mock success
    console.log(`Password reset link sent to ${email}`);
  }

  async signOut(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log('User signed out');
  }
}
