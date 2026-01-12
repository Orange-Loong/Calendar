import React from 'react'

const ViewToggle = ({ view, onViewChange }) => {
  const handleViewChange = (newView) => {
    onViewChange(newView)
  }

  return (
    <div className="view-toggle">
      <button 
        className={view === 'day' ? 'active' : ''} 
        onClick={() => handleViewChange('day')}
      >
        Day
      </button>
      <button 
        className={view === '3days' ? 'active' : ''} 
        onClick={() => handleViewChange('3days')}
      >
        3 Days
      </button>
      <button 
        className={view === 'week' ? 'active' : ''} 
        onClick={() => handleViewChange('week')}
      >
        Week
      </button>
      <button 
        className={view === 'month' ? 'active' : ''} 
        onClick={() => handleViewChange('month')}
      >
        Month
      </button>
    </div>
  )
}

export default ViewToggle