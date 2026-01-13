import React, { useState } from 'react';
import { 
  Book, Hash, SortAsc, Layers, Plus, 
  Trash2, Edit2, X, Save, AlertCircle, 
  CheckCircle2, ChevronRight 
} from 'lucide-react';
import type { Module, ModuleTopic } from '../../types/index';

interface ModuleFormProps {
  module?: Module | null;
  onSubmit: (formData: Partial<Module>) => Promise<void>;
  onCancel: () => void;
}

const ModuleForm: React.FC<ModuleFormProps> = ({ module, onSubmit, onCancel }) => {
  const isEditMode = !!module;
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ---------------- STATE: MODULE ---------------- */
  const [formData, setFormData] = useState({
    domainId: module?.domainId?.toString() || '0',
    courseId: module?.courseId?.toString() || '0',
    title: module?.title || '',
    description: module?.description || '',
    order: module?.order?.toString() || '0',
    isActive: module?.isActive ?? true,
  });

  /* ---------------- STATE: TOPICS ---------------- */
  const [topics, setTopics] = useState<ModuleTopic[]>(module?.topics || []);
  const [editingTopic, setEditingTopic] = useState<ModuleTopic | null>(null);
  const [topicForm, setTopicForm] = useState({
    title: '',
    description: '',
    order: '0',
    isActive: true,
  });

  /* ---------------- HELPERS ---------------- */
  const ensureNonNegative = (val: string) => {
    const num = parseInt(val);
    return isNaN(num) || num < 0 ? '0' : num.toString();
  };

  /* ---------------- HANDLERS ---------------- */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: ensureNonNegative(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTopicInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setTopicForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (type === 'number') {
      setTopicForm(prev => ({ ...prev, [name]: ensureNonNegative(value) }));
    } else {
      setTopicForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddOrUpdateTopic = () => {
    if (!topicForm.title.trim()) return;

    const topicData: ModuleTopic = {
      id: editingTopic?.id || Date.now(), // High number for Temp IDs as per backend logic
      moduleId: module?.id || 0,
      title: topicForm.title.trim(),
      description: topicForm.description.trim(),
      order: parseInt(topicForm.order),
      isActive: topicForm.isActive
    };

    if (editingTopic) {
      setTopics(topics.map(t => t.id === editingTopic.id ? topicData : t));
      setEditingTopic(null);
    } else {
      setTopics([...topics, topicData]);
    }
    setTopicForm({ title: '', description: '', order: (topics.length + 1).toString(), isActive: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        domainId: parseInt(formData.domainId),
        courseId: parseInt(formData.courseId),
        order: parseInt(formData.order),
        topics: topics // Backend handles the bulk upsert/delete
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              {isEditMode ? <Edit2 size={24} /> : <Plus size={24} />}
              {isEditMode ? 'Edit Module' : 'Create New Module'}
            </h2>
            <p className="text-indigo-100 text-sm mt-1">Configure module details and nested topics</p>
          </div>
          <button type="button" onClick={onCancel} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="p-8 space-y-10">
        {/* Section 1: Classification */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider text-xs">
            <Hash size={14} /> Global Configuration
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600 ml-1">Domain ID</label>
              <input type="number" name="domainId" value={formData.domainId} onChange={handleInputChange} 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600 ml-1">Course ID</label>
              <input type="number" name="courseId" value={formData.courseId} onChange={handleInputChange} 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600 ml-1">Display Order</label>
              <input type="number" name="order" value={formData.order} onChange={handleInputChange} 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
            </div>
          </div>
        </section>

        {/* Section 2: Content */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider text-xs">
            <Book size={14} /> Module Identity
          </div>
          <div className="space-y-4">
            <input 
              type="text" 
              name="title" 
              placeholder="Enter Module Title..." 
              value={formData.title} 
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-2xl text-xl font-bold border-2 border-gray-400  focus:ring-0 placeholder:text-gray-300"
              required
            />
            <textarea 
              name="description" 
              placeholder="Describe what this module covers..." 
              value={formData.description} 
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all min-h-[100px]"
            />
            <label className="inline-flex items-center cursor-pointer group">
              <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-600 group-hover:text-indigo-600 transition-colors">Module Visibility (Active)</span>
            </label>
          </div>
        </section>

        {/* Section 3: Topics Management */}
        <section className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-purple-700 font-bold uppercase tracking-wider text-xs">
              <Layers size={14} /> Curriculum Topics
            </div>
            <span className="bg-purple-200 text-purple-700 text-[10px] font-black px-2 py-1 rounded-md uppercase">
              {topics.length} Topics total
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Topic Input Form */}
            <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-purple-200 shadow-sm space-y-4 h-fit sticky top-4">
              <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                {editingTopic ? <Edit2 size={14} className="text-orange-500"/> : <Plus size={14} className="text-purple-500"/>}
                {editingTopic ? 'Update Topic' : 'Quick Add Topic'}
              </h4>
              <input type="text" name="title" placeholder="Topic Title" value={topicForm.title} onChange={handleTopicInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-purple-500 outline-none" />
              <textarea name="description" placeholder="Short summary..." value={topicForm.description} onChange={handleTopicInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-purple-500 outline-none h-20" />
              <div className="flex gap-2">
                <input type="number" name="order" value={topicForm.order} onChange={handleTopicInputChange}
                  className="w-20 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none" />
                <button type="button" onClick={handleAddOrUpdateTopic}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${editingTopic ? 'bg-orange-500 text-white shadow-orange-100 shadow-lg' : 'bg-purple-600 text-white shadow-purple-100 shadow-lg hover:bg-purple-700'}`}>
                  {editingTopic ? 'Update Topic' : 'Add to List'}
                </button>
              </div>
              {editingTopic && (
                <button type="button" onClick={() => {setEditingTopic(null); setTopicForm({title:'', description:'', order:'0', isActive:true})}} className="w-full text-xs text-gray-400 hover:text-red-500 transition-colors">Cancel editing</button>
              )}
            </div>

            {/* Topic Display List */}
            <div className="lg:col-span-3 space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {topics.sort((a,b) => a.order - b.order).map((topic, index) => (
                <div key={topic.id} className={`group flex items-center justify-between p-4 bg-white border rounded-xl transition-all ${editingTopic?.id === topic.id ? 'ring-2 ring-orange-400 border-transparent shadow-md' : 'border-gray-100 hover:border-purple-200 hover:shadow-sm'}`}>
                  <div className="flex items-center gap-4">
                    <div className="text-xs font-black text-gray-300 group-hover:text-purple-400 transition-colors">{topic.order}</div>
                    <div>
                      <h5 className="text-sm font-bold text-gray-800">{topic.title}</h5>
                      <p className="text-[11px] text-gray-400 line-clamp-1">{topic.description || 'No description provided'}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={() => setEditingTopic(topic)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={14}/></button>
                    <button type="button" onClick={() => setTopics(topics.filter(t => t.id !== topic.id))} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={14}/></button>
                  </div>
                </div>
              ))}
              {topics.length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-purple-200 rounded-2xl text-purple-300">
                  <Layers size={32} strokeWidth={1} />
                  <p className="text-xs mt-2 font-medium uppercase tracking-tighter">No topics added yet</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-8 py-6 flex justify-between items-center border-t border-gray-100">
        <div className="flex items-center gap-2 text-gray-400">
          <AlertCircle size={16} />
          <span className="text-[11px] font-medium">Changes are saved only after clicking "Finalize"</span>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onCancel} className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors">
            Discard
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 transition-all"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <CheckCircle2 size={18} />
            )}
            {isEditMode ? 'Finalize Updates' : 'Publish Module'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ModuleForm;