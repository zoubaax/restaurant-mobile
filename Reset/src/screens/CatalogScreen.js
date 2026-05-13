import React from 'react';
import { SafeAreaView, View, Text, ScrollView, TouchableOpacity, StatusBar, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { PageBranding } from '../components/common/PageBranding';
import { CuisineCard } from '../components/cuisine/CuisineCard';
import { COLORS } from '../styles/theme';

export const CatalogScreen = ({ categories, onSelectCategory, onBackToWelcome, onLogout, onViewFavorites }) => (
  <SafeAreaView style={styles.container}>
    <StatusBar barStyle="dark-content" />
    <Navbar onLogout={onLogout} onViewFavorites={onViewFavorites} />
    
    <View style={styles.header}>
      <TouchableOpacity onPress={onBackToWelcome} style={styles.backButton}>
        <Feather name="arrow-left" size={20} color={COLORS.text} />
      </TouchableOpacity>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.headerTitle}>Flavor Discovery</Text>
        <Text style={styles.headerSubtitle}>Choose your culinary journey</Text>
      </View>
    </View>

    {categories.length === 0 ? (
      <View style={styles.centerContainer}>
         <ActivityIndicator size="large" color={COLORS.primary} />
         <Text style={{marginTop: 10, color: COLORS.textLight}}>Loading categories...</Text>
      </View>
    ) : (
      <ScrollView contentContainerStyle={styles.catalogScroll} showsVerticalScrollIndicator={false}>
        {categories.map((category) => (
          <CuisineCard 
            key={category.id} 
            category={category} 
            onPress={onSelectCategory} 
          />
        ))}
        <PageBranding />
      </ScrollView>
    )}
    <Footer 
      categories={categories} 
      selectedCategory={null} 
      onSelectCategory={onSelectCategory} 
      onGoHome={() => {}} 
    />
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  catalogScroll: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  backButton: {
    padding: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
  },
});
