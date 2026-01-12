import React from 'react'
import TaskList from './TaskList'

const Sidebar = ({ view, onViewChange, tasks, onAddTask, onToggleTask, collapsed, onToggleCollapse }) => {
  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && <h2>Digital Calendar</h2>}
        <button 
          className="sidebar-toggle"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>
      
      {!collapsed && (
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
      
      {!collapsed && (
        <TaskList 
          tasks={tasks}
          onAddTask={onAddTask}
          onToggleTask={onToggleTask}
        />
      )}
      
      {!collapsed && (
        <div className="sidebar-section">
          <h3>Family</h3>
          <div className="family-members">
            <p>Family sharing coming soon!</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar