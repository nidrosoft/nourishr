import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Modal, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, radius } from '../../../theme';
import { NourishrIcon } from '../../../components';
import { ProfileStackParamList } from '../../../navigation/types';
import { supabase } from '../../../config/supabase';
import { useApp } from '../../../context/AppContext';

type SettingsScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'Settings'>;

interface SettingItem {
  id: string;
  icon: string;
  title: string;
  subtitle?: string;
  screen?: keyof ProfileStackParamList;
  onPress?: () => void;
}

interface SettingCategory {
  id: string;
  title: string;
  items: SettingItem[];
}

const SETTINGS_DATA: SettingCategory[] = [
  {
    id: 'account',
    title: 'Account Settings',
    items: [
      {
        id: 'profile',
        icon: 'User',
        title: 'Account Information',
        screen: 'AccountInformation',
      },
      {
        id: 'password',
        icon: 'Lock',
        title: 'Change Password',
        screen: 'ChangePassword',
      },
      {
        id: 'device',
        icon: 'Mobile',
        title: 'Device',
        screen: 'DeviceSettings',
      },
    ],
  },
  {
    id: 'preferences',
    title: 'Preferences',
    items: [
      {
        id: 'notifications',
        icon: 'Notification',
        title: 'Notification Settings',
        screen: 'NotificationSettings',
      },
      {
        id: 'dietary',
        icon: 'Heart',
        title: 'Dietary Preferences & Allergies',
        screen: 'DietaryPreferences',
      },
      {
        id: 'meal-rotation',
        icon: 'Refresh',
        title: 'Meal Rotation & Frequency',
        screen: 'MealRotation',
      },
      {
        id: 'ai-assistant',
        icon: 'MessageText',
        title: 'AI Assistant & Voice',
        screen: 'AIAssistant',
      },
      {
        id: 'calorie-scanner',
        icon: 'Scan',
        title: 'Calorie Scanner & Nutrition',
        screen: 'CalorieScanner',
      },
    ],
  },
  {
    id: 'subscription',
    title: 'Subscription & Billing',
    items: [
      {
        id: 'subscription',
        icon: 'TicketStar',
        title: 'Manage Subscription',
        screen: 'ManageSubscription',
      },
      {
        id: 'billing',
        icon: 'Wallet',
        title: 'Billing Details',
        screen: 'BillingDetails',
      },
    ],
  },
  {
    id: 'general',
    title: 'General Settings',
    items: [
      {
        id: 'language',
        icon: 'Global',
        title: 'Language',
        screen: 'LanguageSettings',
      },
      {
        id: 'theme',
        icon: 'Moon',
        title: 'Theme',
        screen: 'ThemeSettings',
      },
    ],
  },
  {
    id: 'support',
    title: 'Support & About',
    items: [
      {
        id: 'help',
        icon: 'InfoCircle',
        title: 'Help & Support',
        screen: 'HelpCenter',
      },
      {
        id: 'privacy',
        icon: 'ShieldTick',
        title: 'Privacy Policy',
        screen: 'PrivacyPolicy',
      },
      {
        id: 'terms',
        icon: 'DocumentText',
        title: 'Terms of Service',
        screen: 'TermsOfService',
      },
    ],
  },
];

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { setIsAuthenticated } = useApp();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleItemPress = (item: SettingItem) => {
    if (item.onPress) {
      item.onPress();
    } else if (item.screen) {
      // @ts-ignore - Navigation will be typed properly
      navigation.navigate(item.screen);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Alert.alert('Error', 'No user found');
        setIsDeleting(false);
        return;
      }

      // Delete user preferences first
      const { error: prefsError } = await supabase
        .from('user_preferences')
        .delete()
        .eq('user_id', user.id);

      if (prefsError) {
        console.error('Error deleting preferences:', prefsError);
      }

      // Delete user profile
      const { error: profileError } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id);

      if (profileError) {
        console.error('Error deleting profile:', profileError);
      }

      // Sign out (this clears the session)
      await supabase.auth.signOut();
      
      // Reset app state
      setIsAuthenticated(false);
      setShowDeleteModal(false);
      setIsDeleting(false);

      Alert.alert(
        'Account Deleted',
        'Your account data has been deleted. You can create a new account anytime.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      console.error('Delete account error:', error);
      setIsDeleting(false);
      Alert.alert(
        'Error',
        'Failed to delete account. Please try again or contact support.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Gradient Header */}
      <LinearGradient
        colors={['#FF9500', '#FD6A2F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientHeader}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <NourishrIcon name="ArrowLeft" size={24} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Settings</Text>
            <View style={styles.headerRight} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Settings Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {SETTINGS_DATA.map((category) => (
          <View key={category.id} style={styles.categoryContainer}>
            {/* Category Title */}
            <Text style={styles.categoryTitle}>{category.title}</Text>
            
            {/* Category Items */}
            <View style={styles.categoryCard}>
              {category.items.map((item, index) => (
                <React.Fragment key={item.id}>
                  <TouchableOpacity
                    style={styles.settingItem}
                    onPress={() => handleItemPress(item)}
                    activeOpacity={0.7}
                  >
                    {/* Icon with wrapper for spacing */}
                    <View style={styles.iconWrapper}>
                      <NourishrIcon 
                        name={item.icon as any} 
                        size={24} 
                        color={colors.black}
                      />
                    </View>
                    
                    {/* Content */}
                    <View style={styles.settingContent}>
                      <Text style={styles.settingTitle}>{item.title}</Text>
                    </View>
                    
                    {/* Arrow */}
                    <NourishrIcon 
                      name="ArrowRight2" 
                      size={20} 
                      color={colors.gray40} 
                    />
                  </TouchableOpacity>
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}

        {/* Delete Account Section */}
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>Danger Zone</Text>
          
          <View style={styles.categoryCard}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => setShowDeleteModal(true)}
              activeOpacity={0.7}
            >
              <View style={styles.iconWrapper}>
                <NourishrIcon 
                  name="Trash" 
                  size={24} 
                  color={colors.error}
                />
              </View>
              
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, styles.deleteText]}>Delete Account</Text>
                <Text style={styles.deleteSubtitle}>Permanently delete your account and all data</Text>
              </View>
              
              <NourishrIcon 
                name="ArrowRight2" 
                size={20} 
                color={colors.gray40} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Nourishr Version 1.0.0</Text>
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => !isDeleting && setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconContainer}>
                <NourishrIcon name="Trash" size={32} color={colors.error} />
              </View>
              <Text style={styles.modalTitle}>Delete Account?</Text>
              <Text style={styles.modalMessage}>
                This action cannot be undone. All your data including:
              </Text>
              <View style={styles.dataList}>
                <Text style={styles.dataItem}>• Personal information</Text>
                <Text style={styles.dataItem}>• Dietary preferences</Text>
                <Text style={styles.dataItem}>• Saved recipes and meal plans</Text>
                <Text style={styles.dataItem}>• Account history</Text>
              </View>
              <Text style={styles.modalWarning}>
                will be permanently deleted.
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.deleteButtonText}>Delete Forever</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradientHeader: {
    paddingBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.headingM,
    color: colors.white,
    fontWeight: '700',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: spacing.lg,
  },
  categoryContainer: {
    marginBottom: spacing.xl,
  },
  categoryTitle: {
    ...typography.bodyMedium,
    color: colors.gray60,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  categoryCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  iconWrapper: {
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    ...typography.body,
    color: colors.black,
    fontWeight: '500',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  versionText: {
    ...typography.caption,
    color: colors.gray40,
  },
  deleteText: {
    color: colors.error,
  },
  deleteSubtitle: {
    ...typography.caption,
    color: colors.gray60,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  modalHeader: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    ...typography.headingM,
    color: colors.black,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  modalMessage: {
    ...typography.body,
    color: colors.gray70,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  dataList: {
    alignSelf: 'stretch',
    marginVertical: spacing.md,
  },
  dataItem: {
    ...typography.body,
    color: colors.gray70,
    marginBottom: spacing.xs,
  },
  modalWarning: {
    ...typography.body,
    color: colors.gray70,
    textAlign: 'center',
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.gray20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderRightWidth: 1,
    borderRightColor: colors.gray20,
  },
  cancelButtonText: {
    ...typography.bodyMedium,
    color: colors.gray70,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  deleteButtonText: {
    ...typography.bodyMedium,
    color: colors.white,
    fontWeight: '700',
  },
});
