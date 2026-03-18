import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, IconButton, Menu, Portal } from 'react-native-paper';
import { useMeals } from '../context/MealContext';

const categories = ['All', 'Meal', 'Grocery'];

export default function NotesScreen() {
  const navigation = useNavigation();
  const { meals, deleteMeal } = useMeals();
  const [filter, setFilter] = useState('All');
  const [expandedMealId, setExpandedMealId] = useState(null);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);

  const handleFilterChange = (category) => {
    setFilter(category);
    setCategoryMenuVisible(false);
  };

  const filteredMeals = meals.filter(meal => {
    if (filter === 'All') return true;
    return meal.category === filter;
  });

  const handleMealPress = (mealId) => {
    setExpandedMealId(expandedMealId === mealId ? null : mealId);
  };

  const handleAddMeal = () => {
    navigation.navigate('MealDetail');
  };

  const handleEditMeal = (mealId) => {
    navigation.navigate('MealDetail', { mealId });
  };

  const handleDeleteMeal = (mealId) => {
    deleteMeal(mealId);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Meal': '#4CAF50',
      'Grocery': '#2196F3',
    };
    return colors[category] || '#607D8B';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meal&Grocery</Text>
      </View>

      <View style={styles.categoryContainer}>
        <Menu
          visible={categoryMenuVisible}
          onDismiss={() => setCategoryMenuVisible(false)}
          anchor={
            <TouchableOpacity
              style={styles.categoryDropdown}
              onPress={() => setCategoryMenuVisible(true)}
            >
              <Text style={styles.categoryDropdownText}>{filter}</Text>
              <Text style={styles.categoryDropdownIcon}>▼</Text>
            </TouchableOpacity>
          }
          contentStyle={styles.menuContent}
        >
          {categories.map((category) => (
            <Menu.Item
              key={category}
              onPress={() => handleFilterChange(category)}
              title={category}
              titleStyle={styles.menuItemTitle}
            />
          ))}
        </Menu>
      </View>

      <ScrollView style={styles.mealsListContainer}>
        {filteredMeals.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>No items found.</Text>
              <Text style={styles.emptySubText}>Add a meal or grocery item to get started.</Text>
            </Card.Content>
          </Card>
        ) : (
          filteredMeals.map((meal) => (
            <Card 
              key={meal.id} 
              style={styles.mealCard}
              onPress={() => handleMealPress(meal.id)}
            >
              <Card.Content>
                <View style={styles.mealHeader}>
                  <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(meal.category) }]}>
                    <Text style={styles.categoryBadgeText}>{meal.category}</Text>
                  </View>
                  <Text style={styles.mealDate}>{meal.date}</Text>
                </View>
                <Text style={styles.mealTitle}>{meal.title}</Text>
                <Text 
                  style={styles.mealContent} 
                  numberOfLines={expandedMealId === meal.id ? undefined : 2}
                >
                  {meal.content}
                </Text>
                {expandedMealId === meal.id && (
                  <View style={styles.mealActions}>
                    <IconButton
                      icon="pencil"
                      size={20}
                      onPress={() => handleEditMeal(meal.id)}
                    />
                    <IconButton
                      icon="delete"
                      size={20}
                      onPress={() => handleDeleteMeal(meal.id)}
                    />
                  </View>
                )}
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      <View style={styles.addMealContainer}>
        <Button
          mode="contained"
          style={styles.addMealButton}
          icon="plus"
          onPress={handleAddMeal}
        >
          Add Item
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
  },
  categoryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoryDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    minHeight: 44,
  },
  categoryDropdownText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  categoryDropdownIcon: {
    fontSize: 12,
    color: '#666666',
  },
  menuContent: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    maxWidth: 200,
  },
  menuItemTitle: {
    color: '#333333',
    fontSize: 14,
  },
  mealsListContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  mealCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 1,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  mealDate: {
    fontSize: 12,
    color: '#999999',
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  mealContent: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  mealActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
  },
  emptyCard: {
    marginTop: 48,
    marginHorizontal: 32,
    paddingVertical: 48,
    borderRadius: 12,
    elevation: 1,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  addMealContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  addMealButton: {
    borderRadius: 12,
  },
});
