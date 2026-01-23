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