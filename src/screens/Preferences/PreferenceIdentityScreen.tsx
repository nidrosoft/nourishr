import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, TextInput, KeyboardAvoidingView, Keyboard, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, typography, spacing, radius } from '../../theme';
import { TextField, PrimaryButton, PreferenceHeader, NourishrIcon } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { preferencesService } from '../../services';

type PreferenceIdentityScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PreferenceIdentity'>;

interface PreferenceIdentityScreenProps {
  navigation: PreferenceIdentityScreenNavigationProp;
}

const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

const ALL_COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
  'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
  'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
  'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt',
  'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon',
  'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
  'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
  'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kosovo', 'Kuwait', 'Kyrgyzstan',
  'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar',
  'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia',
  'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal',
  'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan',
  'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar',
  'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia',
  'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa',
  'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan',
  'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan',
  'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City',
  'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

export const PreferenceIdentityScreen: React.FC<PreferenceIdentityScreenProps> = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return ALL_COUNTRIES.slice(0, 10); // Show top 10 by default
    return ALL_COUNTRIES.filter(country => 
      country.toLowerCase().includes(countrySearch.toLowerCase())
    ).slice(0, 10); // Limit to 10 suggestions
  }, [countrySearch]);

  // Email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Calculate age from date of birth
  const calculatedAge = useMemo(() => {
    if (!dateOfBirth) return null;
    
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }, [dateOfBirth]);

  // Format date for display
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Validation
  const isValid = firstName.trim().length > 0 && email.trim().length > 0 && isValidEmail(email) && dateOfBirth !== null && calculatedAge !== null && calculatedAge >= 13 && selectedGender !== null && selectedCountry !== null;

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  const handleNext = async () => {
    if (!isValid || !dateOfBirth || !selectedGender || !selectedCountry) return;

    setLoading(true);
    try {
      // Save identity data to database
      await preferencesService.saveIdentity({
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        email: email.trim(),
        dateOfBirth: dateOfBirth.toISOString().split('T')[0], // YYYY-MM-DD format
        gender: selectedGender,
        country: selectedCountry,
      });

      console.log('Identity saved, navigating to household screen');
      navigation.navigate('PreferenceHousehold', { gender: selectedGender });
    } catch (error: any) {
      console.error('Failed to save identity:', error);
      alert(`Failed to save: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <PreferenceHeader
        currentStep={1}
        totalSteps={10}
        icon="Profile"
        onClose={() => navigation.goBack()}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
        <Text style={styles.title}>Tell Us About You</Text>
        <Text style={styles.subtitle}>
          Let's start with the basics so we can personalize your experience
        </Text>

        {/* First Name */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>
            First Name <Text style={styles.required}>*</Text>
          </Text>
          <TextField
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter your first name"
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>

        {/* Last Name */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>
            Last Name <Text style={styles.optional}>(Optional)</Text>
          </Text>
          <TextField
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter your last name"
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>

        {/* Email Address */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>
            Email Address <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.fieldHint}>
            Required for account recovery and notifications
          </Text>
          <TextField
            value={email}
            onChangeText={setEmail}
            placeholder="your.email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
          />
          {email.trim().length > 0 && !isValidEmail(email) && (
            <Text style={styles.errorText}>Please enter a valid email address</Text>
          )}
        </View>

        {/* Date of Birth */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>
            Date of Birth <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[styles.datePickerText, !dateOfBirth && styles.datePickerPlaceholder]}>
              {dateOfBirth ? formatDate(dateOfBirth) : 'Select your date of birth'}
            </Text>
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth || new Date(2000, 0, 1)}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()}
              minimumDate={new Date(1900, 0, 1)}
            />
          )}

          {Platform.OS === 'ios' && showDatePicker && (
            <View style={styles.datePickerActions}>
              <TouchableOpacity
                style={styles.datePickerActionButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.datePickerActionText}>Done</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Age Display */}
        {calculatedAge !== null && (
          <View style={styles.ageContainer}>
            <View style={styles.ageCard}>
              <Text style={styles.ageLabel}>Your Age</Text>
              <Text style={styles.ageValue}>{calculatedAge} years old</Text>
              {calculatedAge < 13 && (
                <Text style={styles.ageWarning}>
                  You must be at least 13 years old to use Nourishr
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Gender */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>
            Gender <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.fieldHint}>
            Helps us provide accurate nutritional recommendations
          </Text>
          <View style={styles.chipsContainer}>
            {GENDER_OPTIONS.map((gender) => (
              <TouchableOpacity
                key={gender}
                style={[
                  styles.chip,
                  selectedGender === gender && styles.chipSelected
                ]}
                onPress={() => setSelectedGender(gender)}
              >
                <Text style={[
                  styles.chipText,
                  selectedGender === gender && styles.chipTextSelected
                ]}>
                  {gender}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Country/Cultural Background */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>
            Country/Cultural Background <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.fieldHint}>
            Helps us suggest culturally relevant meals and ingredients
          </Text>
          
          {/* Selected Country Display */}
          {selectedCountry && (
            <View style={styles.selectedCountryContainer}>
              <Text style={styles.selectedCountryText}>{selectedCountry}</Text>
              <TouchableOpacity onPress={() => {
                setSelectedCountry(null);
                setCountrySearch('');
              }}>
                <NourishrIcon name="CloseCircle" size={20} color={colors.gray60} />
              </TouchableOpacity>
            </View>
          )}
          
          {/* Country Search Input */}
          {!selectedCountry && (
            <View>
              <View style={styles.countryInputContainer}>
                <NourishrIcon name="SearchNormal" size={20} color={colors.gray60} />
                <TextInput
                  style={styles.countryInput}
                  placeholder="Search for your country..."
                  value={countrySearch}
                  onChangeText={setCountrySearch}
                  onFocus={() => setShowCountrySuggestions(true)}
                  placeholderTextColor={colors.gray40}
                  autoCapitalize="words"
                />
              </View>
              
              {/* Country Suggestions */}
              {showCountrySuggestions && filteredCountries.length > 0 && (
                <View style={styles.countrySuggestionsContainer}>
                  <ScrollView style={styles.countrySuggestionsList} nestedScrollEnabled>
                    {filteredCountries.map((country) => (
                      <TouchableOpacity
                        key={country}
                        style={styles.countrySuggestionItem}
                        onPress={() => {
                          setSelectedCountry(country);
                          setCountrySearch('');
                          setShowCountrySuggestions(false);
                          Keyboard.dismiss();
                        }}
                      >
                        <Text style={styles.countrySuggestionText}>{country}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Info Note */}
        <View style={styles.infoBox}>
          <NourishrIcon name="InfoCircle" size={20} color={colors.primary} />
          <Text style={styles.infoText}>
            We use your information to provide personalized meal recommendations and ensure age-appropriate content.
          </Text>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title={loading ? "Saving..." : "Next"}
          onPress={handleNext}
          disabled={!isValid || loading}
        />
        {!isValid && firstName.trim().length > 0 && (
          <Text style={styles.validationHint}>
            {!email.trim() 
              ? 'Please enter your email address'
              : !isValidEmail(email)
                ? 'Please enter a valid email address'
                : !dateOfBirth 
                  ? 'Please select your date of birth' 
                  : calculatedAge !== null && calculatedAge < 13 
                    ? 'You must be at least 13 years old'
                    : !selectedGender
                      ? 'Please select your gender'
                      : !selectedCountry
                        ? 'Please select your country'
                        : 'Please complete all required fields'}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  title: {
    ...typography.headingXL,
    fontSize: 32,
    fontWeight: '700',
    color: colors.black,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    fontSize: 16,
    color: colors.gray60,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  fieldContainer: {
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    ...typography.bodyMedium,
    fontSize: 15,
    fontWeight: '600',
    color: colors.black,
    marginBottom: spacing.xs,
  },
  required: {
    color: colors.error,
  },
  optional: {
    ...typography.caption,
    fontSize: 13,
    color: colors.gray60,
    fontWeight: '400',
  },
  fieldHint: {
    ...typography.caption,
    fontSize: 13,
    color: colors.gray60,
    marginBottom: spacing.sm,
    lineHeight: 18,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.gray20,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipSelected: {
    backgroundColor: '#FFF5E6',
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.body,
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray70,
  },
  chipTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  selectedCountryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF5E6',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  selectedCountryText: {
    ...typography.body,
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    flex: 1,
  },
  countryInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray10,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  countryInput: {
    ...typography.body,
    fontSize: 16,
    color: colors.black,
    flex: 1,
    paddingVertical: spacing.xs,
  },
  countrySuggestionsContainer: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.gray20,
    borderRadius: radius.lg,
    maxHeight: 200,
    overflow: 'hidden',
  },
  countrySuggestionsList: {
    maxHeight: 200,
  },
  countrySuggestionItem: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray10,
  },
  countrySuggestionText: {
    ...typography.body,
    fontSize: 15,
    color: colors.black,
  },
  datePickerButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray30,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    minHeight: 48,
    justifyContent: 'center',
  },
  datePickerText: {
    ...typography.body,
    fontSize: 16,
    color: colors.black,
  },
  datePickerPlaceholder: {
    color: colors.gray60,
  },
  datePickerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
  },
  datePickerActionButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
  },
  datePickerActionText: {
    ...typography.bodyMedium,
    color: colors.white,
    fontWeight: '600',
  },
  ageContainer: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  ageCard: {
    backgroundColor: '#FFF5E6',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  ageLabel: {
    ...typography.caption,
    fontSize: 13,
    color: colors.gray60,
    marginBottom: spacing.xs,
  },
  ageValue: {
    ...typography.headingLG,
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
  },
  ageWarning: {
    ...typography.caption,
    fontSize: 13,
    color: colors.error,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray20,
  },
  validationHint: {
    ...typography.caption,
    fontSize: 13,
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF5E6',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  infoText: {
    ...typography.caption,
    fontSize: 14,
    color: colors.gray70,
    lineHeight: 20,
    flex: 1,
  },
  errorText: {
    ...typography.caption,
    fontSize: 13,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
