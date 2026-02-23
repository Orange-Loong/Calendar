import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, IconButton } from 'react-native-paper';

const sampleNotes = [
  { id: '1', title: 'Meeting Notes', content: 'Discussed project timeline and deliverables. Team agreed on Q1 goals.', date: '2026-02-20', category: 'Work' },
  { id: '2', title: 'Shopping List', content: 'Milk, Bread, Eggs, Apples, Chicken, Rice, Vegetables', date: '2026-02-19', category: 'Personal' },
  { id: '3', title: 'Book Recommendations', content: '1. Atomic Habits\n2. Deep Work\n3. The Pragmatic Programmer', date: '2026-02-18', category: 'Reading' },
  { id: '4', title: 'Travel Plans', content: 'Plan trip to Japan: Tokyo, Kyoto, Osaka. Budget: $3000', date: '2026-02-17', category: 'Travel' },
  { id: '5', title: 'Recipe: Pasta Carbonara', content: 'Ingredients: Pasta, Eggs, Bacon, Cheese, Black Pepper', date: '2026-02-15', category: 'Cooking' },
];

const categories = ['All', 'Work', 'Personal', 'Reading', 'Travel', 'Cooking'];

export default function NotesScreen() {
  const navigation = useNavigation();
  const [filter, setFilter] = useState('All');
  const [notes, setNotes] = useState(sampleNotes);
  const [expandedNoteId, setExpandedNoteId] = useState(null);

  const handleFilterChange = (category) => {
    setFilter(category);
  };

  const filteredNotes = notes.filter(note => {
    if (filter === 'All') return true;
    return note.category === filter;
  });

  const handleNotePress = (noteId) => {
    setExpandedNoteId(expandedNoteId === noteId ? null : noteId);
  };

  const handleAddNote = () => {
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, filter === category && styles.categoryButtonActive]}
            onPress={() => handleFilterChange(category)}
          >
            <Text style={[styles.categoryButtonText, filter === category && styles.categoryButtonTextActive]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
                      onPress={() => {}}
                    />
                    <IconButton
                      icon="delete"
                      size={20}
                      onPress={() => {}}
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
    maxHeight: 56,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666666',
  },
  categoryButtonTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
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
