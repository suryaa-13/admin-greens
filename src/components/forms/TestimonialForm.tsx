// components/forms/TestimonialForm.tsx
import React, { useState } from 'react';
import { Upload, X, Hash, BookOpen } from 'lucide-react';
import type { Testimonial } from '../../types/index';
import { IMAGE_URL } from '../../utils/storage';

interface TestimonialFormProps {
  testimonial?: Testimonial | null;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}

const TestimonialForm: React.FC<TestimonialFormProps> = ({ testimonial, onSubmit, onCancel }) => {
  const isEditMode = !!testimonial;

  const [formData, setFormData] = useState({
    domainId: testimonial?.domainId?.toString() || '0',
    courseId: testimonial?.courseId?.toString() || '0', // Added courseId state
    name: testimonial?.name || '',
    batch: testimonial?.batch || '',
    quote: testimonial?.quote || '',
    videoUrl: testimonial?.videoUrl || '',
    isActive: testimonial?.isActive ?? true,
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    testimonial?.image ? `${IMAGE_URL}${testimonial.image}` : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const errors = [];
    if (!formData.name.trim()) errors.push('Please enter student name');
    if (!formData.batch.trim()) errors.push('Please enter batch information');
    // Quote validation removed
    if (!image && !testimonial?.image) errors.push('Please select a student photo');

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('domainId', formData.domainId);
      formDataToSend.append('courseId', formData.courseId); // Correctly appending courseId
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('batch', formData.batch.trim());
      formDataToSend.append('quote', formData.quote.trim() || " "); // Send space/empty if missing since backend might require it
      formDataToSend.append('videoUrl', formData.videoUrl.trim());
      formDataToSend.append('isActive', formData.isActive.toString());

      if (image) formDataToSend.append('image', image);

      await onSubmit(formDataToSend);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Generic helper for numeric ID changes
  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value);
    if (value === '' || (!isNaN(numValue) && numValue >= 0)) {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <form id="modal-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Domain ID */}
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            Domain ID *
          </label>
          <div className="relative">
            <input
              type="number"
              name="domainId"
              value={formData.domainId}
              onChange={handleNumericChange}
              min="0"
              className="w-full rounded-xl border border-gray-200 pl-3 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/10 outline-none"
              required
            />
            <Hash className="absolute right-3 top-3 h-4 w-4 text-gray-300" />
          </div>
        </div>

        {/* Course ID */}
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            Course ID (Optional)
          </label>
          <div className="relative">
            <input
              type="number"
              name="courseId"
              value={formData.courseId}
              onChange={handleNumericChange}
              min="0"
              className="w-full rounded-xl border border-gray-200 pl-3 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/10 outline-none"
              placeholder="0"
            />
            <BookOpen className="absolute right-3 top-3 h-4 w-4 text-gray-300" />
          </div>
          <p className="mt-1 text-[10px] text-gray-400 font-medium italic">0 = General Domain Review</p>
        </div>

        {/* Student Name */}
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            Student Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/10 outline-none font-bold"
            required
          />
        </div>

        {/* Batch */}
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            Batch / Year *
          </label>
          <input
            type="text"
            name="batch"
            value={formData.batch}
            onChange={handleInputChange}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/10 outline-none"
            placeholder="e.g. Java Full Stack 2025"
            required
          />
        </div>

        {/* Video URL Removed */}

        {/* Quote Removed */}

        {/* Active Status */}
        <div className="md:col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-3 text-xs font-black uppercase text-slate-600 tracking-wider">
              Publish Testimonial
            </span>
          </label>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="space-y-4 pt-2">
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Profile Image *</label>
        <div className="relative group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 p-6 bg-slate-50/50 hover:border-indigo-400 transition-all">
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Student Preview"
                className="h-32 w-32 rounded-full object-cover shadow-xl border-4 border-white"
              />
              <button
                type="button"
                onClick={() => { setImage(null); setImagePreview(''); }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-slate-300 mb-2" />
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Upload Photo</p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImage(file);
                const reader = new FileReader();
                reader.onloadend = () => setImagePreview(reader.result as string);
                reader.readAsDataURL(file);
              }
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-[11px] font-black uppercase text-slate-400 tracking-widest hover:text-slate-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-2 bg-slate-900 text-white text-[11px] font-black uppercase rounded-xl hover:bg-indigo-600 shadow-lg transition-all disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Testimonial' : 'Create Testimonial'}
        </button>
      </div>
    </form>
  );
};

export default TestimonialForm;