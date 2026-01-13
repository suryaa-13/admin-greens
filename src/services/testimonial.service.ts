// services/testimonial.service.ts
import api from './api';
import type { Testimonial, ApiResponse } from '../types/index';

export const testimonialService = {
  // For admin panel - gets ALL testimonials (including inactive)
  getAll: async (): Promise<Testimonial[]> => {
    const response = await api.get<Testimonial[]>('/testimonials/admin/all');
    console.log("Admin testimonials response:", response.data);
    return Array.isArray(response.data) ? response.data : [];
  },

  // For public site - gets only active testimonials
  getActiveTestimonials: async (params?: { domainId?: number }): Promise<Testimonial[]> => {
    const response = await api.get<Testimonial[]>('/testimonials', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Testimonial> => {
    const response = await api.get<Testimonial>(`/testimonials/${id}`);
    return response.data;
  },

  create: async (data: FormData): Promise<Testimonial> => {
    const response = await api.post<Testimonial>('/testimonials', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: number, data: FormData): Promise<Testimonial> => {
    const response = await api.put<Testimonial>(`/testimonials/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/testimonials/${id}`);
    return response.data;
  },
};