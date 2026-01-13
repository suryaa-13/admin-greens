import api from './api';
import type { StudentSuccess, ApiResponse } from '../types/index';

export const studentSuccessService = {
  // For admin panel - gets ALL student success stories (including inactive)
  getAll: async (): Promise<StudentSuccess[]> => {
    try {
      const response = await api.get<StudentSuccess[]>('/student-success/admin/all');
      console.log("Admin student success response:", response.data);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error fetching all student success stories:", error);
      return [];
    }
  },

  // For public site - gets active student success for domain/course
  getStudentSuccess: async (params?: { domainId?: number; courseId?: number }): Promise<StudentSuccess[]> => {
    const response = await api.get<StudentSuccess[]>('/student-success', { params });
    return response.data;
  },

  getById: async (id: number): Promise<StudentSuccess> => {
    const response = await api.get<StudentSuccess>(`/student-success/${id}`);
    return response.data;
  },

  create: async (formData: FormData): Promise<StudentSuccess> => {
    const response = await api.post<StudentSuccess>('/student-success', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: number, formData: FormData): Promise<StudentSuccess> => {
    const response = await api.put<StudentSuccess>(`/student-success/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/student-success/${id}`);
    return response.data;
  },

  updateSortOrder: async (updates: Array<{ id: number; sortOrder: number }>): Promise<ApiResponse> => {
    const response = await api.put<ApiResponse>('/student-success/sort/update', { updates });
    return response.data;
  },
};