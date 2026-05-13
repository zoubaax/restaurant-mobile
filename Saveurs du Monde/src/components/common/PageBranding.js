import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../styles/theme';

export const PageBranding = () => (
  <View style={styles.pageBranding}>
    <View style={styles.brandingLine} />
    <Text style={styles.pageBrandingText}>Restaurant Zoubaa</Text>
    <View style={styles.brandingLine} />
  </View>
);

const styles = StyleSheet.create({
  pageBranding: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 24,
  },
  brandingLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  pageBrandingText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textMuted,
    marginHorizontal: 16,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
