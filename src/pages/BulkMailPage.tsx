import React, { useState } from 'react';
import { Send, Users, FileText, Paperclip, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import axios from 'axios';
import { getToken } from '../utils/storage';
const BulkMailPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    targetType: 'GENERAL',
    domainId: 0,
    courseId: 0,
    subject: '',
    message: ''
  });
  const [file, setFile] = useState<File | null>(null);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const token = getToken(); // ✅ ADMIN TOKEN
  if (!token) {
    toast.error('Admin session expired. Please login again.');
    return;
  }

  setLoading(true);

  try {
    const data = new FormData();
    data.append('mode', 'ADMIN_BULK');
    data.append('targetType', formData.targetType);
    data.append('domainId', String(formData.domainId));
    data.append('courseId', String(formData.courseId));
    data.append('subject', formData.subject);
    data.append('message', formData.message);

    if (file) {
      data.append('attachment', file);
    }

    const response = await axios.post(
      'http://localhost:3000/api/mail/admin',
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ correct admin token
        },
      }
    );

    toast.success(`Sent to ${response.data.sent} users`);

    setFormData({ ...formData, subject: '', message: '' });
    setFile(null);
  } catch (error: any) {
    console.error('Mail Error:', error.response?.data);
    toast.error(error.response?.data?.message || 'Bulk mail failed');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Send className="text-indigo-600" /> Bulk Communications
        </h1>
        <p className="text-gray-600">Broadcast emails to filtered user segments</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
        {/* Audience Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
            <select 
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.targetType}
              onChange={(e) => setFormData({...formData, targetType: e.target.value})}
            >
              <option value="GENERAL">General Subscribers</option>
              <option value="DOMAIN_SPECIFIC">By Domain</option>
              <option value="COURSE_SPECIFIC">By Specific Course</option>
            </select>
          </div>

          {formData.targetType !== 'GENERAL' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Domain ID</label>
              <input 
                type="number" min="0" required
                className="w-full border rounded-lg p-2"
                value={formData.domainId}
                onChange={(e) => setFormData({...formData, domainId: parseInt(e.target.value) || 0})}
              />
            </div>
          )}

          {formData.targetType === 'COURSE_SPECIFIC' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course ID</label>
              <input 
                type="number" min="0" required
                className="w-full border rounded-lg p-2"
                value={formData.courseId}
                onChange={(e) => setFormData({...formData, courseId: parseInt(e.target.value) || 0})}
              />
            </div>
          )}
        </div>

        <hr />

        {/* Email Content */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line</label>
            <input 
              type="text" required
              placeholder="e.g., Important Update regarding your course"
              className="w-full border rounded-lg p-2 outline-none focus:border-indigo-500"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message (HTML supported)</label>
            <textarea 
              required rows={8}
              placeholder="Write your message here..."
              className="w-full border rounded-lg p-3 outline-none focus:border-indigo-500 font-mono text-sm"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
            />
          </div>

          {/* Attachment */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Paperclip className="text-gray-400" />
            <div className="flex-1">
              <input 
                type="file" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="text-sm text-gray-600"
              />
              <p className="text-[10px] text-gray-400 mt-1">PDF, DOC, or Images accepted</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            variant="primary" 
            disabled={loading}
            className="w-full md:w-auto px-10 py-3"
          >
            {loading ? 'Dispatching...' : 'Send Broadcast'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BulkMailPage;

