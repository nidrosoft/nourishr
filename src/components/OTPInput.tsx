import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Platform,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { colors, spacing, radius, typography } from '../theme';

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  onChangeText?: (otp: string) => void;
  autoFocus?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  onComplete,
  onChangeText,
  autoFocus = true,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Auto-detect OTP from SMS (Android)
  useEffect(() => {
    if (Platform.OS === 'android') {
      // This will be handled by expo-sms-retriever
      // The SMS format should be: Your Nourishr verification code is: 123456
      const startSMSListener = async () => {
        try {
          const { startOtpListener, removeListener } = await import('expo-sms-retriever');
          
          startOtpListener((message: { message: string }) => {
            // Extract 6-digit code from SMS
            const otpMatch = message.message.match(/\d{6}/);
            if (otpMatch) {
              const detectedOtp = otpMatch[0];
              const otpArray = detectedOtp.split('');
              setOtp(otpArray);
              onComplete(detectedOtp);
              if (onChangeText) {
                onChangeText(detectedOtp);
              }
            }
          });

          return () => {
            removeListener();
          };
        } catch (error) {
          console.log('SMS auto-detect not available:', error);
        }
      };

      startSMSListener();
    }
  }, [length, onComplete, onChangeText]);

  // Auto-detect OTP from clipboard (iOS)
  useEffect(() => {
    if (Platform.OS === 'ios' && autoFocus) {
      // iOS will automatically suggest OTP from SMS
      // We just need to make sure the first input is focused
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus]);

  const handleChangeText = (text: string, index: number) => {
    // Handle paste
    if (text.length > 1) {
      const pastedOtp = text.slice(0, length).split('');
      const newOtp = [...otp];
      pastedOtp.forEach((char, i) => {
        if (index + i < length) {
          newOtp[index + i] = char;
        }
      });
      setOtp(newOtp);
      
      const otpString = newOtp.join('');
      if (onChangeText) {
        onChangeText(otpString);
      }
      
      if (newOtp.every((digit) => digit !== '')) {
        onComplete(otpString);
      } else {
        // Focus next empty field
        const nextEmptyIndex = newOtp.findIndex((digit) => digit === '');
        if (nextEmptyIndex !== -1) {
          inputRefs.current[nextEmptyIndex]?.focus();
        }
      }
      return;
    }

    // Handle single character input
    if (/^\d*$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      const otpString = newOtp.join('');
      if (onChangeText) {
        onChangeText(otpString);
      }

      if (text && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      if (newOtp.every((digit) => digit !== '')) {
        onComplete(otpString);
      }
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        if (onChangeText) {
          onChangeText(newOtp.join(''));
        }
      } else if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        if (onChangeText) {
          onChangeText(newOtp.join(''));
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          style={[
            styles.input,
            focusedIndex === index && styles.inputFocused,
            digit !== '' && styles.inputFilled,
          ]}
          value={digit}
          onChangeText={(text) => handleChangeText(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          onFocus={() => setFocusedIndex(index)}
          keyboardType="number-pad"
          maxLength={1}
          autoFocus={index === 0 && autoFocus}
          selectTextOnFocus
          textContentType="oneTimeCode" // iOS auto-fill
          autoComplete="sms-otp" // Android auto-fill
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    height: 56,
    borderWidth: 2,
    borderColor: colors.line,
    borderRadius: radius.lg,
    backgroundColor: colors.background,
    textAlign: 'center',
    ...typography.h2,
    color: colors.gray100,
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  inputFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
});
