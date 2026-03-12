import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Button, Card, ProgressBar, Avatar, Portal, Dialog, TextInput, SegmentedButtons, Checkbox, Menu, IconButton } from 'react-native-paper';
import { usePoints } from '../context/PointsContext';

const sampleRewards = [
  { id: '1', name: 'Gift Card', points: 50 },
  { id: '2', name: 'School Bag', points: 100 },
  { id: '3', name: 'Sports Equipment', points: 150 },
  { id: '4', name: 'Electronics', points: 200 },
];

const frequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export default function PointsManagementScreen() {
  const { 
    members, 
    checkInTasks, 
    isTaskCompletedToday, 
    toggleTaskCheckIn, 
    getMemberTasks, 
    addCheckInTask, 
    updateCheckInTask,
    deleteCheckInTask,
    getMemberTotalPoints, 
    getMemberDailyPoints,
    getMemberDailyTotalPoints,
    getMemberStreak,
    getCompletedDatesInPeriod,
    calculateTaskPoints,
  } = usePoints();
  
  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.id);
  const [rewards] = useState(sampleRewards);
  const [addTaskDialogVisible, setAddTaskDialogVisible] = useState(false);
  const [editTaskDialogVisible, setEditTaskDialogVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [menuVisible, setMenuVisible] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskFrequency, setNewTaskFrequency] = useState('daily');
  const [newTaskPoints, setNewTaskPoints] = useState('5');
  const [selectedMemberForTask, setSelectedMemberForTask] = useState(members[0]?.id);

  const selectedMember = members.find(m => m.id === selectedMemberId);
  const memberTasks = selectedMember ? getMemberTasks(selectedMemberId) : [];
  const memberTotalPoints = selectedMember ? getMemberTotalPoints(selectedMemberId) : 0;
  const memberBasePoints = selectedMember ? selectedMember.basePoints : 0;
  const memberCurrentPoints = selectedMember ? selectedMember.currentPoints : 0;
  const memberDailyPoints = selectedMember ? getMemberDailyPoints(selectedMemberId) : 0;
  const memberDailyTotalPoints = selectedMember ? getMemberDailyTotalPoints(selectedMemberId) : 0;
  const memberStreak = selectedMember ? getMemberStreak(selectedMemberId) : 0;

  const getFrequencyLabel = (frequency) => {
    const labels = { daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' };
    return labels[frequency] || frequency;
  };

  const getTaskProgressText = (task) => {
    const completedDatesInPeriod = getCompletedDatesInPeriod(task);
    const completedCount = completedDatesInPeriod.length;
    const awardedPoints = calculateTaskPoints(task);
    
    if (task.frequency === 'daily') {
      return completedCount > 0 ? `+${task.totalPoints} points` : `+${task.totalPoints} points`;
    } else if (task.frequency === 'weekly') {
      return `${completedCount}/7 days (+${awardedPoints}/${task.totalPoints} pts)`;
    } else if (task.frequency === 'monthly') {
      const today = new Date();
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      return `${completedCount}/${daysInMonth} days (+${awardedPoints}/${task.totalPoints} pts)`;
    }
    
    return `+${task.totalPoints} points`;
  };

  const getTaskProgress = (task) => {
    const completedDatesInPeriod = getCompletedDatesInPeriod(task);
    const completedCount = completedDatesInPeriod.length;
    
    if (task.frequency === 'daily') {
      return completedCount > 0 ? 1 : 0;
    } else if (task.frequency === 'weekly') {
      return Math.min(1, completedCount / 7);
    } else if (task.frequency === 'monthly') {
      const today = new Date();
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      return Math.min(1, completedCount / daysInMonth);
    }
    
    return 0;
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim() && selectedMemberForTask && parseInt(newTaskPoints) > 0) {
      addCheckInTask({
        title: newTaskTitle.trim(),
        frequency: newTaskFrequency,
        totalPoints: parseInt(newTaskPoints),
        memberId: selectedMemberForTask,
      });
      setNewTaskTitle('');
      setNewTaskFrequency('daily');
      setNewTaskPoints('5');
      setSelectedMemberForTask(members[0]?.id);
      setAddTaskDialogVisible(false);
    }
  };

  const handleEditTask = () => {
    if (editingTask && newTaskTitle.trim() && parseInt(newTaskPoints) > 0) {
      updateCheckInTask(editingTask.id, {
        title: newTaskTitle.trim(),
        frequency: newTaskFrequency,
        totalPoints: parseInt(newTaskPoints),
      });
      setEditingTask(null);
      setNewTaskTitle('');
      setNewTaskFrequency('daily');
      setNewTaskPoints('5');
      setEditTaskDialogVisible(false);
    }
  };

  const openEditDialog = (task) => {
    setEditingTask(task);
    setNewTaskTitle(task.title);
    setNewTaskFrequency(task.frequency);
    setNewTaskPoints(task.totalPoints.toString());
    setEditTaskDialogVisible(true);
    setMenuVisible(null);
  };

  const handleDeleteTask = (taskId) => {
    deleteCheckInTask(taskId);
    setMenuVisible(null);
  };

  return (
    <ScrollView style={styles.container}>
      <Portal>
        <Dialog 
          visible={addTaskDialogVisible} 
          onDismiss={() => setAddTaskDialogVisible(false)}
        >
          <Dialog.Title>Add Check-in Task</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Task Title"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              mode="outlined"
              style={styles.dialogInput}
              autoFocus
            />
            <Text style={styles.label}>Assign to Member</Text>
            <View style={styles.memberSelector}>
              {members.map((member) => (
                <TouchableOpacity
                  key={member.id}
                  style={[
                    styles.memberSelectorItem,
                    selectedMemberForTask === member.id && styles.memberSelectorItemActive
                  ]}
                  onPress={() => setSelectedMemberForTask(member.id)}
                >
                  <Avatar.Text 
                    size={32} 
                    label={member.avatar} 
                  />
                  <Text style={styles.memberSelectorName}>{member.name}</Text>
                  <Checkbox
                    status={selectedMemberForTask === member.id ? 'checked' : 'unchecked'}
                    onPress={() => setSelectedMemberForTask(member.id)}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>Frequency</Text>
            <SegmentedButtons
              value={newTaskFrequency}
              onValueChange={setNewTaskFrequency}
              buttons={frequencyOptions}
              style={styles.segmentedButtons}
            />
            <TextInput
              label="Points"
              value={newTaskPoints}
              onChangeText={setNewTaskPoints}
              keyboardType="numeric"
              mode="outlined"
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setAddTaskDialogVisible(false)}>Cancel</Button>
            <Button 
              onPress={handleAddTask} 
              disabled={!newTaskTitle.trim() || !newTaskPoints || parseInt(newTaskPoints) <= 0}
            >
              Add
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog 
          visible={editTaskDialogVisible} 
          onDismiss={() => setEditTaskDialogVisible(false)}
        >
          <Dialog.Title>Edit Check-in Task</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Task Title"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              mode="outlined"
              style={styles.dialogInput}
              autoFocus
            />
            <Text style={styles.label}>Frequency</Text>
            <SegmentedButtons
              value={newTaskFrequency}
              onValueChange={setNewTaskFrequency}
              buttons={frequencyOptions}
              style={styles.segmentedButtons}
            />
            <TextInput
              label="Points"
              value={newTaskPoints}
              onChangeText={setNewTaskPoints}
              keyboardType="numeric"
              mode="outlined"
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditTaskDialogVisible(false)}>Cancel</Button>
            <Button 
              onPress={handleEditTask} 
              disabled={!newTaskTitle.trim() || !newTaskPoints || parseInt(newTaskPoints) <= 0}
            >
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Family Members</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.memberList}>
            {members.map((member) => (
              <TouchableOpacity
                key={member.id}
                style={[
                  styles.memberItem,
                  selectedMemberId === member.id && styles.memberItemActive
                ]}
                onPress={() => setSelectedMemberId(member.id)}
              >
                <Avatar.Text 
                  size={48} 
                  label={member.avatar} 
                  style={styles.memberAvatar}
                />
                <Text style={[
                  styles.memberName,
                  selectedMemberId === member.id && styles.memberNameActive
                ]}>
                  {member.name}
                </Text>
                <Text style={[
                  styles.memberPoints,
                  selectedMemberId === member.id && styles.memberPointsActive
                ]}>
                  {member.basePoints + member.currentPoints} pts
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Card.Content>
      </Card>

      {selectedMember && (
        <>
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.pointsContainer}>
                <Text style={styles.pointsLabel}>Total Points</Text>
                <Text style={styles.totalPoints}>{memberTotalPoints}</Text>
                <View style={styles.pointsBreakdown}>
                  <Text style={styles.pointsBreakdownText}>Base: {memberBasePoints}</Text>
                  <Text style={styles.pointsBreakdownText}>Current: {memberCurrentPoints}</Text>
                </View>
              </View>
              
              <View style={styles.dailyProgressContainer}>
                <View style={styles.dailyProgressHeader}>
                  <Text style={styles.dailyPointsLabel}>Today's Progress</Text>
                  <Text style={styles.dailyPointsValue}>{memberDailyPoints}/{memberDailyTotalPoints}</Text>
                </View>
                <ProgressBar 
                  progress={memberDailyTotalPoints > 0 ? memberDailyPoints / memberDailyTotalPoints : 0} 
                  color="#4CAF50" 
                  style={styles.dailyProgressBar}
                />
                <Text style={styles.dailyLimitText}>
                  Daily tasks completed today
                </Text>
              </View>

              <View style={styles.streakContainer}>
                <Text style={styles.streakLabel}>Current Streak</Text>
                <Text style={styles.streakValue}>{memberStreak} days 🔥</Text>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Check-in Tasks</Text>
                <Button 
                  mode="contained" 
                  icon="plus"
                  compact
                  onPress={() => setAddTaskDialogVisible(true)}
                >
                  Add Task
                </Button>
              </View>
              
              {memberTasks.length === 0 ? (
                <Text style={styles.emptyText}>No check-in tasks yet. Add one to get started!</Text>
              ) : (
                memberTasks.map((task) => (
                  <View key={task.id} style={styles.taskItem}>
                    <View style={styles.taskInfo}>
                      <View style={styles.taskHeader}>
                        <Text style={styles.taskTitle}>{task.title}</Text>
                        <View style={styles.frequencyBadge}>
                          <Text style={styles.frequencyText}>{getFrequencyLabel(task.frequency)}</Text>
                        </View>
                      </View>
                      <Text style={styles.taskPoints}>{getTaskProgressText(task)}</Text>
                      {task.frequency !== 'daily' && (
                        <ProgressBar 
                          progress={getTaskProgress(task)} 
                          color="#6750A4" 
                          style={styles.taskProgressBar}
                        />
                      )}
                    </View>
                    <View style={styles.taskActions}>
                      <TouchableOpacity
                        style={[
                          styles.checkInButton,
                          isTaskCompletedToday(task) && styles.checkInButtonCompleted
                        ]}
                        onPress={() => toggleTaskCheckIn(task.id)}
                      >
                        <Text style={[
                          styles.checkInButtonText,
                          isTaskCompletedToday(task) && styles.checkInButtonTextCompleted
                        ]}>
                          {isTaskCompletedToday(task) ? 'Done' : 'Check In'}
                        </Text>
                      </TouchableOpacity>
                      <Menu
                        visible={menuVisible === task.id}
                        onDismiss={() => setMenuVisible(null)}
                        anchor={
                          <TouchableOpacity onPress={() => setMenuVisible(task.id)} style={styles.menuButton}>
                            <IconButton
                              icon="dots-vertical"
                              size={20}
                              iconColor="#666666"
                            />
                          </TouchableOpacity>
                        }
                      >
                        <Menu.Item onPress={() => openEditDialog(task)} title="Edit" />
                        <Menu.Item onPress={() => handleDeleteTask(task.id)} title="Delete" />
                      </Menu>
                    </View>
                  </View>
                ))
              )}
            </Card.Content>
          </Card>
        </>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Rewards</Text>
          
          {rewards.map((reward) => (
            <View key={reward.id} style={styles.rewardItem}>
              <View style={styles.rewardInfo}>
                <Text style={styles.rewardName}>{reward.name}</Text>
                <Text style={styles.rewardPoints}>{reward.points} points</Text>
              </View>
              <Button 
                mode="contained" 
                style={styles.redeemButton}
                onPress={() => {}}
                disabled={!selectedMember || memberTotalPoints < reward.points}
              >
                Redeem
              </Button>
            </View>
          ))}
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
    marginBottom: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  memberList: {
    marginBottom: 8,
  },
  memberItem: {
    alignItems: 'center',
    padding: 12,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    minWidth: 80,
  },
  memberItemActive: {
    backgroundColor: '#007AFF',
  },
  memberAvatar: {
    backgroundColor: '#6750A4',
  },
  memberName: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
    textAlign: 'center',
  },
  memberNameActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  memberPoints: {
    fontSize: 10,
    color: '#666666',
    marginTop: 2,
    textAlign: 'center',
  },
  memberPointsActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  pointsContainer: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  pointsLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  totalPoints: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  pointsBreakdown: {
    flexDirection: 'row',
    gap: 16,
  },
  pointsBreakdownText: {
    fontSize: 14,
    color: '#666666',
  },
  dailyProgressContainer: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dailyProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dailyPointsLabel: {
    fontSize: 14,
    color: '#666666',
  },
  dailyPointsValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  dailyProgressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  dailyLimitText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
  },
  streakContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  streakLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  streakValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF5722',
  },
  emptyText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    paddingVertical: 24,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  taskInfo: {
    flex: 1,
    marginRight: 12,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginRight: 8,
    flex: 1,
  },
  frequencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#E8DEF8',
  },
  frequencyText: {
    fontSize: 10,
    color: '#6750A4',
    fontWeight: 'bold',
  },
  menuButton: {
    padding: 4,
  },
  taskPoints: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
    marginBottom: 8,
  },
  taskProgressBar: {
    height: 6,
    borderRadius: 3,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkInButton: {
    width: 90,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#6750A4',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkInButtonCompleted: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkInButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6750A4',
  },
  checkInButtonTextCompleted: {
    color: '#ffffff',
  },
  rewardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  rewardPoints: {
    fontSize: 12,
    color: '#666666',
  },
  redeemButton: {
    marginLeft: 16,
  },
  dialogInput: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  memberSelector: {
    flexDirection: 'column',
    marginBottom: 16,
  },
  memberSelectorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  memberSelectorItemActive: {
    backgroundColor: '#007AFF',
  },
  memberSelectorName: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#333333',
  },
});
