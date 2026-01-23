import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, RefreshCw, Bell, 
  Eye, EyeOff, CheckCircle, XCircle, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Notice } from '../types/index';
import { noticeService } from '../services/notice.service';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import NoticeForm from '../components/forms/NoticeForm';

const NoticesPage: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const data = await noticeService.getAll();
      setNotices(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Error fetching notices:", error);
      toast.error(error.response?.data?.message || 'Failed to fetch notices');
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchNotices();
    setIsRefreshing(false);
  };

  const handleCreate = () => {
    setSelectedNotice(null);
    setIsModalOpen(true);
  };

  const handleEdit = async (notice: Notice) => {
    try {
      setSelectedNotice(notice);
      setIsModalOpen(true);
    } catch (error) {
      toast.error('Failed to load notice data');
    }
  };

  const handleDelete = async (notice: Notice) => {
    if (window.confirm(`Are you sure you want to delete this notice?\n\n"${notice.content.substring(0, 100)}..."`)) {
      try {
        await noticeService.delete(notice.id);
        toast.success('Notice deleted successfully');
        fetchNotices();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete notice');
      }
    }
  };

  const toggleActive = async (notice: Notice) => {
    try {
      const action = notice.isActive ? 'deactivate' : 'activate';
      
      if (!window.confirm(`Are you sure you want to ${action} this notice?`)) {
        return;
      }
      
      await noticeService.toggleStatus(notice.id, notice.isActive);
      toast.success(`Notice ${action}d successfully`);
      fetchNotices();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update notice status');
    }
  };

  const handleSubmit = async (formData: Partial<Notice>) => {
    try {
      if (selectedNotice) {
        await noticeService.update(selectedNotice.id, formData);
        toast.success('Notice updated successfully');
      } else {
        await noticeService.create(formData as { content: string; isActive?: boolean });
        toast.success('Notice created successfully');
      }
      setIsModalOpen(false);
      fetchNotices();
    } catch (error: any) {
      console.error("Error submitting notice:", error);
      toast.error(error.response?.data?.message || 'Failed to save notice');
    }
  };

  const filteredNotices = notices.filter((notice) => {
    const matchesSearch = notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && notice.isActive) ||
      (statusFilter === 'inactive' && !notice.isActive);

    // Date filtering
    const noticeDate = new Date(notice.createdAt);
    const now = new Date();
    const matchesDate = 
      dateFilter === 'all' ||
      (dateFilter === 'today' && noticeDate.toDateString() === now.toDateString()) ||
      (dateFilter === 'week' && (now.getTime() - noticeDate.getTime()) < 7 * 24 * 60 * 60 * 1000) ||
      (dateFilter === 'month' && noticeDate.getMonth() === now.getMonth() && noticeDate.getFullYear() === now.getFullYear());

    return matchesSearch && matchesStatus && matchesDate;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notice Management</h1>
          <p className="mt-1 text-gray-600">Manage marquee notices and announcements</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handleRefresh} 
            variant="outline"
            icon={<RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />}
            disabled={isRefreshing}
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button onClick={handleCreate} icon={<Plus size={20} />}>
            Add Notice
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search notices by content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      {!loading && notices.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-600">Total Notices</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{notices.length}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-600">Active Notices</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {notices.filter(n => n.isActive).length}
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-600">Inactive Notices</p>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {notices.filter(n => !n.isActive).length}
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-600">This Month</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {notices.filter(n => {
                const noticeDate = new Date(n.createdAt);
                const now = new Date();
                return noticeDate.getMonth() === now.getMonth() && noticeDate.getFullYear() === now.getFullYear();
              }).length}
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600" />
            <p className="text-sm text-gray-600">Loading notices...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Empty State */}
          {filteredNotices.length === 0 ? (
            <div className="rounded-lg bg-white p-8 text-center shadow-sm">
              <Bell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No notices found</h3>
              <p className="mt-2 text-gray-500">
                {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                  ? 'Try changing your search or filter criteria'
                  : 'Get started by creating your first notice'
                }
              </p>
              <div className="mt-6">
                <Button onClick={handleCreate}>Add Notice</Button>
              </div>
            </div>
          ) : (
            <>
              {/* Notices Count */}
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {filteredNotices.length} of {notices.length} notices
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="font-medium">Active: {notices.filter(n => n.isActive).length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <span className="font-medium">Inactive: {notices.filter(n => !n.isActive).length}</span>
                  </div>
                </div>
              </div>

              {/* Notices List */}
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <div className="bg-gray-50 px-6 py-3">
                  <div className="grid grid-cols-12 gap-4 text-xs font-medium uppercase tracking-wider text-gray-500">
                    <div className="col-span-1">ID</div>
                    <div className="col-span-5">Content</div>
                    <div className="col-span-2">Created</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>
                </div>
                <div className="divide-y divide-gray-200 bg-white">
                  {filteredNotices.map((notice) => (
                    <div key={notice.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* ID */}
                        <div className="col-span-1">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-800">
                            {notice.id}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="col-span-5">
                          <p className="text-sm text-gray-900 line-clamp-2">
                            {notice.content}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {notice.content.length} characters
                          </p>
                        </div>

                        {/* Created Date */}
                        <div className="col-span-2">
                          <div className="text-sm text-gray-900">
                            {formatDate(notice.createdAt.toString())}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(notice.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </div>

                        {/* Status */}
                        <div className="col-span-2">
                          <button
                            onClick={() => toggleActive(notice)}
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors hover:opacity-90 ${
                              notice.isActive 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                            title={`Click to ${notice.isActive ? 'deactivate' : 'activate'}`}
                          >
                            {notice.isActive ? (
                              <>
                                <CheckCircle size={14} />
                                <span>Active</span>
                              </>
                            ) : (
                              <>
                                <XCircle size={14} />
                                <span>Inactive</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Actions */}
                        <div className="col-span-2 flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(notice)}
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(notice)}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button
                            onClick={() => toggleActive(notice)}
                            className={`rounded-lg p-2 transition-colors ${
                              notice.isActive 
                                ? 'text-amber-600 hover:bg-amber-50' 
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                            title={notice.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {notice.isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedNotice(null);
        }}
        title={selectedNotice ? `Edit Notice #${selectedNotice.id}` : 'Create New Notice'}
        size="lg"
      >
        <NoticeForm
          notice={selectedNotice}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedNotice(null);
          }}
        />
      </Modal>

      {/* Management Guide */}
      <div className="mt-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
        <div className="flex items-start">
          <Bell className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
          <div>
            <h4 className="font-semibold">📋 Notice Management Guide:</h4>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li><span className="font-medium">Active Notices</span> - Displayed in the marquee/notification bar</li>
              <li><span className="font-medium">Inactive Notices</span> - Hidden from view but kept in database</li>
              <li><span className="font-medium">Edit Icon</span> - Modify notice content and status</li>
              <li><span className="font-medium">Delete Icon</span> - Permanently remove notice</li>
              <li><span className="font-medium">Eye Icon</span> - Toggle between active/inactive status</li>
              <li><span className="font-medium">Status Button</span> - Click to toggle active/inactive status</li>
              <li><span className="font-medium">Only active notices</span> appear in the public marquee</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticesPage;