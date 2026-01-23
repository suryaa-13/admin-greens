import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  RefreshCw, 
  Loader2, 
  Image as ImageIcon, 
  Edit2, 
  Trash2, 
  Power, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { aboutService } from '../services/about.service';
import type { About } from '../types/index';
import { IMAGE_URL } from '../utils/storage';
import Modal from '../components/ui/Modal';
import AboutForm from '../components/forms/AboutForm';
import { toast } from 'react-hot-toast';

const AboutPage: React.FC = () => {
  const [abouts, setAbouts] = useState<About[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAbout, setSelectedAbout] = useState<About | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchAbouts();
      hasFetched.current = true;
    }
  }, []);

  const fetchAbouts = async () => {
    try {
      setLoading(true);
      const data = await aboutService.getAll();
      setAbouts(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast.error('Synchronization failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAbouts();
    setIsRefreshing(false);
  };

  const handleCreate = () => {
    setSelectedAbout(null);
    setIsModalOpen(true);
  };

  const handleEdit = (about: About) => {
    setSelectedAbout(about);
    setIsModalOpen(true);
  };

  // --- RELOAD-FREE STATUS TOGGLE ---
  const handleToggleStatus = async (about: About) => {
    const originalStatus = about.isActive;
    const newStatus = !originalStatus;

    // 1. Optimistic Update: Change UI immediately
    setAbouts(prev => prev.map(item => 
      item.id === about.id ? { ...item, isActive: newStatus } : item
    ));

    try {
      const formData = new FormData();
      formData.append('isActive', newStatus.toString());
      formData.append('existingMainImages', JSON.stringify(about.mainImages || []));
      formData.append('existingSmallImages', JSON.stringify(about.smallImages || []));
      
      await aboutService.update(about.id, formData);
      toast.success(`Section ${newStatus ? 'Activated' : 'Hidden'}`);
    } catch (error: any) {
      // 2. Rollback if server fails
      setAbouts(prev => prev.map(item => 
        item.id === about.id ? { ...item, isActive: originalStatus } : item
      ));
      toast.error('Status update failed');
    }
  };

  // --- RELOAD-FREE DELETE ---
  const handleDelete = async (about: About) => {
    if (window.confirm(`Permanently delete "${about.label}"?`)) {
      try {
        await aboutService.delete(about.id);
        // Remove from local state immediately
        setAbouts(prev => prev.filter(item => item.id !== about.id));
        toast.success('Purged successfully');
      } catch (error: any) {
        toast.error('Delete failed');
      }
    }
  };

  // --- RELOAD-FREE FORM SUBMISSION ---
const handleSubmit = async (formData: FormData) => {
  try {
    if (selectedAbout) {
      // 1. Get the response (which is an object containing 'about')
      const response = await aboutService.update(selectedAbout.id, formData);
      
      // 2. Extract the actual record from the response
      // We use 'any' temporarily or a custom interface to avoid the property error
      const updatedData = (response as any).about || response;

      setAbouts(prev => prev.map(item => 
        item.id === selectedAbout.id ? { ...item, ...updatedData } : item
      ));
      
      toast.success('Architecture Updated');
    } else {
      const response = await aboutService.create(formData);
      const newData = (response as any).about || response;
      
      setAbouts(prev => [newData, ...prev]);
      toast.success('New Section Initialized');
    }
    setIsModalOpen(false);
  } catch (error: any) {
    toast.error('Save failed');
  }
};

  // --- Filter & Pagination Logic ---
  const filteredAbouts = abouts.filter((about) => {
    const search = searchTerm.toLowerCase();
    return (about.label?.toLowerCase() || '').includes(search) ||
           (about.heading?.toLowerCase() || '').includes(search);
  });

  const totalPages = Math.max(1, Math.ceil(filteredAbouts.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAbouts.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Stats Calculation
  const totalCount = abouts.length;
  const activeCount = abouts.filter(d => d.isActive).length;
  const inactiveCount = totalCount - activeCount;

  const labelClasses = "text-[10px] font-black uppercase tracking-widest text-gray-400";

  return (
    <div className="p-2 md:p-8 md:ml-[250px] lg:ml-0 transition-all duration-300">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">About Management</h1>
          <div className="flex flex-wrap gap-2 mt-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 rounded-full shadow-lg">
              <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Total</span>
              <b className="text-white text-xs leading-none">{totalCount}</b>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
              <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Active</span>
              <b className="text-emerald-700 text-xs leading-none">{activeCount}</b>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-100 rounded-full">
              <span className="text-[10px] font-black uppercase text-rose-500 tracking-wider">Inactive</span>
              <b className="text-rose-700 text-xs leading-none">{inactiveCount}</b>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={handleRefresh} className="p-3 border border-gray-200 rounded-xl hover:bg-white hover:shadow-md transition-all group">
            <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
          <button onClick={handleCreate} className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-xl transition-transform active:scale-95">
            <Plus size={18} strokeWidth={3}/> Add New
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-8 relative max-w-md">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Filter by label or heading..."
          className="w-full pl-14 pr-6 py-4 rounded-[20px] bg-white shadow-sm focus:shadow-md transition-all outline-none text-sm font-semibold"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-[32px] border border-gray-50 shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-black" />
            <span className="mt-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Syncing Assets...</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className={`px-8 py-6 ${labelClasses}`}>S.No</th>
                    <th className={`px-8 py-6 ${labelClasses}`}>Identity</th>
                    <th className={`px-8 py-6 ${labelClasses}`}>Logic</th>
                    <th className={`px-8 py-6 ${labelClasses}`}>Visibility</th>
                    <th className={`px-8 py-6 ${labelClasses} text-right`}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {currentItems.map((about, idx) => (
                    <tr key={about.id} className="group hover:bg-gray-50/80 transition-colors">
                      <td className="px-8 py-6 font-bold text-black">{indexOfFirstItem + idx + 1}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 rounded-[18px] overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0 shadow-inner">
                            {about.mainImages?.[0] ? (
                              <img src={`${IMAGE_URL}${about.mainImages[0]}`} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-200"><ImageIcon size={24} /></div>
                            )}
                          </div>
                          <div>
                            <div className="text-[15px] font-black text-[#0f172a] mb-0.5">{about.label}</div>
                            <div className="text-[11px] font-bold text-gray-400 line-clamp-1 uppercase tracking-tight">{about.heading}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 w-fit">DID: {about.domainId}</span>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-50 text-amber-600 w-fit">CID: {about.courseId}</span>
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        <div className={`flex items-center gap-2 w-fit px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.15em] ${
                          about.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${about.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'}`} />
                          {about.isActive ? 'Active' : 'Hidden'}
                        </div>
                      </td>

                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <button onClick={() => handleEdit(about)} className="p-3 rounded-[14px] bg-white border border-gray-100 text-gray-400 hover:text-black hover:shadow-md transition-all">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => handleToggleStatus(about)} className="p-3 rounded-[14px] bg-white border border-gray-100 text-gray-400 hover:text-amber-600 hover:shadow-md transition-all">
                            <Power size={18} />
                          </button>
                          <button onClick={() => handleDelete(about)} className="p-3 rounded-[14px] bg-white border border-gray-100 text-gray-400 hover:text-rose-600 hover:shadow-md transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION FOOTER */}
            <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredAbouts.length)} of {filteredAbouts.length}
              </span>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl bg-white border border-gray-200 disabled:opacity-30"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`h-10 w-10 rounded-xl text-[12px] font-black transition-all ${
                        currentPage === i + 1 ? 'bg-black text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl bg-white border border-gray-200 disabled:opacity-30"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedAbout ? `Update Section: ${selectedAbout.label}` : 'New Content Architecture'}
        size="xl"
      >
        <AboutForm 
          about={selectedAbout} 
          onSubmit={handleSubmit} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
};

export default AboutPage;