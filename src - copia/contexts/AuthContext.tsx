import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser, getCurrentAdmin, logoutUser, isAuthenticated } from '../utils-components/authUtils';

interface AuthContextType {
  currentAdmin: AdminUser | null;
  login: (admin: AdminUser) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on app start
    const admin = getCurrentAdmin();
    setCurrentAdmin(admin);
    setLoading(false);
  }, []);

  const login = (admin: AdminUser) => {
    setCurrentAdmin(admin);
  };

  const logout = async () => {
    try {
      await logoutUser();
      setCurrentAdmin(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const value: AuthContextType = {
    currentAdmin,
    login,
    logout,
    isAuthenticated: isAuthenticated(),
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
