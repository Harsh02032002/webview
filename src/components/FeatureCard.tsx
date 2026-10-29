import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FeatureHighlight } from '../constants/theme';

interface FeatureCardProps {
  feature: FeatureHighlight;
}

export function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons name={feature.icon} size={22} color={COLORS.goldPrimary} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{feature.title}</Text>
        <Text style={styles.subtitle}>{feature.subtitle}</Text>
      </View>
      <View style={styles.checkBadge}>
        <Ionicons name="checkmark-circle" size={18} color={COLORS.navySecondary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    shadowColor: COLORS.navyDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.goldLight,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  content: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.navyPrimary,
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.textSecondary,
  },
  checkBadge: {
    opacity: 0.85,
  },
});
