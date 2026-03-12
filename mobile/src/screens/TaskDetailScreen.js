import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, TextInput, Card, Divider, SegmentedButtons } from 'react-native-paper';
import { useTasks } from '../context/TasksContext';

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function TaskDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { addTask, updateTask, tasks } = useTasks();
  const { taskId } = route.params || {};

  const [task, setTask] = useState({
    title: '',
    startDate: formatDate(new Date()),
    endDate: formatDate(new Date()),
    isRecurring: false,
    recurrence: 'none',
    completed: false,
  });

  useEffect(() => {
    if (taskId) {
      const existingTask = tasks.find(t => t.id === taskId);
      if (existingTask) {
        setTask(existingTask);
      }
    }
  }, [taskId, tasks]);

  const handleInputChange = (field, value) => {
    setTask(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (!task.title.trim()) {
      return;
    }

    if (taskId) {
      updateTask(taskId, task);
    } else {
      addTask({
        ...task,
        completed: false,
      });
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
            <Text style={styles.label}>Task Title</Text>
            <TextInput
              mode="outlined"
              style={styles.input}
              value={task.title}
              onChangeText={(text) => handleInputChange('title', text)}
              placeholder="What needs to be done?"
              autoFocus
            />
          </View>

          <Divider style={styles.divider} />

          <View style={styles.formGroup}>
            <Text style={styles.label}>Date Range</Text>
            <View style={styles.dateContainer}>
              <View style={styles.dateHalf}>
                <Text style={styles.subLabel}>Start Date</Text>
                <TextInput
                  mode="outlined"
                  style={styles.input}
                  value={task.startDate}
                  onChangeText={(text) => handleInputChange('startDate', text)}
                  placeholder="YYYY-MM-DD"
                />
              </View>
              <View style={styles.dateHalf}>
                <Text style={styles.subLabel}>End Date</Text>
                <TextInput
                  mode="outlined"
                  style={styles.input}
                  value={task.endDate}
                  onChangeText={(text) => handleInputChange('endDate', text)}
                  placeholder="YYYY-MM-DD"
                />
              </View>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.formGroup}>
            <Text style={styles.label}>Repeat</Text>
            <SegmentedButtons
              value={task.recurrence}
              onValueChange={(value) => {
                handleInputChange('recurrence', value);
                handleInputChange('isRecurring', value !== 'none');
              }}
              buttons={[
                { value: 'none', label: 'No' },
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
              ]}
              style={styles.segmentedButtons}
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
              disabled={!task.title.trim()}
            >
              {taskId ? 'Update' : 'Save'}
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
  subLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#ffffff',
  },
  divider: {
    marginVertical: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateHalf: {
    width: '48%',
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
