import { useState } from 'react'
import EventForm from './EventForm'
import ViewToggle from './ViewToggle'

const Calendar = ({ view, events, onAddEvent, onUpdateEvent, onDeleteEvent, onViewChange }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showEventForm, setShowEventForm] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + direction * 7)
    setCurrentDate(newDate)
  }

  const navigateDay = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + direction)
    setCurrentDate(newDate)
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setSelectedEvent(null)
    setShowEventForm(true)
  }

  const handleEventClick = (event) => {
    setSelectedEvent(event)
    setShowEventForm(true)
  }

  const renderCalendar = () => {
    switch (view) {
      case 'day':
        return <DayView 
          date={currentDate} 
          events={events.filter(event => 
            (isSameDay(event.start, currentDate) || isSameDay(event.end, currentDate)) ||
            (event.start <= currentDate && event.end >= currentDate)
          )}
          onEventClick={handleEventClick}
        />
      case '3days':
        return <ThreeDaysView 
          date={currentDate} 
          events={events.filter(event => 
            (isInThreeDays(event.start, currentDate) || isInThreeDays(event.end, currentDate)) ||
            (event.start <= new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 2)) && 
            (event.end >= currentDate)
          )}
          onEventClick={handleEventClick}
        />
      case 'week':
        return <WeekView 
          date={currentDate} 
          events={events.filter(event => 
            (isInSameWeek(event.start, currentDate) || isInSameWeek(event.end, currentDate)) ||
            (event.start <= new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 6)) && 
            (event.end >= currentDate)
          )}
          onEventClick={handleEventClick}
        />
      case 'month':
      default:
        return <MonthView 
          date={currentDate} 
          events={events.filter(event => 
            (isInSameMonth(event.start, currentDate) || isInSameMonth(event.end, currentDate)) ||
            (event.start <= new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)) && 
            (event.end >= new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
          )}
          onDateSelect={handleDateSelect}
          onEventClick={handleEventClick}
        />
    }
  }

  // Helper functions
  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear()
  }

  const isInSameWeek = (date1, date2) => {
    const weekStart = new Date(date2)
    weekStart.setDate(date2.getDate() - date2.getDay())
    weekStart.setHours(0, 0, 0, 0)
    
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 7)
    
    return date1 >= weekStart && date1 < weekEnd
  }

  const isInSameMonth = (date1, date2) => {
    return date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear()
  }

  const isInThreeDays = (date1, date2) => {
    const threeDaysLater = new Date(date2)
    threeDaysLater.setDate(date2.getDate() + 3)
    threeDaysLater.setHours(0, 0, 0, 0)
    
    const threeDaysEarlier = new Date(date2)
    threeDaysEarlier.setHours(0, 0, 0, 0)
    
    return date1 >= threeDaysEarlier && date1 < threeDaysLater
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
        <ViewToggle view={view} onViewChange={onViewChange} />
        <div className="navigation-buttons">
          <button onClick={() => {
            view === 'day' && navigateDay(-1)
            view === '3days' && navigateDay(-3)
            view === 'week' && navigateWeek(-1)
            view === 'month' && navigateMonth(-1)
          }}>
            Previous
          </button>
          <button onClick={() => {
            view === 'day' && navigateDay(1)
            view === '3days' && navigateDay(3)
            view === 'week' && navigateWeek(1)
            view === 'month' && navigateMonth(1)
          }}>
            Next
          </button>
        </div>
      </div>
      {renderCalendar()}
      
      {showEventForm && (
        <EventForm
          event={selectedEvent}
          defaultDate={selectedDate}
          onSubmit={(eventData) => {
            if (selectedEvent) {
              onUpdateEvent(eventData)
            } else {
              onAddEvent(eventData)
            }
            setShowEventForm(false)
            setSelectedEvent(null)
          }}
          onCancel={() => {
            setShowEventForm(false)
            setSelectedEvent(null)
          }}
          onDelete={selectedEvent ? () => {
            onDeleteEvent(selectedEvent.id)
            setShowEventForm(false)
            setSelectedEvent(null)
          } : undefined}
        />
      )}
    </div>
  )
}

