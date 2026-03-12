import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Button, Card, Switch, Divider, Avatar, TextInput, Portal, Dialog } from 'react-native-paper';
import { useFamily } from '../context/FamilyContext';

export default function FamilySharingScreen() {
  const { 
    familyMembers, 
    shareCalendar, 
    shareTasks, 
    sharePoints,
    setShareCalendar,
    setShareTasks,
    setSharePoints,
    inviteMember,
    removeMember,
  } = useFamily();
  
  const [inviteDialogVisible, setInviteDialogVisible] = useState(false);
  const [inviteName, setInviteName] = useState('');

  const handleInviteMember = () => {
    if (inviteName.trim()) {
      inviteMember(inviteName.trim());
      setInviteName('');
      setInviteDialogVisible(false);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <Portal>
        <Dialog 
          visible={inviteDialogVisible} 
          onDismiss={() => setInviteDialogVisible(false)}
        >
          <Dialog.Title>Invite Family Member</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Name"
              value={inviteName}
              onChangeText={setInviteName}
              mode="outlined"
              autoFocus
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setInviteDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleInviteMember} disabled={!inviteName.trim()}>Invite</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Family Members</Text>
            <Button 
              mode="contained" 
              style={styles.inviteButton}
              onPress={() => setInviteDialogVisible(true)}
            >
              Invite
            </Button>
          </View>
          
          {familyMembers.map((member) => (
            <View key={member.id} style={styles.memberItem}>
              <View style={styles.memberInfo}>
                <Avatar.Text 
                  size={40} 
                  label={member.avatar} 
                  style={styles.memberAvatar}
                />
                <View style={styles.memberDetails}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberRole}>{member.role}</Text>
                </View>
              </View>
              {member.role !== 'Admin' && (
                <Button 
                  mode="text" 
                  style={styles.removeButton}
                  onPress={() => removeMember(member.id)}
                >
                  Remove
                </Button>
              )}
            </View>
          ))}
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Sharing Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingName}>Share Calendar</Text>
              <Text style={styles.settingDescription}>Share your calendar with family members</Text>
            </View>
            <Switch
              value={shareCalendar}
              onValueChange={setShareCalendar}
              color="#007AFF"
            />
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingName}>Share Tasks</Text>
              <Text style={styles.settingDescription}>Share your tasks with family members</Text>
            </View>
            <Switch
              value={shareTasks}
              onValueChange={setShareTasks}
              color="#007AFF"
            />
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingName}>Share Points</Text>
              <Text style={styles.settingDescription}>Share your points with family members</Text>
            </View>
            <Switch
              value={sharePoints}
              onValueChange={setSharePoints}
              color="#007AFF"
            />
          </View>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Family Code</Text>
          <Text style={styles.familyCode}>ABC12345</Text>
          <Text style={styles.familyCodeDescription}>
            Share this code with family members to join your family group
          </Text>
          <Button 
            mode="outlined" 
            style={styles.copyButton}
            onPress={() => console.log('Copy code')}
          >
            Copy Code
          </Button>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  inviteButton: {
    paddingHorizontal: 16,
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberAvatar: {
    marginRight: 16,
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  memberRole: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  removeButton: {
    marginLeft: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  divider: {
    marginVertical: 4,
  },
  familyCode: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginVertical: 16,
    letterSpacing: 2,
  },
  familyCodeDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
  },
  copyButton: {
    marginTop: 8,
  },
});
