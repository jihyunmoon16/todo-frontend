import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectToken, logout as logoutAction } from '../store/authSlice';
import axiosInstance from '../api/axios';
import { useToast } from '../components/Toast';
import { useConfirmDialog } from '../components/ConfirmDialog';
import { Sidebar } from '../components/Sidebar';
import { PomodoroPanel } from '../components/PomodoroPanel';
import { TaskCard } from '../components/TaskCard';
import { MoonPhaseIcon, FullMoon, WaxingGibbous, Crescent, NewMoon } from '../components/MoonPhase';
import './TodoPage.css';

export function TodoPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const { showToast } = useToast();
  const { showConfirm, ConfirmDialog } = useConfirmDialog();

  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  // Pomodoro state
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroMode, setPomodoroMode] = useState('work');
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  // Loading states
  const [isLoadingTodos, setIsLoadingTodos] = useState(true);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [deletingTodoId, setDeletingTodoId] = useState(null);
  const [formError, setFormError] = useState('');

  // Mobile sidebar state - reserved for future mobile menu implementation
  // const [sidebarOpen, setSidebarOpen] = useState(false);

  // Priority definitions
  const priorities = [
    { id: 'CRITICAL', name: 'Critical', description: 'Urgent & Important', component: FullMoon },
    { id: 'HIGH', name: 'High', description: 'Important', component: WaxingGibbous },
    { id: 'MEDIUM', name: 'Medium', description: 'Moderate', component: Crescent },
    { id: 'LOW', name: 'Low', description: 'Low Priority', component: NewMoon }
  ];

  // Fetch todos if token exists
  useEffect(() => {
    if (token) {
      fetchTodos();
    }
  }, [token]);

  // Fetch todos from backend
  const fetchTodos = async () => {
    setIsLoadingTodos(true);
    try {
      const response = await axiosInstance.get('/todos');
      const data = response.data;

      const formattedTodos = data.map(todo => ({
        id: todo.id,
        title: todo.title,
        description: todo.description,
        priority: todo.priority,
        completed: todo.completed,
        pomodoroTime: todo.pomodoroTime || 0
      }));

      setTodos(formattedTodos);

      // Calculate total focus time
      const total = formattedTodos.reduce((sum, t) => sum + (t.pomodoroTime || 0), 0);
      setTotalFocusTime(total);
    } catch (error) {
      console.error('Error fetching todos:', error);
      showToast('Error fetching todo list.', 'error');
    } finally {
      setIsLoadingTodos(false);
    }
  };

  const handleAddTodo = async () => {
    setFormError('');
    if (!title.trim()) {
      setFormError('Please enter a todo title.');
      return;
    }
    if (!selectedPriority) {
      setFormError('Please select a priority.');
      return;
    }
    if (!token) {
      showToast('Login required.', 'error');
      return;
    }

    setIsAddingTodo(true);
    try {
      const response = await axiosInstance.post('/todos', {
        title: title.trim(),
        priority: selectedPriority
      });

      const newTodo = response.data;
      const formattedTodo = {
        id: newTodo.id,
        title: newTodo.title,
        description: newTodo.description,
        priority: newTodo.priority,
        completed: newTodo.completed,
        pomodoroTime: newTodo.pomodoroTime || 0
      };

      setTodos([...todos, formattedTodo]);
      setTitle('');
      setSelectedPriority(null);
      setFormError('');
      setShowAddModal(false);
      showToast('Task added successfully!', 'success');
    } catch (error) {
      console.error('Error adding todo:', error);
      showToast('Error adding task.', 'error');
    } finally {
      setIsAddingTodo(false);
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
    } catch {
      setTodos(previousTodos);
      showToast('Failed to update task.', 'error');
    }
  };

  const handleDeleteTodo = async (id) => {
    const ok = await showConfirm('Are you sure you want to delete this task?', 'Delete Task');
    if (!ok) return;

    if (!token) {
      showToast('Login required.', 'error');
      return;
    }

    setDeletingTodoId(id);
    try {
      await axiosInstance.delete(`/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
      showToast('Task deleted!', 'success');
    } catch (error) {
      console.error('Error deleting todo:', error);
      showToast('Error deleting task.', 'error');
    } finally {
      setDeletingTodoId(null);
    }
  };

  const handleStartPomodoro = (todo) => {
    setSelectedTodo(todo);
    setPomodoroTime(25 * 60);
    setIsRunning(true);
    setPomodoroMode('work');
  };

  const handleSelectTodoForPomodoro = (todoId) => {
    if (todoId) {
      const todo = todos.find(t => t.id === parseInt(todoId));
      setSelectedTodo(todo || null);
    } else {
      setSelectedTodo(null);
    }
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

  const handleLogout = async () => {
    const ok = await showConfirm('Are you sure you want to logout?', 'Logout');
    if (ok) {
      dispatch(logoutAction());
      setTodos([]);
      navigate('/');
    }
  };

  // Send time to backend when Pomodoro completes
  const handlePomodoroComplete = async () => {
    const duration = pomodoroMode === 'work' ? 25 : 5;

    if (!selectedTodo) {
      showToast(
        pomodoroMode === 'work' ? 'Pomodoro complete! Time for a break.' : 'Break over! Time to focus.',
        pomodoroMode === 'work' ? 'success' : 'info'
      );

      if (pomodoroMode === 'work') {
        setPomodoroMode('break');
        setPomodoroTime(5 * 60);
        setSessionsCompleted(s => s + 1);
      }
      return;
    }

    try {
      await axiosInstance.post(`/todos/${selectedTodo.id}/pomodoros`, {
        duration: duration
      });

      showToast(
        pomodoroMode === 'work'
          ? `Pomodoro complete! ${duration} minutes recorded.`
          : 'Break over! Time to focus.',
        pomodoroMode === 'work' ? 'success' : 'info'
      );

      if (pomodoroMode === 'work') {
        setPomodoroMode('break');
        setPomodoroTime(5 * 60);
        setTotalFocusTime(t => t + duration);
        setSessionsCompleted(s => s + 1);
      }
    } catch (error) {
      console.error('Error saving pomodoro:', error);
      showToast(
        pomodoroMode === 'work'
          ? 'Pomodoro complete! (Failed to save record)'
          : 'Break over!',
        'warning'
      );

      if (pomodoroMode === 'work') {
        setPomodoroMode('break');
        setPomodoroTime(5 * 60);
        setSessionsCompleted(s => s + 1);
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
      handlePomodoroComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, pomodoroTime, pomodoroMode]);

  // Filter todos
  const getFilteredTodos = () => {
    let filtered = [...todos];

    if (activeFilter !== 'all') {
      filtered = filtered.filter(t => t.priority === activeFilter);
    }

    // Sort by priority (CRITICAL > HIGH > MEDIUM > LOW) then by completion
    const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    return filtered.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  };

  const renderSkeletonLoader = () => (
    <div className="tasks-loading">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-moon" />
          <div className="skeleton-content">
            <div className="skeleton-title" />
            <div className="skeleton-meta" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="todo-page">
      {/* Sidebar */}
      <Sidebar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onLogout={handleLogout}
        onAddTodo={() => setShowAddModal(true)}
      />

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="content-header">
          <div className="header-title">
            <h1>Current Tasks</h1>
            <span className="task-count">{todos.filter(t => !t.completed).length} active</span>
          </div>
          <button className="mobile-add-btn" onClick={() => setShowAddModal(true)}>
            <span>+</span>
          </button>
        </header>

        {/* Tasks Grid */}
        <div className="tasks-container">
          {isLoadingTodos ? (
            renderSkeletonLoader()
          ) : getFilteredTodos().length === 0 ? (
            <div className="empty-state" onClick={() => setShowAddModal(true)}>
              <div className="empty-moon">
                <NewMoon size={64} />
              </div>
              <h3 className="empty-title">No tasks yet</h3>
              <p className="empty-text">Click to add your first task</p>
            </div>
          ) : (
            <div className="tasks-grid">
              {getFilteredTodos().map(todo => (
                <TaskCard
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                  onStartPomodoro={handleStartPomodoro}
                  isDeleting={deletingTodoId === todo.id}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Pomodoro Panel */}
      <PomodoroPanel
        time={pomodoroTime}
        isRunning={isRunning}
        mode={pomodoroMode}
        selectedTodo={selectedTodo}
        totalFocusTime={totalFocusTime}
        sessionsCompleted={sessionsCompleted}
        onToggle={handleToggleTimer}
        onReset={handleResetTimer}
        onSwitchMode={handleSwitchMode}
        onSelectTodo={handleSelectTodoForPomodoro}
        todos={todos.filter(t => !t.completed)}
      />

      {/* Add Todo Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => { setShowAddModal(false); setFormError(''); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Task</h2>
              <button className="modal-close" onClick={() => { setShowAddModal(false); setFormError(''); }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Task Title</label>
                <input
                  type="text"
                  placeholder="What needs to be done?"
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); setFormError(''); }}
                  className="form-input"
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Moon Phase (Priority)</label>
                <div className="priority-selector">
                  {priorities.map(priority => {
                    const MoonComponent = priority.component;
                    return (
                      <button
                        key={priority.id}
                        className={`priority-option ${selectedPriority === priority.id ? 'selected' : ''}`}
                        onClick={() => { setSelectedPriority(priority.id); setFormError(''); }}
                      >
                        <MoonComponent size={32} glow={selectedPriority === priority.id} />
                        <span className="priority-name">{priority.name}</span>
                        <span className="priority-desc">{priority.description}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {formError && <div className="form-error">{formError}</div>}
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => {
                setShowAddModal(false);
                setTitle('');
                setSelectedPriority(null);
                setFormError('');
              }}>
                Cancel
              </button>
              <button className="btn-confirm" onClick={handleAddTodo} disabled={isAddingTodo}>
                {isAddingTodo ? 'Adding...' : 'Add Task'}
              </button>
            </div>
          </div>
        </div>
      )}

      {ConfirmDialog}
    </div>
  );
}
