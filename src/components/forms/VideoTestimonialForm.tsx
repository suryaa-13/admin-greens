
// components/forms/VideoTestimonialForm.tsx
import React, { useState } from 'react';
import { Upload, X, Plus, PlayCircle, GraduationCap, Link2, AlertCircle, Hash } from 'lucide-react';
import type { VideoTestimonial } from '../../types/index';
import { IMAGE_URL } from '../../utils/storage';

interface VideoTestimonialFormProps {
  testimonial?: VideoTestimonial | null;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}

const VideoTestimonialForm: React.FC<VideoTestimonialFormProps> = ({ testimonial, onSubmit, onCancel }) => {
  const isEditMode = !!testimonial;
  
  const [formData, setFormData] = useState({
    domainId: testimonial?.domainId?.toString() || '0',
    courseId: testimonial?.courseId?.toString() || '0',
    name: testimonial?.name || '',
    batch: testimonial?.batch || '',
    quote: testimonial?.quote || '',
    videoUrl: testimonial?.videoUrl || '',
    order: testimonial?.order?.toString() || '0',
    isActive: testimonial?.isActive ?? true,
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    testimonial?.imageUrl ? `${IMAGE_URL}${testimonial.imageUrl}` : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];
    
    if (!formData.name.trim()) newErrors.push('Student name is required');
    if (!formData.batch.trim()) newErrors.push('Batch information is required');
    if (!formData.videoUrl.trim()) newErrors.push('Video URL is required');
    if (!image && !testimonial?.imageUrl) newErrors.push('A thumbnail image is required');
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString());
      });

      if (image) {
        formDataToSend.append('image', image);
      }

      await onSubmit(formDataToSend);
    } catch (err) {
      setErrors(['Failed to save testimonial. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to prevent negative numbers
  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const val = parseInt(value);
    if (value === '' || (!isNaN(val) && val >= 0)) {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) return;
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-1">
      {/* Error Display */}
      {errors.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
          <div className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-widest mb-2">
            <AlertCircle size={16} />
            Validation Errors
          </div>
          <ul className="text-sm text-red-600 space-y-1">
            {errors.map((err, i) => <li key={i}>• {err}</li>)}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
        {/* Left Column: Details */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <GraduationCap className="text-indigo-500" size={18} />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Student Info</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Student Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="John Doe"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Batch / Year</label>
              <input
                type="text"
                name="batch"
                value={formData.batch}
                onChange={(e) => setFormData({...formData, batch: e.target.value})}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="DevOps Oct 2024"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-4 pb-2 border-b border-slate-100">
            <Hash className="text-indigo-500" size={18} />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">ID & Sorting</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Domain ID</label>
              <input
                type="number"
                name="domainId"
                min="0"
                value={formData.domainId}
                onChange={handleNumberInput}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Course ID</label>
              <input
                type="number"
                name="courseId"
                min="0"
                value={formData.courseId}
                onChange={handleNumberInput}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="0 for none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Display Order</label>
              <input
                type="number"
                name="order"
                min="0"
                value={formData.order}
                onChange={handleNumberInput}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Media */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Link2 className="text-indigo-500" size={18} />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Media & Links</h3>
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Video URL (YouTube Embed)</label>
            <input
              type="url"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="https://www.youtube.com/embed/..."
            />
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Thumbnail Preview</label>
            <div className="group relative aspect-video w-full overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-indigo-400 transition-all">
              {imagePreview ? (
                <>
                  <img src={imagePreview} className="h-full w-full object-cover" alt="Thumbnail" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
                    <PlayCircle size={48} className="text-white drop-shadow-2xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                  </div>
                  <button
                    type="button"
                    onClick={() => { setImage(null); setImagePreview(''); }}
                    className="absolute top-3 right-3 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                  <div className="mb-3 rounded-full bg-white p-3 shadow-sm text-slate-400 group-hover:text-indigo-500 transition-colors">
                    <Upload size={24} />
                  </div>
                  <p className="text-xs font-bold text-slate-500">Drop thumbnail or click</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">16:9 ratio recommended</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </div>
          </div>
        </div>

        {/* Full Width: Quote */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Featured Quote</label>
            <textarea
              rows={3}
              value={formData.quote}
              onChange={(e) => setFormData({...formData, quote: e.target.value})}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all italic"
              placeholder="The most impactful sentence from the video..."
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${formData.isActive ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                <PlayCircle size={20} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-700 leading-none">Visibility</p>
                <p className="text-[11px] text-slate-500 mt-1">Decide if this story is live for students</p>
              </div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input 
                type="checkbox" 
                checked={formData.isActive} 
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="sr-only peer" 
              />
              <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-indigo-600 peer-checked:after:translate-x-full"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
        >
          Discard
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-8 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-100 transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : <Plus size={16} />}
          {isEditMode ? 'Update Testimonial' : 'Publish Story'}
        </button>
      </div>
    </form>
  );
};

export default VideoTestimonialForm;