import { useColorScheme } from 'react-native';
import { Colors } from '../constants/colors';

export function useColors() {
  const scheme = useColorScheme();
  return Colors[scheme === 'dark' ? 'dark' : 'light'];
}
