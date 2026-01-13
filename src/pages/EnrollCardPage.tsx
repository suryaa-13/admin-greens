// pages/admin/EnrollCardsPage.tsx
import React, { useState, useEffect } from 'react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import EnrollCardForm from '../components/forms/EnrollCardForm';
import { enrollCardService } from '../services/enrollCard.service';
import type { EnrollCard } from '../types/index';
import { IMAGE_URL } from '../utils/storage';
import { 
  Plus, Edit2, Trash2, Eye, RefreshCw, 
  CheckCircle, Search, ChevronUp, ChevronDown, 
  Layout, Activity, PowerOff, AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

const EnrollCardsPage: React.FC = () => {
  // --- States ---
  const [cards, setCards] = useState<EnrollCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<EnrollCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<EnrollCard | null>(null);
  const [deletingCard, setDeletingCard] = useState<EnrollCard | null>(null);
  const [viewingCard, setViewingCard] = useState<EnrollCard | null>(null);

  // Filter/Sort States
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof EnrollCard>('order');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [filterActive, setFilterActive] = useState<string>('all');

  // --- Effects ---
  useEffect(() => {
    fetchCards();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [cards, searchTerm, filterCourse, filterActive, sortField, sortDirection]);

  // --- Actions ---
  const fetchCards = async () => {
    try {
      setLoading(true);
      const result = await enrollCardService.getAllForAdmin();
      setCards(Array.isArray(result.data) ? result.data : []);
      
      if (result.stats) {
        setStats(result.stats);
      }
    } catch (error) {
      console.error('Error fetching cards:', error);
      toast.error('Failed to fetch cards');
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...cards];

    if (searchTerm) {
      filtered = filtered.filter(card =>
        card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.domainId.toString().includes(searchTerm)
      );
    }

    if (filterCourse !== 'all') {
      filtered = filtered.filter(card => 
        filterCourse === '0' ? card.courseId === 0 : card.courseId > 0
      );
    }

    if (filterActive !== 'all') {
      filtered = filtered.filter(card => 
        filterActive === 'active' ? card.isActive : !card.isActive
      );
    }

    filtered.sort((a, b) => {
      const aValue = a[sortField] ?? '';
      const bValue = b[sortField] ?? '';
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredCards(filtered);
  };

  const handleSort = (field: keyof EnrollCard) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      const result = editingCard 
        ? await enrollCardService.update(editingCard.id, formData)
        : await enrollCardService.create(formData);
      
      if (result.success) {
        toast.success(result.message || 'Saved successfully');
        fetchCards();
        setIsModalOpen(false);
        setEditingCard(null);
      }
    } catch (error) {
      toast.error('Save failed');
    }
  };

  const handleDelete = async (card: EnrollCard) => {
    try {
      // PERMANENT DELETE (Hard Delete)
      const result = await enrollCardService.hardDelete(card.id); 
      
      if (result.success) {
        toast.success('Card permanently deleted');
        setDeletingCard(null);
        fetchCards(); // Refresh data and stats dashboard
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Error deleting card from database');
    }
  };

  const handleToggleStatus = async (card: EnrollCard) => {
    try {
      const formData = new FormData();
      formData.append('isActive', (!card.isActive).toString());
      
      const result = await enrollCardService.update(card.id, formData);
      if (result.success) {
        fetchCards();
        toast.success(`Card ${!card.isActive ? 'activated' : 'deactivated'}`);
      }
    } catch (error) {
      toast.error('Status update failed');
    }
  };

  // --- Helpers ---
  const getDomainName = (id: number) => (id === 0 ? 'Landing Page' : `Domain ${id}`);
  
  const getImageUrl = (path: string) => {
    if (!path) return '';
    return path.startsWith('http') ? path : `${IMAGE_URL}${path}`;
  };

  const getSortIcon = (field: keyof EnrollCard) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* 1. Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enroll Cards</h1>
          <p className="text-gray-600">Admin Management Dashboard</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={fetchCards} disabled={loading} icon={<RefreshCw size={16} />}>
            Refresh
          </Button>
          <Button variant="primary" onClick={() => { setEditingCard(null); setIsModalOpen(true); }} icon={<Plus size={16} />}>
            Add New Card
          </Button>
        </div>
      </div>

      {/* 2. Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><Layout size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase">Total Records</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg"><Activity size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase">Active</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg"><PowerOff size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase">Inactive</p>
            <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
          </div>
        </div>
      </div>

      {/* 3. Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search title or domain..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500"
          />
        </div>
        <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)} className="border border-gray-300 rounded-md p-2">
          <option value="all">All Placement Levels</option>
          <option value="0">Domain Level</option>
          <option value=">0">Course Level</option>
        </select>
        <select value={filterActive} onChange={(e) => setFilterActive(e.target.value)} className="border border-gray-300 rounded-md p-2">
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* 4. Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 text-center flex flex-col items-center">
            <RefreshCw className="animate-spin text-indigo-500 mb-2" size={32} />
            <p className="text-gray-500">Syncing with database...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th onClick={() => handleSort('id')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">
                    ID {getSortIcon('id')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preview</th>
                  <th onClick={() => handleSort('title')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">
                    Title {getSortIcon('title')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Placement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCards.map((card) => (
                  <tr key={card.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{card.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img src={getImageUrl(card.image)} className="h-10 w-16 object-cover rounded border" alt="" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{card.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-semibold text-indigo-600 block">{getDomainName(card.domainId)}</span>
                      <span className="text-[10px] text-gray-400">{card.courseId === 0 ? 'Global' : `Course: ${card.courseId}`}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${card.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {card.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button onClick={() => setViewingCard(card)} className="text-gray-400 hover:text-indigo-600"><Eye size={18}/></button>
                      <button onClick={() => { setEditingCard(card); setIsModalOpen(true); }} className="text-gray-400 hover:text-blue-600"><Edit2 size={18}/></button>
                      <button onClick={() => handleToggleStatus(card)} className={card.isActive ? "text-orange-400 hover:text-orange-600" : "text-green-400 hover:text-green-600"}>
                        <CheckCircle size={18}/>
                      </button>
                      <button onClick={() => setDeletingCard(card)} className="text-gray-400 hover:text-red-600"><Trash2 size={18}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingCard(null); }} title={editingCard ? 'Edit Enroll Card' : 'Add New Enroll Card'}>
        <EnrollCardForm enrollCard={editingCard} onSubmit={handleSubmit} onCancel={() => { setIsModalOpen(false); setEditingCard(null); }} />
      </Modal>

      {/* PERMANENT DELETE MODAL */}
      <Modal isOpen={!!deletingCard} onClose={() => setDeletingCard(null)} title="Delete Permanently" size="sm">
        <div className="p-4 text-center">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Are you sure?</h3>
          <p className="text-gray-600 mb-6 text-sm">
            You are about to delete <span className="font-bold">"{deletingCard?.title}"</span>. 
            This will remove the record from the database and delete the image file. <strong>This cannot be undone.</strong>
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={() => setDeletingCard(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => deletingCard && handleDelete(deletingCard)}>Delete Forever</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EnrollCardsPage;