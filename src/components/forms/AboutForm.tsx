import React, { useState, useEffect } from 'react';
import { 
  Plus, X,  Layout, 
  Type, AlignLeft, Hash, Eye, EyeOff, Layers
} from 'lucide-react';
import { IMAGE_URL } from '../../utils/storage';
import type { About } from '../../types';

interface AboutFormProps {
  about?: About | null;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}

const AboutForm: React.FC<AboutFormProps> = ({ about, onSubmit, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 1. Core Form State
  const [formData, setFormData] = useState({
    label: about?.label || '',
    heading: about?.heading || '',
    description1: about?.description1 || '',
    description2: about?.description2 || '',
    domainId: about?.domainId?.toString() || '0',
    courseId: about?.courseId?.toString() || '0',
    isActive: about?.isActive ?? true,
  });

  // 2. Image State Management
  const [existingMainImages, setExistingMainImages] = useState<string[]>(about?.mainImages || []);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  // Cleanup object URLs
  useEffect(() => {
    return () => newImagePreviews.forEach(url => URL.revokeObjectURL(url));
  }, [newImagePreviews]);

  /* --- Handlers --- */

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB

      // Validate size
      const oversized = filesArray.find(f => f.size > MAX_SIZE);
      if (oversized) {
        alert(`File ${oversized.name} is too large. Max 5MB.`);
        return;
      }

      // Backend limit check (max 5)
      if (existingMainImages.length + newImageFiles.length + filesArray.length > 5) {
        alert("Maximum 5 images allowed for the slideshow");
        return;
      }

      setNewImageFiles(prev => [...prev, ...filesArray]);
      const previews = filesArray.map(file => URL.createObjectURL(file));
      setNewImagePreviews(prev => [...prev, ...previews]);
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingMainImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      
      // Append basic fields with sanitization
      data.append('domainId', Math.max(0, parseInt(formData.domainId) || 0).toString());
      data.append('courseId', Math.max(0, parseInt(formData.courseId) || 0).toString());
      data.append('label', formData.label);
      data.append('heading', formData.heading);
      data.append('description1', formData.description1);
      data.append('description2', formData.description2);
      data.append('isActive', formData.isActive.toString());

      // Sync Images
      data.append('existingMainImages', JSON.stringify(existingMainImages));
      newImageFiles.forEach(file => {
        data.append('mainImages', file); // Matches your controller field name
      });

      await onSubmit(data);
    } catch (error) {
      console.error("About section submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Shared Styles
  const inputClasses = "mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition-all focus:border-[#0f3d2e] focus:ring-4 focus:ring-[#0f3d2e]/5 placeholder:text-gray-400 placeholder:font-normal";
  const labelClasses = "text-[10px] font-black uppercase tracking-[0.15em] text-gray-500 ml-1 flex items-center gap-1.5";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[85vh]">
      <div className="flex-1 overflow-y-auto px-1 space-y-8 pb-8 custom-scrollbar">
        
        {/* Section 1: Target Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
          <div>
            <label className={labelClasses}><Hash size={12}/> Domain ID</label>
            <input 
              type="number" 
              min="0"
              onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
              value={formData.domainId} 
              onChange={e => setFormData({...formData, domainId: e.target.value})} 
              className={inputClasses} 
            />
          </div>
          <div>
            <label className={labelClasses}><Layers size={12}/> Course ID</label>
            <input 
              type="number" 
              min="0"
              onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
              value={formData.courseId} 
              onChange={e => setFormData({...formData, courseId: e.target.value})} 
              className={inputClasses} 
            />
          </div>
          <div>
            <label className={labelClasses}>Visibility</label>
            <button 
              type="button" 
              onClick={() => setFormData(p => ({...p, isActive: !p.isActive}))}
              className={`mt-1.5 w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                formData.isActive 
                  ? 'bg-[#0f3d2e] text-white shadow-lg shadow-emerald-900/20' 
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {formData.isActive ? <><Eye size={14}/> Visible</> : <><EyeOff size={14}/> Hidden</>}
            </button>
          </div>
        </div>

        {/* Section 2: Header Content */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}><Type size={12}/> Section Label</label>
              <input 
                type="text" 
                value={formData.label} 
                onChange={e => setFormData({...formData, label: e.target.value})} 
                className={inputClasses} 
                placeholder="e.g. ABOUT OUR INSTITUTE"
                required 
              />
            </div>
            <div>
              <label className={labelClasses}><AlignLeft size={12}/> Main Heading</label>
              <input 
                type="text" 
                value={formData.heading} 
                onChange={e => setFormData({...formData, heading: e.target.value})} 
                className={inputClasses} 
                placeholder="e.g. Excellence in Technology"
                required 
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}><Layout size={12}/> Paragraph 1</label>
              <textarea 
                value={formData.description1} 
                onChange={e => setFormData({...formData, description1: e.target.value})} 
                rows={4} 
                className={`${inputClasses} resize-none`} 
                required 
              />
            </div>
            <div>
              <label className={labelClasses}><Layout size={12}/> Paragraph 2 (Optional)</label>
              <textarea 
                value={formData.description2} 
                onChange={e => setFormData({...formData, description2: e.target.value})} 
                rows={4} 
                className={`${inputClasses} resize-none`} 
              />
            </div>
          </div>
        </div>

       {/* Section 3: Slideshow Images */}
<div className="rounded-2xl border border-gray-100 p-6 space-y-4 bg-white shadow-sm">
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-xs font-black uppercase tracking-widest text-gray-900">Main Slideshow</h3>
      <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">
        Used in the large about section carousel ({existingMainImages.length + newImageFiles.length}/5)
      </p>
    </div>
    {(existingMainImages.length + newImageFiles.length) < 5 && (
      <label className="cursor-pointer bg-[#0f3d2e] text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#1a5a45] transition-all flex items-center gap-2">
        <Plus size={14} /> Add Image
        <input type="file" className="hidden" multiple accept="image/*" onChange={handleFileChange} />
      </label>
    )}
  </div>

  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
    {/* Existing (Stored) Images */}
    {existingMainImages.map((img, i) => (
      <div key={`ex-${i}`} className="group relative aspect-square rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm">
        <img src={`${IMAGE_URL}${img}`} className="h-full w-full object-cover" alt="About Slide" />
        
        {/* Top-Right Persistent Cross Icon for DB Removal */}
        <div className="absolute top-1.5 right-1.5 z-10">
          <button 
            type="button" 
            onClick={() => removeExistingImage(i)} 
            className="bg-rose-500 hover:bg-rose-600 text-white p-1.5 rounded-lg shadow-lg transition-all transform active:scale-90"
            title="Remove from database"
          >
            <X size={14} strokeWidth={3} />
          </button>
        </div>

        {/* Footer Label */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#0f3d2e]/80 py-1 text-[8px] text-white text-center font-black uppercase tracking-widest backdrop-blur-sm">
          Active
        </div>
      </div>
    ))}
    
    {/* New Previews (Uploaded but not yet saved) */}
    {newImagePreviews.map((preview, i) => (
      <div key={`new-${i}`} className="relative aspect-square rounded-xl overflow-hidden border-2 border-dashed border-emerald-200 bg-emerald-50/30">
        <img src={preview} className="h-full w-full object-cover" alt="New Slide Preview" />
        
        {/* Top-Right Cross Icon for Local Removal */}
        <div className="absolute top-1.5 right-1.5 z-10">
          <button 
            type="button" 
            onClick={() => removeNewImage(i)} 
            className="bg-gray-900/80 hover:bg-gray-900 text-white p-1.5 rounded-lg shadow-lg transition-all"
          >
            <X size={14} strokeWidth={3} />
          </button>
        </div>

        <div className="absolute bottom-1 left-1 bg-indigo-600 text-[8px] font-black text-white px-1.5 py-0.5 rounded shadow-sm">
          NEW
        </div>
      </div>
    ))}
  </div>
</div>
      </div>

      {/* Footer Actions */}
      <div className="mt-6 border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          Ensure content follows SEO guidelines
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 sm:flex-none rounded-xl border border-gray-200 px-8 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 sm:flex-none rounded-xl bg-[#0f3d2e] px-10 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-[#1a5a45] shadow-xl shadow-emerald-900/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : (about ? 'Update Section' : 'Publish Section')}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AboutForm;