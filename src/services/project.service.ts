// services/project.service.ts
import api from './api';
import type { Project, ApiResponse, ProjectTech } from '../types/index';

export const projectService = {
  // For admin panel - gets ALL projects (including inactive)
  getAll: async (): Promise<Project[]> => {
    const response = await api.get<Project[]>('/projects/admin/all');
    console.log("Admin projects response:", response.data);
    return Array.isArray(response.data) ? response.data : [];
  },

  // For public site - gets only active projects
  getActiveProjects: async (params?: { domainId?: number; courseId?: number }): Promise<Project[]> => {
    const response = await api.get<Project[]>('/projects', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Project> => {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },

  create: async (data: FormData): Promise<Project> => {
    const response = await api.post<Project>('/projects', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: number, data: FormData): Promise<Project> => {
    const response = await api.put<Project>(`/projects/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/projects/${id}`);
    return response.data;
  },

  addTech: async (data: { projectId: number; name: string }): Promise<ProjectTech> => {
    const response = await api.post<ProjectTech>('/projects/tech', data);
    return response.data;
  },
};