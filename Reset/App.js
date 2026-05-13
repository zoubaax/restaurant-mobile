import React, { useState, useEffect } from 'react';
import { cuisines as initialCuisines } from './src/data/cuisines';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { CatalogScreen } from './src/screens/CatalogScreen';
import { MealExplorerScreen } from './src/screens/MealExplorerScreen';
import { supabase } from './src/lib/supabase';

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

  async function handleSaveMeal(meal) {
    try {
      const { data, error } = await supabase.insert('favorites', {
        meal_id: meal.idMeal,
        meal_name: meal.strMeal,
        meal_image: meal.strMealThumb,
        category: selectedCategory.name,
      });

      if (error) throw error;
      alert('Meal saved to favorites!');
    } catch (error) {
      console.error('Error saving meal:', error);
      alert('Error saving meal: ' + error.message);
    }
  }

  if (showWelcome) {
    return <WelcomeScreen onEnter={() => setShowWelcome(false)} />;
  }

  if (!selectedCategory) {
    return (
      <CatalogScreen 
        categories={categories} 
        onSelectCategory={handleSelectCategory} 
        onBackToWelcome={() => setShowWelcome(true)}
      />
    );
  }

  return (
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
    />
  );
}
