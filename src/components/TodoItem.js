import React, { useState, useRef, useEffect } from 'react';
import './TodoItem.css';

const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const editInputRef = useRef(null);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editText.trim() !== '') {
      onEdit(todo.id, editText);
      setIsEditing(false);
    } else {
      setEditText(todo.text); // Reset if empty
      setIsEditing(false);
    }
  };

  const handleEditCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-main">
        <label className="todo-checkbox-label">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            className="todo-checkbox"
          />
          <span className="checkbox-custom"></span>
        </label>

        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="edit-form">
            <input
              ref={editInputRef}
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleEditSubmit}
              onKeyDown={handleKeyDown}
              className="edit-input"
              placeholder="Enter todo text..."
            />
          </form>
        ) : (
          <div 
            className="todo-content"
            onDoubleClick={() => !todo.completed && setIsEditing(true)}
            title="Double-click to edit"
          >
            <span className="todo-text">{todo.text}</span>
            <span className="todo-date" title={`Created: ${formatDate(todo.createdAt)}`}>
              {formatDate(todo.createdAt)}
            </span>
          </div>
        )}
      </div>

      <div className="todo-actions">
        {!isEditing && (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="edit-btn"
              title="Edit todo"
              disabled={todo.completed}
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="delete-btn"
              title="Delete todo"
            >
              🗑️
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TodoItem;