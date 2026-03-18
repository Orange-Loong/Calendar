import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, TextInput, Card, SegmentedButtons } from 'react-native-paper';
import { useMeals } from '../context/MealContext';

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function MealDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { addMeal, updateMeal, meals } = useMeals();
  const { mealId } = route.params || {};

  const [mealData, setMealData] = useState({
    title: '',
    content: '',
    date: formatDate(new Date()),
    category: 'Meal',
  });

  useEffect(() => {
    if (mealId) {
      const existingMeal = meals.find(m => m.id === mealId);
      if (existingMeal) {
        setMealData(existingMeal);
      }
    }
  }, [mealId, meals]);

  const handleInputChange = (field, value) => {
    setMealData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (!mealData.title.trim()) {
      return;
    }
    
    if (mealId) {
      updateMeal(mealId, mealData);
    } else {
      addMeal(mealData);
    }
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              mode="outlined"
              style={styles.input}
              value={mealData.title}
              onChangeText={(text) => handleInputChange('title', text)}
              placeholder="Enter title"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Date</Text>
            <TextInput
              mode="outlined"
              style={styles.input}
              value={mealData.date}
              onChangeText={(text) => handleInputChange('date', text)}
              placeholder="YYYY-MM-DD"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Category</Text>
            <SegmentedButtons
              value={mealData.category}
              onValueChange={(value) => handleInputChange('category', value)}
              buttons={[
                { value: 'Meal', label: 'Meal' },
                { value: 'Grocery', label: 'Grocery' },
              ]}
              style={styles.segmentedButtons}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Content</Text>
            <TextInput
              mode="outlined"
              style={[styles.input, styles.textArea]}
              value={mealData.content}
              onChangeText={(text) => handleInputChange('content', text)}
              placeholder="Enter your content..."
              multiline
              numberOfLines={6}
            />
          </View>

          <View style={styles.actionButtons}>
            <Button 
              mode="outlined" 
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              Cancel
            </Button>
            <Button 
              mode="contained" 
              style={styles.saveButton}
              onPress={handleSave}
              disabled={!mealData.title.trim()}
            >
              {mealId ? 'Update' : 'Save'}
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    borderRadius: 12,
    elevation: 2,
  },
  formGroup: {
    marginVertical: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
  },
  textArea: {
    minHeight: 120,
  },
  segmentedButtons: {
    marginVertical: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#6750A4',
  },
});
