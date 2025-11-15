import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radius } from '../../../../../theme';
import { NourishrIcon } from '../../../../../components';

interface PantryItem {
  id: string;
  name: string;
  emoji: string;
  quantity?: string;
  expirationDate?: Date | null;
}

interface ItemCardProps {
  item: PantryItem;
  onPress: () => void;
  onDelete: () => void;
}

const getExpirationStatus = (date: Date | null | undefined) => {
  if (!date) return { label: 'No date', color: colors.gray50 };
  
  const now = new Date();
  const expDate = new Date(date);
  const daysUntil = Math.floor((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntil < 0) return { label: 'Expired', color: '#E63946' };
  if (daysUntil === 0) return { label: 'Expires today', color: '#E63946' };
  if (daysUntil === 1) return { label: 'Expires tomorrow', color: '#E63946' };
  if (daysUntil <= 3) return { label: `Expires in ${daysUntil} days`, color: '#FF9500' };
  if (daysUntil <= 7) return { label: `${daysUntil} days left`, color: '#FFA500' };
  
  return { label: `${daysUntil} days left`, color: colors.gray50 };
};

export const ItemCard: React.FC<ItemCardProps> = ({ item, onPress, onDelete }) => {
  const expirationStatus = getExpirationStatus(item.expirationDate);
  
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <NourishrIcon name="CloseCircle" size={18} color={colors.gray50} />
      </TouchableOpacity>
      
      <Text style={styles.emoji}>{item.emoji}</Text>
      <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
      
      {item.quantity && (
        <Text style={styles.quantity}>{item.quantity}</Text>
      )}
      
      <View style={[styles.expirationTag, { backgroundColor: expirationStatus.color + '15' }]}>
        <Text style={[styles.expirationText, { color: expirationStatus.color }]}>
          {expirationStatus.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '30%',
    aspectRatio: 0.85,
    backgroundColor: '#F8F9FA',
    borderRadius: radius.lg,
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    padding: 2,
    zIndex: 1,
  },
  emoji: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  name: {
    ...typography.caption,
    color: colors.gray70,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: spacing.xs / 2,
  },
  quantity: {
    ...typography.caption,
    color: colors.gray60,
    fontSize: 11,
    marginBottom: spacing.xs,
  },
  expirationTag: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginTop: spacing.xs / 2,
  },
  expirationText: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '600',
  },
});
