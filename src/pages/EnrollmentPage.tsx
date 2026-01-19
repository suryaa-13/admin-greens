

import React, { useState, useEffect, useMemo } from 'react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { enrollmentRequestService } from '../services/enrollment.service';
import type { EnrollmentRequest } from '../types/index';
import { 
  Trash2, Eye, RefreshCw, Search, Mail, Phone, 
  Calendar, User
} from 'lucide-react';

const EnrollmentPage: React.FC = () => {
  const [requests, setRequests] = useState<EnrollmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingRequest, setViewingRequest] = useState<EnrollmentRequest | null>(null);
  const [deletingRequest, setDeletingRequest] = useState<EnrollmentRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // --- Data Fetching ---
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const result = await enrollmentRequestService.getAllRequests();
      // Defensive check: ensure result.data is an array
      setRequests(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // --- Filtering ---
  const filteredRequests = useMemo(() => {
    if (!requests) return [];
    return requests.filter(request => {
      const term = searchTerm.toLowerCase();
      return !term || 
        [request.name, request.email, request.phone, request.course || '', request.domain || '']
          .some(field => field?.toLowerCase().includes(term));
    });
  }, [requests, searchTerm]);

  // --- Handlers ---
  const handleDelete = async (id: number) => {
    try {
      const result = await enrollmentRequestService.deleteRequest(id);
      if (result.success) {
        setDeletingRequest(null);
        fetchRequests();
      }
    } catch (error) {
      alert('Failed to delete request');
    }
  };

  return (
    <div className="p-6 bg-[#fbfaf8] min-h-screen">
      {/* Header Section */}
      <div className="mb-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#01311F]">Enrollment Dashboard</h1>
            <p className="text-gray-500">Total Records Found: {filteredRequests.length}</p>
          </div>
          <Button 
            variant="secondary" 
            className="bg-white border-gray-200"
            icon={<RefreshCw size={16} className={loading ? 'animate-spin' : ''} />} 
            onClick={fetchRequests} 
            disabled={loading}
          >
            Refresh Data
          </Button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search student, email, or program..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#B99A49]/20 outline-none text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="max-w-7xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 text-center flex flex-col items-center gap-3">
             <RefreshCw className="animate-spin text-[#B99A49]" size={32} />
             <p className="text-gray-400 font-medium">Loading applications...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-5">Student Information</th>
                  <th className="px-8 py-5">Program Details</th>
                  <th className="px-8 py-5">Submission Date</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredRequests.map(req => (
                  <tr key={req.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#01311F]/5 flex items-center justify-center text-[#01311F]">
                           <User size={16} />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 leading-none">{req.name}</div>
                          <div className="flex items-center text-xs text-gray-400 mt-1">
                            <Mail size={12} className="mr-1" /> {req.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm font-bold text-gray-800">{req.course || 'Direct Enrollment'}</div>
                      <div className="text-[10px] font-black text-[#B99A49] uppercase tracking-wider">{req.domain}</div>
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-300" />
                        {req.createdAt ? new Date(req.createdAt).toLocaleDateString('en-GB') : 'N/A'}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right space-x-2">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="rounded-lg hover:bg-white"
                        onClick={() => setViewingRequest(req)} 
                        icon={<Eye size={14} />}
                      >
                        View
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm" 
                        className="rounded-lg p-2"
                        onClick={() => setDeletingRequest(req)} 
                        icon={<Trash2 size={14} />} 
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredRequests.length === 0 && (
              <div className="p-20 text-center text-gray-400 text-sm">No enrollment records found.</div>
            )}
          </div>
        )}
      </div>

      {/* View Details Modal */}
      <Modal 
        isOpen={!!viewingRequest} 
        onClose={() => setViewingRequest(null)} 
        title="Application Details"
        size="lg"
      >
        {viewingRequest && (
          <div className="p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Contact Information</h4>
                <div className="p-5 bg-gray-50 rounded-2xl space-y-4">
                   <div className="flex items-center gap-4">
                     <div className="p-2 bg-white rounded-lg shadow-sm"><User size={18} className="text-[#01311F]"/></div>
                     <span className="font-semibold text-gray-700">{viewingRequest.name}</span>
                   </div>
                   <div className="flex items-center gap-4">
                     <div className="p-2 bg-white rounded-lg shadow-sm"><Mail size={18} className="text-[#01311F]"/></div>
                     <span className="text-gray-600">{viewingRequest.email}</span>
                   </div>
                   <div className="flex items-center gap-4">
                     <div className="p-2 bg-white rounded-lg shadow-sm"><Phone size={18} className="text-[#01311F]"/></div>
                     <span className="text-gray-600">{viewingRequest.phone}</span>
                   </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Course Preference</h4>
                <div className="p-6 bg-[#01311F] rounded-2xl text-white shadow-xl shadow-[#01311F]/10">
                   <p className="text-[#B99A49] text-[10px] font-black uppercase tracking-widest mb-1">{viewingRequest.domain}</p>
                   <p className="text-xl font-bold">{viewingRequest.course || 'Direct Program Enrollment'}</p>
                   <div className="mt-6 flex items-center gap-2 text-white/50 text-xs">
                     <Calendar size={14} /> Submitted: {new Date(viewingRequest.createdAt!).toLocaleDateString('en-GB')}
                   </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <Button variant="secondary" onClick={() => setViewingRequest(null)}>Close Window</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deletingRequest} onClose={() => setDeletingRequest(null)} title="Confirm Deletion" size="sm">
        <div className="text-center p-4">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Trash2 size={36} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Are you sure?</h3>
          <p className="text-gray-500 mb-8 leading-relaxed">
            This action will permanently remove <b>{deletingRequest?.name}</b>'s enrollment request from the database. This cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1 rounded-xl" onClick={() => setDeletingRequest(null)}>Keep Record</Button>
            <Button variant="danger" className="flex-1 rounded-xl" onClick={() => deletingRequest && handleDelete(deletingRequest.id)}>Confirm Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EnrollmentPage;