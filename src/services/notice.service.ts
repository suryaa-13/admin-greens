import api from './api';
import type { Notice, ApiResponse } from '../types/index';

export const noticeService = {
  // For admin panel - gets ALL notices (including inactive)
  getAll: async (): Promise<Notice[]> => {
    try {
      const response = await api.get<Notice[]>('/notices/admin');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error fetching all notices:", error);
      return [];
    }
  },

  // For public marquee - gets only active notices
  getActive: async (): Promise<string[]> => {
    try {
      const response = await api.get<string[]>('/notices');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error fetching active notices:", error);
      return [];
    }
  },

  // Create a new notice
  create: async (data: { content: string; isActive?: boolean }): Promise<Notice> => {
    const response = await api.post<Notice>('/notices', data);
    return response.data;
  },

  // Update an existing notice
  update: async (id: number, data: Partial<Notice>): Promise<Notice> => {
    const response = await api.put<Notice>(`/notices/${id}`, data);
    return response.data;
  },

  // Delete a notice
  delete: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/notices/${id}`);
    return response.data;
  },

  // Toggle notice status
  toggleStatus: async (id: number, currentStatus: boolean): Promise<Notice> => {
    const response = await api.put<Notice>(`/notices/${id}`, { isActive: !currentStatus });
    return response.data;
  },
};