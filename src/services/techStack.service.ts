// services/techStack.service.ts
import api from './api';
import type { TechStack, ApiResponse } from '../types/index';

export const techStackService = {
  // For admin panel - gets ALL tech stack items (including inactive)
  getAll: async (): Promise<TechStack[]> => {
    const response = await api.get<TechStack[]>('/tech-stack/admin/all');
    console.log("Admin tech stack response:", response.data);
    return Array.isArray(response.data) ? response.data : [];
  },

  // For public site - gets only active tech stack items
  getActiveTechStack: async (params?: { domainId?: number; courseId?: number }): Promise<TechStack[]> => {
    const response = await api.get<TechStack[]>('/tech-stack', { params });
    return response.data;
  },

  getById: async (id: number): Promise<TechStack> => {
    const response = await api.get<TechStack>(`/tech-stack/${id}`);
    return response.data;
  },

  create: async (data: FormData): Promise<TechStack> => {
    const response = await api.post<TechStack>('/tech-stack', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: number, data: FormData): Promise<TechStack> => {
    const response = await api.put<TechStack>(`/tech-stack/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/tech-stack/${id}`);
    return response.data;
  },
};