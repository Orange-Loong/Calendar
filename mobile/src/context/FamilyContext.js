import React, { createContext, useState, useContext } from 'react';

const initialFamilyMembers = [
  { id: '1', name: 'John Doe', role: 'Admin', avatar: 'JD' },
  { id: '2', name: 'Jane Smith', role: 'Member', avatar: 'JS' },
  { id: '3', name: 'Tom Doe', role: 'Member', avatar: 'TD' },
  { id: '4', name: 'Lisa Doe', role: 'Member', avatar: 'LD' },
];

const FamilyContext = createContext();

export function FamilyProvider({ children }) {
  const [familyMembers, setFamilyMembers] = useState(initialFamilyMembers);
  const [shareCalendar, setShareCalendar] = useState(true);
  const [shareTasks, setShareTasks] = useState(true);
  const [sharePoints, setSharePoints] = useState(false);

  const inviteMember = (name) => {
    const avatar = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const newMember = {
      id: Date.now().toString(),
      name: name,
      role: 'Member',
      avatar: avatar || 'NM',
    };
    setFamilyMembers([...familyMembers, newMember]);
  };

  const removeMember = (memberId) => {
    setFamilyMembers(familyMembers.filter(member => member.id !== memberId));
  };

  return (
    <FamilyContext.Provider value={{ 
      familyMembers, 
      shareCalendar, 
      shareTasks, 
      sharePoints,
      setShareCalendar,
      setShareTasks,
      setSharePoints,
      inviteMember,
      removeMember,
    }}>
      {children}
    </FamilyContext.Provider>
  );
}

export function useFamily() {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
}
