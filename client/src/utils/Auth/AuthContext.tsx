import { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
    _id: string;
    username: string;
    display_name: string;
    picture: string;
    googleId: string | null
}

export interface AuthContextValue {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    checkAuthStatus: () => Promise<void>;
  }

  export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
  }

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check session status on mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/profile/me',{ withCredentials: true });
        setUser(response.data.user);
      } catch (error) {
        return
      }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};