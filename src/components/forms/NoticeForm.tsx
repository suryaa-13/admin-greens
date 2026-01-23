import React, { useState } from 'react';
import { AlertCircle, Bell } from 'lucide-react';
import type { Notice } from '../../types/index';

interface NoticeFormProps {
  notice?: Notice | null;
  onSubmit: (formData: Partial<Notice>) => Promise<void>;
  onCancel: () => void;
}

const NoticeForm: React.FC<NoticeFormProps> = ({ notice, onSubmit, onCancel }) => {
  const isEditMode = !!notice;
  
  const [formData, setFormData] = useState({
    content: notice?.content || '',
    isActive: notice?.isActive ?? true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.content.trim()) {
      setError('Please enter notice content');
      return;
    }

    if (formData.content.length > 500) {
      setError('Notice content should not exceed 500 characters');
      return;
    }

    setError('');
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (error: any) {
      setError(error.message || 'Failed to save notice');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  return (
    <form id="modal-form" onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Notice Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Bell className="inline h-4 w-4 mr-1" />
          Notice Content *
        </label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter notice text to display in marquee..."
          required
          maxLength={500}
        />
        <div className="mt-2 flex justify-between text-xs text-gray-500">
          <span>This text will be displayed in the marquee/notification bar</span>
          <span>{formData.content.length}/500 characters</span>
        </div>
      </div>

      {/* Active Status */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleCheckboxChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="ml-3 flex-1">
            <span className="text-sm font-medium text-gray-700">Active Notice</span>
            <span className="block text-xs text-gray-500">
              Active notices are displayed in the marquee. Inactive notices are hidden but kept in the database.
            </span>
          </span>
        </label>
      </div>

      {/* Content Guidelines */}
      <div className="rounded-lg bg-blue-50 p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
          <div>
            <h4 className="text-sm font-medium text-blue-800 mb-1">📋 Notice Guidelines:</h4>
            <ul className="text-xs text-blue-700 space-y-1 list-disc pl-5">
              <li>Keep notices concise and to the point</li>
              <li>Use clear, simple language</li>
              <li>Include important dates, deadlines, or announcements</li>
              <li>Avoid using special characters that might break the marquee</li>
              <li>Maximum 500 characters recommended</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
              {isEditMode ? 'Saving...' : 'Creating...'}
            </span>
          ) : (
            isEditMode ? 'Update Notice' : 'Create Notice'
          )}
        </button>
      </div>
    </form>
  );
};

export default NoticeForm;