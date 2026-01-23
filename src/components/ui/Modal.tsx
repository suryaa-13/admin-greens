import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'lg', // Increased default size for nested answers
  isLoading = false
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
        
        {/* Modal Content */}
        <div className={`relative w-full ${sizes[size]} transform overflow-hidden rounded-[2rem] bg-white shadow-2xl transition-all`}>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-8 py-5">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{title}</h3>
            <button onClick={onClose} className="rounded-full p-2 text-gray-400 hover:bg-slate-50 hover:text-rose-500 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="px-8 py-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {children}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-8 py-5 bg-slate-50/50">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors uppercase tracking-widest"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="modal-form" // This must match the ID in FAQForm
                disabled={isLoading}
                className="rounded-xl bg-indigo-600 px-8 py-2.5 text-sm font-black text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 transition-all uppercase tracking-widest"
              >
                {isLoading ? 'Processing...' : 'Save Knowledge'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;