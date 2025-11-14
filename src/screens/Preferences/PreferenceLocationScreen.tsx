import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Slider from '@react-native-community/slider';
import * as Location from 'expo-location';
import { colors, typography, spacing, radius } from '../../theme';
import { NourishrIcon, PrimaryButton, PreferenceHeader } from '../../components';
import { RootStackParamList } from '../../navigation/types';

type PreferenceLocationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PreferenceLocation'>;

interface PreferenceLocationScreenProps {
  navigation: PreferenceLocationScreenNavigationProp;
}

const DELIVERY_DISTANCE_OPTIONS = ['Nearby only', 'Up to 20 min', 'Up to 30 min', 'Anything available'];

export const PreferenceLocationScreen: React.FC<PreferenceLocationScreenProps> = ({ navigation }) => {
  const [cityNeighborhood, setCityNeighborhood] = useState('');
  const [preciseAddress, setPreciseAddress] = useState('');
  const [useLocationPermission, setUseLocationPermission] = useState(false);
  const [deliveryDistance, setDeliveryDistance] = useState(1); // 0=Nearby, 1=20min, 2=30min, 3=Anything
  const [showLocationSection, setShowLocationSection] = useState(true);
  const [showAddressSection, setShowAddressSection] = useState(true);
  const [showDistanceSection, setShowDistanceSection] = useState(true);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationCoords, setLocationCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [citySearch, setCitySearch] = useState('');
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [isSearchingCities, setIsSearchingCities] = useState(false);

  // Function to reverse geocode coordinates to address
  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      // Using OpenStreetMap Nominatim API for reverse geocoding (free, no API key needed)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Nourishr-App/1.0'
          }
        }
      );
      
      const data = await response.json();
      
      if (data && data.address) {
        // Extract city/neighborhood
        const city = data.address.city || data.address.town || data.address.village || data.address.county || '';
        const neighborhood = data.address.neighbourhood || data.address.suburb || '';
        const state = data.address.state || '';
        
        // Construct city/neighborhood string
        let locationString = '';
        if (neighborhood) {
          locationString = `${neighborhood}, ${city}`;
        } else if (city) {
          locationString = city;
        }
        if (state && locationString) {
          locationString += `, ${state}`;
        }
        
        setCityNeighborhood(locationString || data.display_name);
        
        // Extract precise address
        const houseNumber = data.address.house_number || '';
        const road = data.address.road || '';
        const addressString = `${houseNumber} ${road}`.trim();
        
        if (addressString) {
          setPreciseAddress(addressString);
        }
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      Alert.alert(
        'Location Error',
        'Could not determine your address. Please enter it manually.',
        [{ text: 'OK' }]
      );
    }
  };

  // Function to get current location
  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    
    try {
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setIsLoadingLocation(false);
        Alert.alert(
          'Permission Denied',
          'Please enable location permissions in your device settings to use this feature.',
          [
            {
              text: 'Enter Manually',
              onPress: () => {
                setUseLocationPermission(false);
              }
            },
            { text: 'OK' }
          ]
        );
        return;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      const { latitude, longitude } = location.coords;
      setLocationCoords({ latitude, longitude });
      
      // Reverse geocode to get address
      await reverseGeocode(latitude, longitude);
      setIsLoadingLocation(false);
      
    } catch (error) {
      setIsLoadingLocation(false);
      console.error('Location error:', error);
      
      Alert.alert(
        'Location Error',
        'Could not get your location. Please try again or enter your location manually.',
        [
          {
            text: 'Enter Manually',
            onPress: () => {
              setUseLocationPermission(false);
            }
          },
          { text: 'Try Again', onPress: getCurrentLocation }
        ]
      );
    }
  };

  // Function to search for cities
  const searchCities = async (query: string) => {
    if (!query || query.length < 3) {
      setCitySuggestions([]);
      return;
    }

    setIsSearchingCities(true);
    try {
      // Using OpenStreetMap Nominatim API for city search
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=us&limit=10&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Nourishr-App/1.0'
          }
        }
      );
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const cities = data
          .filter((item: any) => item.address && (item.address.city || item.address.town || item.address.village))
          .map((item: any) => {
            const city = item.address.city || item.address.town || item.address.village;
            const state = item.address.state;
            return state ? `${city}, ${state}` : city;
          })
          .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index); // Remove duplicates
        
        setCitySuggestions(cities.slice(0, 5)); // Limit to 5 suggestions
      } else {
        setCitySuggestions([]);
      }
    } catch (error) {
      console.error('City search error:', error);
      setCitySuggestions([]);
    } finally {
      setIsSearchingCities(false);
    }
  };

  // Debounce city search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (citySearch && !useLocationPermission) {
        searchCities(citySearch);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [citySearch, useLocationPermission]);

  const handleLocationPermission = () => {
    const newValue = !useLocationPermission;
    setUseLocationPermission(newValue);
    
    if (newValue) {
      // When enabling location permission, get current location
      setCitySearch('');
      setCitySuggestions([]);
      setShowCitySuggestions(false);
      getCurrentLocation();
    } else {
      // When disabling, clear location data
      setLocationCoords(null);
      setCityNeighborhood('');
      setPreciseAddress('');
    }
  };

  const isValid = useLocationPermission || cityNeighborhood.trim() !== '';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <PreferenceHeader
        currentStep={9}
        totalSteps={10}
        icon="Location"
        onClose={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Where should we look for places to order from?</Text>
        <Text style={styles.subtitle}>
          Help us find nearby restaurants and delivery options that work for you. This is optional but helps with ordering suggestions.
        </Text>

        {/* Section 1: Primary Location */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setShowLocationSection(!showLocationSection)}
        >
          <View style={styles.sectionHeaderLeft}>
            <NourishrIcon name="Location" size={20} color={colors.black} variant="bold" />
            <Text style={styles.sectionTitle}>Primary city / neighborhood</Text>
          </View>
          <NourishrIcon 
            name={showLocationSection ? "ArrowUp2" : "ArrowDown2"} 
            size={20} 
            color={colors.gray60} 
          />
        </TouchableOpacity>

        {showLocationSection && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionSubtitle}>Enter your city or neighborhood</Text>
            
            {!useLocationPermission && (
              <View style={styles.inputContainer}>
                <NourishrIcon name="SearchNormal" size={20} color={colors.gray60} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Downtown Seattle, Brooklyn, Mission District"
                  value={cityNeighborhood}
                  onChangeText={setCityNeighborhood}
                  placeholderTextColor={colors.gray40}
                  autoCapitalize="words"
                />
                {cityNeighborhood.length > 0 && (
                  <TouchableOpacity onPress={() => setCityNeighborhood('')}>
                    <NourishrIcon name="CloseCircle" size={20} color={colors.gray60} />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Location Permission Toggle */}
            <View style={styles.permissionToggleContainer}>
              <View style={styles.permissionToggleLeft}>
                <View style={styles.permissionIconContainer}>
                  {isLoadingLocation ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <NourishrIcon name="Gps" size={20} color={colors.primary} variant="bold" />
                  )}
                </View>
                <View style={styles.permissionTextContainer}>
                  <Text style={styles.permissionToggleTitle}>Use my device location</Text>
                  <Text style={styles.permissionToggleSubtitle}>
                    {isLoadingLocation 
                      ? 'Getting your location...' 
                      : useLocationPermission 
                        ? 'Location access enabled' 
                        : 'Automatically detect your location'}
                  </Text>
                </View>
              </View>
              <Switch
                value={useLocationPermission}
                onValueChange={handleLocationPermission}
                trackColor={{ false: colors.gray20, true: colors.primary }}
                thumbColor={colors.white}
                disabled={isLoadingLocation}
              />
            </View>

            {useLocationPermission && !isLoadingLocation && cityNeighborhood && (
              <View style={styles.locationActiveBox}>
                <NourishrIcon name="TickCircle" size={18} color={colors.primary} variant="bold" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.locationActiveTitle}>Location detected</Text>
                  <Text style={styles.locationActiveText}>
                    {cityNeighborhood}
                  </Text>
                </View>
              </View>
            )}
            
            {useLocationPermission && !isLoadingLocation && !cityNeighborhood && (
              <View style={styles.locationActiveBox}>
                <NourishrIcon name="InfoCircle" size={18} color={colors.primary} />
                <Text style={styles.locationActiveText}>
                  We'll use your device location to find nearby restaurants and delivery options.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Section 2: Precise Address (Optional) */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setShowAddressSection(!showAddressSection)}
        >
          <View style={styles.sectionHeaderLeft}>
            <NourishrIcon name="Home" size={20} color={colors.black} variant="bold" />
            <Text style={styles.sectionTitle}>Precise address</Text>
            <View style={styles.optionalBadge}>
              <Text style={styles.optionalText}>Optional</Text>
            </View>
          </View>
          <NourishrIcon 
            name={showAddressSection ? "ArrowUp2" : "ArrowDown2"} 
            size={20} 
            color={colors.gray60} 
          />
        </TouchableOpacity>

        {showAddressSection && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionSubtitle}>
              Add your full address for more accurate delivery options
            </Text>
            
            {!useLocationPermission && (
              <View style={styles.addressInputContainer}>
                <NourishrIcon name="Home" size={20} color={colors.gray60} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 123 Main St, Apt 4B"
                  value={preciseAddress}
                  onChangeText={setPreciseAddress}
                  placeholderTextColor={colors.gray40}
                  autoCapitalize="words"
                  multiline
                />
                {preciseAddress.length > 0 && (
                  <TouchableOpacity onPress={() => setPreciseAddress('')}>
                    <NourishrIcon name="CloseCircle" size={20} color={colors.gray60} />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {useLocationPermission && (
              <View style={styles.infoBox}>
                <NourishrIcon name="InfoCircle" size={18} color={colors.gray60} />
                <Text style={styles.infoBoxText}>
                  Your device location will be used for precise address detection.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Section 3: Delivery Distance */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setShowDistanceSection(!showDistanceSection)}
        >
          <View style={styles.sectionHeaderLeft}>
            <NourishrIcon name="Routing" size={20} color={colors.black} variant="bold" />
            <Text style={styles.sectionTitle}>Max delivery distance / ETA</Text>
          </View>
          <NourishrIcon 
            name={showDistanceSection ? "ArrowUp2" : "ArrowDown2"} 
            size={20} 
            color={colors.gray60} 
          />
        </TouchableOpacity>

        {showDistanceSection && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionSubtitle}>How far are you willing to order from?</Text>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={3}
                step={1}
                value={deliveryDistance}
                onValueChange={setDeliveryDistance}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.gray20}
                thumbTintColor={colors.primary}
              />
              <Text style={styles.sliderValue}>{DELIVERY_DISTANCE_OPTIONS[deliveryDistance]}</Text>
            </View>

            {/* Visual Distance Indicators */}
            <View style={styles.distanceIndicatorsContainer}>
              {DELIVERY_DISTANCE_OPTIONS.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.distanceIndicator,
                    deliveryDistance === index && styles.distanceIndicatorActive
                  ]}
                  onPress={() => setDeliveryDistance(index)}
                >
                  <View style={[
                    styles.distanceIconContainer,
                    deliveryDistance === index && styles.distanceIconContainerActive
                  ]}>
                    <NourishrIcon 
                      name={index === 0 ? "Location" : index === 3 ? "Global" : "Routing"} 
                      size={18} 
                      color={deliveryDistance === index ? colors.white : colors.gray60} 
                      variant={deliveryDistance === index ? "bold" : "linear"}
                    />
                  </View>
                  <Text style={[
                    styles.distanceIndicatorLabel,
                    deliveryDistance === index && styles.distanceIndicatorLabelActive
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Info Box */}
        {isValid && (
          <View style={styles.finalInfoBox}>
            <NourishrIcon name="InfoCircle" size={20} color={colors.primary} />
            <Text style={styles.finalInfoText}>
              This information helps us suggest restaurants and delivery options that are actually available in your area.
            </Text>
          </View>
        )}

        {/* Skip Option */}
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={() => navigation.navigate('PreferenceSummary')}
        >
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title="Next"
          onPress={() => navigation.navigate('PreferenceSummary')}
          disabled={!isValid}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  content: { flex: 1, paddingHorizontal: spacing.lg },
  title: { ...typography.headingXL, fontSize: 32, fontWeight: '700', color: colors.black, marginBottom: spacing.sm },
  subtitle: { ...typography.body, fontSize: 16, color: colors.gray60, marginBottom: spacing.xl, lineHeight: 22 },
  
  // Section Header
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.gray10, borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.lg, marginBottom: spacing.sm },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  sectionTitle: { ...typography.bodyMedium, fontSize: 18, fontWeight: '600', color: colors.black },
  sectionContent: { marginBottom: spacing.md },
  sectionSubtitle: { ...typography.caption, fontSize: 14, color: colors.gray60, marginBottom: spacing.md },
  optionalBadge: { backgroundColor: colors.gray20, borderRadius: radius.sm, paddingHorizontal: spacing.xs, paddingVertical: 2 },
  optionalText: { ...typography.caption, fontSize: 11, fontWeight: '600', color: colors.gray60 },
  
  // Input Fields
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.gray10, borderRadius: radius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: spacing.sm, marginBottom: spacing.md },
  addressInputContainer: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.gray10, borderRadius: radius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: spacing.sm, marginBottom: spacing.md },
  input: { ...typography.body, fontSize: 16, color: colors.black, flex: 1, paddingVertical: spacing.xs },
  
  // Location Permission Toggle
  permissionToggleContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.gray10, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md },
  permissionToggleLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  permissionIconContainer: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: '#FFF5E6', justifyContent: 'center', alignItems: 'center' },
  permissionTextContainer: { flex: 1 },
  permissionToggleTitle: { ...typography.bodyMedium, fontSize: 16, fontWeight: '600', color: colors.black, marginBottom: 2 },
  permissionToggleSubtitle: { ...typography.caption, fontSize: 13, color: colors.gray60 },
  
  // Location Active Box
  locationActiveBox: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#FFF5E6', borderRadius: radius.lg, padding: spacing.md, gap: spacing.sm },
  locationActiveTitle: { ...typography.bodyMedium, fontSize: 15, fontWeight: '600', color: colors.black, marginBottom: 2 },
  locationActiveText: { ...typography.caption, fontSize: 14, color: colors.gray70, lineHeight: 20, flex: 1 },
  
  // Info Box
  infoBox: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.gray10, borderRadius: radius.lg, padding: spacing.md, gap: spacing.sm },
  infoBoxText: { ...typography.caption, fontSize: 14, color: colors.gray60, lineHeight: 20, flex: 1 },
  
  // Slider
  sliderContainer: { marginBottom: spacing.lg },
  slider: { width: '100%', height: 40 },
  sliderValue: { ...typography.body, fontSize: 18, fontWeight: '600', color: colors.primary, textAlign: 'center', marginTop: spacing.sm },
  
  // Distance Indicators
  distanceIndicatorsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  distanceIndicator: { flex: 1, minWidth: '47%', backgroundColor: colors.white, borderWidth: 2, borderColor: colors.gray20, borderRadius: radius.lg, padding: spacing.md, alignItems: 'center', gap: spacing.xs },
  distanceIndicatorActive: { borderColor: colors.primary, backgroundColor: '#FFF5E6' },
  distanceIconContainer: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.gray10, justifyContent: 'center', alignItems: 'center' },
  distanceIconContainerActive: { backgroundColor: colors.primary },
  distanceIndicatorLabel: { ...typography.caption, fontSize: 13, fontWeight: '500', color: colors.gray60, textAlign: 'center' },
  distanceIndicatorLabelActive: { color: colors.primary, fontWeight: '600' },
  
  // Final Info Box
  finalInfoBox: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#FFF5E6', borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.lg, gap: spacing.sm },
  finalInfoText: { ...typography.caption, fontSize: 14, color: colors.gray70, lineHeight: 20, flex: 1 },
  
  // Skip Button
  skipButton: { alignItems: 'center', paddingVertical: spacing.md, marginTop: spacing.md, marginBottom: spacing.xl },
  skipButtonText: { ...typography.bodyMedium, fontSize: 16, fontWeight: '600', color: colors.gray60 },
  
  buttonContainer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, paddingTop: spacing.md, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.gray20 },
});
