import React, { useState } from 'react';
import { Plus, Trash2, Hash, Save, Loader2 } from 'lucide-react';
import { faqChatService } from '../../services/faq.service'; // 👈 Import the service
import type { FAQBulkRequest } from '../../types/index';
import toast from 'react-hot-toast';

interface Props {
  onSuccess: () => void; // Callback to refresh the list and close modal
  onCancel: () => void;
}

const FAQForm: React.FC<Props> = ({ onSuccess, onCancel }) => {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState([{ question: '', answer: '' }]);

  const addItem = () => setItems([...items, { question: '', answer: '' }]);
  const removeItem = (idx: number) => {
    if (items.length > 1) setItems(items.filter((_, i) => i !== idx));
  };

  const handleUpdate = (idx: number, field: 'question' | 'answer', val: string) => {
    const newItems = [...items];
    newItems[idx][field] = val;
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload: FAQBulkRequest = {
      step,
      questions: items.map(i => i.question),
      answers: items.map(i => i.answer)
    };

    try {
      // 👈 Calling the createBulk service method
      await faqChatService.createBulk(payload);
      toast.success(`Successfully added ${items.length} items to Step ${step}`);
      onSuccess(); // Triggers refresh in the parent page
    } catch (error) {
      toast.error("Failed to create FAQs. Check console for route errors.");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-2 space-y-6">
      {/* Step Input */}
      <div className="flex items-center gap-4 bg-indigo-50 p-4 rounded-2xl border border-indigo-100">

   <div className="flex-1">
  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
    Target Logic Step
  </label>
  <input 
    type="number" 
    required
    min="0" // 1. Prevents decrementing below 0 using the arrow buttons
    className="w-full bg-transparent border-2 px-3 rounded-3xl py-2 text-lg font-bold text-indigo-900 outline-none"
    value={step}
    onChange={(e) => {
      const val = Number(e.target.value);
      // 2. Prevents setting state to a negative number if typed manually
      if (val >= 0) {
        setStep(val);
      }
    }}
    onKeyDown={(e) => {
      // 3. Prevents typing the minus sign (-) or the letter 'e' (scientific notation)
      if (e.key === '-' || e.key === 'e') {
        e.preventDefault();
      }
    }}
  />
</div>
      </div>

      {/* Dynamic Item List */}
      <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item, idx) => (
          <div key={idx} className="p-4 border-2 border-slate-100 rounded-2xl relative bg-slate-50/50 space-y-3 group hover:border-indigo-200 transition-all">
            <button type="button" onClick={() => removeItem(idx)} className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 transition-colors">
              <Trash2 size={18} />
            </button>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Question {idx + 1}</label>
              <input 
                type="text" 
                required 
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
                value={item.question} 
                onChange={(e) => handleUpdate(idx, 'question', e.target.value)} 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Response {idx + 1}</label>
              <textarea 
                required 
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                rows={2} 
                value={item.answer} 
                onChange={(e) => handleUpdate(idx, 'answer', e.target.value)} 
              />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 pt-4">
        <button 
          type="button" 
          onClick={addItem}
          className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-sm hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={18} /> Add Pair to Step {step}
        </button>

        <div className="flex gap-3">
          <button 
            type="button" 
            onClick={onCancel}
            className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="flex-2 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
            Sync Bulk Knowledge
          </button>
        </div>
      </div>
    </form>
  );
};

export default FAQForm;