import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { colors, typography, spacing, radius } from '../../theme';
import { NourishrIcon } from '../../components';

const { width, height } = Dimensions.get('window');

type AuthLandingScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'AuthLanding'
>;

interface AuthLandingScreenProps {
  navigation: AuthLandingScreenNavigationProp;
}

export const AuthLandingScreen: React.FC<AuthLandingScreenProps> = ({
  navigation,
}) => {
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    // Play video on mount
    if (videoRef.current) {
      videoRef.current.playAsync();
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* Background Video */}
      <Video
        ref={videoRef}
        source={require('../../../assets/images/nourishlanding.mp4')}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay
        isMuted
      />

      {/* Dark Overlay */}
      <View style={styles.overlay} />

      {/* Content */}
      <View style={styles.content}>
        {/* Spacer for top */}
        <View style={styles.topSpacer} />

        {/* Main Content Container */}
        <View style={styles.mainContent}>
          {/* Logo and Description */}
          <View style={styles.textSection}>
            <MaskedView
              maskElement={
                <Text style={styles.logo}>nourishr.</Text>
              }
            >
              <LinearGradient
                colors={['#FF9500', '#FD6A2F']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.logoGradient}
              >
                <Text style={[styles.logo, { opacity: 0 }]}>nourishr.</Text>
              </LinearGradient>
            </MaskedView>
            <Text style={styles.description}>
              Say goodbye to meal planning stress. Get instant, personalized meal
              suggestions tailored to your taste, ingredients, and mood. Whether
              you're cooking at home or ordering out, we've got you covered.
            </Text>
          </View>

          {/* Auth Buttons */}
          <View style={styles.buttonsSection}>
          {/* Sign up with Phone Number */}
          <TouchableOpacity
            style={styles.phoneButton}
            onPress={() => navigation.navigate('PhoneSignUp')}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#FF9500', '#FD6A2F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.phoneButtonGradient}
            >
              <View style={styles.phoneIconContainer}>
                <NourishrIcon name="Call" size={20} color={colors.white} variant="bold" />
              </View>
              <Text style={styles.phoneButtonText}>Sign up with Phone Number</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Subtitle under phone button */}
          <Text style={styles.phoneSubtitle}>
            ✨ Quick & easy - no hassle, just your phone number
          </Text>

          {/* Divider with "or" */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Continue with Google */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={() => navigation.navigate('SignUp')}
            activeOpacity={0.9}
          >
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Already have an account */}
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Disclaimer */}
          <Text style={styles.disclaimer}>
            By signing up, you agree to our{' '}
            <Text style={styles.disclaimerLink}>Terms</Text>. See how we use your
            data in our <Text style={styles.disclaimerLink}>Privacy Policy</Text>.
          </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'flex-end',
  },
  topSpacer: {
    flex: 1,
  },
  mainContent: {
    paddingBottom: spacing.xl,
  },
  textSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logo: {
    ...typography.headingXL,
    fontSize: 52,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.md,
    textAlign: 'center',
    letterSpacing: -1,
  },
  logoGradient: {
    paddingVertical: 2,
  },
  description: {
    ...typography.body,
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.md,
    opacity: 0.9,
  },
  buttonsSection: {
    gap: spacing.sm,
  },
  phoneButton: {
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  phoneButtonGradient: {
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneIconContainer: {
    marginRight: spacing.sm,
  },
  phoneButtonText: {
    ...typography.bodyMedium,
    color: colors.white,
    fontWeight: '600',
  },
  phoneSubtitle: {
    ...typography.caption,
    color: colors.white,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    opacity: 0.8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    ...typography.body,
    color: colors.white,
    marginHorizontal: spacing.md,
    opacity: 0.7,
  },
  googleButton: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4285F4',
    marginRight: spacing.sm,
  },
  googleButtonText: {
    ...typography.bodyMedium,
    color: colors.black,
    fontWeight: '600',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  signInText: {
    ...typography.body,
    color: colors.white,
    opacity: 0.8,
  },
  signInLink: {
    ...typography.bodyMedium,
    color: colors.white,
    fontWeight: '700',
  },
  disclaimer: {
    ...typography.caption,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.7,
    paddingHorizontal: spacing.sm,
  },
  disclaimerLink: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
