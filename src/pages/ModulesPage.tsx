import React, { useEffect, useState } from 'react';
import { 
  Plus, Search, Edit2, Trash2, Filter, RefreshCw, Book, 
  Layers, Grid, List, Eye, EyeOff, Hash, Info, 
  ChevronDown, ChevronRight, SortAsc
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { Module, ModuleTopic } from '../types/index';
import { moduleService } from '../services/module.service';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ModuleForm from '../components/forms/ModuleForm';

const ModulesPage: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [filterDomain, setFilterDomain] = useState<string>('all');
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [expandedModules, setExpandedModules] = useState<number[]>([]);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const data = await moduleService.getAll();
      setModules(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Error fetching modules:", error);
      toast.error(error.response?.data?.message || 'Failed to fetch modules');
      setModules([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchModules();
    setIsRefreshing(false);
  };

  const handleCreate = () => {
    setSelectedModule(null);
    setIsModalOpen(true);
  };

  const handleEdit = async (module: Module) => {
    try {
      const fullData = await moduleService.getById(module.id);
      setSelectedModule(fullData);
      setIsModalOpen(true);
    } catch (error) {
      toast.error('Failed to load module data');
    }
  };

  const handleDelete = async (module: Module) => {
    if (window.confirm(`⚠️ PERMANENT DELETE ⚠️\n\nAre you sure you want to delete "${module.title}"?\n\nThis action cannot be undone and will delete:\n• Module content\n• All associated topics\n\nType "DELETE" to confirm:`)) {
      const userInput = prompt('Please type "DELETE" to confirm permanent deletion:');
      
      if (userInput?.toUpperCase() === 'DELETE') {
        try {
          await moduleService.delete(module.id);
          toast.success('Module permanently deleted');
          fetchModules();
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Failed to delete module');
        }
      } else {
        toast.error('Deletion cancelled. Module was not deleted.');
      }
    }
  };

  const toggleModuleActive = async (module: Module) => {
    try {
      const newStatus = !module.isActive;
      const action = newStatus ? 'activate' : 'deactivate';
      
      if (!window.confirm(`Are you sure you want to ${action} "${module.title}"?`)) {
        return;
      }
      
      await moduleService.update(module.id, { isActive: newStatus });
      toast.success(`Module ${action}d successfully`);
      fetchModules();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update module status');
    }
  };

  const toggleTopicActive = async (topic: ModuleTopic) => {
    try {
      const newStatus = !topic.isActive;
      const action = newStatus ? 'activate' : 'deactivate';
      
      if (!window.confirm(`Are you sure you want to ${action} "${topic.title}"?`)) {
        return;
      }
      
      await moduleService.updateTopic(topic.id, { isActive: newStatus });
      toast.success(`Topic ${action}d successfully`);
      fetchModules();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update topic status');
    }
  };

  const handleSubmit = async (formData: Partial<Module>) => {
    try {
      if (selectedModule) {
        await moduleService.update(selectedModule.id, formData);
        toast.success('Module updated successfully');
      } else {
        await moduleService.create(formData);
        toast.success('Module created successfully');
      }
      setIsModalOpen(false);
      fetchModules();
    } catch (error: any) {
      console.error("Error submitting module:", error);
      toast.error(error.response?.data?.message || 'Failed to save module');
    }
  };

  const filteredModules = modules.filter((module) => {
    const matchesSearch = 
      module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.topics?.some(topic => 
        topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesDomain = 
      filterDomain === 'all' || 
      module.domainId?.toString() === filterDomain;

    const matchesCourse = 
      filterCourse === 'all' || 
      module.courseId?.toString() === filterCourse;

    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && module.isActive) ||
      (statusFilter === 'inactive' && !module.isActive);

    return matchesSearch && matchesDomain && matchesCourse && matchesStatus;
  });

  const toggleModuleExpand = (moduleId: number) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const countTotalTopics = (modules: Module[]) => {
    return modules.reduce((total, module) => total + (module.topics?.length || 0), 0);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Module Management</h1>
          <p className="mt-1 text-gray-600">Manage course modules and topics</p>
        </div>
        <div className="flex gap-3">
          <div className="flex rounded-lg border border-gray-300 bg-white p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                viewMode === 'list' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List size={16} className="inline mr-1" /> List
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
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
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button onClick={handleCreate} icon={<Plus size={20} />}>
            Add Module
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
              placeholder="Search modules or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterDomain}
                onChange={(e) => setFilterDomain(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Domains</option>
                <option value="0">Landing Page</option>
                <option value="1">DevOps</option>
                <option value="2">AI/ML</option>
                <option value="3">Web Development</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-gray-400" />
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Courses</option>
                <option value="0">Domain-level</option>
                <option value="1">Course 1</option>
                <option value="2">Course 2</option>
                <option value="3">Course 3</option>
              </select>
            </div>

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
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      {!loading && modules.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-600">Total Modules</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{modules.length}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-600">Active Modules</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {modules.filter(m => m.isActive).length}
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-600">Total Topics</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {countTotalTopics(modules)}
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-600">Domain-level</p>
            <p className="mt-2 text-3xl font-bold text-purple-600">
              {modules.filter(m => m.courseId === 0).length}
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600" />
            <p className="text-sm text-gray-600">Loading modules...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Empty State */}
          {filteredModules.length === 0 ? (
            <div className="rounded-lg bg-white p-8 text-center shadow-sm">
              <Book className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No modules found</h3>
              <p className="mt-2 text-gray-500">
                {searchTerm || filterDomain !== 'all' || filterCourse !== 'all' || statusFilter !== 'all'
                  ? 'Try changing your search or filter criteria'
                  : 'Get started by creating your first module'
                }
              </p>
              <div className="mt-6">
                <Button onClick={handleCreate}>Add Module</Button>
              </div>
            </div>
          ) : (
            <>
              {/* Modules Count */}
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {filteredModules.length} of {modules.length} modules
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="font-medium">Active: {modules.filter(m => m.isActive).length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <span className="font-medium">Inactive: {modules.filter(m => !m.isActive).length}</span>
                  </div>
                </div>
              </div>

              {/* List View */}
              {viewMode === 'list' && (
                <div className="space-y-4">
                  {filteredModules.map((module) => (
                    <div key={module.id} className={`rounded-lg border shadow-sm ${
                      module.isActive ? 'bg-white' : 'bg-gray-50 opacity-80'
                    }`}>
                      {/* Module Header */}
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => toggleModuleExpand(module.id)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                {expandedModules.includes(module.id) ? (
                                  <ChevronDown size={20} />
                                ) : (
                                  <ChevronRight size={20} />
                                )}
                              </button>
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <h3 className="text-lg font-medium text-gray-900">{module.title}</h3>
                                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                    module.domainId === 0 ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {module.domainId === 0 ? 'Landing' : `Domain ${module.domainId}`}
                                  </span>
                                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                                    <SortAsc className="mr-1 h-3 w-3" /> {module.order}
                                  </span>
                                </div>
                                
                                {module.description && (
                                  <p className="mt-2 text-sm text-gray-600">{module.description}</p>
                                )}
                                
                                <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                                  <span>Course: {module.courseId === 0 ? 'Domain-level' : `Course ${module.courseId}`}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Layers size={14} />
                                    {module.topics?.length || 0} topics
                                  </span>
                                  <span>•</span>
                                  <span>ID: #{module.id}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleModuleActive(module)}
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors hover:opacity-90 ${
                                module.isActive 
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                              title={`Click to ${module.isActive ? 'deactivate' : 'activate'}`}
                            >
                              {module.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                              <span className="font-medium">{module.isActive ? 'Active' : 'Inactive'}</span>
                            </button>
                            
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(module)}
                                className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(module)}
                                className="rounded-lg p-2 text-red-600 hover:bg-red-50 transition-colors"
                                title="Delete Permanently"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Topics Section */}
                      {expandedModules.includes(module.id) && module.topics && module.topics.length > 0 && (
                        <div className="border-t bg-gray-50 p-6">
                          <h4 className="font-medium text-gray-900 mb-4">Topics</h4>
                          <div className="space-y-3">
                            {module.topics
                              .sort((a, b) => a.order - b.order)
                              .map((topic) => (
                                <div key={topic.id} className="rounded-lg border border-gray-200 bg-white p-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-xs font-medium text-purple-800">
                                        {topic.order}
                                      </span>
                                      <div>
                                        <h5 className="font-medium text-gray-900">{topic.title}</h5>
                                        {topic.description && (
                                          <p className="text-sm text-gray-500 mt-1">{topic.description}</p>
                                        )}
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                      <button
                                        onClick={() => toggleTopicActive(topic)}
                                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold transition-colors hover:opacity-90 ${
                                          topic.isActive 
                                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                                        }`}
                                        title={`Click to ${topic.isActive ? 'deactivate' : 'activate'}`}
                                      >
                                        {topic.isActive ? 'Active' : 'Inactive'}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredModules.map((module) => (
                    <div key={module.id} className={`overflow-hidden rounded-lg border shadow-sm ${
                      module.isActive ? 'bg-white' : 'bg-gray-50 opacity-80'
                    }`}>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{module.title}</h3>
                            <div className="mt-1 flex items-center gap-2">
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                module.domainId === 0 ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {module.domainId === 0 ? 'Landing' : `Domain ${module.domainId}`}
                              </span>
                              <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                                <SortAsc className="mr-1 h-3 w-3" /> {module.order}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleModuleActive(module)}
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors hover:opacity-90 ${
                              module.isActive 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                            title={`Click to ${module.isActive ? 'deactivate' : 'activate'}`}
                          >
                            {module.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>
                        </div>
                        
                        {module.description && (
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {module.description}
                          </p>
                        )}
                        
                        <div className="mb-4 text-sm text-gray-500">
                          <div className="flex items-center justify-between">
                            <span>Course: {module.courseId === 0 ? 'Domain-level' : `Course ${module.courseId}`}</span>
                            <span>ID: #{module.id}</span>
                          </div>
                        </div>
                        
                        {/* Topics Preview */}
                        {module.topics && module.topics.length > 0 && (
                          <div className="mb-4 rounded-lg border border-gray-200 p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Topics</span>
                              <span className="text-xs text-gray-500">
                                {module.topics.length} topic{module.topics.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                            <div className="space-y-2">
                            {module.topics.slice(0, 3).map((topic) => (
  <div key={topic.id} className="flex items-center gap-2">
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-xs font-medium text-purple-800">
      {topic.order}
    </span>
    <span className="text-sm text-gray-600 truncate">{topic.title}</span>
  </div>
))}
                              {module.topics.length > 3 && (
                                <div className="text-xs text-gray-500 text-center">
                                  +{module.topics.length - 3} more topics
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Actions */}
                        <div className="flex items-center justify-between border-t pt-4">
                          <div className="text-xs text-gray-500">
                            {module.topics?.length || 0} topics
                          </div>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(module)}
                              className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(module)}
                              className="rounded-lg p-2 text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedModule(null);
        }}
        title={selectedModule ? `Edit Module: ${selectedModule.title}` : 'Create New Module'}
        size="xl"
      >
        <ModuleForm
          module={selectedModule}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedModule(null);
          }}
        />
      </Modal>

      {/* Management Guide */}
      <div className="mt-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
          <div>
            <h4 className="font-semibold">📋 Module Management Guide:</h4>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li><span className="font-medium">Modules</span> - Major sections of a course (Introduction, Advanced Topics, etc.)</li>
              <li><span className="font-medium">Topics</span> - Sub-sections within each module (Variables, Functions, etc.)</li>
              <li><span className="font-medium">Order Field</span> - Determines sequence (lower numbers appear first)</li>
              <li><span className="font-medium">Domain-level modules</span> - Appear across all courses in a domain</li>
              <li><span className="font-medium">Course-specific modules</span> - Appear only for specific courses</li>
              <li><span className="font-medium">Click Status Button</span> - Toggle between Active/Inactive</li>
              <li><span className="font-medium">Expand/Collapse</span> - Click arrow to show/hide topics</li>
              <li><span className="font-medium">Edit Icon</span> - Modify module details and topics</li>
              <li><span className="font-medium">Delete Icon</span> - Permanently delete module and all topics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModulesPage;