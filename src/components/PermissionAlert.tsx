import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { colors, typography, spacing, radius } from '../theme';
import { NourishrIcon } from './NourishrIcon';
import { PrimaryButton } from './PrimaryButton';

const { width } = Dimensions.get('window');

interface PermissionAlertProps {
  visible: boolean;
  icon: string;
  title: string;
  message: string;
  allowText?: string;
  denyText?: string;
  onAllow: () => void;
  onDeny: () => void;
}

export const PermissionAlert: React.FC<PermissionAlertProps> = ({
  visible,
  icon,
  title,
  message,
  allowText = 'Allow',
  denyText = 'Deny',
  onAllow,
  onDeny,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDeny}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          {/* Icon Circle - Top Right */}
          <View style={styles.iconCircle}>
            <NourishrIcon name={icon as any} size={28} color={colors.primary} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {/* Primary Action - Allow Button */}
            <PrimaryButton
              title={allowText}
              onPress={onAllow}
            />

            {/* Secondary Action - Deny Text */}
            <TouchableOpacity onPress={onDeny} style={styles.denyButton}>
              <Text style={styles.denyText}>{denyText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  alertContainer: {
    width: width - spacing.lg * 2,
    maxWidth: 400,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconCircle: {
    position: 'absolute',
    top: -20,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  content: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.headingM,
    fontSize: 20,
    fontWeight: '700',
    color: colors.black,
    marginBottom: spacing.sm,
  },
  message: {
    ...typography.body,
    fontSize: 15,
    color: colors.gray70,
    lineHeight: 22,
  },
  buttonContainer: {
    gap: spacing.md,
  },
  denyButton: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  denyText: {
    ...typography.bodyMedium,
    fontSize: 16,
    color: colors.gray60,
  },
});
