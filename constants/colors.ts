export const Colors = {
  light: {
    text: '#11181C',
    textSecondary: '#687076',
    background: '#FFFFFF',
    backgroundSecondary: '#F4F4F5',
    tint: '#0a7ea4',
    border: '#E4E4E7',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    card: '#FFFFFF',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    background: '#09090B',
    backgroundSecondary: '#18181B',
    tint: '#38BDF8',
    border: '#27272A',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    card: '#18181B',
  },
};

export type ColorScheme = keyof typeof Colors;
