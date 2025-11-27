
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  username: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
  isAuthenticated: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const USERS_STORAGE_KEY = '@city_hopper_users';
const CURRENT_USER_KEY = '@city_hopper_current_user';
const GUEST_MODE_KEY = '@city_hopper_guest_mode';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const [currentUserData, guestMode] = await Promise.all([
        AsyncStorage.getItem(CURRENT_USER_KEY),
        AsyncStorage.getItem(GUEST_MODE_KEY),
      ]);

      if (currentUserData) {
        setUser(JSON.parse(currentUserData));
        setIsGuest(false);
      } else if (guestMode === 'true') {
        setIsGuest(true);
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateUsername = (username: string): { valid: boolean; error?: string } => {
    if (!username || username.trim().length === 0) {
      return { valid: false, error: 'Username is required' };
    }
    if (!username.includes('@')) {
      return { valid: false, error: 'Username must contain @ symbol' };
    }
    if (username.length < 3) {
      return { valid: false, error: 'Username must be at least 3 characters' };
    }
    if (username.length > 30) {
      return { valid: false, error: 'Username must be less than 30 characters' };
    }
    return { valid: true };
  };

  const validateEmail = (email: string): { valid: boolean; error?: string } => {
    if (!email || email.trim().length === 0) {
      return { valid: false, error: 'Email is required' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, error: 'Invalid email format' };
    }
    return { valid: true };
  };

  const validatePassword = (password: string): { valid: boolean; error?: string } => {
    if (!password || password.length === 0) {
      return { valid: false, error: 'Password is required' };
    }
    if (password.length < 6) {
      return { valid: false, error: 'Password must be at least 6 characters' };
    }
    return { valid: true };
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Validate inputs
      const usernameValidation = validateUsername(username);
      if (!usernameValidation.valid) {
        return { success: false, error: usernameValidation.error };
      }

      const emailValidation = validateEmail(email);
      if (!emailValidation.valid) {
        return { success: false, error: emailValidation.error };
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        return { success: false, error: passwordValidation.error };
      }

      // Get existing users
      const usersData = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const users = usersData ? JSON.parse(usersData) : {};

      // Check if username already exists
      if (users[username.toLowerCase()]) {
        return { success: false, error: 'Username already exists' };
      }

      // Check if email already exists
      const emailExists = Object.values(users).some(
        (u: any) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (emailExists) {
        return { success: false, error: 'Email already registered' };
      }

      // Create new user
      const newUser: User = {
        username,
        email,
        createdAt: new Date().toISOString(),
      };

      // Store user with hashed password (simple encoding for demo)
      users[username.toLowerCase()] = {
        ...newUser,
        password: btoa(password), // Simple encoding, not secure for production
      };

      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      await AsyncStorage.removeItem(GUEST_MODE_KEY);

      setUser(newUser);
      setIsGuest(false);

      console.log('User registered successfully:', username);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const login = async (
    username: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Validate inputs
      if (!username || username.trim().length === 0) {
        return { success: false, error: 'Username is required' };
      }
      if (!password || password.length === 0) {
        return { success: false, error: 'Password is required' };
      }

      // Get existing users
      const usersData = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      if (!usersData) {
        return { success: false, error: 'Invalid username or password' };
      }

      const users = JSON.parse(usersData);
      const userData = users[username.toLowerCase()];

      if (!userData) {
        return { success: false, error: 'Invalid username or password' };
      }

      // Verify password
      const storedPassword = atob(userData.password);
      if (storedPassword !== password) {
        return { success: false, error: 'Invalid username or password' };
      }

      // Create user object without password
      const loggedInUser: User = {
        username: userData.username,
        email: userData.email,
        createdAt: userData.createdAt,
      };

      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(loggedInUser));
      await AsyncStorage.removeItem(GUEST_MODE_KEY);

      setUser(loggedInUser);
      setIsGuest(false);

      console.log('User logged in successfully:', username);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      await AsyncStorage.removeItem(GUEST_MODE_KEY);
      setUser(null);
      setIsGuest(false);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const continueAsGuest = async () => {
    try {
      await AsyncStorage.setItem(GUEST_MODE_KEY, 'true');
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      setIsGuest(true);
      setUser(null);
      console.log('Continuing as guest');
    } catch (error) {
      console.error('Guest mode error:', error);
    }
  };

  const isAuthenticated = !!user || isGuest;

  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest,
        isLoading,
        login,
        register,
        logout,
        continueAsGuest,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
