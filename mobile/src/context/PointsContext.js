import React, { createContext, useState, useContext } from 'react';

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

const getMonthStart = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const initialMembers = [
  { id: '1', name: 'John Doe', avatar: 'JD', basePoints: 100, currentPoints: 0 },
  { id: '2', name: 'Jane Smith', avatar: 'JS', basePoints: 80, currentPoints: 0 },
  { id: '3', name: 'Tom Doe', avatar: 'TD', basePoints: 50, currentPoints: 0 },
];

const initialCheckInTasks = [
  { 
    id: '1', 
    title: 'Morning Exercise', 
    frequency: 'daily', 
    totalPoints: 5, 
    memberId: '1', 
    completedDates: [],
  },
  { 
    id: '2', 
    title: 'Read 30 minutes', 
    frequency: 'daily', 
    totalPoints: 3, 
    memberId: '1', 
    completedDates: [],
  },
  { 
    id: '3', 
    title: 'Weekly Review', 
    frequency: 'weekly', 
    totalPoints: 14, 
    memberId: '1', 
    completedDates: [],
  },
  { 
    id: '4', 
    title: 'Study Session', 
    frequency: 'daily', 
    totalPoints: 4, 
    memberId: '2', 
    completedDates: [],
  },
];

const PointsContext = createContext();

export function PointsProvider({ children }) {
  const [members, setMembers] = useState(initialMembers);
  const [checkInTasks, setCheckInTasks] = useState(initialCheckInTasks);

  const isTaskCompletedToday = (task) => {
    const today = formatDate(new Date());
    return task.completedDates.includes(today);
  };

  const getCompletedDatesInPeriod = (task) => {
    const today = new Date();
    const completedDates = task.completedDates;
    
    if (task.frequency === 'daily') {
      const todayStr = formatDate(today);
      return completedDates.includes(todayStr) ? [todayStr] : [];
    } else if (task.frequency === 'weekly') {
      const weekStart = getWeekStart(today);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      return completedDates.filter(dateStr => {
        const date = new Date(dateStr);
        return date >= weekStart && date <= weekEnd;
      });
    } else if (task.frequency === 'monthly') {
      const monthStart = getMonthStart(today);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      return completedDates.filter(dateStr => {
        const date = new Date(dateStr);
        return date >= monthStart && date <= monthEnd;
      });
    }
    
    return [];
  };

  const calculateTaskPoints = (task) => {
    const completedDatesInPeriod = getCompletedDatesInPeriod(task);
    const completedCount = completedDatesInPeriod.length;
    
    if (task.frequency === 'daily') {
      return completedCount * task.totalPoints;
    } else if (task.frequency === 'weekly') {
      return Math.floor((completedCount / 7) * task.totalPoints);
    } else if (task.frequency === 'monthly') {
      const today = new Date();
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      return Math.floor((completedCount / daysInMonth) * task.totalPoints);
    }
    
    return 0;
  };

  const toggleTaskCheckIn = (taskId) => {
    const today = formatDate(new Date());
    
    setCheckInTasks(prev => {
      const updatedTasks = prev.map(task => {
        if (task.id !== taskId) return task;
        
        const isCompleted = task.completedDates.includes(today);
        let newCompletedDates;
        
        if (isCompleted) {
          newCompletedDates = task.completedDates.filter(d => d !== today);
        } else {
          newCompletedDates = [...task.completedDates, today];
        }
        
        return { 
          ...task, 
          completedDates: newCompletedDates
        };
      });
      
      const task = updatedTasks.find(t => t.id === taskId);
      if (task) {
        const memberTasks = updatedTasks.filter(t => t.memberId === task.memberId);
        const currentPoints = memberTasks.reduce((sum, t) => sum + calculateTaskPoints(t), 0);
        
        setMembers(prevMembers => {
          return prevMembers.map(m => {
            if (m.id !== task.memberId) return m;
            return {
              ...m,
              currentPoints: currentPoints,
            };
          });
        });
      }
      
      return updatedTasks;
    });
  };

  const getMemberTasks = (memberId) => {
    return checkInTasks.filter(task => task.memberId === memberId);
  };

  const getMemberById = (memberId) => {
    return members.find(m => m.id === memberId);
  };

  const addCheckInTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      completedDates: [],
    };
    setCheckInTasks([...checkInTasks, newTask]);
  };

  const updateCheckInTask = (taskId, updatedTask) => {
    setCheckInTasks(prev => prev.map(task => {
      if (task.id !== taskId) return task;
      return { ...task, ...updatedTask };
    }));
  };

  const deleteCheckInTask = (taskId) => {
    const taskToDelete = checkInTasks.find(t => t.id === taskId);
    if (!taskToDelete) return;
    
    setCheckInTasks(prev => {
      const updatedTasks = prev.filter(task => task.id !== taskId);
      
      const memberTasks = updatedTasks.filter(t => t.memberId === taskToDelete.memberId);
      const currentPoints = memberTasks.reduce((sum, t) => sum + calculateTaskPoints(t), 0);
      
      setMembers(prevMembers => {
        return prevMembers.map(m => {
          if (m.id !== taskToDelete.memberId) return m;
          return {
            ...m,
            currentPoints: currentPoints,
          };
        });
      });
      
      return updatedTasks;
    });
  };

  const getMemberTotalPoints = (memberId) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return 0;
    return member.basePoints + member.currentPoints;
  };

  const getMemberDailyPoints = (memberId) => {
    const today = formatDate(new Date());
    const memberTasks = getMemberTasks(memberId);
    return memberTasks.reduce((sum, task) => {
      if (task.completedDates.includes(today)) {
        if (task.frequency === 'daily') {
          return sum + task.totalPoints;
        } else if (task.frequency === 'weekly') {
          return sum + Math.floor(task.totalPoints / 7);
        } else if (task.frequency === 'monthly') {
          const todayDate = new Date();
          const daysInMonth = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0).getDate();
          return sum + Math.floor(task.totalPoints / daysInMonth);
        }
      }
      return sum;
    }, 0);
  };

  const getMemberDailyTotalPoints = (memberId) => {
    const memberTasks = getMemberTasks(memberId);
    return memberTasks.reduce((sum, task) => {
      if (task.frequency === 'daily') {
        return sum + task.totalPoints;
      } else if (task.frequency === 'weekly') {
        return sum + Math.floor(task.totalPoints / 7);
      } else if (task.frequency === 'monthly') {
        const today = new Date();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        return sum + Math.floor(task.totalPoints / daysInMonth);
      }
      return sum;
    }, 0);
  };

  const getMemberStreak = (memberId) => {
    const memberTasks = getMemberTasks(memberId);
    if (memberTasks.length === 0) return 0;
    
    let maxStreak = 0;
    memberTasks.forEach(task => {
      if (task.completedDates.length > maxStreak) {
        maxStreak = task.completedDates.length;
      }
    });
    return maxStreak;
  };

  return (
    <PointsContext.Provider value={{ 
      members,
      checkInTasks,
      isTaskCompletedToday,
      toggleTaskCheckIn,
      getMemberTasks,
      getMemberById,
      addCheckInTask,
      updateCheckInTask,
      deleteCheckInTask,
      getMemberTotalPoints,
      getMemberDailyPoints,
      getMemberDailyTotalPoints,
      getMemberStreak,
      getCompletedDatesInPeriod,
      calculateTaskPoints,
    }}>
      {children}
    </PointsContext.Provider>
  );
}

export function usePoints() {
  const context = useContext(PointsContext);
  if (!context) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
}
