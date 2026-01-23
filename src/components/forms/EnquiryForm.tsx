import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface EnquiryFormProps {
  domainId?: number;
  courseId?: number;
  isGeneral?: boolean; // True if used in footer
}

const EnquiryForm: React.FC<EnquiryFormProps> = ({ domainId = 0, courseId = 0, isGeneral = false }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      mode: isGeneral ? 'CLIENT_GENERAL' : 'CLIENT_COURSE',
      email,
      fullName: isGeneral ? undefined : fullName,
      phone: isGeneral ? undefined : phone,
      domainId,
      courseId
    };

    try {
      await axios.post('/api/mail/process', payload);
      toast.success(isGeneral ? 'Subscribed successfully!' : 'Enquiry sent! We will contact you soon.');
      setEmail(''); setFullName(''); setPhone('');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isGeneral) {
    return (
      <form onSubmit={handleProcess} className="flex flex-col sm:flex-row gap-2">
        <input 
          type="email" required placeholder="Your email address"
          className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white outline-none focus:border-white"
          value={email} onChange={(e) => setEmail(e.target.value)}
        />
        <button 
          type="submit" disabled={loading}
          className="bg-white text-indigo-900 font-bold px-6 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          {loading ? '...' : 'Subscribe'}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleProcess} className="space-y-4 bg-white p-6 rounded-2xl shadow-xl">
      <h3 className="text-xl font-bold text-gray-900">Enquire About This Course</h3>
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
        <input 
          type="text" required className="w-full border-b-2 py-2 outline-none focus:border-indigo-500"
          value={fullName} onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
          <input 
            type="email" required className="w-full border-b-2 py-2 outline-none focus:border-indigo-500"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase">Phone</label>
          <input 
            type="tel" required className="w-full border-b-2 py-2 outline-none focus:border-indigo-500"
            value={phone} onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>
      <button 
        type="submit" disabled={loading}
        className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700"
      >
        {loading ? 'Sending...' : 'Get Details'}
      </button>
    </form>
  );
};

export default EnquiryForm;