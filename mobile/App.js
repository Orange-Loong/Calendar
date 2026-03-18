import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { TasksProvider } from './src/context/TasksContext';
import { NotesProvider } from './src/context/NotesContext';
import { MealProvider } from './src/context/MealContext';
import { PointsProvider } from './src/context/PointsContext';
import { FamilyProvider } from './src/context/FamilyContext';

import HomeScreen from './src/screens/HomeScreen';
import TaskDetailScreen from './src/screens/TaskDetailScreen';
import NotesScreen from './src/screens/NotesScreen';
import MealDetailScreen from './src/screens/MealDetailScreen';
import NoteDetailScreen from './src/screens/NoteDetailScreen';
import FamilySharingScreen from './src/screens/FamilySharingScreen';
import PointsManagementScreen from './src/screens/PointsManagementScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#6750A4',
        tabBarInactiveTintColor: '#666666',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e0e0e0',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Calendar" 
        component={ScheduleScreen} 
        options={{
          tabBarLabel: 'Calendar',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Family" 
        component={FamilySharingScreen} 
        options={{
          tabBarLabel: 'Family',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Tasks" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Tasks',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="checkbox-marked-circle" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Achievements" 
        component={PointsManagementScreen} 
        options={{
          tabBarLabel: 'Achievements',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="trophy" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Meal&Grocery" 
        component={NotesScreen} 
        options={{
          tabBarLabel: 'Meal&Grocery',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="food" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <TasksProvider>
      <NotesProvider>
        <MealProvider>
          <PointsProvider>
            <FamilyProvider>
              <SafeAreaProvider>
                <PaperProvider>
                  <NavigationContainer>
                    <Stack.Navigator
                      initialRouteName="Main"
                      screenOptions={{
                        headerStyle: {
                          backgroundColor: '#f8f9fa',
                        },
                        headerTintColor: '#333',
                        headerTitleStyle: {
                          fontWeight: 'bold',
                        },
                      }}
                    >
                      <Stack.Screen 
                        name="Main" 
                        component={MainTabs} 
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen 
                        name="TaskDetail" 
                        component={TaskDetailScreen} 
                        options={{ title: 'Add Task' }}
                      />
                      <Stack.Screen 
                      name="TaskDetailView" 
                      component={TaskDetailScreen} 
                      options={{ title: 'Task Details' }}
                    />
                    <Stack.Screen 
                      name="MealDetail" 
                      component={MealDetailScreen} 
                      options={{ title: 'Add Meal&Grocery' }}
                    />
                    <Stack.Screen 
                      name="NoteDetail" 
                      component={NoteDetailScreen} 
                      options={{ title: 'Add Note' }}
                    />
                    </Stack.Navigator>
                    <StatusBar style="auto" />
                  </NavigationContainer>
                </PaperProvider>
              </SafeAreaProvider>
            </FamilyProvider>
          </PointsProvider>
        </MealProvider>
      </NotesProvider>
    </TasksProvider>
  );
}
