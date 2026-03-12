import React, { createContext, useState, useContext } from 'react';

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const initialTasks = [
  { id: '1', title: 'Complete project proposal', completed: false, startDate: formatDate(new Date()), endDate: formatDate(new Date()) },
  { id: '2', title: 'Submit expense report', completed: true, startDate: formatDate(new Date()), endDate: formatDate(new Date()) },
  { id: '3', title: 'Schedule team meeting', completed: false, startDate: formatDate(new Date()), endDate: formatDate(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)) },
  { id: '4', title: 'Review Q1 report', completed: false, startDate: formatDate(new Date()), endDate: formatDate(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)) },
  { id: '5', title: 'Client presentation', completed: false, startDate: formatDate(new Date()), endDate: formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) },
  { id: '6', title: 'Weekly standup', completed: false, startDate: formatDate(new Date()), endDate: formatDate(new Date()), isRecurring: true, recurrence: 'weekly' },
];

const TasksContext = createContext();

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState(initialTasks);

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (taskId, updatedTask) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updatedTask } : task
    ));
  };

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <TasksContext.Provider value={{ tasks, addTask, updateTask, toggleTask, deleteTask }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
}
