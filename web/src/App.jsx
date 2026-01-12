import React, { useState } from 'react'
import Calendar from './components/Calendar'
import Sidebar from './components/Sidebar'

function App() {
  const [view, setView] = useState('month') // day, week, month
  const [events, setEvents] = useState([
    { 
      id: 1, 
      title: 'Test Event', 
      start: new Date(), 
      end: new Date(Date.now() + 60 * 60 * 1000),
      description: 'This is a test event',
      location: 'Test Location'
    }
  ])
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Test Task 1', completed: false, createdAt: new Date(), recurrence: 'none', duration: 1, startDate: new Date(), endDate: new Date() },
    { id: 2, title: 'Test Task 2', completed: true, createdAt: new Date(), recurrence: 'daily', duration: 3, startDate: new Date(), endDate: new Date(new Date().setDate(new Date().getDate() + 2)) }
  ])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Convert tasks to calendar events
  const getTaskEvents = () => {
    const taskEvents = []
    
    tasks.forEach(task => {
      if (!task.completed) {
        // Calculate duration in days
        const durationInDays = Math.ceil((task.endDate - task.startDate) / (1000 * 60 * 60 * 24)) + 1
        
        // For recurring tasks, generate events for the current month
        if (task.recurrence === 'daily') {
          const today = new Date()
          const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
          
          let currentDate = new Date(task.startDate)
          while (currentDate <= endOfMonth) {
            const taskEndDate = new Date(currentDate)
            taskEndDate.setDate(taskEndDate.getDate() + durationInDays - 1)
            taskEndDate.setHours(23, 59, 59, 999)
            
            taskEvents.push({
              id: `task-${task.id}-${currentDate.toISOString()}`,
              title: `[Task] ${task.title}`,
              start: new Date(currentDate),
              end: taskEndDate,
              isTask: true,
              taskId: task.id
            })
            
            currentDate.setDate(currentDate.getDate() + 1)
          }
        } else if (task.recurrence === 'weekly') {
          const today = new Date()
          const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
          
          let currentDate = new Date(task.startDate)
          while (currentDate <= endOfMonth) {
            const taskEndDate = new Date(currentDate)
            taskEndDate.setDate(taskEndDate.getDate() + durationInDays - 1)
            taskEndDate.setHours(23, 59, 59, 999)
            
            taskEvents.push({
              id: `task-${task.id}-${currentDate.toISOString()}`,
              title: `[Task] ${task.title}`,
              start: new Date(currentDate),
              end: taskEndDate,
              isTask: true,
              taskId: task.id
            })
            
            currentDate.setDate(currentDate.getDate() + 7)
          }
        } else {
          // Non-recurring task - use exact start and end dates
          taskEvents.push({
            id: `task-${task.id}`,
            title: `[Task] ${task.title}`,
            start: new Date(task.startDate),
            end: new Date(task.endDate),
            isTask: true,
            taskId: task.id
          })
        }
      }
    })
    
    return taskEvents
  }

  // Combine regular events and task events
  const allEvents = [...events, ...getTaskEvents()]

  return (
    <div className="app">
      <Sidebar 
        view={view}
        onViewChange={setView}
        tasks={tasks}
        onAddTask={(task) => setTasks([...tasks, { id: Date.now(), ...task }])}
        onToggleTask={(id) => setTasks(tasks.map(task => 
          task.id === id ? { ...task, completed: !task.completed } : task
        ))}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Calendar 
          view={view}
          events={allEvents}
          onViewChange={setView}
          onAddEvent={(event) => setEvents([...events, { id: Date.now(), ...event }])}
          onUpdateEvent={(updatedEvent) => setEvents(events.map(event => 
            event.id === updatedEvent.id ? updatedEvent : event
          ))}
          onDeleteEvent={(id) => setEvents(events.filter(event => event.id !== id))}
        />
      </main>
    </div>
  )
}

export default App