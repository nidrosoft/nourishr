import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, radius } from '../../../../theme';

interface SettingSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const SettingSection: React.FC<SettingSectionProps> = ({ title, subtitle, children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  header: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.black,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.xs / 2,
  },
  subtitle: {
    ...typography.body,
    color: colors.gray60,
    fontSize: 13,
  },
  content: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
});
