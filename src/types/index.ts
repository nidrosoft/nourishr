// Re-export from organized subdirectories for backward compatibility
export * from './models';
export * from './api';

// Keep original exports for backward compatibility
export type { User, UserPreferences } from './models/user';
export type { Meal, ChatMessage } from './models/meal';
export type { AuthCredentials, SignUpPayload, PhoneAuthPayload } from './api/auth';
