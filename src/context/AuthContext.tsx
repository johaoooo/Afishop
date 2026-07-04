import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authApi, type User } from '../lib/api';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Au chargement de l'app : si un token existe, on redemande le profil
  useEffect(() => {
    const token = localStorage.getItem('afi_token');
    const savedUser = localStorage.getItem('afi_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { token, user } = await authApi.login(email, password);
    localStorage.setItem('afi_token', token);
    localStorage.setItem('afi_user', JSON.stringify(user));
    setUser(user);
  };

  const register = async (email: string, password: string, name: string) => {
    const { token, user } = await authApi.register(email, password, name);
    localStorage.setItem('afi_token', token);
    localStorage.setItem('afi_user', JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('afi_token');
    localStorage.removeItem('afi_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé à l\'intérieur de <AuthProvider>');
  return ctx;
}
