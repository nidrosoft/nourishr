import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radius } from '../../../../theme';

interface Cuisine {
  id: string;
  name: string;
  flag: string;
}

interface CuisineGridProps {
  cuisines?: Cuisine[];
  onCuisinePress: (id: string) => void;
}

const CUISINES: Cuisine[] = [
  { id: 'italian', name: 'Italian', flag: '🇮🇹' },
  { id: 'mexican', name: 'Mexican', flag: '🇲🇽' },
  { id: 'asian', name: 'Asian', flag: '🇨🇳' },
  { id: 'mediterranean', name: 'Mediterranean', flag: '🇬🇷' },
  { id: 'indian', name: 'Indian', flag: '🇮🇳' },
  { id: 'japanese', name: 'Japanese', flag: '🇯🇵' },
  { id: 'american', name: 'American', flag: '🇺🇸' },
  { id: 'french', name: 'French', flag: '🇫🇷' },
  { id: 'thai', name: 'Thai', flag: '🇹🇭' },
  { id: 'korean', name: 'Korean', flag: '🇰🇷' },
  { id: 'spanish', name: 'Spanish', flag: '🇪🇸' },
  { id: 'middle-eastern', name: 'Middle Eastern', flag: '🇱🇧' },
];

export const CuisineGrid: React.FC<CuisineGridProps> = ({ cuisines = CUISINES, onCuisinePress }) => {
  return (
    <View style={styles.grid}>
      {cuisines.map((cuisine) => (
        <TouchableOpacity
          key={cuisine.id}
          style={styles.cuisineItem}
          onPress={() => onCuisinePress(cuisine.id)}
          activeOpacity={0.7}
        >
          <View style={styles.flagContainer}>
            <Text style={styles.flag}>{cuisine.flag}</Text>
          </View>
          <Text style={styles.cuisineName}>{cuisine.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  cuisineItem: {
    width: '25%',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  flagContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  flag: {
    fontSize: 28,
  },
  cuisineName: {
    ...typography.body,
    fontSize: 11,
    fontWeight: '500',
    color: colors.gray90,
    textAlign: 'center',
  },
});
