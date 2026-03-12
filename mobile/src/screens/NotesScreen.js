import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, IconButton, Menu, Portal } from 'react-native-paper';
import { useNotes } from '../context/NotesContext';

const categories = ['All', 'Work', 'Personal', 'Reading', 'Travel', 'Cooking'];

export default function NotesScreen() {
  const navigation = useNavigation();
  const { notes, deleteNote } = useNotes();
  const [filter, setFilter] = useState('All');
  const [expandedNoteId, setExpandedNoteId] = useState(null);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);

  const handleFilterChange = (category) => {
    setFilter(category);
    setCategoryMenuVisible(false);
  };

  const filteredNotes = notes.filter(note => {
    if (filter === 'All') return true;
    return note.category === filter;
  });

  const handleNotePress = (noteId) => {
    setExpandedNoteId(expandedNoteId === noteId ? null : noteId);
  };

  const handleAddNote = () => {
    navigation.navigate('NoteDetail');
  };

  const handleEditNote = (noteId) => {
    navigation.navigate('NoteDetail', { noteId });
  };

  const handleDeleteNote = (noteId) => {
    deleteNote(noteId);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Work': '#4CAF50',
      'Personal': '#2196F3',
      'Reading': '#FF9800',
      'Travel': '#9C27B0',
      'Cooking': '#F44336',
    };
    return colors[category] || '#607D8B';
  };

  return (
    <View style={styles.container}>
      <View style={styles.categoryContainer}>
        <Menu
          visible={categoryMenuVisible}
          onDismiss={() => setCategoryMenuVisible(false)}
          anchor={
            <TouchableOpacity
              style={styles.categoryDropdown}
              onPress={() => setCategoryMenuVisible(true)}
            >
              <Text style={styles.categoryDropdownText}>{filter}</Text>
              <Text style={styles.categoryDropdownIcon}>▼</Text>
            </TouchableOpacity>
          }
          contentStyle={styles.menuContent}
        >
          {categories.map((category) => (
            <Menu.Item
              key={category}
              onPress={() => handleFilterChange(category)}
              title={category}
              titleStyle={styles.menuItemTitle}
            />
          ))}
        </Menu>
      </View>

      <ScrollView style={styles.notesListContainer}>
        {filteredNotes.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>No notes found.</Text>
              <Text style={styles.emptySubText}>Add a new note to get started.</Text>
            </Card.Content>
          </Card>
        ) : (
          filteredNotes.map((note) => (
            <Card 
              key={note.id} 
              style={styles.noteCard}
              onPress={() => handleNotePress(note.id)}
            >
              <Card.Content>
                <View style={styles.noteHeader}>
                  <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(note.category) }]}>
                    <Text style={styles.categoryBadgeText}>{note.category}</Text>
                  </View>
                  <Text style={styles.noteDate}>{note.date}</Text>
                </View>
                <Text style={styles.noteTitle}>{note.title}</Text>
                <Text 
                  style={styles.noteContent} 
                  numberOfLines={expandedNoteId === note.id ? undefined : 2}
                >
                  {note.content}
                </Text>
                {expandedNoteId === note.id && (
                  <View style={styles.noteActions}>
                    <IconButton
                      icon="pencil"
                      size={20}
                      onPress={() => handleEditNote(note.id)}
                    />
                    <IconButton
                      icon="delete"
                      size={20}
                      onPress={() => handleDeleteNote(note.id)}
                    />
                  </View>
                )}
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      <View style={styles.addNoteContainer}>
        <Button
          mode="contained"
          style={styles.addNoteButton}
          icon="plus"
          onPress={handleAddNote}
        >
          Add Note
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
  categoryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoryDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    minHeight: 44,
  },
  categoryDropdownText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  categoryDropdownIcon: {
    fontSize: 12,
    color: '#666666',
  },
  menuContent: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    maxWidth: 200,
  },
  menuItemTitle: {
    color: '#333333',
    fontSize: 14,
  },
  notesListContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  noteCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 1,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  noteDate: {
    fontSize: 12,
    color: '#999999',
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  noteContent: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  noteActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
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
  addNoteContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  addNoteButton: {
    borderRadius: 12,
  },
});
