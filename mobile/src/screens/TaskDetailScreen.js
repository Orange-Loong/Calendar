import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, TextInput, Card, SegmentedButtons } from 'react-native-paper';
import { useTasks } from '../context/TasksContext';
import { useNotes } from '../context/NotesContext';

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatTime = (date) => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

export default function TaskDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { addTask, updateTask, tasks } = useTasks();
  const { addNote, updateNote, notes } = useNotes();
  const { taskId, noteId } = route.params || {};

  const [itemType, setItemType] = useState('task');

  const [taskData, setTaskData] = useState({
    title: '',
    startDate: formatDate(new Date()),
    endDate: formatDate(new Date()),
    startTime: formatTime(new Date()),
    endTime: formatTime(new Date()),
    isRecurring: false,
    recurrence: 'none',
    completed: false,
    taskType: 'task',
  });

  const [noteData, setNoteData] = useState({
    title: '',
    content: '',
    date: formatDate(new Date()),
  });

  useEffect(() => {
    if (taskId) {
      const existingTask = tasks.find(t => t.id === taskId);
      if (existingTask) {
        setTaskData(existingTask);
        setItemType(existingTask.taskType || 'task');
      }
    } else if (noteId) {
      const existingNote = notes.find(n => n.id === noteId);
      if (existingNote) {
        setNoteData(existingNote);
        setItemType('note');
      }
    }
  }, [taskId, noteId, tasks, notes]);

  const handleTaskInputChange = (field, value) => {
    setTaskData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNoteInputChange = (field, value) => {
    setNoteData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (itemType === 'note') {
      if (!noteData.title.trim()) {
        return;
      }
      
      if (noteId) {
        updateNote(noteId, noteData);
      } else {
        addNote(noteData);
      }
    } else {
      if (!taskData.title.trim()) {
        return;
      }

      const data = {
        ...taskData,
        taskType: itemType,
      };

      if (taskId) {
        updateTask(taskId, data);
      } else {
        addTask({
          ...data,
          completed: false,
        });
      }
    }
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const renderTaskForm = () => (
    <View style={styles.formSection}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          mode="outlined"
          style={styles.input}
          value={taskData.title}
          onChangeText={(text) => handleTaskInputChange('title', text)}
          placeholder="Enter title"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Date</Text>
        <TextInput
          mode="outlined"
          style={styles.input}
          value={taskData.endDate}
          onChangeText={(text) => handleTaskInputChange('endDate', text)}
          placeholder="YYYY-MM-DD"
        />
      </View>

      <View style={styles.timeContainer}>
        <View style={styles.halfFormGroup}>
          <Text style={styles.label}>Start Time</Text>
          <TextInput
            mode="outlined"
            style={styles.input}
            value={taskData.startTime}
            onChangeText={(text) => handleTaskInputChange('startTime', text)}
            placeholder="HH:MM"
          />
        </View>
        <View style={styles.halfFormGroup}>
          <Text style={styles.label}>End Time</Text>
          <TextInput
            mode="outlined"
            style={styles.input}
            value={taskData.endTime}
            onChangeText={(text) => handleTaskInputChange('endTime', text)}
            placeholder="HH:MM"
          />
        </View>
      </View>
    </View>
  );

  const renderScheduleForm = () => (
    <View style={styles.formSection}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          mode="outlined"
          style={styles.input}
          value={taskData.title}
          onChangeText={(text) => handleTaskInputChange('title', text)}
          placeholder="Enter title"
        />
      </View>

      <View style={styles.dateContainer}>
        <View style={styles.halfFormGroup}>
          <Text style={styles.label}>Start Date</Text>
          <TextInput
            mode="outlined"
            style={styles.input}
            value={taskData.startDate}
            onChangeText={(text) => handleTaskInputChange('startDate', text)}
            placeholder="YYYY-MM-DD"
          />
        </View>
        <View style={styles.halfFormGroup}>
          <Text style={styles.label}>End Date</Text>
          <TextInput
            mode="outlined"
            style={styles.input}
            value={taskData.endDate}
            onChangeText={(text) => handleTaskInputChange('endDate', text)}
            placeholder="YYYY-MM-DD"
          />
        </View>
      </View>

      <View style={styles.timeContainer}>
        <View style={styles.halfFormGroup}>
          <Text style={styles.label}>Start Time</Text>
          <TextInput
            mode="outlined"
            style={styles.input}
            value={taskData.startTime}
            onChangeText={(text) => handleTaskInputChange('startTime', text)}
            placeholder="HH:MM"
          />
        </View>
        <View style={styles.halfFormGroup}>
          <Text style={styles.label}>End Time</Text>
          <TextInput
            mode="outlined"
            style={styles.input}
            value={taskData.endTime}
            onChangeText={(text) => handleTaskInputChange('endTime', text)}
            placeholder="HH:MM"
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Repeat</Text>
        <SegmentedButtons
          value={taskData.recurrence}
          onValueChange={(value) => {
            handleTaskInputChange('recurrence', value);
            handleTaskInputChange('isRecurring', value !== 'none');
          }}
          buttons={[
            { value: 'none', label: 'No' },
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' },
          ]}
          style={styles.segmentedButtons}
        />
      </View>
    </View>
  );

  const renderNoteForm = () => (
    <View style={styles.formSection}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          mode="outlined"
          style={styles.input}
          value={noteData.title}
          onChangeText={(text) => handleNoteInputChange('title', text)}
          placeholder="Enter title"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Date</Text>
        <TextInput
          mode="outlined"
          style={styles.input}
          value={noteData.date}
          onChangeText={(text) => handleNoteInputChange('date', text)}
          placeholder="YYYY-MM-DD"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Content</Text>
        <TextInput
          mode="outlined"
          style={[styles.input, styles.textArea]}
          value={noteData.content}
          onChangeText={(text) => handleNoteInputChange('content', text)}
          placeholder="Enter your note..."
          multiline
          numberOfLines={6}
        />
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.typeSelector}>
            <SegmentedButtons
              value={itemType}
              onValueChange={setItemType}
              buttons={[
                { value: 'task', label: 'Task' },
                { value: 'schedule', label: 'Schedule' },
                { value: 'note', label: 'Note' },
              ]}
              style={styles.typeButtons}
            />
          </View>

          {itemType === 'task' && renderTaskForm()}
          {itemType === 'schedule' && renderScheduleForm()}
          {itemType === 'note' && renderNoteForm()}

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
              disabled={(itemType === 'note' && !noteData.title.trim()) || ((itemType === 'task' || itemType === 'schedule') && !taskData.title.trim())}
            >
              {taskId || noteId ? 'Update' : 'Save'}
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
  typeSelector: {
    marginBottom: 20,
  },
  typeButtons: {
    marginBottom: 8,
  },
  formSection: {
    marginVertical: 8,
  },
  formGroup: {
    marginVertical: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfFormGroup: {
    flex: 1,
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
