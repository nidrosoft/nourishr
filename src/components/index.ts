// Export from organized structure
export * from './atoms';
export * from './molecules';
export * from './organisms';

// Keep backward compatibility - export from old locations
export * from './Badge';
export * from './NourishrIcon';
// PrimaryButton, SecondaryButton, TertiaryButton exported from ./atoms
export * from './TextField';
export * from './CategoryChip';
export * from './MealCard';
export * from './PreferenceHeader';
export * from './PermissionAlert';
export { MealCard } from './MealCard';
export { PreferenceHeader } from './PreferenceHeader';
export { PermissionAlert } from './PermissionAlert';
export { Badge } from './Badge';
export type { BadgeType } from './Badge';

// Platform-specific components
export { PlatformButton } from './PlatformButton';
export { PlatformSegmentedControl } from './PlatformSegmentedControl';

// Auth components
export { AlertModal } from './AlertModal';
export type { AlertModalProps } from './AlertModal';
export { OTPInput } from './OTPInput';
