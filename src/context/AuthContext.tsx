import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api, authStorage } from '../services/api';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  theme: 'light' | 'dark';
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  toggleTheme: () => void;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, password?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: 'USER' | 'ADMIN', email?: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dopamineflow_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Apply dark class to html document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    try {
      localStorage.setItem('dopamineflow_theme', theme);
    } catch (e) {
      // storage unavailable
    }
  }, [theme]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Initial session check
  useEffect(() => {
    async function loadSession() {
      try {
        // If user explicitly signed out, do not force auto-login
        if (authStorage.isExplicitlyLoggedOut()) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        // If no token exists on first load, initialize default Alex Rivera active session
        if (!authStorage.getToken()) {
          authStorage.setToken('tok_usr_alex_default_session');
        }

        const res = await api.getCurrentUser();
        if (res && res.user) {
          setUser(res.user);
          if (res.user.settings?.theme === 'light') {
            setTheme('light');
          } else {
            setTheme('dark');
          }
        } else {
          setUser(null);
        }
      } catch (e) {
        console.warn('Initial session fetch failed or guest state');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadSession();
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const { user } = await api.login(email, password);
      setUser(user);
      showToast(`Welcome back, ${user.name}!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Login failed', 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password?: string) => {
    setIsLoading(true);
    try {
      const { user } = await api.register(name, email, password);
      setUser(user);
      showToast(`Account created successfully! Welcome to DopamineFlow.`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Registration failed', 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const { user } = await api.loginWithGoogle();
      setUser(user);
      showToast(`Signed in as ${user.name}`, 'success');
    } catch (err: any) {
      showToast('Authentication failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      setUser(null);
      showToast('You have been signed out successfully.', 'info');
    } catch (e) {
      setUser(null);
    }
  };

  const switchRole = async (role: 'USER' | 'ADMIN', email?: string) => {
    setIsLoading(true);
    try {
      const { user } = await api.switchAccount(role, email);
      setUser(user);
      showToast(`Active profile: ${user.name} (${user.role === 'ADMIN' ? 'Lead Administrator' : 'Member'})`, 'success');
    } catch (e: any) {
      showToast('Failed to switch profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const { user: updated } = await api.updateProfile(data);
      setUser(updated);
      showToast('Profile updated successfully', 'success');
    } catch (e: any) {
      showToast('Failed to update profile', 'error');
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.getCurrentUser();
      if (res && res.user) {
        setUser(res.user);
      }
    } catch (e) {
      console.warn('Failed to refresh user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        theme,
        toasts,
        showToast,
        removeToast,
        toggleTheme,
        login,
        register,
        loginWithGoogle,
        logout,
        switchRole,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
