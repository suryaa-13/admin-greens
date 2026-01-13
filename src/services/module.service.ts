import api from './api';
import type { Module, ModuleTopic, ApiResponse } from '../types/index';

export const moduleService = {
  // For admin panel - gets ALL modules (including inactive)
  getAll: async (): Promise<Module[]> => {
    try {
      const response = await api.get<Module[]>('/modules/admin/all');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error fetching all modules:", error);
      return [];
    }
  },

  // For public site - gets active modules for domain/course
  getModules: async (params?: { domainId?: number; courseId?: number }): Promise<Module[]> => {
    const response = await api.get<Module[]>('/modules', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Module> => {
    const response = await api.get<Module>(`/modules/${id}`);
    return response.data;
  },

  // Module CRUD
  create: async (data: Partial<Module>): Promise<Module> => {
    const response = await api.post<Module>('/modules', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Module>): Promise<Module> => {
    const response = await api.put<Module>(`/modules/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/modules/${id}`);
    return response.data;
  },

  // Topic Management
  getAllTopics: async (): Promise<ModuleTopic[]> => {
    try {
      const response = await api.get<ModuleTopic[]>('/modules/admin/topics');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error fetching all topics:", error);
      return [];
    }
  },

  addTopic: async (data: Partial<ModuleTopic>): Promise<ModuleTopic> => {
    const response = await api.post<ModuleTopic>('/modules/topic', data);
    return response.data;
  },

  updateTopic: async (id: number, data: Partial<ModuleTopic>): Promise<ModuleTopic> => {
    const response = await api.put<ModuleTopic>(`/modules/topic/${id}`, data);
    return response.data;
  },

  deleteTopic: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/modules/topic/${id}`);
    return response.data;
  },

  // Order Management
  updateOrders: async (updates: { 
    modules?: Array<{ id: number; order: number }>;
    topics?: Array<{ id: number; order: number }>;
  }): Promise<ApiResponse> => {
    const response = await api.put<ApiResponse>('/modules/orders/update', updates);
    return response.data;
  },
};