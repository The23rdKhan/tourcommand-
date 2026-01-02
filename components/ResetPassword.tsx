import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useToast } from './Toast';
import { Music2, ArrowLeft, Lock, Loader2, CheckCircle, Eye, EyeOff } from 'lucide-react';

// Password validation utility function
const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  return null;
};

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if we have a valid session/token from the reset link
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsValidToken(true);
        } else {
          // Check URL hash for access token (Supabase magic link format)
          const hashParams = new URLSearchParams(location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const type = hashParams.get('type');

          if (accessToken && type === 'recovery') {
            // Session will be set automatically by Supabase
            setIsValidToken(true);
          } else {
            setIsValidToken(false);
            setError('Invalid or expired reset link. Please request a new password reset.');
          }
        }
      } catch (err) {
        setIsValidToken(false);
        setError('Failed to verify reset link. Please try again.');
      }
    };

    checkSession();
  }, [location]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) throw updateError;

      setSuccess(true);
      addToast('Password updated successfully!', 'success');
      
      // Redirect to login after 2 seconds
      timeoutRef.current = setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to update password';
      setError(errorMessage);
      addToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (isValidToken === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 font-sans">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/50">
          <div className="text-center">
            <Loader2 size={32} className="animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-slate-500">Verifying reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isValidToken === false) {
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
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Invalid Reset Link</h2>
            <p className="text-slate-500 mb-6">
              This password reset link is invalid or has expired.
            </p>
          </div>
          <div className="space-y-4">
            <Link
              to="/forgot-password"
              className="block w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-all text-center"
            >
              Request New Reset Link
            </Link>
            <Link
              to="/login"
              className="block w-full border border-slate-200 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-50 transition-all text-center"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Password Updated</h2>
            <p className="text-slate-500">
              Your password has been successfully updated. Redirecting to login...
            </p>
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
            <Lock className="text-indigo-600" size={24} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Set New Password</h2>
          <p className="text-slate-500">
            Enter your new password below.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-10 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                placeholder="Min 8 chars, 1 uppercase, 1 lowercase, 1 number"
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-10 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                placeholder="Confirm your password"
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
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
            {loading ? 'Updating...' : 'Update Password'}
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

