// services/careerImpact.service.ts
import api from './api';
import type { CareerImpact, ApiResponse } from '../types/index';

export const careerImpactService = {
  // For admin panel - gets ALL career impacts (including inactive)
  getAll: async (): Promise<CareerImpact[]> => {
    const response = await api.get<CareerImpact[]>('/career-impact/admin/all');
    console.log("Admin career impacts response:", response.data);
    return Array.isArray(response.data) ? response.data : [];
  },

  // For public site - gets active career impact for domain/course
  getCareerImpact: async (params?: { domainId?: number; courseId?: number }): Promise<CareerImpact> => {
    const response = await api.get<CareerImpact>('/career-impact', { params });
    return response.data;
  },

  getById: async (id: number): Promise<CareerImpact> => {
    const response = await api.get<CareerImpact>(`/career-impact/${id}`);
    return response.data;
  },

  create: async (data: CareerImpact): Promise<CareerImpact> => {
    const response = await api.post<CareerImpact>('/career-impact', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CareerImpact>): Promise<CareerImpact> => {
    const response = await api.put<CareerImpact>(`/career-impact/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/career-impact/${id}`);
    return response.data;
  },
};