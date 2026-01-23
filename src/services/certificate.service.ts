// services/certificate.service.ts
import api from './api';
import type { Certificate, ApiResponse } from '../types/index';

export const certificateService = {
  // For admin panel - gets ALL certificates (including inactive)
  getAll: async (): Promise<Certificate[]> => {
    const response = await api.get<Certificate[]>('/certificate/admin/all');
    console.log("Admin certificates response:", response.data);
    return Array.isArray(response.data) ? response.data : [];
  },

  // For public site - gets only active certificate (one per domain/course)
  getCertificate: async (params?: { domainId?: number; courseId?: number }): Promise<Certificate> => {
    const response = await api.get<Certificate>('/certificate', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Certificate> => {
    const response = await api.get<Certificate>(`/certificate/${id}`);
    return response.data;
  },

  create: async (data: FormData): Promise<Certificate> => {
    const response = await api.post<Certificate>('/certificate', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: number, data: FormData): Promise<Certificate> => {
    const response = await api.put<Certificate>(`/certificate/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/certificate/${id}`);
    return response.data;
  },
};