import api from './api';
import type { YouTubeShort } from '../types/index';

export const youtubeShortService = {
  getAll: async (): Promise<YouTubeShort[]> => {
    const response = await api.get<YouTubeShort[]>(`/youtube-short/admin/all`);
    return Array.isArray(response.data) ? response.data : [];
  },

  getById: async (id: number): Promise<YouTubeShort> => {
    const response = await api.get<YouTubeShort>(`/youtube-short/${id}`);
    return response.data;
  },

  create: async (data: FormData): Promise<YouTubeShort> => {
    const response = await api.post<YouTubeShort>(`/youtube-short/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: number, data: FormData): Promise<YouTubeShort> => {
    const response = await api.put<YouTubeShort>(`/youtube-short/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/youtube-short/${id}`);
    return response.data;
  },
};