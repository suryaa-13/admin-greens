// pages/admin/Certificates.tsx
import React, { useEffect, useState ,useRef} from 'react';
import { Plus, Search, Edit2,ChevronDown, Trash2, Check, RefreshCw, ToggleLeft, ToggleRight, Power, Award, CheckCircle, ShieldCheck  } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Certificate } from '../types/index';
import { certificateService } from '../services/certificate.service';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import CertificateForm from '../components/forms/CertificateForm';
import { IMAGE_URL } from '../utils/storage';
interface CertificateColumn {
  key: string;
  header: string;
  render?: (value: any, row: Certificate) => React.ReactNode;
}
const Certificates: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [filterDomain, setFilterDomain] = useState<string>('all');
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

const [isStatusOpen, setIsStatusOpen] = useState(false);
const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      console.log("Fetching certificates for admin...");
      const data = await certificateService.getAll();
      console.log("Admin certificates data:", data);
      
      const certificatesArray = Array.isArray(data) ? data : [];
      setCertificates(certificatesArray);
    } catch (error: any) {
      console.error("Error fetching certificates:", error);
      toast.error(error.response?.data?.message || 'Failed to fetch certificates');
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
  const handleClick = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsStatusOpen(false);
    }
  };
  document.addEventListener('mousedown', handleClick);
  return () => document.removeEventListener('mousedown', handleClick);
}, []);
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchCertificates();
    setIsRefreshing(false);
  };

  const handleCreate = () => {
    setSelectedCertificate(null);
    setIsModalOpen(true);
  };

  const handleEdit = async (certificate: Certificate) => {
    try {
      setSelectedCertificate(certificate);
      setIsModalOpen(true);
    } catch (error) {
      toast.error('Failed to load certificate data');
    }
  };

  const handleToggleStatus = async (certificate: Certificate) => {
    try {
      const newStatus = !certificate.isActive;
      const action = newStatus ? 'activate' : 'deactivate';
      
      if (!window.confirm(`Are you sure you want to ${action} "${certificate.sectionTitle}"?`)) {
        return;
      }
      
      const formData = new FormData();
      formData.append('domainId', certificate.domainId.toString());
      formData.append('courseId', certificate.courseId.toString());
      formData.append('sectionTitle', certificate.sectionTitle);
      formData.append('steps', JSON.stringify(certificate.steps));
      formData.append('isActive', newStatus.toString());
      
      await certificateService.update(certificate.id, formData);
      
      toast.success(`Certificate ${action}d successfully`);
      fetchCertificates();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update certificate status');
    }
  };

  const handleDelete = async (certificate: Certificate) => {
    if (window.confirm(`⚠️ PERMANENT DELETE ⚠️\n\nAre you sure you want to PERMANENTLY delete "${certificate.sectionTitle}"?\n\nThis action cannot be undone and will delete:\n• Certificate information\n• Associated certificate image\n• All steps\n\nType "DELETE" to confirm:`)) {
      const userInput = prompt('Please type "DELETE" to confirm permanent deletion:');
      
      if (userInput?.toUpperCase() === 'DELETE') {
        try {
          await certificateService.delete(certificate.id);
          toast.success('Certificate permanently deleted');
          fetchCertificates();
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Failed to delete certificate');
        }
      } else {
        toast.error('Deletion cancelled. Certificate was not deleted.');
      }
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      if (selectedCertificate) {
        await certificateService.update(selectedCertificate.id, formData);
        toast.success('Certificate updated successfully');
      } else {
        await certificateService.create(formData);
        toast.success('Certificate created successfully');
      }
      setIsModalOpen(false);
      fetchCertificates();
    } catch (error: any) {
      console.error("Error submitting certificate:", error);
      toast.error(error.response?.data?.message || 'Failed to save certificate');
    }
  };

  const filteredCertificates = certificates.filter((certificate) => {
    const matchesSearch = 
      (certificate.sectionTitle?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      certificate.steps?.some(step => 
        step.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        step.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesDomain = 
      filterDomain === 'all' || 
      certificate.domainId?.toString() === filterDomain;

    const matchesCourse = 
      filterCourse === 'all' || 
      certificate.courseId?.toString() === filterCourse;

    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && certificate.isActive) ||
      (statusFilter === 'inactive' && !certificate.isActive);

    return matchesSearch && matchesDomain && matchesCourse && matchesStatus;
  });

  const getIconComponent = (iconName: string, size: number = 16) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'check-circle': <CheckCircle size={size} className="text-green-500" />,
      'award': <Award size={size} className="text-yellow-500" />,
      'shield': <ShieldCheck size={size} className="text-blue-500" />,
      'star': <Award size={size} className="text-purple-500" />,
      'certificate': <ShieldCheck size={size} className="text-red-500" />,
    };
    return iconMap[iconName] || <CheckCircle size={size} className="text-gray-500" />;
  };

