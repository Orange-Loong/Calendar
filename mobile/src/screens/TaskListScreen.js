import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, Divider, IconButton, Menu } from 'react-native-paper';
import { useTasks } from '../context/TasksContext';

export default function TaskListScreen() {
  const navigation = useNavigation();
  const { tasks, toggleTask, deleteTask } = useTasks();
  const [filter, setFilter] = useState('all');
  const [menuVisible, setMenuVisible] = useState(null);
  
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };
  
  const handleAddTask = () => {
    navigation.navigate('TaskDetail');
  };
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });
  
  const handleDeleteTask = (taskId) => {
    deleteTask(taskId);
    setMenuVisible(null);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => handleFilterChange('all')}
        >
          <Text style={[styles.filterButtonText, filter === 'all' && styles.filterButtonTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'pending' && styles.filterButtonActive]}
          onPress={() => handleFilterChange('pending')}
        >
          <Text style={[styles.filterButtonText, filter === 'pending' && styles.filterButtonTextActive]}>
            Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'completed' && styles.filterButtonActive]}
          onPress={() => handleFilterChange('completed')}
        >
          <Text style={[styles.filterButtonText, filter === 'completed' && styles.filterButtonTextActive]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.taskListContainer}>
        {filteredTasks.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>No tasks found.</Text>
              <Text style={styles.emptySubText}>Add a new task to get started.</Text>
            </Card.Content>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <Card key={task.id} style={styles.taskCard}>
              <Card.Content>
                <View style={styles.taskItem}>
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
                    </Text>
                    <Text style={styles.taskDueDate}>Due: {task.endDate}</Text>
                  </View>
                  <Menu
                    visible={menuVisible === task.id}
                    onDismiss={() => setMenuVisible(null)}
                    anchor={
                      <TouchableOpacity onPress={() => setMenuVisible(task.id)} style={styles.menuButton}>
                        <Text style={styles.menuIcon}>⋮</Text>
                      </TouchableOpacity>
                    }
                  >
                    <Menu.Item onPress={() => handleDeleteTask(task.id)} title="Delete" />
                  </Menu>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
      
      <View style={styles.addTaskContainer}>
        <Button 
          mode="contained" 
          style={styles.addTaskButton}
          icon="plus"
          onPress={handleAddTask}
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666666',
  },
  filterButtonTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  taskListContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  taskCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 1,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskCheckbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  taskCheckboxText: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#999999',
  },
  taskDueDate: {
    fontSize: 14,
    color: '#666666',
  },
  menuButton: {
    padding: 8,
    marginLeft: 8,
  },
  menuIcon: {
    fontSize: 20,
    color: '#666666',
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
  addTaskContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  addTaskButton: {
    borderRadius: 12,
  },
});
