import React, { useEffect } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as NavigationBar from 'expo-navigation-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';

SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore if already prevented
});

export default function RootLayout() {
  useEffect(() => {
    async function configureSystemBars() {
      if (Platform.OS === 'android') {
        try {
          NavigationBar.setStyle('dark');
        } catch {
          // Edge-to-edge or unsupported Android API level fallback
        }
      }
      await SplashScreen.hideAsync().catch(() => {});
    }

    configureSystemBars();
  }, []);

  return (
    <SafeAreaProvider style={styles.root}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
          animation: 'fade_from_bottom',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="stay" />
      </Stack>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

