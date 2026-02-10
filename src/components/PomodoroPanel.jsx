import { TimerMoon } from './MoonPhase';
import './PomodoroPanel.css';

export function PomodoroPanel({
  time,
  isRunning,
  mode,
  selectedTodo,
  totalFocusTime = 0,
  sessionsCompleted = 0,
  onToggle,
  onReset,
  onSwitchMode,
  onSelectTodo,
  todos = []
}) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const total = mode === 'work' ? 25 * 60 : 5 * 60;
    return ((total - time) / total) * 100;
  };

  const formatFocusTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <aside className="pomodoro-panel">
      <h2 className="panel-title">POMODORO TIMER</h2>

      {/* Timer Display */}
      <div className="timer-container">
        {/* Decorative stars */}
        <div className="stars-container">
          <span className="star star-1">*</span>
          <span className="star star-2">*</span>
          <span className="star star-3">*</span>
          <span className="star star-4">*</span>
          <span className="star star-5">+</span>
          <span className="star star-6">+</span>
        </div>

        {/* Moon Timer */}
        <div className="moon-timer-wrapper">
          <TimerMoon size={180} progress={getProgress()} />
          <div className="timer-overlay">
            <div className="timer-time">{formatTime(time)}</div>
            <div className="timer-mode">
              {mode === 'work' ? 'Focus Time' : 'Break Time'}
            </div>
          </div>
        </div>
      </div>

      {/* Task Selector */}
      <div className="task-selector">
        <select
          value={selectedTodo?.id || ''}
          onChange={(e) => onSelectTodo?.(e.target.value)}
          className="task-select"
        >
          <option value="">No task selected</option>
          {todos.map(todo => (
            <option key={todo.id} value={todo.id}>
              {todo.title}
            </option>
          ))}
        </select>
      </div>

      {/* Mode Toggle */}
      <div className="mode-toggle">
        <button
          className={`mode-btn ${mode === 'work' ? 'active' : ''}`}
          onClick={() => mode !== 'work' && onSwitchMode?.()}
        >
          Focus
        </button>
        <button
          className={`mode-btn ${mode === 'break' ? 'active' : ''}`}
          onClick={() => mode !== 'break' && onSwitchMode?.()}
        >
          Break
        </button>
      </div>

      {/* Controls */}
      <div className="timer-controls">
        <button
          className={`control-btn primary ${isRunning ? 'pause' : 'play'}`}
          onClick={onToggle}
        >
          {isRunning ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <button className="control-btn secondary" onClick={onReset}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
      </div>

      {/* Stats */}
      <div className="timer-stats">
        <div className="stat-item">
          <span className="stat-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </span>
          <div className="stat-content">
            <span className="stat-label">Focus Time</span>
            <span className="stat-value">{formatFocusTime(totalFocusTime)}</span>
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22,4 12,14.01 9,11.01" />
            </svg>
          </span>
          <div className="stat-content">
            <span className="stat-label">Sessions</span>
            <span className="stat-value">{sessionsCompleted}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default PomodoroPanel;
