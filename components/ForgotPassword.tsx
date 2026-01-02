import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useToast } from './Toast';
import { Music2, ArrowLeft, Mail, Loader2, CheckCircle } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/#/reset-password`,
      });

      if (resetError) throw resetError;

      setSuccess(true);
      addToast('Password reset email sent! Check your inbox.', 'success');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to send reset email';
      setError(errorMessage);
      addToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 font-sans">
        <div className="absolute top-6 left-6">
          <Link to="/" className="flex items-center gap-2 group cursor-pointer text-slate-900">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md">
              <Music2 size={18} />
            </div>
            <span className="font-bold text-lg tracking-tight">TourCommand</span>
          </Link>
        </div>

        <div className="w-full max-w-md bg-white p-10 rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/50 animate-fade-in">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-emerald-600" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Check your email</h2>
            <p className="text-slate-500 mb-4">
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
            <p className="text-sm text-slate-400">
              Click the link in the email to reset your password. The link will expire in 1 hour.
            </p>
          </div>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-all"
            >
              Back to Login
            </button>
            <button
              onClick={() => {
                setSuccess(false);
                setEmail('');
              }}
              className="w-full border border-slate-200 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-50 transition-all"
            >
              Send another email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 font-sans">
      <div className="absolute top-6 left-6">
        <Link to="/" className="flex items-center gap-2 group cursor-pointer text-slate-900">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md">
            <Music2 size={18} />
          </div>
          <span className="font-bold text-lg tracking-tight">TourCommand</span>
        </Link>
      </div>

      <div className="w-full max-w-md bg-white p-10 rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/50 animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="text-indigo-600" size={24} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Reset Password</h2>
          <p className="text-slate-500">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
              placeholder="you@company.com"
            />
          </div>
          {error && (
            <div className="text-rose-600 text-sm bg-rose-50 p-3 rounded-lg">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : null}
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
          <div className="text-center pt-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

