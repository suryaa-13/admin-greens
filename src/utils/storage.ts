// src/utils/storage.ts
import { jwtDecode } from 'jwt-decode';
import type { Admin } from '../types/index';

const TOKEN_KEY = 'admin_token';

interface DecodedToken {
  id: number;
  email: string;
  exp: number;
  iat: number;
  username?: string;
}

/** * ENVIRONMENT CONFIGURATION
 * Note: Use VITE_ prefix for variables to be accessible in the browser 
 */
export const BASE_URL = import.meta.env.VITE_API_URL;
export const IMAGE_URL = import.meta.env.VITE_IMAGE_URL ;

/** * TOKEN MANAGEMENT
 */
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

/** * AUTH UTILITIES
 */
export const getAdminFromToken = (token: string): Admin | null => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    
    // Check if token is expired before returning admin
    if (Date.now() >= decoded.exp * 1000) {
      removeToken();
      return null;
    }

    return {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username || 'Admin',
      password: '', 
    };
  } catch (error) {
    removeToken();
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    // Add a 10-second buffer to prevent edge-case race conditions
    return Date.now() >= (decoded.exp * 1000) - 10000;
  } catch {
    return true;
  }
};