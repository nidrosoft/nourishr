import React from 'react';
import * as Icons from 'iconsax-react-native';
import { colors } from '../../../theme';

type IconVariant = 'bold' | 'broken' | 'bulk' | 'linear' | 'outline' | 'twotone';

interface NourishrIconProps {
  name: keyof typeof Icons;
  variant?: IconVariant;
  size?: number;
  color?: string;
}

export const NourishrIcon: React.FC<NourishrIconProps> = ({
  name,
  variant = 'linear',
  size = 24,
  color = colors.black,
}) => {
  const IconComponent = Icons[name] as any;

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in iconsax-react-native`);
    return null;
  }

  return <IconComponent variant={variant} size={size} color={color} />;
};
