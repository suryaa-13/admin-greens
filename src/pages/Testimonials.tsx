

// pages/admin/Testimonials.tsx
import React, { useEffect, useState } from 'react';
import {
  Plus, Search, Edit2, Trash2, RefreshCw,
  Power, List, LayoutGrid, User,
  CheckCircle2, AlertCircle, PlayCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { Testimonial } from '../types/index';
import { testimonialService } from '../services/testimonial.service';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import TestimonialForm from '../components/forms/TestimonialForm';
import { IMAGE_URL } from '../utils/storage';

interface ColumnConfig {
  key: string;
  header: string;
  render?: (value: any, row: Testimonial) => React.ReactNode;
}

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const data = await testimonialService.getAll();
      setTestimonials(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchTestimonials();
    setIsRefreshing(false);
  };

  const handleToggleStatus = async (testimonial: Testimonial) => {
    const loadingToast = toast.loading('Updating status...');
    try {
      const newStatus = !testimonial.isActive;
      const formData = new FormData();
      formData.append('domainId', testimonial.domainId.toString());
      formData.append('name', testimonial.name);
      formData.append('batch', testimonial.batch);
      formData.append('quote', testimonial.quote);
      formData.append('isActive', newStatus.toString());

      await testimonialService.update(testimonial.id, formData);
      toast.dismiss(loadingToast);
      toast.success(`${testimonial.name} is now ${newStatus ? 'Active' : 'Inactive'}`);
      fetchTestimonials();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (testimonial: Testimonial) => {
    if (window.confirm(`Delete "${testimonial.name}" permanently?`)) {
      try {
        await testimonialService.delete(testimonial.id);
        toast.success('Deleted successfully');
        fetchTestimonials();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const filteredTestimonials = testimonials.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.batch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && t.isActive) ||
      (statusFilter === 'inactive' && !t.isActive);
    return matchesSearch && matchesStatus;
  });

  const columns: ColumnConfig[] = [
    {
      key: 'name',
      header: 'Student',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <img
            src={`${IMAGE_URL}${row.image}`}
            className="h-10 w-10 rounded-full object-cover border bg-gray-50"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40'; }}
          />
          <div>
            <div className="font-bold text-gray-900 leading-tight">{value}</div>
            <div className="text-[11px] text-gray-500 font-medium uppercase tracking-tighter">{row.batch}</div>
          </div>
        </div>
      )
    },
    // Updated Domain ID Column
    {
      key: 'domainId',
      header: 'Domain ID',
      render: (val) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${Number(val) === 0 ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
          }`}>
          {Number(val) === 0 ? 'Landing (0)' : `Domain ${val}`}
        </span>
      )
    },
    // Added Course ID Column
    {
      key: 'courseId',
      header: 'Course ID',
      render: (val) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${Number(val) === 0 ? 'bg-gray-100 text-gray-500' : 'bg-indigo-100 text-indigo-700'
          }`}>
          {Number(val) === 0 ? 'General (0)' : `Course ${val}`}
        </span>
      )
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (value) => (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
          <div className={`h-1.5 w-1.5 rounded-full ${value ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          {value ? 'Active' : 'Inactive'}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button onClick={() => handleToggleStatus(row)} className={`p-2 rounded-lg transition-colors ${row.isActive ? 'text-amber-500 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'}`} title="Toggle Status"><Power size={18} /></button>
          <button onClick={() => { setSelectedTestimonial(row); setIsModalOpen(true); }} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
          <button onClick={() => handleDelete(row)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Testimonials</h1>
          <p className="text-slate-500 text-sm">Manage student success stories and visual proof</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing} className="bg-white">
            <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
          </Button>
          <Button onClick={() => { setSelectedTestimonial(null); setIsModalOpen(true); }} className="shadow-lg shadow-indigo-100">
            <Plus size={18} className="mr-2" /> Add Story
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<User size={20} />} label="Total" value={testimonials.length} color="blue" />
        <StatCard icon={<CheckCircle2 size={20} />} label="Active" value={testimonials.filter(t => t.isActive).length} color="green" />
        <StatCard icon={<AlertCircle size={20} />} label="Inactive" value={testimonials.filter(t => !t.isActive).length} color="red" />
        <StatCard icon={<PlayCircle size={20} />} label="With Video" value={testimonials.filter(t => t.videoUrl).length} color="purple" />
      </div>

      {/* Control Bar */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex bg-slate-100 p-1 rounded-lg w-fit">
          {(['all', 'active', 'inactive'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${statusFilter === s ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full lg:w-64 rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}><List size={18} /></button>
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}><LayoutGrid size={18} /></button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mb-4"></div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Fetching data...</p>
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <Search size={40} className="mx-auto text-slate-200 mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No testimonials found</h3>
          <p className="text-slate-500 text-sm">Adjust your filters or add a new entry</p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/50">
              <tr>
                {columns.map(col => (
                  <th key={col.key} className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">{col.header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTestimonials.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/30 transition-colors">
                  {columns.map(col => (
                    <td key={col.key} className="px-6 py-4">
                      {col.render ? col.render(t[col.key as keyof Testimonial], t) : String(t[col.key as keyof Testimonial] || '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTestimonials.map(t => (
            <div key={t.id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-xl transition-all group">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={`${IMAGE_URL}${t.image}`}
                  className="h-16 w-16 rounded-full object-cover border-2 border-indigo-50 shadow-sm group-hover:border-indigo-200 transition-colors"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64'; }}
                />
                <div>
                  <h3 className="font-bold text-slate-900">{t.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded uppercase tracking-wider">{t.batch}</span>
                    <span className={`h-1.5 w-1.5 rounded-full ${t.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                  </div>
                </div>
              </div>
              {/* Quote Removed */}

              {/* Updated Grid Footer with Domain and Course IDs */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex gap-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase border border-slate-100 px-1.5 py-0.5 rounded">D: {t.domainId}</span>
                  <span className="text-[9px] font-black text-slate-400 uppercase border border-slate-100 px-1.5 py-0.5 rounded">C: {t.courseId}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleToggleStatus(t)} className={`p-2 rounded-lg transition-colors ${t.isActive ? 'text-amber-500 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'}`}><Power size={18} /></button>
                  <button onClick={() => { setSelectedTestimonial(t); setIsModalOpen(true); }} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(t)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedTestimonial(null); }}
        title={selectedTestimonial ? `Edit Testimonial` : 'Create New Testimonial'}
        size="lg"
      >
        <TestimonialForm
          testimonial={selectedTestimonial}
          onSubmit={async (data) => {
            const saveToast = toast.loading('Saving...');
            try {
              if (selectedTestimonial) await testimonialService.update(selectedTestimonial.id, data);
              else await testimonialService.create(data);
              toast.dismiss(saveToast);
              toast.success('Successfully saved');
              setIsModalOpen(false);
              fetchTestimonials();
            } catch (error) {
              toast.dismiss(saveToast);
              toast.error('Save failed');
            }
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

// Reusable Stat Component
const StatCard = ({ icon, label, value, color }: { icon: any, label: string, value: number, color: 'blue' | 'purple' | 'green' | 'red' }) => {
  const styles = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    green: "bg-green-50 text-green-600 border-green-100",
    red: "bg-red-50 text-red-600 border-red-100"
  };
  return (
    <div className={`flex items-center gap-4 p-5 bg-white rounded-2xl border ${styles[color]} shadow-sm`}>
      <div className={`p-3 rounded-xl bg-white shadow-sm border border-inherit`}>{icon}</div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
        <p className="text-2xl font-black text-slate-900 leading-none">{value}</p>
      </div>
    </div>
  );
};

export default Testimonials;