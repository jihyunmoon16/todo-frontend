import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';
import { selectIsAuthenticated } from '../store/authSlice';

export function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
