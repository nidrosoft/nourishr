import { UserPreferences } from '../types';

export interface UserPreferencesService {
  getPreferences(): Promise<UserPreferences | null>;
  savePreferences(preferences: UserPreferences): Promise<void>;
}

export class MockUserPreferencesService implements UserPreferencesService {
  private preferences: UserPreferences | null = null;

  async getPreferences(): Promise<UserPreferences | null> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return this.preferences;
  }

  async savePreferences(preferences: UserPreferences): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    this.preferences = preferences;
    console.log('Preferences saved:', preferences);
  }
}
