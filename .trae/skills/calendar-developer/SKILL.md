---
name: calendar-developer
description: Specialized skill for the Calendar project. Invoke when working on any calendar-related features, components, or backend services for this cross-platform calendar application.
---

# Calendar Developer

This skill provides specialized guidance for developing the Calendar application, a cross-platform calendar system supporting Web and mobile (iOS/Android) with features like schedule management, task management, and family sharing.

## Project Overview

The Calendar application is a modern time management tool built with:
- **Web**: React 18.2.0 + Vite 5.0.8
- **Mobile**: Expo 50.0.6 + React Native 0.73.2
- **Backend**: Node.js 23.7.0 + Express 4.18.2 + MongoDB 6.3.0

## Core Features

### 1. Calendar Module
- Multiple view modes: Day/Week/Month
- Calendar navigation (previous/next day/week/month)
- Date selection and event display
- Support for multi-day events

### 2. Schedule Management
- Create, edit, and delete events
- Event reminders (5min, 15min, 30min, 1hr, 1day)
- All-day events
- Recurring events

### 3. Task Management (To-do List)
- Add, edit, and delete tasks
- Toggle task completion status
- Task filtering (All/Completed/Incomplete)
- Recurring tasks (daily/weekly)
- Task date range support
- Tasks displayed on calendar

### 4. Family Sharing (Coming Soon)
- Create family groups
- Invite family members
- Share schedules and tasks
- Permission control

## Code Style Guidelines

### Indentation and Formatting
- Use **2 spaces** for indentation
- Maximum line length: **100 characters**
- 2 blank lines between functions/classes
- 1 blank line between code blocks

### Naming Conventions
- **Variables/Functions**: camelCase (e.g., `userName`, `getUserInfo`)
- **Components/Classes**: PascalCase (e.g., `CalendarView`, `EventForm`)
- **Constants**: UPPER_CASE (e.g., `API_URL`, `MAX_ITEMS`)
- **Files**: camelCase (e.g., `calendarView.jsx`, `userService.js`)

### React/React Native Guidelines
- Prefer **function components** with Hooks
- Use `useState` for component state
- Use `useEffect` for side effects
- Props should use camelCase
- Boolean props: `is` or `has` prefix (e.g., `isPrimary`, `hasError`)
- Callback props: `on` prefix (e.g., `onClick`, `onSubmit`)

### Web Styling
- Use CSS Modules or Styled Components
- Avoid inline styles (except for dynamic styles)
- Use BEM naming or kebab-case for CSS classes
- CSS variables for theme colors

### Mobile Styling
- Use StyleSheet API from React Native
- Avoid inline styles
- camelCase for style names

## Project Structure

### Web Structure
```
web/
├── src/
│   ├── components/
│   │   ├── Calendar.jsx
│   │   ├── EventForm.jsx
│   │   ├── Sidebar.jsx
│   │   ├── TaskList.jsx
│   │   └── ViewToggle.jsx
│   ├── App.jsx
│   ├── main.jsx
│   ├── App.css
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

### Backend Structure (Planned)
```
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── app.js
├── .env
└── package.json
```

## Data Models

### Event Model
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  startTime: Date,
  endTime: Date,
  location: String,
  creatorId: ObjectId,
  familyId: ObjectId,
  participants: [ObjectId],
  isAllDay: Boolean,
  repeat: String,
  reminder: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  dueDate: Date,
  assignedTo: ObjectId,
  creatorId: ObjectId,
  familyId: ObjectId,
  completed: Boolean,
  priority: String,
  repeat: String,
  reward: String,
  punishment: String,
  createdAt: Date,
  updatedAt: Date
}
```

## API Design (Planned)

### RESTful API Structure
- Base URL: `/api/v1`
- Response format: `{ success, data, message }`
- Authentication: JWT Bearer token

### Endpoints
- `GET /api/v1/events` - Get events list
- `POST /api/v1/events` - Create event
- `PUT /api/v1/events/:id` - Update event
- `DELETE /api/v1/events/:id` - Delete event
- `GET /api/v1/tasks` - Get tasks list
- `POST /api/v1/tasks` - Create task
- `PUT /api/v1/tasks/:id` - Update task
- `PUT /api/v1/tasks/:id/toggle` - Toggle task completion
- `DELETE /api/v1/tasks/:id` - Delete task

## Git Workflow

### Branch Management
- `main`: Stable production branch
- `develop`: Development branch
- `feature/*`: Feature branches
- `hotfix/*`: Hotfix branches

