import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useToast } from './Toast';
import { useTour } from '../context/TourContext';
import { Music2, ArrowRight, Loader2 } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { isAuthenticated, loading: authLoading, user, tours, venues } = useTour();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect authenticated users
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      // Check if user has completed onboarding
      if (tours.length > 0 || venues.length > 0) {
        navigate('/app/dashboard');
      } else {
        navigate('/app/onboarding');
      }
    }
  }, [isAuthenticated, authLoading, tours.length, venues.length, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate inputs
    if (!email.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      setError('Password is required');
      setLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (authError) throw authError;

      if (data.user) {
        // Check if user profile exists, create if not
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (!profile) {
          // Create profile from auth user
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              id: data.user.id,
              name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
              email: data.user.email || '',
              role: null, // Will be set during onboarding
              tier: 'Free'
            });

          if (profileError) {
            console.error('Failed to create user profile:', profileError);
            setError('Account created but profile setup failed. Please contact support.');
            addToast('Profile creation failed. Please try logging in again.', 'error');
            setLoading(false);
            return;
          }
        }

        addToast('Logged in successfully', 'success');
        navigate('/app/dashboard');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to log in';
      setError(errorMessage);
      addToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-indigo-600" />
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
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h2>
            <p className="text-slate-500">Sign in to your command center</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" 
                    placeholder="manager@band.com" 
                />
            </div>
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" 
                    placeholder="••••••••" 
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
                Sign In
            </button>
            <div className="text-center pt-4">
                 <p className="text-sm text-slate-500">
                    Don't have an account? <Link to="/signup" className="text-indigo-600 font-bold hover:underline">Sign up</Link>
                 </p>
            </div>
        </form>
      </div>
    </div>
  );
};

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

export const Signup: React.FC = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const { isAuthenticated, loading: authLoading, tours, venues } = useTour();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Redirect authenticated users
    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            // Check if user has completed onboarding
            if (tours.length > 0 || venues.length > 0) {
                navigate('/app/dashboard');
            } else {
                navigate('/app/onboarding');
            }
        }
    }, [isAuthenticated, authLoading, tours.length, venues.length, navigate]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate name fields
        const firstNameTrimmed = firstName.trim();
        const lastNameTrimmed = lastName.trim();

        if (!firstNameTrimmed) {
            setError('First name is required');
            setLoading(false);
            return;
        }

        if (!lastNameTrimmed) {
            setError('Last name is required');
            setLoading(false);
            return;
        }

        // Validate email
        if (!email.trim()) {
            setError('Email is required');
            setLoading(false);
            return;
        }

        // Validate password
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            setLoading(false);
            return;
        }

        if (!acceptedTerms) {
            setError('You must accept the Terms of Service to continue');
            setLoading(false);
            return;
        }

        // Combine first and last name
        const fullName = `${firstNameTrimmed} ${lastNameTrimmed}`;

        try {
            const { data, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: fullName,
                        first_name: firstName.trim(),
                        last_name: lastName.trim()
                    }
                }
            });

            if (authError) {
                // Check for duplicate email
                if (authError.message?.includes('already registered') || 
                    authError.message?.includes('User already registered') ||
                    authError.code === 'signup_disabled') {
                    setError('An account with this email already exists. Please log in instead.');
                    addToast('An account with this email already exists. Please log in instead.', 'error');
                    setLoading(false);
                    return;
                }
                throw authError;
            }

            if (data.user) {
                // Create user profile with error handling
                const { error: profileError } = await supabase
                    .from('user_profiles')
                    .insert({
                        id: data.user.id,
                        name: fullName,
                        email: email.trim(),
                        role: null, // Will be set during onboarding
                        tier: 'Free'
                    });

                if (profileError) {
                    console.error('Failed to create user profile:', profileError);
                    // Attempt to clean up auth user (optional - may require admin privileges)
                    try {
                        await supabase.auth.admin.deleteUser(data.user.id);
                    } catch (cleanupError) {
                        console.error('Failed to cleanup auth user:', cleanupError);
                    }
                    setError('Account created but profile setup failed. Please contact support.');
                    addToast('Profile creation failed. Please try signing up again or contact support.', 'error');
                    setLoading(false);
                    return;
                }

                addToast('Account created! Redirecting to role selection...', 'success');
                // User is automatically logged in after signup (Supabase handles session)
                // Flow: Sign Up → Role Selection (Onboarding) → Create Tour/Venue → Dashboard
                navigate('/app/onboarding');
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error 
                ? err.message 
                : 'Failed to create account';
            setError(errorMessage);
            addToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    // Show loading state while checking authentication
    if (authLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-indigo-600" />
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
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Get Started Free</h2>
                    <p className="text-slate-500">Professional tour management in minutes.</p>
                </div>
                <form onSubmit={handleSignup} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                            <input 
                                type="text" 
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" 
                                placeholder="John" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
                            <input 
                                type="text" 
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" 
                                placeholder="Doe" 
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" 
                            placeholder="you@artist.com" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                        <input 
                            type="password" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" 
                            placeholder="Min 8 chars, 1 uppercase, 1 lowercase, 1 number" 
                            minLength={8}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
                        <input 
                            type="password" 
                            required 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" 
                            placeholder="Confirm your password" 
                            minLength={8}
                        />
                    </div>
                    <div className="flex items-start gap-3">
                        <input 
                            type="checkbox" 
                            id="terms"
                            required
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                            className="mt-1 w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                        />
                        <label htmlFor="terms" className="text-sm text-slate-600">
                            I agree to the{' '}
                            <Link to="/terms" className="text-indigo-600 hover:underline font-medium">
                                Terms of Service
                            </Link>
                            {' '}and{' '}
                            <Link to="/privacy" className="text-indigo-600 hover:underline font-medium">
                                Privacy Policy
                            </Link>
                        </label>
                    </div>
                    {error && (
                        <div className="text-rose-600 text-sm bg-rose-50 p-3 rounded-lg">
                            {error}
                        </div>
                    )}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                        Create Account
                    </button>
                    <div className="text-center pt-4">
                        <p className="text-sm text-slate-500">
                            Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Log in</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};