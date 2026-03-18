import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, IconButton } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import { useTasks } from '../context/TasksContext';
import { useNotes } from '../context/NotesContext';
import { useMeals } from '../context/MealContext';

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function ScheduleScreen() {
  const navigation = useNavigation();
  const { tasks } = useTasks();
  const { notes } = useNotes();
  const { meals } = useMeals();
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));

  const getMarkedDates = () => {
    const marked = {};
    tasks.forEach(task => {
      const date = task.endDate;
      if (!marked[date]) {
        marked[date] = { marked: true, dotColor: '#6750A4' };
      }
    });
    notes.forEach(note => {
      const date = note.date;
      if (!marked[date]) {
        marked[date] = { marked: true, dotColor: '#FF9800' };
      } else {
        marked[date].dotColor = '#6750A4';
      }
    });
    meals.forEach(meal => {
      const date = meal.date;
      if (!marked[date]) {
        marked[date] = { marked: true, dotColor: '#4CAF50' };
      } else {
        marked[date].dotColor = '#6750A4';
      }
    });
    tasks.forEach(task => {
      if (task.taskType === 'schedule') {
        const startDate = task.startDate || task.endDate;
        const endDate = task.endDate;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const startDay = start.getDay();
        
        let currentDate = new Date(start);
        while (currentDate <= end) {
          if (task.recurrence === 'weekly') {
            if (currentDate.getDay() === startDay) {
              const dateStr = formatDate(currentDate);
              if (!marked[dateStr]) {
                marked[dateStr] = { marked: true, dotColor: '#FF9800' };
              } else {
                marked[dateStr].dotColor = '#6750A4';
              }
            }
          } else if (task.recurrence === 'daily') {
            const dateStr = formatDate(currentDate);
            if (!marked[dateStr]) {
              marked[dateStr] = { marked: true, dotColor: '#FF9800' };
            } else {
              marked[dateStr].dotColor = '#6750A4';
            }
          } else if (task.recurrence === 'monthly') {
            if (currentDate.getDate() === start.getDate()) {
              const dateStr = formatDate(currentDate);
              if (!marked[dateStr]) {
                marked[dateStr] = { marked: true, dotColor: '#FF9800' };
              } else {
                marked[dateStr].dotColor = '#6750A4';
              }
            }
          } else {
            const dateStr = formatDate(currentDate);
            if (!marked[dateStr]) {
              marked[dateStr] = { marked: true, dotColor: '#FF9800' };
            } else {
              marked[dateStr].dotColor = '#6750A4';
            }
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    });
    return marked;
  };

  const getItemsByDateAndType = (date) => {
    const taskItems = tasks
      .filter(task => task.endDate === date)
      .map(task => ({ ...task, type: 'task' }));

    const scheduleItems = tasks
      .filter(task => {
        if (task.taskType !== 'schedule') return false;
        const startDate = task.startDate || task.endDate;
        const endDate = task.endDate;
        const targetDate = new Date(date);
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
      .filter(note => note.date === date)
      .map(note => ({ ...note, type: 'note' }));

    const mealItems = meals
      .filter(meal => meal.date === date)
      .map(meal => ({ ...meal, type: 'meal' }));

    return {
      tasks: taskItems.filter(item => item.taskType === 'task' || !item.taskType),
      schedules: scheduleItems,
      notes: noteItems,
      meals: mealItems,
    };
  };

  const { tasks: dayTasks, schedules, notes: dayNotes, meals: dayMeals } = getItemsByDateAndType(selectedDate);

  const handleAddTask = () => {
    navigation.navigate('TaskDetail');
  };

  const handleAddNote = () => {
    navigation.navigate('TaskDetail');
  };

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
            onPress={() => {
              if (item.type === 'note') {
                navigation.navigate('TaskDetailView', { noteId: item.id });
              } else if (item.type === 'meal') {
                navigation.navigate('MealDetail', { mealId: item.id });
              } else {
                navigation.navigate('TaskDetailView', { taskId: item.id });
              }
            }}
          >
            <Card style={styles.itemCard}>
              <Card.Content>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  {item.type === 'schedule' && item.isRecurring && (
                    <Text style={styles.recurringTag}>⟳ {item.recurrence}</Text>
                  )}
                  {item.type === 'meal' && (
                    <View style={[styles.categoryBadge, { backgroundColor: item.category === 'Meal' ? '#4CAF50' : '#2196F3' }]}>
                      <Text style={styles.categoryBadgeText}>{item.category}</Text>
                    </View>
                  )}
                </View>
                {(item.type === 'note' || item.type === 'meal') && (
                  <Text style={styles.itemContent} numberOfLines={2}>
                    {item.content}
                  </Text>
                )}
                {item.type === 'task' && item.completed && (
                  <Text style={styles.completedTag}>✓ Completed</Text>
                )}
                {item.startTime && (
                  <Text style={styles.itemTime}>⏰ {item.startTime}</Text>
                )}
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendar</Text>
      </View>

      <Card style={styles.calendarCard}>
        <Card.Content>
          <Calendar
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#6750A4',
              selectedDayBackgroundColor: '#6750A4',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#6750A4',
              dayTextColor: '#333333',
              textDisabledColor: '#d9e1e8',
              dotColor: '#6750A4',
              selectedDotColor: '#ffffff',
              arrowColor: '#6750A4',
              monthTextColor: '#333333',
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '300',
            }}
            markedDates={{
              ...getMarkedDates(),
              [selectedDate]: {
                selected: true,
                marked: true,
                selectedColor: '#6750A4',
              },
            }}
            onDayPress={(day) => setSelectedDate(day.dateString)}
          />
        </Card.Content>
      </Card>

      <ScrollView style={styles.content}>
        <View style={styles.dateDisplay}>
          <Text style={styles.dateText}>{selectedDate}</Text>
        </View>

        {renderSection('Tasks', dayTasks, '#6750A4')}
        {renderSection('Schedules', schedules, '#FF9800')}
        {renderSection('Notes', dayNotes, '#4CAF50')}
        {renderSection('Meal&Grocery', dayMeals, '#E91E63')}

        {dayTasks.length === 0 && schedules.length === 0 && dayNotes.length === 0 && dayMeals.length === 0 && (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>No items for this date</Text>
              <Text style={styles.emptySubText}>Add tasks, schedules, notes, or meal&grocery</Text>
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
  calendarCard: {
    margin: 16,
    borderRadius: 12,
    elevation: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  dateDisplay: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
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
  itemCard: {
    marginBottom: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    elevation: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
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
  itemContent: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  itemTime: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  emptyCard: {
    marginTop: 32,
    paddingVertical: 32,
    borderRadius: 12,
    elevation: 1,
  },
  emptyText: {
    fontSize: 16,
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
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  addButton: {
    borderRadius: 12,
  },
});
