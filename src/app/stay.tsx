import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  BackHandler,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView, WebViewNavigation } from 'react-native-webview';
import type {
  FileDownloadEvent,
  ShouldStartLoadRequest,
  WebViewErrorEvent,
  WebViewHttpErrorEvent,
  WebViewProgressEvent,
} from 'react-native-webview/lib/WebViewTypes';
import { router } from 'expo-router';
import * as Network from 'expo-network';
import { Ionicons } from '@expo/vector-icons';
import { BRAND_CONFIG, COLORS } from '../constants/theme';
import { BrandHeader } from '../components/BrandHeader';
import { NetworkErrorView } from '../components/NetworkErrorView';
import { isInternalRoomForStayUrl, openExternalUrlSafely } from '../utils/urlHandler';

export default function StayWebViewScreen() {
  const webViewRef = useRef<WebView<Record<string, unknown>>>(null);
  const canGoBackRef = useRef<boolean>(false);

  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [isSlowConnection, setIsSlowConnection] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [currentUrl, setCurrentUrl] = useState<string>(BRAND_CONFIG.websiteUrl);

  // Verify network connectivity
  const checkConnectivity = useCallback(async (): Promise<boolean> => {
    try {
      const state = await Network.getNetworkStateAsync();
      if (state.isConnected === false || state.isInternetReachable === false) {
        setHasError(true);
        setIsInitialLoading(false);
        setErrorMessage('No active internet connection detected.');
        return false;
      }
      return true;
    } catch {
      return true;
    }
  }, []);

  useEffect(() => {
    let active = true;
    Network.getNetworkStateAsync()
      .then((state) => {
        if (!active) return;
        if (state.isConnected === false || state.isInternetReachable === false) {
          setHasError(true);
          setIsInitialLoading(false);
          setErrorMessage('No active internet connection detected.');
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Slow connection detector while initial page is loading
  useEffect(() => {
    if (!isInitialLoading || hasError) {
      return;
    }

    const slowTimer = setTimeout(() => {
      setIsSlowConnection(true);
    }, BRAND_CONFIG.slowConnectionThresholdMs);

    return () => clearTimeout(slowTimer);
  }, [isInitialLoading, hasError]);

  // Android Hardware Back Button handler
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBackRef.current && webViewRef.current && !hasError) {
        webViewRef.current.goBack();
        return true;
      }
      if (router.canGoBack()) {
        router.back();
        return true;
      }
      return false;
    });

    return () => subscription.remove();
  }, [hasError]);

  const handleNavigationStateChange = useCallback((navState: WebViewNavigation) => {
    canGoBackRef.current = navState.canGoBack;
    if (navState.url) {
      setCurrentUrl(navState.url);
    }
  }, []);

  const handleLoadProgress = useCallback(({ nativeEvent }: WebViewProgressEvent) => {
    setLoadProgress(nativeEvent.progress);
    if (nativeEvent.progress >= 0.85) {
      setIsInitialLoading(false);
    }
  }, []);

  const handleLoadEnd = useCallback(() => {
    setIsInitialLoading(false);
    setIsSlowConnection(false);
  }, []);

  const handleError = useCallback(({ nativeEvent }: WebViewErrorEvent) => {
    // Only trigger full error view if the main frame fails
    setHasError(true);
    setIsInitialLoading(false);
    setIsSlowConnection(false);
    setErrorMessage(
      nativeEvent.description || 'Unable to load https://www.roomforstay.com/'
    );
  }, []);

  const handleHttpError = useCallback(({ nativeEvent }: WebViewHttpErrorEvent) => {
    if (nativeEvent.statusCode >= 500 && nativeEvent.url === currentUrl) {
      setHasError(true);
      setIsInitialLoading(false);
      setErrorMessage(`Server temporarily unavailable (HTTP ${nativeEvent.statusCode}).`);
    }
  }, [currentUrl]);

  const handleShouldStartLoadWithRequest = useCallback(
    (request: ShouldStartLoadRequest): boolean => {
      const { url } = request;
      if (!url) return false;

      if (isInternalRoomForStayUrl(url)) {
        return true;
      }

      // Open external links (tel:, mailto:, whatsapp:, maps, external domains) outside WebView
      openExternalUrlSafely(url);
      return false;
    },
    []
  );

  const handleRetry = useCallback(async () => {
    setErrorMessage(undefined);
    setHasError(false);
    setIsInitialLoading(true);
    setLoadProgress(0.1);

    const online = await checkConnectivity();
    if (!online) return;

    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  }, [checkConnectivity]);

  const handleBackToWelcome = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      {/* Top Loading Progress Bar */}
      {loadProgress > 0 && loadProgress < 1 && !hasError && (
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.max(8, Math.round(loadProgress * 100))}%` },
            ]}
          />
        </View>
      )}

      {/* Main WebView Container */}
      <View style={styles.webViewContainer}>
        <WebView
          ref={webViewRef}
          source={{ uri: BRAND_CONFIG.websiteUrl }}
          style={styles.webView}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          geolocationEnabled={true}
          sharedCookiesEnabled={true}
          thirdPartyCookiesEnabled={true}
          allowsBackForwardNavigationGestures={true}
          allowsInlineMediaPlayback={true}
          allowFileAccess={true}
          allowFileAccessFromFileURLs={false}
          allowUniversalAccessFromFileURLs={false}
          mixedContentMode="never"
          pullToRefreshEnabled={true}
          setSupportMultipleWindows={false}
          startInLoadingState={false}
          originWhitelist={['https://*', 'http://*', 'tel:*', 'mailto:*', 'whatsapp:*']}
          onNavigationStateChange={handleNavigationStateChange}
          onLoadProgress={handleLoadProgress}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          onHttpError={handleHttpError}
          onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
          onFileDownload={({ nativeEvent }: FileDownloadEvent) => {
            if (nativeEvent.downloadUrl) {
              openExternalUrlSafely(nativeEvent.downloadUrl);
            }
          }}
        />

        {/* Polished Initial Loading Overlay */}
        {isInitialLoading && !hasError && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingCard}>
              <BrandHeader compact />
              <ActivityIndicator
                size="large"
                color={COLORS.goldPrimary}
                style={styles.spinner}
              />
              <Text style={styles.loadingTitle}>Loading RoomForStay...</Text>
              <Text style={styles.loadingSubtitle}>
                Connecting securely to www.roomforstay.com
              </Text>

              {isSlowConnection && (
                <View style={styles.slowConnectionBox}>
                  <Ionicons name="time-outline" size={16} color={COLORS.goldPrimary} />
                  <Text style={styles.slowConnectionText}>
                    Connection is taking longer than usual. Please wait or tap reload.
                  </Text>
                  <TouchableOpacity
                    style={styles.slowReloadButton}
                    onPress={handleRetry}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.slowReloadButtonText}>Reload Now</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Network / Website Error Overlay with Retry */}
        {hasError && (
          <NetworkErrorView
            errorMessage={errorMessage}
            onRetry={handleRetry}
            onBackToWelcome={handleBackToWelcome}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.navyPrimary,
  },
  progressBarTrack: {
    height: 3,
    width: '100%',
    backgroundColor: COLORS.navySecondary,
    zIndex: 30,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.goldBright,
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  webView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    zIndex: 15,
  },
  loadingCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: COLORS.white,
    borderRadius: 22,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    shadowColor: COLORS.navyDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  spinner: {
    marginTop: 22,
    marginBottom: 14,
  },
  loadingTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.navyPrimary,
    marginBottom: 4,
  },
  loadingSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  slowConnectionBox: {
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    alignItems: 'center',
    width: '100%',
  },
  slowConnectionText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 12,
    lineHeight: 18,
  },
  slowReloadButton: {
    backgroundColor: COLORS.navyPrimary,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.goldBright,
  },
  slowReloadButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
});
