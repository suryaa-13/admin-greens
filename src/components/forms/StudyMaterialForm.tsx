import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, X, Trash2, FileText, Video, 
  Presentation, BookOpen, File, ChevronDown, Check, Image as ImageIcon 
} from 'lucide-react';
import type { StudyMaterial } from '../../types';
import { IMAGE_URL } from '../../utils/storage';

interface StudyMaterialFormProps {
  material?: StudyMaterial | null;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}

const StudyMaterialForm: React.FC<StudyMaterialFormProps> = ({ material, onSubmit, onCancel }) => {
  const isEditMode = !!material;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File States
  const [file, setFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    material?.imageUrl ? `${IMAGE_URL}${material.imageUrl}` : ''
  );
  const [existingFileRemoved, setExistingFileRemoved] = useState(false);

  const [formData, setFormData] = useState({
    domainId: material?.domainId?.toString() || '0',
    courseId: material?.courseId?.toString() || '0',
    fileName: material?.fileName || '',
    description: material?.description || '',
    fileType: material?.fileType || 'PDF',
    highlight: material?.highlight || '',
    isActive: material?.isActive ?? true,
  });

  const fileTypes = [
    { value: 'PDF', label: 'PDF Document' },
    { value: 'DOCX', label: 'DOCX (Word)' },
    { value: 'VIDEO', label: 'Video File' },
    { value: 'PRESENTATION', label: 'Presentation' },
    { value: 'EBOOK', label: 'E-Book' },
  ] as const;

  // Helpers
  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText className="h-5 w-5 text-red-500" />;
      case 'DOCX': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'VIDEO': return <Video className="h-5 w-5 text-purple-500" />;
      case 'PRESENTATION': return <Presentation className="h-5 w-5 text-orange-500" />;
      case 'EBOOK': return <BookOpen className="h-5 w-5 text-green-500" />;
      default: return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAcceptedFiles = (type: string) => {
    switch (type) {
      case 'PDF': return '.pdf';
      case 'DOCX': return '.docx,.doc';
      case 'VIDEO': return '.mp4,.webm,.avi,.mov';
      case 'PRESENTATION': return '.ppt,.pptx,.key';
      case 'EBOOK': return '.epub,.mobi';
      default: return ".pdf,.docx,.doc,.ppt,.pptx,.mp4,.webm,.avi,.mov,.key,.epub,.mobi";
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 100 * 1024 * 1024) return alert('File size > 100MB');
      setFile(selectedFile);
      setExistingFileRemoved(true);
      if (!formData.fileName) {
        setFormData(prev => ({ ...prev, fileName: selectedFile.name.replace(/\.[^/.]+$/, "") }));
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files?.[0];
    if (selectedImage) {
      setImageFile(selectedImage);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(selectedImage);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fileName.trim()) return alert('Enter file name');
    if (!file && !isEditMode) return alert('Select a file');

    setIsSubmitting(true);
    try {
      const data = new FormData();
      // Append text fields
      Object.entries(formData).forEach(([key, value]) => data.append(key, value.toString()));
      
      // Append file fields (Matches Backend: uploadStudyMaterial.fields)
      if (file) data.append('file', file);
      if (imageFile) data.append('image', imageFile);

      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Basic Info */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Domain ID *</label>
              <input type="number" name="domainId" value={formData.domainId} onChange={handleInputChange} required
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/10 outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Course ID *</label>
              <input type="number" name="courseId" value={formData.courseId} onChange={handleInputChange} required
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/10 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Display Name *</label>
            <input type="text" name="fileName" value={formData.fileName} onChange={handleInputChange} required
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/10 outline-none" />
          </div>

          <div className="relative" ref={dropdownRef}>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Type *</label>
            <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold">
              <div className="flex items-center gap-2">
                {getFileTypeIcon(formData.fileType)}
                {fileTypes.find(t => t.value === formData.fileType)?.label}
              </div>
              <ChevronDown size={16} />
            </button>
            {isDropdownOpen && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-slate-100 rounded-xl shadow-xl p-1">
                {fileTypes.map((type) => (
                  <button key={type.value} type="button"
                    onClick={() => { setFormData(prev => ({ ...prev, fileType: type.value })); setIsDropdownOpen(false); }}
                    className="flex w-full items-center gap-3 px-3 py-2 text-sm hover:bg-slate-50 rounded-lg">
                    {getFileTypeIcon(type.value)} {type.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail Section */}
        <div className="space-y-4">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Thumbnail / Cover</label>
          <div className="relative h-[155px] rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden group">
            {imagePreview ? (
              <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <ImageIcon size={24} />
                <span className="text-[10px] font-bold mt-2">UPLOAD COVER</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Highlight Tag</label>
            <input type="text" name="highlight" value={formData.highlight} onChange={handleInputChange} placeholder="e.g. New"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none" />
          </div>
        </div>
      </div>

      {/* Main Asset Upload */}
      <div className="space-y-2">
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Resource File *</label>
        <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-6 transition-all hover:bg-slate-50">
          {file ? (
            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-indigo-100 shadow-sm">
              <div className="flex items-center gap-3">
                {getFileTypeIcon(formData.fileType)}
                <span className="text-xs font-bold truncate max-w-[200px]">{file.name}</span>
              </div>
              <button type="button" onClick={() => { setFile(null); setExistingFileRemoved(false); }} className="text-slate-400 hover:text-red-500"><X size={18} /></button>
            </div>
          ) : (isEditMode && material && !existingFileRemoved) ? (
            <div className="flex items-center justify-between bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
              <span className="text-xs font-bold text-indigo-600">Current: {material.fileName}</span>
              <button type="button" onClick={() => setExistingFileRemoved(true)} className="text-[10px] font-black text-red-500 uppercase">Replace</button>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="mx-auto text-slate-300 mb-2" size={24} />
              <p className="text-[11px] font-bold text-slate-500">Drop your {formData.fileType} here</p>
            </div>
          )}
          <input type="file" accept={getAcceptedFiles(formData.fileType)} onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <button type="button" onClick={onCancel} className="px-6 py-2 text-xs font-black uppercase text-slate-400">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="px-8 py-2 bg-slate-900 text-white text-xs font-black uppercase rounded-xl hover:bg-indigo-600 disabled:opacity-50">
          {isSubmitting ? 'Uploading...' : isEditMode ? 'Update' : 'Upload'}
        </button>
      </div>
    </form>
  );
};

export default StudyMaterialForm;