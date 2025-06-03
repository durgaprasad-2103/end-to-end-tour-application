import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Set the user in local storage
const setUser = (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
};

// Get the current user from local storage
const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Register a new user
const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/users/register`, userData);
    const { user } = response.data.data;
    
    // Save user to local storage
    setUser(user);
    
    return user;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

// Login user
const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/users/login`, { email, password });
    const { user } = response.data.data;
    
    // Save user to local storage
    setUser(user);
    
    return user;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

// Verify token and get current user
const verifyToken = async () => {
  const user = getUser();
  
  if (!user || !user.token) {
    return null;
  }
  
  try {
    const response = await axios.post(`${API_URL}/api/users/verify`, { token: user.token });
    const { user: currentUser } = response.data.data;
    
    // Update stored user data
    setUser(currentUser);
    
    return currentUser;
  } catch (error) {
    // If token is invalid, clear the user data
    setUser(null);
    return null;
  }
};

// Logout user
const logout = async () => {
  const user = getUser();
  
  if (user && user._id) {
    try {
      await axios.post(`${API_URL}/api/users/logout/${user._id}`);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
  
  // Clear user from local storage
  setUser(null);
};

// Check if user is authenticated
const isAuthenticated = () => {
  return !!getUser();
};

const authService = {
  register,
  login,
  logout,
  verifyToken,
  getUser,
  isAuthenticated
};

export default authService; 