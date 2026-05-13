import React from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar, 
  StyleSheet, 
  Platform, 
  ActivityIndicator,
  Image,
  Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { PageBranding } from '../components/common/PageBranding';
import { COLORS } from '../styles/theme';

const { width } = Dimensions.get('window');

export const MealExplorerScreen = ({ 
  selectedCategory, 
  meals, 
  mealIndex, 
  loading, 
  showMore, 
  mealDetails, 
  loadingDetails,
  onBackToCatalog, 
  onNextClick, 
  onPrevClick, 
  onToggleShowMore,
  onSelectCategory,
  onGoHome,
  allCategories,
  onSaveMeal,
  onLogout,
  onViewFavorites
}) => {
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Navbar onLogout={onLogout} onViewFavorites={onViewFavorites} />
        <View style={styles.header}>
          <TouchableOpacity onPress={onBackToCatalog} style={styles.backButton}>
            <Feather name="arrow-left" size={20} color={COLORS.text} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
             <Text style={styles.headerTitleSmall}>{selectedCategory.name} Kitchen</Text>
          </View>
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{marginTop: 10, color: COLORS.textLight}}>Loading meals...</Text>
        </View>
        <Footer 
          categories={allCategories} 
          selectedCategory={selectedCategory} 
          onSelectCategory={onSelectCategory} 
          onGoHome={onGoHome} 
        />
      </SafeAreaView>
    );
  }

  if (meals.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Navbar onLogout={onLogout} onViewFavorites={onViewFavorites} />
        <View style={styles.header}>
          <TouchableOpacity onPress={onBackToCatalog} style={styles.backButton}>
            <Feather name="arrow-left" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.centerContainer}>
          <Text style={{color: COLORS.textLight}}>No meals found.</Text>
        </View>
        <Footer 
          categories={allCategories} 
          selectedCategory={selectedCategory} 
          onSelectCategory={onSelectCategory} 
          onGoHome={onGoHome} 
        />
      </SafeAreaView>
    );
  }

  const dish = meals[mealIndex];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Navbar onLogout={onLogout} onViewFavorites={onViewFavorites} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackToCatalog} style={styles.backButton}>
          <Feather name="arrow-left" size={20} color={COLORS.text} />
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
             {mealDetails && (mealDetails.strArea || selectedCategory.name) && (
              <Text style={styles.chefName}>Origin: {mealDetails.strArea || selectedCategory.name}</Text>
            )}
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.moreButton} 
                onPress={() => onToggleShowMore(dish.idMeal)}
                activeOpacity={0.7}
              >
                <Feather name={showMore ? "eye-off" : "eye"} size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
                <Text style={styles.moreButtonText}>
                  {showMore ? 'Hide' : 'Show'} Details
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={() => onSaveMeal(dish)}
                activeOpacity={0.7}
              >
                <Feather name="heart" size={18} color={COLORS.primary} />
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>

            {loadingDetails && (
              <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: 10, alignSelf: 'flex-start' }} />
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
          onPress={onPrevClick}
          activeOpacity={0.8}
        >
          <Feather name="chevron-left" color={COLORS.text} size={24} />
          <Text style={styles.navButtonText}>Prev</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navButton, styles.nextButton]} 
          onPress={onNextClick}
          activeOpacity={0.8}
        >
          <Text style={[styles.navButtonText, styles.nextButtonText]}>Next Dish</Text>
          <Feather name="chevron-right" color="#ffffff" size={24} />
        </TouchableOpacity>
      </View>
      <Footer 
        categories={allCategories} 
        selectedCategory={selectedCategory} 
        onSelectCategory={onSelectCategory} 
        onGoHome={onGoHome} 
      />
    </SafeAreaView>
  );
};

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
  headerTitleSmall: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  backButton: {
    padding: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
  },
  badge: {
    backgroundColor: COLORS.badgeBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.badgeText,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 150,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
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
    color: COLORS.primary,
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
    color: COLORS.primary,
    fontWeight: '700',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.badgeBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  saveButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
    marginLeft: 6,
  },
  descriptionContainer: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
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
  mealNavigation: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 80,
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
    backgroundColor: COLORS.surface,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    flex: 2,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginHorizontal: 8,
  },
  nextButtonText: {
    color: '#ffffff',
  },
});
