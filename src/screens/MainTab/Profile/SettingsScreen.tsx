import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, radius } from '../../../theme';
import { NourishrIcon } from '../../../components';
import { ProfileStackParamList } from '../../../navigation/types';

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

  const handleItemPress = (item: SettingItem) => {
    if (item.onPress) {
      item.onPress();
    } else if (item.screen) {
      // @ts-ignore - Navigation will be typed properly
      navigation.navigate(item.screen);
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

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Nourishr Version 1.0.0</Text>
        </View>
      </ScrollView>
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
});
