import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import EventDetailScreen from './src/screens/EventDetailScreen';
import TaskListScreen from './src/screens/TaskListScreen';
import FamilySharingScreen from './src/screens/FamilySharingScreen';
import TaskDetailScreen from './src/screens/TaskDetailScreen';
import PointsManagementScreen from './src/screens/PointsManagementScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import NotesScreen from './src/screens/NotesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
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
              name="Home" 
              component={HomeScreen} 
              options={{ title: 'Calendar' }}
            />
            <Stack.Screen 
              name="EventDetail" 
              component={EventDetailScreen} 
              options={{ title: 'Event Details' }}
            />
            <Stack.Screen 
              name="TaskList" 
              component={TaskListScreen} 
              options={{ title: 'Tasks' }}
            />
            <Stack.Screen 
              name="FamilySharing" 
              component={FamilySharingScreen} 
              options={{ title: 'Family Sharing' }}
            />
            <Stack.Screen 
              name="TaskDetail" 
              component={TaskDetailScreen} 
              options={{ title: 'Task Details' }}
            />
            <Stack.Screen 
              name="PointsManagement" 
              component={PointsManagementScreen} 
              options={{ title: 'Points Management' }}
            />
            <Stack.Screen 
              name="Schedule" 
              component={ScheduleScreen} 
              options={{ title: 'Schedule' }}
            />
            <Stack.Screen 
              name="Notes" 
              component={NotesScreen} 
              options={{ title: 'Notes' }}
            />
          </Stack.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}