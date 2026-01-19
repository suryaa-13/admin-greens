// services/mail.service.ts
import axios from 'axios';
import type { MailActionPayload } from '../types/index';

// Backend URL pointing to Port 3000
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/mail`;

export const mailService = {
  /**
   * Admin Bulk Mail (Protected)
   * This handles the /admin endpoint with Token
   */
  sendAdminBulkMail: async (payload: MailActionPayload) => {
    const formData = new FormData();

    // Append all fields to FormData
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'attachment') {
          formData.append('attachment', value as File);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    // Retrieve the admin token from localStorage
    const token = localStorage.getItem('admin_token'); 

    const { data } = await axios.post(`${BASE_URL}/admin`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}` // This fixes your "No token provided" error
      }
    });

    return data;
  },

  /**
   * Client Side Actions (Public)
   * This handles the /process endpoint
   */
  processClientMail: async (payload: MailActionPayload) => {
    const { data } = await axios.post(`${BASE_URL}/process`, payload);
    return data;
  }
};