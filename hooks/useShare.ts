import { useRef, useCallback } from 'react';
import { View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as Haptics from 'expo-haptics';

export function useShare() {
  const viewRef = useRef<View>(null);

  const share = useCallback(async () => {
    if (!viewRef.current) return;

    try {
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
          dialogTitle: 'Поделиться',
        });
      }

      return uri;
    } catch (error) {
      console.error('Share error:', error);
      throw error;
    }
  }, []);

  return { viewRef, share };
}
