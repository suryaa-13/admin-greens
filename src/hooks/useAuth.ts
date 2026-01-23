// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import type { Admin } from '../types/index';
import { getToken, setToken, removeToken, getAdminFromToken } from '../utils/storage';

export const useAuth = () => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth State
  useEffect(() => {
  const initAuth = () => {
  const token = getToken();
  if (token) {
    try {
      const tokenData = getAdminFromToken(token);

      // Add this check to satisfy TypeScript
      if (tokenData) {
        setAdmin({
          id: tokenData.id,
          email: tokenData.email,
          username: tokenData.username || 'Admin',
          password: '', 
        });
      } else {
        // If tokenData is null, clean up
        removeToken();
        setAdmin(null);
      }
    } catch (error) {
      removeToken();
      setAdmin(null);
    }
  }
  setLoading(false);
};

    initAuth();
  }, []);

 const login = (token: string) => {
  setToken(token);
  const tokenData = getAdminFromToken(token);

  // Guard clause to ensure tokenData exists before setting admin state
  if (tokenData) {
    setAdmin({
      id: tokenData.id,
      email: tokenData.email,
      username: tokenData.username || 'Admin',
      password: '',
    });
  } else {
    // If the token provided is somehow invalid immediately after being set
    removeToken();
    setAdmin(null);
  }
};

  const logout = () => {
    removeToken();
    setAdmin(null);
    // Use window.location for a hard reset to clear all states
    window.location.href = '/login';
  };

  return { 
    admin, 
    loading, 
    login, 
    logout, 
    isAuthenticated: !!admin 
  };
};