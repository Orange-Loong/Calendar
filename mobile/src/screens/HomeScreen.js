import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card } from 'react-native-paper';
import { useTasks } from '../context/TasksContext';
import { useNotes } from '../context/NotesContext';

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function HomeScreen() {
  const navigation = useNavigation();
  const { tasks, toggleTask } = useTasks();
  const { notes } = useNotes();
  const today = formatDate(new Date());

  const getTodayItemsByType = () => {
    const taskItems = tasks
      .filter(task => task.endDate === today && (task.taskType === 'task' || !task.taskType))
      .map(task => ({ ...task, type: 'task' }));

    const scheduleItems = tasks
      .filter(task => {
        if (task.taskType !== 'schedule') return false;
        const startDate = task.startDate || task.endDate;
        const endDate = task.endDate;
        const targetDate = new Date(today);
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (targetDate < start || targetDate > end) return false;
        
        if (task.recurrence === 'weekly') {
          return targetDate.getDay() === start.getDay();
        } else if (task.recurrence === 'monthly') {
          return targetDate.getDate() === start.getDate();
        } else {
          return true;
        }
      })
      .map(task => ({ ...task, type: 'schedule' }));

    const noteItems = notes
      .filter(note => note.date === today)
      .map(note => ({ ...note, type: 'note' }));

    return {
      tasks: taskItems,
      schedules: scheduleItems,
      notes: noteItems,
    };
  };

  const { tasks: todayTasks, schedules, notes: todayNotes } = getTodayItemsByType();

  const renderSection = (title, items, color) => {
    if (items.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={[styles.sectionHeader, { backgroundColor: color }]}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionCount}>{items.length}</Text>
        </View>
        {items.map((item) => (
          <TouchableOpacity
            key={`${item.type}-${item.id}`}
            style={styles.itemContainer}
            onPress={() => {
              if (item.type === 'note') {
                navigation.navigate('TaskDetailView', { noteId: item.id });
              } else {
                navigation.navigate('TaskDetailView', { taskId: item.id });
              }
            }}
          >
            {item.type === 'task' && (
              <TouchableOpacity
                style={styles.taskCheckbox}
                onPress={() => toggleTask(item.id)}
              >
                <Text style={styles.taskCheckboxText}>
                  {item.completed ? '✓' : ' '}
                </Text>
              </TouchableOpacity>
            )}
            <View style={styles.itemContent}>
              <View style={styles.itemHeader}>
                <Text style={[styles.itemTitle, item.completed && styles.itemCompleted]}>
                  {item.title}
                </Text>
                {item.type === 'schedule' && item.isRecurring && (
                  <Text style={styles.recurringTag}>⟳ {item.recurrence}</Text>
                )}
              </View>
              {item.type === 'note' && (
                <Text style={styles.itemContentText} numberOfLines={2}>
                  {item.content}
                </Text>
              )}
              {item.startTime && (
                <Text style={styles.itemTime}>⏰ {item.startTime}</Text>
              )}
              {item.type === 'task' && item.completed && (
                <Text style={styles.completedTag}>✓ Completed</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Today</Text>
        <Text style={styles.headerDate}>{today}</Text>
      </View>

      <ScrollView style={styles.content}>
        {renderSection('Tasks', todayTasks, '#6750A4')}
        {renderSection('Schedules', schedules, '#FF9800')}
        {renderSection('Notes', todayNotes, '#4CAF50')}

        {todayTasks.length === 0 && schedules.length === 0 && todayNotes.length === 0 && (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>No items for today</Text>
              <Text style={styles.emptySubText}>Add tasks, schedules, or notes</Text>
            </Card.Content>
          </Card>
        )}

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
  headerDate: {
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  sectionCount: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  itemCompleted: {
    textDecorationLine: 'line-through',
    color: '#999999',
  },
  recurringTag: {
    fontSize: 12,
    color: '#6750A4',
    marginLeft: 8,
  },
  completedTag: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 4,
  },
  itemContentText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  itemTime: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
  emptyCard: {
    marginTop: 48,
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
  spacer: {
    height: 80,
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
});
