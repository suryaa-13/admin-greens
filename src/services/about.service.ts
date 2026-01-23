// services/about.service.ts
import api from './api';
import type { About, ApiResponse } from '../types/index';

export const aboutService = {
  getAll: async (): Promise<About[]> => {
    const response = await api.get<About[]>('/about/all');
    console.log("About service response:", response.data);
    return Array.isArray(response.data) ? response.data : [];
  },



  create: async (data: FormData): Promise<About> => {
    const response = await api.post<About>('/about', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: number, data: FormData): Promise<About> => {
    const response = await api.put<About>(`/about/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/about/${id}`);
    return response.data;
  },
};