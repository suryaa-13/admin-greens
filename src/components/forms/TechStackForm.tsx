// // components/forms/TechStackForm.tsx
// import React, { useState } from 'react';
// import {  X, Plus, Cpu } from 'lucide-react';
// import type { TechStack } from '../../types/index';

// interface TechStackFormProps {
//   techStack?: TechStack | null;
//   onSubmit: (formData: FormData) => Promise<void>;
//   onCancel: () => void;
// }

// const TechStackForm: React.FC<TechStackFormProps> = ({ techStack, onSubmit, onCancel }) => {
//   const isEditMode = !!techStack;
  
//   const [formData, setFormData] = useState({
//     domainId: techStack?.domainId?.toString() || '0',
//     courseId: techStack?.courseId?.toString() || '0',
//     name: techStack?.name || '',
//     order: techStack?.order?.toString() || '0',
//     isActive: techStack?.isActive ?? true,
//   });

//   const [image, setImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string>(
//     techStack?.iconUrl ? `http://localhost:5000${techStack.iconUrl}` : ''
//   );
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // Validation
//     const errors = [];
    
//     if (!formData.name.trim()) {
//       errors.push('Please enter technology name');
//     }
    
//     if (!image && !techStack?.iconUrl) {
//       errors.push('Please select a technology icon');
//     }
    
//     if (errors.length > 0) {
//       alert(errors.join('\n'));
//       return;
//     }

//     setIsSubmitting(true);
    
//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append('domainId', formData.domainId);
//       formDataToSend.append('courseId', formData.courseId);
//       formDataToSend.append('name', formData.name.trim());
//       formDataToSend.append('order', formData.order);
//       formDataToSend.append('isActive', formData.isActive.toString());

//       if (image) {
//         formDataToSend.append('image', image);
//       }

//       await onSubmit(formDataToSend);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       // Check file type
//       if (!file.type.startsWith('image/')) {
//         alert('Please select an image file (JPEG, PNG, SVG, etc.)');
//         return;
//       }

//       // Check file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         alert('Image size should be less than 5MB');
//         return;
//       }

//       setImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const removeImage = () => {
//     setImage(null);
//     setImagePreview('');
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target;
    
//     if (type === 'checkbox') {
//       const checked = (e.target as HTMLInputElement).checked;
//       setFormData(prev => ({ ...prev, [name]: checked }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = parseInt(e.target.value);
//     if (!isNaN(value) && value >= 0) {
//       setFormData(prev => ({ ...prev, order: value.toString() }));
//     } else if (e.target.value === '') {
//       setFormData(prev => ({ ...prev, order: '' }));
//     }
//   };

//   return (
//     <form id="modal-form" onSubmit={handleSubmit} className="space-y-6">
//       <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//         {/* Domain ID */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Domain ID
//           </label>
//           <select
//             name="domainId"
//             value={formData.domainId}
//             onChange={handleInputChange}
//             className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             required
//           >
//             <option value="0">Landing Page</option>
//             <option value="1">DevOps</option>
//             <option value="2">AI/ML</option>
//             <option value="3">Web Development</option>
//           </select>
//           <p className="mt-1 text-xs text-gray-500">
//             Select the domain this technology belongs to
//           </p>
//         </div>

//         {/* Course ID */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Course ID
//           </label>
//           <input
//             type="number"
//             name="courseId"
//             value={formData.courseId}
//             onChange={handleInputChange}
//             min="0"
//             className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             placeholder="0 for domain-level technologies"
//           />
//           <p className="mt-1 text-xs text-gray-500">
//             Enter 0 for domain-level, or specific course ID
//           </p>
//         </div>

//         {/* Name */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Technology Name *
//           </label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleInputChange}
//             className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             placeholder="e.g., React, Node.js, Docker, Python"
//             required
//           />
//         </div>

//         {/* Order */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Display Order
//           </label>
//           <input
//             type="number"
//             name="order"
//             value={formData.order}
//             onChange={handleOrderChange}
//             min="0"
//             className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             required
//           />
//           <p className="mt-1 text-xs text-gray-500">
//             Lower numbers appear first in listings
//           </p>
//         </div>

//         {/* Active Status */}
//         <div className="flex items-center md:col-span-2">
//           <input
//             type="checkbox"
//             name="isActive"
//             id="isActive"
//             checked={formData.isActive}
//             onChange={handleInputChange}
//             className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//           />
//           <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
//             Active Technology
//           </label>
//           <span className="ml-2 text-xs text-gray-500">
//             (Visible to users in tech stack)
//           </span>
//         </div>
//       </div>

//       {/* Image Upload Section */}
//       <div className="space-y-4">
//         <label className="block text-sm font-medium text-gray-700">
//           Technology Icon *
//         </label>
        