const columns: CertificateColumn[] = [
  { key: 'id', header: 'ID' },
  { 
    key: 'sectionTitle', 
    header: 'Certificate Section',
    render: (value: string, row: Certificate) => (
      <div>
        <div className="font-medium text-gray-900">{value}</div>
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <CheckCircle size={14} className="text-green-500" />
          <span>{row.steps?.length || 0} steps</span>
        </div>
      </div>
    )
  },
  { 
    key: 'certificateImage', 
    header: 'Certificate Image',
    render: (imageUrl: string) => (
      <div className="flex items-center">
        <img
          src={`${IMAGE_URL}${imageUrl}`}
          alt="Certificate"
          className="h-12 w-16 rounded-lg object-cover border shadow-sm hover:opacity-90 transition-opacity"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x48?text=Certificate';
          }}
        />
      </div>
    )
  },
  { 
    key: 'domainId', 
    header: 'Domain/Course',
    render: (value: number, row: Certificate) => (
      <div className="flex flex-col gap-1">
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
          value === 0 ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {value === 0 ? 'Landing Page' : `Domain ${value}`}
        </span>
        {row.courseId > 0 && (
          <span className="text-xs text-gray-500">Course: {row.courseId}</span>
        )}
      </div>
    )
  },
  { 
    key: 'steps', 
    header: 'Steps Preview',
    render: (steps: any[]) => (
      <div className="max-w-xs">
        <div className="flex flex-col gap-1">
          {steps?.slice(0, 2).map((step, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              {getIconComponent(step.icon, 14)}
              <span className="truncate">{step.title}</span>
            </div>
          ))}
          {steps?.length > 2 && (
            <div className="text-xs text-gray-500">+{steps.length - 2} more steps</div>
          )}
        </div>
      </div>
    )
  },
  { 
    key: 'isActive', 
    header: 'Status',
    render: (value: boolean, row: Certificate) => (
      <button
        onClick={() => handleToggleStatus(row)}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors hover:opacity-90 ${
          value 
            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
            : 'bg-red-100 text-red-800 hover:bg-red-200'
        }`}
        title={`Click to ${value ? 'deactivate' : 'activate'}`}
      >
        {value ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
        <span className="font-medium">{value ? 'Active' : 'Inactive'}</span>
      </button>
    )
  },
  {
    key: 'actions',
    header: 'Actions',
    render: (_: any, row: Certificate) => (
      <div className="flex space-x-2">
        <button
          onClick={() => handleEdit(row)}
          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 transition-colors"
          title="Edit"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={() => handleToggleStatus(row)}
          className={`rounded-lg p-2 transition-colors ${
            row.isActive 
              ? 'text-amber-600 hover:bg-amber-50' 
              : 'text-green-600 hover:bg-green-50'
          }`}
          title={row.isActive ? 'Deactivate' : 'Activate'}
        >
          <Power size={18} />
        </button>
        <button
          onClick={() => handleDelete(row)}
          className="rounded-lg p-2 text-red-600 hover:bg-red-50 transition-colors"
          title="Delete Permanently"
        >
          <Trash2 size={18} />
        </button>
      </div>
    )
  }
];

  const renderTable = () => {
    if (!Array.isArray(filteredCertificates)) {
      return <div className="text-center py-8 text-red-600">Error: Certificates data is not valid</div>;
    }

    return (
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
       <tbody className="divide-y divide-gray-200 bg-white">
  {filteredCertificates.map((certificate) => (
    <tr key={certificate.id} className="hover:bg-gray-50">
      {columns.map((col) => {
        // Pre-fetch the value to avoid inline casting issues
        const value = certificate[col.key as keyof Certificate];
        
        return (
          <td key={`${certificate.id}-${col.key}`} className="whitespace-nowrap px-6 py-4">
            {col.render 
              ? col.render(value, certificate)
              : String(value ?? '')
            }
          </td>
        );
      })}
    </tr>
  ))}
</tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Certificates Management</h1>
          <p className="mt-1 text-gray-600">Manage certificate sections and steps for courses</p>
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
            Add Certificate
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
   <div className="mb-6 rounded-lg bg-white p-4 shadow-sm border border-gray-100">
  <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
    
    {/* 1. Search Input */}
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <input
        type="search"
        placeholder="Search by section title or step content..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
      />
    </div>

    {/* 2. Filter Group */}
    <div className="flex flex-wrap items-center gap-3">
      
      {/* Domain Filter */}
      <div className="flex items-center gap-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Domain:</label>
        <select 
          value={filterDomain}
          onChange={(e) => setFilterDomain(e.target.value)}
          className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:border-indigo-500 transition-all"
        >
          <option value="all">All Domains</option>
          <option value="0">Landing Page</option>
          <option value="1">Domain 1</option>
          <option value="2">Domain 2</option>
        </select>
      </div>

      {/* Course Filter */}
      <div className="flex items-center gap-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Course:</label>
        <select 
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:border-indigo-500 transition-all"
        >
          <option value="all">All Courses</option>
          <option value="1">Course 1</option>
          <option value="2">Course 2</option>
        </select>
      </div>

      {/* Status Filter Dropdown (Your existing logic) */}
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsStatusOpen(!isStatusOpen)}
          className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:border-indigo-300 transition-all min-w-[140px]"
        >
          <div className={`w-1.5 h-1.5 rounded-full ${
            statusFilter === 'active' ? 'bg-emerald-500' : 
            statusFilter === 'inactive' ? 'bg-rose-500' : 'bg-gray-300'
          }`} />
          <span className="flex-1 text-left capitalize">{statusFilter} Status</span>
          <ChevronDown size={14} className={isStatusOpen ? 'rotate-180' : ''} />
        </button>

        {isStatusOpen && (
          <div className="absolute right-0 mt-2 w-full min-w-[160px] bg-white border border-gray-100 rounded-2xl shadow-xl p-1 z-50">
            {['all', 'active', 'inactive'].map((opt) => (
              <button
                key={opt}
                onClick={() => { setStatusFilter(opt); setIsStatusOpen(false); }}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-bold ${
                  statusFilter === opt ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                {statusFilter === opt && <Check size={12} />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
</div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600" />
            <p className="text-sm text-gray-600">Loading certificates...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Empty State */}
          {filteredCertificates.length === 0 ? (
            <div className="rounded-lg bg-white p-8 text-center shadow-sm">
              <Award className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No certificates found</h3>
              <p className="mt-2 text-gray-500">
                {searchTerm || filterDomain !== 'all' || filterCourse !== 'all' || statusFilter !== 'all'
                  ? 'Try changing your search or filter criteria'
                  : 'Get started by creating your first certificate section'
                }
              </p>
              <div className="mt-6">
                <Button onClick={handleCreate}>Create Certificate</Button>
              </div>
            </div>
          ) : (
            <>
            {/* Stats Summary */}
      {!loading && certificates.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-600">Total Certificates</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{certificates.length}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-600">Active Certificates</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {certificates.filter(c => c.isActive).length}
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-600">Inactive Certificates</p>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {certificates.filter(c => !c.isActive).length}
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-600">Total Steps</p>
            <p className="mt-2 text-3xl font-bold text-purple-600">
              {certificates.reduce((acc, cert) => acc + (cert.steps?.length || 0), 0)}
            </p>
          </div>
        </div>
      )}
              {/* Certificates Count */}
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {filteredCertificates.length} of {certificates.length} certificates
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="font-medium">Active: {certificates.filter(c => c.isActive).length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <span className="font-medium">Inactive: {certificates.filter(c => !c.isActive).length}</span>
                  </div>
                </div>
              </div>

              {/* Table View */}
              <div className="hidden lg:block">
                {renderTable()}
              </div>

              {/* Card View for mobile */}
              <div className="grid grid-cols-1 gap-6 lg:hidden md:grid-cols-2">
                {filteredCertificates.map((certificate) => (
                  <div key={certificate.id} className={`overflow-hidden rounded-lg border shadow-sm ${
                    certificate.isActive ? 'bg-white' : 'bg-gray-50'
                  }`}>
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Certificate Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={`${IMAGE_URL}${certificate.certificateImage}`}
                            alt={certificate.sectionTitle}
                            className="h-20 w-24 rounded-lg object-cover border shadow-sm"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/96x80?text=Certificate';
                            }}
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 truncate">{certificate.sectionTitle}</h3>
                              <div className="mt-1 flex items-center gap-3">
                                <span className="text-sm text-gray-500">
                                  {certificate.steps?.length || 0} steps
                                </span>
                                <span className="text-sm text-gray-500">
                                  Domain: {certificate.domainId === 0 ? 'Landing' : certificate.domainId}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <button
                                onClick={() => handleToggleStatus(certificate)}
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors hover:opacity-90 ${
                                  certificate.isActive 
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                                }`}
                                title={`Click to ${certificate.isActive ? 'deactivate' : 'activate'}`}
                              >
                                {certificate.isActive ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                                <span className="font-medium">{certificate.isActive ? 'Active' : 'Inactive'}</span>
                              </button>
                            </div>
                          </div>
                          
                          {/* Steps Preview */}
                          <div className="mt-3">
                            <div className="text-sm font-medium text-gray-700 mb-2">Steps:</div>
                            <div className="space-y-1">
                              {certificate.steps?.slice(0, 2).map((step, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  {getIconComponent(step.icon, 14)}
                                  <span className="text-sm text-gray-600 truncate">{step.title}</span>
                                </div>
                              ))}
                              {certificate.steps?.length > 2 && (
                                <div className="text-xs text-gray-500">+{certificate.steps.length - 2} more steps</div>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-4 flex items-center justify-between">
                            <div className="text-xs text-gray-500">
                              Course: {certificate.courseId === 0 ? 'Domain-level' : certificate.courseId}
                            </div>
                            
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(certificate)}
                                className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleToggleStatus(certificate)}
                                className={`rounded-lg p-2 transition-colors ${
                                  certificate.isActive 
                                    ? 'text-amber-600 hover:bg-amber-50' 
                                    : 'text-green-600 hover:bg-green-50'
                                }`}
                                title={certificate.isActive ? 'Deactivate' : 'Activate'}
                              >
                                <Power size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(certificate)}
                                className="rounded-lg p-2 text-red-600 hover:bg-red-50 transition-colors"
                                title="Delete Permanently"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
          setSelectedCertificate(null);
        }}
        title={selectedCertificate ? `Edit Certificate: ${selectedCertificate.sectionTitle}` : 'Create New Certificate Section'}
        size="lg"
      >
        <CertificateForm
          certificate={selectedCertificate}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedCertificate(null);
          }}
        />
      </Modal>

      

  


    </div>
  );
};

