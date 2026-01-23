import api from './api';
import type { EnrollCard ,EnrollCardAdminResponse} from '../types/index';

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  count?: number;
}

export const enrollCardService = {
  // For frontend (with fallback logic)
  getAll: async (domainId?: number, courseId?: number): Promise<EnrollCard[]> => {
    try {
      const params = new URLSearchParams();
      if (domainId !== undefined) params.append('domainId', domainId.toString());
      if (courseId !== undefined) params.append('courseId', courseId.toString());
      
      const queryString = params.toString();
      const url = `/enroll-cards${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get<EnrollCard[]>(url);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching enroll cards:', error);
      return [];
    }
  },

  // For admin (get all cards)
getAllForAdmin: async (): Promise<EnrollCardAdminResponse> => {
    const response = await api.get('/enroll-cards/admin/all');
    return response.data;
  },

  // Create new card
  create: async (data: FormData): Promise<ApiResponse> => {
    try {
      const response = await api.post<ApiResponse>('/enroll-cards', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error creating enroll card:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error creating enroll card'
      };
    }
  },

  // Update existing card
  update: async (id: number, data: FormData): Promise<ApiResponse> => {
    try {
      const response = await api.put<ApiResponse>(`/enroll-cards/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error updating enroll card:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error updating enroll card'
      };
    }
  },

  // Soft delete
  delete: async (id: number): Promise<ApiResponse> => {
    try {
      const response = await api.delete<ApiResponse>(`/enroll-cards/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting enroll card:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error deleting enroll card'
      };
    }
  },

  // Hard delete
  hardDelete: async (id: number): Promise<ApiResponse> => {
    try {
      const response = await api.delete<ApiResponse>(`/enroll-cards/${id}/hard`);
      return response.data;
    } catch (error: any) {
      console.error('Error hard deleting enroll card:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error deleting enroll card'
      };
    }
  },

  // Restore
  restore: async (id: number): Promise<ApiResponse> => {
    try {
      const response = await api.put<ApiResponse>(`/enroll-cards/${id}/restore`);
      return response.data;
    } catch (error: any) {
      console.error('Error restoring enroll card:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error restoring enroll card'
      };
    }
  }
};