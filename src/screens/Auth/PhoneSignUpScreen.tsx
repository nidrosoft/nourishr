import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { AuthStackParamList, RootStackParamList } from '../../navigation/types';
import { colors, typography, spacing, radius } from '../../theme';
import { NourishrIcon, OTPInput, AlertModal } from '../../components';
import { useApp } from '../../context/AppContext';
import { authService } from '../../services/AuthService';

type PhoneSignUpScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<AuthStackParamList, 'PhoneSignUp'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface PhoneSignUpScreenProps {
  navigation: PhoneSignUpScreenNavigationProp;
}

interface Country {
  name: string;
  code: string;
  flag: string;
}

const countries: Country[] = [
  { name: 'United States', code: '+1', flag: '🇺🇸' },
  { name: 'Canada', code: '+1', flag: '🇨🇦' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { name: 'Australia', code: '+61', flag: '🇦🇺' },
  { name: 'Afghanistan', code: '+93', flag: '🇦🇫' },
  { name: 'Albania', code: '+355', flag: '🇦🇱' },
  { name: 'Algeria', code: '+213', flag: '🇩🇿' },
  { name: 'Argentina', code: '+54', flag: '🇦🇷' },
  { name: 'Austria', code: '+43', flag: '🇦🇹' },
  { name: 'Belgium', code: '+32', flag: '🇧🇪' },
  { name: 'Brazil', code: '+55', flag: '🇧🇷' },
  { name: 'Bulgaria', code: '+359', flag: '🇧🇬' },
  { name: 'Chile', code: '+56', flag: '🇨🇱' },
  { name: 'China', code: '+86', flag: '🇨🇳' },
  { name: 'Colombia', code: '+57', flag: '🇨🇴' },
  { name: 'Croatia', code: '+385', flag: '🇭🇷' },
  { name: 'Czech Republic', code: '+420', flag: '🇨🇿' },
  { name: 'Denmark', code: '+45', flag: '🇩🇰' },
  { name: 'Egypt', code: '+20', flag: '🇪🇬' },
  { name: 'Finland', code: '+358', flag: '🇫🇮' },
  { name: 'France', code: '+33', flag: '🇫🇷' },
  { name: 'Germany', code: '+49', flag: '🇩🇪' },
  { name: 'Greece', code: '+30', flag: '🇬🇷' },
  { name: 'Hong Kong', code: '+852', flag: '🇭🇰' },
  { name: 'Hungary', code: '+36', flag: '🇭🇺' },
  { name: 'Iceland', code: '+354', flag: '🇮🇸' },
  { name: 'India', code: '+91', flag: '🇮🇳' },
  { name: 'Indonesia', code: '+62', flag: '🇮🇩' },
  { name: 'Ireland', code: '+353', flag: '🇮🇪' },
  { name: 'Israel', code: '+972', flag: '🇮🇱' },
  { name: 'Italy', code: '+39', flag: '🇮🇹' },
  { name: 'Japan', code: '+81', flag: '🇯🇵' },
  { name: 'Kenya', code: '+254', flag: '🇰🇪' },
  { name: 'Malaysia', code: '+60', flag: '🇲🇾' },
  { name: 'Mexico', code: '+52', flag: '🇲🇽' },
  { name: 'Netherlands', code: '+31', flag: '🇳🇱' },
  { name: 'New Zealand', code: '+64', flag: '🇳🇿' },
  { name: 'Nigeria', code: '+234', flag: '🇳🇬' },
  { name: 'Norway', code: '+47', flag: '🇳🇴' },
  { name: 'Pakistan', code: '+92', flag: '🇵🇰' },
  { name: 'Philippines', code: '+63', flag: '🇵🇭' },
  { name: 'Poland', code: '+48', flag: '🇵🇱' },
  { name: 'Portugal', code: '+351', flag: '🇵🇹' },
  { name: 'Romania', code: '+40', flag: '🇷🇴' },
  { name: 'Russia', code: '+7', flag: '🇷🇺' },
  { name: 'Saudi Arabia', code: '+966', flag: '🇸🇦' },
  { name: 'Singapore', code: '+65', flag: '🇸🇬' },
  { name: 'South Africa', code: '+27', flag: '🇿🇦' },
  { name: 'South Korea', code: '+82', flag: '🇰🇷' },
  { name: 'Spain', code: '+34', flag: '🇪🇸' },
  { name: 'Sweden', code: '+46', flag: '🇸🇪' },
  { name: 'Switzerland', code: '+41', flag: '🇨🇭' },
  { name: 'Taiwan', code: '+886', flag: '🇹🇼' },
  { name: 'Thailand', code: '+66', flag: '🇹🇭' },
  { name: 'Turkey', code: '+90', flag: '🇹🇷' },
  { name: 'Ukraine', code: '+380', flag: '🇺🇦' },
  { name: 'United Arab Emirates', code: '+971', flag: '🇦🇪' },
  { name: 'Vietnam', code: '+84', flag: '🇻🇳' },
];

export const PhoneSignUpScreen: React.FC<PhoneSignUpScreenProps> = ({
  navigation,
}) => {
  const { setIsAuthenticated } = useApp();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: 'error' as 'error' | 'success' | 'warning' | 'info',
    title: '',
    message: '',
  });
  const [otpTimer, setOtpTimer] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  const codeInputs = useRef<Array<TextInput | null>>([]);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  const isPhoneValid = () => {
    // US/Canada numbers should be 10 digits
    if (selectedCountry.code === '+1') {
      return phoneNumber.length === 10;
    }
    // Other countries: at least 7 digits
    return phoneNumber.length >= 7;
  };

  const handleSendCode = async () => {
    if (!isPhoneValid() || loading) return;

    setLoading(true);
    try {
      const fullPhoneNumber = `${selectedCountry.code}${phoneNumber}`;
      console.log('Sending OTP to:', fullPhoneNumber);
      await authService.sendPhoneOTP(fullPhoneNumber);
      console.log('OTP sent successfully');
      setCodeSent(true);
      
      // Start 60-second timer
      setOtpTimer(60);
      setIsTimerActive(true);
      
      // Temporarily disabled modal - just log success
      console.log('SUCCESS: Code sent to', fullPhoneNumber);
    } catch (error: any) {
      // Log full error details to console
      console.error('FULL ERROR:', error);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Error status:', error.status);
      console.error('Error stack:', error.stack);
      
      // Show error in alert (temporarily disabled custom modal)
      alert(`Error: ${error.message}\n\nCode: ${error.code}\n\nFull error logged to console`);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPComplete = async (code: string) => {
    setLoading(true);
    try {
      const fullPhoneNumber = `${selectedCountry.code}${phoneNumber}`;
      const user = await authService.verifyPhoneOTP(fullPhoneNumber, code);
      
      // Check if user needs onboarding
      if (!user.onboardingCompleted) {
        navigation.navigate('Welcome');
      } else {
        setIsAuthenticated(true);
      }
    } catch (error: any) {
      let title = 'Verification Failed';
      let message = 'Please try again';

      // Handle specific error cases
      if (error.message.includes('incorrect')) {
        title = 'Incorrect Code';
        message = 'The verification code you entered is incorrect. Please try again.';
      } else if (error.message.includes('expired')) {
        title = 'Code Expired';
        message = 'Your verification code has expired. Please request a new one.';
        setCodeSent(false);
        setOtp('');
      } else if (error.message.includes('Too many')) {
        title = 'Too Many Attempts';
        message = 'You\'ve made too many attempts. Please wait a few minutes and try again.';
      } else {
        message = error.message || 'An error occurred during verification';
      }

      setAlertConfig({
        type: 'error',
        title,
        message,
      });
      setAlertVisible(true);
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setOtp('');
    // Clear timer
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    setIsTimerActive(false);
    await handleSendCode();
  };

  // Timer countdown effect
  useEffect(() => {
    if (isTimerActive && otpTimer > 0) {
      timerInterval.current = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            setIsTimerActive(false);
            if (timerInterval.current) {
              clearInterval(timerInterval.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [isTimerActive, otpTimer]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <NourishrIcon name="CloseSquare" size={24} color={colors.black} />
        </TouchableOpacity>
        <View style={styles.phoneIconContainer}>
          <View style={styles.headerIconCircle}>
            <NourishrIcon 
              name={codeSent ? "ShieldTick" : "Call"} 
              size={24} 
              color={colors.black} 
              variant="bold" 
            />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {!codeSent ? (
          <>
            {/* Title */}
            <Text style={styles.title}>What's your phone number?</Text>

            {/* Phone Input */}
            <View style={styles.phoneInputContainer}>
              <TouchableOpacity
                style={styles.countrySelector}
                onPress={() => setShowCountryPicker(true)}
              >
                <Text style={styles.flag}>{selectedCountry.flag}</Text>
                <Text style={styles.countryCode}>{selectedCountry.code}</Text>
                <NourishrIcon name="ArrowDown2" size={16} color={colors.black} />
              </TouchableOpacity>
              
              <TextInput
                style={styles.phoneInput}
                placeholder=""
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={15}
                autoFocus
              />
            </View>

            {/* Disclaimer */}
            <Text style={styles.disclaimer}>
              Nourishr will send you a text with a verification code. Message and data rates may apply.
            </Text>

            {/* Help Link */}
            <View style={styles.helpContainer}>
              <TouchableOpacity style={styles.helpLink}>
                <Text style={styles.helpText}>What if my number changes?</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  isPhoneValid() && styles.nextButtonActive,
                ]}
                onPress={handleSendCode}
                disabled={!isPhoneValid()}
              >
                <NourishrIcon
                  name="ArrowRight2"
                  size={24}
                  color={isPhoneValid() ? colors.white : colors.gray60}
                />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {/* Title */}
            <Text style={styles.title}>Enter your verification code</Text>

            {/* Phone Display */}
            <View style={styles.phoneDisplay}>
              <Text style={styles.sentTo}>
                Sent to {selectedCountry.code} {phoneNumber}
              </Text>
              <TouchableOpacity onPress={() => setCodeSent(false)}>
                <Text style={styles.editButton}>Edit</Text>
              </TouchableOpacity>
            </View>

            {/* OTP Input with Auto-Detection */}
            <OTPInput
              length={6}
              onComplete={handleOTPComplete}
              onChangeText={setOtp}
              autoFocus
            />

            {/* Timer Display */}
            {isTimerActive && otpTimer > 0 && (
              <View style={styles.timerContainer}>
                <NourishrIcon name="Clock" size={16} color={colors.gray60} />
                <Text style={styles.timerText}>
                  Code expires in {otpTimer}s
                </Text>
              </View>
            )}

            {otpTimer === 0 && (
              <View style={styles.timerContainer}>
                <Text style={styles.expiredText}>Code expired</Text>
              </View>
            )}

            {/* Help Link */}
            <View style={styles.helpContainer}>
              <TouchableOpacity style={styles.helpLink} onPress={handleResendCode}>
                <Text style={styles.helpText}>Resend Code</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      {/* Country Picker Modal */}
      <Modal
        visible={showCountryPicker}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Country</Text>
            <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
              <NourishrIcon name="CloseCircle" size={24} color={colors.black} />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {countries.map((country) => (
              <TouchableOpacity
                key={country.code + country.name}
                style={styles.countryItem}
                onPress={() => {
                  setSelectedCountry(country);
                  setShowCountryPicker(false);
                }}
              >
                <Text style={styles.countryName}>{country.name}</Text>
                <View style={styles.countryRight}>
                  <Text style={styles.countryFlag}>{country.flag}</Text>
                  <Text style={styles.countryCodeText}>{country.code}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Alert Modal for Errors */}
      <AlertModal
        visible={alertVisible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertVisible(false)}
      />

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: spacing.lg,
    padding: spacing.sm,
    zIndex: 10,
  },
  phoneIconContainer: {
    marginTop: spacing.xl,
  },
  headerIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.black,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.headingXL,
    fontSize: 36,
    fontWeight: '700',
    color: colors.black,
    marginBottom: spacing.xl,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: colors.black,
    paddingBottom: spacing.sm,
    marginBottom: spacing.md,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingRight: spacing.md,
    borderRightWidth: 1,
    borderRightColor: colors.gray30,
    marginRight: spacing.md,
  },
  flag: {
    fontSize: 24,
  },
  countryCode: {
    ...typography.headingM,
    color: colors.black,
  },
  phoneInput: {
    ...typography.headingM,
    flex: 1,
    color: colors.black,
    padding: 0,
  },
  disclaimer: {
    ...typography.caption,
    color: colors.gray60,
    lineHeight: 18,
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    paddingVertical: spacing.lg,
  },
  helpLink: {
    flex: 1,
  },
  helpText: {
    ...typography.bodyMedium,
    color: colors.darkBlue,
  },
  nextButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.gray20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonActive: {
    backgroundColor: colors.black,
  },
  nextButtonPlaceholder: {
    width: 56,
    height: 56,
  },
  phoneDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  sentTo: {
    ...typography.body,
    color: colors.gray60,
  },
  editButton: {
    ...typography.bodyMedium,
    color: colors.darkBlue,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  otpInput: {
    flex: 1,
    height: 56,
    borderBottomWidth: 2,
    borderBottomColor: colors.gray30,
    ...typography.headingL,
    textAlign: 'center',
    color: colors.black,
  },
  otpInputFilled: {
    borderBottomColor: colors.black,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  modalTitle: {
    ...typography.headingM,
    color: colors.black,
  },
  countryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  countryName: {
    ...typography.body,
    color: colors.black,
  },
  countryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  countryFlag: {
    fontSize: 24,
  },
  countryCodeText: {
    ...typography.body,
    color: colors.gray70,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  timerText: {
    ...typography.caption,
    color: colors.gray60,
    marginLeft: 4,
  },
  expiredText: {
    ...typography.caption,
    color: colors.error,
    fontWeight: '600',
  },
});
