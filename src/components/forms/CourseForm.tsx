import React, { useState } from 'react';
import { Upload, X, Hash, DollarSign, Clock } from 'lucide-react';
import type { Course } from '../../types/index';
import { IMAGE_URL } from '../../utils/storage';

interface CourseFormProps {
  course?: Course | null;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}

const CourseForm: React.FC<CourseFormProps> = ({ course, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    courseId: course?.courseId?.toString() || '0',
    domainId: course?.domainId?.toString() || '0',
    title: course?.title || '',
    description: course?.description || '',
    price: course?.price || '',
    duration: course?.duration || '',
    isActive: course?.isActive ?? true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    course?.image ? `${IMAGE_URL}${course.image}` : ''
  );
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value.toString());
    });
    
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    } else if (removeExistingImage) {
      formDataToSend.append('removeImage', 'true');
    }

    try {
      await onSubmit(formDataToSend);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setRemoveExistingImage(false);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl('');
    setRemoveExistingImage(true);
  };

  const inputClass = "w-full rounded-xl border border-gray-200 py-3 px-4 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400";
  const labelClass = "block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div>
          <label className={labelClass}>Domain ID (Numerical) *</label>
          <div className="relative">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="number"
              min="0"
              value={formData.domainId}
              onChange={(e) => {
                const val = Math.max(0, parseInt(e.target.value) || 0);
                setFormData({...formData, domainId: val.toString()});
              }}
              className={`${inputClass} pl-11`}
              required
            />
          </div>
        </div>
    <div>
          <label className={labelClass}>Course ID (Numerical) *</label>
          <div className="relative">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="number"
              min="0"
              value={formData.courseId}
              onChange={(e) => {
                const val = Math.max(0, parseInt(e.target.value) || 0);
                setFormData({...formData, courseId: val.toString()});
              }}
              className={`${inputClass} pl-11`}
              required
            />
          </div>
        </div>

     
        <div>
          <label className={labelClass}>Course Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={inputClass}
            placeholder="e.g. Full Stack Web Development"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className={`${inputClass} resize-none`}
            required
          />
        </div>

        <div>
          <label className={labelClass}>People</label>
          <div className="relative">
            <input
              type="text"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className={`${inputClass} pl-11`}
              placeholder="99.99"
              required
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Duration *</label>
          <div className="relative">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className={`${inputClass} pl-11`}
              placeholder="e.g. 3 Months"
              required
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Media Asset</label>
          {previewUrl ? (
            <div className="relative group w-40 h-40">
              <img src={previewUrl} className="w-full h-full object-cover rounded-2xl border-2 border-gray-100 shadow-sm" alt="Preview" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-rose-500 text-white p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-indigo-400 transition-all">
              <Upload className="text-gray-400 mb-2" size={24} />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Upload Course Image</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-5 w-5 rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Visible to students (Active)</span>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
        <button type="button" onClick={onCancel} className="px-6 py-3 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors">Cancel</button>
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-8 py-3 rounded-xl font-bold shadow-xl active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? 'Processing...' : course ? 'Update Course' : 'Launch Course'}
        </button>
      </div>
    </form>
  );
};

export default CourseForm;