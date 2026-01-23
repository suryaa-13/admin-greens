import React, { useState, useEffect } from 'react';
import type { YouTubeShort } from '../../types/index';
import { toast } from 'react-hot-toast';
import { X, Hash, Tag, Youtube, Type, Image as ImageIcon, Plus } from 'lucide-react';
import { IMAGE_URL } from '../../utils/storage';

interface Props {
  initialData?: YouTubeShort | null;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  loading: boolean;
}

const InputGroup: React.FC<{ icon: React.ReactNode; label: string; children: React.ReactNode; color?: string }> = ({ icon, label, children, color = "indigo" }) => (
  <div className="space-y-3">
    <label className={`flex items-center gap-2 text-[10px] font-black ${color === 'rose' ? 'text-rose-500' : 'text-indigo-600'} uppercase tracking-widest`}>
      {icon} {label}
    </label>
    {children}
  </div>
);

export const YouTubeShortForm: React.FC<Props> = ({ initialData, onSubmit, onCancel, loading }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '', batch: '', videoUrl: '', quote: '',
    domainId: 0, courseId: 0, order: 0, isActive: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name, batch: initialData.batch, videoUrl: initialData.videoUrl,
        quote: initialData.quote, domainId: initialData.domainId,
        courseId: initialData.courseId, order: initialData.order, isActive: initialData.isActive,
      });
    }
  }, [initialData]);

  const handleNumChange = (field: string, val: string) => {
    const num = Math.max(0, Number(val)); // Strict non-negative check
    setFormData(prev => ({ ...prev, [field]: num }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('batch', formData.batch);
    data.append('videoUrl', formData.videoUrl);
    data.append('quote', formData.quote || '');
    data.append('domainId', String(formData.domainId));
    data.append('courseId', String(formData.courseId));
    data.append('order', String(formData.order));
    data.append('isActive', String(formData.isActive));

    if (file) { data.append('image', file); } 
    else if (!initialData) { toast.error("Thumbnail is required"); return; }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-100">
      <div className="px-10 py-8 flex justify-between items-center border-b border-slate-50">
        <h2 className="text-2xl font-black text-[#1e293b] uppercase tracking-tight">Register Asset</h2>
        <button type="button" onClick={onCancel} className="text-slate-300 hover:text-rose-500 transition-colors"><X size={28} /></button>
      </div>

      <div className="p-10 overflow-y-auto space-y-8 flex-1">
        <div className="grid grid-cols-2 gap-6">
          <InputGroup icon={<Hash size={14} />} label="Domain ID">
            <input type="number" min="0" className="custom-input" value={formData.domainId} onChange={e => handleNumChange('domainId', e.target.value)} />
          </InputGroup>
          <InputGroup icon={<Hash size={14} />} label="Course ID">
            <input type="number" min="0" className="custom-input" value={formData.courseId} onChange={e => handleNumChange('courseId', e.target.value)} />
          </InputGroup>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <InputGroup icon={<Tag size={14} />} label="Student Name">
            <input type="text" className="custom-input" placeholder="e.g. John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </InputGroup>
          <InputGroup icon={<Tag size={14} />} label="Batch/Identity">
            <input type="text" className="custom-input" placeholder="e.g. MERN Stack" value={formData.batch} onChange={e => setFormData({...formData, batch: e.target.value})} required />
          </InputGroup>
        </div>

        <InputGroup icon={<Youtube size={14} />} label="YouTube Video URL" color="rose">
          <input type="url" className="custom-input border-rose-100 bg-rose-50/10 focus:border-rose-400" value={formData.videoUrl} onChange={e => setFormData({...formData, videoUrl: e.target.value})} required />
        </InputGroup>

        <InputGroup icon={<Type size={14} />} label="Quote Content">
          <textarea className="custom-input min-h-[100px] py-4" value={formData.quote} onChange={e => setFormData({...formData, quote: e.target.value})} />
        </InputGroup>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={14} /> Asset Thumbnail</label>
          <div className="relative h-48 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center overflow-hidden hover:bg-slate-50 transition-all cursor-pointer">
            {preview || (initialData?.imageUrl && !file) ? (
              <img src={preview || `${IMAGE_URL}${initialData?.imageUrl}`} className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-slate-300">
                <Plus size={32} className="mx-auto mb-2" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Select Visual Asset</p>
              </div>
            )}
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => {
              const f = e.target.files?.[0];
              if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
            }} />
          </div>
        </div>

        {/* Live/Hidden Toggle Badge */}
        <div className={`flex items-center justify-between p-6 rounded-[2rem] border transition-all ${formData.isActive ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
          <div className="flex flex-col">
            <span className={`text-[10px] font-black uppercase tracking-widest ${formData.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>Current Status</span>
            <span className="text-xl font-black text-[#1e293b] uppercase tracking-tight">{formData.isActive ? 'Live' : 'Hidden'}</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
            <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>
      </div>

      <div className="px-10 py-8 bg-[#fafbff] border-t flex justify-end gap-4 items-center">
        <button type="button" onClick={onCancel} className="text-xs font-black uppercase text-slate-400 tracking-widest">Cancel</button>
        <button type="submit" disabled={loading} className="bg-[#4f46e5] text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
          {loading ? 'Saving Knowledge...' : 'Save Knowledge'}
        </button>
      </div>
    </form>
  );
};