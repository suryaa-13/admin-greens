import React, { useEffect, useState } from 'react';
import { 
  Plus, Search, Edit2, Trash2, RefreshCw, 
  Power, ChevronLeft, ChevronRight, Layers, 
  CheckCircle2, AlertCircle 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { projectService } from '../services/project.service';
import { IMAGE_URL } from '../utils/storage';
import Modal from '../components/ui/Modal';
import ProjectForm from '../components/forms/ProjectForm';
import type { Project } from '../types';

const ProjectPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Search & Pagination States
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getAll();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  // --- Logic Helpers ---

  // 1. Stats Calculation
  const totalCount = projects.length;
  const activeCount = projects.filter(p => p.isActive).length;
  const inactiveCount = totalCount - activeCount;

  // 2. Multi-column Search Logic (Title, Domain, or Course)
  const filteredProjects = projects.filter((p) => {
    const search = searchTerm.toLowerCase();
    return (
      p.title.toLowerCase().includes(search) ||
      p.domainId.toString().includes(search) ||
      p.courseId.toString().includes(search)
    );
  });

  // 3. Pagination Logic
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);

  const handleToggle = async (p: Project) => {
    try {
      const fd = new FormData();
      fd.append('isActive', (!p.isActive).toString());
      await projectService.update(p.id, fd);
      toast.success('Status updated');
      fetchProjects();
    } catch (err) { toast.error('Update failed'); }
  };

  return (
    <div className="p-4 md:p-8 bg-[#FBFBFE] min-h-screen font-sans">
      {/* Header & Reload */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Assets Manager</h1>
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mt-1">
            <button onClick={fetchProjects} className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> RELOAD DATABASE
            </button>
          </div>
        </div>
        <button 
          onClick={() => { setSelectedProject(null); setIsModalOpen(true); }} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-95"
        >
          <Plus size={18}/> CREATE PROJECT
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatTile label="Total Projects" value={totalCount} icon={<Layers size={20}/>} color="indigo" />
        <StatTile label="Active Live" value={activeCount} icon={<CheckCircle2 size={20}/>} color="emerald" />
        <StatTile label="Inactive/Hidden" value={inactiveCount} icon={<AlertCircle size={20}/>} color="rose" />
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Search by Title, Domain ID, or Course ID..." 
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
      </div>

      {/* Responsive Table */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                <th className="px-8 py-5 text-center">Preview</th>
                <th className="px-8 py-5">Project Information</th>
                <th className="hidden lg:table-cell px-6 py-5 text-center">Status</th> {/* New Status Column */}
<th className="px-6 py-5 text-center">Order ID</th>
          <th className="px-6 py-5 text-center">Course ID</th>
          <th className="px-6 py-5 text-center">Domain ID</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentData.map(p => (
                <tr key={p.id} className="group hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="relative h-12 w-16 rounded-xl overflow-hidden border border-slate-100 shadow-inner mx-auto">
                      <img src={`${IMAGE_URL}${p.imageUrl}`} className="h-full w-full object-cover" alt="" />
                      {/* Mobile Overlay Status Dot */}
                      {!p.isActive && <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center md:hidden"><Power size={12} className="text-white"/></div>}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="font-bold text-slate-900 text-base">{p.title}</div>
                      {/* Status Pulse for Active Projects */}
                      {p.isActive && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 mt-1">
                       <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${p.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                        {p.isActive ? 'Live on Site' : 'Hidden / Draft'}
                       </span>
                    </div>
                  </td>

                  {/* Desktop Status Badge */}
                  <td className="hidden lg:table-cell px-6 py-5 text-center">
                    {p.isActive ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm">
                        <CheckCircle2 size={12} className="animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-wider">Active</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-400 border border-slate-200">
                        <Power size={12} />
                        <span className="text-[10px] font-black uppercase tracking-wider">Disabled</span>
                      </div>
                    )}
                  </td>

               {/* 1. Order ID Column */}
            <td className="px-6 py-5 text-center">
              <div className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 font-mono font-bold text-xs">
                {p.order}
              </div>
            </td>

            {/* 2. Course ID Column */}
            <td className="px-6 py-5 text-center">
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-black border border-indigo-100">
                {p.courseId}
              </span>
            </td>

            {/* 3. Domain ID Column */}
            <td className="px-6 py-5 text-center">
              <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-black border border-slate-200">
                {p.domainId}
              </span>
            </td>

                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      {/* Enhanced Toggle Button */}
                      <button 
                        onClick={() => handleToggle(p)} 
                        title={p.isActive ? "Deactivate" : "Activate"}
                        className={`p-2 rounded-xl border transition-all transform active:scale-90 shadow-sm ${
                          p.isActive 
                            ? 'bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600' 
                            : 'bg-white text-slate-300 border-slate-200 hover:text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        <Power size={18} strokeWidth={2.5}/>
                      </button>
                      
                      <button onClick={() => { setSelectedProject(p); setIsModalOpen(true); }} className="p-2 bg-white text-indigo-600 border border-slate-200 rounded-xl hover:bg-indigo-50 transition-all shadow-sm">
                        <Edit2 size={18}/>
                      </button>
                      
                      <button onClick={async () => { if(confirm('Permanent Delete?')) { await projectService.delete(p.id); fetchProjects(); }}} className="p-2 bg-white text-rose-500 border border-slate-200 rounded-xl hover:bg-rose-50 transition-all shadow-sm">
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProjects.length)} of {filteredProjects.length}
          </p>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 rounded-lg bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-all"
            >
              <ChevronLeft size={20}/>
            </button>
            <div className="flex items-center px-4 text-sm font-black text-slate-700">
              {currentPage} / {totalPages || 1}
            </div>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 rounded-lg bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-all"
            >
              <ChevronRight size={20}/>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Integration */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedProject ? "Edit Project" : "New Project"}>
        <ProjectForm 
          project={selectedProject} 
          onCancel={() => setIsModalOpen(false)} 
          onSubmit={async (fd) => {
            const loadingToast = toast.loading('Syncing with database...');
            try {
              selectedProject ? await projectService.update(selectedProject.id, fd) : await projectService.create(fd);
              toast.success('Successfully Saved', { id: loadingToast });
              setIsModalOpen(false);
              fetchProjects();
            } catch { toast.error('Error saving', { id: loadingToast }); }
          }} 
        />
      </Modal>
    </div>
  );
};

// Sub-component for Stats
const StatTile = ({ label, value, icon, color }: any) => {
  const styles: any = {
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    rose: "text-rose-600 bg-rose-50 border-rose-100"
  };
  return (
    <div className={`p-6 rounded-[1.5rem] border flex items-center gap-5 bg-white shadow-sm`}>
      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-inner ${styles[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
        <p className="text-3xl font-black text-slate-900 leading-none">{value}</p>
      </div>
    </div>
  );
};

export default ProjectPage;