export default Certificates;

// pages/admin/Certificates.tsx
// import React, { useEffect, useState } from 'react';
// import { Plus, Search, Edit2, Trash2, RefreshCw, ToggleLeft, ToggleRight, Award, Activity, EyeOff } from 'lucide-react';
// import toast from 'react-hot-toast';
// import type { Certificate } from '../types/index';
// import { certificateService } from '../services/certificate.service';
// import Button from '../components/ui/Button';
// import Modal from '../components/ui/Modal';
// import CertificateForm from '../components/forms/CertificateForm';
// import { IMAGE_URL } from '../utils/storage';

// interface CertificateColumn {
//   key: string;
//   header: string;
//   render?: (value: any, row: Certificate) => React.ReactNode;
// }

// const Certificates: React.FC = () => {
//   const [certificates, setCertificates] = useState<Certificate[]>([]);
//   const [, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
//   const [isRefreshing, setIsRefreshing] = useState(false);
  
//   const [filterDomain, setFilterDomain] = useState<string>(''); 
//   const [filterCourse, setFilterCourse] = useState<string>('');
//   const [statusFilter, setStatusFilter] = useState<string>('all');

//   // Stats Calculations
//   const totalCount = certificates.length;
//   const activeCount = certificates.filter(c => c.isActive).length;
//   const inactiveCount = certificates.filter(c => !c.isActive).length;

