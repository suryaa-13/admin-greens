import api from './api';
import type { TrainerAbout, ApiResponse } from '../types/index';

export const trainerAboutService = {
  // For admin panel - gets ALL trainer about sections (including inactive)
  getAll: async (): Promise<TrainerAbout[]> => {
    try {
      const response = await api.get<TrainerAbout[]>('/trainer-about/admin/all');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error fetching all trainer about sections:", error);
      return [];
    }
  },

  // For public site - gets active trainer about for domain/course
  getTrainerAbout: async (params?: { domainId?: number; courseId?: number }): Promise<TrainerAbout> => {
    const response = await api.get<TrainerAbout>('/trainer-about', { params });
    return response.data;
  },

  getById: async (id: number): Promise<TrainerAbout> => {
    const response = await api.get<TrainerAbout>(`/trainer-about/${id}`);
    return response.data;
  },

  create: async (formData: FormData): Promise<TrainerAbout> => {
    const response = await api.post<TrainerAbout>('/trainer-about', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: number, formData: FormData): Promise<TrainerAbout> => {
    const response = await api.put<TrainerAbout>(`/trainer-about/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/trainer-about/${id}`);
    return response.data;
  },
};