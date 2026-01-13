import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, RefreshCw, Power, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { courseService } from '../services/course.service';
import type { Course } from '../types/index';
import Modal from '../components/ui/Modal';
import CourseForm from '../components/forms/CourseForm';
import { IMAGE_URL } from '../utils/storage';

const CoursePage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Stats Logic
  const totalCount = courses.length;
  const activeCount = courses.filter(c => c.isActive).length;
  const inactiveCount = totalCount - activeCount;

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getAll();
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Sync failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      if (selectedCourse) {
        const response = await courseService.update(selectedCourse.id, formData);
        const updatedData = (response as any).course || response;
        setCourses(prev => prev.map(item => item.id === selectedCourse.id ? { ...item, ...updatedData } : item));
        toast.success('Course Updated');
      } else {
        const response = await courseService.create(formData);
        const newData = (response as any).course || response;
        setCourses(prev => [newData, ...prev]);
        toast.success('Course Created');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Save failed');
    }
  };
const handleDelete = async (course: Course) => {
  // Step 1: Standard confirmation
  if (!window.confirm(`⚠️ PERMANENT DELETE ⚠️\n\nAre you sure you want to delete "${course.title}"?`)) {
    return;
  }

  // Step 2: Strict text confirmation
  const userInput = prompt('Please type "DELETE" to confirm permanent removal:');
  if (userInput?.toUpperCase() !== 'DELETE') {
    toast.error('Deletion cancelled: Confirmation text did not match.');
    return;
  }

  try {
    setLoading(true);
    await courseService.delete(course.id);
    
    // Update local state to remove the item
    setCourses(prev => prev.filter(c => c.id !== course.id));
    
    // Adjust pagination if the last item on a page was deleted
    if (pagedItems.length === 1 && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
    
    toast.success('Asset permanently removed');
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to delete course');
  } finally {
    setLoading(false);
  }
};
  const handleToggleStatus = async (course: Course) => {
    const oldStatus = course.isActive;
    setCourses(prev => prev.map(c => c.id === course.id ? { ...c, isActive: !oldStatus } : c));
    try {
      const fd = new FormData();
      fd.append('isActive', (!oldStatus).toString());
      await courseService.update(course.id, fd);
      toast.success(oldStatus ? 'Course Hidden' : 'Course Live');
    } catch {
      setCourses(prev => prev.map(c => c.id === course.id ? { ...c, isActive: oldStatus } : c));
      toast.error('Status sync failed');
    }
  };

  const filtered = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const pagedItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const labelClasses = "text-[10px] font-black uppercase tracking-widest text-gray-400";

  return (
    <div className="p-2 md:p-8 md:ml-[250px] lg:ml-0 transition-all duration-300">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Course Directory</h1>
          <p className="text-gray-400 text-[11px] font-bold uppercase tracking-[0.2em] mt-1">Management Portal</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchCourses} className="p-3 border border-gray-200 rounded-xl hover:bg-white hover:shadow-md transition-all active:rotate-180 duration-500"><RefreshCw size={20}/></button>
          <button onClick={() => { setSelectedCourse(null); setIsModalOpen(true); }} className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-xl active:scale-95 transition-all">
            <Plus size={18} strokeWidth={3}/> Add Course
          </button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
          <p className={labelClasses}>Total Assets</p>
          <p className="text-3xl font-black text-gray-900 mt-1">{totalCount}</p>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm border-l-4 border-l-indigo-500">
          <p className={`${labelClasses} text-indigo-500`}>Active Now</p>
          <p className="text-3xl font-black text-gray-900 mt-1">{activeCount}</p>
        </div>
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm border-l-4 border-l-rose-500">
          <p className={`${labelClasses} text-rose-500`}>Hidden / Inactive</p>
          <p className="text-3xl font-black text-gray-900 mt-1">{inactiveCount}</p>
        </div>
      </div>

      <div className="mb-8 relative max-w-md">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Filter by title..." 
          className="w-full pl-14 pr-6 py-4 rounded-[20px] bg-white shadow-sm outline-none text-sm font-bold border border-transparent focus:border-indigo-100"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className={`px-8 py-6 ${labelClasses}`}>Preview</th>
                <th className={`px-8 py-6 ${labelClasses}`}>Identity</th>
                <th className={`px-8 py-6 ${labelClasses}`}>People</th>
                <th className={`px-8 py-6 ${labelClasses}`}>Status</th>
                <th className={`px-8 py-6 ${labelClasses} text-right`}>Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pagedItems.map(course => (
                <tr key={course.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="h-14 w-14 rounded-[16px] overflow-hidden border border-gray-100 bg-gray-50 shadow-inner">
                      {course.image ? (
                        <img src={`${IMAGE_URL}${course.image}`} className="h-full w-full object-cover" alt="" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-200"><ImageIcon size={20}/></div>
                      )}
                    </div>
                  </td>
                 <td className="px-8 py-6">
  <div className="text-[15px] font-black text-gray-900">{course.title}</div>
  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">
    CID: {course.courseId} • DID: {course.domainId} • {course.duration}
  </div>
</td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black tracking-tighter border border-emerald-100">
                      {course.price}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`flex items-center gap-2 w-fit px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.15em] ${
                      course.isActive ? 'bg-indigo-50 text-indigo-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${course.isActive ? 'bg-indigo-500 animate-pulse' : 'bg-rose-400'}`} />
                      {course.isActive ? 'Active' : 'Hidden'}
                    </div>
                  </td>
                <td className="px-8 py-6 text-right">
  <div className="flex items-center justify-end gap-2">
    {/* Edit Button */}
    <button 
      onClick={() => { setSelectedCourse(course); setIsModalOpen(true); }} 
      className="p-3 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-black hover:shadow-md transition-all"
    >
      <Edit2 size={16}/>
    </button>

    {/* Status Toggle */}
    <button 
      onClick={() => handleToggleStatus(course)} 
      className={`p-3 rounded-xl bg-white border border-gray-100 transition-all hover:shadow-md ${course.isActive ? 'text-amber-500' : 'text-indigo-500'}`}
    >
      <Power size={16}/>
    </button>

    {/* DELETE BUTTON - ADD THIS */}
    <button 
      onClick={() => handleDelete(course)} 
      className="p-3 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 hover:shadow-md transition-all"
      title="Delete Asset"
    >
      <Trash2 size={16}/>
    </button>
  </div>
</td>
                </tr>
              ))}
            </tbody>
          </table>
          {pagedItems.length === 0 && (
            <div className="p-20 text-center font-black text-gray-300 uppercase tracking-widest">No assets found</div>
          )}
        </div>

        <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
          <span className={labelClasses}>Page {currentPage} of {totalPages || 1}</span>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-2 rounded-xl bg-white border border-gray-200 disabled:opacity-20 transition-all hover:shadow-md active:scale-90"
            >
              <ChevronLeft size={20}/>
            </button>
            <button 
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2 rounded-xl bg-white border border-gray-200 disabled:opacity-20 transition-all hover:shadow-md active:scale-90"
            >
              <ChevronRight size={20}/>
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedCourse ? "Modify Course" : "Create Asset"} size="lg">
        <CourseForm course={selectedCourse} onSubmit={handleSubmit} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default CoursePage;