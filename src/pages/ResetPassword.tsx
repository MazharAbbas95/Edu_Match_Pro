import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Lock, Loader2, ArrowRight } from 'lucide-react';
import { AuthForm } from '../components/Auth/AuthForm';
import { resetPassword } from '../utils/auth';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      if (!token) throw new Error('Invalid reset token');

      await resetPassword(token, password);
      
      window.dispatchEvent(new Event('auth-change'));
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm 
      title="Reset Password" 
      subtitle="Enter your new password below"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold text-center border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="block text-sm font-bold text-slate-700 ml-1">New Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="password"
              placeholder="••••••••"
              required
              min={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all outline-none font-semibold text-slate-700"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-bold text-slate-700 ml-1">Confirm New Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="password"
              placeholder="••••••••"
              required
              min={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all outline-none font-semibold text-slate-700"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
            <>
              Reset Password
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </AuthForm>
  );
};
