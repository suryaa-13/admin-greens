// pages/admin/VideoTestimonials.tsx
import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, RefreshCw, ToggleLeft, ToggleRight, PlayCircle, Video, List, Grid, Layout, CheckCircle2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import type { VideoTestimonial } from '../types/index';
import { videoTestimonialService } from '../services/videoTestimonial.service';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import VideoTestimonialForm from '../components/forms/VideoTestimonialForm';
import { IMAGE_URL } from '../utils/storage';

const VideoTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<VideoTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<VideoTestimonial | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const data = await videoTestimonialService.getAll();
      setTestimonials(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch video testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchTestimonials();
    setIsRefreshing(false);
  };

  const handleToggleStatus = async (testimonial: VideoTestimonial) => {
    try {
      const newStatus = !testimonial.isActive;
      const formData = new FormData();
      
      // Append all existing data but change the status
      formData.append('domainId', testimonial.domainId.toString());
      formData.append('courseId', testimonial.courseId.toString());
      formData.append('name', testimonial.name);
      formData.append('batch', testimonial.batch);
      formData.append('quote', testimonial.quote);
      formData.append('videoUrl', testimonial.videoUrl);
      formData.append('order', testimonial.order.toString());
      formData.append('isActive', newStatus.toString());
      
      await videoTestimonialService.update(testimonial.id, formData);
      toast.success(`Story ${newStatus ? 'is now Live' : 'moved to Draft'}`);
      fetchTestimonials();
    } catch (error: any) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (testimonial: VideoTestimonial) => {
    if (window.confirm(`Delete ${testimonial.name}? This cannot be undone.`)) {
      try {
        await videoTestimonialService.delete(testimonial.id);
        toast.success('Deleted successfully');
        fetchTestimonials();
      } catch (error: any) {
        toast.error('Failed to delete');
      }
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      if (selectedTestimonial) {
        await videoTestimonialService.update(selectedTestimonial.id, formData);
        toast.success('Updated successfully');
      } else {
        await videoTestimonialService.create(formData);
        toast.success('Created successfully');
      }
      setIsModalOpen(false);
      fetchTestimonials();
    } catch (error: any) {
      toast.error('Failed to save');
    }
  };

  const filteredTestimonials = testimonials.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.batch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistics Calculation
  const stats = {
    total: testimonials.length,
    active: testimonials.filter(t => t.isActive).length,
    draft: testimonials.filter(t => !t.isActive).length,
    landingPage: testimonials.filter(t => t.domainId === 0).length
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Video size={20} />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">Video Library</h1>
          </div>
          <p className="text-slate-500 text-sm font-medium">Manage student success stories and video placements</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex mr-2 border border-slate-200">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
            >
              <List size={18} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
            >
              <Grid size={18} />
            </button>
          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          </Button>
          <Button onClick={() => { setSelectedTestimonial(null); setIsModalOpen(true); }} className="bg-slate-900 text-white hover:bg-indigo-600 shadow-lg shadow-slate-200">
            <Plus size={18} className="mr-2" /> Add Story
          </Button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Stories</p>
          <p className="text-2xl font-black text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">Live Now</p>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-500" />
            <p className="text-2xl font-black text-slate-900">{stats.active}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">In Draft</p>
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-amber-500" />
            <p className="text-2xl font-black text-slate-900">{stats.draft}</p>
          </div>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl shadow-sm">
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Landing Page</p>
          <div className="flex items-center gap-2">
            <Layout size={18} className="text-indigo-500" />
            <p className="text-2xl font-black text-indigo-900">{stats.landingPage}</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search students, batches, or quotes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all shadow-sm"
        />
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
          <Video className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No records found matching your search</p>
        </div>
      ) : viewMode === 'list' ? (
        /* List View */
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
         <table className="w-full text-left border-collapse">
    <thead>
      <tr className="bg-slate-50 border-b border-slate-100">
        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Preview</th>
        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Student Info</th>
        <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Order ID</th>
        <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Course ID</th>
        <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Domain ID</th>
        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
        <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-slate-50">
      {filteredTestimonials.map((t) => (
        <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
          <td className="px-6 py-4">
            <div className="relative w-24 aspect-video rounded-lg overflow-hidden border border-slate-200 shadow-sm">
              <img src={`${IMAGE_URL}${t.imageUrl}`} className="object-cover w-full h-full" alt="" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <PlayCircle size={16} className="text-white drop-shadow-md" />
              </div>
            </div>
          </td>
          <td className="px-6 py-4">
            <p className="font-black text-slate-900 text-sm uppercase tracking-tight">{t.name}</p>
            <p className="text-xs text-slate-500 font-bold">{t.batch}</p>
          </td>

          {/* New ID Columns */}
          <td className="px-6 py-4 text-center">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-100 font-mono font-bold text-xs">
              {t.order}
            </span>
          </td>
          <td className="px-6 py-4 text-center">
            <span className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-[11px] font-black border border-indigo-100">
              {t.courseId}
            </span>
          </td>
          <td className="px-6 py-4 text-center">
            <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-[11px] font-black border border-slate-200">
              {t.domainId}
            </span>
          </td>

          <td className="px-6 py-4">
            <button 
              onClick={() => handleToggleStatus(t)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                t.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {t.isActive ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
              {t.isActive ? 'Active' : 'Draft'}
            </button>
          </td>
          <td className="px-6 py-4 text-right">
            <div className="flex justify-end gap-1">
              <button onClick={() => { setSelectedTestimonial(t); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all">
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleDelete(t)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-all">
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
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((t) => (
            <div key={t.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="relative aspect-video">
                <img src={`${IMAGE_URL}${t.imageUrl}`} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button onClick={() => window.open(t.videoUrl, '_blank')} className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:scale-110 transition-transform">
                      <PlayCircle size={32} />
                   </button>
                </div>
                <div className="absolute top-4 left-4 flex gap-2">
                   <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${t.isActive ? 'bg-green-500 text-white' : 'bg-slate-800 text-white'}`}>
                    {t.isActive ? 'Live' : 'Draft'}
                   </span>
                   {t.domainId === 0 && (
                     <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Landing</span>
                   )}
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-black text-slate-900 uppercase tracking-tight">{t.name}</h3>
                    <p className="text-[11px] text-indigo-600 font-black tracking-widest uppercase">{t.batch}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setSelectedTestimonial(t); setIsModalOpen(true); }} className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(t)} className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-500 line-clamp-2 italic mb-4">"{t.quote}"</p>
                <button 
                  onClick={() => handleToggleStatus(t)}
                  className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                    t.isActive 
                    ? 'border-green-200 text-green-600 hover:bg-green-50' 
                    : 'border-slate-200 text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {t.isActive ? 'Set to Draft' : 'Make Live'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedTestimonial(null); }}
        title={selectedTestimonial ? `Editing Story: ${selectedTestimonial.name}` : 'Publish New Success Story'}
        size="lg"
      >
        <VideoTestimonialForm
          testimonial={selectedTestimonial}
          onSubmit={handleSubmit}
          onCancel={() => { setIsModalOpen(false); setSelectedTestimonial(null); }}
        />
      </Modal>
    </div>
  );
};

export default VideoTestimonials;