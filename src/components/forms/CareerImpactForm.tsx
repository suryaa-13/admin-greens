// // components/forms/CareerImpactForm.tsx
// import React, { useState } from 'react';
// import { TrendingUp, Target, Users, Briefcase } from 'lucide-react';
// import type { CareerImpact } from '../../types/index';

// interface CareerImpactFormProps {
//   careerImpact?: CareerImpact | null;
//   onSubmit: (formData: Partial<CareerImpact>) => Promise<void>;
//   onCancel: () => void;
// }

// const CareerImpactForm: React.FC<CareerImpactFormProps> = ({ careerImpact, onSubmit, onCancel }) => {
//   const isEditMode = !!careerImpact;

//   const [formData, setFormData] = useState({
//     domainId: careerImpact?.domainId?.toString() || '0',
//     courseId: careerImpact?.courseId?.toString() || '0',
//     mainTitle: careerImpact?.mainTitle || '',
//     mainDescription: careerImpact?.mainDescription || '',
//     ctaText: careerImpact?.ctaText || '',
//     ctaLink: careerImpact?.ctaLink || '',
//     card1Title: careerImpact?.card1Title || '',
//     card1Description: careerImpact?.card1Description || '',
//     card2Title: careerImpact?.card2Title || '',
//     card2Description: careerImpact?.card2Description || '',
//     isActive: careerImpact?.isActive ?? true,
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Validation
//     const errors = [];

//     if (!formData.mainTitle.trim()) {
//       errors.push('Please enter main title');
//     }

//     if (!formData.mainDescription.trim()) {
//       errors.push('Please enter main description');
//     }

//     if (!formData.ctaText.trim()) {
//       errors.push('Please enter CTA text');
//     }

//     if (!formData.ctaLink.trim()) {
//       errors.push('Please enter CTA link');
//     }

//     if (!formData.card1Title.trim()) {
//       errors.push('Please enter Card 1 title');
//     }

//     if (!formData.card1Description.trim()) {
//       errors.push('Please enter Card 1 description');
//     }

//     if (!formData.card2Title.trim()) {
//       errors.push('Please enter Card 2 title');
//     }

//     if (!formData.card2Description.trim()) {
//       errors.push('Please enter Card 2 description');
//     }

//     if (errors.length > 0) {
//       alert(errors.join('\n'));
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const submitData = {
//         domainId: parseInt(formData.domainId),
//         courseId: parseInt(formData.courseId),
//         mainTitle: formData.mainTitle.trim(),
//         mainDescription: formData.mainDescription.trim(),
//         ctaText: formData.ctaText.trim(),
//         ctaLink: formData.ctaLink.trim(),
//         card1Title: formData.card1Title.trim(),
//         card1Description: formData.card1Description.trim(),
//         card2Title: formData.card2Title.trim(),
//         card2Description: formData.card2Description.trim(),
//         isActive: formData.isActive,
//       };

//       await onSubmit(submitData);
//     } finally {
//       setIsSubmitting(false);
//     }
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
//             Select the domain this career impact belongs to
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
//             placeholder="0 for domain-level career impacts"
//           />
//           <p className="mt-1 text-xs text-gray-500">
//             Enter 0 for domain-level, or specific course ID
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
//             Active Career Impact
//           </label>
//           <span className="ml-2 text-xs text-gray-500">
//             (Visible to users)
//           </span>
//         </div>
//       </div>

//       {/* Main Card Section */}
//       <div className="space-y-4">
//         <div className="flex items-center gap-2">
//           <Briefcase className="h-5 w-5 text-blue-600" />
//           <h3 className="text-lg font-medium text-gray-900">Main Section</h3>
//         </div>

//         <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
//           <div className="space-y-4">
//             {/* Main Title */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Main Title *
//               </label>
//               <input
//                 type="text"
//                 name="mainTitle"
//                 value={formData.mainTitle}
//                 onChange={handleInputChange}
//                 className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 placeholder="e.g., Transform Your Career in 6 Months"
//                 required
//               />
//               <p className="mt-1 text-xs text-gray-500">
//                 This appears as the main heading
//               </p>
//             </div>

//             {/* Main Description */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Main Description *
//               </label>
//               <textarea
//                 name="mainDescription"
//                 value={formData.mainDescription}
//                 onChange={handleInputChange}
//                 rows={4}
//                 className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 placeholder="Describe the career impact and benefits..."
//                 required
//               />
//               <p className="mt-1 text-xs text-gray-500">
//                 Detailed description of career transformation
//               </p>
//             </div>

//             {/* CTA Section */}
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   CTA Button Text *
//                 </label>
//                 <input
//                   type="text"
//                   name="ctaText"
//                   value={formData.ctaText}
//                   onChange={handleInputChange}
//                   className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="e.g., Start Your Journey, Apply Now, Get Started"
//                   required
//                 />
//                 <p className="mt-1 text-xs text-gray-500">
//                   Text displayed on the button
//                 </p>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   CTA Link *
//                 </label>
//                 <input
//                   type="text"
//                   name="ctaLink"
//                   value={formData.ctaLink}
//                   onChange={handleInputChange}
//                   className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="e.g., /enroll, /contact, https://..."
//                   required
//                 />
//                 <p className="mt-1 text-xs text-gray-500">
//                   Where the button should link to
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Statistics Cards Section */}
//       <div className="space-y-4">
//         <div className="flex items-center gap-2">
//           <TrendingUp className="h-5 w-5 text-green-600" />
//           <h3 className="text-lg font-medium text-gray-900">Statistics Cards</h3>
//         </div>

