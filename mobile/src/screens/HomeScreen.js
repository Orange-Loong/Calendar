import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card } from 'react-native-paper';
import { useTasks } from '../context/TasksContext';

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getDaysBetween = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);
  return Math.round((secondDate - firstDate) / oneDay);
};

export default function HomeScreen() {
  const navigation = useNavigation();
  const { tasks, toggleTask } = useTasks();
  const today = formatDate(new Date());

  const getTasksByTimeframe = () => {
    const todayTasks = [];
    const threeDaysTasks = [];
    const sevenDaysTasks = [];

    tasks.forEach(task => {
      const daysUntil = getDaysBetween(today, task.endDate);
      if (daysUntil === 0) {
        todayTasks.push(task);
      } else if (daysUntil > 0 && daysUntil <= 3) {
        threeDaysTasks.push(task);
      } else if (daysUntil > 3 && daysUntil <= 7) {
        sevenDaysTasks.push(task);
      }
    });

    return { todayTasks, threeDaysTasks, sevenDaysTasks };
  };

  const { todayTasks, threeDaysTasks, sevenDaysTasks } = getTasksByTimeframe();

  const renderTaskItem = (task) => (
    <TouchableOpacity 
      key={task.id} 
      style={styles.taskItem}
      onPress={() => navigation.navigate('TaskDetailView', { taskId: task.id })}
    >
      <TouchableOpacity 
        style={styles.taskCheckbox}
        onPress={() => toggleTask(task.id)}
      >
        <Text style={styles.taskCheckboxText}>
          {task.completed ? '✓' : ' '}
        </Text>
      </TouchableOpacity>
      <View style={styles.taskContent}>
        <Text style={[styles.taskTitle, task.completed && styles.taskCompleted]}>
          {task.title}
          {task.isRecurring && <Text style={styles.recurringTag}> ⟳</Text>}
        </Text>
        <Text style={styles.taskDate}>
          {task.startDate === task.endDate ? task.endDate : `${task.startDate} - ${task.endDate}`}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderSection = (title, tasks) => {
    if (tasks.length === 0) return null;
    
    return (
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>{title}</Text>
          {tasks.map(renderTaskItem)}
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Tasks</Text>
      </View>

      <ScrollView style={styles.content}>
        {renderSection('Today', todayTasks)}
        {renderSection('Next 3 Days', threeDaysTasks)}
        {renderSection('This Week', sevenDaysTasks)}
        
        <View style={styles.spacer} />
      </ScrollView>

      <View style={styles.addButtonContainer}>
        <Button 
          mode="contained" 
          style={styles.addButton}
          icon="plus"
          onPress={() => navigation.navigate('TaskDetail')}
        >
          Add Task
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
  content: {
    flex: 1,
    padding: 16,
  },
  sectionCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  taskCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6750A4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  taskCheckboxText: {
    color: '#6750A4',
    fontWeight: 'bold',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
  },
  taskDate: {
    fontSize: 12,
    color: '#999999',
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#999999',
  },
  recurringTag: {
    fontSize: 14,
    color: '#6750A4',
  },
  addButtonContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  addButton: {
    borderRadius: 20,
    paddingVertical: 8,
    backgroundColor: '#D0BCFF',
  },
  spacer: {
    height: 20,
  },
});
