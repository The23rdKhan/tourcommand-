import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useToast } from './Toast';
import { logError } from '../utils/logger';
import { Music2, Mail, CheckCircle, Loader2, RefreshCw, ArrowLeft } from 'lucide-react';

export const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [email, setEmail] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const checkVerificationStatus = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setChecking(true);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;

      if (session?.user) {
        const userEmail = session.user.email || '';
        setEmail(userEmail);
        const verified = !!session.user.email_confirmed_at;
        setIsVerified(verified);

        if (verified && !silent) {
          addToast('Email verified successfully!', 'success');
          timeoutRef.current = setTimeout(() => {
            navigate('/app/dashboard');
          }, 2000);
        }
      } else {
        // No session, redirect to login
        navigate('/login');
      }
    } catch (err) {
      logError('Error checking verification status', err, { context: 'verify_email' });
      if (!silent) {
        addToast('Failed to check verification status', 'error');
      }
    } finally {
      setLoading(false);
      setChecking(false);
    }
  }, [navigate, addToast]);

  // Check verification status on mount
  useEffect(() => {
    checkVerificationStatus();
  }, [checkVerificationStatus]);

  // Poll for verification every 10 seconds if not verified
  useEffect(() => {
    if (isVerified === false) {
      const interval = setInterval(() => {
        checkVerificationStatus(true);
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [isVerified, checkVerificationStatus]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleResend = async () => {
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;

      addToast('Verification email sent! Check your inbox.', 'success');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to send verification email';
      addToast(errorMessage, 'error');
    } finally {
      setResending(false);
    }
  };

  if (loading) {
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

        <div className="w-full max-w-md bg-white p-10 rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/50">
          <div className="text-center">
            <Loader2 size={32} className="animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-slate-500">Checking verification status...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isVerified) {
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
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Email Verified</h2>
            <p className="text-slate-500">
              Your email has been successfully verified. Redirecting to dashboard...
            </p>
          </div>
          <button
            onClick={() => navigate('/app/dashboard')}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-all"
          >
            Go to Dashboard
          </button>
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
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="text-amber-600" size={24} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Verify Your Email</h2>
          <p className="text-slate-500 mb-4">
            We've sent a verification email to:
          </p>
          <p className="text-lg font-semibold text-slate-900 mb-4">{email}</p>
          <p className="text-sm text-slate-400">
            Click the link in the email to verify your account. This page will automatically update when verified.
          </p>
        </div>

        {checking && (
          <div className="mb-4 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-indigo-600">
              <Loader2 size={16} className="animate-spin" />
              Checking verification status...
            </div>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleResend}
            disabled={resending}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {resending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <RefreshCw size={18} />
                Resend Verification Email
              </>
            )}
          </button>
          <button
            onClick={() => checkVerificationStatus()}
            className="w-full border border-slate-200 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} />
            Check Again
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
        </div>
      </div>
    </div>
  );
};

