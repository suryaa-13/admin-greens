import React, { useEffect, useState } from 'react';
import {
  Send,
  Paperclip,
  Mail,
  Trash2,
  Search,
  X,
  FileText
} from 'lucide-react';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import axios from 'axios';
import { getToken } from '../utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

interface Contact {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  contactType: string;
  domainId: number;
  courseId: number;
  createdAt: string;
}

interface Domain {
  id: number;
  domainId: number; // Your API returns "domainId": 1
  domain: string; // Your API returns "domain": "Domainn1"
  title: string;  // Your API also returns "title": "aws"
}

interface Course {
  id: number;
  courseId: number;
  title: string;    // Based on your domain data, this is likely 'title'
  domainId: number;
  name?: string;    // Optional, just in case
}

const BulkMailPage = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'GENERAL' | 'COURSE'>('ALL');

  // Metadata for Targeted Selection
  const [domains, setDomains] = useState<Domain[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const [isComposing, setIsComposing] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    targetType: 'GENERAL',
    domainId: 0,
    courseId: 0,
    subject: '',
    message: '',
  });

  useEffect(() => {
    fetchContacts();
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    try {
      const token = getToken();
      const [domRes, courRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/domain/admin/all`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/api/courses/admin/all`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setDomains(domRes.data.data || domRes.data);
      setCourses(courRes.data.data || courRes.data);
    } catch (err) {
      console.error("Failed to load metadata for dropdowns");
    }
  };
console.log("domain",domains,"course",courses);

  const fetchContacts = async () => {
    setFetching(true);
    try {
      const token = getToken();
      const res = await axios.get(`${API_BASE_URL}/api/mail/contacts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(res.data.data || res.data);
    } catch {
      toast.error('Failed to load contacts');
    } finally {
      setFetching(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Remove this contact?')) return;
    try {
      const token = getToken();
      await axios.delete(`${API_BASE_URL}/api/mail/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(prev => prev.filter(c => c.id !== id));
      toast.success('Contact removed');
    } catch {
      toast.error('Could not delete contact');
    }
  };

  const filteredContacts = contacts.filter(c => {
    const matchesSearch =
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.fullName && c.fullName.toLowerCase().includes(search.toLowerCase()));
    const matchesType =
      filterType === 'ALL' ? true : 
      filterType === 'GENERAL' ? c.contactType === 'GENERAL' : c.courseId !== 0;
    return matchesSearch && matchesType;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return toast.error('Session expired');

    setLoading(true);
    try {
      const data = new FormData();
      data.append('mode', 'ADMIN_BULK');
      data.append('targetType', formData.targetType);
      data.append('domainId', String(formData.domainId));
      data.append('courseId', String(formData.courseId));
      data.append('subject', formData.subject);
      data.append('message', formData.message);

      if (file) {
        data.append('attachment', file);
      }

      const res = await axios.post(`${API_BASE_URL}/api/mail/admin`, data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' 
        }
      });

      toast.success(`Broadcast sent to ${res.data.sent} users`);
      setIsComposing(false);
      setFile(null);
      setFormData({ targetType: 'GENERAL', domainId: 0, courseId: 0, subject: '', message: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send mail');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Mail className="text-indigo-600" /> Mail Management
          </h1>
          <p className="text-gray-600">Broadcast updates to your leads and subscribers</p>
        </div>
        <Button onClick={() => setIsComposing(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg transition-all shadow-md active:scale-95">
          <Send size={18} /> Compose Broadcast
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(['ALL', 'GENERAL', 'COURSE'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-md text-xs font-bold transition-colors ${filterType === type ? 'bg-indigo-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
            <tr>
              <th className="px-6 py-4 text-left">User</th>
              <th className="px-6 py-4 text-center">Category</th>
              <th className="px-6 py-4 text-center">Added</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {fetching ? (
              <tr><td colSpan={4} className="py-16 text-center text-gray-400">Loading contacts...</td></tr>
            ) : filteredContacts.length ? (
              filteredContacts.map(c => (
                <tr key={c.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{c.fullName || 'Anonymous'}</div>
                    <div className="text-sm text-gray-500">{c.email}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-1 bg-gray-100 text-[10px] font-bold rounded uppercase text-gray-600 tracking-wider">
                      {c.contactType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-500">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(c.id)} className="text-rose-500 hover:text-rose-700 p-2 hover:bg-rose-50 rounded-full transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="py-16 text-center text-gray-400">No contacts found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal - Compose Broadcast */}
      {isComposing && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl w-full max-w-2xl space-y-4 shadow-2xl scale-in-center">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-bold text-gray-800">New Broadcast</h2>
              <button type="button" onClick={() => setIsComposing(false)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20}/>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Target Audience</label>
                <select
                  value={formData.targetType}
                  onChange={e => setFormData({ ...formData, targetType: e.target.value, domainId: 0, courseId: 0 })}
                  className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white cursor-pointer"
                >
                  <option value="GENERAL">General Subscribers</option>
                  <option value="DOMAIN_SPECIFIC">By Domain</option>
                  <option value="COURSE_SPECIFIC">By Course</option>
                  <option value="ALL_COURSES">All Enrolled Students</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Subject</label>
                <input
                  required
                  placeholder="Campaign Subject"
                  className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              {/* DOMAIN SELECTION - Conditional */}
{/* DOMAIN SELECTION - Conditional */}
{(formData.targetType === 'DOMAIN_SPECIFIC' || formData.targetType === 'COURSE_SPECIFIC') && (
  <div className="space-y-1 animate-in slide-in-from-left duration-200">
    <label className="text-xs font-bold text-indigo-600 uppercase">Target Domain</label>
    <select
      required
      value={formData.domainId}
      onChange={e => setFormData({ ...formData, domainId: Number(e.target.value), courseId: 0 })}
      className="w-full border border-indigo-200 bg-indigo-50/50 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
    >
      <option value="">-- Select Domain --</option>
      {domains.map(dom => (
        <option key={dom.id} value={dom.domainId}>
          {dom.domain || dom.title} 
        </option>
      ))}
    </select>
  </div>
)}

{/* COURSE SELECTION - Shows if user wants course targeting OR if a domain is selected */}
{formData.targetType === 'COURSE_SPECIFIC' && (
  <div className="space-y-1 animate-in slide-in-from-left duration-200">
    <label className="text-xs font-bold text-indigo-600 uppercase">Target Course</label>
    <select
      // Only required if courses actually exist for this domain
      required={courses.some(c => Number(c.domainId) === Number(formData.domainId))}
      disabled={!formData.domainId}
      value={formData.courseId}
      onChange={e => setFormData({ ...formData, courseId: Number(e.target.value) })}
      className="w-full border border-indigo-200 bg-indigo-50/50 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
    >
      <option value="0">-- All Courses in this Domain --</option>
      {courses
        .filter(c => Number(c.domainId) === Number(formData.domainId))
        .map(course => (
          <option key={course.id} value={course.courseId || course.id}>
            {course.title || course.name} 
          </option>
        ))}
    </select>
    
    {/* Graceful Message if no courses exist */}
    {formData.domainId !== 0 && courses.filter(c => Number(c.domainId) === Number(formData.domainId)).length === 0 && (
      <div className="p-2 bg-amber-50 border border-amber-200 rounded-md mt-1">
         <p className="text-[10px] text-amber-700 leading-tight">
           <strong>Note:</strong> No specific courses found for this domain. Email will be sent to the general domain list.
         </p>
      </div>
    )}
  </div>
)}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Message Body</label>
              <textarea
                required
                rows={6}
                placeholder="Write your email content here..."
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none min-h-[150px]"
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            {/* File Upload Section */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                <Paperclip size={14} /> Attachment (Max 5MB)
              </label>
              <div className="relative group">
                <div className={`flex items-center gap-4 p-4 border-2 border-dashed rounded-xl transition-all ${file ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 bg-gray-50 group-hover:border-indigo-300'}`}>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <FileText className={file ? "text-indigo-600" : "text-gray-400"} size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{file ? file.name : "Click to upload a file"}</p>
                      <p className="text-xs text-gray-500">{file ? `${(file.size / 1024).toFixed(1)} KB` : "PDF, PNG, JPG or DOCX"}</p>
                    </div>
                  </div>
                  {file && (
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); setFile(null); }} 
                      className="ml-auto p-1.5 hover:bg-white rounded-full text-gray-400 hover:text-rose-500 z-30 transition-colors"
                    >
                      <X size={16}/>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button 
                type="button" 
                onClick={() => setIsComposing(false)} 
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <Button 
                type="submit" 
                disabled={loading} 
                className="px-8 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 flex items-center gap-2 transition-all shadow-md"
              >
                {loading ? 'Sending...' : <><Send size={16} /> Send Broadcast</>}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default BulkMailPage;