import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectToken, logout as logoutAction } from '../store/authSlice';
import axiosInstance from '../api/axios';
import './TodoPage.css';

export function TodoPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector(selectToken); // Redux에서 토큰 가져오기
  
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [selectedQuadrant, setSelectedQuadrant] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPomodoroModal, setShowPomodoroModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroMode, setPomodoroMode] = useState('work');

  // 4분면 정의
  const quadrants = [
    { id: 1, name: '긴급하고 중요함', color: '#ef4444', emoji: '🔥', priority: 'CRITICAL' },
    { id: 2, name: '긴급하지 않지만 중요함', color: '#3b82f6', emoji: '⭐', priority: 'HIGH' },
    { id: 3, name: '긴급하지만 중요하지 않음', color: '#f59e0b', emoji: '⚡', priority: 'MEDIUM' },
    { id: 4, name: '긴급하지도 중요하지도 않음', color: '#6b7280', emoji: '📝', priority: 'LOW' }
  ];

  // Priority를 quadrant로 변환
  const priorityToQuadrant = (priority) => {
    switch(priority) {
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

  // 토큰이 있으면 할 일 목록 가져오기
  useEffect(() => {
    if (token) {
      fetchTodos();
    }
  }, [token]);

  // 할 일 목록 가져오기
  const fetchTodos = async () => {
    try {
      // 인터셉터가 자동으로 토큰 추가
      const response = await axiosInstance.get('/todos');

      const data = response.data;
      
      // 백엔드 데이터를 프론트엔드 형식으로 변환
      const formattedTodos = data.map(todo => ({
        id: todo.id,
        title: todo.title,
        description: todo.description,
        priority: todo.priority,
        completed: todo.completed,
        quadrant: priorityToQuadrant(todo.priority)
      }));

      setTodos(formattedTodos);
    } catch (error) {
      console.error('Error fetching todos:', error);
      alert('할 일 목록을 불러오는 중 오류가 발생했습니다.');
    }
  };

  const handleAddTodo = async () => {
    if (!title.trim()) {
      alert('할 일 제목을 입력해주세요.');
      return;
    }
    if (!selectedQuadrant) {
      alert('중요도를 선택해주세요.');
      return;
    }
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const selectedQuadrantInfo = quadrants.find(q => q.id === selectedQuadrant);
      
      // 인터셉터가 자동으로 토큰과 헤더 추가
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
        quadrant: priorityToQuadrant(newTodo.priority)
      };
      
      setTodos([...todos, formattedTodo]);
      setTitle('');
      setSelectedQuadrant(null);
      setShowAddModal(false);
      alert('할 일이 추가되었습니다! ✅');
    } catch (error) {
      console.error('Error adding todo:', error);
      alert('할 일 추가 중 오류가 발생했습니다.');
    }
  };

  const handleToggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleDeleteTodo = async (id) => {
    if (!window.confirm('이 할 일을 삭제하시겠습니까?')) {
      return;
    }

    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      // 인터셉터가 자동으로 토큰 추가
      await axiosInstance.delete(`/todos/${id}`);

      // 성공 시 로컬 state에서도 제거
      setTodos(todos.filter(todo => todo.id !== id));
      alert('할 일이 삭제되었습니다! 🗑️');
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('할 일 삭제 중 오류가 발생했습니다.');
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
    if (window.confirm('로그아웃 하시겠습니까?')) {
      // Redux에서 토큰 제거
      dispatch(logoutAction());
      
      // 상태 초기화
      setTodos([]);
      
      // 로그인 페이지로 이동
      navigate('/');
    }
  };

  useEffect(() => {
    let interval = null;
    if (isRunning && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime((time) => {
          if (time <= 1) {
            setIsRunning(false);
            alert(pomodoroMode === 'work' ? '🎉 뽀모도로 완료! 휴식 시간입니다.' : '✨ 휴식 완료! 다시 집중할 시간입니다.');
            return 0;
          }
          return time - 1;
        });
      }, 1000);
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
      {/* 헤더 */}
      <div className="todo-header">
        <h1>📋 할 일 관리</h1>
        <div className="header-actions">
          <button className="add-todo-btn" onClick={() => setShowAddModal(true)}>
            ➕ 할 일 추가
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 로그아웃
          </button>
        </div>
      </div>

      {/* 뽀모도로 섹션 */}
      <div className="center-pomodoro-section">
        <div className="center-pomodoro-card">
          <div className="center-pomodoro-icon">🌙</div>
          <h2 className="center-pomodoro-title">뽀모도로 시작하기</h2>
          <p className="center-pomodoro-description">
            집중할 할 일을 선택하고 타이머를 시작하세요
          </p>
          
          <div className="center-pomodoro-selector">
            <select id="todo-select" className="todo-select" defaultValue="">
              <option value="">할 일을 선택하지 않음 (Untitled)</option>
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
              ▶ 타이머 시작
            </button>
          </div>
        </div>
      </div>

      {/* 할 일 리스트 */}
      <div className="todo-list-container">
        <div className="todo-list">
          {todos.length === 0 ? (
            <div className="empty-state" onClick={() => setShowAddModal(true)} style={{ cursor: 'pointer' }}>
              <p className="empty-icon">📝</p>
              <p className="empty-text">등록된 할 일이 없습니다</p>
              <p className="empty-subtext">여기를 클릭해서 새로운 할 일을 추가해보세요</p>
            </div>
          ) : (
            <>
              <div className="list-header-clickable" onClick={() => setShowAddModal(true)}>
                <p className="list-hint">💡 여기를 클릭하면 할 일을 추가할 수 있어요</p>
              </div>
              {getSortedTodos().map(todo => {
                const quadrantInfo = getQuadrantInfo(todo.quadrant);
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
                        </div>
                      </div>
                    </div>
                    <div className="todo-actions">
                      <button
                        className="pomodoro-btn"
                        onClick={() => handleStartPomodoro(todo)}
                        title="뽀모도로 시작"
                      >
                        🌙
                      </button>
                      <button
                        className="delete-btn-list"
                        onClick={() => handleDeleteTodo(todo.id)}
                        title="삭제"
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

      {/* 할 일 추가 모달 */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>새 할 일 추가</h2>
            
            <div className="form-group">
              <label>할 일 제목</label>
              <input
                type="text"
                placeholder="예: 프로젝트 기획서 작성"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="todo-input"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>중요도 선택</label>
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
                취소
              </button>
              <button className="confirm-btn" onClick={handleAddTodo}>
                추가
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 뽀모도로 타이머 모달 */}
      {showPomodoroModal && selectedTodo && (
        <div className="modal-overlay" onClick={handleClosePomodoro}>
          <div className="pomodoro-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={handleClosePomodoro}>
              ✕
            </button>

            <div className="pomodoro-header">
              <h2>🍅 뽀모도로 타이머</h2>
              <p className="pomodoro-todo-title">{selectedTodo.title}</p>
            </div>

            <div className="pomodoro-mode-toggle">
              <button
                className={`mode-btn ${pomodoroMode === 'work' ? 'active' : ''}`}
                onClick={() => pomodoroMode !== 'work' && handleSwitchMode()}
              >
                집중 (25분)
              </button>
              <button
                className={`mode-btn ${pomodoroMode === 'break' ? 'active' : ''}`}
                onClick={() => pomodoroMode !== 'break' && handleSwitchMode()}
              >
                휴식 (5분)
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
                  {pomodoroMode === 'work' ? '집중 시간' : '휴식 시간'}
                </div>
              </div>
            </div>

            <div className="timer-controls">
              <button
                className={`control-btn ${isRunning ? 'pause' : 'start'}`}
                onClick={handleToggleTimer}
              >
                {isRunning ? '⏸ 일시정지' : '▶ 시작'}
              </button>
              <button className="control-btn reset" onClick={handleResetTimer}>
                🔄 초기화
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}