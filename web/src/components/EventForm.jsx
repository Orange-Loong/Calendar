import React, { useState, useEffect } from 'react'

const EventForm = ({ event, defaultDate, onSubmit, onCancel, onDelete }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: new Date(),
    end: new Date(),
    location: ''
  })

  useEffect(() => {
    if (event) {
      setFormData(event)
    } else if (defaultDate) {
      setFormData({
        title: '',
        description: '',
        start: new Date(defaultDate),
        end: new Date(defaultDate.getTime() + 60 * 60 * 1000), // 1 hour later
        location: ''
      })
    }
  }, [event, defaultDate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDateTimeChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: new Date(value)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const eventData = event ? { ...formData, id: event.id } : formData
    onSubmit(eventData)
  }

  return (
    <div className="event-form">
      <h3>{event ? 'Edit Event' : 'Add New Event'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group" style={{ flex: 1, marginRight: '10px' }}>
            <label htmlFor="start">Start Time</label>
            <input
              type="datetime-local"
              id="start"
              name="start"
              value={formData.start.toISOString().slice(0, 16)}
              onChange={(e) => handleDateTimeChange('start', e.target.value)}
              required
            />
          </div>
          
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="end">End Time</label>
            <input
              type="datetime-local"
              id="end"
              name="end"
              value={formData.end.toISOString().slice(0, 16)}
              onChange={(e) => handleDateTimeChange('end', e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-actions">
          {onDelete && (
            <button 
              type="button" 
              className="btn-delete" 
              style={{ backgroundColor: '#dc3545', color: 'white', marginRight: 'auto' }}
              onClick={onDelete}
            >
              Delete
            </button>
          )}
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {event ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EventForm