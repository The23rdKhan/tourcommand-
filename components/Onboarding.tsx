import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTour } from '../context/TourContext';
import { useToast } from './Toast';
import { User, Music2, Calendar, MapPin, CheckCircle, ArrowRight, Building2, Globe, DollarSign, Loader2, Shield, TrendingUp, AlertCircle, Mail } from 'lucide-react';
import { Tour, Show, ShowStatus, DealType, Venue } from '../types';

const Onboarding: React.FC = () => {
  const { updateUser, addTour, addVenue, addShow, user, session, tours, venues } = useTour();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailVerified, setEmailVerified] = useState<boolean>(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Step 1: Profile
  const [profile, setProfile] = useState({
      name: '',
      role: 'Artist' as 'Artist' | 'Manager' | 'Operator'
  });

  // Step 2: Path A (Artist/Manager) - Tour
  const [tourData, setTourData] = useState({
      name: '',
      region: 'North America',
      startDate: new Date().toISOString().split('T')[0],
      currency: 'USD'
  });

  // Step 2: Path B (Operator) - Venue
  const [venueData, setVenueData] = useState({
      name: '',
      city: '',
      capacity: 0
  });

  // Check if onboarding is already completed
  useEffect(() => {
    if (user && (tours.length > 0 || venues.length > 0)) {
      addToast("You've already completed onboarding", 'info');
      navigate('/app/dashboard');
    }
  }, [user, tours.length, venues.length, navigate, addToast]);

  // Pre-fill name from user context
  useEffect(() => {
    if (user?.name && !profile.name) {
      setProfile(prev => ({ ...prev, name: user.name }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Intentionally only depend on user - we don't want to re-run when profile.name changes

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Check email verification status
  useEffect(() => {
    const checkEmailVerification = async () => {
      if (session?.user) {
        setEmailVerified(session.user.email_confirmed_at !== null);
      }
    };
    checkEmailVerification();
  }, [session]);

  // Validation functions
  const isFutureDate = (date: string) => {
    const selectedDate = new Date(date + 'T00:00:00'); // Force local time
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  };

  const validateTourData = () => {
    if (!tourData.name.trim()) {
      return 'Tour name is required';
    }
    if (tourData.name.trim().length < 2) {
      return 'Tour name must be at least 2 characters';
    }
    if (!isFutureDate(tourData.startDate)) {
      return 'Start date must be today or in the future';
    }
    return null;
  };

  const validateVenueData = () => {
    if (!venueData.name.trim()) {
      return 'Venue name is required';
    }
    if (venueData.name.trim().length < 2) {
      return 'Venue name must be at least 2 characters';
    }
    if (!venueData.city.trim()) {
      return 'City is required';
    }
    if (venueData.capacity <= 0) {
      return 'Capacity must be greater than 0';
    }
    return null;
  };

  const validateProfile = () => {
    const trimmedName = profile.name.trim();
    if (!trimmedName) {
      return 'Name is required';
    }
    if (trimmedName.length < 2) {
      return 'Name must be at least 2 characters';
    }
    return null;
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validate profile
      const profileError = validateProfile();
      if (profileError) {
        setError(profileError);
        setIsSubmitting(false);
        return;
      }

      // 1. Update Profile
      await updateUser({
          name: profile.name.trim(),
          role: profile.role,
          tier: 'Free' // Default
      });
      addToast('Profile updated', 'success');

      // 2. Branch Logic based on Role
      if (profile.role === 'Operator') {
          // Validate venue data
          const venueError = validateVenueData();
          if (venueError) {
            setError(venueError);
            setIsSubmitting(false);
            return;
          }

          // Create Venue
          const newVenue = await addVenue({
              name: venueData.name.trim(),
              city: venueData.city.trim(),
              capacity: venueData.capacity,
              contactName: profile.name.trim(),
              contactEmail: user?.email || '',
              notes: 'Main Venue'
          });
          addToast('Venue created! Redirecting...', 'success');
          
          // Brief delay to show success message
          timeoutRef.current = setTimeout(() => {
            navigate(`/app/venues/${newVenue.id}`);
          }, 500);
      } else {
          // Validate tour data
          const tourError = validateTourData();
          if (tourError) {
            setError(tourError);
            setIsSubmitting(false);
            return;
          }

          // Create Tour & Draft Show
          const endDate = new Date(tourData.startDate);
          endDate.setMonth(endDate.getMonth() + 1);
          
          const newTour = await addTour({
              name: tourData.name.trim(),
              artist: profile.role === 'Artist' ? profile.name.trim() : 'My Roster Artist',
              startDate: tourData.startDate,
              endDate: endDate.toISOString().split('T')[0],
              region: tourData.region,
              shows: [],
              currency: tourData.currency
          });

          // Create a generic placeholder show
          await addShow(newTour.id, {
              tourId: newTour.id,
              date: tourData.startDate,
              city: 'TBD City',
              venue: 'TBD Venue',
              status: ShowStatus.DRAFT,
              dealType: DealType.GUARANTEE,
              financials: {
                  guarantee: 0,
                  ticketPrice: 0,
                  soldCount: 0,
                  capacity: 0,
                  expenses: { venue: 0, production: 0, travel: 0, hotels: 0, marketing: 0, misc: 0 },
                  merchSales: 0
              }
          });

          addToast('Tour created! Redirecting...', 'success');
          
          // Brief delay to show success message
          timeoutRef.current = setTimeout(() => {
            navigate(`/app/tours/${newTour.id}`);
          }, 500);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to complete setup. Please try again.';
      setError(errorMessage);
      addToast(errorMessage, 'error');
      console.error('Error completing onboarding:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Dynamic Side Panel Content ---
  const getSidebarContent = () => {
      if (step === 1) {
          return {
              icon: <User size={32} className="text-indigo-400" />,
              title: "Welcome to TourCommand",
              description: "Let's tailor your workspace. Are you managing the show, performing the show, or hosting the show?",
              features: ["Customized Dashboard", "Role-specific Tools", "Relevant Analytics"]
          };
      }
      if (profile.role === 'Operator') {
          return {
              icon: <Building2 size={32} className="text-amber-400" />,
              title: "Venue Setup",
              description: "Let's set up your primary venue to start tracking holds and confirmed dates.",
              features: ["Utilization Heatmaps", "Calendar Pipeline", "Offer Management"]
          };
      }
      return {
          icon: <Music2 size={32} className="text-emerald-400" />,
          title: "First Tour Setup",
          description: "We'll create a workspace for your upcoming run. Don't worry, you can add specific dates later.",
          features: ["Route Distance Tracking", "Financial Tracking", "Vendor Management"]
      };
  };

  const sidebar = getSidebarContent();

  if (isSubmitting) {
      return (
          <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
              <div className="w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center mb-6">
                  <Loader2 size={32} className="text-indigo-400 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Configuring Workspace...</h2>
              <p className="text-slate-400">Setting up your {profile.role === 'Operator' ? 'Venue Pipeline' : 'Tour Routing Engine'}.</p>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
        {/* Left Sidebar: Context & Value Prop */}
        <div className="hidden lg:flex w-1/3 bg-slate-950 border-r border-slate-800 p-12 flex-col justify-between relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-600 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-10 right-10 w-64 h-64 bg-emerald-600 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-12">
                     <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                        <Music2 size={18} />
                    </div>
                    <span className="font-bold text-xl text-white">TourCommand</span>
                </div>
                
                <div className="mb-8">
                    <div className="w-16 h-16 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center mb-6 shadow-xl">
                        {sidebar.icon}
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-4 leading-tight">{sidebar.title}</h1>
                    <p className="text-lg text-slate-400 leading-relaxed">{sidebar.description}</p>
                </div>

                <ul className="space-y-4">
                    {sidebar.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-300">
                            <CheckCircle size={20} className="text-indigo-500" /> {feature}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="relative z-10 flex gap-2">
                 <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-indigo-500' : 'bg-slate-800'}`}></div>
                 <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-indigo-500' : 'bg-slate-800'}`}></div>
            </div>
        </div>

        {/* Right Content: Interactive Form */}
        <div className="flex-1 flex flex-col justify-center p-6 lg:p-24 relative">
             <div className="max-w-xl w-full mx-auto">
                <div className="lg:hidden mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">{sidebar.title}</h1>
                    <div className="flex gap-2 mb-6">
                        <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-indigo-500' : 'bg-slate-800'}`}></div>
                        <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-indigo-500' : 'bg-slate-800'}`}></div>
                    </div>
                </div>

                {step === 1 && (
                    <div className="space-y-8 animate-fade-in">
                        {/* Email Verification Banner */}
                        {user && !emailVerified && (
                            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg flex items-center gap-2">
                                <Mail size={20} className="text-amber-600" />
                                <span className="text-sm">Please check your email to verify your account.</span>
                            </div>
                        )}

                        {/* Error Display */}
                        {error && (
                            <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-lg flex items-center gap-2">
                                <AlertCircle size={20} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">First Name</label>
                            <input 
                                type="text" 
                                autoFocus
                                className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-4 text-white text-lg focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-600 transition-all focus:border-indigo-500"
                                placeholder="Enter your name"
                                value={profile.name}
                                onChange={e => setProfile({...profile, name: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-4">Select your primary role</label>
                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { id: 'Artist', label: 'Artist / Musician', sub: 'I want to route tours and track my show profits.', icon: Music2 },
                                    { id: 'Manager', label: 'Artist Manager', sub: 'I manage a roster and need financial oversight.', icon: Shield },
                                    { id: 'Operator', label: 'Venue Operator / Promoter', sub: 'I manage a venue calendar and book talent.', icon: Building2 }
                                ].map((role) => (
                                    <button
                                        key={role.id}
                                        onClick={() => setProfile({...profile, role: role.id as 'Artist' | 'Manager' | 'Operator'})}
                                        className={`p-5 rounded-xl border text-left transition-all flex items-center gap-4 group ${
                                            profile.role === role.id 
                                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/20' 
                                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-800/80'
                                        }`}
                                    >
                                        <div className={`p-3 rounded-lg ${profile.role === role.id ? 'bg-white/20' : 'bg-slate-900'}`}>
                                            <role.icon size={24} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-lg mb-0.5">{role.label}</div>
                                            <div className={`text-sm ${profile.role === role.id ? 'text-indigo-100' : 'text-slate-500 group-hover:text-slate-400'}`}>{role.sub}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button 
                            onClick={() => {
                                setError(null); // Clear previous errors
                                const validationError = validateProfile();
                                if (validationError) {
                                    setError(validationError);
                                } else {
                                    setStep(2);
                                }
                            }}
                            disabled={!profile.name.trim()}
                            className="w-full bg-white text-slate-900 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            Continue <ArrowRight size={20} />
                        </button>
                    </div>
                )}

                {step === 2 && profile.role !== 'Operator' && (
                    <div className="space-y-8 animate-fade-in">
                        {/* Error Display */}
                        {error && (
                            <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-lg flex items-center gap-2">
                                <AlertCircle size={20} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Tour Name</label>
                            <input 
                                type="text" 
                                autoFocus
                                className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-4 text-white text-lg focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-600"
                                placeholder="e.g. Summer 2025 Run"
                                value={tourData.name}
                                onChange={e => setTourData({...tourData, name: e.target.value})}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Primary Region</label>
                                <div className="relative">
                                    <select
                                        className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-4 text-white appearance-none focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={tourData.region}
                                        onChange={e => setTourData({...tourData, region: e.target.value})}
                                    >
                                        <option value="North America">North America</option>
                                        <option value="Europe">Europe</option>
                                        <option value="UK">UK & Ireland</option>
                                        <option value="Australia">Australia & NZ</option>
                                    </select>
                                    <Globe className="absolute right-4 top-4 text-slate-500 pointer-events-none" size={20} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Currency</label>
                                <div className="relative">
                                    <select
                                        className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-4 text-white appearance-none focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={tourData.currency}
                                        onChange={e => setTourData({...tourData, currency: e.target.value})}
                                    >
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                    </select>
                                    <DollarSign className="absolute right-4 top-4 text-slate-500 pointer-events-none" size={20} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Approx. Start Date</label>
                            <input 
                                type="date" 
                                className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none [color-scheme:dark]"
                                value={tourData.startDate}
                                onChange={e => setTourData({...tourData, startDate: e.target.value})}
                            />
                            <p className="text-xs text-slate-500 mt-2">You can add specific show dates later.</p>
                        </div>

                        <div className="flex gap-4">
                            <button 
                                onClick={() => {
                                    setError(null); // Clear errors when going back
                                    setStep(1);
                                }}
                                className="px-6 py-4 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            >
                                Back
                            </button>
                            <button 
                                onClick={handleFinish}
                                disabled={!tourData.name}
                                className="flex-1 bg-white text-slate-900 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            >
                                Launch Dashboard <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && profile.role === 'Operator' && (
                    <div className="space-y-8 animate-fade-in">
                        {/* Error Display */}
                        {error && (
                            <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-lg flex items-center gap-2">
                                <AlertCircle size={20} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Venue Name</label>
                            <input 
                                type="text" 
                                autoFocus
                                className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-4 text-white text-lg focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-600"
                                placeholder="e.g. The Blue Room"
                                value={venueData.name}
                                onChange={e => setVenueData({...venueData, name: e.target.value})}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                             <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">City</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="e.g. Nashville"
                                    value={venueData.city}
                                    onChange={e => setVenueData({...venueData, city: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Capacity</label>
                                <input 
                                    type="number" 
                                    className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="e.g. 500"
                                    value={venueData.capacity || ''}
                                    onChange={e => {
                                        const value = e.target.value;
                                        const numValue = value === '' ? 0 : parseInt(value, 10);
                                        if (!isNaN(numValue)) {
                                            setVenueData({...venueData, capacity: numValue});
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex gap-3">
                            <TrendingUp className="text-emerald-400 shrink-0 mt-1" size={20} />
                            <div className="text-sm text-slate-400">
                                <strong className="text-slate-200 block mb-1">Utilization Tracking</strong>
                                We'll automatically create a calendar pipeline for this venue so you can track holds and confirmed shows immediately.
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button 
                                onClick={() => {
                                    setError(null); // Clear errors when going back
                                    setStep(1);
                                }}
                                className="px-6 py-4 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            >
                                Back
                            </button>
                            <button 
                                onClick={handleFinish}
                                disabled={!venueData.name || !venueData.city}
                                className="flex-1 bg-white text-slate-900 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            >
                                Create Venue <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
             </div>
        </div>
    </div>
  );
};

export default Onboarding;