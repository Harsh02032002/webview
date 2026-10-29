import { Linking, Alert } from 'react-native';
import { BRAND_CONFIG } from '../constants/theme';

const EXTERNAL_SCHEMES = [
  'tel:',
  'mailto:',
  'sms:',
  'whatsapp:',
  'geo:',
  'maps:',
  'intent:',
  'market:',
  'upi:',
];

export function isInternalRoomForStayUrl(url: string): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();

  if (
    lower === 'about:blank' ||
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('blob:')
  ) {
    return true;
  }

  for (const scheme of EXTERNAL_SCHEMES) {
    if (lower.startsWith(scheme)) {
      return false;
    }
  }

  try {
    const parsed = new URL(trimmed);
    const protocol = parsed.protocol.toLowerCase();
    if (protocol !== 'http:' && protocol !== 'https:') {
      return false;
    }

    const host = parsed.hostname.toLowerCase();
    return BRAND_CONFIG.allowedHosts.some(
      (allowed) => host === allowed || host.endsWith(`.${allowed}`)
    );
  } catch {
    return false;
  }
}

export async function openExternalUrlSafely(url: string): Promise<void> {
  try {
    const trimmed = url.trim();
    if (!trimmed) return;

    // Handle Android intent:// URLs gracefully if encountered
    if (trimmed.toLowerCase().startsWith('intent://')) {
      const fallbackMatch = trimmed.match(/S\.browser_fallback_url=([^;]+)/);
      if (fallbackMatch && fallbackMatch[1]) {
        const fallbackUrl = decodeURIComponent(fallbackMatch[1]);
        await Linking.openURL(fallbackUrl);
        return;
      }
    }

    const supported = await Linking.canOpenURL(trimmed);
    if (supported) {
      await Linking.openURL(trimmed);
    } else {
      await Linking.openURL(trimmed);
    }
  } catch {
    Alert.alert(
      'Unable to Open Link',
      'No compatible application was found on your device to open this external link.'
    );
  }
}