### Commit Message Format
Use Conventional Commits:
- `feat(web): Add calendar month view`
- `fix(mobile): Fix task list rendering issue`
- `docs: Update development environment documentation`
- `style: Adjust code formatting`
- `refactor: Refactor event handling logic`
- `test: Add unit tests`
- `chore: Update dependency versions`

## Development Commands

### Web Development
```bash
cd web
npm install
npm run dev
```

### Mobile Development
```bash
cd mobile
npm install
npm start
```

### Backend Development (Planned)
```bash
cd backend
npm install
npm run dev
```

## Testing Requirements

### Test Coverage
- Unit test coverage: ≥ 80%
- Integration test coverage: ≥ 70%
- UI test coverage: ≥ 60%

### Testing Tools
- Frontend: Jest, React Testing Library, Cypress
- Backend: Jest, Supertest, Mocha

## Performance Requirements

- Page load time: ≤ 2 seconds
- First Contentful Paint (FCP): ≤ 1 second
- Largest Contentful Paint (LCP): ≤ 1.5 seconds
- API response time: ≤ 500ms

## Security Requirements

- Password encryption with bcrypt (12 rounds)
- JWT token in HttpOnly Cookie
- HTTPS for data transmission
- Input validation with Joi
- CORS configuration
- Rate limiting (100 requests per 15 minutes)

## Browser Compatibility

- Chrome ≥ 90
- Firefox ≥ 88
- Safari ≥ 14
- Edge ≥ 90

## Mobile Compatibility

- iOS ≥ 14
- Android ≥ 10

## When to Use This Skill

Invoke this skill when:
- Developing calendar-related features (views, events, tasks)
- Working on Web frontend (React/Vite)
- Working on Mobile frontend (Expo/React Native)
- Working on Backend services (Node.js/Express/MongoDB)
- Designing or implementing APIs
- Writing tests for calendar features
- Reviewing code for the Calendar project
- Planning new features for the Calendar application

## Best Practices

1. **Component Design**: Keep components small and focused
2. **State Management**: Use Context API for global state
3. **Code Reusability**: Extract common logic into custom hooks
4. **Performance**: Use React.memo, useMemo, useCallback for optimization
5. **Accessibility**: Ensure components are accessible to all users
6. **Testing**: Write tests for all new features
7. **Documentation**: Update documentation when adding new features
8. **Code Review**: All changes must go through Pull Request review

## Common Tasks

### Adding a New Event
1. Create event data structure
2. Update React state
3. Render event in calendar view
4. Add event form for creation/editing
5. Implement delete functionality

### Adding a New Task
1. Create task data structure
2. Add task to task list
3. Implement task completion toggle
4. Display task on calendar (if applicable)
5. Add task filtering

### Implementing a New View
1. Create view component
2. Add view to ViewToggle component
3. Implement view-specific logic
4. Style the view
5. Test view navigation

## Related Documentation

- [Requirements Document](file:///c:/Users/ZilongCheng/Documents/trae_projects/Calendar/需求分析文档.md)
- [Feature Design Document](file:///c:/Users/ZilongCheng/Documents/trae_projects/Calendar/功能设计文档.md)
- [Technical Architecture Document](file:///c:/Users/ZilongCheng/Documents/trae_projects/Calendar/.trae/技术架构文档.md)
- [Code Standards Document](file:///c:/Users/ZilongCheng/Documents/trae_projects/Calendar/.trae/代码规范文档.md)
- [API Documentation](file:///c:/Users/ZilongCheng/Documents/trae_projects/Calendar/.trae/API接口文档.md)
- [Data Model Documentation](file:///c:/Users/ZilongCheng/Documents/trae_projects/Calendar/.trae/数据模型文档.md)
- [Component Design Documentation](file:///c:/Users/ZilongCheng/Documents/trae_projects/Calendar/.trae/组件设计文档.md)
- [State Management Documentation](file:///c:/Users/ZilongCheng/Documents/trae_projects/Calendar/.trae/状态管理文档.md)
- [Security Design Documentation](file:///c:/Users/ZilongCheng/Documents/trae_projects/Calendar/.trae/安全设计文档.md)
- [Performance Optimization Documentation](file:///c:/Users/ZilongCheng/Documents/trae_projects/Calendar/.trae/性能优化文档.md)
- [Deployment Documentation](file:///c:/Users/ZilongCheng/Documents/trae_projects/Calendar/.trae/部署文档.md)

## Contact

For questions or issues related to this skill, contact the development team or technical lead.