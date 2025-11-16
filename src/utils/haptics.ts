import * as Haptics from 'expo-haptics';

/**
 * Haptics Utility
 * Provides consistent haptic feedback across the app
 */

export const HapticFeedback = {
  /**
   * Light impact - For subtle interactions
   * Use for: Filter pills, tabs, card taps, list item selection
   */
  light: async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },

  /**
   * Medium impact - For standard button presses
   * Use for: Primary buttons, form submissions, item additions
   */
  medium: async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },

  /**
   * Heavy impact - For important or destructive actions
   * Use for: Deletions, errors, critical actions
   */
  heavy: async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  },

  /**
   * Success notification - For successful actions
   * Use for: Item saved, task completed, successful submission
   */
  success: async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },

  /**
   * Warning notification - For warnings
   * Use for: Validation warnings, caution messages
   */
  warning: async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  },

  /**
   * Error notification - For errors
   * Use for: Form errors, failed actions, validation errors
   */
  error: async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  },

  /**
   * Selection - For selection changes
   * Use for: Picker selections, toggle switches
   */
  selection: async () => {
    await Haptics.selectionAsync();
  },
};

/**
 * Haptic Guidelines:
 * 
 * LIGHT IMPACT:
 * - Tab navigation
 * - Filter pill selection
 * - Card taps
 * - List item taps
 * - Back button
 * 
 * MEDIUM IMPACT:
 * - Primary button presses
 * - Form submissions
 * - Item additions
 * - Save actions
 * 
 * HEAVY IMPACT:
 * - Deletions
 * - Important confirmations
 * - Critical actions
 * 
 * SUCCESS NOTIFICATION:
 * - Item added successfully
 * - Save successful
 * - Task completed
 * - Favorite added
 * 
 * WARNING NOTIFICATION:
 * - Validation warnings
 * - Caution messages
 * 
 * ERROR NOTIFICATION:
 * - Form errors
 * - Failed actions
 * - Validation errors
 * 
 * SELECTION:
 * - Picker value changes
 * - Toggle switches
 * - Radio button selections
 */
