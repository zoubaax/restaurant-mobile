import React, { useState, useEffect } from 'react';
import { cuisines as initialCuisines } from './src/data/cuisines';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { CatalogScreen } from './src/screens/CatalogScreen';
import { MealExplorerScreen } from './src/screens/MealExplorerScreen';
import { FavoritesScreen } from './src/screens/FavoritesScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { supabase } from './src/lib/supabase';
import { Notification } from './src/components/common/Notification';

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
  
  // Notification state
  const [notification, setNotification] = useState({
    visible: false,
    message: '',
    type: 'success'
  });

  // Auth state
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    setCategories(initialCuisines);
  }, []);

  function handleSelectCategory(category) {
    setLoading(true);
    setSelectedCategory(category);
    setMealIndex(0);
    setShowMore(false);
    setMealDetails(null);
    
    let areaName = category.name;
    if (areaName === 'Marocain') areaName = 'Moroccan';
    if (areaName === 'American') areaName = 'United States';
    
    const API_URL = process.env.EXPO_PUBLIC_MEAL_API_URL;
    fetch(`${API_URL}/filter.php?a=${areaName}`)
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

  function toggleShowMore(idMeal) {
    if (!showMore) {
      const currentMeal = meals[mealIndex];
      if (currentMeal && currentMeal.isLocal) {
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
        const API_URL = process.env.EXPO_PUBLIC_MEAL_API_URL;
        fetch(`${API_URL}/lookup.php?i=${idMeal}`)
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

  async function handleLogin(email, password) {
    const { data, error } = await supabase.signIn(email, password);
    if (error) {
      setNotification({ visible: true, message: error.message, type: 'error' });
    } else {
      setUser(data.user);
      setNotification({ visible: true, message: 'Welcome back!', type: 'success' });
    }
  }

  async function handleRegister(email, password) {
    const { data, error } = await supabase.signUp(email, password);
    if (error) {
      setNotification({ visible: true, message: error.message, type: 'error' });
    } else {
      setNotification({ visible: true, message: 'Account created! Please login.', type: 'success' });
      setAuthMode('login');
    }
  }

  function handleLogout() {
    setUser(null);
    setNotification({ visible: true, message: 'Logged out successfully', type: 'success' });
  }

  async function handleSaveMeal(meal) {
    if (!user) {
      setNotification({ visible: true, message: 'Please login to save meals', type: 'error' });
      return;
    }

    try {
      const { data, error } = await supabase.insert('favorites', {
        meal_id: meal.idMeal,
        meal_name: meal.strMeal,
        meal_image: meal.strMealThumb,
        category: selectedCategory.name,
        user_id: user.id
      });

      if (error) throw error;
      
      setNotification({
        visible: true,
        message: 'Meal saved to favorites!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error saving meal:', error);
      setNotification({
        visible: true,
        message: 'Error: ' + error.message,
        type: 'error'
      });
    }
  }

  let content;
  if (showWelcome) {
    content = <WelcomeScreen onEnter={() => setShowWelcome(false)} />;
  } else if (!user) {
    if (authMode === 'login') {
      content = (
        <LoginScreen 
          onLogin={handleLogin} 
          onSwitchToRegister={() => setAuthMode('register')} 
        />
      );
    } else {
      content = (
        <RegisterScreen 
          onRegister={handleRegister} 
          onSwitchToLogin={() => setAuthMode('login')} 
        />
      );
    }
  } else if (showFavorites) {
    content = (
      <FavoritesScreen 
        user={user} 
        onBack={() => setShowFavorites(false)} 
        onLogout={handleLogout}
      />
    );
  } else if (!selectedCategory) {
    content = (
      <CatalogScreen 
        categories={categories} 
        onSelectCategory={handleSelectCategory} 
        onBackToWelcome={() => setShowWelcome(true)}
        onLogout={handleLogout}
        onViewFavorites={() => setShowFavorites(true)}
      />
    );
  } else {
    content = (
      <MealExplorerScreen 
        allCategories={categories}
        selectedCategory={selectedCategory}
        meals={meals}
        mealIndex={mealIndex}
        loading={loading}
        showMore={showMore}
        mealDetails={mealDetails}
        loadingDetails={loadingDetails}
        onBackToCatalog={() => setSelectedCategory(null)}
        onNextClick={() => {
          setMealIndex((mealIndex + 1) % meals.length);
          setShowMore(false);
          setMealDetails(null);
        }}
        onPrevClick={() => {
          setMealIndex((mealIndex - 1 + meals.length) % meals.length);
          setShowMore(false);
          setMealDetails(null);
        }}
        onToggleShowMore={toggleShowMore}
        onSelectCategory={handleSelectCategory}
        onGoHome={() => setSelectedCategory(null)}
        onSaveMeal={handleSaveMeal}
        onLogout={handleLogout}
        onViewFavorites={() => setShowFavorites(true)}
      />
    );
  }

  return (
    <>
      {content}
      <Notification 
        visible={notification.visible}
        message={notification.message}
        type={notification.type}
        onHide={() => setNotification({ ...notification, visible: false })}
      />
    </>
  );
}
