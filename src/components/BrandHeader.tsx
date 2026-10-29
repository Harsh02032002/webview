import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

interface BrandHeaderProps {
  compact?: boolean;
}

export function BrandHeader({ compact = false }: BrandHeaderProps) {
  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      <View style={[styles.emblemOuter, compact && styles.emblemOuterCompact]}>
        <View style={styles.emblemInner}>
          <Ionicons
            name="bed"
            size={compact ? 18 : 22}
            color={COLORS.goldBright}
          />
        </View>
      </View>
      <View style={styles.textGroup}>
        <View style={styles.brandRow}>
          <Text style={[styles.brandPrimary, compact && styles.brandPrimaryCompact]}>
            Room
          </Text>
          <Text style={[styles.brandAccent, compact && styles.brandPrimaryCompact]}>
            ForStay
          </Text>
        </View>
        {!compact && (
          <Text style={styles.tagline}>PREMIUM HOSPITALITY & STAYS</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerCompact: {
    gap: 8,
  },
  emblemOuter: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.navyPrimary,
    borderWidth: 1.5,
    borderColor: COLORS.goldBright,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: COLORS.navyDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 4,
  },
  emblemOuterCompact: {
    width: 36,
    height: 36,
    borderRadius: 10,
    marginRight: 8,
  },
  emblemInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textGroup: {
    justifyContent: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  brandPrimary: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.navyPrimary,
    letterSpacing: 0.3,
  },
  brandAccent: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.goldPrimary,
    letterSpacing: 0.3,
  },
  brandPrimaryCompact: {
    fontSize: 18,
  },
  tagline: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1.4,
    marginTop: 2,
  },
});
