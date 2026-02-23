import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Button, Card, Divider, ProgressBar } from 'react-native-paper';

// Sample points history data
const samplePointsHistory = [
  { id: '1', task: 'Complete project proposal', points: 10, date: '2026-02-15', status: 'Approved' },
  { id: '2', task: 'Submit expense report', points: 5, date: '2026-02-14', status: 'Approved' },
  { id: '3', task: 'Schedule team meeting', points: 3, date: '2026-02-13', status: 'Pending' },
  { id: '4', task: 'Update project documentation', points: 8, date: '2026-02-12', status: 'Approved' },
];

// Sample rewards for redemption
const sampleRewards = [
  { id: '1', name: 'Gift Card', points: 50 },
  { id: '2', name: 'School Bag', points: 100 },
  { id: '3', name: 'Sports Equipment', points: 150 },
  { id: '4', name: 'Electronics', points: 200 },
];

export default function PointsManagementScreen() {
  const [totalPoints, setTotalPoints] = useState(125);
  const [dailyPoints, setDailyPoints] = useState(15);
  const [dailyLimit] = useState(20);
  const [pointsHistory, setPointsHistory] = useState(samplePointsHistory);
  const [rewards] = useState(sampleRewards);
  
  // Calculate daily points percentage
  const dailyPointsPercentage = (dailyPoints / dailyLimit) * 100;
  
  // Handle redeem reward
  const handleRedeemReward = (rewardId) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (reward && totalPoints >= reward.points) {
      setTotalPoints(totalPoints - reward.points);
      // In a real app, this would update the database
      console.log('Redeemed reward:', reward.name);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      {/* Total Points */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.pointsContainer}>
            <Text style={styles.pointsLabel}>Total Points</Text>
            <Text style={styles.totalPoints}>{totalPoints}</Text>
          </View>
          
          {/* Daily Points Progress */}
          <View style={styles.dailyProgressContainer}>
            <View style={styles.dailyProgressHeader}>
              <Text style={styles.dailyPointsLabel}>Daily Points</Text>
              <Text style={styles.dailyPointsValue}>{dailyPoints}/{dailyLimit}</Text>
            </View>
            <ProgressBar 
              progress={dailyPointsPercentage / 100} 
              color="#4CAF50" 
              style={styles.progressBar}
            />
            <Text style={styles.dailyLimitText}>
              Daily limit: {dailyLimit} points
            </Text>
          </View>
        </Card.Content>
      </Card>
      
      {/* Points History */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Points History</Text>
          
          {pointsHistory.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <View style={styles.historyItemLeft}>
                <Text style={styles.historyTask}>{item.task}</Text>
                <Text style={styles.historyDate}>{item.date}</Text>
              </View>
              <View style={styles.historyItemRight}>
                <Text style={[styles.historyPoints, item.status === 'Approved' ? styles.pointsApproved : styles.pointsPending]}>
                  {item.status === 'Approved' ? '+' : ''}{item.points}
                </Text>
                <Text style={[styles.historyStatus, item.status === 'Approved' ? styles.statusApproved : styles.statusPending]}>
                  {item.status}
                </Text>
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>
      
      {/* Rewards */}
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
                onPress={() => handleRedeemReward(reward.id)}
                disabled={totalPoints < reward.points}
              >
                Redeem
              </Button>
            </View>
          ))}
        </Card.Content>
      </Card>
      
      {/* Points Management Tips */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Points Management Tips</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>💡</Text>
            <Text style={styles.tipText}>
              Complete daily tasks to earn consistent points
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>🎯</Text>
            <Text style={styles.tipText}>
              Focus on high-point tasks for faster rewards
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>⏰</Text>
            <Text style={styles.tipText}>
              Check daily to maximize your point earnings
            </Text>
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
  pointsContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  pointsLabel: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  totalPoints: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  dailyProgressContainer: {
    marginTop: 20,
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
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
  },
  dailyLimitText: {
    fontSize: 12,
    color: '#999999',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyItemLeft: {
    flex: 1,
  },
  historyTask: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: '#666666',
  },
  historyItemRight: {
    alignItems: 'flex-end',
  },
  historyPoints: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  pointsApproved: {
    color: '#4CAF50',
  },
  pointsPending: {
    color: '#FFC107',
  },
  historyStatus: {
    fontSize: 12,
  },
  statusApproved: {
    color: '#4CAF50',
  },
  statusPending: {
    color: '#FFC107',
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
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
  },
});