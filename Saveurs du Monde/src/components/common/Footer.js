import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../styles/theme';

export const Footer = ({ categories, selectedCategory, onSelectCategory, onGoHome }) => (
  <View style={styles.footerContainer}>
    <View style={styles.footerTabs}>
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={onGoHome}
      >
        <Feather 
          name="grid" 
          size={22} 
          color={!selectedCategory ? COLORS.primary : COLORS.secondary} 
        />
        <Text style={[styles.tabText, !selectedCategory && styles.activeTabText]}>
          Explore
        </Text>
      </TouchableOpacity>

      {categories.slice(0, 4).map((cat) => {
        let iconName = 'coffee';
        if (cat.id === 'American') iconName = 'pie-chart';
        if (cat.id === 'Marocain') iconName = 'sun';
        if (cat.id === 'Italian') iconName = 'triangle';
        if (cat.id === 'Japanese') iconName = 'target';

        const isActive = selectedCategory?.id === cat.id;

        return (
          <TouchableOpacity 
            key={cat.id}
            style={styles.tabItem} 
            onPress={() => onSelectCategory(cat)}
          >
            <Feather 
              name={iconName} 
              size={22} 
              color={isActive ? COLORS.primary : COLORS.secondary} 
            />
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  footerTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 12,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.secondary,
    marginTop: 4,
  },
  activeTabText: {
    color: COLORS.primary,
  },
});
