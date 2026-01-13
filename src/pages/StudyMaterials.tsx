import React, { useEffect, useState, useRef, useMemo } from 'react';
import { 
  Plus, Search, Edit2, Trash2, RefreshCw, ToggleLeft, ToggleRight, 
  FileText, Video, File, Presentation, Layers, BookOpen,
  CheckCircle, Filter, ChevronDown, Image as ImageIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { StudyMaterial } from '../types/index';
import { studyMaterialService } from '../services/studyMaterial.service';
import { IMAGE_URL } from '../utils/storage';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import StudyMaterialForm from '../components/forms/StudyMaterialForm';

// --- CUSTOM SELECT COMPONENT ---
interface CustomSelectProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
  accentColor: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ label, icon, value, options, onChange, accentColor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find(opt => opt.value === value)?.label || 'All';

  return (
    <div className="relative" ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-slate-50 hover:bg-white hover:shadow-md hover:shadow-slate-200/50 px-4 py-2 rounded-2xl border border-transparent hover:border-slate-200 transition-all cursor-pointer group min-w-[160px]"
      >
        <div className={`p-2 rounded-xl transition-transform group-hover:scale-110 ${accentColor}`}>
          {icon}
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">{label}</span>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-800 truncate">{selectedLabel}</span>
            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-full min-w-[200px] bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/60 z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`px-4 py-2.5 text-xs font-semibold cursor-pointer transition-colors ${
                  value === opt.value 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-500'
                }`}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
const StudyMaterials: React.FC = () => {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);
  
  const [filterDomain, setFilterDomain] = useState<string>('all');
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => { fetchMaterials(); }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const data = await studyMaterialService.getAll();
      setMaterials(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast.error('Failed to fetch study materials');
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (material: StudyMaterial) => {
    try {
      const newStatus = !material.isActive;
      // Optimistic Update
      setMaterials(prev => prev.map(m => m.id === material.id ? { ...m, isActive: newStatus } : m));
      
      const formData = new FormData();
      formData.append('isActive', String(newStatus));
      await studyMaterialService.update(material.id, formData);
      toast.success(`Material is now ${newStatus ? 'Active' : 'Inactive'}`);
    } catch (error: any) {
      toast.error('Failed to update status');
      fetchMaterials(); 
    }
  };

  const handleDelete = async (material: StudyMaterial) => {
    if (window.confirm(`Are you sure you want to delete "${material.fileName}"?`)) {
      try {
        await studyMaterialService.delete(material.id);
        toast.success('Material deleted successfully');
        fetchMaterials();
      } catch (error: any) {
        toast.error('Failed to delete material');
      }
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      if (selectedMaterial) {
        await studyMaterialService.update(selectedMaterial.id, formData);
        toast.success('Material updated successfully');
      } else {
        await studyMaterialService.create(formData);
        toast.success('New material uploaded successfully');
      }
      setIsModalOpen(false);
      fetchMaterials();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save material');
    }
  };

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText className="h-5 w-5 text-red-500" />;
      case 'DOCX': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'VIDEO': return <Video className="h-5 w-5 text-purple-500" />;
      case 'PRESENTATION': return <Presentation className="h-5 w-5 text-orange-500" />;
      default: return <File className="h-5 w-5 text-gray-400" />;
    }
  };

  // Memoized filtering for performance
  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      const matchesSearch = (m.fileName || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || m.fileType === filterType;
      const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? m.isActive : !m.isActive);
      const matchesDomain = filterDomain === 'all' || String(m.domainId) === filterDomain;
      const matchesCourse = filterCourse === 'all' || String(m.courseId) === filterCourse;
      return matchesSearch && matchesType && matchesStatus && matchesDomain && matchesCourse;
    });
  }, [materials, searchTerm, filterType, statusFilter, filterDomain, filterCourse]);

  const uniqueDomains = useMemo(() => Array.from(new Set(materials.map(m => m.domainId))).filter(Boolean).sort(), [materials]);
  const uniqueCourses = useMemo(() => Array.from(new Set(materials.map(m => m.courseId))).filter(Boolean).sort(), [materials]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto bg-gray-50 min-h-screen font-sans">
      {/* Header Section */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase">Study Materials</h1>
          <p className="text-gray-500 text-sm font-medium">Manage and distribute educational assets across domains</p>
        </div>
        <Button 
          onClick={() => { setSelectedMaterial(null); setIsModalOpen(true); }} 
          className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8 rounded-2xl shadow-lg shadow-indigo-100 transition-all text-white font-bold"
        >
          <Plus size={20} className="mr-2" /> Upload Material
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-2 rounded-[2rem] border border-gray-100 shadow-sm mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[280px] group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search assets by file name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-[1.5rem] focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm font-semibold text-slate-700 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="hidden xl:block w-px h-10 bg-slate-100 mx-2" />

          <CustomSelect 
            label="Domain"
            icon={<Layers size={14} />}
            value={filterDomain}
            onChange={setFilterDomain}
            accentColor="bg-indigo-100 text-indigo-600"
            options={[
              { label: 'All Sectors', value: 'all' },
              ...uniqueDomains.map(id => ({ label: `Domain ${id}`, value: String(id) }))
            ]}
          />

          <CustomSelect 
            label="Course"
            icon={<BookOpen size={14} />}
            value={filterCourse}
            onChange={setFilterCourse}
            accentColor="bg-blue-100 text-blue-600"
            options={[
              { label: 'All Modules', value: 'all' },
              ...uniqueCourses.map(id => ({ label: `Course ${id}`, value: String(id) }))
            ]}
          />

          <CustomSelect 
            label="Format"
            icon={<Filter size={14} />}
            value={filterType}
            onChange={setFilterType}
            accentColor="bg-purple-100 text-purple-600"
            options={[
              { label: 'All Types', value: 'all' },
              { label: 'PDF Docs', value: 'PDF' },
              { label: 'Word Files', value: 'DOCX' },
              { label: 'HD Video', value: 'VIDEO' },
              { label: 'Presentations', value: 'PRESENTATION' }
            ]}
          />

          <CustomSelect 
            label="Visibility"
            icon={<CheckCircle size={14} />}
            value={statusFilter}
            onChange={setStatusFilter}
            accentColor="bg-emerald-100 text-emerald-600"
            options={[
              { label: 'Everything', value: 'all' },
              { label: 'Active Only', value: 'active' },
              { label: 'Archived', value: 'inactive' }
            ]}
          />

          <button 
            onClick={fetchMaterials}
            className="ml-auto w-12 h-12 flex items-center justify-center bg-slate-900 text-white rounded-2xl hover:bg-indigo-600 transition-all shadow-lg"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Asset Table */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-slate-400">
            <RefreshCw className="animate-spin text-indigo-600" size={40} />
            <p className="font-bold uppercase text-[10px] tracking-widest">Synchronizing Library...</p>
          </div>
        ) : filteredMaterials.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Educational Asset</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Linking (D/C)</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Tag</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredMaterials.map((material) => (
                  <tr key={material.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-gray-100 group-hover:border-indigo-200 transition-all flex-shrink-0">
                          {material.imageUrl ? (
                            <img src={`${IMAGE_URL}${material.imageUrl}`} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <ImageIcon size={16} />
                            </div>
                          )}
                          <div className="absolute top-0 left-0 p-1 bg-white/80 backdrop-blur-sm rounded-br-lg">
                            {getFileTypeIcon(material.fileType)}
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm leading-tight">{material.fileName}</div>
                          <div className="text-[10px] text-gray-400 font-medium uppercase mt-1 flex items-center gap-2">
                             <span>{material.fileType}</span>
                             <span className="w-1 h-1 bg-gray-300 rounded-full" />
                             <span>UID: {material.id}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex gap-2 font-mono font-bold text-[10px]">
                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg">D:{material.domainId}</span>
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg">C:{material.courseId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold border border-slate-200 uppercase tracking-tighter">
                        {material.highlight || 'No Tag'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <button 
                        onClick={() => handleToggleStatus(material)} 
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[10px] font-black transition-all border ${
                          material.isActive 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                            : 'bg-gray-50 text-gray-400 border-gray-200'
                        }`}
                      >
                        {material.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                        {material.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </button>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => { setSelectedMaterial(material); setIsModalOpen(true); }} 
                          className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-600 bg-white hover:bg-indigo-50 rounded-xl transition-all border border-gray-100 hover:border-indigo-100"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(material)} 
                          className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-rose-600 bg-white hover:bg-rose-50 rounded-xl transition-all border border-gray-100 hover:border-rose-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="text-gray-300" size={32} />
            </div>
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">No matching results found</p>
            <button 
              onClick={() => { setFilterDomain('all'); setFilterCourse('all'); setFilterType('all'); setStatusFilter('all'); setSearchTerm(''); }} 
              className="text-indigo-600 text-xs font-bold mt-2 hover:underline"
            >
              Clear all active filters
            </button>
          </div>
        )}
      </div>

      {/* Upload/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedMaterial ? 'Modify Asset' : 'Add Educational Asset'}
      >
        <StudyMaterialForm
          material={selectedMaterial}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default StudyMaterials;