// Day View Component
const DayView = ({ date, events, onEventClick }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i)
  
  return (
    <div className="day-view">
      <h3>{date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
      <div className="day-grid">
        {hours.map(hour => (
          <div key={hour} className="day-hour-row">
            <div className="hour-label">{hour}:00</div>
            <div className="hour-events">
              {events.filter(event => {
                const eventStartHour = event.start.getHours();
                const eventEndHour = event.end.getHours();
                return hour >= eventStartHour && hour < eventEndHour;
              }).map(event => (
                <div 
                  key={event.id} 
                  className={`event-item ${event.isTask ? 'is-task' : ''}`} 
                  onClick={() => onEventClick(event)}
                >
                  {event.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 3 Days View Component
const ThreeDaysView = ({ date, events, onEventClick }) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  return (
    <div className="week-view">
      <div className="three-days-days">
        {[0, 1, 2].map((offset) => {
          const currentDay = new Date(date)
          currentDay.setDate(date.getDate() + offset)
          const dayName = days[currentDay.getDay()]
          
          return (
            <div key={offset} className="week-day-column">
              <div className="week-day-header">
                <div>{dayName}</div>
                <div>{currentDay.getDate()}</div>
              </div>
              <div className="week-day-events">
                {events.filter(event => {
                  const eventDate = new Date(event.start);
                  const endDate = new Date(event.end);
                  const currentDate = new Date(currentDay);
                  currentDate.setHours(0, 0, 0, 0);
                  
                  // Check if event overlaps with current day
                  const eventStart = new Date(event.start);
                  eventStart.setHours(0, 0, 0, 0);
                  
                  const eventEnd = new Date(event.end);
                  eventEnd.setHours(0, 0, 0, 0);
                  
                  return currentDate >= eventStart && currentDate < eventEnd;
                }).map(event => (
                  <div 
                    key={event.id} 
                    className={`event-item ${event.isTask ? 'is-task' : ''}`} 
                    onClick={() => onEventClick(event)}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Week View Component
const WeekView = ({ date, events, onEventClick }) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  // Calculate the first day of the week
  const firstDayOfWeek = new Date(date)
  firstDayOfWeek.setDate(date.getDate() - date.getDay())
  
  return (
    <div className="week-view">
      <div className="week-days">
        {days.map((day, index) => {
          const currentDay = new Date(firstDayOfWeek)
          currentDay.setDate(firstDayOfWeek.getDate() + index)
          
          return (
            <div key={index} className="week-day-column">
              <div className="week-day-header">
                <div>{day}</div>
                <div>{currentDay.getDate()}</div>
              </div>
              <div className="week-day-events">
                {events.filter(event => {
                  const currentDate = new Date(currentDay);
                  currentDate.setHours(0, 0, 0, 0);
                  
                  // Check if event overlaps with current day
                  const eventStart = new Date(event.start);
                  eventStart.setHours(0, 0, 0, 0);
                  
                  const eventEnd = new Date(event.end);
                  eventEnd.setHours(0, 0, 0, 0);
                  
                  return currentDate >= eventStart && currentDate < eventEnd;
                }).map(event => (
                  <div 
                    key={event.id} 
                    className={`event-item ${event.isTask ? 'is-task' : ''}`} 
                    onClick={() => onEventClick(event)}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Month View Component
const MonthView = ({ date, events, onDateSelect, onEventClick }) => {
  const year = date.getFullYear()
  const month = date.getMonth()
  
  // Get first day of month
  const firstDay = new Date(year, month, 1)
  const firstDayOfWeek = firstDay.getDay()
  
  // Get last day of month
  const lastDay = new Date(year, month + 1, 0)
  const totalDays = lastDay.getDate()
  
  // Create calendar grid
  const calendarDays = []
  const daysInGrid = 42 // 6 weeks * 7 days
  
  for (let i = 0; i < daysInGrid; i++) {
    const dayIndex = i - firstDayOfWeek + 1
    const day = new Date(year, month, dayIndex)
    
    calendarDays.push({
      date: day,
      isCurrentMonth: day.getMonth() === month,
      dayNumber: dayIndex
    })
  }
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  return (
    <div className="month-view">
      <div className="month-grid">
        {days.map(day => (
          <div key={day} className="month-day-header">{day}</div>
        ))}
        {calendarDays.map((day, index) => {
          const dayEvents = events.filter(event => {
            const currentDate = new Date(day.date);
            currentDate.setHours(0, 0, 0, 0);
            
            // Check if event overlaps with current day
            const eventStart = new Date(event.start);
            eventStart.setHours(0, 0, 0, 0);
            
            const eventEnd = new Date(event.end);
            eventEnd.setHours(0, 0, 0, 0);
            
            return currentDate >= eventStart && currentDate < eventEnd;
          })
          
          return (
            <div 
              key={index} 
              className={`month-day ${day.isCurrentMonth ? 'current-month' : 'other-month'}`}
              onClick={() => onDateSelect(day.date)}
            >
              <div className="day-number">{day.dayNumber}</div>
              <div className="day-events">
                {dayEvents.map(event => (
                  <div 
                    key={event.id} 
                    className={`event-item small ${event.isTask ? 'is-task' : ''}`} 
                    onClick={(e) => {
                      e.stopPropagation()
                      onEventClick(event)
                    }}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Calendar