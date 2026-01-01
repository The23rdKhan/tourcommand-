import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { TourProvider, useTour } from './context/TourContext';
import { ToastProvider } from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LayoutDashboard, Calendar, MessageSquare, Menu, X, Music2, MapPin, Settings as SettingsIcon, LogOut, Users } from 'lucide-react';
import { trackEvent } from './utils/analytics';

// Components
import Dashboard from './components/Dashboard';
import TourList from './components/TourManager'; 
import TourDetail from './components/TourDetail';
import ShowDetail from './components/ShowDetail';
import Assistant from './components/Assistant';
import Venues from './components/Venues';
import VenueDetail from './components/VenueDetail';
import Vendors from './components/Vendors';
import Settings from './components/Settings';
import Onboarding from './components/Onboarding';
import { Login, Signup } from './components/Auth';
import { Home, Features, Pricing } from './components/Marketing';

// -- Sidebar Component for Logged In App --
const AppSidebar: React.FC<{ mobileMenuOpen: boolean, setMobileMenuOpen: (v: boolean) => void }> = ({ mobileMenuOpen, setMobileMenuOpen }) => {
    const { logout, user } = useTour();
    const location = useLocation();

    const NavLink: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
        const isActive = location.pathname.startsWith(to);
        return (
            <Link 
            to={to} 
            onClick={() => {
                setMobileMenuOpen(false);
                trackEvent(`nav_${label.toLowerCase().replace(' ', '_')}`);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            >
            {icon}
            <span className="font-medium text-sm">{label}</span>
            </Link>
        );
    };

    return (
        <>
            <aside className={`fixed inset-y-0 left-0 bg-slate-900 border-r border-slate-800 w-64 z-40 transform transition-transform duration-300 md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                        <Music2 size={20} className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-white">TourCommand</h1>
                </div>
                
                <nav className="flex-1 p-4 space-y-2">
                    <NavLink to="/app/dashboard" icon={<LayoutDashboard size={20} />} label="Overview" />
                    <NavLink to="/app/tours" icon={<Calendar size={20} />} label="Tours" />
                    <NavLink to="/app/venues" icon={<MapPin size={20} />} label="Venues" />
                    <NavLink to="/app/vendors" icon={<Users size={20} />} label="Crew & Vendors" />
                    <NavLink to="/app/assistant" icon={<MessageSquare size={20} />} label="AI Analyst" />
                    <NavLink to="/app/settings" icon={<SettingsIcon size={20} />} label="Settings" />
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-bold">
                                {user?.name ? user.name.substring(0,2).toUpperCase() : 'NH'}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-white truncate w-24">{user?.name || 'Neon Horizon'}</p>
                                <p className="text-xs text-slate-500">{user?.role || 'Manager'}</p>
                            </div>
                        </div>
                        <button onClick={logout} className="text-slate-500 hover:text-white"><LogOut size={16} /></button>
                    </div>
                </div>
            </aside>
            {mobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>}
        </>
    );
};

// -- App Layout Wrapper --
const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useTour();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      <AppSidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <main className="flex-1 md:ml-64 relative min-h-screen">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <Music2 className="text-indigo-500" size={24} />
            <span className="font-bold text-lg">TourCommand</span>
          </div>
          <button onClick={() => setMobileMenuOpen(true)} className="text-slate-300">
            <Menu size={24} />
          </button>
        </div>

        <div className="p-6 max-w-7xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

// -- Main App Component --
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <TourProvider>
        <Router>
            <Routes>
                {/* Public Marketing Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/features" element={<Features />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected App Routes */}
                <Route path="/app" element={<Navigate to="/app/dashboard" />} />
                <Route path="/app/onboarding" element={<ProtectedLayout><Onboarding /></ProtectedLayout>} />
                <Route path="/app/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
                <Route path="/app/tours" element={<ProtectedLayout><TourList /></ProtectedLayout>} />
                <Route path="/app/tours/:tourId" element={<ProtectedLayout><TourDetail /></ProtectedLayout>} />
                <Route path="/app/tours/:tourId/shows/:showId" element={<ProtectedLayout><ShowDetail /></ProtectedLayout>} />
                <Route path="/app/venues" element={<ProtectedLayout><Venues /></ProtectedLayout>} />
                <Route path="/app/venues/:venueId" element={<ProtectedLayout><VenueDetail /></ProtectedLayout>} />
                <Route path="/app/vendors" element={<ProtectedLayout><Vendors /></ProtectedLayout>} />
                <Route path="/app/settings" element={<ProtectedLayout><Settings /></ProtectedLayout>} />
                <Route path="/app/assistant" element={<ProtectedLayout><Assistant /></ProtectedLayout>} />
            </Routes>
        </Router>
        </TourProvider>
    </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;