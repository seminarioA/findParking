import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { endpoints } from '@/lib/api';
import type { User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStoredSession = async () => {
      const storedToken = localStorage.getItem('findparking_token');
      const storedUser = localStorage.getItem('findparking_user');

      if (storedToken && storedUser) {
        try {
          // Verificar token al iniciar
          const res = await fetch(endpoints.verify(), {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          if (!res.ok) throw new Error('invalid');
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (error) {
          localStorage.removeItem('findparking_token');
          localStorage.removeItem('findparking_user');
          setToken(null);
          setUser(null);
        }
      }

      setIsLoading(false);
    };

    checkStoredSession();
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('findparking_token', newToken);
    localStorage.setItem('findparking_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('findparking_token');
    localStorage.removeItem('findparking_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
