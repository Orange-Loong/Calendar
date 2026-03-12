import React, { createContext, useState, useContext } from 'react';

const initialNotes = [
  { id: '1', title: 'Meeting Notes', content: 'Discussed project timeline and deliverables. Team agreed on Q1 goals.', date: '2026-02-20', category: 'Work' },
  { id: '2', title: 'Shopping List', content: 'Milk, Bread, Eggs, Apples, Chicken, Rice, Vegetables', date: '2026-02-19', category: 'Personal' },
  { id: '3', title: 'Book Recommendations', content: '1. Atomic Habits\n2. Deep Work\n3. The Pragmatic Programmer', date: '2026-02-18', category: 'Reading' },
  { id: '4', title: 'Travel Plans', content: 'Plan trip to Japan: Tokyo, Kyoto, Osaka. Budget: $3000', date: '2026-02-17', category: 'Travel' },
  { id: '5', title: 'Recipe: Pasta Carbonara', content: 'Ingredients: Pasta, Eggs, Bacon, Cheese, Black Pepper', date: '2026-02-15', category: 'Cooking' },
];

const NotesContext = createContext();

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState(initialNotes);

  const addNote = (note) => {
    const newNote = {
      ...note,
      id: Date.now().toString(),
    };
    setNotes([newNote, ...notes]);
  };

  const updateNote = (noteId, updatedNote) => {
    setNotes(notes.map(note => 
      note.id === noteId ? { ...note, ...updatedNote } : note
    ));
  };

  const deleteNote = (noteId) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}