//         <div className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-gray-400 transition-colors">
//           {imagePreview ? (
//             <div className="text-center">
//               <div className="relative inline-block">
//                 <img
//                   src={imagePreview}
//                   alt="Icon Preview"
//                   className="h-32 w-32 rounded-lg bg-gray-50 object-contain p-4 border"
//                 />
//                 <button
//                   type="button"
//                   onClick={removeImage}
//                   className="absolute -right-2 -top-2 rounded-full bg-red-100 p-1.5 text-red-600 hover:bg-red-200 transition-colors"
//                   title="Remove icon"
//                 >
//                   <X size={18} />
//                 </button>
//               </div>
//               <div className="mt-3 text-center text-sm text-gray-500">
//                 Click to change icon
//               </div>
//             </div>
//           ) : (
//             <div className="text-center">
//               <Cpu className="mx-auto h-12 w-12 text-gray-400" />
//               <p className="mt-2 text-sm text-gray-600">
//                 Click to upload technology icon
//               </p>
//               <p className="text-xs text-gray-500">
//                 Recommended: PNG, SVG, JPG. Max 5MB
//               </p>
//             </div>
//           )}
          
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleImageChange}
//             className="absolute h-full w-full cursor-pointer opacity-0"
//             id="image-upload"
//           />
//         </div>
        
//         <div className="text-center">
//           <label
//             htmlFor="image-upload"
//             className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors cursor-pointer"
//           >
//             <Plus size={16} />
//             {imagePreview ? 'Change Icon' : 'Select Icon'}
//           </label>
//         </div>
//       </div>

//       {/* Icon Guidelines */}
//       <div className="rounded-lg bg-blue-50 p-4">
//         <h4 className="text-sm font-medium text-blue-800 mb-2">📋 Icon Guidelines:</h4>
//         <ul className="text-xs text-blue-700 space-y-1">
//           <li>• Use transparent PNG or SVG icons for best results</li>
//           <li>• Recommended size: 512x512 pixels</li>
//           <li>• Keep icons simple and recognizable</li>
//           <li>• Square aspect ratio works best</li>
//           <li>• File size should be under 200KB</li>
//         </ul>
//       </div>

//       {/* Form Actions */}
//       <div className="flex justify-end space-x-3 pt-4 border-t">
//         <button
//           type="button"
//           onClick={onCancel}
//           className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
//           disabled={isSubmitting}
//         >
//           Cancel
//         </button>
//         <button
//           type="submit"
//           className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? (
//             <span className="flex items-center gap-2">
//               <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
//               {isEditMode ? 'Saving...' : 'Creating...'}
//             </span>
//           ) : (
//             isEditMode ? 'Save Changes' : 'Create Tech Stack'
//           )}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default TechStackForm;

// components/forms/TechStackForm.tsx
import React, { useState } from 'react';
import { X, Cpu } from 'lucide-react';
import type { TechStack } from '../../types/index';
import { IMAGE_URL } from '../../utils/storage';

interface TechStackFormProps {
  techStack?: TechStack | null;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}

const TechStackForm: React.FC<TechStackFormProps> = ({ techStack, onSubmit, onCancel }) => {
  const isEditMode = !!techStack;
  
  const [formData, setFormData] = useState({
    domainId: techStack?.domainId?.toString() || '0',
    courseId: techStack?.courseId?.toString() || '0',
    name: techStack?.name || '',
    order: techStack?.order?.toString() || '0',
    isActive: techStack?.isActive ?? true,
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    techStack?.iconUrl ? `${IMAGE_URL}${techStack.iconUrl}` : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = [];
    if (!formData.name.trim()) errors.push('Please enter technology name');
    if (!image && !techStack?.iconUrl) errors.push('Please select a technology icon');
    
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('domainId', formData.domainId);
      formDataToSend.append('courseId', formData.courseId);
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('order', formData.order);
      formDataToSend.append('isActive', formData.isActive.toString());

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
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      // Prevent negative numbers by taking the absolute value or defaulting to 0
      const val = Math.max(0, parseInt(value) || 0).toString();
      setFormData(prev => ({ ...prev, [name]: val }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <form id="modal-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        
        {/* Domain ID - Changed from select to number input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Domain ID *
          </label>
          <input
            type="number"
            name="domainId"
            value={formData.domainId}
            onChange={handleInputChange}
            min="0"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="0 for Landing Page"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            0 = Landing, 1 = DevOps, 2 = AI/ML, 3 = Web
          </p>
        </div>

        {/* Course ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course ID
          </label>
          <input
            type="number"
            name="courseId"
            value={formData.courseId}
            onChange={handleInputChange}
            min="0"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="0 for domain-level"
          />
        </div>

        {/* Name */}
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Technology Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., React, Docker"
            required
          />
        </div>

        {/* Order */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Display Order
          </label>
          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleInputChange}
            min="0"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Active Status */}
        <div className="flex items-center md:col-span-2">
          <input
            type="checkbox"
            name="isActive"
            id="isActive"
            checked={formData.isActive}
            onChange={handleInputChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="isActive" className="ml-2 text-sm text-gray-700 font-medium">
            Active Technology
          </label>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Technology Icon *
        </label>
        
        <div className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-gray-400 transition-colors">
          {imagePreview ? (
            <div className="text-center">
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Icon Preview"
                  className="h-24 w-24 rounded-lg bg-gray-50 object-contain p-2 border"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -right-2 -top-2 rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Cpu className="mx-auto h-10 w-10 text-gray-400" />
              <p className="mt-2 text-xs text-gray-600">Click or drag icon here</p>
            </div>
          )}
          
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute h-full w-full cursor-pointer opacity-0"
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : isEditMode ? 'Save Changes' : 'Create Tech Stack'}
        </button>
      </div>
    </form>
  );
};

export default TechStackForm;