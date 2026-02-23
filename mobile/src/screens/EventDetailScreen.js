import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, TextInput, Card, Divider } from 'react-native-paper';

export default function EventDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { date } = route.params || {};
  
  const [event, setEvent] = useState({
    title: '',
    description: '',
    startDate: date || new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endDate: date || new Date().toISOString().split('T')[0],
    endTime: '11:00',
    location: '',
  });
  
  // Handle input changes
  const handleInputChange = (field, value) => {
    setEvent(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  // Handle save
  const handleSave = () => {
    // In a real app, this would save to a database
    console.log('Saving event:', event);
    navigation.goBack();
  };
  
  // Handle cancel
  const handleCancel = () => {
    navigation.goBack();
  };
  
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          {/* Event Title */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              mode="outlined"
              style={styles.input}
              value={event.title}
              onChangeText={(text) => handleInputChange('title', text)}
              placeholder="Event title"
            />
          </View>
          
          <Divider style={styles.divider} />
          
          {/* Date and Time */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Date & Time</Text>
            
            <View style={styles.dateTimeContainer}>
              <View style={styles.dateTimeHalf}>
                <Text style={styles.subLabel}>Start Date</Text>
                <TextInput
                  mode="outlined"
                  style={styles.input}
                  value={event.startDate}
                  onChangeText={(text) => handleInputChange('startDate', text)}
                  placeholder="YYYY-MM-DD"
                />
              </View>
              
              <View style={styles.dateTimeHalf}>
                <Text style={styles.subLabel}>Start Time</Text>
                <TextInput
                  mode="outlined"
                  style={styles.input}
                  value={event.startTime}
                  onChangeText={(text) => handleInputChange('startTime', text)}
                  placeholder="HH:MM"
                />
              </View>
            </View>
            
            <View style={styles.dateTimeContainer}>
              <View style={styles.dateTimeHalf}>
                <Text style={styles.subLabel}>End Date</Text>
                <TextInput
                  mode="outlined"
                  style={styles.input}
                  value={event.endDate}
                  onChangeText={(text) => handleInputChange('endDate', text)}
                  placeholder="YYYY-MM-DD"
                />
              </View>
              
              <View style={styles.dateTimeHalf}>
                <Text style={styles.subLabel}>End Time</Text>
                <TextInput
                  mode="outlined"
                  style={styles.input}
                  value={event.endTime}
                  onChangeText={(text) => handleInputChange('endTime', text)}
                  placeholder="HH:MM"
                />
              </View>
            </View>
          </View>
          
          <Divider style={styles.divider} />
          
          {/* Location */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              mode="outlined"
              style={styles.input}
              value={event.location}
              onChangeText={(text) => handleInputChange('location', text)}
              placeholder="Event location"
            />
          </View>
          
          <Divider style={styles.divider} />
          
          {/* Description */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              mode="outlined"
              style={[styles.input, styles.textArea]}
              value={event.description}
              onChangeText={(text) => handleInputChange('description', text)}
              placeholder="Event description"
              multiline
              numberOfLines={4}
            />
          </View>
          
          {/* Action Buttons */}
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
            >
              Save
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  divider: {
    marginVertical: 16,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateTimeHalf: {
    width: '48%',
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
  },
});