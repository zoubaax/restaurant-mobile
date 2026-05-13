import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../styles/theme';

export const Navbar = ({ onLogout, onViewFavorites }) => (
  <View style={styles.navBar}>
    <View style={styles.navBrand}>
      <TouchableOpacity style={styles.logoCircle} onPress={onLogout}>
        <Feather name="log-out" size={16} color="#ffffff" />
      </TouchableOpacity>
    </View>
    <View style={styles.navActions}>
      <TouchableOpacity style={styles.actionButton} onPress={onViewFavorites}>
        <Feather name="heart" size={20} color={COLORS.primary} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.profileButton}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100' }} 
          style={styles.profileImage}
        />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  navBrand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#f8fafc',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
});
