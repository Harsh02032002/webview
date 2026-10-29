import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  ActivityIndicator,
  Linking,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import * as Network from 'expo-network';
import { Ionicons } from '@expo/vector-icons';
import { BRAND_CONFIG, COLORS, FEATURE_HIGHLIGHTS } from '../constants/theme';
import { BrandHeader } from '../components/BrandHeader';
import { FeatureCard } from '../components/FeatureCard';

export default function WelcomeScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 720;

  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [translateYAnim] = useState(() => new Animated.Value(18));

  const [statusText, setStatusText] = useState<string>(
    'Checking Internet & requesting Location permission...'
  );
  const [isCheckingPermissions, setIsCheckingPermissions] = useState<boolean>(true);
  const [locationGranted, setLocationGranted] = useState<boolean>(false);
  const [internetConnected, setInternetConnected] = useState<boolean>(true);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }),
    ]).start();

    let isMounted = true;

    async function initPermissionsAndOpen() {
      try {
        // 1. Check Internet Connection
        const netState = await Network.getNetworkStateAsync();
        const isOnline =
          netState.isConnected !== false && netState.isInternetReachable !== false;
        if (!isMounted) return;
        setInternetConnected(isOnline);

        // 2. Request Location Permission (Android native runtime popup)
        const { status } = await Location.requestForegroundPermissionsAsync();
        const hasLocation = status === 'granted';
        if (!isMounted) return;
        setLocationGranted(hasLocation);
        setIsCheckingPermissions(false);

        if (isOnline) {
          setStatusText('Permissions ready! Opening RoomForStay...');
          // Automatically open website in browser and in-app WebView
          Linking.openURL(BRAND_CONFIG.websiteUrl).catch(() => {});
          router.replace('/stay');
        } else {
          setStatusText('No internet connection detected. Please check your network.');
        }
      } catch {
        if (!isMounted) return;
        setIsCheckingPermissions(false);
        Linking.openURL(BRAND_CONFIG.websiteUrl).catch(() => {});
        router.replace('/stay');
      }
    }

    initPermissionsAndOpen();

    return () => {
      isMounted = false;
    };
  }, [fadeAnim, translateYAnim]);

  const handleExplorePress = async () => {
    if (!locationGranted) {
      await Location.requestForegroundPermissionsAsync().catch(() => {});
    }
    Linking.openURL(BRAND_CONFIG.websiteUrl).catch(() => {});
    router.push('/stay');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      {/* Top Navy Accent Strip */}
      <View style={styles.topAccentBar}>
        <View style={styles.topAccentGoldLine} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          isTablet && styles.scrollContentTablet,
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Animated.View
          style={[
            styles.contentWrapper,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }],
            },
          ]}
        >
          {/* Top Brand Bar */}
          <View style={styles.headerRow}>
            <BrandHeader />
            <View style={styles.verifiedBadge}>
              <Ionicons name="star" size={12} color={COLORS.goldPrimary} />
              <Text style={styles.verifiedBadgeText}>OFFICIAL APP</Text>
            </View>
          </View>

          {/* Permission & Auto-Launch Status Banner */}
          <View style={styles.permissionBanner}>
            {isCheckingPermissions ? (
              <ActivityIndicator size="small" color={COLORS.goldPrimary} />
            ) : (
              <Ionicons
                name={internetConnected ? 'checkmark-circle' : 'alert-circle'}
                size={20}
                color={internetConnected ? COLORS.goldPrimary : COLORS.error}
              />
            )}
            <View style={styles.permissionBannerTextWrap}>
              <Text style={styles.permissionBannerTitle}>
                Internet & Location Access
              </Text>
              <Text style={styles.permissionBannerSubtitle}>{statusText}</Text>
            </View>
          </View>

          {/* Hero Property Card */}
          <View style={styles.heroCard}>
            <Image
              source={require('../../assets/hero-property.png')}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroOverlayBadge}>
              <Ionicons name="sparkles" size={14} color={COLORS.goldBright} />
              <Text style={styles.heroOverlayText}>
                CURATED HOTELS, RESORTS & SUITES
              </Text>
            </View>
          </View>

          {/* Main Welcome Copy */}
          <View style={styles.copySection}>
            <Text style={styles.title}>{BRAND_CONFIG.title}</Text>
            <Text style={styles.subtitle}>{BRAND_CONFIG.subtitle}</Text>
            <View style={styles.goldDivider} />
            <Text style={styles.description}>{BRAND_CONFIG.description}</Text>
          </View>

          {/* Feature Highlights Section */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionHeader}>WHY CHOOSE ROOMFORSTAY</Text>
            {FEATURE_HIGHLIGHTS.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </View>

          {/* Primary CTA Area */}
          <View style={styles.ctaContainer}>
            <TouchableOpacity
              style={styles.primaryCtaButton}
              activeOpacity={0.88}
              onPress={handleExplorePress}
              accessibilityRole="button"
              accessibilityLabel={BRAND_CONFIG.primaryCta}
            >
              <Text style={styles.primaryCtaText}>{BRAND_CONFIG.primaryCta}</Text>
              <View style={styles.ctaArrowCircle}>
                <Ionicons name="arrow-forward" size={18} color={COLORS.navyPrimary} />
              </View>
            </TouchableOpacity>

            <View style={styles.secondaryFooterRow}>
              <Ionicons name="location-outline" size={14} color={COLORS.goldPrimary} />
              <Text style={styles.secondaryText}>{BRAND_CONFIG.secondaryText}</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topAccentBar: {
    height: 6,
    backgroundColor: COLORS.navyPrimary,
    justifyContent: 'flex-end',
  },
  topAccentGoldLine: {
    height: 2,
    backgroundColor: COLORS.goldBright,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 32,
  },
  scrollContentTablet: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 560,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.goldLight,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    gap: 5,
  },
  verifiedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.navyPrimary,
    letterSpacing: 0.8,
  },
  permissionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.goldLight,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    gap: 12,
  },
  permissionBannerTextWrap: {
    flex: 1,
  },
  permissionBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.navyPrimary,
    marginBottom: 2,
  },
  permissionBannerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  heroCard: {
    width: '100%',
    height: 195,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: COLORS.navyPrimary,
    borderWidth: 1.5,
    borderColor: COLORS.goldBorder,
    marginBottom: 22,
    shadowColor: COLORS.navyDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 6,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlayBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 37, 71, 0.88)',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.goldBright,
    gap: 6,
  },
  heroOverlayText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.9,
  },
  copySection: {
    marginBottom: 22,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.navyPrimary,
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.goldPrimary,
    lineHeight: 22,
    marginBottom: 12,
  },
  goldDivider: {
    width: 52,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.goldBright,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textSecondary,
  },
  featuresSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  ctaContainer: {
    marginTop: 4,
    alignItems: 'center',
  },
  primaryCtaButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.navyPrimary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingLeft: 24,
    paddingRight: 16,
    borderWidth: 1.5,
    borderColor: COLORS.goldBright,
    shadowColor: COLORS.navyDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryCtaText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  ctaArrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.goldBright,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 6,
  },
  secondaryText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
});
