import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authApi, type User } from '../lib/api';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  loginWithGoogle: (credential: string) => Promise<User>;
  register: (email: string, password: string, name: string) => Promise<any>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('afi_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    authApi
      .me()
      .then((data) => {
        const serverUser = data.user || data;
        setUser(serverUser);
        localStorage.setItem('afi_user', JSON.stringify(serverUser));
      })
      .catch(() => {
        localStorage.removeItem('afi_token');
        localStorage.removeItem('afi_user');
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    const { token, user } = response;
    localStorage.setItem('afi_token', token);
    localStorage.setItem('afi_user', JSON.stringify(user));
    setUser(user);
    return user; // renvoyé directement pour éviter de relire un contexte pas encore à jour
  };

  const loginWithGoogle = async (credential: string) => {
    const response = await authApi.googleLogin(credential);
    const { token, user } = response;
    localStorage.setItem('afi_token', token);
    localStorage.setItem('afi_user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const register = async (email: string, password: string, name: string) => {
    const res = await authApi.register(email, password, name);
    if (res.token && res.user) {
      localStorage.setItem('afi_token', res.token);
      localStorage.setItem('afi_user', JSON.stringify(res.user));
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('afi_token');
    localStorage.removeItem('afi_user');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const data = await authApi.me();
      const serverUser = data.user || data;
      setUser(serverUser);
      localStorage.setItem('afi_user', JSON.stringify(serverUser));
    } catch {
      // silencieux
    }
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        login, 
        loginWithGoogle,
        register, 
        logout,
        refreshUser,
      }}
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
