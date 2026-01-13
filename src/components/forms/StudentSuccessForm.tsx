// import React, { useState } from 'react';
// import { Upload, X, Star, User, GraduationCap, Briefcase, Clock, Award, SortAsc } from 'lucide-react';
// import type { StudentSuccess } from '../../types/index';

// interface StudentSuccessFormProps {
//   student?: StudentSuccess | null;
//   onSubmit: (formData: FormData) => Promise<void>;
//   onCancel: () => void;
// }

// const StudentSuccessForm: React.FC<StudentSuccessFormProps> = ({ student, onSubmit, onCancel }) => {
//   const isEditMode = !!student;
  
//   const [formData, setFormData] = useState({
//     domainId: student?.domainId?.toString() || '0',
//     courseId: student?.courseId?.toString() || '0',
//     name: student?.name || '',
//     course: student?.course || '',
//     rating: student?.rating?.toString() || '5',
//     review: student?.review || '',
//     placement: student?.placement || '',
//     duration: student?.duration || '',
//     sortOrder: student?.sortOrder?.toString() || '0',
//     isActive: student?.isActive ?? true,
//   });

//   const [image, setImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string>(
//     student?.image ? `${import.meta.env.VITE_ADMIN_IMAGE_URL || '${ IMAGE_URL}'}${student.image}` : ''
//   );
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [imageError, setImageError] = useState<string>('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // Validation
//     const errors = [];
    
//     if (!formData.name.trim()) errors.push('Please enter student name');
//     if (!formData.course.trim()) errors.push('Please enter course name');
//     if (!formData.review.trim()) errors.push('Please enter review');
//     if (!imagePreview && !isEditMode) errors.push('Please upload student photo');
//     if (parseInt(formData.rating) < 1 || parseInt(formData.rating) > 5) errors.push('Rating must be between 1-5');
    
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
//       formDataToSend.append('course', formData.course.trim());
//       formDataToSend.append('rating', formData.rating);
//       formDataToSend.append('review', formData.review.trim());
//       formDataToSend.append('placement', formData.placement.trim());
//       formDataToSend.append('duration', formData.duration.trim());
//       formDataToSend.append('sortOrder', formData.sortOrder);
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
//       // Validate file size (5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         setImageError('Image size should be less than 5MB');
//         return;
//       }
      
//       // Validate file type
//       const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
//       if (!validTypes.includes(file.type)) {
//         setImageError('Only JPG, PNG, and WEBP images are allowed');
//         return;
//       }
      
//       setImageError('');
//       setImage(file);
      
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleRemoveImage = () => {
//     setImage(null);
//     setImagePreview('');
//     setImageError('');
//   };

//   const renderStarRating = () => {
//     return (
//       <div className="flex">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <button
//             key={star}
//             type="button"
//             onClick={() => setFormData({ ...formData, rating: star.toString() })}
//             className="p-1 hover:opacity-80 transition-opacity"
//           >
//             <Star
//               className={`h-7 w-7 transition-colors ${
//                 star <= parseInt(formData.rating)
//                   ? 'fill-yellow-400 text-yellow-400'
//                   : 'text-gray-300'
//               }`}
//             />
//           </button>
//         ))}
//         <span className="ml-3 self-center text-sm font-medium text-gray-700">
//           {formData.rating} {formData.rating === '1' ? 'star' : 'stars'}
//         </span>
//       </div>
//     );
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
//             <GraduationCap className="inline h-4 w-4 mr-1" />
//             Domain
//           </label>
//           <select
//             name="domainId"
//             value={formData.domainId}
//             onChange={handleInputChange}
//             className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           >
//             <option value="0">Landing Page</option>
//             <option value="1">DevOps</option>
//             <option value="2">AI/ML</option>
//             <option value="3">Web Development</option>
//             <option value="4">Data Science</option>
//             <option value="5">Cybersecurity</option>
//           </select>
//           <p className="mt-1 text-xs text-gray-500">
//             Select the domain this success story belongs to
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
//             className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             placeholder="0 for domain-level stories"
//           />
//           <p className="mt-1 text-xs text-gray-500">
//             Enter 0 for domain-level, or specific course ID
//           </p>
//         </div>

//         {/* Sort Order */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             <SortAsc className="inline h-4 w-4 mr-1" />
//             Sort Order
//           </label>
//           <input
//             type="number"
//             name="sortOrder"
//             value={formData.sortOrder}
//             onChange={handleInputChange}
//             min="0"
//             className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             placeholder="Lower numbers appear first"
//           />
//           <p className="mt-1 text-xs text-gray-500">
//             Used for ordering (0 = first, 100 = last)
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
//             Active Success Story
//           </label>
//           <span className="ml-2 text-xs text-gray-500">
//             (Visible on website)
//           </span>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//         {/* Student Name */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             <User className="inline h-4 w-4 mr-1" />
//             Student Name *
//           </label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleInputChange}
//             className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             placeholder="e.g., John Smith"
//             required
//           />
//         </div>

//         {/* Course Taken */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             <GraduationCap className="inline h-4 w-4 mr-1" />
//             Course Taken *
//           </label>
//           <input
//             type="text"
//             name="course"
//             value={formData.course}
//             onChange={handleInputChange}
//             className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             placeholder="e.g., Full Stack Web Development"
//             required
//           />
//         </div>

//         {/* Placement */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             <Briefcase className="inline h-4 w-4 mr-1" />
//             Placement Company
//           </label>
//           <input
//             type="text"
//             name="placement"
//             value={formData.placement}
//             onChange={handleInputChange}
//             className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             placeholder="e.g., Google, Microsoft, Amazon"
//           />
//         </div>

//         {/* Course Duration */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             <Clock className="inline h-4 w-4 mr-1" />
//             Course Duration
//           </label>
//           <input
//             type="text"
//             name="duration"
//             value={formData.duration}
//             onChange={handleInputChange}
//             className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             placeholder="e.g., 6 months, 1 year"
//           />
//         </div>
//       </div>

//       {/* Rating */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           <Star className="inline h-4 w-4 mr-1" />
//           Rating *
//         </label>
//         {renderStarRating()}
//         <input
//           type="hidden"
//           name="rating"
//           value={formData.rating}
//           required
//         />
//       </div>

//       {/* Review */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           <Award className="inline h-4 w-4 mr-1" />
//           Student Review *
//         </label>
//         <textarea
//           name="review"
//           value={formData.review}
//           onChange={handleInputChange}
//           rows={4}
//           className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           placeholder="Write the student's success story and experience..."
//           required
//         />
//         <p className="mt-1 text-xs text-gray-500">
//           Share the student's journey and achievements
//         </p>
//       </div>

//       {/* Image Upload */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Student Photo {!isEditMode && '*'}
//         </label>
        
//         {imageError && (
//           <div className="mb-3 rounded-md bg-red-50 p-3">
//             <p className="text-sm text-red-800">{imageError}</p>
//           </div>
//         )}
        
//         {imagePreview ? (
//           <div className="mt-2">
//             <div className="relative inline-block">
//               <img
//                 src={imagePreview}
//                 alt="Student Preview"
//                 className="h-48 w-48 rounded-full object-cover border-4 border-white shadow-lg"
//               />
//               <button
//                 type="button"
//                 onClick={handleRemoveImage}
//                 className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 transition-colors"
//                 title="Remove photo"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </div>
//             <p className="mt-2 text-xs text-gray-500">
//               Click the X to remove this photo
//             </p>
//           </div>
//         ) : (
//           <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 transition-colors hover:border-indigo-500 hover:bg-indigo-50">
//             <Upload className="h-10 w-10 text-gray-400" />
//             <span className="mt-3 text-sm font-medium text-gray-600">Upload Student Photo</span>
//             <span className="mt-1 text-xs text-gray-500">
//               PNG, JPG, WEBP up to 5MB • 400x400 recommended
//             </span>
//             <input
//               type="file"
//               className="hidden"
//               accept="image/jpeg,image/jpg,image/png,image/webp"
//               onChange={handleImageChange}
//               required={!isEditMode}
//             />
//           </label>
//         )}
//       </div>

//       {/* Content Guidelines */}
//       <div className="rounded-lg bg-blue-50 p-4">
//         <h4 className="text-sm font-medium text-blue-800 mb-2">📋 Success Story Guidelines:</h4>
//         <ul className="text-xs text-blue-700 space-y-1">
//           <li>• Use real names (or initials if privacy needed)</li>
//           <li>• Be specific about achievements and outcomes</li>
//           <li>• Include quantifiable results (salary increase, promotions, etc.)</li>
//           <li>• Make it personal and authentic</li>
//           <li>• High-quality photos increase credibility</li>
//           <li>• Ratings should reflect actual student feedback</li>
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
//             isEditMode ? 'Update Success Story' : 'Create Success Story'
//           )}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default StudentSuccessForm;

import React, { useState } from 'react';
import { Upload, X, Star, User, GraduationCap, Briefcase, Clock, Award, SortAsc } from 'lucide-react';
import type { StudentSuccess } from '../../types/index';
import { IMAGE_URL } from '../../utils/storage';
interface StudentSuccessFormProps {
  student?: StudentSuccess | null;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}

const StudentSuccessForm: React.FC<StudentSuccessFormProps> = ({ student, onSubmit, onCancel }) => {
  const isEditMode = !!student;
  
  const [formData, setFormData] = useState({
    domainId: student?.domainId?.toString() || '0',
    courseId: student?.courseId?.toString() || '0',
    name: student?.name || '',
    course: student?.course || '',
    rating: student?.rating?.toString() || '5',
    review: student?.review || '',
    placement: student?.placement || '',
    duration: student?.duration || '',
    sortOrder: student?.sortOrder?.toString() || '0',
    isActive: student?.isActive ?? true,
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    student?.image ? `${import.meta.env.VITE_ADMIN_IMAGE_URL || `${ IMAGE_URL}`}${student.image}` : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState<string>('');

  // Tailwind CSS to hide number input increment/decrement arrows
  const noSpinnerClass = "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      // Prevent manual entry of negative numbers
      if (value !== '' && parseInt(value) < 0) return;
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setImageError('Image size should be less than 5MB');
        return;
      }
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setImageError('Only JPG, PNG, and WEBP images are allowed');
        return;
      }
      
      setImageError('');
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview('');
    setImageError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = [];
    if (!formData.name.trim()) errors.push('Please enter student name');
    if (!formData.course.trim()) errors.push('Please enter course name');
    if (!formData.review.trim()) errors.push('Please enter review');
    if (!imagePreview && !isEditMode) errors.push('Please upload student photo');
    if (parseInt(formData.rating) < 1 || parseInt(formData.rating) > 5) errors.push('Rating must be between 1-5');
    
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      // Ensure numeric values are sent correctly
      formDataToSend.append('domainId', formData.domainId);
      formDataToSend.append('courseId', formData.courseId);
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('course', formData.course.trim());
      formDataToSend.append('rating', formData.rating);
      formDataToSend.append('review', formData.review.trim());
      formDataToSend.append('placement', formData.placement.trim());
      formDataToSend.append('duration', formData.duration.trim());
      formDataToSend.append('sortOrder', formData.sortOrder);
      formDataToSend.append('isActive', formData.isActive.toString());

      if (image) {
        formDataToSend.append('image', image);
      }

      await onSubmit(formDataToSend);
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = () => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFormData({ ...formData, rating: star.toString() })}
            className="p-1 hover:opacity-80 transition-opacity"
          >
            <Star
              className={`h-7 w-7 transition-colors ${
                star <= parseInt(formData.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        <span className="ml-3 self-center text-sm font-medium text-gray-700">
          {formData.rating} {formData.rating === '1' ? 'star' : 'stars'}
        </span>
      </div>
    );
  };

  return (
    <form id="modal-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Domain ID - Numeric Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <GraduationCap className="inline h-4 w-4 mr-1" />
            Domain ID
          </label>
          <input
            type="number"
            name="domainId"
            value={formData.domainId}
            onChange={handleInputChange}
            min="0"
            className={`mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${noSpinnerClass}`}
            placeholder="e.g., 0, 1, 2"
          />
          <p className="mt-1 text-xs text-gray-500">
            Internal ID for filtering stories
          </p>
        </div>

        {/* Course ID - Numeric Input */}
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
            className={`mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${noSpinnerClass}`}
            placeholder="0 for all courses"
          />
        </div>

        {/* Sort Order - Numeric Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <SortAsc className="inline h-4 w-4 mr-1" />
            Sort Order
          </label>
          <input
            type="number"
            name="sortOrder"
            value={formData.sortOrder}
            onChange={handleInputChange}
            min="0"
            className={`mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${noSpinnerClass}`}
            placeholder="0 = First"
          />
        </div>

        {/* Active Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isActive"
            id="isActive"
            checked={formData.isActive}
            onChange={handleInputChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
            Active Success Story
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Student Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <User className="inline h-4 w-4 mr-1" />
            Student Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., John Smith"
            required
          />
        </div>

        {/* Course Taken */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <GraduationCap className="inline h-4 w-4 mr-1" />
            Course Taken *
          </label>
          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Full Stack Web Dev"
            required
          />
        </div>

        {/* Placement */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Briefcase className="inline h-4 w-4 mr-1" />
            Placement Company
          </label>
          <input
            type="text"
            name="placement"
            value={formData.placement}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Company name"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Clock className="inline h-4 w-4 mr-1" />
            Course Duration
          </label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., 6 months"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Star className="inline h-4 w-4 mr-1" />
          Rating *
        </label>
        {renderStarRating()}
      </div>

      {/* Review */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Award className="inline h-4 w-4 mr-1" />
          Student Review *
        </label>
        <textarea
          name="review"
          value={formData.review}
          onChange={handleInputChange}
          rows={4}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter story..."
          required
        />
      </div>

      {/* Image Upload Area */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Student Photo {!isEditMode && '*'}
        </label>
        {imageError && (
          <p className="text-sm text-red-600 mb-2">{imageError}</p>
        )}
        {imagePreview ? (
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-32 w-32 rounded-full object-cover border-2 border-gray-200"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 cursor-pointer">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">Click to upload</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Story' : 'Create Story'}
        </button>
      </div>
    </form>
  );
};

export default StudentSuccessForm;