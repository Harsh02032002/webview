export const COLORS = {
  background: '#FFFFFF',
  surface: '#F8FAFC',
  surfaceElevated: '#FFFFFF',
  navyDark: '#0A1931',
  navyPrimary: '#0F2547',
  navySecondary: '#1B3B6F',
  navyMuted: '#334E7B',
  goldPrimary: '#C99A2E',
  goldBright: '#D4AF37',
  goldLight: '#FBF5E6',
  goldBorder: '#EAD39C',
  textPrimary: '#0F2547',
  textSecondary: '#475569',
  textMuted: '#64748B',
  borderLight: '#E2E8F0',
  success: '#16A34A',
  error: '#DC2626',
  errorLight: '#FEF2F2',
  white: '#FFFFFF',
} as const;

export const BRAND_CONFIG = {
  appName: 'RoomForStay',
  websiteUrl: 'https://www.roomforstay.com/',
  allowedHosts: ['roomforstay.com', 'www.roomforstay.com'],
  slowConnectionThresholdMs: 8000,
  connectionTimeoutMs: 25000,
  title: 'Welcome to RoomForStay',
  subtitle: 'Find Your Perfect Stay, Anytime, Anywhere.',
  description:
    'Discover comfortable stays, explore properties, and find accommodation that suits your needs with RoomForStay.',
  primaryCta: 'Explore RoomForStay',
  secondaryText: 'Your next stay starts here.',
} as const;

export interface FeatureHighlight {
  id: string;
  title: string;
  subtitle: string;
  icon: 'compass-outline' | 'bed-outline' | 'business-outline' | 'shield-checkmark-outline';
}

export const FEATURE_HIGHLIGHTS: FeatureHighlight[] = [
  {
    id: 'discover',
    title: 'Discover Properties',
    subtitle: 'Browse curated hotels, resorts, and verified stays across top destinations.',
    icon: 'compass-outline',
  },
  {
    id: 'comfortable',
    title: 'Comfortable Stays',
    subtitle: 'Explore handpicked rooms with modern amenities tailored to your comfort.',
    icon: 'bed-outline',
  },
  {
    id: 'ideal',
    title: 'Find Your Ideal Accommodation',
    subtitle: 'Compare options effortlessly to match your travel style and budget.',
    icon: 'business-outline',
  },
  {
    id: 'booking',
    title: 'Easy Booking',
    subtitle: 'Book with ease through a seamless, secure reservation experience.',
    icon: 'shield-checkmark-outline',
  },
];
