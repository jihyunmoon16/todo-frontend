import { useState } from 'react';
import { MoonPhaseIcon, PRIORITY_LABELS } from './MoonPhase';
import './TaskCard.css';

export function TaskCard({
  todo,
  onToggle,
  onDelete,
  onStartPomodoro,
  isDeleting = false
}) {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleToggle = () => {
    if (!todo.completed) {
      setIsCompleting(true);
      setTimeout(() => {
        setIsCompleting(false);
        onToggle?.(todo.id);
      }, 500);
    } else {
      onToggle?.(todo.id);
    }
  };

  return (
    <div className={`task-card ${todo.completed ? 'completed' : ''} ${isDeleting ? 'deleting' : ''}`}>
      {/* Moon Phase Icon */}
      <div className={`task-moon ${isCompleting ? 'completing' : ''}`}>
        <MoonPhaseIcon priority={todo.priority} size={28} glow={!todo.completed} />
      </div>

      {/* Content */}
      <div className="task-content">
        <div className="task-header">
          <span className={`task-title ${todo.completed ? 'completed' : ''}`}>
            {todo.title}
          </span>
        </div>
        <div className="task-meta">
          <span className="task-priority">{PRIORITY_LABELS[todo.priority] || 'New Moon'}</span>
          {todo.pomodoroTime > 0 && (
            <span className="task-time">{todo.pomodoroTime}m</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="task-actions">
        {/* Checkbox */}
        <button
          className={`task-checkbox ${todo.completed ? 'checked' : ''}`}
          onClick={handleToggle}
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {todo.completed && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20,6 9,17 4,12" />
            </svg>
          )}
        </button>

        {/* Start Timer */}
        <button
          className="task-timer-btn"
          onClick={() => onStartPomodoro?.(todo)}
          title="Start Pomodoro"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>

        {/* Delete */}
        <button
          className="task-delete-btn"
          onClick={() => onDelete?.(todo.id)}
          disabled={isDeleting}
          title="Delete"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
