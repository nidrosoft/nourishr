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

type SignInScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<AuthStackParamList, 'SignIn'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface SignInScreenProps {
  navigation: SignInScreenNavigationProp;
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
  { name: 'India', code: '+91', flag: '🇮🇳' },
  { name: 'Germany', code: '+49', flag: '🇩🇪' },
  { name: 'France', code: '+33', flag: '🇫🇷' },
  { name: 'Japan', code: '+81', flag: '🇯🇵' },
  { name: 'Mexico', code: '+52', flag: '🇲🇽' },
  { name: 'Brazil', code: '+55', flag: '🇧🇷' },
];

export const SignInScreen: React.FC<SignInScreenProps> = ({
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
    if (selectedCountry.code === '+1') {
      return phoneNumber.length === 10;
    }
    return phoneNumber.length >= 7;
  };

  const handleSendCode = async () => {
    if (!isPhoneValid() || loading) return;

    setLoading(true);
    try {
      const fullPhoneNumber = `${selectedCountry.code}${phoneNumber}`;
      
      // Check if phone number exists in the system
      const phoneExists = await authService.checkPhoneExists(fullPhoneNumber);
      
      if (!phoneExists) {
        // Phone number not found - show error
        setAlertConfig({
          type: 'error',
          title: 'Account Not Found',
          message: `We couldn't find an account with this phone number. Please sign up to create a new account.`,
        });
        setAlertVisible(true);
        setLoading(false);
        return;
      }
      
      // Phone exists, send OTP
      console.log('Sending OTP to:', fullPhoneNumber);
      await authService.sendPhoneOTP(fullPhoneNumber);
      console.log('OTP sent successfully');
      setCodeSent(true);
      
      // Start 60-second timer
      setOtpTimer(60);
      setIsTimerActive(true);
      
      console.log('SUCCESS: Code sent to', fullPhoneNumber);
    } catch (error: any) {
      console.error('FULL ERROR:', error);
      setAlertConfig({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to send verification code. Please try again.',
      });
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPComplete = async (code: string) => {
    setLoading(true);
    try {
      const fullPhoneNumber = `${selectedCountry.code}${phoneNumber}`;
      const user = await authService.verifyPhoneOTP(fullPhoneNumber, code);
      
      // Check if user needs to complete onboarding
      if (!user.onboardingCompleted) {
        // Resume onboarding from where they left off
        const step = user.onboardingStep || 1;
        console.log(`Resuming onboarding at step ${step}`);
        
        // Navigate to the appropriate onboarding screen
        if (step === 1) {
          navigation.navigate('PreferenceIdentity');
        } else if (step === 2) {
          navigation.navigate('PreferenceHousehold');
        } else if (step === 3) {
          navigation.navigate('PreferenceDiet');
        } else if (step === 4) {
          navigation.navigate('PreferenceAllergiesIntolerances');
        } else if (step === 5) {
          navigation.navigate('PreferenceDislikes');
        } else if (step === 6) {
          navigation.navigate('PreferenceLoves');
        } else if (step === 7) {
          navigation.navigate('PreferenceCookingStyle');
        } else if (step === 8) {
          navigation.navigate('PreferenceLifestyle');
        } else if (step === 9) {
          navigation.navigate('PreferenceLocation');
        } else if (step === 10) {
          navigation.navigate('PreferenceSummary');
        } else {
          navigation.navigate('Welcome');
        }
      } else {
        // User has completed onboarding, go to main app
        setIsAuthenticated(true);
      }
    } catch (error: any) {
      let title = 'Verification Failed';
      let message = 'Please try again';

      if (error.message.includes('incorrect')) {
        title = 'Incorrect Code';
        message = 'The verification code you entered is incorrect. Please try again.';
      } else if (error.message.includes('expired')) {
        title = 'Code Expired';
        message = 'Your verification code has expired. Please request a new one.';
        setCodeSent(false);
        setOtp('');
      }

      setAlertConfig({ type: 'error', title, message });
      setAlertVisible(true);
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
          onPress={() => navigation.navigate('Landing')}
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
            <Text style={styles.title}>Let's get you back in</Text>

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
              We'll send you a verification code to confirm it's you.
            </Text>

            {/* Help Link */}
            <View style={styles.helpContainer}>
              <View style={styles.helpLink} />
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
              <NourishrIcon name="CloseSquare" size={24} color={colors.black} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.countryList}>
            {countries.map((country) => (
              <TouchableOpacity
                key={country.code + country.name}
                style={styles.countryItem}
                onPress={() => {
                  setSelectedCountry(country);
                  setShowCountryPicker(false);
                }}
              >
                <Text style={styles.countryFlag}>{country.flag}</Text>
                <Text style={styles.countryName}>{country.name}</Text>
                <Text style={styles.countryCodeText}>{country.code}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Alert Modal */}
      <AlertModal
        visible={alertVisible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertVisible(false)}
      />
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
  subtitle: {
    ...typography.body,
    color: colors.gray70,
    marginBottom: spacing.xl,
    textAlign: 'center',
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
  countryList: {
    flex: 1,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  countryFlag: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  countryName: {
    flex: 1,
    ...typography.body,
    color: colors.black,
  },
  countryCodeText: {
    ...typography.body,
    color: colors.gray70,
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
