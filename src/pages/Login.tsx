import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/auth.service';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  // ✅ Instant lock to prevent double-submit even before re-render
  const isSubmittingRef = useRef(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setLoading(true);

    try {
      const response = await authService.login(
        formData.email,
        formData.password
      );

      if (response?.token) {
        login(response.token);
        toast.success('Welcome back!');
        navigate('/');
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Invalid email or password'
      );

      // ✅ Release lock on error
      isSubmittingRef.current = false;
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      {/* Responsive Container: 
          - w-full for mobile
          - max-w-md for desktop
          - p-6 on mobile, p-10 on larger screens
      */}
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-6 sm:p-10 shadow-2xl border border-gray-100 transition-all">
        
        {/* Header Section */}
        <div className="text-center">
          <div
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full transition-transform hover:rotate-12"
            style={{ backgroundColor: 'rgba(15, 61, 46, 0.1)' }}
          >
            <LogIn className="h-10 w-10" style={{ color: 'var(--brand-dark)' }} />
          </div>
          <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Admin Login
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Secure access to your dashboard
          </p>
        </div>

        {/* Form Section */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  disabled={loading}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="block w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 transition-all focus:border-[var(--brand-dark)] focus:ring-4 focus:ring-[var(--brand-dark)]/10 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="admin@greentech.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="password"
                  required
                  disabled={loading}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="block w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 transition-all focus:border-[var(--brand-dark)] focus:ring-4 focus:ring-[var(--brand-dark)]/10 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="group relative flex w-full justify-center py-4 text-lg font-bold transition-all active:scale-[0.98]"
              style={{
                backgroundColor: loading ? 'var(--brand-hover)' : 'var(--brand-dark)',
                color: 'var(--brand-text-on-dark)',
                borderRadius: '0.75rem',
                border: 'none'
              }}
            >
              {loading ? 'Verifying...' : 'Sign In'}
            </Button>
          </div>
        </form>

        {/* Footer */}
        <div className="pt-4 text-center">
          <p className="text-xs text-gray-400 font-medium">
            © {new Date().getFullYear()} Echo Digital Works • All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;