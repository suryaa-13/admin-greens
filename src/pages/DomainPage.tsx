import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Edit2, Trash2, RotateCw, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Layers, Youtube } from 'lucide-react';
import toast from 'react-hot-toast';
import { domainService } from '../services/domain.service';
import { IMAGE_URL } from '../utils/storage';
import Modal from '../components/ui/Modal';
import DomainForm from '../components/forms/DomainForm';

const DomainPage: React.FC = () => {
  const [domains, setDomains] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDomains = useCallback(async () => {
    try {
      setLoading(true);
      const data = await domainService.getAll();
      setDomains(Array.isArray(data) ? data : []);
    } catch (e) { 
      toast.error("Database connection failed"); 
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDomains(); }, [fetchDomains]);

  // Statistics Calculation
  const total = domains.length;
  const active = domains.filter(d => d.isActive).length;
  const inactive = total - active;

  const handleToggle = async (d: any) => {
    try {
      const formData = new FormData();
      formData.append('isActive', (!d.isActive).toString());
      // Important: your backend update controller might expect the videoUrl and other fields
      // but if it's set up to handle partial updates, this works:
      await domainService.update(d.id, formData);
      fetchDomains();
      toast.success(d.isActive ? "Asset Hidden" : "Asset Published");
    } catch (error) {
      toast.error("Status synchronization failed");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("⚠️ PERMANENT DELETE ⚠️\nThis will remove the database record and the thumbnail file. Proceed?")) return;
    try {
      await domainService.delete(id);
      toast.success("Project removed permanently");
      fetchDomains();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const filtered = domains.filter(d => 
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.domainId.toString().includes(searchTerm) ||
    d.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-[#F9FAFB] min-h-screen font-sans">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h1 className="text-3xl font-black text-[#0F172A] uppercase tracking-tight">Domain Assets</h1>
          <button onClick={fetchDomains} className={`flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase mt-1 hover:text-indigo-600 transition-colors ${loading ? 'animate-pulse' : ''}`}>
            <RotateCw size={12} className={loading ? 'animate-spin' : ''}/> {loading ? 'Syncing...' : 'Reload Database'}
          </button>
        </div>
        <button onClick={() => { setSelectedDomain(null); setIsModalOpen(true); }} className="bg-[#4F46E5] text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95">
          <Plus size={20} strokeWidth={3}/> Create Project
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 flex items-center gap-6 shadow-sm">
          <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600"><Layers size={32}/></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Projects</p>
            <h2 className="text-4xl font-black text-slate-900">{total}</h2>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 flex items-center gap-6 shadow-sm border-l-8 border-l-emerald-500">
          <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600"><CheckCircle size={32}/></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-emerald-600">Active Live</p>
            <h2 className="text-4xl font-black text-slate-900">{active}</h2>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 flex items-center gap-6 shadow-sm border-l-8 border-l-rose-500">
          <div className="p-4 bg-rose-50 rounded-2xl text-rose-600"><AlertCircle size={32}/></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-rose-600">Inactive/Hidden</p>
            <h2 className="text-4xl font-black text-slate-900">{inactive}</h2>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative mb-8">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
        <input 
          type="text" 
          placeholder="Filter by Title, Tag, or Domain ID..." 
          className="w-full bg-white border-2 border-slate-100 rounded-[1.5rem] py-5 px-16 font-bold text-slate-600 outline-none focus:border-indigo-500 transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-[2.5rem] border-2 border-slate-50 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="px-10 py-6">Preview</th>
                <th className="px-6 py-6">Project Identity</th>
                <th className="px-6 py-6 text-center">Video</th>
                <th className="px-6 py-6 text-center">ID Config</th>
                <th className="px-6 py-6 text-center">Status</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="w-20 h-14 rounded-2xl overflow-hidden border-2 border-slate-100 bg-slate-50 shadow-inner">
                      {/* ✅ Updated to d.thumbnailUrl to match backend model */}
                      <img src={`${IMAGE_URL}${d.thumbnailUrl}`} className="w-full h-full object-cover" alt="" />
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="text-[10px] font-black uppercase text-indigo-500 tracking-tighter mb-1">{d.domain}</div>
                    <div className="font-black text-slate-800 text-lg leading-tight">{d.title}</div>
                    <div className="text-[11px] font-bold text-slate-400 mt-1 line-clamp-1">{d.subtitle}</div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    {/* ✅ Check for YouTube Link */}
                    {d.videoUrl ? (
                      <a href={d.videoUrl} target="_blank" rel="noreferrer" className="inline-flex p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all">
                        <Youtube size={18}/>
                      </a>
                    ) : (
                      <span className="text-slate-200">—</span>
                    )}
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-black">DID: {d.domainId}</span>
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-black">CID: {d.courseId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <button 
                      onClick={() => handleToggle(d)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all shadow-sm ${d.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${d.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                      {d.isActive ? 'Live' : 'Hidden'}
                    </button>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setSelectedDomain(d); setIsModalOpen(true); }} className="p-3 bg-white border border-slate-100 text-indigo-500 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                        <Edit2 size={18}/>
                      </button>
                      <button onClick={() => handleDelete(d.id)} className="p-3 bg-white border border-slate-100 text-rose-500 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="bg-slate-50/50 px-10 py-6 flex justify-between items-center border-t border-slate-100">
           <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Showing {filtered.length} Projects</p>
           <div className="flex items-center gap-4">
              <button className="p-2 text-slate-300 cursor-not-allowed"><ChevronLeft size={20}/></button>
              <span className="font-black text-[12px] text-slate-800 bg-white px-4 py-1 rounded-lg border border-slate-200">1 / 1</span>
              <button className="p-2 text-slate-300 cursor-not-allowed"><ChevronRight size={20}/></button>
           </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedDomain ? "Modify Asset" : "Register Domain"}>
         <DomainForm 
            domain={selectedDomain} 
            onSubmit={async (fd) => {
              try {
                selectedDomain 
                  ? await domainService.update(selectedDomain.id, fd) 
                  : await domainService.create(fd);
                
                toast.success(selectedDomain ? "Domain details updated" : "New Domain Registered");
                setIsModalOpen(false); 
                fetchDomains();
              } catch (e: any) {
                toast.error(e.response?.data?.message || "Sync operation failed");
              }
            }} 
            onCancel={() => setIsModalOpen(false)} 
         />
      </Modal>
    </div>
  );
};

export default DomainPage;