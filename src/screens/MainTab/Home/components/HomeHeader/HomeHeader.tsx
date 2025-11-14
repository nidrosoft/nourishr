import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius } from '../../../../../theme';
import { NourishrIcon } from '../../../../../components';

interface HomeHeaderProps {
  userName?: string;
  greeting?: string;
  onNotificationPress: () => void;
  onSearchPress: () => void;
  notificationCount?: number;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  userName = 'Cyriac',
  greeting = 'Good morning',
  onNotificationPress,
  onSearchPress,
  notificationCount = 0,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={['#FF9500', '#FD6A2F']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradientHeader, { paddingTop: insets.top }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarEmoji}>👨‍🍳</Text>
          </View>
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingSmall}>{greeting}</Text>
            <Text style={styles.greetingName}>{userName}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton} onPress={onNotificationPress}>
          <NourishrIcon name="Notification" size={20} color={colors.black} />
          {notificationCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Greeting Message */}
      <View style={styles.greetingMessageContainer}>
        <Text style={styles.greetingMessageTitle}>Feeling hungry?</Text>
        <Text style={styles.greetingMessageSubtitle}>
          What are we cooking or ordering today?
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.searchWrapper} onPress={onSearchPress} activeOpacity={0.7}>
          <NourishrIcon name="SearchNormal" size={20} color={colors.gray60} style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Search meals, cuisines, restaurants…</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientHeader: {
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    paddingBottom: spacing.sm,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarEmoji: {
    fontSize: 28,
  },
  greetingContainer: {
    flex: 1,
  },
  greetingSmall: {
    ...typography.caption,
    fontSize: 14,
    color: colors.black,
    marginBottom: 2,
    fontWeight: '500',
  },
  greetingName: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.white,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#10B981',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: colors.white,
  },
  notificationBadgeText: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
  },
  greetingMessageContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  greetingMessageTitle: {
    fontSize: 25,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  greetingMessageSubtitle: {
    ...typography.body,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchPlaceholder: {
    ...typography.body,
    fontSize: 15,
    color: colors.gray60,
    flex: 1,
  },
});
