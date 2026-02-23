import React, { useState } from 'react'

const TaskList = ({ tasks, onAddTask, onToggleTask }) => {
  const [newTask, setNewTask] = useState('')
  const [filter, setFilter] = useState('all') // all, completed, pending
  const [recurrence, setRecurrence] = useState('none') // none, daily, weekly
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  // Reward settings
  const [assignee, setAssignee] = useState('')
  const [checker, setChecker] = useState('')
  const [rewardType, setRewardType] = useState('none')
  const [points, setPoints] = useState(5)
  
  // Family members for assignment
  const familyMembers = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Tom Doe' },
  ]
  
  // Reward types
  const rewardTypes = [
    { id: 'none', name: 'No Reward' },
    { id: 'custom', name: 'Custom Reward' },
    { id: 'sleep_30', name: '30 Min Extra Sleep' },
    { id: 'screen_15', name: '15 Min Screen Time' },
    { id: 'snack', name: 'Favorite Snack' },
    { id: 'exercise', name: '30 Min Exercise' },
  ]

  const handleAddTask = (e) => {
    e.preventDefault()
    if (newTask.trim()) {
      const taskStartDate = new Date(startDate)
      const taskEndDate = new Date(endDate)
      taskEndDate.setHours(23, 59, 59, 999)

      const duration = Math.ceil((taskEndDate - taskStartDate) / (1000 * 60 * 60 * 24)) + 1

      onAddTask({
        title: newTask.trim(),
        completed: false,
        createdAt: new Date(),
        recurrence,
        duration,
        startDate: taskStartDate,
        endDate: taskEndDate,
        assignee,
        checker,
        rewardType,
        points,
        approved: false,
      })
      setNewTask('')
      setRecurrence('none')
      setStartDate(new Date().toISOString().split('T')[0])
      setEndDate(new Date().toISOString().split('T')[0])
      setAssignee('')
      setChecker('')
      setRewardType('none')
      setPoints(5)
      setShowAdvanced(false)
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
        <div className="task-form-basic">
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
        
        <button 
          type="button" 
          className="advanced-toggle"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? '▼ Hide Rewards' : '▶ Add Rewards & Points'}
        </button>
        
        {showAdvanced && (
          <div className="task-reward-settings">
            <div className="reward-field">
              <label>Assignee:</label>
              <select 
                value={assignee} 
                onChange={(e) => setAssignee(e.target.value)}
              >
                <option value="">Select Assignee</option>
                {familyMembers.map(member => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
            </div>
            <div className="reward-field">
              <label>Checker:</label>
              <select 
                value={checker} 
                onChange={(e) => setChecker(e.target.value)}
              >
                <option value="">Select Checker</option>
                {familyMembers.map(member => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
            </div>
            <div className="reward-field">
              <label>Reward Type:</label>
              <select 
                value={rewardType} 
                onChange={(e) => setRewardType(e.target.value)}
              >
                {rewardTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            <div className="reward-field">
              <label>Points:</label>
              <input 
                type="number" 
                value={points} 
                onChange={(e) => setPoints(Math.max(1, Math.min(19, parseInt(e.target.value) || 1)))}
                min="1"
                max="19"
                className="points-input"
              />
              <span className="points-hint">(1-19)</span>
            </div>
          </div>
        )}
        
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
              <div className="task-info">
                <span className="task-title">{task.title}</span>
                <div className="task-meta">
                  {task.recurrence !== 'none' && (
                    <span className="task-recurrence-label">
                      {task.recurrence === 'daily' ? 'Daily' : 'Weekly'}
                    </span>
                  )}
                  {task.duration > 1 && (
                    <span className="task-duration-label">
                      {task.duration} days
                    </span>
                  )}
                  {task.points > 0 && (
                    <span className="task-points-label">
                      {task.points} pts
                    </span>
                  )}
                  {task.rewardType && task.rewardType !== 'none' && (
                    <span className="task-reward-label">
                      🎁
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TaskList
