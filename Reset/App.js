import React, { useState, useEffect } from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  StatusBar,
  ScrollView,
  Platform,
  ImageBackground,
  ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { cuisines } from './data';

const { width } = Dimensions.get('window');

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [meals, setMeals] = useState([]);
  const [mealIndex, setMealIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [mealDetails, setMealDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    setCategories(cuisines);
  }, []);

  function handleSelectCategory(category) {
    setLoading(true);
    setSelectedCategory(category);
    setMealIndex(0);
    setShowMore(false);
    setMealDetails(null);
    
    let areaName = category.name;
    if (areaName === 'Marocain') areaName = 'Moroccan';
    
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}`)
      .then(res => res.json())
      .then(data => {
        if (data.meals && data.meals.length > 0) {
          setMeals(data.meals);
        } else {
          // Fallback to local meals from data.js
          const localMeals = category.meals.map((m, index) => ({
            strMeal: m.name,
            strMealThumb: m.url,
            idMeal: `local-${category.id}-${index}`,
            isLocal: true,
            ...m
          }));
          setMeals(localMeals);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        // Fallback on error
        const localMeals = category.meals.map((m, index) => ({
          strMeal: m.name,
          strMealThumb: m.url,
          idMeal: `local-${category.id}-${index}`,
          isLocal: true,
          ...m
        }));
        setMeals(localMeals);
        setLoading(false);
      });
  }

  function handleBackToCatalog() {
    setSelectedCategory(null);
  }

  function handleBackToWelcome() {
    setShowWelcome(true);
  }

  function handleNextClick() {
    if (mealIndex < meals.length - 1) {
      setMealIndex(mealIndex + 1);
    } else {
      setMealIndex(0);
    }
    setShowMore(false);
    setMealDetails(null);
  }

  function handlePrevClick() {
    if (mealIndex > 0) {
      setMealIndex(mealIndex - 1);
    } else {
      setMealIndex(meals.length - 1);
    }
    setShowMore(false);
    setMealDetails(null);
  }

  function toggleShowMore(idMeal) {
    if (!showMore) {
      // Check if it's a local meal
      const currentMeal = meals[mealIndex];
      if (currentMeal && currentMeal.isLocal) {
        // For local meals, we already have the details
        setMealDetails({
          strInstructions: currentMeal.description,
          strArea: selectedCategory.name,
          isLocal: true,
          ...currentMeal
        });
        setShowMore(true);
        return;
      }

      if (!mealDetails || mealDetails.idMeal !== idMeal) {
        setLoadingDetails(true);
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`)
          .then(res => res.json())
          .then(data => {
            if (data.meals && data.meals.length > 0) {
              setMealDetails(data.meals[0]);
            }
            setLoadingDetails(false);
            setShowMore(true);
          })
          .catch(err => {
            console.error(err);
            setLoadingDetails(false);
          });
        return;
      }
    }
    setShowMore(!showMore);
  }

  // --- Components ---
  const Navbar = () => (
    <View style={styles.navBar}>
      <View style={styles.navBrand}>
        <View style={styles.logoCircle}>
          <Feather name="coffee" size={16} color="#ffffff" />
        </View>
      </View>
      <TouchableOpacity style={styles.profileButton}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100' }} 
          style={styles.profileImage}
        />
      </TouchableOpacity>
    </View>
  );

  const Footer = () => (
    <View style={styles.footerContainer}>
      <View style={styles.footerTabs}>
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => setSelectedCategory(null)}
        >
          <Feather 
            name="grid" 
            size={22} 
            color={!selectedCategory ? '#e11d48' : '#94a3b8'} 
          />
          <Text style={[styles.tabText, !selectedCategory && styles.activeTabText]}>
            Explore
          </Text>
        </TouchableOpacity>

        {categories.map((cat) => {
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
              onPress={() => handleSelectCategory(cat)}
            >
              <Feather 
                name={iconName} 
                size={22} 
                color={isActive ? '#e11d48' : '#94a3b8'} 
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

  const PageBranding = () => (
    <View style={styles.pageBranding}>
      <View style={styles.brandingLine} />
      <Text style={styles.pageBrandingText}>Restaurant Zoubaa</Text>
      <View style={styles.brandingLine} />
    </View>
  );

  // --- Welcome Screen ---
  if (showWelcome) {
    return (
      <SafeAreaView style={styles.welcomeMainContainer}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Bienvenue en Restaurant Zoubaa</Text>
          <TouchableOpacity 
            style={styles.enterButton} 
            onPress={() => setShowWelcome(false)}
            activeOpacity={0.8}
          >
            <Text style={styles.enterButtonText}>Enter App</Text>
            <Feather name="arrow-right" color="#ffffff" size={20} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // --- Catalog Screen ---
  if (!selectedCategory) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Navbar />
        
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackToWelcome} style={styles.backButton}>
            <Feather name="arrow-left" size={20} color="#0f172a" />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.headerTitle}>Flavor Discovery</Text>
            <Text style={styles.headerSubtitle}>Choose your culinary journey</Text>
          </View>
        </View>

        {categories.length === 0 ? (
          <View style={styles.centerContainer}>
             <ActivityIndicator size="large" color="#e11d48" />
             <Text style={{marginTop: 10, color: '#64748b'}}>Loading categories...</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.catalogScroll} showsVerticalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity 
                key={category.id} 
                style={styles.cuisineCard}
                onPress={() => handleSelectCategory(category)}
                activeOpacity={0.9}
              >
                <ImageBackground 
                  source={{ uri: category.image }} 
                  style={styles.cuisineImage}
                  imageStyle={{ borderRadius: 20 }}
                >
                  <View style={styles.cuisineOverlay}>
                    <Text style={styles.cuisineName}>{category.name}</Text>
                    <Text style={styles.cuisineDesc} numberOfLines={2}>{category.description}</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
            <PageBranding />
          </ScrollView>
        )}
        <Footer />
      </SafeAreaView>
    );
  }

  // --- Meal Explorer Screen ---
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Navbar />
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackToCatalog} style={styles.backButton}>
            <Feather name="arrow-left" size={20} color="#0f172a" />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
             <Text style={styles.headerTitleSmall}>{selectedCategory.name} Kitchen</Text>
          </View>
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#e11d48" />
          <Text style={{marginTop: 10, color: '#64748b'}}>Loading meals...</Text>
        </View>
        <Footer />
      </SafeAreaView>
    );
  }

  if (meals.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Navbar />
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackToCatalog} style={styles.backButton}>
            <Feather name="arrow-left" size={20} color="#0f172a" />
          </TouchableOpacity>
        </View>
        <View style={styles.centerContainer}>
          <Text style={{color: '#64748b'}}>No meals found.</Text>
        </View>
        <Footer />
      </SafeAreaView>
    );
  }

  const dish = meals[mealIndex];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Navbar />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackToCatalog} style={styles.backButton}>
          <Feather name="arrow-left" size={20} color="#0f172a" />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.headerTitleSmall}>{selectedCategory.name} Kitchen</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{mealIndex + 1} / {meals.length}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: dish.strMealThumb }} 
              style={styles.image}
              resizeMode="cover"
            />
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.dishName}>{dish.strMeal}</Text>
            {mealDetails && mealDetails.strArea && (
              <Text style={styles.chefName}>Origin: {mealDetails.strArea}</Text>
            )}
            
            <TouchableOpacity 
              style={styles.moreButton} 
              onPress={() => toggleShowMore(dish.idMeal)}
              activeOpacity={0.7}
            >
              <Feather name={showMore ? "eye-off" : "eye"} size={16} color="#e11d48" style={{ marginRight: 6 }} />
              <Text style={styles.moreButtonText}>
                {showMore ? 'Hide' : 'Show'} Details
              </Text>
            </TouchableOpacity>

            {loadingDetails && (
              <ActivityIndicator size="small" color="#e11d48" style={{ marginTop: 10, alignSelf: 'flex-start' }} />
            )}

            {showMore && mealDetails && (
              <View style={styles.descriptionContainer}>
                {mealDetails.isLocal ? (
                  <>
                    <Text style={styles.sectionTitle}>Description:</Text>
                    <Text style={styles.description}>{mealDetails.strInstructions}</Text>
                    <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Specialty Chef:</Text>
                    <Text style={styles.ingredientText}>• {mealDetails.chef}</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.sectionTitle}>Ingredients:</Text>
                    {Array.from({ length: 20 }).map((_, i) => {
                      const ingredient = mealDetails[`strIngredient${i + 1}`];
                      const measure = mealDetails[`strMeasure${i + 1}`];
                      if (ingredient && ingredient.trim() !== '') {
                        return (
                          <Text key={i} style={styles.ingredientText}>
                            • {measure} {ingredient}
                          </Text>
                        );
                      }
                      return null;
                    })}
                    <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Instructions:</Text>
                    <Text style={styles.description}>{mealDetails.strInstructions}</Text>
                  </>
                )}
              </View>
            )}
          </View>
        </View>
        <PageBranding />
      </ScrollView>

      <View style={styles.mealNavigation}>
        <TouchableOpacity 
          style={[styles.navButton, styles.prevButton]} 
          onPress={handlePrevClick}
          activeOpacity={0.8}
        >
          <Feather name="chevron-left" color="#1e293b" size={24} />
          <Text style={styles.navButtonText}>Prev</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navButton, styles.nextButton]} 
          onPress={handleNextClick}
          activeOpacity={0.8}
        >
          <Text style={[styles.navButtonText, styles.nextButtonText]}>Next Dish</Text>
          <Feather name="chevron-right" color="#ffffff" size={24} />
        </TouchableOpacity>
      </View>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffcfc',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fffcfc',
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
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  headerTitleSmall: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  catalogScroll: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  cuisineCard: {
    width: '100%',
    height: 200, // Slightly taller
    marginBottom: 20,
    backgroundColor: '#f1f5f9',
    borderRadius: 24, // Matches card roundness
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
    backgroundColor: '#f1f5f9', // Fallback color
  },
  cuisineOverlay: {
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.5)', // Slightly darker for better legibility
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
  backButton: {
    padding: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
  },
  badge: {
    backgroundColor: '#ffe4e6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#e11d48',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 150,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    shadowColor: '#e11d48',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  imageContainer: {
    width: '100%',
    height: width * 0.85,
    backgroundColor: '#f1f5f9',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    padding: 24,
  },
  dishName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  chefName: {
    fontSize: 16,
    color: '#e11d48',
    fontWeight: '600',
    marginBottom: 16,
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  moreButtonText: {
    fontSize: 14,
    color: '#e11d48',
    fontWeight: '700',
  },
  descriptionContainer: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 15,
    color: '#475569',
    marginBottom: 4,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#475569',
    fontStyle: 'italic',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  navBrand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e11d48',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  navLogoText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#f1f5f9',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12, // Reverted padding as brand text moved
  },
  footerTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 12,
  },
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
    color: '#94a3b8',
    marginHorizontal: 16,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94a3b8',
    marginTop: 4,
  },
  activeTabText: {
    color: '#e11d48',
  },
  mealNavigation: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 80, // Restored original positioning
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'transparent',
  },
  navButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  prevButton: {
    backgroundColor: '#ffffff',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  nextButton: {
    backgroundColor: '#e11d48',
    flex: 2,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginHorizontal: 8,
  },
  nextButtonText: {
    color: '#ffffff',
  },
  welcomeMainContainer: {
    flex: 1,
    backgroundColor: '#fffcfc',
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
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 48,
  },
  enterButton: {
    backgroundColor: '#e11d48',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#e11d48',
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
