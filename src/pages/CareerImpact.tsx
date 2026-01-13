

// pages/admin/CareerImpact.tsx
import React, { useEffect, useState } from 'react';
import {
  Plus, Search, Edit2, Trash2, RefreshCw,
  Power
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { CareerImpact } from '../types/index';
import { careerImpactService } from '../services/careerImpact.service';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import CareerImpactForm from '../components/forms/CareerImpactForm';

interface TableColumn {
  key: string;
  header: string;
  render?: (value: any, row: CareerImpact) => React.ReactNode;
}

const CareerImpactPage: React.FC = () => {
  const [careerImpacts, setCareerImpacts] = useState<CareerImpact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCareerImpact, setSelectedCareerImpact] = useState<CareerImpact | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter States
  // Replace the old lines with these:
  const [filterDomain] = useState<string>('all');
  const [filterCourse] = useState<string>('all');
  const [statusFilter] = useState<string>('all');
  useEffect(() => {
    fetchCareerImpacts();
  }, []);

  const fetchCareerImpacts = async () => {
    try {
      setLoading(true);
      const data = await careerImpactService.getAll();
      const careerImpactsArray = Array.isArray(data) ? data : [];
      setCareerImpacts(careerImpactsArray);
    } catch (error: any) {
      console.error("Error fetching career impacts:", error);
      toast.error(error.response?.data?.message || 'Failed to fetch career impacts');
      setCareerImpacts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchCareerImpacts();
    setIsRefreshing(false);
  };

  const handleCreate = () => {
    setSelectedCareerImpact(null);
    setIsModalOpen(true);
  };

  const handleEdit = (careerImpact: CareerImpact) => {
    setSelectedCareerImpact(careerImpact);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (careerImpact: CareerImpact) => {
    try {
      const newStatus = !careerImpact.isActive;
      const action = newStatus ? 'activate' : 'deactivate';

      if (!window.confirm(`Are you sure you want to ${action} "${careerImpact.mainTitle}"?`)) return;

      await careerImpactService.update(careerImpact.id, {
        ...careerImpact,
        isActive: newStatus,
      });

      toast.success(`Career impact ${action}d successfully`);
      fetchCareerImpacts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (careerImpact: CareerImpact) => {
    if (window.confirm(`⚠️ PERMANENT DELETE ⚠️\n\nAre you sure you want to delete "${careerImpact.mainTitle}"?\n\nType "DELETE" to confirm:`)) {
      const userInput = prompt('Please type "DELETE" to confirm:');
      if (userInput?.toUpperCase() === 'DELETE') {
        try {
          await careerImpactService.delete(careerImpact.id);
          toast.success('Career impact deleted');
          fetchCareerImpacts();
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Failed to delete');
        }
      }
    }
  };

  const handleSubmit = async (formData: Partial<CareerImpact>) => {
    try {
      if (selectedCareerImpact) {
        await careerImpactService.update(selectedCareerImpact.id, formData);
        toast.success('Updated successfully');
      } else {
        await careerImpactService.create(formData as CareerImpact);
        toast.success('Created successfully');
      }
      setIsModalOpen(false);
      fetchCareerImpacts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save');
    }
  };

  const filteredCareerImpacts = careerImpacts.filter((impact) => {
    const matchesSearch =
      (impact.mainTitle?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (impact.mainDescription?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (impact.ctaText?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesDomain = filterDomain === 'all' || impact.domainId?.toString() === filterDomain;
    const matchesCourse = filterCourse === 'all' || impact.courseId?.toString() === filterCourse;
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && impact.isActive) ||
      (statusFilter === 'inactive' && !impact.isActive);

    return matchesSearch && matchesDomain && matchesCourse && matchesStatus;
  });

  const columns: TableColumn[] = [
    { key: 'id', header: 'ID' },
    {
      key: 'mainTitle',
      header: 'MAIN SECTION',
      render: (value: string, row: CareerImpact) => (
        <div>
          <div className="font-bold text-gray-900">{value}</div>
          <div className="text-xs text-gray-500 italic">CTA: {row.ctaText}</div>
        </div>
      )
    },
    {
      key: 'card1Title',
      header: 'CARD 1',
      render: (value: string, row: CareerImpact) => (
        <div className="max-w-[150px]">
          <div className="font-bold text-gray-900">{value}</div>
          <div className="text-xs text-gray-500 truncate">{row.card1Description}</div>
        </div>
      )
    },
    {
      key: 'card2Title',
      header: 'CARD 2',
      render: (value: string, row: CareerImpact) => (
        <div className="max-w-[150px]">
          <div className="font-bold text-gray-900">{value}</div>
          <div className="text-xs text-gray-500 truncate">{row.card2Description}</div>
        </div>
      )
    },
    {
      key: 'domainId',
      header: 'DOMAIN/COURSE',
      render: (value: number, row: CareerImpact) => (
        <div className="flex flex-col gap-1">
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium bg-emerald-50 text-[--brand-dark] border border-emerald-100">
            {value === 0 ? 'Landing Page' : `Domain ${value}`}
          </span>
          <span className="text-[10px] text-gray-400">Course ID: {row.courseId}</span>
        </div>
      )
    },
    {
      key: 'isActive',
      header: 'STATUS',
      render: (value: boolean) => (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
          <span className={`h-2 w-2 rounded-full ${value ? 'bg-green-500' : 'bg-red-500'}`}></span>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'ACTIONS',
      render: (_: any, row: CareerImpact) => (
        <div className="flex space-x-3">
          <button onClick={() => handleEdit(row)} className="text-[--brand-dark] hover:text-[--brand-hover] transition-colors" title="Edit"><Edit2 size={18} /></button>
          <button onClick={() => handleToggleStatus(row)} className="text-emerald-600 hover:text-emerald-800 transition-colors" title="Toggle Status"><Power size={18} /></button>
          <button onClick={() => handleDelete(row)} className="text-red-500 hover:text-red-700 transition-colors" title="Delete"><Trash2 size={18} /></button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Career Impact Management</h1>
          <p className="text-sm text-gray-500">Oversee course statistics and impact highlights</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleRefresh}
            className="btn-outline px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            Refresh
          </Button>
          <Button
            onClick={handleCreate}
            className="btn-primary px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
          >
            <Plus size={20} />
            Add Career Impact
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 rounded-xl bg-white p-5 shadow-sm border border-gray-100">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search by title, description, or CTA..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[--brand-dark] outline-none transition-all"
            />
          </div>

        </div>
      </div>

      {/* Stat Cards */}
      {!loading && (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow-sm border-l-4 border-[--brand-dark]">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Impacts</p>
            <p className="mt-1 text-3xl font-extrabold text-gray-900">{careerImpacts.length}</p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm border-l-4 border-green-500">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Now</p>
            <p className="mt-1 text-3xl font-extrabold text-green-600">{careerImpacts.filter(c => c.isActive).length}</p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm border-l-4 border-red-500">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inactive</p>
            <p className="mt-1 text-3xl font-extrabold text-red-600">{careerImpacts.filter(c => !c.isActive).length}</p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm border-l-4 border-purple-500">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Landing Level</p>
            <p className="mt-1 text-3xl font-extrabold text-purple-600">{careerImpacts.filter(c => c.courseId === 0).length}</p>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Showing {filteredCareerImpacts.length} entries
          </span>
          <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1.5 text-green-600">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span> Active: {careerImpacts.filter(c => c.isActive).length}
            </span>
            <span className="flex items-center gap-1.5 text-red-600">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span> Inactive: {careerImpacts.filter(c => !c.isActive).length}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-24 gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-100 border-t-[--brand-dark]" />
            <p className="text-sm text-[--brand-dark] font-bold animate-pulse">Synchronizing Data...</p>
          </div>
        ) : filteredCareerImpacts.length === 0 ? (
          <div className="py-24 text-center">
            <div className="bg-gray-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">No Career Impacts Found</h3>
            <p className="text-gray-500 max-w-xs mx-auto text-sm mt-1">We couldn't find any results matching your search or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white text-[10px] uppercase tracking-widest font-black text-gray-400 border-b border-gray-100">
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} className="px-6 py-5">{col.header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCareerImpacts.map((impact) => (
                  <tr key={impact.id} className="hover:bg-emerald-50/30 transition-colors group">
                    {columns.map((col) => (
                      <td key={`${impact.id}-${col.key}`} className="px-6 py-4 text-sm">
                        {col.render ? col.render(impact[col.key as keyof CareerImpact], impact) : String(impact[col.key as keyof CareerImpact] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCareerImpact ? 'Edit Impact Resource' : 'Register New Career Impact'}
        size="lg"
      >
        <CareerImpactForm
          careerImpact={selectedCareerImpact}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default CareerImpactPage;