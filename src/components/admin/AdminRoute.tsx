import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../lib/api';
import { FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';

function AdminLoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success('Connexion réussie');
    } catch (error: any) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error('Email ou mot de passe incorrect');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d2818] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mx-auto mb-4">
          <FiLock className="w-5 h-5 text-[#1a6b3c]" />
        </div>
        <h1 className="text-xl font-black text-gray-800 text-center">Espace admin</h1>
        <p className="text-sm text-gray-400 text-center mt-1 mb-6">AFI Collection</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]"
              placeholder="admin@aficollection.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1a6b3c] hover:bg-[#14532d] text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="min-h-screen bg-[#0d2818] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-center">
        <FiLock className="w-8 h-8 text-red-400 mx-auto mb-3" />
        <h1 className="text-lg font-bold text-gray-800">Accès refusé</h1>
        <p className="text-sm text-gray-400 mt-1">Ce compte n'a pas les droits administrateur.</p>
      </div>
    </div>
  );
}

// /admin gère sa propre authentification, indépendamment du reste du site :
// - chargement initial -> spinner
// - non connecté -> formulaire de connexion admin dédié
// - connecté mais pas admin -> accès refusé
// - connecté en admin -> affiche le dashboard (children)
export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1a6b3c]" />
      </div>
    );
  }
  if (!isAuthenticated || !user) {
    return <AdminLoginForm />;
  }
  if (user.role?.toLowerCase() !== 'admin') {
    return <AccessDenied />;
  }
  return <>{children}</>;
}
