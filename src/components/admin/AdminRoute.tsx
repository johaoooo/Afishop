import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/connexion" replace />;
  }
  if (user?.role !== 'ADMIN' && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
