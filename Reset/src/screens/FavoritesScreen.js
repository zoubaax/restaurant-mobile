import React, { useEffect, useState } from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { COLORS } from '../styles/theme';
import { Navbar } from '../components/common/Navbar';

export const FavoritesScreen = ({ user, accessToken, onBack, onLogout }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    const { data, error } = await supabase.select('favorites', `user_id=eq.${user.id}`, accessToken);
    if (!error) {
      setFavorites(data);
    }
    setLoading(false);
  };

  const removeFavorite = async (id) => {
    const { error } = await supabase.delete('favorites', `id=eq.${id}`, accessToken);
    if (!error) {
      setFavorites(favorites.filter(item => item.id !== id));
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.meal_image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.meal_name}</Text>
        <Text style={styles.category}>{item.category}</Text>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => removeFavorite(item.id)}
      >
        <Feather name="trash-2" size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Navbar onLogout={onLogout} />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Feather name="arrow-left" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>My Favorites</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : favorites.length === 0 ? (
        <View style={styles.center}>
          <Feather name="heart" size={64} color="#e2e8f0" style={{ marginBottom: 16 }} />
          <Text style={styles.emptyText}>No favorites yet</Text>
          <TouchableOpacity style={styles.exploreButton} onPress={onBack}>
            <Text style={styles.exploreButtonText}>Explore Meals</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  exploreButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
  },
  exploreButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  list: {
    padding: 24,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 15,
    backgroundColor: '#f1f5f9',
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  category: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
