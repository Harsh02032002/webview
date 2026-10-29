import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { BrandHeader } from './BrandHeader';

interface NetworkErrorViewProps {
  errorMessage?: string;
  onRetry: () => void;
  onBackToWelcome: () => void;
}

export function NetworkErrorView({
  errorMessage,
  onRetry,
  onBackToWelcome,
}: NetworkErrorViewProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.brandWrapper}>
          <BrandHeader compact />
        </View>

        <View style={styles.iconCircle}>
          <Ionicons name="cloud-offline-outline" size={42} color={COLORS.goldPrimary} />
        </View>

        <Text style={styles.title}>Connection Interrupted</Text>
        <Text style={styles.description}>
          We could not connect to RoomForStay right now. Please verify your internet
          connection and try again.
        </Text>

        {errorMessage ? (
          <View style={styles.diagnosticBox}>
            <Ionicons name="information-circle-outline" size={16} color={COLORS.textMuted} />
            <Text style={styles.diagnosticText} numberOfLines={2}>
              {errorMessage}
            </Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.retryButton}
          activeOpacity={0.85}
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel="Retry loading RoomForStay"
        >
          <Ionicons name="refresh" size={18} color={COLORS.white} />
          <Text style={styles.retryButtonText}>Retry Connection</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.75}
          onPress={onBackToWelcome}
          accessibilityRole="button"
          accessibilityLabel="Back to Welcome Screen"
        >
          <Text style={styles.secondaryButtonText}>Back to Welcome Screen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    zIndex: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    shadowColor: COLORS.navyDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  brandWrapper: {
    marginBottom: 20,
  },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: COLORS.goldLight,
    borderWidth: 1.5,
    borderColor: COLORS.goldBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.navyPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 18,
  },
  diagnosticBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 22,
    gap: 6,
  },
  diagnosticText: {
    fontSize: 12,
    color: COLORS.textMuted,
    flexShrink: 1,
  },
  retryButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.navyPrimary,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: COLORS.goldBright,
    gap: 8,
    shadowColor: COLORS.navyDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  secondaryButtonText: {
    color: COLORS.navySecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});
