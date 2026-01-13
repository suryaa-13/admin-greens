import api from './api';
import type { FAQChat, FAQBulkRequest, FAQUpdateRequest } from '../types';

export const faqChatService = {
  // CLIENT: Get by step
  getByStep: async (step: number) => {
    // Correct URL: /api/faq-chat?step=0
    const response = await api.get<FAQChat[]>(`/faq-chat`, { params: { step } });
    return response.data;
  },

  // ADMIN: Get all
  getAllAdmin: async () => {
    // Correct URL: /api/faq-chat/admin/all
    const response = await api.get<FAQChat[]>('/faq-chat/admin/all');
    return response.data;
  },

  // ADMIN: Create Bulk (The fix for your "Route Not Found")
  createBulk: async (data: FAQBulkRequest) => {
    // CHANGED from '/question' to '/bulk' to match your backend
    const response = await api.post('/faq-chat/bulk', data);
    return response.data;
  },

  // ADMIN: Update Single
  update: async (id: number, data: FAQUpdateRequest) => {
    // Correct URL: /api/faq-chat/:id
    const response = await api.put(`/faq-chat/${id}`, data);
    return response.data;
  },

  // ADMIN: Soft Delete
  delete: async (id: number) => {
    // Correct URL: /api/faq-chat/:id
    const response = await api.delete(`/faq-chat/${id}`);
    return response.data;
  }
};