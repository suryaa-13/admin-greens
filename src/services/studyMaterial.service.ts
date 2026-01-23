// services/studyMaterial.service.ts
import api from './api';
import type { StudyMaterial, ApiResponse } from '../types/index';

export const studyMaterialService = {
  // For admin panel - gets ALL study materials (including inactive)
  getAll: async (): Promise<StudyMaterial[]> => {
    const response = await api.get<StudyMaterial[]>('/materials/admin/all');
    console.log("Admin study materials response:", response.data);
    return Array.isArray(response.data) ? response.data : [];
  },

  // For public site - gets only active study materials
  getActiveMaterials: async (params?: { domainId?: number; courseId?: number }): Promise<StudyMaterial[]> => {
    const response = await api.get<StudyMaterial[]>('/materials', { params });
    return response.data;
  },

  getById: async (id: number): Promise<StudyMaterial> => {
    const response = await api.get<StudyMaterial>(`/materials/${id}`);
    return response.data;
  },

  create: async (data: FormData): Promise<StudyMaterial> => {
    const response = await api.post<StudyMaterial>('/materials', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Note: Update endpoint might not exist in your backend
update: async (id: number, data: FormData): Promise<StudyMaterial> => {
  // Ensure this URL matches your backend: router.put("/:id", ...) 
  // If the base route is /materials, use /materials/${id}
  const response = await api.put<StudyMaterial>(`/materials/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
},
  delete: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/materials/${id}`);
    return response.data;
  },
};