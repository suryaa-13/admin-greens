import { useEffect, useState } from 'react';
import {
  Plus,
  MessageSquare,
  Trash2,
  CheckCircle,
  XCircle,
  Layers,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { faqChatService } from '../services/faq.service';
import type { FAQChat } from '../types/index';
import FAQForm from '../components/forms/FAQForm';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

const FAQAdminPage = () => {
  const [faqs, setFaqs] = useState<FAQChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Fetch all FAQs from Admin Route
  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const data = await faqChatService.getAllAdmin();
      setFaqs(data);
    } catch (error) {
      toast.error("Could not load FAQ data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  // 2. Handle Individual Status Toggle (Active/Inactive)
  const handleToggleStatus = async (faq: FAQChat) => {
    try {
      await faqChatService.update(faq.id, { isActive: !faq.isActive });
      toast.success(`Entry ${faq.isActive ? 'deactivated' : 'activated'}`);
      fetchFAQs();
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  // 3. Handle Permanent Delete
  const handleDelete = async (id: number) => {
    if (!window.confirm("⚠️ PERMANENT DELETE ⚠️\n\nAre you sure you want to permanently delete this FAQ?\n\nThis action cannot be undone!")) return;
    try {
      await faqChatService.deletePermanent(id);
      toast.success("FAQ permanently deleted");
      fetchFAQs();
    } catch (error) {
      toast.error("Delete operation failed");
    }
  };

  // 4. Grouping Logic: Unique steps sorted numerically
  const uniqueSteps = Array.from(new Set(faqs.map((f) => f.step))).sort((a, b) => a - b);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
            Chatbot Flow Manager
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Manage sequential questions and answers by interaction steps.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-indigo-100 transition-all active:scale-95"
        >
          <Plus size={18} />
          Create Bulk Step
        </button>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="font-bold uppercase text-xs tracking-widest">Loading Knowledge Base...</p>
          </div>
        ) : uniqueSteps.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-20 text-center">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="text-slate-300" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No FAQs found</h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-2">
              Start by creating your first bulk set of questions for Step 0.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {uniqueSteps.map((step) => (
              <section key={step} className="space-y-6">
                {/* Step Divider */}
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-100 text-indigo-700 px-5 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
                    <Layers size={16} />
                    <span className="font-black text-xs uppercase tracking-widest">Step {step}</span>
                  </div>
                  <div className="h-px flex-1 bg-slate-200"></div>
                </div>

                {/* Question Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {faqs
                    .filter((f) => f.step === step)
                    .map((faq) => (
                      <div
                        key={faq.id}
                        className={`bg-white rounded-[2.5rem] border-2 p-6 flex flex-col justify-between transition-all relative group
                          ${faq.isActive
                            ? 'border-white shadow-sm hover:shadow-2xl hover:shadow-indigo-50/50 hover:border-indigo-100'
                            : 'border-slate-100 opacity-60 bg-slate-50/50'
                          }`}
                      >
                        <div>
                          <div className="flex justify-between items-start mb-6">
                            <div className={`p-3 rounded-2xl ${faq.isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
                              <MessageSquare size={20} />
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleToggleStatus(faq)}
                                className={`p-2 rounded-xl transition-all ${faq.isActive
                                  ? 'text-emerald-500 hover:bg-emerald-50'
                                  : 'text-slate-400 hover:bg-slate-200'
                                  }`}
                                title={faq.isActive ? "Deactivate" : "Activate"}
                              >
                                {faq.isActive ? <CheckCircle size={22} /> : <XCircle size={22} />}
                              </button>
                              <button
                                onClick={() => handleDelete(faq.id)}
                                className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                title="Delete Permanently"
                              >
                                <Trash2 size={22} />
                              </button>
                            </div>
                          </div>

                          <h4 className="font-black text-slate-800 text-lg leading-tight mb-3">
                            {faq.question}
                          </h4>
                          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
                            <p className="text-slate-600 text-sm leading-relaxed italic">
                              "{faq.answer}"
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-300">
                          <span>ID: #{faq.id}</span>
                          <span className={faq.isActive ? 'text-emerald-400' : 'text-rose-300'}>
                            {faq.isActive ? 'Live' : 'Hidden'}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {/* Bulk Creation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Knowledge Base Sync"
      >
        <FAQForm
          onSuccess={() => {
            fetchFAQs();
            setIsModalOpen(false);
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default FAQAdminPage;