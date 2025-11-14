import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { colors, typography, spacing, radius } from '../../../theme';
import { NourishrIcon } from '../../../components';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT * 0.85;

type Ingredient = {
  id: string;
  name: string;
  quantity?: string;
  isSelected: boolean;
  imageUri?: string;
};

type CookWhatIHaveStep = 'photos' | 'ingredients' | 'cuisine' | 'review';

interface CookWhatIHaveFlowProps {
  visible: boolean;
  onClose: () => void;
}

export const CookWhatIHaveFlow: React.FC<{ visible: any; onClose: any }> = ({ visible, onClose }) => {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState<CookWhatIHaveStep>('photos');
  const [photos, setPhotos] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [manualIngredient, setManualIngredient] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [cuisineSearch, setCuisineSearch] = useState('');
  const slideAnim = useRef(new Animated.Value(BOTTOM_SHEET_HEIGHT)).current;
  
  React.useEffect(() => {
    if (visible) {
      slideAnim.setValue(BOTTOM_SHEET_HEIGHT);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: BOTTOM_SHEET_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: BOTTOM_SHEET_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose();
      // Reset state
      setCurrentStep('photos');
      setPhotos([]);
      setIngredients([]);
      setManualIngredient('');
      setSelectedCuisine(null);
    });
  };

  const handleTakePhoto = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'Please allow camera access to take photos of your ingredients.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        if (photos.length < 10) {
          setPhotos([...photos, result.assets[0].uri]);
          // TODO: Process image with AI to detect ingredients
          simulateIngredientDetection(result.assets[0].uri);
        } else {
          Alert.alert('Maximum Photos', 'You can only add up to 10 photos.');
        }
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handleSelectPhoto = async () => {
    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Gallery Permission Required',
          'Please allow gallery access to select photos of your ingredients.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Calculate how many more photos can be added
      const remainingSlots = 10 - photos.length;
      
      if (remainingSlots === 0) {
        Alert.alert('Maximum Photos', 'You can only add up to 10 photos.');
        return;
      }

      // Launch image picker with multiple selection
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: remainingSlots,
      });

      if (!result.canceled && result.assets.length > 0) {
        const newPhotoUris = result.assets.map(asset => asset.uri);
        setPhotos([...photos, ...newPhotoUris]);
        
        // Process each image with AI to detect ingredients
        newPhotoUris.forEach(uri => {
          simulateIngredientDetection(uri);
        });
      }
    } catch (error) {
      console.error('Error selecting photo:', error);
      Alert.alert('Error', 'Failed to select photos. Please try again.');
    }
  };

  // Simulate AI ingredient detection (replace with actual AI integration)
  const simulateIngredientDetection = (imageUri: string) => {
    // Mock detected ingredients - replace with actual AI detection
    const mockIngredients = [
      'Tomatoes',
      'Chicken breast',
      'Onions',
      'Garlic',
      'Spinach',
      'Rice',
    ];
    
    // Randomly select 2-4 ingredients
    const count = Math.floor(Math.random() * 3) + 2;
    const detected = mockIngredients
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
      .map((name) => ({
        id: `${Date.now()}-${Math.random()}`,
        name,
        isSelected: true,
        imageUri,
      }));

    setIngredients([...ingredients, ...detected]);
  };

  const handleAddManualIngredient = () => {
    if (manualIngredient.trim()) {
      const newIngredient: Ingredient = {
        id: Date.now().toString(),
        name: manualIngredient.trim(),
        isSelected: true,
      };
      setIngredients([...ingredients, newIngredient]);
      setManualIngredient('');
    }
  };

  const handleToggleIngredient = (id: string) => {
    setIngredients(
      ingredients.map((ing) =>
        ing.id === id ? { ...ing, isSelected: !ing.isSelected } : ing
      )
    );
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id));
  };

  const handleNext = () => {
    if (currentStep === 'photos') {
      // Move to ingredients step
      // TODO: Process photos with AI to detect ingredients
      setCurrentStep('ingredients');
    } else if (currentStep === 'ingredients') {
      setCurrentStep('cuisine');
    } else if (currentStep === 'cuisine') {
      setCurrentStep('review');
    }
  };

  const handleBack = () => {
    if (currentStep === 'ingredients') {
      setCurrentStep('photos');
    } else if (currentStep === 'cuisine') {
      setCurrentStep('ingredients');
    } else if (currentStep === 'review') {
      setCurrentStep('cuisine');
    }
  };

  const getStepNumber = () => {
    switch (currentStep) {
      case 'photos':
        return 1;
      case 'ingredients':
        return 2;
      case 'cuisine':
        return 3;
      case 'review':
        return 4;
      default:
        return 1;
    }
  };

  const cuisines = [
    { id: 'afghan', name: 'Afghan', emoji: '🇦🇫' },
    { id: 'albanian', name: 'Albanian', emoji: '🇦🇱' },
    { id: 'algerian', name: 'Algerian', emoji: '🇩🇿' },
    { id: 'american', name: 'American', emoji: '🇺🇸' },
    { id: 'argentinian', name: 'Argentinian', emoji: '🇦🇷' },
    { id: 'armenian', name: 'Armenian', emoji: '🇦🇲' },
    { id: 'australian', name: 'Australian', emoji: '🇦🇺' },
    { id: 'austrian', name: 'Austrian', emoji: '🇦🇹' },
    { id: 'bangladeshi', name: 'Bangladeshi', emoji: '🇧🇩' },
    { id: 'belgian', name: 'Belgian', emoji: '🇧🇪' },
    { id: 'brazilian', name: 'Brazilian', emoji: '🇧🇷' },
    { id: 'british', name: 'British', emoji: '🇬🇧' },
    { id: 'bulgarian', name: 'Bulgarian', emoji: '🇧🇬' },
    { id: 'cambodian', name: 'Cambodian', emoji: '🇰🇭' },
    { id: 'cameroonian', name: 'Cameroonian', emoji: '🇨🇲' },
    { id: 'canadian', name: 'Canadian', emoji: '🇨🇦' },
    { id: 'caribbean', name: 'Caribbean', emoji: '🏝️' },
    { id: 'chilean', name: 'Chilean', emoji: '🇨🇱' },
    { id: 'chinese', name: 'Chinese', emoji: '🇨🇳' },
    { id: 'colombian', name: 'Colombian', emoji: '🇨🇴' },
    { id: 'croatian', name: 'Croatian', emoji: '🇭🇷' },
    { id: 'cuban', name: 'Cuban', emoji: '🇨🇺' },
    { id: 'czech', name: 'Czech', emoji: '🇨🇿' },
    { id: 'danish', name: 'Danish', emoji: '🇩🇰' },
    { id: 'dutch', name: 'Dutch', emoji: '🇳🇱' },
    { id: 'egyptian', name: 'Egyptian', emoji: '🇪🇬' },
    { id: 'ethiopian', name: 'Ethiopian', emoji: '🇪🇹' },
    { id: 'filipino', name: 'Filipino', emoji: '🇵🇭' },
    { id: 'finnish', name: 'Finnish', emoji: '🇫🇮' },
    { id: 'french', name: 'French', emoji: '🇫🇷' },
    { id: 'german', name: 'German', emoji: '🇩🇪' },
    { id: 'ghanaian', name: 'Ghanaian', emoji: '🇬🇭' },
    { id: 'greek', name: 'Greek', emoji: '🇬🇷' },
    { id: 'haitian', name: 'Haitian', emoji: '🇭🇹' },
    { id: 'hungarian', name: 'Hungarian', emoji: '🇭🇺' },
    { id: 'indian', name: 'Indian', emoji: '🇮🇳' },
    { id: 'indonesian', name: 'Indonesian', emoji: '🇮🇩' },
    { id: 'iranian', name: 'Iranian', emoji: '🇮🇷' },
    { id: 'iraqi', name: 'Iraqi', emoji: '🇮🇶' },
    { id: 'irish', name: 'Irish', emoji: '🇮🇪' },
    { id: 'israeli', name: 'Israeli', emoji: '🇮🇱' },
    { id: 'italian', name: 'Italian', emoji: '🇮🇹' },
    { id: 'jamaican', name: 'Jamaican', emoji: '🇯🇲' },
    { id: 'japanese', name: 'Japanese', emoji: '🇯🇵' },
    { id: 'jordanian', name: 'Jordanian', emoji: '🇯🇴' },
    { id: 'kenyan', name: 'Kenyan', emoji: '🇰🇪' },
    { id: 'korean', name: 'Korean', emoji: '🇰🇷' },
    { id: 'lebanese', name: 'Lebanese', emoji: '🇱🇧' },
    { id: 'malaysian', name: 'Malaysian', emoji: '🇲🇾' },
    { id: 'mexican', name: 'Mexican', emoji: '🇲🇽' },
    { id: 'moroccan', name: 'Moroccan', emoji: '🇲🇦' },
    { id: 'nepalese', name: 'Nepalese', emoji: '🇳🇵' },
    { id: 'nigerian', name: 'Nigerian', emoji: '🇳🇬' },
    { id: 'norwegian', name: 'Norwegian', emoji: '🇳🇴' },
    { id: 'pakistani', name: 'Pakistani', emoji: '🇵🇰' },
    { id: 'peruvian', name: 'Peruvian', emoji: '🇵🇪' },
    { id: 'polish', name: 'Polish', emoji: '🇵🇱' },
    { id: 'portuguese', name: 'Portuguese', emoji: '🇵🇹' },
    { id: 'romanian', name: 'Romanian', emoji: '🇷🇴' },
    { id: 'russian', name: 'Russian', emoji: '🇷🇺' },
    { id: 'saudi', name: 'Saudi Arabian', emoji: '🇸🇦' },
    { id: 'senegalese', name: 'Senegalese', emoji: '🇸🇳' },
    { id: 'singaporean', name: 'Singaporean', emoji: '🇸🇬' },
    { id: 'south-african', name: 'South African', emoji: '🇿🇦' },
    { id: 'spanish', name: 'Spanish', emoji: '🇪🇸' },
    { id: 'sri-lankan', name: 'Sri Lankan', emoji: '🇱🇰' },
    { id: 'swedish', name: 'Swedish', emoji: '🇸🇪' },
    { id: 'swiss', name: 'Swiss', emoji: '🇨🇭' },
    { id: 'syrian', name: 'Syrian', emoji: '🇸🇾' },
    { id: 'taiwanese', name: 'Taiwanese', emoji: '🇹🇼' },
    { id: 'thai', name: 'Thai', emoji: '🇹🇭' },
    { id: 'tunisian', name: 'Tunisian', emoji: '🇹🇳' },
    { id: 'turkish', name: 'Turkish', emoji: '🇹🇷' },
    { id: 'ukrainian', name: 'Ukrainian', emoji: '🇺🇦' },
    { id: 'venezuelan', name: 'Venezuelan', emoji: '🇻🇪' },
    { id: 'vietnamese', name: 'Vietnamese', emoji: '🇻🇳' },
  ];

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleClose} />
      
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            paddingBottom: insets.bottom + spacing.lg,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cook With What I Have</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <NourishrIcon name="CloseCircle" size={24} color={colors.gray60} />
          </TouchableOpacity>
        </View>

        {/* Progress Stepper - OfferUp Style */}
        <View style={styles.stepperContainer}>
          {[
            { number: 1, label: 'Photos', step: 'photos' },
            { number: 2, label: 'Ingredients', step: 'ingredients' },
            { number: 3, label: 'Cuisine', step: 'cuisine' },
            { number: 4, label: 'Review', step: 'review' },
          ].map((item, index) => (
            <View key={item.number} style={styles.stepItem}>
              <View
                style={[
                  styles.stepBar,
                  item.number <= getStepNumber() && styles.stepBarActive,
                ]}
              />
              <Text
                style={[
                  styles.stepLabel,
                  item.number <= getStepNumber() && styles.stepLabelActive,
                ]}
              >
                {item.number}. {item.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Content */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Step 1: Photos */}
          {currentStep === 'photos' && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Add your ingredients</Text>
              <Text style={styles.stepDescription}>
                Take photos of your fridge, counter, or pantry. You can add up to 10 photos.
              </Text>

              {/* Photo Grid */}
              {photos.length > 0 && (
                <View style={styles.photoGrid}>
                  {photos.map((photo, index) => (
                    <View key={index} style={styles.photoItem}>
                      <Image source={{ uri: photo }} style={styles.photoImage} />
                      <TouchableOpacity
                        style={styles.removePhotoButton}
                        onPress={() => setPhotos(photos.filter((_, i) => i !== index))}
                      >
                        <NourishrIcon name="CloseCircle" size={20} color={colors.white} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {photos.length > 0 && (
                <Text style={styles.photoCount}>
                  {photos.length} / 10 photos
                </Text>
              )}

              {/* Action Buttons */}
              <TouchableOpacity style={styles.outlineButton} onPress={handleTakePhoto}>
                <NourishrIcon name="Camera" size={20} color={colors.primary} />
                <Text style={styles.outlineButtonText}>Take photo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.outlineButton} onPress={handleSelectPhoto}>
                <NourishrIcon name="Gallery" size={20} color={colors.primary} />
                <Text style={styles.outlineButtonText}>Select from gallery</Text>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Manual Entry */}
              <Text style={styles.sectionTitle}>Add manually</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Type ingredient name..."
                  placeholderTextColor={colors.gray40}
                  value={manualIngredient}
                  onChangeText={setManualIngredient}
                  onSubmitEditing={handleAddManualIngredient}
                  returnKeyType="done"
                />
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddManualIngredient}
                  disabled={!manualIngredient.trim()}
                >
                  <NourishrIcon
                    name="Add"
                    size={20}
                    color={manualIngredient.trim() ? colors.primary : colors.gray40}
                  />
                </TouchableOpacity>
              </View>

              {/* Manual Ingredients List */}
              {ingredients.length > 0 && (
                <View style={styles.manualIngredientsList}>
                  {ingredients.map((ingredient) => (
                    <View key={ingredient.id} style={styles.manualIngredientChip}>
                      <Text style={styles.manualIngredientText}>{ingredient.name}</Text>
                      <TouchableOpacity onPress={() => handleRemoveIngredient(ingredient.id)}>
                        <NourishrIcon name="CloseCircle" size={16} color={colors.gray60} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Step 2: Ingredients Review */}
          {currentStep === 'ingredients' && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>We found these ingredients</Text>
              <Text style={styles.stepDescription}>
                Review and adjust what we detected. Uncheck items you don't want to use.
              </Text>

              {ingredients.length === 0 ? (
                <View style={styles.emptyState}>
                  <NourishrIcon name="SearchNormal" size={48} color={colors.gray40} />
                  <Text style={styles.emptyStateText}>No ingredients yet</Text>
                  <Text style={styles.emptyStateSubtext}>
                    Go back and add photos or enter ingredients manually
                  </Text>
                </View>
              ) : (
                <View style={styles.ingredientsList}>
                  {ingredients.map((ingredient) => (
                    <View key={ingredient.id} style={styles.ingredientItem}>
                      <TouchableOpacity
                        style={styles.ingredientCheckbox}
                        onPress={() => handleToggleIngredient(ingredient.id)}
                      >
                        <View
                          style={[
                            styles.checkbox,
                            ingredient.isSelected && styles.checkboxSelected,
                          ]}
                        >
                          {ingredient.isSelected && (
                            <NourishrIcon name="TickCircle" size={20} color={colors.primary} />
                          )}
                        </View>
                        <Text
                          style={[
                            styles.ingredientName,
                            !ingredient.isSelected && styles.ingredientNameDisabled,
                          ]}
                        >
                          {ingredient.name}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleRemoveIngredient(ingredient.id)}>
                        <NourishrIcon name="Trash" size={20} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              <TouchableOpacity style={styles.outlineButton} onPress={() => setCurrentStep('photos')}>
                <NourishrIcon name="Add" size={20} color={colors.primary} />
                <Text style={styles.outlineButtonText}>Add more ingredients</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Step 3: Cuisine */}
          {currentStep === 'cuisine' && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>What are you in the mood for?</Text>
              <Text style={styles.stepDescription}>
                Choose a cuisine or country to discover dishes you can make.
              </Text>

              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <NourishrIcon name="SearchNormal" size={20} color={colors.gray60} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search for a country or cuisine..."
                  placeholderTextColor={colors.gray60}
                  value={cuisineSearch}
                  onChangeText={setCuisineSearch}
                />
                {cuisineSearch.length > 0 && (
                  <TouchableOpacity onPress={() => setCuisineSearch('')}>
                    <NourishrIcon name="CloseCircle" size={20} color={colors.gray60} />
                  </TouchableOpacity>
                )}
              </View>

              {/* Horizontal Scrollable Pills */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cuisinePillsContainer}
                style={styles.cuisinePillsScroll}
              >
                {/* Surprise Me Pill - Always First */}
                <TouchableOpacity
                  style={[
                    styles.cuisinePill,
                    styles.surprisePill,
                    selectedCuisine === 'surprise' && styles.cuisinePillSelected,
                  ]}
                  onPress={() => setSelectedCuisine('surprise')}
                >
                  <Text style={styles.cuisinePillEmoji}>✨</Text>
                  <Text
                    style={[
                      styles.cuisinePillText,
                      selectedCuisine === 'surprise' && styles.cuisinePillTextSelected,
                    ]}
                  >
                    Surprise Me!
                  </Text>
                </TouchableOpacity>

                {/* Country Pills */}
                {cuisines
                  .filter(cuisine => 
                    cuisine.name.toLowerCase().includes(cuisineSearch.toLowerCase())
                  )
                  .map((cuisine) => (
                    <TouchableOpacity
                      key={cuisine.id}
                      style={[
                        styles.cuisinePill,
                        selectedCuisine === cuisine.id && styles.cuisinePillSelected,
                      ]}
                      onPress={() => setSelectedCuisine(cuisine.id)}
                    >
                      <Text style={styles.cuisinePillEmoji}>{cuisine.emoji}</Text>
                      <Text
                        style={[
                          styles.cuisinePillText,
                          selectedCuisine === cuisine.id && styles.cuisinePillTextSelected,
                        ]}
                      >
                        {cuisine.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>
          )}

          {/* Step 4: Review */}
          {currentStep === 'review' && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Review Your Selection</Text>
              <Text style={styles.stepDescription}>
                Make sure everything looks good before we find dishes for you!
              </Text>

              {/* Photos Summary */}
              <View style={styles.reviewSection}>
                <Text style={styles.reviewSectionTitle}>📸 Photos ({photos.length})</Text>
                {photos.length > 0 ? (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.reviewPhotosContainer}
                  >
                    {photos.map((photo, index) => (
                      <Image key={index} source={{ uri: photo }} style={styles.reviewPhotoThumb} />
                    ))}
                  </ScrollView>
                ) : (
                  <Text style={styles.reviewEmptyText}>No photos added</Text>
                )}
              </View>

              {/* Ingredients Summary */}
              <View style={styles.reviewSection}>
                <Text style={styles.reviewSectionTitle}>
                  🥗 Ingredients ({ingredients.filter(i => i.isSelected).length})
                </Text>
                {ingredients.filter(i => i.isSelected).length > 0 ? (
                  <View style={styles.reviewIngredientsList}>
                    {ingredients.filter(i => i.isSelected).map((ingredient) => (
                      <View key={ingredient.id} style={styles.reviewIngredientChip}>
                        <Text style={styles.reviewIngredientText}>{ingredient.name}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.reviewEmptyText}>No ingredients selected</Text>
                )}
              </View>

              {/* Cuisine Summary */}
              <View style={styles.reviewSection}>
                <Text style={styles.reviewSectionTitle}>🌍 Cuisine</Text>
                {selectedCuisine ? (
                  <View style={styles.reviewCuisineCard}>
                    <Text style={styles.reviewCuisineEmoji}>
                      {selectedCuisine === 'surprise' ? '✨' : cuisines.find(c => c.id === selectedCuisine)?.emoji}
                    </Text>
                    <Text style={styles.reviewCuisineName}>
                      {selectedCuisine === 'surprise' ? 'Surprise Me!' : cuisines.find(c => c.id === selectedCuisine)?.name}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.reviewEmptyText}>No cuisine selected</Text>
                )}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          {currentStep !== 'photos' && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <NourishrIcon name="ArrowLeft2" size={20} color={colors.gray80} />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[
              styles.nextButton,
              currentStep === 'photos' && styles.nextButtonFull,
              (currentStep === 'photos' && photos.length === 0 && ingredients.length === 0) ||
              (currentStep === 'ingredients' && ingredients.filter(i => i.isSelected).length === 0) ||
              (currentStep === 'cuisine' && !selectedCuisine)
                ? styles.nextButtonDisabled
                : null,
            ]}
            onPress={handleNext}
            disabled={
              (currentStep === 'photos' && photos.length === 0 && ingredients.length === 0) ||
              (currentStep === 'ingredients' && ingredients.filter(i => i.isSelected).length === 0) ||
              (currentStep === 'cuisine' && !selectedCuisine)
            }
          >
            <Text style={styles.nextButtonText}>
              {currentStep === 'photos' && 'Next'}
              {currentStep === 'ingredients' && 'Next'}
              {currentStep === 'cuisine' && 'Next'}
              {currentStep === 'review' && '🎉 Show Me What You Got!'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: BOTTOM_SHEET_HEIGHT,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  closeButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.gray80,
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  stepItem: {
    flex: 1,
    alignItems: 'flex-start',
  },
  stepBar: {
    width: '100%',
    height: 4,
    backgroundColor: colors.gray20,
    borderRadius: 2,
    marginBottom: spacing.sm,
  },
  stepBarActive: {
    backgroundColor: colors.primary,
  },
  stepLabel: {
    ...typography.caption,
    color: colors.gray60,
    fontSize: 12,
  },
  stepLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    ...typography.h2,
    color: colors.gray80,
    marginBottom: spacing.xs,
  },
  stepDescription: {
    ...typography.body,
    color: colors.gray60,
    marginBottom: spacing.lg,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  photoItem: {
    width: (SCREEN_WIDTH - spacing.lg * 2 - spacing.md * 3) / 4,
    height: (SCREEN_WIDTH - spacing.lg * 2 - spacing.md * 3) / 4,
    borderRadius: radius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  removePhotoButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
  },
  addPhotoButton: {
    width: (SCREEN_WIDTH - spacing.lg * 2 - spacing.md * 3) / 4,
    height: (SCREEN_WIDTH - spacing.lg * 2 - spacing.md * 3) / 4,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
  },
  addPhotoText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  photoCount: {
    ...typography.caption,
    color: colors.gray60,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  outlineButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray20,
  },
  dividerText: {
    ...typography.body,
    color: colors.gray60,
    marginHorizontal: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.gray80,
    marginBottom: spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray20,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.gray10,
    marginBottom: spacing.md,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.gray80,
    paddingVertical: spacing.md,
  },
  addButton: {
    padding: spacing.xs,
  },
  manualIngredientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  manualIngredientChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    gap: spacing.sm,
  },
  manualIngredientText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '500',
  },
  ingredientsList: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.gray10,
  },
  ingredientCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gray40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  ingredientName: {
    ...typography.body,
    color: colors.gray80,
    fontWeight: '500',
  },
  ingredientNameDisabled: {
    color: colors.gray40,
    textDecorationLine: 'line-through',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyStateText: {
    ...typography.h4,
    color: colors.gray60,
    marginTop: spacing.md,
  },
  emptyStateSubtext: {
    ...typography.body,
    color: colors.gray40,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.gray30,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.gray80,
    paddingVertical: spacing.xs,
  },
  cuisinePillsScroll: {
    marginBottom: spacing.lg,
  },
  cuisinePillsContainer: {
    paddingRight: spacing.lg,
    gap: spacing.sm,
  },
  cuisinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.gray20,
    backgroundColor: colors.white,
    gap: spacing.xs,
  },
  cuisinePillSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  cuisinePillEmoji: {
    fontSize: 20,
  },
  cuisinePillText: {
    ...typography.body,
    color: colors.gray80,
    fontWeight: '600',
  },
  cuisinePillTextSelected: {
    color: colors.primary,
  },
  surprisePill: {
    // Optional: Add special styling for surprise pill if needed
  },
  reviewSection: {
    marginBottom: spacing.lg,
  },
  reviewSectionTitle: {
    ...typography.h4,
    color: colors.gray80,
    marginBottom: spacing.sm,
  },
  reviewPhotosContainer: {
    gap: spacing.sm,
  },
  reviewPhotoThumb: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
  },
  reviewIngredientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  reviewIngredientChip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
  },
  reviewIngredientText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  reviewCuisineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  reviewCuisineEmoji: {
    fontSize: 32,
  },
  reviewCuisineName: {
    ...typography.h4,
    color: colors.primary,
    fontWeight: '600',
  },
  reviewEmptyText: {
    ...typography.body,
    color: colors.gray40,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    backgroundColor: colors.gray10,
    gap: spacing.sm,
  },
  backButtonText: {
    ...typography.body,
    color: colors.gray80,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonDisabled: {
    backgroundColor: colors.gray40,
  },
  nextButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '600',
  },
});
