

import React, { useEffect, useState, useCallback } from 'react';
import { 
  Plus, Edit2, Trash2, RefreshCw,
  ChevronLeft, ChevronRight, Power
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { Hero } from '../types/index';
import { heroService } from '../services/hero.service';
import Modal from '../components/ui/Modal';
import HeroForm from '../components/forms/HeroForm';
import { IMAGE_URL } from '../utils/storage';

const HeroPage: React.FC = () => {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Updated to 5 as requested

  const fetchHeroes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await heroService.getAll();
      setHeroes(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast.error('Failed to fetch hero sections');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchHeroes(); }, [fetchHeroes]);

  // --- PAGINATION CALCULATIONS ---
  const totalPages = Math.ceil(heroes.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = heroes.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // --- HANDLERS ---
const handleToggleStatus = async (hero: Hero) => {
  try {
    const formData = new FormData();
    formData.append('isActive', (!hero.isActive).toString());
    // Sending back existing images as an extra safety layer
    formData.append('existingImages', JSON.stringify(hero.images));
    
    await heroService.update(hero.id, formData);
    toast.success('Status updated');
    fetchHeroes();
  } catch (error) {
    toast.error('Failed to update status');
  }
};

  const handleEdit = async (hero: Hero) => {
    try {
      const freshHero = await heroService.getById(hero.id);
      setSelectedHero(freshHero);
      setIsModalOpen(true);
    } catch (error) {
      toast.error('Failed to load hero details');
    }
  };
 const totalCount = heroes.length;
  const activeCount = heroes.filter(d => d.isActive).length;
  const inactiveCount = totalCount - activeCount;
  const handleDelete = async (hero: Hero) => {
    if (window.confirm(`PERMANENT DELETE: Are you sure you want to remove "${hero.title}"?`)) {
      try {
        await heroService.delete(hero.id);
        toast.success('Deleted permanently');
        fetchHeroes();
      } catch (error) {
        toast.error('Deletion failed');
      }
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      if (selectedHero) await heroService.update(selectedHero.id, formData);
      else await heroService.create(formData);
      setIsModalOpen(false);
      fetchHeroes();
      toast.success('Saved successfully');
    } catch (error) {
      toast.error('Save failed');
    }
  };

  return (
    <div className="p-2 md:p-8 md:ml-[250px] lg:ml-0 transition-all duration-300">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl uppercase font-black text-gray-900 tracking-tighter flex items-center gap-3">
           
            HERO  Management 
          </h1>
         <div className="flex flex-wrap gap-2 mt-3">
    {/* Total Stats */}
    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 rounded-full shadow-lg shadow-gray-200">
      <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
      <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Total</span>
      <b className="text-white text-xs leading-none">{totalCount}</b>
    </div>

    {/* Active Stats */}
    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
      <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Active</span>
      <div className="h-4 w-[1px] bg-emerald-200" />
      <b className="text-emerald-700 text-xs leading-none">{activeCount}</b>
    </div>

    {/* Inactive Stats */}
    <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-100 rounded-full">
      <span className="text-[10px] font-black uppercase text-rose-500 tracking-wider">Inactive</span>
      <div className="h-4 w-[1px] bg-rose-200" />
      <b className="text-rose-700 text-xs leading-none">{inactiveCount}</b>
    </div>
  </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={() => { setIsRefreshing(true); fetchHeroes().then(() => setIsRefreshing(false)); }} className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 shadow-sm transition-all group">
            <RefreshCw size={20} className={`${isRefreshing ? 'animate-spin' : ''} text-gray-400 group-hover:text-black`} />
          </button>
          <button onClick={() => { setSelectedHero(null); setIsModalOpen(true); }} className="bg-black text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-indigo-700 transition-all flex items-center gap-2">
            <Plus size={18} /> Add Hero
          </button>
        </div>
      </div>

      {/* 2. MASTER TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">S.No</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Identity</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Visuals</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Context</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6  text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentItems.map((hero, idx) => (
                <tr key={hero.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6 font-black text-black text-sm">
                    {indexOfFirstItem + idx + 1}
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black text-gray-900 text-base leading-tight">{hero.title}</p>
                    <p className="text-[11px] font-bold text-gray-400 uppercase mt-0.5">{hero.subtitle}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex -space-x-3">
                      {hero.images?.slice(0, 3).map((img, i) => (
                        <div key={i} className="h-12 w-12 rounded-2xl border-4 border-white bg-gray-100 overflow-hidden shadow-md group-hover:scale-110 transition-transform">
                          <img src={`${IMAGE_URL}${img}`} className="h-full w-full object-cover" alt="" />
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-600 w-fit">DID: {hero.domainId}</span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-amber-50 text-amber-600 w-fit">CID: {hero.courseId}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      hero.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <div className={`h-1.5 w-1.5 rounded-full ${hero.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
                      {hero.isActive ? 'Live' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                                      <div className="flex gap-2">
                                        <button onClick={() => handleToggleStatus(hero)} className="p-2 bg-gray-50 rounded-lg"><Power size={16}/></button>
                                        <button onClick={() => handleEdit(hero)} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Edit2 size={16}/></button>
                                        <button onClick={() => handleDelete(hero)} className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Trash2 size={16}/></button>
                                      </div>
                                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. MASTER PAGINATION (5 Items / 5 Next logic) */}
      {totalPages > 1 && (
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-5 bg-gray-900 p-2 sm:pl-8 rounded-[2rem] sm:rounded-full shadow-2xl">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
            Displaying <span className="text-white">{currentItems.length}</span> of {heroes.length} Units
          </span>
          
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1} 
              onClick={() => handlePageChange(currentPage - 1)} 
              className="p-3 rounded-2xl bg-white/5 text-white hover:bg-white/10 disabled:opacity-10 active:scale-90 transition-all"
            >
              <ChevronLeft size={18} strokeWidth={3} />
            </button>

            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`min-w-[40px] h-[40px] rounded-xl font-black text-[10px] transition-all duration-300 ${
                    currentPage === i + 1 
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/40' 
                    : 'bg-white/5 text-gray-500 hover:text-gray-200 hover:bg-white/10'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button 
              disabled={currentPage === totalPages} 
              onClick={() => handlePageChange(currentPage + 1)} 
              className="p-3 rounded-2xl bg-white/5 text-white hover:bg-white/10 disabled:opacity-10 active:scale-90 transition-all"
            >
              <ChevronRight size={18} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}

      {/* MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedHero(null); }} title={selectedHero ? 'Modify Configuration' : 'Initialize Hero Unit'} size="xl">
        <HeroForm hero={selectedHero} onSubmit={handleSubmit} onCancel={() => { setIsModalOpen(false); setSelectedHero(null); }} />
      </Modal>
    </div>
  );
};

export default HeroPage;