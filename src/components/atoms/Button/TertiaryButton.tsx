import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { MaskedView } from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing } from '../../../theme';

interface TertiaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const TertiaryButton: React.FC<TertiaryButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <MaskedView
          maskElement={
            <Text style={[styles.text, textStyle]}>
              {title}
            </Text>
          }
        >
          <LinearGradient
            colors={['#FF9500', '#FD6A2F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={[styles.text, styles.transparentText, textStyle]}>
              {title}
            </Text>
          </LinearGradient>
        </MaskedView>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...typography.button,
    fontSize: 16,
    fontWeight: '600',
  },
  transparentText: {
    opacity: 0, // Hidden but maintains layout
  },
});
