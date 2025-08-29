import React, { useState, useEffect } from 'react';
import TodoItem from './TodoItem';
import AddTodo from './AddTodo';
import './TodoList.css';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  const [darkMode, setDarkMode] = useState(false);

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
    
    // Load theme preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDarkMode = savedTheme ? savedTheme === 'dark' : prefersDark;
    
    setDarkMode(shouldUseDarkMode);
    updateTheme(shouldUseDarkMode);
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Update theme in DOM and localStorage
  const updateTheme = (isDark) => {
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    updateTheme(newDarkMode);
  };

  // Add a new todo
  const addTodo = (text) => {
    if (text.trim() !== '') {
      const newTodo = {
        id: Date.now(),
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTodos([newTodo, ...todos]);
    }
  };

  // Toggle todo completion status
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Delete a todo
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Edit a todo
  const editTodo = (id, newText) => {
    if (newText.trim() !== '') {
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, text: newText.trim() } : todo
      ));
    }
  };

  // Clear all completed todos
  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  // Toggle all todos
  const toggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);
    setTodos(todos.map(todo => ({ ...todo, completed: !allCompleted })));
  };

  // Filter todos based on current filter
  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  // Calculate statistics
  const totalTodos = todos.length;
  const activeTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed).length;

  return (
    <div className="todo-app">
      <div className="todo-header">
        <div className="header-content">
          <h1>✨ Todo List</h1>
          <p className="todo-stats">
            {totalTodos} total • {activeTodos} active • {completedTodos} completed
          </p>
        </div>
        <button 
          className="theme-toggle"
          onClick={toggleDarkMode}
          title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
          aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <AddTodo onAddTodo={addTodo} />

      {todos.length > 0 && (
        <div className="todo-controls">
          <button 
            className="toggle-all-btn"
            onClick={toggleAll}
            title={todos.every(todo => todo.completed) ? 'Mark all as active' : 'Mark all as complete'}
          >
            {todos.every(todo => todo.completed) ? '↺' : '✓'} 
            <span>Toggle All</span>
          </button>
          
          <div className="filter-buttons">
            {['all', 'active', 'completed'].map(filterType => (
              <button
                key={filterType}
                className={`filter-btn ${filter === filterType ? 'active' : ''}`}
                onClick={() => setFilter(filterType)}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                {filterType === 'all' && (
                  <span className="count">{totalTodos}</span>
                )}
                {filterType === 'active' && activeTodos > 0 && (
                  <span className="count">{activeTodos}</span>
                )}
                {filterType === 'completed' && completedTodos > 0 && (
                  <span className="count">{completedTodos}</span>
                )}
              </button>
            ))}
          </div>

          {completedTodos > 0 && (
            <button className="clear-completed-btn" onClick={clearCompleted}>
              🗑️ Clear Completed ({completedTodos})
            </button>
          )}
        </div>
      )}

      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            {todos.length === 0 ? (
              <div>
                <div className="empty-icon">📝</div>
                <p>No todos yet. Ready to get organized?</p>
                <small>Add your first task above to get started!</small>
              </div>
            ) : (
              <div>
                <div className="empty-icon">🔍</div>
                <p>No {filter} todos found.</p>
                <small>Try switching to a different filter or add a new task!</small>
              </div>
            )}
          </div>
        ) : (
          filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          ))
        )}
      </div>

      {todos.length > 0 && (
        <div className="todo-footer">
          <div className="footer-content">
            {activeTodos === 0 ? (
              <div className="completion-message">
                <span className="celebration">🎉</span>
                <p>All tasks completed! You're awesome!</p>
                <small>Take a moment to celebrate your productivity ✨</small>
              </div>
            ) : (
              <div className="progress-message">
                <span className="progress-icon">🎢</span>
                <p>
                  {activeTodos === 1 ? '1 task' : `${activeTodos} tasks`} remaining
                </p>
                <small>Keep going! You've got this 💪</small>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;