import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectToken, logout as logoutAction } from '../store/authSlice';
import axiosInstance from '../api/axios';
import './TodoPage.css';

export function TodoPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector(selectToken);

  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [selectedQuadrant, setSelectedQuadrant] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPomodoroModal, setShowPomodoroModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroMode, setPomodoroMode] = useState('work');

  // 4 Quadrants Definition
  const quadrants = [
    { id: 1, name: 'Urgent & Important', color: '#ef4444', emoji: '🌕', priority: 'CRITICAL' },
    { id: 2, name: 'Important but Not Urgent', color: '#3b82f6', emoji: '🌔', priority: 'HIGH' },
    { id: 3, name: 'Urgent but Not Important', color: '#f59e0b', emoji: '🌓', priority: 'MEDIUM' },
    { id: 4, name: 'Not Urgent & Not Important', color: '#6b7280', emoji: '🌒', priority: 'LOW' }
  ];

  // Convert Priority to Quadrant
  const priorityToQuadrant = (priority) => {
    switch (priority) {
      case 'CRITICAL':
        return 1;
      case 'HIGH':
        return 2;
      case 'MEDIUM':
        return 3;
      case 'LOW':
        return 4;
      default:
        return 4;
    }
  };

  // Fetch todos if token exists
  useEffect(() => {
    if (token) {
      fetchTodos();
    }
  }, [token]);

  // Fetch todos from backend
  const fetchTodos = async () => {
    try {
      const response = await axiosInstance.get('/todos');
      const data = response.data;

      const formattedTodos = data.map(todo => ({
        id: todo.id,
        title: todo.title,
        description: todo.description,
        priority: todo.priority,
        completed: todo.completed,
        pomodoroTime: todo.pomodoroTime || 0, // Add pomodoro time
        quadrant: priorityToQuadrant(todo.priority)
      }));

      setTodos(formattedTodos);
    } catch (error) {
      console.error('Error fetching todos:', error);
      alert('Error fetching todo list.');
    }
  };

  const handleAddTodo = async () => {
    if (!title.trim()) {
      alert('Please enter a todo title.');
      return;
    }
    if (!selectedQuadrant) {
      alert('Please select a priority.');
      return;
    }
    if (!token) {
      alert('Login required.');
      return;
    }

    try {
      const selectedQuadrantInfo = quadrants.find(q => q.id === selectedQuadrant);

      const response = await axiosInstance.post('/todos', {
        title: title.trim(),
        priority: selectedQuadrantInfo.priority
      });

      const newTodo = response.data;
      const formattedTodo = {
        id: newTodo.id,
        title: newTodo.title,
        description: newTodo.description,
        priority: newTodo.priority,
        completed: newTodo.completed,
        pomodoroTime: newTodo.pomodoroTime || 0,
        quadrant: priorityToQuadrant(newTodo.priority)
      };

      setTodos([...todos, formattedTodo]);
      setTitle('');
      setSelectedQuadrant(null);
      setShowAddModal(false);
      alert('Todo added successfully! 🌙');
    } catch (error) {
      console.error('Error adding todo:', error);
      alert('Error adding todo.');
    }
  };

  const handleToggleTodo = async (id) => {
    const todo = todos.find(t => t.id === id);
    const previousTodos = [...todos];

    setTodos(todos.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));

    try {
      await axiosInstance.patch(`/todos/${id}`, { completed: !todo.completed });
    } catch (error) {
      setTodos(previousTodos);
      alert('변경에 실패했습니다.');
    }
  };

  const handleDeleteTodo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) {
      return;
    }

    if (!token) {
      alert('Login required.');
      return;
    }

    try {
      await axiosInstance.delete(`/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
      alert('Todo deleted! 🌑');
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('Error deleting todo.');
    }
  };

  const handleStartPomodoro = (todo) => {
    setSelectedTodo(todo);
    setPomodoroTime(25 * 60);
    setIsRunning(true);
    setPomodoroMode('work');
    setShowPomodoroModal(true);
  };

  const handleStartPomodoroFromCenter = (todoId) => {
    const todo = todoId ? todos.find(t => t.id === parseInt(todoId)) : { id: 'untitled', title: 'Untitled', quadrant: null };
    setSelectedTodo(todo);
    setPomodoroTime(25 * 60);
    setIsRunning(true);
    setPomodoroMode('work');
    setShowPomodoroModal(true);
  };

  const handleToggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const handleResetTimer = () => {
    setPomodoroTime(pomodoroMode === 'work' ? 25 * 60 : 5 * 60);
    setIsRunning(false);
  };

  const handleSwitchMode = () => {
    if (pomodoroMode === 'work') {
      setPomodoroMode('break');
      setPomodoroTime(5 * 60);
    } else {
      setPomodoroMode('work');
      setPomodoroTime(25 * 60);
    }
    setIsRunning(false);
  };

  const handleClosePomodoro = () => {
    setShowPomodoroModal(false);
    setIsRunning(false);
    setSelectedTodo(null);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      dispatch(logoutAction());
      setTodos([]);
      navigate('/');
    }
  };

  // Send time to backend when Pomodoro completes
  const handlePomodoroComplete = async () => {
    const duration = pomodoroMode === 'work' ? 25 : 5;

    // Do not save Untitled
    if (!selectedTodo || selectedTodo.id === 'untitled') {
      alert(pomodoroMode === 'work' ? '🎉 Pomodoro complete! Time for a break.' : '✨ Break over! Time to focus.');

      // Auto switch to break mode
      if (pomodoroMode === 'work') {
        setPomodoroMode('break');
        setPomodoroTime(5 * 60);
      }
      return;
    }

    try {
      console.log('🚀 Calling backend:', `/todos/${selectedTodo.id}/pomodoros`, { duration });

      await axiosInstance.post(`/todos/${selectedTodo.id}/pomodoros`, {
        duration: duration
      });

      alert(pomodoroMode === 'work'
        ? `🎉 Pomodoro complete! ${duration} minutes recorded. Time for a break.`
        : '✨ Break over! Time to focus.');

      // Auto switch to break mode
      if (pomodoroMode === 'work') {
        setPomodoroMode('break');
        setPomodoroTime(5 * 60);
      }
    } catch (error) {
      console.error('❌ Error saving pomodoro:', error);
      alert(pomodoroMode === 'work'
        ? '🎉 Pomodoro complete! (Failed to save record)'
        : '✨ Break over!');

      // Switch to break even on error
      if (pomodoroMode === 'work') {
        setPomodoroMode('break');
        setPomodoroTime(5 * 60);
      }
    }
  };

  // Timer run
  useEffect(() => {
    let interval = null;
    if (isRunning && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime((time) => {
          if (time <= 1) {
            setIsRunning(false);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (pomodoroTime === 0 && !isRunning) {
      console.log('⏰ Timer complete! Sending to backend...');
      handlePomodoroComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, pomodoroTime, pomodoroMode]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const total = pomodoroMode === 'work' ? 25 * 60 : 5 * 60;
    return ((total - pomodoroTime) / total) * 100;
  };

  const getQuadrantInfo = (quadrantId) => {
    return quadrants.find(q => q.id === quadrantId);
  };

  const getSortedTodos = () => {
    return [...todos].sort((a, b) => a.quadrant - b.quadrant);
  };

  return (
    <div className="todo-page">
      {/* Header */}
      <div className="todo-header">
        <h1>📋 PhaseTheDay</h1>
        <div className="header-actions">
          <button className="add-todo-btn" onClick={() => setShowAddModal(true)}>
            ➕ Add Todo
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Pomodoro Section */}
      <div className="center-pomodoro-section">
        <div className="center-pomodoro-card">
          <div className="center-pomodoro-icon">🌙</div>
          <h2 className="center-pomodoro-title">Start Pomodoro</h2>
          <p className="center-pomodoro-description">
            Select a task to focus on and start the timer
          </p>

          <div className="center-pomodoro-selector">
            <select id="todo-select" className="todo-select" defaultValue="">
              <option value="">No task selected (Untitled)</option>
              {getSortedTodos().map(todo => {
                const quadrantInfo = getQuadrantInfo(todo.quadrant);
                return (
                  <option key={todo.id} value={todo.id}>
                    {quadrantInfo.emoji} {todo.title}
                  </option>
                );
              })}
            </select>

            <button
              className="center-start-btn"
              onClick={() => {
                const select = document.getElementById('todo-select');
                handleStartPomodoroFromCenter(select.value);
              }}
            >
              ▶ Start Timer
            </button>
          </div>
        </div>
      </div>

      {/* Todo List */}
      <div className="todo-list-container">
        <div className="todo-list">
          {todos.length === 0 ? (
            <div className="empty-state" onClick={() => setShowAddModal(true)} style={{ cursor: 'pointer' }}>
              <p className="empty-icon">📝</p>
              <p className="empty-text">No todos found</p>
              <p className="empty-subtext">Click here to add a new todo</p>
            </div>
          ) : (
            <>
              <div className="list-header-clickable" onClick={() => setShowAddModal(true)}>
                <p className="list-hint">💡 Click here to add a todo</p>
              </div>
              {getSortedTodos().map(todo => {
                const quadrantInfo = getQuadrantInfo(todo.quadrant);
                console.log('Todo:', todo); // for debugging
                return (
                  <div key={todo.id} className="todo-list-item">
                    <div className="todo-item-main">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleToggleTodo(todo.id)}
                        className="todo-checkbox-list"
                      />
                      <div className="todo-item-content">
                        <span className={`todo-title-list ${todo.completed ? 'completed' : ''}`}>
                          {todo.title}
                        </span>
                        <div className="todo-meta">
                          <span
                            className="todo-badge"
                            style={{
                              backgroundColor: `${quadrantInfo.color}20`,
                              color: quadrantInfo.color,
                              borderColor: quadrantInfo.color
                            }}
                          >
                            {quadrantInfo.emoji} {quadrantInfo.name}
                          </span>
                          <span className="pomodoro-time-badge">
                            🌙 {todo.pomodoroTime || 0}m
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="todo-actions">
                      <button
                        className="pomodoro-btn"
                        onClick={() => handleStartPomodoro(todo)}
                        title="Start Pomodoro"
                      >
                        🌙
                      </button>
                      <button
                        className="delete-btn-list"
                        onClick={() => handleDeleteTodo(todo.id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* Add Todo Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Todo</h2>

            <div className="form-group">
              <label>Todo Title</label>
              <input
                type="text"
                placeholder="Ex: Write project plan"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="todo-input"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>Select Priority</label>
              <div className="quadrant-selector">
                {quadrants.map(quadrant => (
                  <button
                    key={quadrant.id}
                    className={`quadrant-option ${selectedQuadrant === quadrant.id ? 'selected' : ''}`}
                    onClick={() => setSelectedQuadrant(quadrant.id)}
                    style={{
                      borderColor: selectedQuadrant === quadrant.id ? quadrant.color : '#e5e7eb'
                    }}
                  >
                    <span className="option-emoji">{quadrant.emoji}</span>
                    <span className="option-name">{quadrant.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => {
                setShowAddModal(false);
                setTitle('');
                setSelectedQuadrant(null);
              }}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={handleAddTodo}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pomodoro Timer Modal */}
      {showPomodoroModal && selectedTodo && (
        <div className="modal-overlay" onClick={handleClosePomodoro}>
          <div className="pomodoro-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={handleClosePomodoro}>
              ✕
            </button>

            <div className="pomodoro-header">
              <h2>🌙 Pomodoro Timer</h2>
              <p className="pomodoro-todo-title">{selectedTodo.title}</p>
            </div>

            <div className="pomodoro-mode-toggle">
              <button
                className={`mode-btn ${pomodoroMode === 'work' ? 'active' : ''}`}
                onClick={() => pomodoroMode !== 'work' && handleSwitchMode()}
              >
                Focus (25m)
              </button>
              <button
                className={`mode-btn ${pomodoroMode === 'break' ? 'active' : ''}`}
                onClick={() => pomodoroMode !== 'break' && handleSwitchMode()}
              >
                Break (5m)
              </button>
            </div>

            <div className="timer-display">
              <svg className="timer-ring" width="280" height="280">
                <circle
                  className="timer-ring-bg"
                  cx="140"
                  cy="140"
                  r="120"
                />
                <circle
                  className="timer-ring-progress"
                  cx="140"
                  cy="140"
                  r="120"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 120}`,
                    strokeDashoffset: `${2 * Math.PI * 120 * (1 - getProgress() / 100)}`
                  }}
                />
              </svg>
              <div className="timer-text">
                <div className="timer-time">{formatTime(pomodoroTime)}</div>
                <div className="timer-label">
                  {pomodoroMode === 'work' ? 'Focus Time' : 'Break Time'}
                </div>
              </div>
            </div>

            <div className="timer-controls">
              <button
                className={`control-btn ${isRunning ? 'pause' : 'start'}`}
                onClick={handleToggleTimer}
              >
                {isRunning ? '⏸ Pause' : '▶ Start'}
              </button>
              <button className="control-btn reset" onClick={handleResetTimer}>
                🔄 Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}