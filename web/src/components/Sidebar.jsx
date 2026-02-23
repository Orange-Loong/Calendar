import React, { useState } from 'react'
import TaskList from './TaskList'

const Sidebar = ({ view, onViewChange, tasks, onAddTask, onToggleTask, collapsed, onToggleCollapse }) => {
  const [activePanel, setActivePanel] = useState('tasks') // tasks, family, points, analytics
  const [familyMembers, setFamilyMembers] = useState([
    { id: 1, name: 'John Doe', role: 'Admin', avatar: 'JD' },
    { id: 2, name: 'Jane Smith', role: 'Member', avatar: 'JS' },
    { id: 3, name: 'Tom Doe', role: 'Member', avatar: 'TD' },
  ])
  const [totalPoints, setTotalPoints] = useState(125)
  const [dailyPoints, setDailyPoints] = useState(15)
  const [shareCalendar, setShareCalendar] = useState(true)
  const [shareTasks, setShareTasks] = useState(true)
  
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    completionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0,
    weeklyData: [
      { day: 'Mon', completed: 5, total: 8 },
      { day: 'Tue', completed: 7, total: 10 },
      { day: 'Wed', completed: 4, total: 6 },
      { day: 'Thu', completed: 8, total: 12 },
      { day: 'Fri', completed: 6, total: 9 },
      { day: 'Sat', completed: 3, total: 5 },
      { day: 'Sun', completed: 2, total: 4 },
    ],
    byCategory: [
      { category: 'Work', count: 12, completed: 8 },
      { category: 'Personal', count: 8, completed: 5 },
      { category: 'Health', count: 6, completed: 4 },
      { category: 'Learning', count: 10, completed: 6 },
    ]
  }
  
  const handleInviteMember = () => {
    const name = prompt('Enter member name:')
    if (name) {
      setFamilyMembers([...familyMembers, {
        id: Date.now(),
        name,
        role: 'Member',
        avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      }])
    }
  }
  
  const handleRemoveMember = (id) => {
    setFamilyMembers(familyMembers.filter(m => m.id !== id))
  }
  
  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && <h2>Calendar</h2>}
        <button 
          className="sidebar-toggle"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>
      
      {!collapsed && (
        <div className="sidebar-nav">
          <button 
            className={`nav-button ${activePanel === 'tasks' ? 'active' : ''}`}
            onClick={() => setActivePanel('tasks')}
          >
            <span className="nav-icon">📋</span>
            <span className="nav-label">Tasks</span>
          </button>
          <button 
            className={`nav-button ${activePanel === 'analytics' ? 'active' : ''}`}
            onClick={() => setActivePanel('analytics')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-label">Analytics</span>
          </button>
          <button 
            className={`nav-button ${activePanel === 'family' ? 'active' : ''}`}
            onClick={() => setActivePanel('family')}
          >
            <span className="nav-icon">👨‍👩‍👧‍👦</span>
            <span className="nav-label">Family</span>
          </button>
          <button 
            className={`nav-button ${activePanel === 'points' ? 'active' : ''}`}
            onClick={() => setActivePanel('points')}
          >
            <span className="nav-icon">⭐</span>
            <span className="nav-label">Points</span>
          </button>
        </div>
      )}
      
      {!collapsed && activePanel === 'tasks' && (
        <div className="sidebar-section">
          <h3>Calendar View</h3>
          <div className="view-options">
            <button 
              className={view === 'day' ? 'active' : ''} 
              onClick={() => onViewChange('day')}
            >
              Day
            </button>
            <button 
              className={view === '3days' ? 'active' : ''} 
              onClick={() => onViewChange('3days')}
            >
              3 Days
            </button>
            <button 
              className={view === 'week' ? 'active' : ''} 
              onClick={() => onViewChange('week')}
            >
              Week
            </button>
            <button 
              className={view === 'month' ? 'active' : ''} 
              onClick={() => onViewChange('month')}
            >
              Month
            </button>
          </div>
        </div>
      )}
      
      {!collapsed && activePanel === 'tasks' && (
        <TaskList 
          tasks={tasks}
          onAddTask={onAddTask}
          onToggleTask={onToggleTask}
        />
      )}
      
      {!collapsed && activePanel === 'analytics' && (
        <div className="sidebar-section analytics-panel">
          <h3>Task Analytics</h3>
          
          <div className="stats-summary">
            <div className="stat-card">
              <span className="stat-value">{taskStats.total}</span>
              <span className="stat-label">Total Tasks</span>
            </div>
            <div className="stat-card">
              <span className="stat-value completed">{taskStats.completed}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-card">
              <span className="stat-value pending">{taskStats.pending}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-card">
              <span className="stat-value rate">{taskStats.completionRate}%</span>
              <span className="stat-label">Completion Rate</span>
            </div>
          </div>
          
          <h4>Weekly Progress</h4>
          <div className="weekly-chart">
            {taskStats.weeklyData.map((day, index) => (
              <div key={index} className="chart-bar-container">
                <div 
                  className="chart-bar" 
                  style={{ 
                    height: `${(day.completed / day.total) * 100}%`,
                    backgroundColor: day.completed === day.total ? '#4CAF50' : '#FF9800'
                  }}
                >
                  <span className="bar-value">{day.completed}/{day.total}</span>
                </div>
                <span className="bar-label">{day.day}</span>
              </div>
            ))}
          </div>
          
          <h4>By Category</h4>
          <div className="category-list">
            {taskStats.byCategory.map((cat, index) => (
              <div key={index} className="category-item">
                <div className="category-info">
                  <span className="category-name">{cat.category}</span>
                  <span className="category-count">{cat.completed}/{cat.count}</span>
                </div>
                <div className="category-progress">
                  <div 
                    className="category-fill" 
                    style={{ width: `${(cat.completed / cat.count) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {!collapsed && activePanel === 'family' && (
        <div className="sidebar-section">
          <h3>Family Members</h3>
          <div className="family-list">
            {familyMembers.map(member => (
              <div key={member.id} className="family-member">
                <div className="member-avatar">{member.avatar}</div>
                <div className="member-info">
                  <span className="member-name">{member.name}</span>
                  <span className="member-role">{member.role}</span>
                </div>
                {member.role !== 'Admin' && (
                  <button 
                    className="remove-member-btn"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <button className="invite-member-btn" onClick={handleInviteMember}>
            + Invite Member
          </button>
          
          <h3>Sharing Settings</h3>
          <div className="sharing-settings">
            <label className="setting-item">
              <input 
                type="checkbox" 
                checked={shareCalendar}
                onChange={(e) => setShareCalendar(e.target.checked)}
              />
              <span>Share Calendar</span>
            </label>
            <label className="setting-item">
              <input 
                type="checkbox" 
                checked={shareTasks}
                onChange={(e) => setShareTasks(e.target.checked)}
              />
              <span>Share Tasks</span>
            </label>
          </div>
          
          <h3>Family Code</h3>
          <div className="family-code">
            <span className="code">ABC12345</span>
            <button className="copy-code-btn">Copy</button>
          </div>
        </div>
      )}
      
      {!collapsed && activePanel === 'points' && (
        <div className="sidebar-section">
          <div className="points-summary">
            <h3>Total Points</h3>
            <div className="total-points">{totalPoints}</div>
            <div className="daily-progress">
              <span>Daily: {dailyPoints}/20</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(dailyPoints / 20) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <h3>Recent Points</h3>
          <div className="points-history">
            <div className="points-item">
              <span className="task-name">Complete project</span>
              <span className="points-value positive">+10</span>
            </div>
            <div className="points-item">
              <span className="task-name">Submit report</span>
              <span className="points-value positive">+5</span>
            </div>
            <div className="points-item">
              <span className="task-name">Team meeting</span>
              <span className="points-value positive">+3</span>
            </div>
          </div>
          
          <h3>Redeem Rewards</h3>
          <div className="rewards-list">
            <div className="reward-item">
              <span className="reward-name">Gift Card</span>
              <span className="reward-points">50 pts</span>
              <button className="redeem-btn" disabled={totalPoints < 50}>Redeem</button>
            </div>
            <div className="reward-item">
              <span className="reward-name">School Bag</span>
              <span className="reward-points">100 pts</span>
              <button className="redeem-btn" disabled={totalPoints < 100}>Redeem</button>
            </div>
            <div className="reward-item">
              <span className="reward-name">Electronics</span>
              <span className="reward-points">200 pts</span>
              <button className="redeem-btn" disabled={totalPoints < 200}>Redeem</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar
