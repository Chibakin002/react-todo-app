import React, { useState } from 'react';
import './AddTodo.css';

const AddTodo = ({ onAddTodo }) => {
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (inputValue.trim() === '') {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate a brief loading state for better UX
    setTimeout(() => {
      onAddTodo(inputValue);
      setInputValue('');
      setIsSubmitting(false);
    }, 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setInputValue('');
    }
  };

  return (
    <div className="add-todo">
      <form onSubmit={handleSubmit} className="add-todo-form">
        <div className="input-container">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What needs to be done? Press Escape to clear..."
            className="add-todo-input"
            disabled={isSubmitting}
            maxLength={200}
          />
          <button
            type="submit"
            className="add-todo-btn"
            disabled={inputValue.trim() === '' || isSubmitting}
            title="Add todo (Enter)"
          >
            {isSubmitting ? '⏳' : '➕'}
          </button>
        </div>
        <div className="input-footer">
          <span className="char-count">
            {inputValue.length}/200 characters
          </span>
          {inputValue.trim() && (
            <span className="input-hint">
              Press Enter to add, Escape to clear
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddTodo;