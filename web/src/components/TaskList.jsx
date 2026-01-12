import React, { useState } from 'react'

const TaskList = ({ tasks, onAddTask, onToggleTask }) => {
  const [newTask, setNewTask] = useState('')
  const [filter, setFilter] = useState('all') // all, completed, pending
  const [recurrence, setRecurrence] = useState('none') // none, daily, weekly
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])

  const handleAddTask = (e) => {
    e.preventDefault()
    if (newTask.trim()) {
      const taskStartDate = new Date(startDate)
      const taskEndDate = new Date(endDate)
      taskEndDate.setHours(23, 59, 59, 999) // Set to end of day

      // Calculate duration in days
      const duration = Math.ceil((taskEndDate - taskStartDate) / (1000 * 60 * 60 * 24)) + 1

      onAddTask({
        title: newTask.trim(),
        completed: false,
        createdAt: new Date(),
        recurrence,
        duration,
        startDate: taskStartDate,
        endDate: taskEndDate
      })
      setNewTask('')
      setRecurrence('none')
      setStartDate(new Date().toISOString().split('T')[0])
      setEndDate(new Date().toISOString().split('T')[0])
    }
  }

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed
    if (filter === 'pending') return !task.completed
    return true
  })

  return (
    <div className="tasks-section">
      <div className="section-header">
        <h3>Tasks</h3>
        <div className="filter-options">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => handleFilterChange('all')}
          >
            All
          </button>
          <button 
            className={filter === 'pending' ? 'active' : ''} 
            onClick={() => handleFilterChange('pending')}
          >
            Pending
          </button>
          <button 
            className={filter === 'completed' ? 'active' : ''} 
            onClick={() => handleFilterChange('completed')}
          >
            Completed
          </button>
        </div>
      </div>
      
      <form className="add-task-form" onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <div className="task-form-advanced">
          <select 
            value={recurrence} 
            onChange={(e) => setRecurrence(e.target.value)}
            className="task-recurrence"
          >
            <option value="none">No Recurrence</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
        <div className="task-date-range">
          <label>
            Start: 
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              className="task-date"
            />
          </label>
          <label>
            End: 
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              className="task-date"
              min={startDate}
            />
          </label>
        </div>
        <button type="submit">Add</button>
      </form>
      
      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <p className="no-tasks">No tasks yet. Add one above!</p>
        ) : (
          filteredTasks.map(task => (
            <div 
              key={task.id} 
              className={`task-item ${task.completed ? 'completed' : ''}`}
              onClick={() => onToggleTask(task.id)}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => {}}
                onClick={(e) => e.stopPropagation()}
              />
              <span>
                {task.title}
                {task.recurrence !== 'none' && (
                  <span className="task-recurrence-label">
                    ({task.recurrence === 'daily' ? 'Daily' : 'Weekly'})
                  </span>
                )}
                {task.duration > 1 && (
                  <span className="task-duration-label">
                    ({task.duration} days)
                  </span>
                )}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TaskList