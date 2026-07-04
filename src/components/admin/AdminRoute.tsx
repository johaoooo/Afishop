import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  console.log('🔍 AdminRoute - user:', user);
  console.log('🔍 AdminRoute - isAuthenticated:', isAuthenticated);
  console.log('🔍 AdminRoute - isLoading:', isLoading);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a6b3c]"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    console.log('🔴 Non authentifié, redirection vers /connexion');
    return <Navigate to="/connexion" replace />;
  }

  // Vérifier le rôle (insensible à la casse)
  const userRole = user.role?.toLowerCase();
  console.log('🔍 Rôle utilisateur:', userRole);

  if (userRole !== 'admin') {
    console.log('🔴 Pas admin, redirection vers /');
    return <Navigate to="/" replace />;
  }

  console.log('✅ Admin authentifié, affichage du dashboard');
  return <>{children}</>;
}
