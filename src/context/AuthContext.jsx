import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import Swal from 'sweetalert2';

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [user, setUser] = useState(null); // To store user details
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(false);

  // Simulated API call for login
  const login = async ({ role, email, password }) => {
    try {
      const response = await axiosInstance.post(`/api/${role}/login`, {
        email,
        password,
      });

      if (response.data.success === true) {
        Swal.fire({
          title: 'Success!',
          text: response.data.message,
          icon: 'success',
          confirmButtonText: 'OK',
        });
        setIsLoggedIn(true);
        setUserRole(role);
        setUser(response.data.user);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } else {
        Swal.fire({
          title: 'Error!',
          text: response.data.message || 'Login failed. Please try again.',
          icon: 'error',
          confirmButtonText: 'Close',
        });
      }
      return response; // Return the response
    } catch (error) {
      console.error("Error while logging in:", error);
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred during login. Please try again.',
        icon: 'error',
        confirmButtonText: 'Close',
      });

      // Throw the error to be caught in handleLogin
      throw error;
    }
  };

  // Logout function
  const logout = async() => {
    try {
        const response = await axiosInstance.post("/api/student/logout");
        Swal.fire({
          title: 'Logged out!',
          text: response.data.message,
          icon: 'success',
          confirmButtonText: 'OK',
        });
        setIsLoggedIn(false);
        setUser(response.data);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
    } catch (error) {
      console.error("Error while logout in:", error);
      Swal.fire({
        title: 'Error!',
        text: 'There was an issue logging out. Please try again.',
        icon: 'error',
        confirmButtonText: 'Close',
      });
    }
  };

  useEffect(() => {
    // Sync the user state from localStorage on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const checkingLogin = () => {
      const savedStatus = localStorage.getItem('isLoggedIn');
      return savedStatus === 'true'; // Initialize from localStorage
    };
    setIsLoggedIn(checkingLogin());
    setLoading(false)
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, login, user, logout, userRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
