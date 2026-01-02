import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useToast } from './Toast';
import { useTour } from '../context/TourContext';
import { Music2, ArrowRight, Loader2 } from 'lucide-react';
import { logError, logInfo } from '../utils/logger';

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
            logError('Failed to create user profile', profileError, { context: 'login' });
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
            <p className="text-slate-500">Sign in to your account</p>
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
                    placeholder="you@company.com" 
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
            <div className="text-center pt-2">
                 <Link to="/forgot-password" className="text-sm text-indigo-600 hover:underline">
                    Forgot Password?
                 </Link>
            </div>
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

    // Debug function to auto-fill and test signup
    const handleDebugSignup = async () => {
        const timestamp = Date.now();
        const testEmail = `test-${timestamp}@example.com`;
        
        // Fill form fields
        setFirstName('Test');
        setLastName('User');
        setEmail(testEmail);
        setPassword('Test1234');
        setConfirmPassword('Test1234');
        setAcceptedTerms(true);
        
        // Clear any previous errors
        setError('');
        
        // Wait a moment for state to update, then trigger signup
        setTimeout(async () => {
            // Create a synthetic form event and call handleSignup directly
            const syntheticEvent = {
                preventDefault: () => {},
            } as React.FormEvent;
            
            await handleSignup(syntheticEvent);
        }, 200);
    };

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

            if (data.user && data.session) {
                // Profile is automatically created by database trigger (migration 006)
                // Wait a moment for trigger to complete, then verify profile exists
                await new Promise(resolve => setTimeout(resolve, 200));
                
                // Verify profile was created by trigger
                const { data: profile, error: profileCheckError } = await supabase
                    .from('user_profiles')
                    .select('id')
                    .eq('id', data.user.id)
                    .single();

                if (profileCheckError || !profile) {
                    logError('Profile not found after trigger', profileCheckError, { 
                        context: 'signup',
                        userId: data.user.id,
                        triggerExpected: true
                    });
                    
                    // Fallback: Try to create profile manually if trigger didn't work
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
                        logError('Failed to create user profile (fallback)', profileError, { 
                            context: 'signup',
                            userId: data.user.id,
                            errorCode: profileError.code,
                            errorMessage: profileError.message
                        });
                        
                        // Provide helpful error message based on error type
                        let errorMessage = 'Account created but profile setup failed. ';
                        if (profileError.code === 'PGRST116' || profileError.message?.includes('404')) {
                            errorMessage += 'The user_profiles table may not exist. Please run database migrations.';
                        } else if (profileError.code === '23505') {
                            // Profile already exists (trigger created it) - this is OK
                            // Continue with signup flow - don't show error
                        } else if (profileError.code === '23514' || profileError.message?.includes('check constraint')) {
                            errorMessage += 'Database constraint error. Please run migration 004_allow_null_role.sql to allow null roles.';
                        } else if (profileError.message?.includes('null value') || profileError.message?.includes('NOT NULL')) {
                            errorMessage += 'The role column does not allow NULL. Please run migration 004_allow_null_role.sql.';
                        } else if (profileError.message?.includes('row-level security') || profileError.message?.includes('RLS')) {
                            errorMessage += 'RLS policy error. The database trigger may not be set up. Please run migration 006_auto_create_profile_trigger.sql.';
                        } else {
                            errorMessage += `Error: ${profileError.message || 'Unknown error'}. Check browser console for details.`;
                        }
                        
                        // Only show error if it's not a duplicate (23505)
                        if (profileError.code !== '23505') {
                            setError(errorMessage);
                            addToast(`Database error: ${profileError.message || 'Profile creation failed'}`, 'error');
                            setLoading(false);
                            return;
                        }
                    } else {
                        // Profile created successfully via fallback
                        logInfo('Profile created via fallback (trigger may not have worked)', { userId: data.user.id });
                    }
                } else {
                    // Profile exists - trigger worked!
                    logInfo('Profile created by trigger successfully', { userId: data.user.id });
                }

                addToast('Account created! Redirecting to role selection...', 'success');
                // User is automatically logged in after signup (Supabase handles session)
                // Flow: Sign Up → Role Selection (Onboarding) → Create Tour/Venue → Dashboard
                navigate('/app/onboarding');
            }
        } catch (err: unknown) {
            logError('Signup error', err, { context: 'signup', step: 'auth_signup' });
            
            const errorMessage = err instanceof Error 
                ? err.message 
                : 'Failed to create account';
            
            // Provide more specific error message
            let userFriendlyMessage = errorMessage;
            if (errorMessage.includes('already registered') || errorMessage.includes('User already registered')) {
                userFriendlyMessage = 'An account with this email already exists. Please log in instead.';
            } else if (errorMessage.includes('email')) {
                userFriendlyMessage = 'Invalid email address. Please check and try again.';
            } else if (errorMessage.includes('password')) {
                userFriendlyMessage = 'Password does not meet requirements. Please check and try again.';
            } else {
                userFriendlyMessage = `Database error: ${errorMessage}. Please check the browser console for details.`;
            }
            
            setError(userFriendlyMessage);
            addToast(userFriendlyMessage, 'error');
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
                            placeholder="you@company.com" 
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
                </form>
                
                {/* Debug Button - Only in Development */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={handleDebugSignup}
                            disabled={loading}
                            className="w-full bg-amber-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            title="Debug: Auto-fill form and test signup"
                        >
                            🐛 Debug: Auto-Fill & Test Signup
                        </button>
                        <p className="text-xs text-slate-400 text-center mt-2">
                            Development only - Fills form with test data and submits automatically
                        </p>
                    </div>
                )}
                
                <div className="text-center pt-4">
                    <p className="text-sm text-slate-500">
                        Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};