import React from 'react';
import { TouchableOpacity, ImageBackground, View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../styles/theme';

export const CuisineCard = ({ category, onPress }) => (
  <TouchableOpacity 
    style={styles.cuisineCard}
    onPress={() => onPress(category)}
    activeOpacity={0.9}
  >
    <ImageBackground 
      source={{ uri: category.image }} 
      style={styles.cuisineImage}
      imageStyle={{ borderRadius: 24 }}
    >
      <View style={styles.cuisineOverlay}>
        <Text style={styles.cuisineName}>{category.name}</Text>
        <Text style={styles.cuisineDesc} numberOfLines={2}>{category.description}</Text>
      </View>
    </ImageBackground>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  cuisineCard: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    backgroundColor: '#f1f5f9',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  cuisineImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  cuisineOverlay: {
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  cuisineName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  cuisineDesc: {
    fontSize: 12,
    color: '#e2e8f0',
    fontWeight: '500',
    marginTop: 2,
  },
});
