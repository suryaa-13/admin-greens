// services/course.service.ts
import api from './api';
import type { Course, ApiResponse } from '../types/index';

export const courseService = {
  // For admin panel - gets ALL courses (including inactive)
  getAll: async (): Promise<Course[]> => {
    const response = await api.get<Course[]>('/courses/admin/all');
    console.log("Admin courses response:", response.data);
    return Array.isArray(response.data) ? response.data : [];
  },

  // For public site - gets only active courses
  getActiveCourses: async (params?: { domainId?: number }): Promise<Course[]> => {
    const response = await api.get<Course[]>('/courses', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Course> => {
    const response = await api.get<Course>(`/courses/${id}`);
    return response.data;
  },

  create: async (data: FormData): Promise<Course> => {
    const response = await api.post<Course>('/courses', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: number, data: FormData): Promise<Course> => {
    const response = await api.put<Course>(`/courses/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/courses/${id}`);
    return response.data;
  },
};