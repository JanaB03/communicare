import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserContextType } from '@/types/userTypes';

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock user data for demo purposes
const MOCK_USERS = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "client",
    
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "case_manager",

  }
] as User[];

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('communicare_user');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user by email (in a real app, this would be a server-side check)
      const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      // In a real app, you would verify the password here
      
      // Save user to localStorage
      localStorage.setItem('communicare_user', JSON.stringify(foundUser));
      setUser(foundUser);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem('communicare_user');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
};