//   useEffect(() => {
//     fetchCertificates();
//   }, []);

//   const fetchCertificates = async () => {
//     try {
//       setLoading(true);
//       const data = await certificateService.getAll();
//       setCertificates(Array.isArray(data) ? data : []);
//     } catch (error: any) {
//       toast.error('Failed to fetch certificates');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRefresh = async () => {
//     setIsRefreshing(true);
//     await fetchCertificates();
//     setIsRefreshing(false);
//   };

//   const handleToggleStatus = async (certificate: Certificate) => {
//     const newStatus = !certificate.isActive;
//     const action = newStatus ? 'activate' : 'deactivate';
    
//     // Optimistic UI Update (Optional but feels faster)
//     try {
//       const formData = new FormData();
//       formData.append('domainId', certificate.domainId.toString());
//       formData.append('courseId', certificate.courseId.toString());
//       formData.append('sectionTitle', certificate.sectionTitle);
//       formData.append('steps', JSON.stringify(certificate.steps));
//       formData.append('isActive', newStatus.toString());
      
//       await certificateService.update(certificate.id, formData);
//       toast.success(`Successfully ${action}d!`);
//       fetchCertificates();
//     } catch (error: any) {
//       toast.error('Status update failed');
//     }
//   };

//   const handleSubmit = async (formData: FormData) => {
//     try {
//       if (selectedCertificate) {
//         await certificateService.update(selectedCertificate.id, formData);
//         toast.success('Updated successfully');
//       } else {
//         await certificateService.create(formData);
//         toast.success('Created successfully');
//       }
//       setIsModalOpen(false);
//       fetchCertificates();
//     } catch (error: any) {
//       toast.error('Save failed');
//     }
//   };

