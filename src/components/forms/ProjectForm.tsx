
import React, { useState, useEffect } from 'react';
import { Upload, X, Hash, Cpu, Plus, Trash2 } from 'lucide-react';
import type { Project, ProjectTech } from '../../types/index';
import { IMAGE_URL } from '../../utils/storage';

interface ProjectFormProps {
  project?: Project | null;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSubmit, onCancel }) => {
  const isEditMode = !!project;
  
  const [formData, setFormData] = useState({
    domainId: project?.domainId?.toString() || '0',
    courseId: project?.courseId?.toString() || '0',
    title: project?.title || '',
    description: project?.description || '',
    projectLink: project?.projectLink || '',
    order: project?.order?.toString() || '0',
    isActive: project?.isActive ?? true,
  });

  // Technology Stack State
  // We keep track of existing techs and new techs to be added
  const [techStack, setTechStack] = useState<string[]>(
    project?.tech?.map(t => t.name) || []
  );
  const [newTechInput, setNewTechInput] = useState('');

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    project?.imageUrl ? `${IMAGE_URL}${project.imageUrl}` : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTech = () => {
    if (newTechInput.trim() && !techStack.includes(newTechInput.trim())) {
      setTechStack([...techStack, newTechInput.trim()]);
      setNewTechInput('');
    }
  };

  const handleRemoveTech = (index: number) => {
    setTechStack(techStack.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('domainId', formData.domainId);
      formDataToSend.append('courseId', formData.courseId);
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('order', formData.order);
      formDataToSend.append('isActive', formData.isActive.toString());
      formDataToSend.append('projectLink', formData.projectLink.trim());
      // Send tech stack as a JSON string so the backend can parse it
      // Note: Your backend controller needs to be updated to handle req.body.techStack
      formDataToSend.append('techStack', JSON.stringify(techStack));

      if (image) {
        formDataToSend.append('image', image);
      }

      await onSubmit(formDataToSend);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Strict Number Validation (Preventing negative values)
  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value);
    if (value === '' || (!isNaN(numValue) && numValue >= 0)) {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto px-1">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left: Metadata */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-gray-400 mb-1">Domain ID</label>
              <input
                type="number"
                name="domainId"
                value={formData.domainId}
                onChange={handleNumberInput}
                min="0"
                className="w-full rounded-xl border border-gray-200 p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-gray-400 mb-1">Course ID</label>
              <input
                type="number"
                name="courseId"
                value={formData.courseId}
                onChange={handleNumberInput}
                min="0"
                className="w-full rounded-xl border border-gray-200 p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-gray-400 mb-1">Display Order</label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleNumberInput}
              min="0"
              className="w-full rounded-xl border border-gray-200 p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-gray-400 mb-1">Project Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full rounded-xl border border-gray-200 p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Full Stack App..."
              required
            />
          </div>
          <div>
    <label className="block text-xs font-black uppercase text-gray-400 mb-1">
      External Link <span className="text-[10px] font-medium lowercase text-gray-300">(Optional)</span>
    </label>
    <div className="relative">
      <input
        type="url"
        name="projectLink"
        value={formData.projectLink}
        onChange={(e) => setFormData({...formData, projectLink: e.target.value})}
        className="w-full rounded-xl border border-gray-200 p-2.5 pl-10 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        placeholder="https://github.com/..."
      />
      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
    </div>
  </div>
        </div>

        {/* Right: Media & Status */}
        <div className="space-y-4">
          <label className="block text-xs font-black uppercase text-gray-400 mb-1">Project Thumbnail</label>
          <div className="relative h-32 w-full border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center bg-gray-50 overflow-hidden group">
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <Upload className="text-white" size={24} />
                   <span className="text-white text-xs font-bold ml-2">Change Image</span>
                </div>
              </>
            ) : (
              <div className="text-center">
                <Upload className="mx-auto text-gray-300 mb-1" size={24} />
                <span className="text-[10px] text-gray-400 font-bold uppercase">Upload Media</span>
              </div>
            )}
            <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-gray-400 mb-1">Status</label>
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer border border-transparent hover:border-indigo-200 transition-all">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="h-5 w-5 rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm font-bold text-gray-700">Publish Project</span>
            </label>
          </div>
        </div>
      </div>

      {/* Technology Stack Section */}
      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
        <label className="flex items-center gap-2 text-xs font-black uppercase text-gray-500 mb-3">
          <Cpu size={14} /> Technology Stack
        </label>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTechInput}
            onChange={(e) => setNewTechInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
            placeholder="Add tech (e.g. React, Node.js)"
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <button
            type="button"
            onClick={handleAddTech}
            className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {techStack.map((tech, index) => (
            <span 
              key={index} 
              className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 shadow-sm"
            >
              {tech}
              <button 
                type="button" 
                onClick={() => handleRemoveTech(index)}
                className="text-gray-400 hover:text-rose-500 transition-colors"
              >
                <X size={14} />
              </button>
            </span>
          ))}
          {techStack.length === 0 && <p className="text-[10px] text-gray-400 font-bold italic">No technologies added yet</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-black uppercase text-gray-400 mb-1">Project Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={4}
          className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
          placeholder="What makes this project unique?"
          required
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button type="button" onClick={onCancel} className="px-6 py-2.5 text-xs font-black uppercase text-gray-400 hover:text-gray-600">Cancel</button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-black text-white px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all disabled:opacity-50"
        >
          {isSubmitting ? 'Syncing...' : isEditMode ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;