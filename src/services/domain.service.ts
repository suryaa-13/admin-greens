// services/domain.service.ts
import api from './api';
import type { Domain, ApiResponse } from '../types/index';

export const domainService = {
  // For admin panel - gets ALL domains (including inactive)
  getAll: async (): Promise<Domain[]> => {
    const response = await api.get<Domain[]>('/domain/admin/all');
    console.log("Admin domains response:", response.data);
    return Array.isArray(response.data) ? response.data : [];
  },

  // For public site - gets only active domains
  getActiveDomains: async (): Promise<Domain[]> => {
    const response = await api.get<Domain[]>('/domain');
    return response.data;
  },

  getById: async (id: number): Promise<Domain> => {
    const response = await api.get<Domain>(`/domain/${id}`);
    return response.data;
  },

  create: async (data: FormData): Promise<Domain> => {
    const response = await api.post<Domain>('/domain', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: number, data: FormData): Promise<Domain> => {
    const response = await api.put<Domain>(`/domain/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/domain/${id}`);
    return response.data;
  },
};