//         <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//           {/* Card 1 */}
//           <div className="rounded-lg border border-green-200 bg-green-50 p-4">
//             <div className="flex items-center gap-2 mb-3">
//               <Target className="h-5 w-5 text-green-600" />
//               <h4 className="font-medium text-green-900">Card 1</h4>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Card 1 Title *
//                 </label>
//                 <input
//                   type="text"
//                   name="card1Title"
//                   value={formData.card1Title}
//                   onChange={handleInputChange}
//                   className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="e.g., Average Salary Increase, Job Placement Rate"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Card 1 Description *
//                 </label>
//                 <textarea
//                   name="card1Description"
//                   value={formData.card1Description}
//                   onChange={handleInputChange}
//                   rows={3}
//                   className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="Detailed statistics or information..."
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Card 2 */}
//           <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
//             <div className="flex items-center gap-2 mb-3">
//               <Users className="h-5 w-5 text-purple-600" />
//               <h4 className="font-medium text-purple-900">Card 2</h4>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Card 2 Title *
//                 </label>
//                 <input
//                   type="text"
//                   name="card2Title"
//                   value={formData.card2Title}
//                   onChange={handleInputChange}
//                   className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="e.g., Industry Recognition, Global Opportunities"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Card 2 Description *
//                 </label>
//                 <textarea
//                   name="card2Description"
//                   value={formData.card2Description}
//                   onChange={handleInputChange}
//                   rows={3}
//                   className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="Detailed statistics or information..."
//                   required
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Content Guidelines */}
//       <div className="rounded-lg bg-blue-50 p-4">
//         <h4 className="text-sm font-medium text-blue-800 mb-2">📋 Content Guidelines:</h4>
//         <ul className="text-xs text-blue-700 space-y-1">
//           <li>• Use compelling statistics and numbers for credibility</li>
//           <li>• Focus on career outcomes and benefits</li>
//           <li>• Keep CTAs clear and action-oriented</li>
//           <li>• Use specific numbers (e.g., "85% salary increase") rather than vague statements</li>
//           <li>• Card descriptions should be concise but informative</li>
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
//             isEditMode ? 'Save Changes' : 'Create Career Impact'
//           )}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default CareerImpactForm;

import React, { useState } from 'react';
import { TrendingUp, Target, Users, Briefcase, Loader2 } from 'lucide-react';
import type { CareerImpact } from '../../types/index';

interface CareerImpactFormProps {
  careerImpact?: CareerImpact | null;
  onSubmit: (formData: Partial<CareerImpact>) => Promise<void>;
  onCancel: () => void;
}

