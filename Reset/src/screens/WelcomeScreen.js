import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StatusBar, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../styles/theme';

export const WelcomeScreen = ({ onEnter }) => (
  <SafeAreaView style={styles.welcomeMainContainer}>
    <StatusBar barStyle="dark-content" />
    <View style={styles.welcomeContainer}>
      <Text style={styles.welcomeText}>Bienvenue en Restaurant Zoubaa</Text>
      <TouchableOpacity 
        style={styles.enterButton} 
        onPress={onEnter}
        activeOpacity={0.8}
      >
        <Text style={styles.enterButtonText}>Enter App</Text>
        <Feather name="arrow-right" color="#ffffff" size={20} style={{ marginLeft: 8 }} />
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  welcomeMainContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  welcomeText: {
    fontSize: 42,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 48,
  },
  enterButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  enterButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
});
