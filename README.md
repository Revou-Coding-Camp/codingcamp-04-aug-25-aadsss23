Todo List Application

A modern, feature-rich todo list web application built with vanilla HTML, CSS, and JavaScript. This project demonstrates advanced web development concepts while maintaining clean, maintainable code structure.

## 🌟 Features

### Core Functionality
- ✅ **Task Management**: Add, edit, delete, and complete tasks
- 📅 **Date Management**: Set due dates with validation
- 🔍 **Search & Filter**: Real-time search and multiple filtering options
- 📊 **Statistics**: Live dashboard showing task progress
- 💾 **Data Persistence**: Local storage for data retention

### Advanced Features
- 🎯 **Priority Levels**: High, Medium, Low priority classification
- 🏷️ **Categories**: Work, Personal, Shopping, Health, Education
- ⚡ **Smart Sorting**: Sort by date, priority, category, or creation time
- 🚨 **Overdue Detection**: Automatic highlighting of overdue tasks
- 📱 **Responsive Design**: Optimized for all device sizes
- 🎨 **Modern UI**: Glassmorphism design with smooth animations

## 🚀 Live Demo

[View Live Application](https://frabjous-empanada-831d91.netlify.app)

## 📁 Project Structure

```
todo-app/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Single CSS file for all styles
├── js/
│   └── script.js       # Single JavaScript file for all functionality
└── README.md           # Project documentation
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and accessibility features
- **CSS3**: Modern styling with Flexbox, Grid, and animations
- **Vanilla JavaScript**: ES6+ features, classes, and local storage
- **Local Storage API**: Data persistence without backend

## 📋 Requirements Met

This project fulfills all specified requirements:

- [x] Form with todo and date input
- [x] Display todo list functionality
- [x] Add, filter, and delete operations
- [x] Input form validation
- [x] Single CSS file in `css/` folder
- [x] Single JavaScript file in `js/` folder
- [x] Clean, organized code structure

## 🎯 Key Features Breakdown

### Input & Validation
- **Smart Validation**: Real-time form validation with error messages
- **Date Restrictions**: Prevents selection of past dates
- **Character Limits**: Enforces minimum/maximum text lengths
- **Required Fields**: All form fields properly validated

### Task Management
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Status Tracking**: Pending, completed, and overdue states
- **Bulk Actions**: Clear completed tasks or all tasks at once
- **Edit Mode**: In-place editing of existing tasks

### Filtering & Search
- **Real-time Search**: Instant filtering as you type
- **Multiple Filters**: Status, priority, and category filters
- **Smart Sorting**: Multiple sorting criteria available
- **Filter Combinations**: Use multiple filters simultaneously

### User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Keyboard Shortcuts**: Ctrl+Enter to submit, Escape to cancel
- **Visual Feedback**: Toast notifications and loading states
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🎨 Design Features

### Visual Elements
- **Glassmorphism UI**: Modern translucent design
- **Color-coded Priorities**: Visual priority identification
- **Category Icons**: Intuitive category representation
- **Status Indicators**: Clear visual task states

### Animations
- **Smooth Transitions**: Hover effects and state changes
- **Fade Animations**: Elegant task additions/removals
- **Micro-interactions**: Button hover states and focus indicators
- **Loading States**: Visual feedback during operations

## 🔧 Usage Guide

### Adding Tasks
1. Fill in the task description (3-100 characters)
2. Select a due date (today or future)
3. Choose priority level (High/Medium/Low)
4. Select category (Work/Personal/Shopping/Health/Education)
5. Click "Add Task" or press Ctrl+Enter

### Managing Tasks
- **Complete**: Click the ✅ button to mark as done
- **Edit**: Click the ✏️ button to modify task details
- **Delete**: Click the 🗑️ button to remove task
- **Bulk Actions**: Use "Clear Completed" or "Clear All" buttons

### Filtering & Search
- **Search**: Type in the search bar to filter by text
- **Status Filter**: Show all, pending, completed, or overdue tasks
- **Priority Filter**: Filter by High, Medium, or Low priority
- **Category Filter**: Show tasks from specific categories
- **Sorting**: Sort by date, priority, category, or creation time

## 📊 Statistics Dashboard

The app provides real-time statistics:
- **Total Tasks**: Complete count of all tasks
- **Completed**: Number of finished tasks
- **Pending**: Remaining tasks to complete

## 🔒 Data Storage

- **Local Storage**: All data stored in browser's local storage
- **Automatic Saving**: Changes saved immediately
- **Data Persistence**: Tasks remain after browser restart

## 📱 Mobile Support

Fully responsive design optimized for:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
