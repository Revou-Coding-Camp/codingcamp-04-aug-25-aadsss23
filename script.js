class TodoApp {
    constructor() {
        this.todos = this.loadTodos();
        this.editingId = null;
        this.initializeElements();
        this.attachEventListeners();
        this.renderTodos();
        this.updateStats();
        this.setMinDate();
    }

    initializeElements() {
        // Form elements
        this.todoForm = document.getElementById('todoForm');
        this.todoInput = document.getElementById('todoInput');
        this.dateInput = document.getElementById('dateInput');
        this.prioritySelect = document.getElementById('prioritySelect');
        this.categorySelect = document.getElementById('categorySelect');
        this.submitBtn = document.getElementById('submitBtn');
        
        // Error elements
        this.todoError = document.getElementById('todoError');
        this.dateError = document.getElementById('dateError');
        
        // Filter and search elements
        this.searchInput = document.getElementById('searchInput');
        this.clearSearch = document.getElementById('clearSearch');
        this.statusFilter = document.getElementById('statusFilter');
        this.priorityFilter = document.getElementById('priorityFilter');
        this.categoryFilter = document.getElementById('categoryFilter');
        this.sortSelect = document.getElementById('sortSelect');
        
        // Action buttons
        this.clearCompleted = document.getElementById('clearCompleted');
        this.clearAll = document.getElementById('clearAll');
        
        // Display elements
        this.todoList = document.getElementById('todoList');
        this.emptyState = document.getElementById('emptyState');
        this.totalTasks = document.getElementById('totalTasks');
        this.completedTasks = document.getElementById('completedTasks');
        this.pendingTasks = document.getElementById('pendingTasks');
        
        // Modal elements
        this.confirmModal = document.getElementById('confirmModal');
        this.confirmMessage = document.getElementById('confirmMessage');
        this.confirmYes = document.getElementById('confirmYes');
        this.confirmNo = document.getElementById('confirmNo');
    }

    attachEventListeners() {
        // Form submission
        this.todoForm.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Input validation
        this.todoInput.addEventListener('input', () => this.validateTodoInput());
        this.dateInput.addEventListener('change', () => this.validateDateInput());
        
        // Search and filters
        this.searchInput.addEventListener('input', () => this.renderTodos());
        this.clearSearch.addEventListener('click', () => this.clearSearchInput());
        this.statusFilter.addEventListener('change', () => this.renderTodos());
        this.priorityFilter.addEventListener('change', () => this.renderTodos());
        this.categoryFilter.addEventListener('change', () => this.renderTodos());
        this.sortSelect.addEventListener('change', () => this.renderTodos());
        
        // Action buttons
        this.clearCompleted.addEventListener('click', () => this.showConfirmModal('Are you sure you want to clear all completed tasks?', () => this.clearCompletedTodos()));
        this.clearAll.addEventListener('click', () => this.showConfirmModal('Are you sure you want to clear all tasks? This action cannot be undone.', () => this.clearAllTodos()));
        
        // Modal events
        this.confirmNo.addEventListener('click', () => this.hideConfirmModal());
        this.confirmModal.addEventListener('click', (e) => {
            if (e.target === this.confirmModal) this.hideConfirmModal();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    setMinDate() {
        const today = new Date().toISOString().split('T')[0];
        this.dateInput.setAttribute('min', today);
    }

    validateTodoInput() {
        const value = this.todoInput.value.trim();
        if (value.length === 0) {
            this.showError(this.todoError, 'Task description is required');
            return false;
        } else if (value.length < 3) {
            this.showError(this.todoError, 'Task description must be at least 3 characters');
            return false;
        } else if (value.length > 100) {
            this.showError(this.todoError, 'Task description must be less than 100 characters');
            return false;
        } else {
            this.clearError(this.todoError);
            return true;
        }
    }

    validateDateInput() {
        const selectedDate = new Date(this.dateInput.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (!this.dateInput.value) {
            this.showError(this.dateError, 'Due date is required');
            return false;
        } else if (selectedDate < today) {
            this.showError(this.dateError, 'Due date cannot be in the past');
            return false;
        } else {
            this.clearError(this.dateError);
            return true;
        }
    }

    showError(element, message) {
        element.textContent = message;
        element.parentElement.querySelector('input, select').style.borderColor = '#e74c3c';
    }

    clearError(element) {
        element.textContent = '';
        element.parentElement.querySelector('input, select').style.borderColor = '#e1e5e9';
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const isTodoValid = this.validateTodoInput();
        const isDateValid = this.validateDateInput();
        
        if (!isTodoValid || !isDateValid || !this.prioritySelect.value || !this.categorySelect.value) {
            this.showNotification('Please fill in all required fields correctly', 'error');
            return;
        }

        const todoData = {
            text: this.todoInput.value.trim(),
            date: this.dateInput.value,
            priority: this.prioritySelect.value,
            category: this.categorySelect.value
        };

        if (this.editingId) {
            this.updateTodo(this.editingId, todoData);
        } else {
            this.addTodo(todoData);
        }

        this.resetForm();
    }

    addTodo(todoData) {
        const todo = {
            id: Date.now().toString(),
            ...todoData,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.push(todo);
        this.saveTodos();
        this.renderTodos();
        this.updateStats();
        this.showNotification('Task added successfully!', 'success');
    }

    updateTodo(id, todoData) {
        const todoIndex = this.todos.findIndex(todo => todo.id === id);
        if (todoIndex !== -1) {
            this.todos[todoIndex] = { ...this.todos[todoIndex], ...todoData };
            this.saveTodos();
            this.renderTodos();
            this.updateStats();
            this.showNotification('Task updated successfully!', 'success');
        }
        this.editingId = null;
        this.updateSubmitButton();
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
        this.renderTodos();
        this.updateStats();
        this.showNotification('Task deleted successfully!', 'success');
    }

    toggleTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            todo.completedAt = todo.completed ? new Date().toISOString() : null;
            this.saveTodos();
            this.renderTodos();
            this.updateStats();
            
            const message = todo.completed ? 'Task completed!' : 'Task marked as pending';
            this.showNotification(message, 'success');
        }
    }

    editTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            this.todoInput.value = todo.text;
            this.dateInput.value = todo.date;
            this.prioritySelect.value = todo.priority;
            this.categorySelect.value = todo.category;
            this.editingId = id;
            this.updateSubmitButton();
            this.todoInput.focus();
            this.todoInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    updateSubmitButton() {
        if (this.editingId) {
            this.submitBtn.innerHTML = '<span class="btn-text">Update Task</span><span class="btn-icon">✓</span>';
            this.submitBtn.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
        } else {
            this.submitBtn.innerHTML = '<span class="btn-text">Add Task</span><span class="btn-icon">+</span>';
            this.submitBtn.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
        }
    }

    resetForm() {
        this.todoForm.reset();
        this.editingId = null;
        this.updateSubmitButton();
        this.clearError(this.todoError);
        this.clearError(this.dateError);
        this.setMinDate();
    }

    clearSearchInput() {
        this.searchInput.value = '';
        this.renderTodos();
    }

    clearCompletedTodos() {
        const completedCount = this.todos.filter(todo => todo.completed).length;
        this.todos = this.todos.filter(todo => !todo.completed);
        this.saveTodos();
        this.renderTodos();
        this.updateStats();
        this.showNotification(`${completedCount} completed tasks cleared!`, 'success');
    }

    clearAllTodos() {
        const totalCount = this.todos.length;
        this.todos = [];
        this.saveTodos();
        this.renderTodos();
        this.updateStats();
        this.resetForm();
        this.showNotification(`${totalCount} tasks cleared!`, 'success');
    }

    getFilteredAndSortedTodos() {
        let filteredTodos = [...this.todos];

        // Search filter
        const searchTerm = this.searchInput.value.toLowerCase().trim();
        if (searchTerm) {
            filteredTodos = filteredTodos.filter(todo =>
                todo.text.toLowerCase().includes(searchTerm) ||
                todo.category.toLowerCase().includes(searchTerm)
            );
        }

        // Status filter
        const statusFilter = this.statusFilter.value;
        if (statusFilter !== 'all') {
            switch (statusFilter) {
                case 'completed':
                    filteredTodos = filteredTodos.filter(todo => todo.completed);
                    break;
                case 'pending':
                    filteredTodos = filteredTodos.filter(todo => !todo.completed);
                    break;
                case 'overdue':
                    const today = new Date();
                    today.setHours(23, 59, 59, 999);
                    filteredTodos = filteredTodos.filter(todo => 
                        !todo.completed && new Date(todo.date) < today
                    );
                    break;
            }
        }

        // Priority filter
        const priorityFilter = this.priorityFilter.value;
        if (priorityFilter !== 'all') {
            filteredTodos = filteredTodos.filter(todo => todo.priority === priorityFilter);
        }

        // Category filter
        const categoryFilter = this.categoryFilter.value;
        if (categoryFilter !== 'all') {
            filteredTodos = filteredTodos.filter(todo => todo.category === categoryFilter);
        }

        // Sort todos
        const sortBy = this.sortSelect.value;
        filteredTodos.sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    return new Date(a.date) - new Date(b.date);
                case 'priority':
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                case 'category':
                    return a.category.localeCompare(b.category);
                case 'created':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                default:
                    return 0;
            }
        });

        return filteredTodos;
    }

    renderTodos() {
        const filteredTodos = this.getFilteredAndSortedTodos();
        
        if (filteredTodos.length === 0) {
            this.todoList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🔍</div>
                    <h3>No tasks found</h3>
                    <p>Try adjusting your search or filters.</p>
                </div>
            `;
            return;
        }

        this.todoList.innerHTML = filteredTodos.map(todo => this.createTodoHTML(todo)).join('');
        
        // Add event listeners to new elements
        this.attachTodoEventListeners();
    }

    createTodoHTML(todo) {
        const isOverdue = !todo.completed && new Date(todo.date) < new Date();
        const formattedDate = this.formatDate(todo.date);
        
        return `
            <div class="todo-item ${todo.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''} fade-in" data-id="${todo.id}">
                <div class="todo-header">
                    <div class="todo-main">
                        <div class="todo-text">${this.escapeHtml(todo.text)}</div>
                        <div class="todo-meta">
                            <span class="todo-date">
                                📅 ${formattedDate}
                                ${isOverdue ? '<span style="color: #e74c3c; font-weight: 600;">(Overdue)</span>' : ''}
                            </span>
                            <span class="priority-badge priority-${todo.priority}">
                                ${todo.priority} priority
                            </span>
                            <span class="category-badge">
                                ${this.getCategoryIcon(todo.category)} ${todo.category}
                            </span>
                        </div>
                    </div>
                    <div class="todo-actions">
                        <button class="btn btn-success toggle-btn" data-id="${todo.id}" title="${todo.completed ? 'Mark as pending' : 'Mark as completed'}">
                            ${todo.completed ? '↩️' : '✅'}
                        </button>
                        <button class="btn btn-secondary edit-btn" data-id="${todo.id}" title="Edit task" ${todo.completed ? 'disabled' : ''}>
                            ✏️
                        </button>
                        <button class="btn btn-danger delete-btn" data-id="${todo.id}" title="Delete task">
                            🗑️
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    attachTodoEventListeners() {
        // Toggle buttons
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                this.toggleTodo(id);
            });
        });

        // Edit buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                this.editTodo(id);
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const todo = this.todos.find(t => t.id === id);
                this.showConfirmModal(
                    `Are you sure you want to delete "${todo.text}"?`,
                    () => this.deleteTodo(id)
                );
            });
        });
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(todo => todo.completed).length;
        const pending = total - completed;

        this.totalTasks.textContent = total;
        this.completedTasks.textContent = completed;
        this.pendingTasks.textContent = pending;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    }

    getCategoryIcon(category) {
        const icons = {
            work: '💼',
            personal: '👤',
            shopping: '🛒',
            health: '🏥',
            education: '📚'
        };
        return icons[category] || '📝';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showConfirmModal(message, onConfirm) {
        this.confirmMessage.textContent = message;
        this.confirmModal.classList.add('show');
        
        // Remove any existing event listeners
        this.confirmYes.replaceWith(this.confirmYes.cloneNode(true));
        this.confirmYes = document.getElementById('confirmYes');
        
        this.confirmYes.addEventListener('click', () => {
            onConfirm();
            this.hideConfirmModal();
        });
    }

    hideConfirmModal() {
        this.confirmModal.classList.remove('show');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;

        // Set background color based on type
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            info: '#3498db',
            warning: '#f39c12'
        };
        notification.style.background = colors[type] || colors.info;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + Enter to submit form
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            if (this.todoInput.value.trim()) {
                this.todoForm.dispatchEvent(new Event('submit'));
            }
        }
        
        // Escape to cancel editing
        if (e.key === 'Escape') {
            if (this.editingId) {
                this.resetForm();
                this.showNotification('Editing cancelled', 'info');
            }
            if (this.confirmModal.classList.contains('show')) {
                this.hideConfirmModal();
            }
        }
    }

    saveTodos() {
        try {
            localStorage.setItem('todos', JSON.stringify(this.todos));
        } catch (error) {
            console.error('Error saving todos:', error);
            this.showNotification('Error saving data. Please try again.', 'error');
        }
    }

    loadTodos() {
        try {
            const saved = localStorage.getItem('todos');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading todos:', error);
            this.showNotification('Error loading saved data.', 'error');
            return [];
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});

// Service Worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}