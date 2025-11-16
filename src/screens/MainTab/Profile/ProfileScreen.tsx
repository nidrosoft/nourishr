import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, radius } from '../../../theme';
import { NourishrIcon } from '../../../components';
import { useApp } from '../../../context/AppContext';
import { MainTabParamList } from '../../../navigation/types';
import { isSmallDevice } from '../../../utils/responsive';

type ProfileScreenProps = {
  navigation: BottomTabNavigationProp<MainTabParamList, 'Profile'>;
};

interface MenuItemProps {
  icon: string;
  title: string;
  onPress: () => void;
  showChevron?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  onPress,
  showChevron = true,
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.iconWrapper}>
      <NourishrIcon 
        name={icon as any} 
        size={24} 
        color={colors.black}
      />
    </View>
    <Text style={styles.menuItemText}>{title}</Text>
    {showChevron && (
      <NourishrIcon name="ArrowRight2" size={20} color={colors.gray40} />
    )}
  </TouchableOpacity>
);

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, signOut } = useApp();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  const handleEditPreferences = () => {
    Alert.alert('Coming Soon', 'Edit preferences will be available soon!');
  };

  const handleAccountSecurity = () => {
    Alert.alert('Coming Soon', 'Account settings will be available soon!');
  };

  const handleAbout = () => {
    Alert.alert(
      'About Nourishr',
      'Nourishr is your AI-powered meal assistant.\n\nVersion 1.0.0'
    );
  };

  const getInitials = () => {
    if (!user?.fullName) return 'U';
    return user.fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSettings = () => {
    // @ts-ignore - Navigation will be typed properly
    navigation.navigate('Settings');
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
          <View style={styles.topBar}>
            <Text style={styles.topBarTitle}>Profile</Text>
            <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
              <NourishrIcon name="Setting2" size={24} color={colors.white} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>
          <Text style={styles.name}>{user?.fullName || 'User'}</Text>
          <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.menuContainer}>
            <MenuItem
              icon="Setting2"
              title="Edit preferences"
              onPress={handleEditPreferences}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuContainer}>
            <MenuItem
              icon="Lock"
              title="Account & security"
              onPress={handleAccountSecurity}
            />
            <MenuItem
              icon="InfoCircle"
              title="About Nourishr"
              onPress={handleAbout}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.menuContainer}>
            <MenuItem
              icon="Logout"
              title="Sign out"
              onPress={handleSignOut}
              showChevron={false}
            />
          </View>
        </View>

        <Text style={styles.version}>Version 1.0.0</Text>
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
  scrollView: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  topBarTitle: {
    ...typography.headingM,
    color: colors.white,
    fontWeight: '700',
  },
  settingsButton: {
    width: isSmallDevice ? 36 : 40,
    height: isSmallDevice ? 36 : 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  avatar: {
    width: isSmallDevice ? 70 : 80,
    height: isSmallDevice ? 70 : 80,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    ...typography.headingL,
    color: colors.white,
  },
  name: {
    ...typography.headingM,
    color: colors.black,
    marginBottom: spacing.xs,
  },
  email: {
    ...typography.body,
    color: colors.gray60,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.bodyMedium,
    color: colors.gray60,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    fontSize: isSmallDevice ? 11 : 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  menuContainer: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: isSmallDevice ? spacing.md : spacing.lg,
  },
  iconWrapper: {
    marginRight: isSmallDevice ? 12 : 16,
  },
  menuItemText: {
    ...typography.body,
    color: colors.black,
    fontWeight: '500',
    flex: 1,
  },
  version: {
    ...typography.caption,
    color: colors.gray60,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});
