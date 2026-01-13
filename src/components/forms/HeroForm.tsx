import React, { useState, useEffect } from 'react';
import { 
  Plus, X, Image as ImageIcon, Layout, 
  Type, AlignLeft, Hash, Trash2, Save, Eye, EyeOff
} from 'lucide-react';
import { IMAGE_URL } from '../../utils/storage';
import type { Hero } from '../../types';

interface HeroFormProps {
  hero?: Hero | null;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}

const HeroForm: React.FC<HeroFormProps> = ({ hero, onSubmit, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 1. Core Form State
  const [formData, setFormData] = useState({
    title: hero?.title || '',
    subtitle: hero?.subtitle || '',
    description: hero?.description || '',
    domainId: hero?.domainId?.toString() || '0',
    courseId: hero?.courseId?.toString() || '0',
    isActive: hero?.isActive ?? true,
  });

  // 2. Marquee Text State
  const [runningTexts, setRunningTexts] = useState<{ text: string }[]>(
    hero?.runningTexts || [{ text: '' }]
  );

  // 3. Image State
  const [existingImages, setExistingImages] = useState<string[]>(hero?.images || []);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => newImagePreviews.forEach(url => URL.revokeObjectURL(url));
  }, [newImagePreviews]);

  /* --- Handlers --- */

  const handleAddText = () => {
    // Prevent adding if the last one is empty
    if (runningTexts.length > 0 && !runningTexts[runningTexts.length - 1].text.trim()) return;
    setRunningTexts([...runningTexts, { text: '' }]);
  };

  const handleRemoveText = (index: number) => {
    if (runningTexts.length > 1) {
      setRunningTexts(runningTexts.filter((_, i) => i !== index));
    } else {
      setRunningTexts([{ text: '' }]); // Clear instead of delete if last one
    }
  };

  const handleUpdateText = (index: number, value: string) => {
    const updated = [...runningTexts];
    updated[index].text = value;
    setRunningTexts(updated);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (existingImages.length + newImageFiles.length + filesArray.length > 5) {
        alert("Maximum 5 images allowed");
        return;
      }
      setNewImageFiles(prev => [...prev, ...filesArray]);
      const previews = filesArray.map(file => URL.createObjectURL(file));
      setNewImagePreviews(prev => [...prev, ...previews]);
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
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
      // Append basic text fields
      Object.entries(formData).forEach(([key, val]) => data.append(key, val.toString()));
      
      // Filter out empty marquee strings and append
      const validTexts = runningTexts.filter(t => t.text.trim() !== '');
      data.append('runningTexts', JSON.stringify(validTexts));
      
      // Image Sync
      data.append('existingImages', JSON.stringify(existingImages));
      newImageFiles.forEach(file => data.append('images', file));

      await onSubmit(data);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reusable Tailwind classes
  const inputClasses = "mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition-all focus:border-[#0f3d2e] focus:ring-4 focus:ring-[#0f3d2e]/5 placeholder:text-gray-400 placeholder:font-normal";
  const labelClasses = "text-[10px] font-black uppercase tracking-[0.15em] text-gray-500 ml-1 flex items-center gap-1.5";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[85vh]">
      <div className="flex-1 overflow-y-auto px-1 space-y-8 pb-8 custom-scrollbar">
        
        {/* Section 1: Visibility & Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
          <div>
  <label className={labelClasses}><Hash size={12}/> Domain ID</label>
  <input 
    type="number" 
    min="0" // Layer 1: Browser-level prevention
    onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()} // Layer 2: Prevent manual typing of minus sign
    value={formData.domainId} 
    onChange={e => {
      // Layer 3: State sanitization
      const val = Math.max(0, parseInt(e.target.value) || 0).toString();
      setFormData({...formData, domainId: val});
    }} 
    className={inputClasses} 
  />
</div>

<div>
  <label className={labelClasses}><Hash size={12}/> Course ID</label>
  <input 
    type="number" 
    min="0"
    onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
    value={formData.courseId} 
    onChange={e => {
      const val = Math.max(0, parseInt(e.target.value) || 0).toString();
      setFormData({...formData, courseId: val});
    }} 
    className={inputClasses} 
  />
</div>
          <div>
            <label className={labelClasses}>Status</label>
            <button 
              type="button" 
              onClick={() => setFormData(p => ({...p, isActive: !p.isActive}))}
              className={`mt-1.5 w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                formData.isActive 
                  ? 'bg-[#0f3d2e] text-white shadow-lg shadow-emerald-900/20' 
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {formData.isActive ? <><Eye size={14}/> Live on Site</> : <><EyeOff size={14}/> Hidden / Draft</>}
            </button>
          </div>
        </div>

        {/* Section 2: Textual Content */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}><Type size={12}/> Hero Title</label>
              <input 
                type="text" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                className={inputClasses} 
                placeholder="e.g. Master Architecture"
                required 
              />
            </div>
            <div>
              <label className={labelClasses}><AlignLeft size={12}/> Hero Subtitle</label>
              <input 
                type="text" 
                value={formData.subtitle} 
                onChange={e => setFormData({...formData, subtitle: e.target.value})} 
                className={inputClasses} 
                placeholder="e.g. Leading the design revolution"
                required 
              />
            </div>
          </div>
          <div>
            <label className={labelClasses}><Layout size={12}/> Full Description</label>
            <textarea 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              rows={3} 
              className={`${inputClasses} resize-none`} 
              placeholder="Provide deep context for the hero section..."
            />
          </div>
        </div>

        {/* Section 3: Visual Assets */}
{/* Section 3: Visual Assets */}
<div className="rounded-2xl border border-gray-100 p-6 space-y-4 bg-white shadow-sm">
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-xs font-black uppercase tracking-widest text-gray-900">Hero Slider Gallery</h3>
      <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">
        Slots: {existingImages.length + newImageFiles.length}/5
      </p>
    </div>
    {(existingImages.length + newImageFiles.length) < 5 && (
      <label className="cursor-pointer bg-[#0f3d2e] text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#1a5a45] transition-all flex items-center gap-2">
        <Plus size={14} /> Add Slide
        <input type="file" className="hidden" multiple accept="image/*" onChange={handleFileChange} />
      </label>
    )}
  </div>

  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
    {/* Existing (Stored) Images */}
    {existingImages.map((img, i) => (
      <div key={`ex-${i}`} className="group relative aspect-square rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm">
        <img src={`${IMAGE_URL}${img}`} className="h-full w-full object-cover" alt="Hero Slide" />
        
        {/* Persistent/Hover Cross Icon - Top Right */}
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

        {/* Gray 'Stored' Label Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-gray-600/80 py-1 text-[8px] text-white text-center font-black uppercase tracking-widest backdrop-blur-sm">
          Stored
        </div>
      </div>
    ))}
    
    {/* New Previews (For newly selected files) */}
    {newImagePreviews.map((preview, i) => (
      <div key={`new-${i}`} className="relative aspect-square rounded-xl overflow-hidden border-2 border-dashed border-emerald-200 bg-emerald-50/30">
        <img src={preview} className="h-full w-full object-cover" alt="New Slide Preview" />
        <button 
          type="button" 
          onClick={() => removeNewImage(i)} 
          className="absolute top-1.5 right-1.5 bg-gray-900/80 hover:bg-gray-900 text-white p-1.5 rounded-lg shadow-lg transition-all"
        >
          <X size={14} strokeWidth={3} />
        </button>
        <div className="absolute bottom-1 left-1 bg-[#0f3d2e] text-[8px] font-black text-white px-1.5 py-0.5 rounded shadow-sm">
          NEW
        </div>
      </div>
    ))}
  </div>
</div>

        {/* Section 4: Marquee Highlights */}
        <div className="rounded-2xl border border-gray-100 p-6 space-y-4 bg-gray-50/30">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-900">Dynamic Marquee</h3>
              <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">Rolling highlight strings</p>
            </div>
            <button 
              type="button" 
              onClick={handleAddText} 
              className="text-[10px] font-black text-[#0f3d2e] hover:bg-[#0f3d2e]/5 px-3 py-1.5 rounded-lg uppercase transition-all flex items-center gap-1.5 border border-[#0f3d2e]/20"
            >
              <Plus size={12} /> New String
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {runningTexts.map((item, index) => (
              <div key={index} className="flex gap-2 items-center bg-white p-2 pl-4 rounded-xl border border-gray-100 shadow-sm focus-within:border-[#0f3d2e] transition-all group">
                <Type size={14} className="text-gray-300 group-focus-within:text-[#0f3d2e] transition-colors" />
                <input 
                  type="text" 
                  value={item.text} 
                  onChange={e => handleUpdateText(index, e.target.value)}
                  placeholder="e.g. 100% Placement Record"
                  className="flex-1 bg-transparent py-1 text-sm font-bold text-gray-900 outline-none placeholder:font-normal placeholder:text-gray-300"
                />
                <button 
                  type="button" 
                  onClick={() => handleRemoveText(index)}
                  className="p-1.5 text-gray-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                  disabled={runningTexts.length === 1 && !item.text}
                >
                  <Trash2 size={16}/>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Persistent Footer Actions */}
      <div className="mt-6 border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 hidden md:block">
          Hero System &bull; Design Revision 2.0
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 sm:flex-none rounded-xl border border-gray-200 px-8 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !formData.title || (existingImages.length + newImageFiles.length === 0)}
            className="flex-1 sm:flex-none rounded-xl bg-[#0f3d2e] px-10 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-[#1a5a45] shadow-xl shadow-emerald-900/20 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
          >
            {isSubmitting ? 'Processing...' : (hero ? 'Sync Architecture' : 'Initialize Hero')}
          </button>
        </div>
      </div>
    </form>
  );
};

export default HeroForm;