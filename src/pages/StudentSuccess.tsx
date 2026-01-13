

import React, { useEffect, useState } from 'react';
import { 
  Plus, Search, Edit2, Trash2, RefreshCw, ToggleLeft, ToggleRight, 
  Power, User, Star, Briefcase, Clock,
  Grid, List
} from 'lucide-react'; 
import toast from 'react-hot-toast';
import type { StudentSuccess } from '../types/index';
import { studentSuccessService } from '../services/studentSuccess.service';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import StudentSuccessForm from '../components/forms/StudentSuccessForm';
import { IMAGE_URL } from '../utils/storage';

const StudentSuccessPage: React.FC = () => {
  const [students, setStudents] = useState<StudentSuccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentSuccess | null>(null);
  const [filterDomain, setFilterDomain] = useState<string>('all');
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentSuccessService.getAll();
      const studentsArray = Array.isArray(data) ? data : [];
      setStudents(studentsArray);
    } catch (error: any) {
      console.error("Error fetching student success stories:", error);
      toast.error(error.response?.data?.message || 'Failed to fetch student success stories');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchStudents();
    setIsRefreshing(false);
  };

  const handleCreate = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleEdit = async (student: StudentSuccess) => {
    try {
      const fullData = await studentSuccessService.getById(student.id);
      setSelectedStudent(fullData);
      setIsModalOpen(true);
    } catch (error) {
      toast.error('Failed to load student data');
    }
  };

  const handleToggleStatus = async (student: StudentSuccess) => {
    try {
      const newStatus = !student.isActive;
      const action = newStatus ? 'activate' : 'deactivate';
      
      if (!window.confirm(`Are you sure you want to ${action} "${student.name}"?`)) {
        return;
      }
      
      const formData = new FormData();
      formData.append('isActive', newStatus.toString());
      
      await studentSuccessService.update(student.id, formData);
      toast.success(`Student success story ${action}d successfully`);
      fetchStudents();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update student status');
    }
  };

  const handleDelete = async (student: StudentSuccess) => {
    if (window.confirm(`Are you sure you want to delete "${student.name}"?`)) {
      const userInput = prompt('Type "DELETE" to confirm:');
      if (userInput?.toUpperCase() === 'DELETE') {
        try {
          await studentSuccessService.delete(student.id);
          toast.success('Deleted successfully');
          fetchStudents();
        } catch (error: any) {
          toast.error('Failed to delete');
        }
      }
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      if (selectedStudent) {
        await studentSuccessService.update(selectedStudent.id, formData);
        toast.success('Updated successfully');
      } else {
        await studentSuccessService.create(formData);
        toast.success('Created successfully');
      }
      setIsModalOpen(false);
      fetchStudents();
    } catch (error: any) {
      toast.error('Failed to save story');
    }
  };

  // Logic to derive unique options for filters
  const uniqueDomains = Array.from(new Set(students.map(s => s.domainId?.toString()).filter(Boolean)));
  const uniqueCourses = Array.from(new Set(students.map(s => s.courseId?.toString()).filter(Boolean)));

  const filteredStudents = students.filter((student) => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.review.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.placement?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesDomain = filterDomain === 'all' || student.domainId?.toString() === filterDomain;
    const matchesCourse = filterCourse === 'all' || student.courseId?.toString() === filterCourse;
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && student.isActive) ||
      (statusFilter === 'inactive' && !student.isActive);

    return matchesSearch && matchesDomain && matchesCourse && matchesStatus;
  });

  const renderStars = (rating: number) => (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Success Management</h1>
          <p className="mt-1 text-gray-600">Manage student success stories and reviews</p>
        </div>
        <div className="flex gap-3">
          <div className="flex rounded-lg border border-gray-300 bg-white p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <List size={16} className="inline mr-1" /> List
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Grid size={16} className="inline mr-1" /> Grid
            </button>
          </div>
          
          <Button 
            onClick={handleRefresh} 
            variant="outline"
            icon={<RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />}
            disabled={isRefreshing}
          >
            Refresh
          </Button>
          <Button onClick={handleCreate} icon={<Plus size={20} />}>
            Add Success Story
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar - USES ALL STATE SETTERS */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search by name, course, or review..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select 
              value={filterDomain} 
              onChange={(e) => setFilterDomain(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Domains</option>
              {uniqueDomains.map(id => <option key={id} value={id}>Domain {id}</option>)}
            </select>
            <select 
              value={filterCourse} 
              onChange={(e) => setFilterCourse(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Courses</option>
              {uniqueCourses.map(id => <option key={id} value={id}>Course {id}</option>)}
            </select>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600" />
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center shadow-sm border border-gray-200">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No results found</h3>
          <p className="mt-2 text-gray-500">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <>
          {viewMode === 'list' ? (
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Course & Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Placement</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {student.image ? (
                            <img src={`${IMAGE_URL}${student.image}`} alt="" className="h-10 w-10 rounded-full object-cover" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center"><User size={20} className="text-indigo-600" /></div>
                          )}
                          <div className="font-medium text-gray-900">{student.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{student.course}</div>
                        <div className="mt-1">{renderStars(student.rating)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Briefcase size={14} className="mr-2 text-gray-400" /> {student.placement || 'N/A'}
                        </div>
                        {student.duration && <div className="text-xs text-gray-500 flex items-center mt-1"><Clock size={12} className="mr-1" /> {student.duration}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(student)}
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${student.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        >
                          {student.isActive ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                          {student.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(student)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><Edit2 size={16} /></button>
                          <button onClick={() => handleDelete(student)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredStudents.map((student) => (
                <div key={student.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      {student.image ? (
                        <img src={`${IMAGE_URL}${student.image}`} alt="" className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-50" />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600"><User size={24} /></div>
                      )}
                      <div>
                        <h3 className="font-bold text-gray-900">{student.name}</h3>
                        <span className="text-xs text-indigo-600 font-medium">Domain {student.domainId}</span>
                      </div>
                    </div>
                    <button onClick={() => handleToggleStatus(student)} className={student.isActive ? 'text-green-600' : 'text-gray-400'}><Power size={18} /></button>
                  </div>
                  <p className="text-sm text-gray-600 italic line-clamp-3 mb-4">"{student.review}"</p>
                  <div className="flex justify-between items-center border-t pt-4 mt-auto">
                    <div>{renderStars(student.rating)}</div>
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(student)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(student)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedStudent(null); }}
        title={selectedStudent ? 'Edit Story' : 'New Story'}
        size="lg"
      >
        <StudentSuccessForm
          student={selectedStudent}
          onSubmit={handleSubmit}
          onCancel={() => { setIsModalOpen(false); setSelectedStudent(null); }}
        />
      </Modal>
    </div>
  );
};

export default StudentSuccessPage;