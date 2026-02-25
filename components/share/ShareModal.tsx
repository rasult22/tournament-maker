import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as Haptics from 'expo-haptics';
import { useColors } from '../../hooks/useColors';

type ShareTheme = 'dark' | 'light' | 'gradient';

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  renderContent: (theme: ShareTheme) => React.ReactNode;
}

export function ShareModal({ visible, onClose, renderContent }: ShareModalProps) {
  const colors = useColors();
  const [theme, setTheme] = useState<ShareTheme>('dark');
  const [sharing, setSharing] = useState(false);
  const viewRef = React.useRef<View>(null);

  const themes: { value: ShareTheme; label: string; colors: string[] }[] = [
    { value: 'dark', label: 'Тёмная', colors: ['#0F0F0F', '#1A1A1A'] },
    { value: 'light', label: 'Светлая', colors: ['#FFFFFF', '#F5F5F5'] },
    { value: 'gradient', label: 'Градиент', colors: ['#1a1a2e', '#16213e'] },
  ];

  const handleShare = async () => {
    if (!viewRef.current) return;

    try {
      setSharing(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Поделиться в сторис',
        });
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Share error:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setSharing(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.cancelText, { color: colors.tint }]}>Отмена</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Поделиться</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Preview */}
        <ScrollView contentContainerStyle={styles.previewContainer}>
          <View style={styles.previewWrapper} ref={viewRef} collapsable={false}>
            {renderContent(theme)}
          </View>
        </ScrollView>

        {/* Theme Picker */}
        <View style={[styles.themePicker, { backgroundColor: colors.backgroundSecondary }]}>
          <Text style={[styles.themeLabel, { color: colors.textSecondary }]}>Тема</Text>
          <View style={styles.themeOptions}>
            {themes.map(t => (
              <TouchableOpacity
                key={t.value}
                style={[
                  styles.themeOption,
                  theme === t.value && { borderColor: colors.tint },
                ]}
                onPress={() => setTheme(t.value)}
              >
                <View style={styles.themePreview}>
                  <View style={[styles.themeColor, { backgroundColor: t.colors[0] }]} />
                  <View style={[styles.themeColor, { backgroundColor: t.colors[1] }]} />
                </View>
                <Text
                  style={[
                    styles.themeText,
                    { color: theme === t.value ? colors.tint : colors.textSecondary },
                  ]}
                >
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Share Button */}
        <View style={[styles.footer, { backgroundColor: colors.background }]}>
          <TouchableOpacity
            style={[styles.shareButton, { backgroundColor: colors.tint }]}
            onPress={handleShare}
            disabled={sharing}
          >
            {sharing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="share-outline" size={20} color="#FFFFFF" />
                <Text style={styles.shareButtonText}>Поделиться в сторис</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  cancelText: {
    fontSize: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  previewContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  previewWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  themePicker: {
    padding: 16,
  },
  themeLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  themeOption: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  themePreview: {
    flexDirection: 'row',
    width: 40,
    height: 24,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 6,
  },
  themeColor: {
    flex: 1,
  },
  themeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
