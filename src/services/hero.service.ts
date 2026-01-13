// services/hero.service.ts
import api from './api';
import type { Hero, ApiResponse } from '../types/index';

export const heroService = {
  // For admin panel - gets ALL heroes
  getAll: async (): Promise<Hero[]> => {
    const response = await api.get<Hero[]>('/hero/all');
    console.log("All heroes response:", response.data);
    return response.data;
  },

  // For public site - gets specific hero with fallback logic
  getHero: async (params?: { domainId?: number; courseId?: number }): Promise<Hero> => {
    const response = await api.get<Hero>('/hero', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Hero> => {
    const response = await api.get<Hero>(`/hero/${id}`);
    return response.data;
  },

  create: async (data: FormData): Promise<Hero> => {
    const response = await api.post<Hero>('/hero', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: number, data: FormData): Promise<Hero> => {
    const response = await api.put<Hero>(`/hero/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/hero/${id}`);
    return response.data;
  },
};