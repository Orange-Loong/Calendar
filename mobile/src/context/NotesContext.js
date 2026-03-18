import React, { createContext, useState, useContext } from 'react';

const initialNotes = [];

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
