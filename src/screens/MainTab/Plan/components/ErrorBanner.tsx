import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radius } from '../../../../theme';
import { NourishrIcon } from '../../../../components';

type ErrorType = 'no-internet' | 'ai-failed' | 'pantry-failed';

interface ErrorBannerProps {
  type: ErrorType;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ type, onRetry, onDismiss }) => {
  const getErrorConfig = () => {
    switch (type) {
      case 'no-internet':
        return {
          icon: 'WifiSquare' as const,
          title: 'No connection',
          message: 'Showing offline data. Recipes need internet to load.',
          backgroundColor: '#FFF3E0',
          iconColor: '#FF9800',
          showRetry: false,
        };
      case 'ai-failed':
        return {
          icon: 'InfoCircle' as const,
          title: "Couldn't get new ideas",
          message: 'Try again in a moment.',
          backgroundColor: '#E3F2FD',
          iconColor: '#1565C0',
          showRetry: true,
        };
      case 'pantry-failed':
        return {
          icon: 'Warning2' as const,
          title: "Couldn't load your pantry",
          message: 'Please try again.',
          backgroundColor: '#FFE5E5',
          iconColor: '#E63946',
          showRetry: true,
        };
    }
  };

  const config = getErrorConfig();

  return (
    <View style={[styles.banner, { backgroundColor: config.backgroundColor }]}>
      <View style={styles.content}>
        <NourishrIcon name={config.icon} size={20} color={config.iconColor} />
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: config.iconColor }]}>{config.title}</Text>
          <Text style={styles.message}>{config.message}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        {config.showRetry && onRetry && (
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Text style={[styles.retryText, { color: config.iconColor }]}>Try Again</Text>
          </TouchableOpacity>
        )}
        {onDismiss && (
          <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
            <NourishrIcon name="CloseCircle" size={20} color={colors.gray60} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radius.lg,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...typography.bodyMedium,
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 2,
  },
  message: {
    ...typography.caption,
    color: colors.gray70,
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  retryButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  retryText: {
    ...typography.bodyMedium,
    fontWeight: '600',
    fontSize: 13,
  },
  dismissButton: {
    padding: spacing.xs / 2,
  },
});