//   const filteredCertificates = certificates.filter((cert) => {
//     const matchesSearch = cert.sectionTitle.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesDomain = filterDomain === '' || cert.domainId.toString() === filterDomain;
//     const matchesCourse = filterCourse === '' || cert.courseId.toString() === filterCourse;
//     const matchesStatus = 
//       statusFilter === 'all' || 
//       (statusFilter === 'active' && cert.isActive) ||
//       (statusFilter === 'inactive' && !cert.isActive);

//     return matchesSearch && matchesDomain && matchesCourse && matchesStatus;
//   });

//   const columns: CertificateColumn[] = [
//     { key: 'id', header: 'ID' },
//     { 
//       key: 'sectionTitle', 
//       header: 'Certificate Details',
//       render: (val, row) => (
//         <div className="flex items-center gap-3">
//           <img src={`${IMAGE_URL}${row.certificateImage}`} className="h-10 w-14 object-cover rounded shadow-sm border bg-gray-50" />
//           <div>
//             <div className="font-bold text-gray-900">{val}</div>
//             <div className="text-xs text-indigo-600 font-medium">Domain: {row.domainId} • Course: {row.courseId}</div>
//           </div>
//         </div>
//       )
//     },
//     { 
//       key: 'isActive', 
//       header: 'Status Control',
//       render: (active, row) => (
//         <button 
//           onClick={() => handleToggleStatus(row)} 
//           className={`group flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all border-2 ${
//             active 
//             ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:border-green-300' 
//             : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:border-red-300'
//           }`}
//           title={active ? "Click to Deactivate" : "Click to Activate"}
//         >
//           {active ? (
//             <>
//               <ToggleRight className="w-5 h-5 text-green-600" />
//               <span>ACTIVE</span>
//             </>
//           ) : (
//             <>
//               <ToggleLeft className="w-5 h-5 text-red-600" />
//               <span>INACTIVE</span>
//             </>
//           )}
//         </button>
//       )
//     },
//     {
//       key: 'actions',
//       header: 'Actions',
//       render: (_, row) => (
//         <div className="flex gap-2">
//           <button onClick={() => { setSelectedCertificate(row); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100">
//             <Edit2 size={18} />
//           </button>
//           <button onClick={async () => {
//              if(window.confirm('Delete this certificate?')) {
//                await certificateService.delete(row.id);
//                fetchCertificates();
//              }
//           }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100">
//             <Trash2 size={18} />
//           </button>
//         </div>
//       )
//     }
//   ];

