import React, { useEffect, useState } from 'react';
import { youtubeShortService } from '../services/youtubeShort.service';
import type { YouTubeShort } from '../types/index';
import { YouTubeShortForm } from '../components/forms/YouTubeShortForm';
import { IMAGE_URL } from '../utils/storage';
import { Pencil, Trash2, Plus, LayoutGrid, CheckCircle2, AlertCircle, RotateCcw, Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "indigo" | "emerald" | "rose";
}

// Reusable Stat Card Component
const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => {
  const colorMap = { indigo: "bg-indigo-600", emerald: "bg-emerald-500", rose: "bg-rose-500" };
  const bgMap = { indigo: "bg-indigo-50", emerald: "bg-emerald-50", rose: "bg-rose-50" };
  
  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex items-center relative overflow-hidden group">
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${colorMap[color]}`} />
      <div className={`p-4 rounded-2xl ${bgMap[color]} mr-6`}>{icon}</div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-4xl font-black text-[#0f172a] mt-1">{value}</p>
      </div>
    </div>
  );
};

 const YouTubeShortsPage = () => {
  const [shorts, setShorts] = useState<YouTubeShort[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<YouTubeShort | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadAll = async () => {
    try {
      const data = await youtubeShortService.getAll();
      setShorts(data);
    } catch (err) {
      toast.error("Database connection failed");
    }
  };

  useEffect(() => { loadAll(); }, []);

  // Handler for Inline Status Toggle from Table
  const handleToggleStatus = async (item: YouTubeShort) => {
    try {
      const data = new FormData();
      data.append('name', item.name);
      data.append('batch', item.batch);
      data.append('videoUrl', item.videoUrl);
      data.append('isActive', String(!item.isActive)); // Flip status
      data.append('domainId', String(item.domainId));
      data.append('courseId', String(item.courseId));

      await youtubeShortService.update(item.id, data);
      toast.success(`Asset is now ${!item.isActive ? 'LIVE' : 'HIDDEN'}`);
      loadAll();
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      if (editingItem) {
        await youtubeShortService.update(editingItem.id, formData);
        toast.success("Asset Updated Successfully");
      } else {
        await youtubeShortService.create(formData);
        toast.success("New Asset Registered");
      }
      setIsFormOpen(false);
      loadAll();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error saving data");
    } finally {
      setLoading(false);
    }
  };

  const filteredShorts = shorts.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.batch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 bg-[#f8faff] min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-[#0f172a] uppercase tracking-tight">YouTube Shorts</h1>
          <button onClick={loadAll} className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase mt-1 hover:text-indigo-600">
            <RotateCcw size={12} /> Sync Database
          </button>
        </div>
        <button 
          onClick={() => { setEditingItem(null); setIsFormOpen(true); }}
          className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-8 py-4 rounded-2xl flex items-center gap-2 font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all active:scale-95"
        >
          <Plus size={18} /> Create Short
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <StatCard icon={<LayoutGrid size={24} className="text-indigo-600" />} label="Total Records" value={shorts.length} color="indigo" />
        <StatCard icon={<CheckCircle2 size={24} className="text-emerald-500" />} label="Live Assets" value={shorts.filter(s => s.isActive).length} color="emerald" />
        <StatCard icon={<AlertCircle size={24} className="text-rose-500" />} label="Hidden" value={shorts.filter(s => !s.isActive).length} color="rose" />
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 mb-8 flex items-center px-6">
        <Search className="text-slate-300 mr-3" size={20} />
        <input 
          type="text" 
          placeholder="Filter by Student Name or Batch..." 
          className="w-full bg-transparent outline-none text-slate-600 font-bold text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#fafbff] border-b border-slate-50">
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
              <th className="px-8 py-6">Preview</th>
              <th className="px-8 py-6">Student Identity</th>
              <th className="px-8 py-6 text-center">Config ID</th>
              <th className="px-8 py-6 text-center">Status</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredShorts.map((item) => (
              <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-5">
                  <div className="w-20 h-12 rounded-xl overflow-hidden shadow-sm bg-slate-100">
                    <img src={`${IMAGE_URL}${item.imageUrl}`} className="w-full h-full object-cover" alt="" />
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="text-[10px] font-black text-indigo-600 uppercase block mb-0.5 leading-none">{item.batch}</span>
                  <span className="text-lg font-extrabold text-[#1e293b]">{item.name}</span>
                </td>
                <td className="px-8 py-5 text-center">
                  <div className="flex flex-col gap-1 items-center">
                    <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-2 py-0.5 rounded uppercase">D: {item.domainId}</span>
                    <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-2 py-0.5 rounded uppercase">C: {item.courseId}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-center">
                  <button
                    onClick={() => handleToggleStatus(item)}
                    className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider mx-auto border transition-all hover:scale-105 active:scale-95 ${
                      item.isActive 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${item.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                    {item.isActive ? 'Live' : 'Hidden'}
                  </button>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => { setEditingItem(item); setIsFormOpen(true); }}
                      className="p-3 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={async () => { if(confirm("Permanently delete this short?")) { await youtubeShortService.delete(item.id); loadAll(); }}}
                      className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredShorts.length === 0 && (
          <div className="p-20 text-center text-slate-300 font-bold uppercase tracking-widest">No Records Found</div>
        )}
      </div>

      {/* Modal Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl animate-in zoom-in duration-200">
            <YouTubeShortForm 
              initialData={editingItem} 
              onSubmit={handleFormSubmit} 
              onCancel={() => setIsFormOpen(false)} 
              loading={loading} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeShortsPage