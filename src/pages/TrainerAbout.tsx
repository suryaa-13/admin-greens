import React, { useEffect, useState } from 'react';
import { 
   Search, Edit2, Trash2, RefreshCw, Grid, List, 
  Users, CheckCircle, Clock, Link as LinkIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { TrainerAbout } from '../types/index';
import { trainerAboutService } from '../services/trainerAbout.service';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import TrainerAboutForm from '../components/forms/TrainerAboutForm';
import { IMAGE_URL } from '../utils/storage';

const TrainerAboutPage: React.FC = () => {
  const [trainerAbouts, setTrainerAbouts] = useState<TrainerAbout[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrainerAbout, setSelectedTrainerAbout] = useState<TrainerAbout | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // --- STATS CALCULATION ---
  const totalTrainers = trainerAbouts.length;
  const activeTrainers = trainerAbouts.filter(t => t.isActive).length;
  const inactiveTrainers = totalTrainers - activeTrainers;

  useEffect(() => { fetchTrainerAbouts(); }, []);

  const fetchTrainerAbouts = async () => {
    try {
      setLoading(true);
      const data = await trainerAboutService.getAll();
      setTrainerAbouts(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast.error('Failed to fetch trainer sections');
    } finally { setLoading(false); }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchTrainerAbouts();
    setIsRefreshing(false);
  };
const handleToggleStatus = async (trainerAbout: TrainerAbout) => {
  // Optimistic loading state could be added here
  const newStatus = !trainerAbout.isActive;
  
  try {
    const formData = new FormData();
    // Convert boolean to '1' or '0' for backend compatibility
    formData.append('isActive', newStatus ? '1' : '0');

    // We only send the status change to the update service
    await trainerAboutService.update(trainerAbout.id, formData);
    
    toast.success(newStatus ? 'Profile Published' : 'Moved to Drafts');
    
    // Refresh the list to show updated counts and badges
    fetchTrainerAbouts();
  } catch (error: any) {
    console.error("Status update failed:", error);
    toast.error('Failed to update status');
  }
};
  const handleFormSubmit = async (formData: FormData) => {
    try {
      if (selectedTrainerAbout && selectedTrainerAbout.id) {
        await trainerAboutService.update(selectedTrainerAbout.id, formData);
        toast.success('Trainer profile updated');
      } else {
        await trainerAboutService.create(formData);
        toast.success('New trainer profile created');
      }
      setIsModalOpen(false);
      fetchTrainerAbouts();
    } catch (error: any) {
      toast.error('Failed to save trainer profile');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await trainerAboutService.delete(id);
      toast.success('Profile deleted');
      fetchTrainerAbouts();
    } catch (error) {
      toast.error('Deletion failed');
    }
  };

  const filteredTrainerAbouts = trainerAbouts.filter((about) =>
    about.heading.toLowerCase().includes(searchTerm.toLowerCase()) || 
    about.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-[1600px] mx-auto min-h-screen bg-slate-50/50">
      {/* Header Section */}
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Trainer Profiles</h1>
          <p className="text-slate-500 font-medium">Manage biographies and dynamic social links.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 p-1 rounded-xl flex shadow-sm">
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}><List size={18}/></button>
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}><Grid size={18}/></button>
          </div>
          <Button onClick={handleRefresh} variant="outline" className="bg-white border-slate-200" icon={<RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />}>Sync</Button>
          <Button onClick={() => { setSelectedTrainerAbout(null); setIsModalOpen(true); }} className="bg-slate-900 hover:bg-black text-white px-6 shadow-xl shadow-slate-200">Add Trainer</Button>
        </div>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Users size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Trainers</p>
            <p className="text-2xl font-black text-slate-900">{totalTrainers}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-2xl"><CheckCircle size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Profiles</p>
            <p className="text-2xl font-black text-green-600">{activeTrainers}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Clock size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Draft / Inactive</p>
            <p className="text-2xl font-black text-amber-600">{inactiveTrainers}</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Search by name or label..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm" 
        />
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {viewMode === 'list' ? (
           <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-xl">
  <table className="w-full text-left">
    <thead className="bg-slate-50 border-b border-slate-100">
      <tr>
        <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Trainer</th>
        <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Context (D/C)</th>
        <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Links</th>
        <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
        <th className="px-8 py-5 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-slate-50">
      {filteredTrainerAbouts.map((about) => (
        <tr key={about.id} className="group hover:bg-slate-50/80 transition-all">
          <td className="px-8 py-5">
            <div className="flex items-center gap-4">
              <img 
                src={about.mainImage ? `${IMAGE_URL}${about.mainImage}` : 'https://via.placeholder.com/150'} 
                className="h-12 w-12 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" 
                alt=""
              />
              <div>
                <div className="font-bold text-slate-900">{about.heading}</div>
                <div className="text-indigo-600 text-[10px] font-black uppercase tracking-wider">{about.label}</div>
              </div>
            </div>
          </td>
          {/* --- DOMAIN & COURSE ID COLUMN --- */}
          <td className="px-8 py-5">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-700">Domain: {about.domainId}</span>
              <span className="text-[10px] font-medium text-slate-400">Course: {about.courseId}</span>
            </div>
          </td>
          <td className="px-8 py-5">
            <div className="flex gap-2">
              {about.socialLinks?.map((link, idx) => (
                <div key={idx} className="relative group/link">
                  <LinkIcon size={16} className="text-slate-400 hover:text-indigo-600 cursor-pointer" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/link:block z-10">
                    <div className="bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap shadow-xl font-bold">
                      {link.platform}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </td>
          <td className="px-8 py-5">
            <button 
              onClick={() => handleToggleStatus(about)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${about.isActive ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${about.isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
              {about.isActive ? 'Public' : 'Draft'}
            </button>
          </td>
          <td className="px-8 py-5 text-right">
            <div className="flex justify-end gap-2">
              <button onClick={() => { setSelectedTrainerAbout(about); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-indigo-600"><Edit2 size={18}/></button>
              <button onClick={() => handleDelete(about.id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={18}/></button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
          ) : (
            /* Grid View (Simplified) */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {filteredTrainerAbouts.map((about) => (
    <div key={about.id} className="bg-white p-5 rounded-[2.5rem] border border-slate-200 hover:shadow-2xl transition-all group flex flex-col">
      <div className="relative mb-5">
        <img 
          src={about.mainImage ? `${IMAGE_URL}${about.mainImage}` : 'https://via.placeholder.com/400x300'} 
          className="w-full h-56 object-cover rounded-[2rem]" 
          alt="" 
        />
        <button 
          onClick={() => handleToggleStatus(about)}
          className={`absolute top-4 right-4 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-lg ${
            about.isActive ? 'bg-green-500/90 text-white' : 'bg-slate-900/80 text-slate-200'
          }`}
        >
          {about.isActive ? '● Live' : '○ Draft'}
        </button>
      </div>

      <div className="px-2">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-black text-xl text-slate-900 leading-tight">{about.heading}</h3>
          <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">
            UID: {about.id}
          </span>
        </div>
        <p className="text-indigo-600 text-[11px] font-black uppercase tracking-widest mb-4">{about.label}</p>
        
        {/* --- CONTEXT AREA (DOMAIN & COURSE) --- */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <p className="text-[8px] font-black text-slate-400 uppercase">Domain ID</p>
            <p className="text-xs font-bold text-slate-700">{about.domainId}</p>
          </div>
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <p className="text-[8px] font-black text-slate-400 uppercase">Course ID</p>
            <p className="text-xs font-bold text-slate-700">{about.courseId}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
           <p className="text-slate-500 text-sm line-clamp-1 font-medium">{about.description1}</p>
           <div className="flex gap-1 ml-2">
            {about.socialLinks?.slice(0, 3).map((link, idx) => (
              <div key={idx} className="relative group/tooltip">
                <LinkIcon size={14} className="text-slate-300 group-hover/tooltip:text-indigo-500" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block z-20">
                  <div className="bg-slate-900 text-white text-[9px] px-2 py-1 rounded shadow-xl">{link.platform}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto flex gap-3 pt-2">
        <button onClick={() => { setSelectedTrainerAbout(about); setIsModalOpen(true); }} className="flex-1 py-3 bg-indigo-50 text-indigo-600 rounded-2xl font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all">Edit</button>
        <button onClick={() => handleDelete(about.id)} className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button>
      </div>
    </div>
  ))}
</div>
          )}
        </div>
      )}

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedTrainerAbout ? 'Refine Profile' : 'New Entry'} size="xl">
          <TrainerAboutForm 
            trainerAbout={selectedTrainerAbout} 
            onSubmit={handleFormSubmit} 
            onCancel={() => setIsModalOpen(false)} 
          />
        </Modal>
      )}
    </div>
  );
};

export default TrainerAboutPage;  