import api from './api';
import type { 
  EnrollmentRequest, 
  StatsResponse, 
  ApiResponse, 
  EnrollmentFilters 
} from '../types/index';

export const enrollmentRequestService = {
  /**
   * Submit a new enrollment with form data (includes image upload)
   */
  createRequest: async (data: FormData): Promise<ApiResponse<EnrollmentRequest>> => {
    try {
      const response = await api.post<ApiResponse<EnrollmentRequest>>('/enrollments/request', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error creating enrollment request:', error);
      return {
        success: false,
        data: {} as EnrollmentRequest,
        message: error.response?.data?.message || 'Error submitting enrollment request'
      };
    }
  },

  /**
   * Fetch all requests with optional filtering
   */
  getAllRequests: async (params?: EnrollmentFilters): Promise<{ data: EnrollmentRequest[]; count: number }> => {
    try {
      // Axios automatically converts the params object into a query string
      const response = await api.get<ApiResponse<EnrollmentRequest[]>>('/enrollments', { params });
      
      if (response.data.success) {
        return {
          data: Array.isArray(response.data.data) ? response.data.data : [],
          count: response.data.count || 0
        };
      }
      return { data: [], count: 0 };
    } catch (error) {
      console.error('Error fetching enrollment requests:', error);
      return { data: [], count: 0 };
    }
  },

  /**
   * Update the status of an enrollment (e.g., Approve/Reject)
   */
  updateRequest: async (id: number, data: { status: string }): Promise<ApiResponse<EnrollmentRequest>> => {
    try {
      const response = await api.put<ApiResponse<EnrollmentRequest>>(`/enrollments/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating enrollment request:', error);
      return {
        success: false,
        data: {} as EnrollmentRequest,
        message: error.response?.data?.message || 'Error updating enrollment request'
      };
    }
  },

  /**
   * Hard delete an enrollment record
   */
  deleteRequest: async (id: number): Promise<ApiResponse<null>> => {
    try {
      const response = await api.delete<ApiResponse<null>>(`/enrollments/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting enrollment request:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error deleting enrollment request'
      };
    }
  },

  /**
   * Fetch dashboard statistics
   */
 getStats: async (): Promise<StatsResponse> => {
    // Define a default "empty" state for stats
    const defaultStats: StatsResponse = { 
      total: 0, 
      pending: 0, 
      approved: 0, 
      rejected: 0, 
      byDomain: {}, 
      byCourse: {} 
    };

    try {
      const response = await api.get<ApiResponse<StatsResponse>>('/enrollments/stats');
      
      // Check if success is true AND data exists
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      return defaultStats;
    } catch (error) {
      console.error('Error fetching enrollment stats:', error);
      return defaultStats; // Always return the object, never undefined
    }
  }
};