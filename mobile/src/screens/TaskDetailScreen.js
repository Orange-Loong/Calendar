import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, TextInput, Card, Divider, SegmentedButtons, Menu, IconButton } from 'react-native-paper';

// Sample family members for assignment
const sampleFamilyMembers = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Tom Doe' },
  { id: '4', name: 'Lisa Doe' },
];

// Reward types
const rewardTypes = [
  { id: '1', name: 'Custom Reward' },
  { id: '2', name: '30 Minutes Extra Sleep' },
  { id: '3', name: '15 Minutes Extra Screen Time' },
  { id: '4', name: 'Favorite Snack' },
];

export default function TaskDetailScreen() {
  const navigation = useNavigation();
  const [task, setTask] = useState({
    title: '',
    description: '',
    assignee: '1', // Default to first family member
    checker: '1', // Default to first family member
    rewardType: '1', // Default to custom reward
    points: 5,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    recurrence: 'none', // none, daily, weekly
  });
  
  const [assigneeMenuVisible, setAssigneeMenuVisible] = useState(false);
  const [checkerMenuVisible, setCheckerMenuVisible] = useState(false);
  
  // Handle input changes
  const handleInputChange = (field, value) => {
    setTask(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  // Handle save
  const handleSave = () => {
    // In a real app, this would save to a database
    console.log('Saving task:', task);
    navigation.goBack();
  };
  
  // Handle cancel
  const handleCancel = () => {
    navigation.goBack();
  };
  
  // Get assignee name
  const getAssigneeName = () => {
    const assignee = sampleFamilyMembers.find(member => member.id === task.assignee);
    return assignee ? assignee.name : 'Select Assignee';
  };
  
  // Get checker name
  const getCheckerName = () => {
    const checker = sampleFamilyMembers.find(member => member.id === task.checker);
    return checker ? checker.name : 'Select Checker';
  };
  
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          {/* Task Title */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Task Title</Text>
            <TextInput
              mode="outlined"
              style={styles.input}
              value={task.title}
              onChangeText={(text) => handleInputChange('title', text)}
              placeholder="Task title"
            />
          </View>
          
          <Divider style={styles.divider} />
          
          {/* Task Description */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              mode="outlined"
              style={[styles.input, styles.textArea]}
              value={task.description}
              onChangeText={(text) => handleInputChange('description', text)}
              placeholder="Task description"
              multiline
              numberOfLines={4}
            />
          </View>
          
          <Divider style={styles.divider} />
          
          {/* Assignment */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Assignment</Text>
            
            {/* Assignee */}
            <View style={styles.assignmentItem}>
              <Text style={styles.subLabel}>Assignee</Text>
              <Menu
                visible={assigneeMenuVisible}
                onDismiss={() => setAssigneeMenuVisible(false)}
                anchor={
                  <View style={styles.menuAnchor}>
                    <TextInput
                      mode="outlined"
                      style={styles.input}
                      value={getAssigneeName()}
                      editable={false}
                      right={<IconButton icon="chevron-down" size={20} />}
                      onPressIn={() => setAssigneeMenuVisible(true)}
                    />
                  </View>
                }
              >
                {sampleFamilyMembers.map((member) => (
                  <Menu.Item
                    key={member.id}
                    title={member.name}
                    onPress={() => {
                      handleInputChange('assignee', member.id);
                      setAssigneeMenuVisible(false);
                    }}
                  />
                ))}
              </Menu>
            </View>
            
            {/* Checker */}
            <View style={styles.assignmentItem}>
              <Text style={styles.subLabel}>Checker</Text>
              <Menu
                visible={checkerMenuVisible}
                onDismiss={() => setCheckerMenuVisible(false)}
                anchor={
                  <View style={styles.menuAnchor}>
                    <TextInput
                      mode="outlined"
                      style={styles.input}
                      value={getCheckerName()}
                      editable={false}
                      right={<IconButton icon="chevron-down" size={20} />}
                      onPressIn={() => setCheckerMenuVisible(true)}
                    />
                  </View>
                }
              >
                {sampleFamilyMembers.map((member) => (
                  <Menu.Item
                    key={member.id}
                    title={member.name}
                    onPress={() => {
                      handleInputChange('checker', member.id);
                      setCheckerMenuVisible(false);
                    }}
                  />
                ))}
              </Menu>
            </View>
          </View>
          
          <Divider style={styles.divider} />
          
          {/* Reward */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Reward</Text>
            
            {/* Reward Type */}
            <View style={styles.rewardTypeContainer}>
              <Text style={styles.subLabel}>Reward Type</Text>
              <SegmentedButtons
                value={task.rewardType}
                onValueChange={(value) => handleInputChange('rewardType', value)}
                buttons={rewardTypes.map((type) => ({
                  value: type.id,
                  label: type.name,
                }))}
                style={styles.segmentedButtons}
              />
            </View>
            
            {/* Points */}
            <View style={styles.pointsContainer}>
              <Text style={styles.subLabel}>Points</Text>
              <View style={styles.pointsInputContainer}>
                <Button 
                  mode="outlined" 
                  style={styles.pointsButton}
                  onPress={() => handleInputChange('points', Math.max(1, task.points - 1))}
                >
                  -
                </Button>
                <TextInput
                  mode="outlined"
                  style={styles.pointsInput}
                  value={task.points.toString()}
                  onChangeText={(text) => handleInputChange('points', parseInt(text) || 0)}
                  keyboardType="numeric"
                />
                <Button 
                  mode="outlined" 
                  style={styles.pointsButton}
                  onPress={() => handleInputChange('points', task.points + 1)}
                >
                  +
                </Button>
              </View>
            </View>
          </View>
          
          <Divider style={styles.divider} />
          
          {/* Date Range */}
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
            
            {/* Recurrence */}
            <View style={styles.recurrenceContainer}>
              <Text style={styles.subLabel}>Recurrence</Text>
              <SegmentedButtons
                value={task.recurrence}
                onValueChange={(value) => handleInputChange('recurrence', value)}
                buttons={[
                  { value: 'none', label: 'None' },
                  { value: 'daily', label: 'Daily' },
                  { value: 'weekly', label: 'Weekly' },
                ]}
                style={styles.segmentedButtons}
              />
            </View>
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
  assignmentItem: {
    marginBottom: 16,
  },
  menuAnchor: {
    width: '100%',
  },
  rewardTypeContainer: {
    marginBottom: 16,
  },
  segmentedButtons: {
    marginVertical: 8,
  },
  pointsContainer: {
    marginBottom: 16,
  },
  pointsInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsButton: {
    width: 48,
    height: 48,
  },
  pointsInput: {
    flex: 1,
    marginHorizontal: 16,
    textAlign: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateHalf: {
    width: '48%',
  },
  recurrenceContainer: {
    marginTop: 8,
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