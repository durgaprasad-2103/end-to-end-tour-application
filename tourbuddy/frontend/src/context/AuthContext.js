import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

// Create auth context
const AuthContext = createContext();

// Context provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for saved user on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verify the token and get current user data
        const currentUser = await authService.verifyToken();
        setUser(currentUser);
      } catch (err) {
        console.error('Auth verification error:', err);
        setError('Authentication failed');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Handle user login
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const loggedInUser = await authService.login(email, password);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Handle user registration
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const newUser = await authService.register(userData);
      setUser(newUser);
      return newUser;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Handle user logout
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };
  
  // Update user details in state and localStorage
  const updateUserDetails = (updatedUser) => {
    if (!updatedUser) return;
    
    setUser(updatedUser);
    authService.setUser(updatedUser);
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUserDetails,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 