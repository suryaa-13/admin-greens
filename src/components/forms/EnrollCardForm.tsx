

import React, { useState, useEffect } from 'react';
import { Upload, X, Info } from 'lucide-react';
import type { EnrollCard } from '../../types/index';
import { IMAGE_URL } from '../../utils/storage';
interface EnrollCardFormProps {
  enrollCard?: EnrollCard | null;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}

const EnrollCardForm: React.FC<EnrollCardFormProps> = ({ enrollCard, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    domainId: enrollCard?.domainId?.toString() || '0',
    courseId: enrollCard?.courseId?.toString() || '0',
    title: enrollCard?.title || '',
    order: enrollCard?.order?.toString() || '0',
    isActive: enrollCard?.isActive ?? true,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(enrollCard?.image || null);
  const [removeImage, setRemoveImage] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (enrollCard?.image && !removeImage) {
      setExistingImage(enrollCard.image);
    }
  }, [enrollCard, removeImage]);

  const getImageUrl = (path: string) => {
    if (path.startsWith('http')) return path;
    return `${ IMAGE_URL}${path}`;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (formData.title.length > 255) {
      newErrors.title = 'Title must be less than 255 characters';
    }

    const domainId = parseInt(formData.domainId);
    if (isNaN(domainId) || domainId < 0) {
      newErrors.domainId = 'Invalid domain ID';
    }

    const courseId = parseInt(formData.courseId);
    if (isNaN(courseId) || courseId < 0) {
      newErrors.courseId = 'Invalid course ID';
    }

    const order = parseInt(formData.order);
    if (isNaN(order) || order < 0) {
      newErrors.order = 'Order must be a positive number';
    }

    const isCreateMode = !enrollCard;
    if (isCreateMode && !imageFile && !existingImage) {
      newErrors.image = 'Image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('domainId', formData.domainId);
    formDataToSend.append('courseId', formData.courseId);
    formDataToSend.append('title', formData.title);
    formDataToSend.append('order', formData.order);
    formDataToSend.append('isActive', formData.isActive.toString());

    if (imageFile) {
      formDataToSend.append('image', imageFile);
    }

    if (enrollCard && removeImage) {
      formDataToSend.append('removeImage', 'true');
    }

    try {
      await onSubmit(formDataToSend);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          image: 'Invalid file type. Please upload JPEG, PNG, WebP, or GIF'
        }));
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'File too large. Maximum size is 5MB'
        }));
        return;
      }

      setImageFile(file);
      setRemoveImage(false);
      setErrors(prev => ({ ...prev, image: '' }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setExistingImage(null);
    setRemoveImage(true);
    setErrors(prev => ({ ...prev, image: '' }));
  };

  const isCreateMode = !enrollCard;
  const hasImage = imageFile || (existingImage && !removeImage);
  const hasImageError = errors.image && !hasImage;


  return (
    <form id="enroll-card-form" onSubmit={handleSubmit} className="space-y-6">
      {/* Domain ID - Changed from dropdown to number input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Domain ID *
        </label>
        <input
          type="number"
          value={formData.domainId}
          onChange={(e) => {
            setFormData({ ...formData, domainId: e.target.value });
            setErrors(prev => ({ ...prev, domainId: '' }));
          }}
          className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 ${
            errors.domainId 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          }`}
          placeholder="Enter domain ID"
          min="0"
          required
        />
        {errors.domainId && (
          <p className="mt-1 text-sm text-red-600">{errors.domainId}</p>
        )}
      </div>

      {/* Course ID */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Course ID *
        </label>
        <input
          type="number"
          value={formData.courseId}
          onChange={(e) => {
            setFormData({ ...formData, courseId: e.target.value });
            setErrors(prev => ({ ...prev, courseId: '' }));
          }}
          className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 ${
            errors.courseId 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          }`}
          placeholder="0 for domain-level cards"
          min="0"
          required
        />
        {errors.courseId && (
          <p className="mt-1 text-sm text-red-600">{errors.courseId}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Enter 0 for domain-level cards, or specific course ID for course-level cards
        </p>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => {
            setFormData({ ...formData, title: e.target.value });
            setErrors(prev => ({ ...prev, title: '' }));
          }}
          className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 ${
            errors.title 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          }`}
          placeholder="e.g., Enroll Now, Get Started, Join Course"
          required
          maxLength={255}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Enter a clear and compelling call-to-action title
        </p>
      </div>

      {/* Order */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Display Order *
        </label>
        <input
          type="number"
          value={formData.order}
          onChange={(e) => {
            setFormData({ ...formData, order: e.target.value });
            setErrors(prev => ({ ...prev, order: '' }));
          }}
          className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 ${
            errors.order 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          }`}
          placeholder="Lower numbers appear first"
          min="0"
          required
        />
        {errors.order && (
          <p className="mt-1 text-sm text-red-600">{errors.order}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Lower numbers appear first in listings. Cards with same order are sorted by creation date.
        </p>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image {isCreateMode && '*'}
        </label>
        
        {/* Image Guidelines */}
        <div className="mb-4 rounded-lg bg-blue-50 p-4">
          <div className="flex">
            <Info className="h-5 w-5 text-blue-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Image Guidelines:</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc space-y-1 pl-5">
                  <li>Use clear, high-quality images</li>
                  <li>Recommended size: 800x600 pixels</li>
                  <li>Supported formats: PNG, JPG, WebP, GIF</li>
                  <li>Maximum file size: 5MB</li>
                  <li>Ensure text in images is readable</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Existing Image Preview */}
        {existingImage && !removeImage && (
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium text-gray-700">Current Image:</p>
            <div className="relative inline-block">
              <div className="overflow-hidden rounded-lg border-2 border-gray-200">
                <img
                  src={getImageUrl(existingImage)}
                  alt="Current"
                  className="h-48 w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                  }}
                />
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1.5 text-white shadow-lg transition hover:bg-red-600"
                title="Remove Image"
              >
                <X size={16} />
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Click the X button to remove this image
            </p>
          </div>
        )}

        {/* New Image Preview */}
        {imagePreview && (
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium text-gray-700">New Image Preview:</p>
            <div className="relative inline-block">
              <div className="overflow-hidden rounded-lg border-2 border-green-200">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-48 w-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1.5 text-white shadow-lg transition hover:bg-red-600"
                title="Remove Image"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Image Upload Area */}
        {(!hasImage || isCreateMode) && (
          <div className={`mt-2 ${hasImageError ? 'border-red-300' : ''}`}>
            <label className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 transition ${
              hasImageError 
                ? 'border-red-300 bg-red-50 hover:bg-red-100' 
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
            }`}>
              <Upload className="h-10 w-10 text-gray-400" />
              <p className="mt-2 text-sm font-medium text-gray-700">
                Click to upload image
              </p>
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, WebP, GIF up to 5MB
              </p>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                required={isCreateMode}
              />
            </label>
          </div>
        )}

        {/* Upload/Change Button */}
        {(hasImage || enrollCard) && (
          <div className="mt-3">
            <label className="inline-flex cursor-pointer items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50">
              <Upload className="mr-2 h-4 w-4" />
              {hasImage ? 'Change Image' : 'Upload New Image'}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
            {enrollCard && !imageFile && !removeImage && (
              <p className="mt-2 text-xs text-gray-500">
                Upload a new image to replace the current one, or remove the current image above.
              </p>
            )}
          </div>
        )}

        {/* Image Error Message */}
        {errors.image && (
          <p className="mt-2 text-sm text-red-600">{errors.image}</p>
        )}
      </div>

      {/* Active Status */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center">
          <div className="flex h-5 items-center">
            <input
              id="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          </div>
          <div className="ml-3">
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Active Card
            </label>
            <p className="text-xs text-gray-500">
              When checked, this card will be visible to users on the frontend
            </p>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-between border-t pt-4">
        <div className="text-sm text-gray-500">
          Fields marked with * are required
        </div>
        
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!formData.title || (!hasImage && isCreateMode)}
          >
            {enrollCard ? 'Update Card' : 'Create Card'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EnrollCardForm;