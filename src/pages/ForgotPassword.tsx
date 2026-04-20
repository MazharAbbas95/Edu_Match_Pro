import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, ArrowRight, CheckCircle } from 'lucide-react';
import { AuthForm } from '../components/Auth/AuthForm';
import { forgotPassword } from '../utils/auth';

export const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await forgotPassword(email);
      setIsSent(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <AuthForm 
        title="Check Your Email" 
        subtitle="We've sent a password reset link to your email"
      >
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={40} />
          </div>
          <p className="text-slate-600 font-medium leading-relaxed">
            Please check your inbox at <span className="font-bold text-slate-900">{email}</span> and click the link to reset your password.
          </p>
          <Link to="/login" className="block text-blue-600 font-bold hover:underline">
            Back to Login
          </Link>
        </div>
      </AuthForm>
    );
  }

  return (
    <AuthForm 
      title="Forgot Password" 
      subtitle="Enter your email to receive a reset link"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold text-center border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="block text-sm font-bold text-slate-700 ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              Send Reset Link
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <p className="text-center mt-8 text-sm text-slate-500 font-medium">
        Remembered your password?{' '}
        <Link to="/login" className="text-blue-600 font-bold hover:underline">
          Back to Login
        </Link>
      </p>
    </AuthForm>
  );
};
