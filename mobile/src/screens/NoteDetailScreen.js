import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Card, SegmentedButtons } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useNotes } from '../context/NotesContext';

const categories = ['Meal', 'Grocery'];

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function NoteDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { addNote, updateNote } = useNotes();
  const { noteId } = route.params || {};
  const { notes } = useNotes();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Meal');

  useEffect(() => {
    if (noteId) {
      const note = notes.find(n => n.id === noteId);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
        setCategory(note.category);
      }
    }
  }, [noteId, notes]);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      navigation.goBack();
      return;
    }

    const noteData = {
      title,
      content,
      category,
      date: formatDate(new Date()),
    };

    if (noteId) {
      updateNote(noteId, noteData);
    } else {
      addNote(noteData);
    }

    navigation.goBack();
  };

  const categoryButtons = categories.map(cat => ({
    value: cat,
    label: cat,
  }));

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Title"
              value={title}
              onChangeText={setTitle}
              mode="outlined"
              style={styles.input}
            />

            <SegmentedButtons
              value={category}
              onValueChange={setCategory}
              buttons={categoryButtons}
              style={styles.categorySelector}
            />

            <TextInput
              label="Content"
              value={content}
              onChangeText={setContent}
              mode="outlined"
              multiline
              numberOfLines={10}
              style={styles.contentInput}
            />

            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.saveButton}
            >
              {noteId ? 'Update' : 'Save'}
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
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
  },
  input: {
    marginBottom: 16,
  },
  categorySelector: {
    marginBottom: 16,
  },
  contentInput: {
    marginBottom: 16,
    minHeight: 200,
  },
  saveButton: {
    borderRadius: 8,
    paddingVertical: 8,
  },
});
