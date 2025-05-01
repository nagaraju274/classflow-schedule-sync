
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { toast } from "sonner";

export type UserRole = 'student' | 'teacher' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Sample users for demo
const SAMPLE_USERS = [
  {
    id: '1',
    name: 'John Doe',
    email: 'student@example.com',
    password: 'password',
    role: 'student' as UserRole,
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'teacher@example.com',
    password: 'password',
    role: 'teacher' as UserRole,
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password',
    role: 'admin' as UserRole,
    avatar: 'https://i.pravatar.cc/150?img=3'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const isAuthenticated = user !== null;

  const login = async (email: string, password: string): Promise<void> => {
    try {
      // Simulate API call
      const foundUser = SAMPLE_USERS.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      // Remove password from user object before saving
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      toast.success(`Welcome back, ${foundUser.name}!`);
    } catch (error) {
      toast.error('Login failed: ' + (error as Error).message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.info('You have been logged out');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
