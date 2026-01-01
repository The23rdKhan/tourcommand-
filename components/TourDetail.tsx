import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTour } from '../context/TourContext';
import { useToast } from './Toast';
import { ShowStatus, DealType, Show, Venue, Tour } from '../types';
import Breadcrumbs from './Breadcrumbs';
import { Plus, MapPin, DollarSign, Edit2, Trash2, ArrowRight, FileText, X, Download, Lock, Truck, AlertTriangle, Fuel, Clock, Check, Building2, User, Briefcase, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { trackEvent } from '../utils/analytics';
import { calculateRouteMetrics } from '../utils/geo';

const TourDetail: React.FC = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const { tours, addShow, updateShow, deleteShow, updateTour, user, venues, addVenue, updateVenue } = useTour();
  const { addToast } = useToast();
  const tour = tours.find(t => t.id === tourId);

  const [activeTab, setActiveTab] = useState<'overview' | 'shows' | 'budget' | 'notes'>('overview');
  const [isAddShowModalOpen, setIsAddShowModalOpen] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  // Edit Tour State
  const [isEditTourModalOpen, setIsEditTourModalOpen] = useState(false);
  const [editTourData, setEditTourData] = useState<{
      name: string;
      tourManager: string;
      bookingAgent: string;
      startDate: string;
      endDate: string;
  }>({ name: '', tourManager: '', bookingAgent: '', startDate: '', endDate: '' });

  // Venue Selection State for Add Show Modal
  const [isVenueDropdownOpen, setIsVenueDropdownOpen] = useState(false);
  const [isCreateVenueOpen, setIsCreateVenueOpen] = useState(false);
  const [newVenueData, setNewVenueData] = useState({ name: '', city: '', capacity: 0 });
  
  // Inline Editing State
  const [editingCell, setEditingCell] = useState<{showId: string, field: 'city' | 'venue' | 'status'} | null>(null);

  const [newShowData, setNewShowData] = useState({
      date: '',
      city: '',
      venue: '',
      dealType: DealType.GUARANTEE
  });

  if (!tour) return <div className="p-8">Tour not found</div>;

  // --- Handlers ---

  const handleExportCSV = async () => {
      try {
        const { supabase } = await import('../lib/supabase');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          addToast("Please log in to export", 'error');
          return;
        }

        const response = await fetch(`/api/exports/csv?tourId=${tour.id}`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        if (!response.ok) throw new Error('Export failed');

        const csvContent = await response.text();
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${tour.name.replace(/\s+/g, '_')}_Report.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        setShowExportMenu(false);
        addToast("Report exported successfully!", 'success');
        trackEvent('tour_exported', { tourId: tour.id, type: 'csv' });
      } catch (error) {
        addToast("Failed to export report", 'error');
      }
  };

  const handleOpenEditTour = () => {
    setEditTourData({
        name: tour.name,
        tourManager: tour.tourManager || '',
        bookingAgent: tour.bookingAgent || '',
        startDate: tour.startDate,
        endDate: tour.endDate
    });
    setIsEditTourModalOpen(true);
  };

  const handleSaveTour = () => {
    if (!tour) return;
    const updated: Tour = {
        ...tour,
        name: editTourData.name,
        tourManager: editTourData.tourManager,
        bookingAgent: editTourData.bookingAgent,
        startDate: editTourData.startDate,
        endDate: editTourData.endDate
    };
    updateTour(updated);
    setIsEditTourModalOpen(false);
    addToast("Tour details updated", 'success');
    trackEvent('tour_updated', { tourId: tour.id });
  };

  const handleOpenAddShow = () => {
      setNewShowData({
          date: '',
          city: '',
          venue: '',
          dealType: DealType.GUARANTEE
      });
      setIsAddShowModalOpen(true);
  };

  const handleCreateShow = () => {
    const newShow: Show = {
        id: `s-${Date.now()}`,
        tourId: tour.id,
        date: newShowData.date || new Date().toISOString().split('T')[0],
        city: newShowData.city || 'TBD City',
        venue: newShowData.venue || 'TBD Venue',
        status: ShowStatus.DRAFT,
        dealType: newShowData.dealType,
        financials: {
            guarantee: 0,
            ticketPrice: 0,
            soldCount: 0,
            capacity: 0,
            expenses: { venue: 0, production: 0, travel: 0, hotels: 0, marketing: 0, misc: 0 },
            merchSales: 0
        }
    };
    addShow(tour.id, newShow);
    addToast("Show created successfully", 'success');
    trackEvent('show_created', { tourId: tour.id });
    setIsAddShowModalOpen(false);
  };

  const handleVenueSelect = (venue: Venue) => {
    setNewShowData(prev => ({
        ...prev,
        venue: venue.name,
        city: venue.city || prev.city 
    }));
    setIsVenueDropdownOpen(false);
  };

  const handleCreateVenue = async () => {
    if (!newVenueData.name) return;
      
    try {
        const venue = await addVenue({
            name: newVenueData.name,
            city: newVenueData.city,
            capacity: newVenueData.capacity,
            contactName: '',
            contactEmail: '',
            notes: ''
        });
        
        // Auto-select the new venue
        setNewShowData(prev => ({
            ...prev,
            venue: venue.name,
            city: venue.city
        }));

        setIsCreateVenueOpen(false);
        setNewVenueData({ name: '', city: '', capacity: 0 });
        addToast(`Venue "${venue.name}" created`, 'success');
        trackEvent('venue_quick_created', { city: venue.city });
    } catch (error) {
        addToast("Failed to create venue", 'error');
    }
  };

  const filteredVenues = venues.filter(v => 
    v.name.toLowerCase().includes((newShowData.venue || '').toLowerCase())
  );

  const handleInlineUpdate = (show: Show, field: keyof Show, value: any) => {
    if (tourId) {
        updateShow(tourId, { ...show, [field]: value });
        setEditingCell(null);
        addToast("Updated", 'success');
    }
  };

  const calculateShowProfit = (show: Show) => {
    const expenses = (Object.values(show.financials.expenses) as number[]).reduce((a, b) => a + b, 0);
    const revenue = show.financials.guarantee + (show.financials.ticketPrice * show.financials.soldCount) + show.financials.merchSales;
    return revenue - expenses;
  };

  const chartData = tour.shows.map(show => {
    const expenses = (Object.values(show.financials.expenses) as number[]).reduce((a, b) => a + b, 0);
    const revenue = show.financials.guarantee + (show.financials.ticketPrice * show.financials.soldCount) + show.financials.merchSales;
    return {
      name: show.city.split(',')[0],
      Profit: revenue - expenses
    };
  });

  const sortedShows = [...tour.shows].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[
        { label: 'Tours', to: '/app/tours' },
        { label: tour.name }
      ]} />

      <div className="flex justify-between items-end">
        <div>
            <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{tour.name}</h1>
                <button 
                    onClick={handleOpenEditTour}
                    className="text-slate-500 hover:text-white transition-colors p-1.5 hover:bg-slate-800 rounded-lg"
                    title="Edit Tour Details"
                >
                    <Edit2 size={18} />
                </button>
            </div>
            <p className="text-slate-400 text-sm flex items-center gap-2">
                <span>{tour.region}</span>
                <span>•</span>
                <span>{tour.shows.length} Shows</span>
                <span>•</span>
                <span>{new Date(tour.startDate).getFullYear()}</span>
                {tour.tourManager && (
                    <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-indigo-400"><User size={12}/> TM: {tour.tourManager}</span>
                    </>
                )}
            </p>
        </div>
        <div className="flex gap-2 relative">
            <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-700 text-sm font-medium transition-colors flex items-center gap-2"
            >
                <Download size={16} /> Export Report
            </button>
            {showExportMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
                    <button 
                        onClick={handleExportCSV}
                        className="w-full text-left px-4 py-3 hover:bg-slate-700 text-slate-300 text-sm flex items-center justify-between"
                    >
                        <span>CSV Data Export</span>
                    </button>
                    <div className="border-t border-slate-700"></div>
                    <button 
                        onClick={async () => {
                            if (user?.tier === 'Free') {
                                addToast('PDF export requires Pro subscription', 'error');
                                navigate('/app/settings');
                            } else {
                                try {
                                    const { supabase } = await import('../lib/supabase');
                                    const { data: { session } } = await supabase.auth.getSession();
                                    if (!session) return;
                                    
                                    const response = await fetch(`/api/exports/pdf?tourId=${tour.id}`, {
                                        headers: { 'Authorization': `Bearer ${session.access_token}` }
                                    });
                                    
                                    if (response.ok) {
                                        const blob = await response.blob();
                                        const url = window.URL.createObjectURL(blob);
                                        const link = document.createElement('a');
                                        link.href = url;
                                        link.download = `${tour.name.replace(/\s+/g, '_')}_Report.pdf`;
                                        link.click();
                                        window.URL.revokeObjectURL(url);
                                        addToast('PDF exported successfully', 'success');
                                    }
                                } catch (error) {
                                    addToast('Failed to export PDF', 'error');
                                }
                            }
                        }}
                        className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between group ${user?.tier === 'Free' ? 'bg-slate-900/50 cursor-not-allowed opacity-80' : 'hover:bg-slate-700 text-slate-300'}`}
                    >
                        <div className="flex flex-col">
                            <span className={user?.tier === 'Free' ? 'text-slate-500' : 'text-slate-300'}>Branded PDF Report</span>
                            {user?.tier === 'Free' && <span className="text-[10px] text-indigo-400 font-bold uppercase mt-0.5">Pro Feature</span>}
                        </div>
                        {user?.tier === 'Free' && <Lock size={14} className="text-slate-500" />}
                    </button>
                    <div className="border-t border-slate-700"></div>
                            <button 
                                onClick={async () => {
                                    if (user?.tier === 'Free') {
                                        addToast('Shareable links require Pro subscription', 'error');
                                        navigate('/app/settings');
                                    } else {
                                        try {
                                            const { supabase } = await import('../lib/supabase');
                                            const { data: { session } } = await supabase.auth.getSession();
                                            if (!session) return;
                                            
                                            const response = await fetch('/api/exports/share', {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${session.access_token}`
                                                },
                                                body: JSON.stringify({ tourId: tour.id })
                                            });
                                            
                                            if (response.ok) {
                                                const data = await response.json();
                                                navigator.clipboard.writeText(data.data.shareUrl);
                                                addToast('Shareable link copied to clipboard!', 'success');
                                            }
                                        } catch (error) {
                                            addToast('Failed to create shareable link', 'error');
                                        }
                                    }
                                }}
                                className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between group ${user?.tier === 'Free' ? 'bg-slate-900/50 cursor-not-allowed opacity-80' : 'hover:bg-slate-700 text-slate-300'}`}
                            >
                                <div className="flex flex-col">
                                    <span className={user?.tier === 'Free' ? 'text-slate-500' : 'text-slate-300'}>Shareable Web Link</span>
                                    {user?.tier === 'Free' && <span className="text-[10px] text-indigo-400 font-bold uppercase mt-0.5">Pro Feature</span>}
                                </div>
                                {user?.tier === 'Free' && <Lock size={14} className="text-slate-500" />}
                            </button>
                </div>
            )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700 space-x-6">
        {['overview', 'shows', 'budget', 'notes'].map(tab => (
            <button 
                key={tab}
                onClick={() => { setActiveTab(tab as any); trackEvent('tour_tab_changed', { tab }); }}
                className={`pb-3 text-sm font-medium capitalize transition-colors border-b-2 ${
                    activeTab === tab 
                    ? 'border-indigo-500 text-indigo-400' 
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
            >
                {tab}
            </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6 animate-fade-in">
        {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Profit Trend</h3>
                    <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                <Bar dataKey="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Tour Stats</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between p-3 bg-slate-900 rounded-lg">
                            <span className="text-slate-400">Total Shows</span>
                            <span className="text-white font-bold">{tour.shows.length}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-slate-900 rounded-lg">
                            <span className="text-slate-400">Confirmed</span>
                            <span className="text-emerald-400 font-bold">{tour.shows.filter(s => s.status === ShowStatus.CONFIRMED).length}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-slate-900 rounded-lg">
                            <span className="text-slate-400">Holds/Pending</span>
                            <span className="text-amber-400 font-bold">{tour.shows.filter(s => s.status !== ShowStatus.CONFIRMED).length}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-slate-900 rounded-lg">
                             <div className="flex items-center gap-2">
                                <User size={14} className="text-indigo-400" />
                                <span className="text-slate-400">Tour Manager</span>
                             </div>
                             <span className="text-white font-medium">{tour.tourManager || 'Not assigned'}</span>
                        </div>
                         <div className="flex justify-between p-3 bg-slate-900 rounded-lg">
                             <div className="flex items-center gap-2">
                                <Briefcase size={14} className="text-indigo-400" />
                                <span className="text-slate-400">Booking Agent</span>
                             </div>
                             <span className="text-white font-medium">{tour.bookingAgent || 'Not assigned'}</span>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'shows' && (
             <div className="space-y-0">
                 <div className="flex justify-end mb-4">
                    <button 
                        onClick={handleOpenAddShow}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg shadow-indigo-900/20"
                    >
                        <Plus size={16} /> Add Show
                    </button>
                 </div>
                 {tour.shows.length === 0 ? (
                     <div className="text-center py-12 bg-slate-800 rounded-xl border border-slate-700 border-dashed">
                         <p className="text-slate-400">No shows added yet.</p>
                         <button onClick={handleOpenAddShow} className="text-indigo-400 font-medium hover:underline mt-2">Add your first show</button>
                     </div>
                 ) : (
                    <div className="relative">
                        {/* Vertical Timeline Line */}
                        <div className="absolute left-7 top-6 bottom-6 w-0.5 bg-slate-800 -z-10"></div>
                        
                        {sortedShows.map((show, index) => {
                            const profit = calculateShowProfit(show);
                            const nextShow = sortedShows[index + 1];
                            const travelMetrics = nextShow ? calculateRouteMetrics(show.city, nextShow.city) : null;
                            const hasConflict = travelMetrics?.isLongDrive || travelMetrics?.isImpossible;

                            return (
                                <div key={show.id} className="relative mb-0">
                                    <div className="group bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center justify-between hover:border-slate-500 transition-all z-10 relative">
                                        <div className="flex items-center gap-6 flex-1">
                                            {/* Date Circle (Link) */}
                                            <Link to={`/app/tours/${tour.id}/shows/${show.id}`} className="text-center w-14 hover:opacity-80 transition-opacity">
                                                <div className="text-xs text-slate-500 uppercase">{new Date(show.date).toLocaleString('default', { month: 'short' })}</div>
                                                <div className="text-xl font-bold text-white">{new Date(show.date).getDate()}</div>
                                            </Link>
                                            
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    {/* Editable City */}
                                                    {editingCell?.showId === show.id && editingCell.field === 'city' ? (
                                                        <input 
                                                            autoFocus
                                                            className="bg-slate-900 border border-indigo-500 rounded px-2 py-0.5 text-white text-lg font-semibold w-full max-w-[200px] outline-none"
                                                            defaultValue={show.city}
                                                            onBlur={(e) => handleInlineUpdate(show, 'city', e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                                                        />
                                                    ) : (
                                                        <h4 
                                                            onClick={() => setEditingCell({showId: show.id, field: 'city'})}
                                                            className="font-semibold text-white text-lg cursor-pointer hover:underline decoration-dashed decoration-slate-500 underline-offset-4"
                                                            title="Click to edit city"
                                                        >
                                                            {show.city}
                                                        </h4>
                                                    )}

                                                    {/* Editable Status */}
                                                    {editingCell?.showId === show.id && editingCell.field === 'status' ? (
                                                        <select
                                                            autoFocus
                                                            className="bg-slate-900 border border-indigo-500 rounded px-1 py-0.5 text-[10px] uppercase font-bold text-white outline-none"
                                                            value={show.status}
                                                            onChange={(e) => handleInlineUpdate(show, 'status', e.target.value as ShowStatus)}
                                                            onBlur={() => setEditingCell(null)}
                                                        >
                                                            {Object.values(ShowStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                                        </select>
                                                    ) : (
                                                        <span 
                                                            onClick={() => setEditingCell({showId: show.id, field: 'status'})}
                                                            className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider cursor-pointer hover:opacity-80 transition-opacity ${
                                                            show.status === ShowStatus.CONFIRMED ? 'bg-emerald-500/10 text-emerald-400' : 
                                                            show.status === ShowStatus.DRAFT ? 'bg-slate-600/50 text-slate-300' :
                                                            'bg-amber-500/10 text-amber-400'
                                                        }`}>
                                                            {show.status}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                                                    <MapPin size={12} /> 
                                                    {/* Editable Venue */}
                                                    {editingCell?.showId === show.id && editingCell.field === 'venue' ? (
                                                        <input 
                                                            autoFocus
                                                            className="bg-slate-900 border border-indigo-500 rounded px-2 py-0.5 text-slate-300 text-sm w-full max-w-[200px] outline-none"
                                                            defaultValue={show.venue}
                                                            onBlur={(e) => handleInlineUpdate(show, 'venue', e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                                                        />
                                                    ) : (
                                                        <span 
                                                            onClick={() => setEditingCell({showId: show.id, field: 'venue'})}
                                                            className="cursor-pointer hover:text-white hover:underline decoration-dashed decoration-slate-600 underline-offset-2"
                                                            title="Click to edit venue"
                                                        >
                                                            {show.venue}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8">
                                            <div className="text-right hidden md:block">
                                                <div className="text-xs text-slate-500 uppercase">Profit</div>
                                                <div className={`font-bold ${profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>${profit.toLocaleString()}</div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Link to={`/app/tours/${tour.id}/shows/${show.id}`} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors">
                                                    <ArrowRight size={18} />
                                                </Link>
                                                <button 
                                                    onClick={(e) => { e.preventDefault(); deleteShow(tour.id, show.id); addToast("Show deleted", 'info'); }} 
                                                    className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-rose-400 transition-colors"
                                                >
                                                    <Trash2 size={18}/>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Travel Segment */}
                                    {travelMetrics && (
                                        <div className="pl-14 py-3 flex items-center gap-4">
                                            <div className={`flex items-center gap-3 px-3 py-1.5 rounded-full text-xs font-medium border ${
                                                hasConflict 
                                                ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' 
                                                : 'bg-slate-900 text-slate-400 border-slate-700'
                                            }`}>
                                                <Truck size={12} />
                                                <span>{travelMetrics.distanceMiles} mi</span>
                                                <span className="text-slate-600">|</span>
                                                <Clock size={12} />
                                                <span>{travelMetrics.driveTimeHours}h</span>
                                                <span className="text-slate-600">|</span>
                                                <Fuel size={12} />
                                                <span>Est. ${travelMetrics.estimatedGasCost}</span>
                                            </div>
                                            
                                            {hasConflict && (
                                                 <div className="flex items-center gap-1 text-xs text-rose-400 font-bold animate-pulse">
                                                    <AlertTriangle size={12} />
                                                    {travelMetrics.isImpossible ? 'IMPOSSIBLE DRIVE' : 'LONG DRIVE'}
                                                 </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                 )}
             </div>
        )}

        {activeTab === 'budget' && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center text-slate-400">
                <DollarSign className="mx-auto mb-4 opacity-50" size={48} />
                <h3 className="text-lg font-medium text-white mb-2">Budget vs Actuals</h3>
                <p>Detailed tour-wide budget tracking is available in the Pro plan.</p>
                {user?.tier === 'Free' && (
                     <Link to="/app/settings" className="inline-block mt-4 text-indigo-400 hover:underline">Upgrade to Access</Link>
                )}
            </div>
        )}
        
        {activeTab === 'notes' && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center text-slate-400">
                <FileText className="mx-auto mb-4 opacity-50" size={48} />
                <h3 className="text-lg font-medium text-white mb-2">Tour Documents</h3>
                <p>Upload contracts, riders, and day sheets here.</p>
            </div>
        )}
      </div>

      {/* Add Show Modal */}
      {isAddShowModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
              <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md p-6 shadow-2xl animate-fade-in">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-white">Add New Show</h3>
                      <button onClick={() => setIsAddShowModalOpen(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
                  </div>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-400 mb-1">Date</label>
                          <input 
                              type="date" 
                              className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white outline-none focus:border-indigo-500"
                              value={newShowData.date}
                              onChange={e => setNewShowData({...newShowData, date: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-400 mb-1">City</label>
                          <input 
                              type="text" 
                              placeholder="e.g. Austin, TX"
                              className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white outline-none focus:border-indigo-500"
                              value={newShowData.city}
                              onChange={e => setNewShowData({...newShowData, city: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-400 mb-1">Venue</label>
                          <div className="relative">
                            <Building2 size={16} className="absolute left-3 top-3 text-slate-500 z-10" />
                            <input 
                                type="text" 
                                placeholder="Search or enter venue..."
                                className="w-full bg-slate-900 border border-slate-600 rounded p-2 pl-10 text-white outline-none focus:border-indigo-500"
                                value={newShowData.venue}
                                onChange={e => {
                                    setNewShowData({...newShowData, venue: e.target.value});
                                    setIsVenueDropdownOpen(true);
                                }}
                                onFocus={() => setIsVenueDropdownOpen(true)}
                                onBlur={() => setTimeout(() => setIsVenueDropdownOpen(false), 200)}
                            />
                            {isVenueDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 max-h-60 overflow-y-auto">
                                    {filteredVenues.length > 0 && (
                                        <div className="py-1">
                                            {filteredVenues.map(v => (
                                                <button 
                                                    key={v.id} 
                                                    className="w-full text-left px-3 py-2 hover:bg-slate-700 flex items-center justify-between group"
                                                    onClick={() => handleVenueSelect(v)}
                                                >
                                                    <div>
                                                        <div className="text-white font-medium text-sm">{v.name}</div>
                                                        <div className="text-xs text-slate-500">{v.city}</div>
                                                    </div>
                                                    {newShowData.venue === v.name && <Check size={14} className="text-emerald-400" />}
                                                </button>
                                            ))}
                                            <div className="border-t border-slate-700 my-1"></div>
                                        </div>
                                    )}
                                    <button 
                                        className="w-full text-left px-3 py-2 text-indigo-400 hover:bg-slate-700 hover:text-indigo-300 flex items-center gap-2 text-sm"
                                        onClick={() => {
                                            setNewVenueData({ name: newShowData.venue, city: newShowData.city, capacity: 0 });
                                            setIsCreateVenueOpen(true);
                                            setIsVenueDropdownOpen(false);
                                        }}
                                    >
                                        <Plus size={14} /> Create "{newShowData.venue || 'New Venue'}"...
                                    </button>
                                </div>
                            )}
                        </div>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-400 mb-1">Deal Type</label>
                          <select 
                              className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white outline-none focus:border-indigo-500"
                              value={newShowData.dealType}
                              onChange={e => setNewShowData({...newShowData, dealType: e.target.value as DealType})}
                          >
                              {Object.values(DealType).map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                      </div>
                      <div className="flex gap-3 pt-4">
                          <button 
                              onClick={() => setIsAddShowModalOpen(false)}
                              className="flex-1 py-2 rounded text-slate-300 hover:bg-slate-700 transition-colors"
                          >
                              Cancel
                          </button>
                          <button 
                              onClick={handleCreateShow}
                              disabled={!newShowData.city}
                              className="flex-1 bg-indigo-600 text-white py-2 rounded font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                          >
                              Create Draft
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Edit Tour Modal */}
      {isEditTourModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
              <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md p-6 shadow-2xl animate-fade-in">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-white">Edit Tour Details</h3>
                      <button onClick={() => setIsEditTourModalOpen(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
                  </div>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-400 mb-1">Tour Name</label>
                          <input 
                              type="text" 
                              className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white outline-none focus:border-indigo-500"
                              value={editTourData.name}
                              onChange={e => setEditTourData({...editTourData, name: e.target.value})}
                          />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-medium text-slate-400 mb-1">Start Date</label>
                              <div className="relative">
                                  <input 
                                      type="date" 
                                      className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white outline-none focus:border-indigo-500 [color-scheme:dark]"
                                      value={editTourData.startDate}
                                      onChange={e => setEditTourData({...editTourData, startDate: e.target.value})}
                                  />
                                  <Calendar size={14} className="absolute right-3 top-3 text-slate-500 pointer-events-none" />
                              </div>
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-slate-400 mb-1">End Date</label>
                              <div className="relative">
                                  <input 
                                      type="date" 
                                      className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white outline-none focus:border-indigo-500 [color-scheme:dark]"
                                      value={editTourData.endDate}
                                      onChange={e => setEditTourData({...editTourData, endDate: e.target.value})}
                                  />
                                  <Calendar size={14} className="absolute right-3 top-3 text-slate-500 pointer-events-none" />
                              </div>
                          </div>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-400 mb-1">Tour Manager</label>
                          <div className="relative">
                              <input 
                                  type="text" 
                                  placeholder="e.g. John Smith"
                                  className="w-full bg-slate-900 border border-slate-600 rounded p-2 pl-9 text-white outline-none focus:border-indigo-500"
                                  value={editTourData.tourManager}
                                  onChange={e => setEditTourData({...editTourData, tourManager: e.target.value})}
                              />
                              <User size={16} className="absolute left-3 top-2.5 text-slate-500" />
                          </div>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-400 mb-1">Booking Agent</label>
                           <div className="relative">
                              <input 
                                  type="text" 
                                  placeholder="e.g. Jane Doe"
                                  className="w-full bg-slate-900 border border-slate-600 rounded p-2 pl-9 text-white outline-none focus:border-indigo-500"
                                  value={editTourData.bookingAgent}
                                  onChange={e => setEditTourData({...editTourData, bookingAgent: e.target.value})}
                              />
                              <Briefcase size={16} className="absolute left-3 top-2.5 text-slate-500" />
                          </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                          <button 
                              onClick={() => setIsEditTourModalOpen(false)}
                              className="flex-1 py-2 rounded text-slate-300 hover:bg-slate-700 transition-colors"
                          >
                              Cancel
                          </button>
                          <button 
                              onClick={handleSaveTour}
                              disabled={!editTourData.name}
                              className="flex-1 bg-indigo-600 text-white py-2 rounded font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                          >
                              Save Changes
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Quick Add Venue Modal */}
      {isCreateVenueOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-sm p-6 shadow-2xl animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">Add New Venue</h3>
                    <button onClick={() => setIsCreateVenueOpen(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs text-slate-400 uppercase mb-1">Venue Name</label>
                        <input 
                            type="text" 
                            autoFocus
                            className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white outline-none focus:border-indigo-500"
                            value={newVenueData.name}
                            onChange={e => setNewVenueData({...newVenueData, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-400 uppercase mb-1">City</label>
                        <input 
                            type="text" 
                            className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white outline-none focus:border-indigo-500"
                            value={newVenueData.city}
                            onChange={e => setNewVenueData({...newVenueData, city: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-400 uppercase mb-1">Capacity</label>
                        <input 
                            type="number" 
                            className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white outline-none focus:border-indigo-500"
                            value={newVenueData.capacity || ''}
                            onChange={e => setNewVenueData({...newVenueData, capacity: parseInt(e.target.value)})}
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button 
                            onClick={() => setIsCreateVenueOpen(false)}
                            className="flex-1 py-2 rounded text-slate-300 hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleCreateVenue}
                            disabled={!newVenueData.name}
                            className="flex-1 bg-indigo-600 text-white py-2 rounded font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                            Create Venue
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default TourDetail;