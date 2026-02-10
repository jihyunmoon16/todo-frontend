import { FullMoon, WaxingGibbous, Crescent, NewMoon } from './MoonPhase';
import './Sidebar.css';

export function Sidebar({
  activeFilter = 'all',
  onFilterChange,
  onLogout,
  onAddTodo
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '{}' },
    { id: 'tasks', label: 'Tasks', icon: '{}' },
    { id: 'timer', label: 'Timer', icon: '{}' },
    { id: 'analytics', label: 'Analytics', icon: '{}' },
    { id: 'settings', label: 'Settings', icon: '{}' },
  ];

  const moonFilters = [
    { priority: 'all', label: 'All', component: null },
    { priority: 'CRITICAL', label: 'Critical', component: FullMoon },
    { priority: 'HIGH', label: 'High', component: WaxingGibbous },
    { priority: 'MEDIUM', label: 'Medium', component: Crescent },
    { priority: 'LOW', label: 'Low', component: NewMoon },
  ];

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <span className="logo-text">PHASE</span>
        <span className="logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#FFBF00" />
            <circle cx="8" cy="9" r="2" fill="rgba(230, 172, 0, 0.3)" />
            <circle cx="14" cy="14" r="1.5" fill="rgba(230, 172, 0, 0.25)" />
          </svg>
        </span>
        <span className="logo-text">THE DAY</span>
      </div>

      {/* Add Todo Button */}
      <button className="sidebar-add-btn" onClick={onAddTodo}>
        <span className="add-icon">+</span>
        <span>Add Task</span>
      </button>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${item.id === 'tasks' ? 'active' : ''}`}
            disabled={item.id !== 'tasks'}
          >
            <span className="nav-icon">
              {item.id === 'dashboard' && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              )}
              {item.id === 'tasks' && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              )}
              {item.id === 'timer' && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              )}
              {item.id === 'analytics' && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 20V10" />
                  <path d="M12 20V4" />
                  <path d="M6 20v-6" />
                </svg>
              )}
              {item.id === 'settings' && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              )}
            </span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Moon Phase Filters */}
      <div className="sidebar-section">
        <h3 className="section-title">MOON PHASES</h3>
        <div className="moon-filters">
          {moonFilters.map(filter => (
            <button
              key={filter.priority}
              className={`moon-filter-btn ${activeFilter === filter.priority ? 'active' : ''}`}
              onClick={() => onFilterChange?.(filter.priority)}
              title={filter.label}
            >
              {filter.component ? (
                <filter.component size={20} glow={activeFilter === filter.priority} />
              ) : (
                <span className="all-icon">All</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16,17 21,12 16,7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
