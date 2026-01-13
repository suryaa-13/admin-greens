// src/services/auth.service.ts
import api from './api';
import { removeToken } from '../utils/storage';

export interface AuthResponse {
  token: string;
  admin: {
    id: number;
    email: string;
    username: string;
  };
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/admin/login', { email, password });
    return response.data;
  },

  // Logout logic
  logout: () => {
    removeToken(); // Clears the 'admin_token' from localStorage
    window.location.href = '/login'; // Force redirect to login route
  }
};