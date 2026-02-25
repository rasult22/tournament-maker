import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Team } from '../data/teams';

interface TeamBadgeProps {
  team: Team;
  size?: 'small' | 'medium' | 'large';
}

export function TeamBadge({ team, size = 'medium' }: TeamBadgeProps) {
  const dimensions = SIZES[size];

  return (
    <View
      style={[
        styles.badge,
        {
          width: dimensions.size,
          height: dimensions.size,
          borderRadius: dimensions.size / 2,
          backgroundColor: team.colors.primary,
          borderWidth: 2,
          borderColor: team.colors.secondary,
        },
      ]}
    >
      <Text
        style={[
          styles.initial,
          {
            fontSize: dimensions.fontSize,
            color: getContrastColor(team.colors.primary),
          },
        ]}
      >
        {team.shortName.slice(0, 2).toUpperCase()}
      </Text>
    </View>
  );
}

const SIZES = {
  small: { size: 28, fontSize: 10 },
  medium: { size: 40, fontSize: 14 },
  large: { size: 56, fontSize: 18 },
};

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontWeight: '700',
  },
});
