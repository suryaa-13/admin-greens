import React, { useState, useEffect } from 'react';
import { Image, X, Hash, Globe, Info, Upload, CheckCircle2, Type, DollarSign, Youtube } from 'lucide-react';
import type { Domain } from '../../types/index';
import { IMAGE_URL } from '../../utils/storage';

interface DomainFormProps {
  domain?: Domain | null;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}

const DomainForm: React.FC<DomainFormProps> = ({ domain, onSubmit, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    domainId: domain?.domainId?.toString() || '0',
    courseId: domain?.courseId?.toString() || '0',
    domain: domain?.domain || '',
    title: domain?.title || '',
    subtitle: domain?.subtitle || '',
    price: domain?.price || '',
    description: domain?.description || '',
    videoUrl: domain?.videoUrl || '', // ✅ Added for Backend
    isActive: domain?.isActive ?? true,
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');

  useEffect(() => {
    // ✅ Matches backend key: thumbnailUrl
    if (domain?.thumbnailUrl) {
      setPreview(`${IMAGE_URL}${domain.thumbnailUrl}`);
    }
  }, [domain]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        alert("Please upload an Image file (JPG, PNG, or WEBP).");
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const data = new FormData();
    // Append text fields
    Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value.toString());
    });
    
    // ✅ Matches backend middleware: uploadDomainThumbnail.single("thumbnail")
    if (file) {
        data.append('thumbnail', file); 
    }

    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-2 max-h-[85vh] overflow-y-auto custom-scrollbar">
      {/* 1. ID Configuration */}
      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-1">
            <Hash size={12}/> Domain ID
          </label>
          <input type="number" min={0} value={formData.domainId} onChange={(e) => setFormData({...formData, domainId: e.target.value})} className="w-full bg-white rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500" required />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-1">
            <Hash size={12}/> Course ID
          </label>
          <input type="number" min={0} value={formData.courseId} onChange={(e) => setFormData({...formData, courseId: e.target.value})} className="w-full bg-white rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>

      {/* 2. Content Info */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
              <Globe size={12}/> Domain Tag Name
            </label>
            <input type="text" placeholder="e.g. AWS Cloud" value={formData.domain} onChange={(e) => setFormData({...formData, domain: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:border-black" required />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
             People
            </label>
            <input type="text" placeholder="e.g. 1500" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:border-black" />
          </div>
        </div>

        {/* ✅ YouTube Video URL - Critical for your Backend */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1">
            <Youtube size={12}/> YouTube Video URL *
          </label>
          <input 
            type="url" 
            placeholder="https://www.youtube.com/watch?v=..." 
            value={formData.videoUrl} 
            onChange={(e) => setFormData({...formData, videoUrl: e.target.value})} 
            className="w-full px-4 py-2 rounded-xl border border-red-100 bg-red-50/30 text-sm font-bold outline-none focus:border-red-500" 
            required 
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
            <Info size={12}/> Main Title
          </label>
          <input type="text" placeholder="Enter main heading" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:border-black" required />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
            <Type size={12}/> Subtitle
          </label>
          <input type="text" placeholder="Enter secondary heading" value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:border-black" />
        </div>
      </div>

      {/* 3. Image Upload Section */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
          <Image size={12}/> Asset Thumbnail
        </label>
        
        <div className="relative aspect-video w-full border-2 border-dashed border-gray-200 rounded-[2rem] overflow-hidden group bg-gray-50 flex items-center justify-center transition-all hover:border-indigo-400">
          {preview ? (
            <div className="w-full h-full relative group">
              <img src={preview} className="w-full h-full object-cover" alt="Preview" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  type="button" 
                  onClick={() => {setPreview(''); setFile(null);}} 
                  className="p-3 bg-red-600 text-white rounded-full shadow-xl hover:scale-110 transition-transform"
                >
                  <X size={20}/>
                </button>
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center cursor-pointer group w-full h-full justify-center">
              <div className="p-4 bg-white rounded-2xl shadow-sm mb-2 group-hover:scale-110 transition-transform text-indigo-500">
                <Upload size={32} />
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase">Upload Thumbnail</span>
              <p className="text-[9px] text-gray-300 mt-1">JPG, PNG, or WEBP (Max 5MB)</p>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          )}
        </div>
      </div>

      {/* 4. Description */}
      <div className="space-y-1">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
          <Info size={12}/> Full Description
        </label>
        <textarea 
          value={formData.description} 
          onChange={(e) => setFormData({...formData, description: e.target.value})} 
          rows={3} 
          className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium outline-none resize-none focus:ring-2 focus:ring-indigo-500 transition-all" 
          required 
        />
      </div>

      {/* 5. Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
        <button 
          type="button" 
          onClick={onCancel} 
          className="text-[10px] font-black text-gray-400 uppercase px-6 hover:text-red-500 transition-colors"
        >
          Discard
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="bg-indigo-600 text-white px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <CheckCircle2 size={14}/>
          )}
          {isSubmitting ? 'Syncing...' : 'Save Domain'}
        </button>
      </div>
    </form>
  );
};

export default DomainForm;