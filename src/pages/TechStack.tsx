import React, { useEffect, useState } from 'react';
import { 
  Plus, Search, Edit2, Trash2, RefreshCw, Power, Cpu, 
  Layout, BookOpen, Globe, CheckCircle, AlertCircle 
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { TechStack } from '../types/index';
import { techStackService } from '../services/techStack.service';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import TechStackForm from '../components/forms/TechStackForm';
import { IMAGE_URL } from '../utils/storage';

const TechStackPage: React.FC = () => {
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTech, setSelectedTech] = useState<TechStack | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchTechStacks();
  }, []);

  const fetchTechStacks = async () => {
    try {
      setLoading(true);
      const data = await techStackService.getAll();
      const techStacksArray = Array.isArray(data) ? data : [];
      setTechStacks(techStacksArray);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch tech stack');
      setTechStacks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchTechStacks();
    setIsRefreshing(false);
  };

  // Stats Calculations
  const stats = {
    total: techStacks.length,
    landing: techStacks.filter(t => t.domainId === 0).length,
    domains: techStacks.filter(t => t.domainId > 0 ).length,
    courses: techStacks.filter(t => t.courseId > 0).length,
    active: techStacks.filter(t => t.isActive).length,
    inactive: techStacks.filter(t => !t.isActive).length,
  };

  const handleToggleStatus = async (tech: TechStack) => {
    try {
      const newStatus = !tech.isActive;
      const action = newStatus ? 'activate' : 'deactivate';
      if (!window.confirm(`Are you sure you want to ${action} "${tech.name}"?`)) return;
      
      const formData = new FormData();
      formData.append('domainId', tech.domainId.toString());
      formData.append('courseId', tech.courseId.toString());
      formData.append('name', tech.name);
      formData.append('order', tech.order.toString());
      formData.append('isActive', newStatus.toString());
      
      await techStackService.update(tech.id, formData);
      toast.success(`"${tech.name}" updated successfully`);
      fetchTechStacks();
    } catch (error: any) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (tech: TechStack) => {
    if (window.confirm(`Permanently delete "${tech.name}"?`)) {
      const userInput = prompt('Type "DELETE" to confirm:');
      if (userInput?.toUpperCase() === 'DELETE') {
        try {
          await techStackService.delete(tech.id);
          toast.success('Deleted successfully');
          fetchTechStacks();
        } catch (error) {
          toast.error('Delete failed');
        }
      }
    }
  };

  const handleEdit = (tech: TechStack) => {
    try {
      setSelectedTech(tech);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error preparing edit form:", error);
      toast.error('Failed to load technology data');
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      if (selectedTech) {
        await techStackService.update(selectedTech.id, formData);
        toast.success('Updated successfully');
      } else {
        await techStackService.create(formData);
        toast.success('Created successfully');
      }
      setIsModalOpen(false);
      fetchTechStacks();
    } catch (error) {
      toast.error('Save failed');
    }
  };

  const filteredTechStacks = techStacks.filter((tech) =>
    (tech.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tech Stack Management</h1>
          <p className="text-sm text-gray-500">Inventory and visibility control</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" disabled={isRefreshing}>
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          </Button>
          <Button onClick={() => { setSelectedTech(null); setIsModalOpen(true); }} icon={<Plus size={18} />}>
            Add New Tech
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard label="Total" count={stats.total} icon={<Cpu size={16}/>} color="gray" />
        <StatCard label="Landing" count={stats.landing} icon={<Globe size={16}/>} color="indigo" />
        <StatCard label="Domains" count={stats.domains} icon={<Layout size={16}/>} color="purple" />
        <StatCard label="Courses" count={stats.courses} icon={<BookOpen size={16}/>} color="blue" />
        <StatCard label="Active" count={stats.active} icon={<CheckCircle size={16}/>} color="green" />
        <StatCard label="Inactive" count={stats.inactive} icon={<AlertCircle size={16}/>} color="red" />
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="search"
          placeholder="Search tech by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20"><RefreshCw className="animate-spin text-indigo-600" /></div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
              <tr>
                <th className="px-6 py-3 text-left">Technology</th>
                <th className="px-6 py-3 text-left">Icon</th>
                <th className="px-6 py-3 text-left">Allocation</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredTechStacks.map((tech) => (
                <tr key={tech.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{tech.name}</div>
                    <div className="text-xs text-gray-400">Order: {tech.order}</div>
                  </td>
                  <td className="px-6 py-4">
                    <img 
                      src={`${IMAGE_URL}${tech.iconUrl}`} 
                      className="h-10 w-10 object-contain p-1 border rounded bg-white" 
                      alt={tech.name} 
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm block text-gray-700">
                      {tech.domainId === 0 ? 'Landing Page' : `Domain ${tech.domainId}`}
                    </span>
                    {tech.courseId > 0 && <span className="text-xs text-gray-400">Course ID: {tech.courseId}</span>}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleToggleStatus(tech)} 
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        tech.isActive 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      {tech.isActive ? <CheckCircle size={12}/> : <AlertCircle size={12}/>}
                      {tech.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(tech)} 
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                        title="Edit Technology"
                      >
                        <Edit2 size={16}/>
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(tech)} 
                        className={`p-1.5 rounded transition-colors ${
                          tech.isActive 
                            ? 'text-amber-600 hover:bg-amber-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={tech.isActive ? 'Deactivate' : 'Activate'}
                      >
                        <Power size={16}/>
                      </button>
                      <button 
                        onClick={() => handleDelete(tech)} 
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete Permanently"
                      >
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTechStacks.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-white">
              No technology found matching your search.
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedTech ? `Edit ${selectedTech.name}` : 'New Technology'}
      >
        <TechStackForm techStack={selectedTech} onSubmit={handleSubmit} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

interface StatCardProps {
  label: string;
  count: number;
  icon: React.ReactNode;
  color: 'gray' | 'indigo' | 'purple' | 'blue' | 'green' | 'red';
}

const StatCard = ({ label, count, icon, color }: StatCardProps) => {
  const colors: Record<string, string> = {
    gray: 'bg-gray-50 text-gray-600 border-gray-200',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    red: 'bg-red-50 text-red-600 border-red-200',
  };
  return (
    <div className={`p-4 rounded-xl border ${colors[color]} shadow-sm`}>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">{label}</span>
      </div>
      <div className="text-2xl font-bold">{count}</div>
    </div>
  );
};

export default TechStackPage;