import { useState, useCallback, useEffect, useRef } from 'react';
import './ConfirmDialog.css';

export function useConfirmDialog() {
  const [state, setState] = useState(null);
  const resolveRef = useRef(null);

  const showConfirm = useCallback((message, title = 'Confirm') => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setState({ message, title });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    resolveRef.current?.(true);
    resolveRef.current = null;
    setState(null);
  }, []);

  const handleCancel = useCallback(() => {
    resolveRef.current?.(false);
    resolveRef.current = null;
    setState(null);
  }, []);

  useEffect(() => {
    if (!state) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleCancel();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state, handleCancel]);

  const ConfirmDialog = state ? (
    <div className="confirm-overlay" onClick={handleCancel}>
      <div className="confirm-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="confirm-title">{state.title}</h3>
        <p className="confirm-message">{state.message}</p>
        <div className="confirm-actions">
          <button className="confirm-cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button className="confirm-ok-btn" onClick={handleConfirm} autoFocus>
            Confirm
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return { showConfirm, ConfirmDialog };
}
