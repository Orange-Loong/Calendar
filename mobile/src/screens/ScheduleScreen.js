import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, IconButton } from 'react-native-paper';

const sampleSchedules = [
  { id: '1', title: 'Team Meeting', time: '10:00 AM', duration: '1 hour', location: 'Conference Room A', date: '2026-02-22' },
  { id: '2', title: 'Lunch with Client', time: '12:30 PM', duration: '1.5 hours', location: 'Restaurant XYZ', date: '2026-02-22' },
  { id: '3', title: 'Project Deadline', time: '5:00 PM', duration: 'All Day', location: 'Office', date: '2026-02-23' },
  { id: '4', title: 'Doctor Appointment', time: '9:00 AM', duration: '30 min', location: 'Medical Center', date: '2026-02-24' },
  { id: '5', title: 'Family Dinner', time: '7:00 PM', duration: '2 hours', location: 'Home', date: '2026-02-25' },
];

export default function ScheduleScreen() {
  const navigation = useNavigation();
  const [filter, setFilter] = useState('all');
  const [schedules, setSchedules] = useState(sampleSchedules);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const filteredSchedules = schedules.filter(schedule => {
    const today = new Date().toISOString().split('T')[0];
    if (filter === 'today') return schedule.date === today;
    if (filter === 'upcoming') return schedule.date >= today;
    if (filter === 'past') return schedule.date < today;
    return true;
  });

  const handleAddSchedule = () => {
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
          style={[styles.filterButton, filter === 'today' && styles.filterButtonActive]}
          onPress={() => handleFilterChange('today')}
        >
          <Text style={[styles.filterButtonText, filter === 'today' && styles.filterButtonTextActive]}>
            Today
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'upcoming' && styles.filterButtonActive]}
          onPress={() => handleFilterChange('upcoming')}
        >
          <Text style={[styles.filterButtonText, filter === 'upcoming' && styles.filterButtonTextActive]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'past' && styles.filterButtonActive]}
          onPress={() => handleFilterChange('past')}
        >
          <Text style={[styles.filterButtonText, filter === 'past' && styles.filterButtonTextActive]}>
            Past
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scheduleListContainer}>
        {filteredSchedules.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>No schedules found.</Text>
              <Text style={styles.emptySubText}>Add a new schedule to get started.</Text>
            </Card.Content>
          </Card>
        ) : (
          filteredSchedules.map((schedule) => (
            <Card key={schedule.id} style={styles.scheduleCard}>
              <Card.Content>
                <View style={styles.scheduleHeader}>
                  <View style={styles.scheduleTimeContainer}>
                    <Text style={styles.scheduleTime}>{schedule.time}</Text>
                    <Text style={styles.scheduleDuration}>{schedule.duration}</Text>
                  </View>
                  <IconButton
                    icon="dots-vertical"
                    size={20}
                    onPress={() => {}}
                  />
                </View>
                <Text style={styles.scheduleTitle}>{schedule.title}</Text>
                <View style={styles.scheduleDetails}>
                  <Text style={styles.scheduleLocation}>📍 {schedule.location}</Text>
                  <Text style={styles.scheduleDate}>📅 {schedule.date}</Text>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      <View style={styles.addScheduleContainer}>
        <Button
          mode="contained"
          style={styles.addScheduleButton}
          icon="plus"
          onPress={handleAddSchedule}
        >
          Add Schedule
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
    paddingHorizontal: 8,
    marginHorizontal: 2,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#666666',
  },
  filterButtonTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  scheduleListContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  scheduleCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 1,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  scheduleTimeContainer: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  scheduleTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scheduleDuration: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  scheduleDetails: {
    marginTop: 4,
  },
  scheduleLocation: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  scheduleDate: {
    fontSize: 14,
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
  addScheduleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  addScheduleButton: {
    borderRadius: 12,
  },
});
