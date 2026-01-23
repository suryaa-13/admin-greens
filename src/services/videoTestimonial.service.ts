// services/videoTestimonial.service.ts
import api from './api';
import type { VideoTestimonial, ApiResponse } from '../types/index';

export const videoTestimonialService = {
  // For admin panel - gets ALL video testimonials (including inactive)
  getAll: async (): Promise<VideoTestimonial[]> => {
    const response = await api.get<VideoTestimonial[]>('/videos/admin/all');
    console.log("Admin video testimonials response:", response.data);
    return Array.isArray(response.data) ? response.data : [];
  },

  // For public site - gets only active video testimonials
  getActiveVideoTestimonials: async (params?: { domainId?: number; courseId?: number }): Promise<VideoTestimonial[]> => {
    const response = await api.get<VideoTestimonial[]>('/videos', { params });
    return response.data;
  },

  getById: async (id: number): Promise<VideoTestimonial> => {
    const response = await api.get<VideoTestimonial>(`/videos/${id}`);
    return response.data;
  },

  create: async (data: FormData): Promise<VideoTestimonial> => {
    const response = await api.post<VideoTestimonial>('/videos', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: number, data: FormData): Promise<VideoTestimonial> => {
    const response = await api.put<VideoTestimonial>(`/videos/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/videos/${id}`);
    return response.data;
  },
};