//   return (
//     <div className="p-6 max-w-7xl mx-auto space-y-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-extrabold text-gray-900">Certificate Manager</h1>
//           <p className="text-gray-500">Manage visibility and content of certification sections</p>
//         </div>
//         <div className="flex gap-3">
//           <Button onClick={handleRefresh} variant="outline" icon={<RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />}>
//             Sync
//           </Button>
//           <Button onClick={() => { setSelectedCertificate(null); setIsModalOpen(true); }} icon={<Plus size={18} />}>
//             New Certificate
//           </Button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
//           <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><Award size={24} /></div>
//           <div>
//             <div className="text-sm font-medium text-gray-500">Total</div>
//             <div className="text-2xl font-bold">{totalCount}</div>
//           </div>
//         </div>
//         <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
//           <div className="p-3 bg-green-50 rounded-xl text-green-600"><Activity size={24} /></div>
//           <div>
//             <div className="text-sm font-medium text-gray-500">Active</div>
//             <div className="text-2xl font-bold text-green-600">{activeCount}</div>
//           </div>
//         </div>
//         <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
//           <div className="p-3 bg-red-50 rounded-xl text-red-600"><EyeOff size={24} /></div>
//           <div>
//             <div className="text-sm font-medium text-gray-500">Inactive</div>
//             <div className="text-2xl font-bold text-red-600">{inactiveCount}</div>
//           </div>
//         </div>
//       </div>

//       {/* Filter Bar */}
//       <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
//         <div className="relative flex-1 min-w-[250px]">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//           <input 
//             className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
//             placeholder="Search by title..." 
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
        
//         <div className="flex gap-2">
//             <input type="number" placeholder="Domain ID" className="w-24 p-2.5 border rounded-xl text-sm" value={filterDomain} onChange={(e)=>setFilterDomain(e.target.value)} />
//             <input type="number" placeholder="Course ID" className="w-24 p-2.5 border rounded-xl text-sm" value={filterCourse} onChange={(e)=>setFilterCourse(e.target.value)} />
//         </div>

//         <select 
//           className="p-2.5 border rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500"
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//         >
//           <option value="all">All Status</option>
//           <option value="active">Active Only</option>
//           <option value="inactive">Inactive Only</option>
//         </select>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead className="bg-gray-50/50 border-b border-gray-100">
//               <tr>
//                 {columns.map(col => (
//                   <th key={col.key} className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">{col.header}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {filteredCertificates.map(cert => (
//                 <tr key={cert.id} className="hover:bg-gray-50/80 transition-colors">
//                   {columns.map(col => (
//                     <td key={col.key} className="px-6 py-5">
//                       {col.render ? col.render(cert[col.key as keyof Certificate], cert) : String(cert[col.key as keyof Certificate] ?? '')}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         {filteredCertificates.length === 0 && (
//           <div className="py-20 text-center flex flex-col items-center gap-2">
//             <div className="text-gray-300"><Search size={48} /></div>
//             <p className="text-gray-500 font-medium">No certificates found</p>
//           </div>
//         )}
//       </div>

//       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedCertificate ? "Update Certificate" : "New Certificate"} size="lg">
//         <CertificateForm certificate={selectedCertificate} onSubmit={handleSubmit} onCancel={() => setIsModalOpen(false)} />
//       </Modal>
//     </div>
//   );
// };

// export default Certificates;