const CareerImpactForm: React.FC<CareerImpactFormProps> = ({ careerImpact, onSubmit, onCancel }) => {
  const isEditMode = !!careerImpact;

  const [formData, setFormData] = useState({
    domainId: careerImpact?.domainId || 0,
    courseId: careerImpact?.courseId || 0,
    mainTitle: careerImpact?.mainTitle || '',
    mainDescription: careerImpact?.mainDescription || '',
    ctaText: careerImpact?.ctaText || '',
    ctaLink: careerImpact?.ctaLink || '',
    card1Title: careerImpact?.card1Title || '',
    card1Description: careerImpact?.card1Description || '',
    card2Title: careerImpact?.card2Title || '',
    card2Description: careerImpact?.card2Description || '',
    isActive: careerImpact?.isActive ?? true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to ensure numbers are never negative
  const handleNumberInput = (field: string, value: string) => {
    const num = Math.max(0, parseInt(value) || 0);
    setFormData(prev => ({ ...prev, [field]: num }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        ...formData,
        mainTitle: formData.mainTitle.trim(),
        mainDescription: formData.mainDescription.trim(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto p-1 scrollbar-hide">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Domain ID - Number Input */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Domain ID *</label>
          <input
            type="number"
            min="0"
            value={formData.domainId}
            onChange={(e) => handleNumberInput('domainId', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0f3d2e] focus:ring-2 focus:ring-[#0f3d2e]/10 outline-none transition-all"
            required
          />
        </div>

        {/* Course ID - Number Input */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Course ID *</label>
          <input
            type="number"
            min="0"
            value={formData.courseId}
            onChange={(e) => handleNumberInput('courseId', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0f3d2e] focus:ring-2 focus:ring-[#0f3d2e]/10 outline-none transition-all"
            required
          />
        </div>
      </div>

      {/* Main Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <Briefcase className="h-5 w-5 text-[#0f3d2e]" />
          <h3 className="text-lg font-bold text-gray-900">Main Content</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Main Title *</label>
            <input
              type="text"
              value={formData.mainTitle}
              onChange={(e) => setFormData({ ...formData, mainTitle: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0f3d2e] focus:ring-2 focus:ring-[#0f3d2e]/10 outline-none"
              placeholder="e.g., Transform Your Career"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Main Description *</label>
            <textarea
              value={formData.mainDescription}
              onChange={(e) => setFormData({ ...formData, mainDescription: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0f3d2e] focus:ring-2 focus:ring-[#0f3d2e]/10 outline-none"
              placeholder="Detailed description of outcomes..."
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">CTA Button Text *</label>
              <input
                type="text"
                value={formData.ctaText}
                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0f3d2e] outline-none"
                placeholder="Apply Now"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">CTA Link *</label>
              <input
                type="text"
                value={formData.ctaLink}
                onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#0f3d2e] outline-none"
                placeholder="/courses"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 border-b pb-2">
          <TrendingUp className="h-5 w-5 text-[#0f3d2e]" />
          <h3 className="text-lg font-bold text-gray-900">Statistics Cards</h3>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Card 1 */}
          <div className="rounded-xl border border-gray-200 p-4 bg-gray-50/50">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-[#0f3d2e]" />
              <h4 className="font-bold text-sm text-gray-800">Stat Card 1</h4>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Card Title (e.g. 85% Salary Hike)"
                value={formData.card1Title}
                onChange={(e) => setFormData({ ...formData, card1Title: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#0f3d2e]"
                required
              />
              <textarea
                placeholder="Short description..."
                value={formData.card1Description}
                onChange={(e) => setFormData({ ...formData, card1Description: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#0f3d2e]"
                required
              />
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-xl border border-gray-200 p-4 bg-gray-50/50">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-[#0f3d2e]" />
              <h4 className="font-bold text-sm text-gray-800">Stat Card 2</h4>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Card Title (e.g. 500+ Hiring Partners)"
                value={formData.card2Title}
                onChange={(e) => setFormData({ ...formData, card2Title: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#0f3d2e]"
                required
              />
              <textarea
                placeholder="Short description..."
                value={formData.card2Description}
                onChange={(e) => setFormData({ ...formData, card2Description: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#0f3d2e]"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between border-t pt-6">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="sr-only"
            />
            <div className={`w-11 h-6 rounded-full transition-colors ${formData.isActive ? 'bg-[#0f3d2e]' : 'bg-gray-300'}`}></div>
            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.isActive ? 'translate-x-5' : ''}`}></div>
          </div>
          <span className="text-sm font-bold text-gray-700">Visible on Site</span>
        </label>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-[#0f3d2e] px-6 py-2 text-sm font-bold text-white hover:bg-[#165a44] transition-all disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </span>
            ) : (
              isEditMode ? 'Update Impact' : 'Create Impact'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CareerImpactForm;