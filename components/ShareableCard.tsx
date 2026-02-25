import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ShareableCardProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  theme?: 'dark' | 'light' | 'gradient';
}

export function ShareableCard({ children, title, subtitle, theme = 'dark' }: ShareableCardProps) {
  const colors = THEMES[theme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Ionicons name="trophy" size={24} color={colors.accent} />
            <Text style={[styles.appName, { color: colors.text }]}>Tournament Maker</Text>
          </View>
          {subtitle && (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
          )}
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

        {/* Content */}
        <View style={styles.content}>{children}</View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.watermark, { color: colors.textSecondary }]}>
            Создано в Tournament Maker
          </Text>
        </View>
      </View>
    );
}

const THEMES = {
  dark: {
    background: '#0F0F0F',
    text: '#FFFFFF',
    textSecondary: '#888888',
    accent: '#FFD700',
    card: '#1A1A1A',
  },
  light: {
    background: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    accent: '#D4AF37',
    card: '#F5F5F5',
  },
  gradient: {
    background: '#1a1a2e',
    text: '#FFFFFF',
    textSecondary: '#a0a0a0',
    accent: '#FFD700',
    card: '#16213e',
  },
};

export const SHARE_THEMES = THEMES;

const styles = StyleSheet.create({
  container: {
    width: 360,
    padding: 24,
    borderRadius: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appName: {
    fontSize: 14,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  content: {
    marginBottom: 20,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  watermark: {
    fontSize: 11,
  },
});
