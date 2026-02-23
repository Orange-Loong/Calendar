import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { Button, IconButton, Divider, Card } from 'react-native-paper';

// Sample events data
const sampleEvents = {
  '2026-02-15': [{ id: '1', title: 'Meeting with team', time: '10:00 AM' }],
  '2026-02-16': [{ id: '2', title: 'Lunch with client', time: '12:30 PM' }],
  '2026-02-18': [{ id: '3', title: 'Project deadline', time: '5:00 PM' }],
};

// Sample tasks data
const sampleTasks = [
  { id: '1', title: 'Complete project proposal', completed: false },
  { id: '2', title: 'Submit expense report', completed: true },
  { id: '3', title: 'Schedule team meeting', completed: false },
];

// Format date to YYYY-MM-DD
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get marked dates for calendar
const getMarkedDates = (events) => {
  const markedDates = {};
  
  Object.keys(events).forEach(date => {
    markedDates[date] = {
      marked: true,
      dotColor: '#007AFF',
    };
  });
  
  // Mark today
  markedDates[formatDate(new Date())] = {
    ...markedDates[formatDate(new Date())],
    selected: true,
    selectedColor: '#007AFF',
  };
  
  return markedDates;
};

export default function HomeScreen() {
  const navigation = useNavigation();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Handle month change
  const handleMonthChange = (month) => {
    setCurrentMonth(new Date(month.dateString));
  };
  
  // Handle date press
  const handleDatePress = (day) => {
    navigation.navigate('EventDetail', { date: day.dateString });
  };
  
  // Handle task list press
  const handleTaskListPress = () => {
    navigation.navigate('TaskList');
  };
  
  // Handle family sharing press
  const handleFamilySharingPress = () => {
    navigation.navigate('FamilySharing');
  };
  
  // Handle points management press
  const handlePointsManagementPress = () => {
    navigation.navigate('PointsManagement');
  };
  
  // Handle schedule press
  const handleSchedulePress = () => {
    navigation.navigate('Schedule');
  };
  
  // Handle notes press
  const handleNotesPress = () => {
    navigation.navigate('Notes');
  };
  
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Digital Calendar</Text>
        <View style={styles.headerButtons}>
          <IconButton
            icon="calendar"
            size={24}
            onPress={() => {}}
          />
          <IconButton
            icon="dots-vertical"
            size={24}
            onPress={() => {}}
          />
        </View>
      </View>
      
      {/* Calendar */}
      <Card style={styles.calendarCard}>
        <Card.Content>
          <View style={styles.calendarHeader}>
            <Text style={styles.monthTitle}>
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Text>
            <View style={styles.calendarNavButtons}>
              <TouchableOpacity style={styles.navButton}>
                <Text style={styles.navButtonText}>‹</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navButton}>
                <Text style={styles.navButtonText}>›</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <Calendar
            onDayPress={handleDatePress}
            onMonthChange={handleMonthChange}
            markedDates={getMarkedDates(sampleEvents)}
            theme={{
              todayTextColor: '#007AFF',
              selectedDayBackgroundColor: '#007AFF',
              selectedDayTextColor: '#ffffff',
              arrowColor: '#007AFF',
              monthTextColor: '#333333',
              textDayFontWeight: '400',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '600',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
          />
        </Card.Content>
      </Card>
      
      {/* Today's Tasks */}
      <Card style={styles.tasksCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Tasks</Text>
            <TouchableOpacity onPress={handleTaskListPress}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {sampleTasks.map((task) => (
            <View key={task.id} style={styles.taskItem}>
              <View style={styles.taskCheckbox}>
                <Text style={styles.taskCheckboxText}>
                  {task.completed ? '✓' : ' '}
                </Text>
              </View>
              <Text style={[styles.taskTitle, task.completed && styles.taskCompleted]}>
                {task.title}
              </Text>
            </View>
          ))}
          
          <Button 
            mode="contained" 
            style={styles.addTaskButton}
            onPress={() => navigation.navigate('TaskDetail')}
          >
            Add Task
          </Button>
        </Card.Content>
      </Card>
      
      {/* Quick Actions */}
      <Card style={styles.actionsCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleFamilySharingPress}
            >
              <View style={styles.actionIcon}>
                <Text style={styles.actionIconText}>👨‍👩‍👧‍👦</Text>
              </View>
              <Text style={styles.actionText}>Family Sharing</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handlePointsManagementPress}
            >
              <View style={styles.actionIcon}>
                <Text style={styles.actionIconText}>🏆</Text>
              </View>
              <Text style={styles.actionText}>Points</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleSchedulePress}
            >
              <View style={styles.actionIcon}>
                <Text style={styles.actionIconText}>📅</Text>
              </View>
              <Text style={styles.actionText}>Schedule</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleNotesPress}
            >
              <View style={styles.actionIcon}>
                <Text style={styles.actionIconText}>📝</Text>
              </View>
              <Text style={styles.actionText}>Notes</Text>
            </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  calendarCard: {
    margin: 16,
    borderRadius: 12,
    elevation: 2,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  calendarNavButtons: {
    flexDirection: 'row',
  },
  navButton: {
    padding: 8,
  },
  navButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  tasksCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#007AFF',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  taskCheckboxText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  taskTitle: {
    fontSize: 16,
    color: '#333333',
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#999999',
  },
  addTaskButton: {
    marginTop: 8,
  },
  actionsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    alignItems: 'center',
    width: '22%',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIconText: {
    fontSize: 24,
  },
  actionText: {
    fontSize: 12,
    color: '#333333',
    textAlign: 'center',
  },
});