import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { AuthStackParamList, RootStackParamList } from '../../navigation/types';
import { colors, typography, spacing, radius } from '../../theme';
import { NourishrIcon } from '../../components';
import { useApp } from '../../context/AppContext';

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
  const { authService, setIsAuthenticated } = useApp();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [codeSent, setCodeSent] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  
  const codeInputs = useRef<Array<TextInput | null>>([]);

  const isPhoneValid = () => {
    // US/Canada numbers should be 10 digits
    if (selectedCountry.code === '+1') {
      return phoneNumber.length === 10;
    }
    // Other countries: at least 7 digits
    return phoneNumber.length >= 7;
  };

  const handleSendCode = async () => {
    if (isPhoneValid()) {
      try {
        // In a real app, this would call the auth service
        // await authService.signInWithPhone(`${selectedCountry.code}${phoneNumber}`);
        // For now, just move to OTP screen
        setCodeSent(true);
      } catch (error) {
        console.error('Error sending code:', error);
      }
    }
  };

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...verificationCode];
    newCode[index] = text;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (text && index < 5) {
      codeInputs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits entered
    if (newCode.every(digit => digit !== '') && index === 5) {
      handleVerifyCode(newCode.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !verificationCode[index] && index > 0) {
      codeInputs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async (code: string) => {
    try {
      // In a real app, this would verify the code with the auth service
      // await authService.verifyPhone(`${selectedCountry.code}${phoneNumber}`, code);
      
      // For now, simulate successful verification
      // Navigate to Welcome screen to start onboarding flow
      navigation.navigate('Welcome');
    } catch (error) {
      console.error('Error verifying code:', error);
    }
  };

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

            {/* OTP Input */}
            <View style={styles.otpContainer}>
              {verificationCode.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => (codeInputs.current[index] = ref)}
                  style={[
                    styles.otpInput,
                    digit && styles.otpInputFilled,
                  ]}
                  value={digit}
                  onChangeText={text => handleCodeChange(text, index)}
                  onKeyPress={e => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  autoFocus={index === 0}
                />
              ))}
            </View>

            {/* Help Link */}
            <View style={styles.helpContainer}>
              <TouchableOpacity style={styles.helpLink}>
                <Text style={styles.helpText}>Didn't get a code?</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  verificationCode.every(digit => digit !== '') && styles.nextButtonActive,
                ]}
                onPress={() => {
                  if (verificationCode.every(digit => digit !== '')) {
                    handleVerifyCode(verificationCode.join(''));
                  }
                }}
                disabled={!verificationCode.every(digit => digit !== '')}
              >
                <NourishrIcon
                  name="ArrowRight2"
                  size={24}
                  color={verificationCode.every(digit => digit !== '') ? colors.white : colors.gray60}
                />
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
});
