import React, { useState } from 'react';
import { Upload, X, Plus, Link as LinkIcon, Trash2, User, Info } from 'lucide-react';
import type { TrainerAbout } from '../../types/index';
import { IMAGE_URL } from '../../utils/storage';

interface SocialLink {
  platform: string;
  url: string;
}

interface TrainerAboutFormProps {
  trainerAbout?: TrainerAbout | null;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}

const TrainerAboutForm: React.FC<TrainerAboutFormProps> = ({ trainerAbout, onSubmit, onCancel }) => {
  const isEditMode = !!trainerAbout;
  
  const [formData, setFormData] = useState({
    domainId: trainerAbout?.domainId?.toString() || '0',
    courseId: trainerAbout?.courseId?.toString() || '0',
    label: trainerAbout?.label || '',
    heading: trainerAbout?.heading || '',
    description1: trainerAbout?.description1 || '',
    description2: trainerAbout?.description2 || '',
    isActive: trainerAbout?.isActive ?? true,
  });

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    trainerAbout?.socialLinks || [{ platform: '', url: '' }]
  );

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(() => {
    if (!trainerAbout?.mainImage) return '';
    const base = IMAGE_URL;
    return `${base}${trainerAbout.mainImage}`;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    // --- NEW VALIDATION FOR NON-NEGATIVE IDS ---
    if (type === 'number' && (name === 'domainId' || name === 'courseId')) {
      // Prevent entering negative values
      if (parseInt(value) < 0) return;
    }

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLinkChange = (index: number, field: keyof SocialLink, value: string) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index][field] = value;
    setSocialLinks(updatedLinks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preview) return alert('Profile image is required');

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'isActive') {
          formDataToSend.append(key, value ? '1' : '0');
        } else {
          formDataToSend.append(key, value.toString());
        }
      });
      
      const validLinks = socialLinks.filter(l => l.platform.trim() && l.url.trim());
      formDataToSend.append('socialLinks', JSON.stringify(validLinks));

      if (mainImage) {
        formDataToSend.append('mainImage', mainImage);
      }

      await onSubmit(formDataToSend);
    } catch (error) {
      console.error("Form error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Context Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Domain ID</label>
            <input 
              type="number" 
              name="domainId" 
              min="0" // HTML5 prevention for arrows
              value={formData.domainId} 
              onChange={handleInputChange} 
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Course ID</label>
            <input 
              type="number" 
              name="courseId" 
              min="0" // HTML5 prevention for arrows
              value={formData.courseId} 
              onChange={handleInputChange} 
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
            />
          </div>
          <div className="flex items-center pt-6">
            <label className="flex items-center cursor-pointer group">
              <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="sr-only peer" />
              <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5 after:mt-[2px] after:ml-[2px]"></div>
              <span className="ml-3 text-xs font-bold text-slate-500 group-hover:text-slate-700">Live Status</span>
            </label>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="label" value={formData.label} onChange={handleInputChange} placeholder="Label (e.g. Lead Trainer)" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none" required />
            <input type="text" name="heading" value={formData.heading} onChange={handleInputChange} placeholder="Trainer Name" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none" required />
          </div>
          <textarea name="description1" value={formData.description1} onChange={handleInputChange} rows={3} placeholder="Primary Bio" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none resize-none" required />
          <textarea name="description2" value={formData.description2} onChange={handleInputChange} rows={2} placeholder="Additional Bio (Optional)" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none resize-none" />
        </div>

        {/* Media & Social */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile Image</label>
            <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-4 h-44 bg-slate-50 flex flex-col items-center justify-center">
              {preview ? (
                <>
                  <img src={preview} className="h-full w-full object-cover rounded-xl shadow-sm" alt="" />
                  <button type="button" onClick={() => {setPreview(''); setMainImage(null);}} className="absolute -top-2 -right-2 p-1.5 bg-white shadow-lg rounded-full text-red-500 hover:scale-110 transition-transform"><X size={14}/></button>
                </>
              ) : (
                <label className="flex flex-col items-center cursor-pointer">
                  <Upload size={24} className="text-indigo-600 mb-2" />
                  <span className="text-xs font-bold text-slate-400">Click to upload</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) { setMainImage(file); setPreview(URL.createObjectURL(file)); }
                  }} />
                </label>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Social Links</label>
              <button type="button" onClick={() => setSocialLinks([...socialLinks, { platform: '', url: '' }])} className="text-indigo-600 font-bold text-xs">+ Add</button>
            </div>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-2">
              {socialLinks.map((link, i) => (
                <div key={i} className="flex gap-2">
                  <input value={link.platform} onChange={(e) => handleLinkChange(i, 'platform', e.target.value)} placeholder="App" className="w-1/3 border border-slate-200 rounded-lg px-2 py-1.5 text-xs" />
                  <input value={link.url} onChange={(e) => handleLinkChange(i, 'url', e.target.value)} placeholder="URL" className="flex-1 border border-slate-200 rounded-lg px-2 py-1.5 text-xs" />
                  <button type="button" onClick={() => setSocialLinks(socialLinks.filter((_, idx) => idx !== i))} className="text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 border-t bg-slate-50 flex items-center justify-between rounded-b-2xl">
        <button type="button" onClick={onCancel} className="text-sm font-bold text-slate-400 hover:text-slate-600">Dismiss</button>
        <button type="submit" disabled={isSubmitting} className="px-8 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-slate-200 disabled:opacity-50 transition-all">
          {isSubmitting ? 'Syncing...' : isEditMode ? 'Update Profile' : 'Publish Trainer'}
        </button>
      </div>
    </form>
  );
};

export default TrainerAboutForm;