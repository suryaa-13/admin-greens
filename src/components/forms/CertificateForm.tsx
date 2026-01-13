import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Plus, Minus, ShieldCheck, ChevronDown, Check, 
  Award, Star, Shield, CheckCircle, FileBadge 
} from 'lucide-react';
import type { Certificate, CertificateStep } from '../../types/index';
import { IMAGE_URL } from '../../utils/storage';

interface CertificateFormProps {
  certificate?: Certificate | null;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}

const CertificateForm: React.FC<CertificateFormProps> = ({ certificate, onSubmit, onCancel }) => {
  const isEditMode = !!certificate;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    domainId: certificate?.domainId?.toString() || '0',
    courseId: certificate?.courseId?.toString() || '0',
    sectionTitle: certificate?.sectionTitle || '',
    isActive: certificate?.isActive ?? true,
  });

  const [steps, setSteps] = useState<CertificateStep[]>(
    certificate?.steps || [
      { id: 1, title: '', description: '', icon: 'check-circle' },
      { id: 2, title: '', description: '', icon: 'check-circle' },
      { id: 3, title: '', description: '', icon: 'check-circle' },
    ]
  );

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    certificate?.certificateImage ? `${IMAGE_URL}${certificate.certificateImage}` : ''
  );

  const iconOptions = [
    { value: 'check-circle', label: 'Check Circle', icon: <CheckCircle size={16} className="text-emerald-500" /> },
    { value: 'award', label: 'Award', icon: <Award size={16} className="text-amber-500" /> },
    { value: 'shield', label: 'Shield', icon: <Shield size={16} className="text-indigo-500" /> },
    { value: 'star', label: 'Star', icon: <Star size={16} className="text-purple-500" /> },
    { value: 'certificate', label: 'Certificate', icon: <FileBadge size={16} className="text-rose-500" /> },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      // Strictly prevent negative values
      const val = Math.max(0, parseInt(value) || 0).toString();
      setFormData(prev => ({ ...prev, [name]: val }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const updateStep = (index: number, field: keyof CertificateStep, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return alert('Image too large (>5MB)');
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([k, v]) => formDataToSend.append(k, v.toString()));
      formDataToSend.append('steps', JSON.stringify(steps));
      if (image) formDataToSend.append('certificateImage', image);
      await onSubmit(formDataToSend);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. IDs & Meta Section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
        <div className="group">
          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Domain ID *</label>
          <input
            type="number"
            name="domainId"
            value={formData.domainId}
            onChange={handleInputChange}
            min="0"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all"
            required
          />
        </div>

        <div className="group">
          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Course ID</label>
          <input
            type="number"
            name="courseId"
            value={formData.courseId}
            onChange={handleInputChange}
            min="0"
            placeholder="0 for Domain"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all"
          />
        </div>

        <div className="md:col-span-2 group">
          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Section Title *</label>
          <input
            type="text"
            name="sectionTitle"
            value={formData.sectionTitle}
            onChange={handleInputChange}
            placeholder="e.g. Master's Certification Steps"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all"
            required
          />
        </div>

        <div className="flex items-center gap-3 px-1">
          <div className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            <label htmlFor="isActive" className="ml-3 text-sm font-bold text-slate-600 cursor-pointer">Active Status</label>
          </div>
        </div>
      </div>

      {/* 2. Steps Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-end px-1">
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Milestone Steps</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Define the journey to earn this badge</p>
          </div>
          <button type="button" onClick={() => setSteps([...steps, { id: steps.length + 1, title: '', description: '', icon: 'check-circle' }])}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black hover:bg-indigo-600 hover:text-white transition-all">
            <Plus size={14} strokeWidth={3} /> ADD STEP
          </button>
        </div>

        <div className="space-y-3" ref={dropdownRef}>
          {steps.map((step, index) => (
            <div key={step.id} className="group relative p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-200 hover:shadow-sm transition-all animate-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="flex justify-between mb-4">
                <span className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-black text-slate-500">STEP 0{step.id}</span>
                {steps.length > 1 && (
                  <button type="button" onClick={() => setSteps(steps.filter((_, i) => i !== index).map((s, i) => ({ ...s, id: i + 1 })))}
                    className="text-slate-300 hover:text-rose-500 transition-colors">
                    <Minus size={18} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Custom Icon Dropdown */}
                <div className="md:col-span-3 relative">
                  <button
                    type="button"
                    onClick={() => setActiveDropdown(activeDropdown === index ? null : index)}
                    className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-white transition-all"
                  >
                    <div className="flex items-center gap-2">
                      {iconOptions.find(o => o.value === step.icon)?.icon}
                      <span className="truncate">{iconOptions.find(o => o.value === step.icon)?.label}</span>
                    </div>
                    <ChevronDown size={14} className={`transition-transform ${activeDropdown === index ? 'rotate-180' : ''}`} />
                  </button>

                  {activeDropdown === index && (
                    <div className="absolute z-[50] mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl p-1 animate-in fade-in zoom-in-95">
                      {iconOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => { updateStep(index, 'icon', opt.value); setActiveDropdown(null); }}
                          className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-bold transition-all ${step.icon === opt.value ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                          <div className="flex items-center gap-2">{opt.icon} {opt.label}</div>
                          {step.icon === opt.value && <Check size={12} strokeWidth={4} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <input
                  placeholder="Step Heading"
                  value={step.title}
                  onChange={(e) => updateStep(index, 'title', e.target.value)}
                  className="md:col-span-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold focus:bg-white focus:border-indigo-400 outline-none transition-all"
                />
                <input
                  placeholder="Short Description"
                  value={step.description}
                  onChange={(e) => updateStep(index, 'description', e.target.value)}
                  className="md:col-span-6 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold focus:bg-white focus:border-indigo-400 outline-none transition-all"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Image Upload Section */}
      <div className="group relative border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all overflow-hidden">
        {imagePreview ? (
          <div className="relative inline-block animate-in zoom-in-95">
            <img src={imagePreview} alt="Preview" className="h-48 rounded-xl shadow-2xl border-4 border-white" />
            <button type="button" onClick={() => { setImage(null); setImagePreview(''); }}
              className="absolute -top-3 -right-3 bg-rose-500 text-white rounded-full p-2 shadow-lg hover:bg-rose-600 transition-colors">
              <X size={16} strokeWidth={3} />
            </button>
          </div>
        ) : (
          <div className="py-4">
            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all mb-4">
              <ShieldCheck size={32} />
            </div>
            <p className="text-sm font-black text-slate-700 uppercase tracking-tight">Upload Certificate Template</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">PNG or JPG (Max 5MB)</p>
          </div>
        )}
        <input type="file" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
        <button type="button" onClick={onCancel} className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting}
          className="px-8 py-2.5 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 disabled:opacity-50 shadow-xl shadow-slate-200 transition-all">
          {isSubmitting ? 'Processing...' : isEditMode ? 'Update Certificate' : 'Create Certificate'}
        </button>
      </div>
    </form>
  );
};

export default CertificateForm;