import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, typography, spacing, radius } from '../theme';
import { NourishrIcon } from './NourishrIcon';

const { width } = Dimensions.get('window');

export interface AlertModalProps {
  visible: boolean;
  type: 'error' | 'success' | 'warning' | 'info';
  title: string;
  message: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
  onClose: () => void;
}

const ALERT_ICONS = {
  error: 'AlertCircle',
  success: 'CheckCircle',
  warning: 'AlertTriangle',
  info: 'Info',
};

const getAlertColor = (type: 'error' | 'success' | 'warning' | 'info') => {
  const ALERT_COLORS = {
    error: colors.error,
    success: colors.success,
    warning: colors.warning,
    info: colors.primary,
  };
  return ALERT_COLORS[type];
};

export const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  type,
  title,
  message,
  primaryButtonText = 'OK',
  secondaryButtonText,
  onPrimaryPress,
  onSecondaryPress,
  onClose,
}) => {
  const iconName = ALERT_ICONS[type];
  const iconColor = getAlertColor(type);

  const handlePrimaryPress = () => {
    if (onPrimaryPress) {
      onPrimaryPress();
    }
    onClose();
  };

  const handleSecondaryPress = () => {
    if (onSecondaryPress) {
      onSecondaryPress();
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView intensity={20} style={styles.backdrop}>
        <TouchableOpacity
          style={styles.backdropTouchable}
          activeOpacity={1}
          onPress={onClose}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.modalContent}>
                {/* Icon */}
                <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
                  <NourishrIcon name={iconName} size={48} color={iconColor} />
                </View>

                {/* Title */}
                <Text style={styles.title}>{title}</Text>

                {/* Message */}
                <Text style={styles.message}>{message}</Text>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                  {secondaryButtonText && (
                    <TouchableOpacity
                      style={[styles.button, styles.secondaryButton]}
                      onPress={handleSecondaryPress}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.secondaryButtonText}>
                        {secondaryButtonText}
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.primaryButton,
                      { backgroundColor: iconColor },
                      secondaryButtonText && styles.buttonHalf,
                    ]}
                    onPress={handlePrimaryPress}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.primaryButtonText}>{primaryButtonText}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width - spacing.xl * 2,
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h3,
    color: colors.gray100,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    color: colors.gray70,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonHalf: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.line,
  },
  primaryButtonText: {
    ...typography.buttonText,
    color: colors.white,
  },
  secondaryButtonText: {
    ...typography.buttonText,
    color: colors.gray100,
  },
});
