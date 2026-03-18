import React, { createContext, useState, useContext } from 'react';

const initialMeals = [
  { id: '1', title: 'Weekly Meal Plan', content: 'Monday: Pasta\nTuesday: Chicken Stir-fry\nWednesday: Salad\nThursday: Fish\nFriday: Pizza', date: '2026-02-20', category: 'Meal' },
  { id: '2', title: 'Grocery List', content: 'Milk, Bread, Eggs, Apples, Chicken, Rice, Vegetables', date: '2026-02-19', category: 'Grocery' },
  { id: '3', title: 'Lunch Menu', content: 'Sandwiches, Soup, Fruit salad', date: '2026-02-18', category: 'Meal' },
  { id: '4', title: 'Weekend Shopping', content: 'Snacks, Drinks, Party supplies', date: '2026-02-17', category: 'Grocery' },
  { id: '5', title: 'Dinner Recipes', content: 'Ingredients for beef stew, mashed potatoes, green beans', date: '2026-02-15', category: 'Meal' },
];

const MealContext = createContext();

export function MealProvider({ children }) {
  const [meals, setMeals] = useState(initialMeals);

  const addMeal = (meal) => {
    const newMeal = {
      ...meal,
      id: Date.now().toString(),
    };
    setMeals([newMeal, ...meals]);
  };

  const updateMeal = (mealId, updatedMeal) => {
    setMeals(meals.map(meal => 
      meal.id === mealId ? { ...meal, ...updatedMeal } : meal
    ));
  };

  const deleteMeal = (mealId) => {
    setMeals(meals.filter(meal => meal.id !== mealId));
  };

  return (
    <MealContext.Provider value={{ meals, addMeal, updateMeal, deleteMeal }}>
      {children}
    </MealContext.Provider>
  );
}

export function useMeals() {
  const context = useContext(MealContext);
  if (!context) {
    throw new Error('useMeals must be used within a MealProvider');
  }
  return context;
}
