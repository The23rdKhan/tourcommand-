import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTour } from '../context/TourContext';
import { ShowStatus, DealType, Show, ShowLogistics, TravelItem, TravelType, Venue } from '../types';
import Breadcrumbs from './Breadcrumbs';
import { trackEvent } from '../utils/analytics';
import { Save, Calendar, MapPin, DollarSign, Truck, Shirt, AlertCircle, Clock, Plane, Plus, Trash2, Hotel, Bus, Car, Train, Building2, Check, X, FileText, List } from 'lucide-react';

const ShowDetail: React.FC = () => {
  const { tourId, showId } = useParams();
  const navigate = useNavigate();
  const { tours, venues, updateShow, deleteShow, addVenue } = useTour();
  
  const tour = tours.find(t => t.id === tourId);
  const show = tour?.shows.find(s => s.id === showId);

  const [formData, setFormData] = useState<Show | null>(null);
  const [activeSection, setActiveSection] = useState<'details' | 'financials' | 'merch' | 'logistics' | 'travel' | 'notes'>('details');
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Venue Selector State
  const [isVenueSearchOpen, setIsVenueSearchOpen] = useState(false);
  const [isCreateVenueOpen, setIsCreateVenueOpen] = useState(false);
  const [newVenueData, setNewVenueData] = useState({ name: '', city: '', capacity: 0 });

  // Travel Form State
  const [isAddingTravel, setIsAddingTravel] = useState(false);
  const [newTravel, setNewTravel] = useState<Partial<TravelItem>>({ type: 'Hotel' });

  useEffect(() => {
    if (show) {
      setFormData(JSON.parse(JSON.stringify(show)));
      trackEvent('show_viewed', { showId: show.id, tourId: tour?.id });
    }
  }, [show, tour]);

  if (!tour || !show || !formData) return <div className="p-8">Show not found</div>;

  const handleSave = async () => {
    if (formData && tourId) {
      try {
        await updateShow(tourId, formData);
        trackEvent('show_updated', { showId: formData.id });
      } catch (error) {
        console.error('Error updating show:', error);
      }
    }
  };

  const updateField = (field: keyof Show, value: any) => {
    setFormData(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

  const updateFinancials = (field: keyof typeof formData.financials, value: any) => {
    setFormData(prev => prev ? ({
      ...prev,
      financials: { ...prev.financials, [field]: value }
    }) : null);
  };

  const updateExpense = (field: keyof Show['financials']['expenses'], value: number) => {
    setFormData(prev => prev ? ({
      ...prev,
      financials: {
        ...prev.financials,
        expenses: { ...prev.financials.expenses, [field]: value }
      }
    }) : null);
  };

  const updateLogistics = (field: keyof ShowLogistics, value: string) => {
    setFormData(prev => {
        if (!prev) return null;
        const currentLogistics = prev.logistics || { callTime: '', loadInTime: '', setTime: '' };
        return {
            ...prev,
            logistics: { ...currentLogistics, [field]: value }
        };
    });
  };

  // --- Venue Handlers ---

  const handleVenueSelect = (venue: Venue) => {
      if (!formData) return;
      
      // Update venue name and link ID
      updateField('venue', venue.name);
      updateField('venueId', venue.id);
      
      // Auto-fill capacity if the venue has it
      if (venue.capacity > 0) {
          updateFinancials('capacity', venue.capacity);
      }
      
      setIsVenueSearchOpen(false);
  };

  const handleCreateVenue = () => {
      if (!newVenueData.name) return;
      
      const newId = `v-${Date.now()}`;
      const venue: Venue = {
          id: newId,
          name: newVenueData.name,
          city: newVenueData.city || formData.city, // Default to show city
          capacity: newVenueData.capacity,
          contactName: '',
          contactEmail: '',
          notes: ''
      };

      addVenue(venue);
      handleVenueSelect(venue); // Select it immediately
      setIsCreateVenueOpen(false);
      setNewVenueData({ name: '', city: '', capacity: 0 });
      trackEvent('venue_quick_created', { city: venue.city });
  };

  const filteredVenues = venues.filter(v => 
      v.name.toLowerCase().includes((formData.venue || '').toLowerCase()) ||
      v.city.toLowerCase().includes((formData.city || '').toLowerCase())
  );

  // --- Travel Handlers ---

  const addTravelItem = () => {
      if (newTravel.provider && newTravel.cost !== undefined && !isNaN(Number(newTravel.cost))) {
          const item: TravelItem = {
              id: `tr-${Date.now()}`,
              type: newTravel.type as TravelType,
              provider: newTravel.provider,
              bookingReference: newTravel.bookingReference || '',
              cost: Number(newTravel.cost),
              date: newTravel.date || formData.date,
              time: newTravel.time,
              notes: newTravel.notes
          };
          
          setFormData(prev => prev ? ({
              ...prev,
              travel: [...(prev.travel || []), item]
          }) : null);
          
          setNewTravel({ type: 'Hotel', date: formData.date });
          setIsAddingTravel(false);
          trackEvent('travel_added', { type: item.type });
      }
  };

  const removeTravelItem = (id: string) => {
      setFormData(prev => prev ? ({
          ...prev,
          travel: prev.travel?.filter(t => t.id !== id) || []
      }) : null);
  };

  const syncTravelExpenses = () => {
      if (!formData.travel) return;
      
      const hotelCost = formData.travel.filter(t => t.type === 'Hotel').reduce((sum, t) => sum + t.cost, 0);
      const transportCost = formData.travel.filter(t => t.type !== 'Hotel').reduce((sum, t) => sum + t.cost, 0);

      setFormData(prev => prev ? ({
          ...prev,
          financials: {
              ...prev.financials,
              expenses: {
                  ...prev.financials.expenses,
                  hotels: hotelCost,
                  travel: transportCost
              }
          }
      }) : null);
  };

  // Calculations
  const totalExpenses = (Object.values(formData.financials.expenses) as number[]).reduce((a, b) => a + b, 0);
  const ticketRevenue = formData.financials.soldCount * formData.financials.ticketPrice;
  const totalRevenue = formData.financials.guarantee + ticketRevenue + formData.financials.merchSales;
  const netProfit = totalRevenue - totalExpenses;

  // Travel Totals
  const totalTravelItemsCost = (formData.travel || []).reduce((acc, item) => acc + item.cost, 0);
  const calculatedHotelCost = (formData.travel || []).filter(t => t.type === 'Hotel').reduce((acc, t) => acc + t.cost, 0);
  const calculatedTransportCost = (formData.travel || []).filter(t => t.type !== 'Hotel').reduce((acc, t) => acc + t.cost, 0);

  const getTravelIcon = (type: TravelType) => {
      switch(type) {
          case 'Flight': return <Plane size={18} />;
          case 'Hotel': return <Hotel size={18} />;
          case 'Bus': return <Bus size={18} />;
          case 'Train': return <Train size={18} />;
          case 'Car Rental': return <Car size={18} />;
          default: return <Plane size={18} />;
      }
  };

  return (
    <div className="space-y-6 pb-20">
      <Breadcrumbs items={[
        { label: 'Tours', to: '/app/tours' },
        { label: tour.name, to: `/app/tours/${tour.id}` },
        { label: `${formData.city} (${new Date(formData.date).toLocaleDateString()})` }
      ]} />

      <div className="flex justify-between items-start">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">{formData.city}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  formData.status === ShowStatus.CONFIRMED ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' :
                  formData.status === ShowStatus.HOLD ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' :
                  'border-slate-600 bg-slate-800 text-slate-400'
              }`}>
                  {formData.status}
              </span>
           </div>
           <p className="text-slate-400 text-lg flex items-center gap-2">
              <MapPin size={16} /> 
              {formData.venue ? (
                <Link 
                  to={`/app/venues/${formData.venueId || encodeURIComponent(formData.venue)}`} 
                  className="hover:text-white hover:underline transition-colors"
                >
                  {formData.venue}
                </Link>
              ) : (
                <span className="text-slate-500">No Venue Set</span>
              )}
              <span className="mx-2">•</span> 
              <Calendar size={16} /> {new Date(formData.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
           </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-indigo-900/20"
          >
            <Save size={18} /> Save Changes
          </button>
          <button
            onClick={async () => {
              if (window.confirm('Are you sure you want to delete this show?')) {
                if (tourId && showId) {
                  await deleteShow(tourId, showId);
                  navigate(`/app/tours/${tourId}`);
                }
              }
            }}
            className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-rose-900/20"
          >
            <Trash2 size={18} /> Delete Show
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-700 space-x-6 overflow-x-auto">
        {[
            { id: 'details', label: 'Details & Deal', icon: MapPin },
            { id: 'financials', label: 'Financials', icon: DollarSign },
            { id: 'travel', label: 'Travel & Hotels', icon: Plane },
            { id: 'merch', label: 'Merchandise', icon: Shirt },
            { id: 'logistics', label: 'Logistics', icon: Truck },
            { id: 'notes', label: 'Notes', icon: FileText },
        ].map(tab => (
            <button 
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`pb-3 text-sm font-medium capitalize transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
                    activeSection === tab.id 
                    ? 'border-indigo-500 text-indigo-400' 
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
            >
                <tab.icon size={16} /> {tab.label}
            </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
            
            {activeSection === 'details' && (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-6 animate-fade-in relative">
                    <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">Show Info</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-slate-400 uppercase mb-1">Date</label>
                            <div className="relative group">
                                <input 
                                    ref={dateInputRef}
                                    type="date" 
                                    value={formData.date} 
                                    onChange={e => updateField('date', e.target.value)} 
                                    className="w-full bg-slate-900 border border-slate-600 rounded p-2 pl-10 text-white [color-scheme:dark] cursor-pointer focus:border-indigo-500 outline-none transition-colors" 
                                />
                                <Calendar 
                                    size={18} 
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-white transition-colors cursor-pointer"
                                    onClick={() => dateInputRef.current?.showPicker()}
                                />
                            </div>
                        </div>
                        <div>
                             <label className="block text-xs text-slate-400 uppercase mb-1">City</label>
                             <input type="text" value={formData.city} onChange={e => updateField('city', e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" />
                        </div>
                        <div className="col-span-2 relative">
                             <label className="block text-xs text-slate-400 uppercase mb-1">Venue</label>
                             <div className="flex gap-2 relative">
                                <div className="relative flex-1">
                                    <Building2 size={16} className="absolute left-3 top-3 text-slate-500" />
                                    <input 
                                        type="text" 
                                        value={formData.venue} 
                                        onChange={e => {
                                            updateField('venue', e.target.value);
                                            updateField('venueId', undefined); // Clear ID if typing manual name
                                            setIsVenueSearchOpen(true);
                                        }}
                                        onFocus={() => setIsVenueSearchOpen(true)}
                                        onBlur={() => setTimeout(() => setIsVenueSearchOpen(false), 200)}
                                        placeholder="Search venues..."
                                        className="w-full bg-slate-900 border border-slate-600 rounded p-2 pl-10 text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none" 
                                    />
                                    {/* Venue Dropdown */}
                                    {isVenueSearchOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 max-h-60 overflow-y-auto">
                                            {filteredVenues.length > 0 && (
                                                <div className="py-1">
                                                    <div className="px-3 py-1 text-xs text-slate-500 uppercase font-bold tracking-wider">Select Venue</div>
                                                    {filteredVenues.map(v => (
                                                        <button 
                                                            key={v.id} 
                                                            className="w-full text-left px-3 py-2 hover:bg-slate-700 flex items-center justify-between group"
                                                            onClick={() => handleVenueSelect(v)}
                                                        >
                                                            <div>
                                                                <div className="text-white font-medium">{v.name}</div>
                                                                <div className="text-xs text-slate-500">{v.city} • {v.capacity} cap</div>
                                                            </div>
                                                            {formData.venueId === v.id && <Check size={14} className="text-emerald-400" />}
                                                        </button>
                                                    ))}
                                                    <div className="border-t border-slate-700 my-1"></div>
                                                </div>
                                            )}
                                            <button 
                                                className="w-full text-left px-3 py-2 text-indigo-400 hover:bg-slate-700 hover:text-indigo-300 flex items-center gap-2"
                                                onClick={() => {
                                                    setNewVenueData({ name: formData.venue, city: formData.city, capacity: 0 });
                                                    setIsCreateVenueOpen(true);
                                                    setIsVenueSearchOpen(false);
                                                }}
                                            >
                                                <Plus size={14} /> Create "{formData.venue || 'New Venue'}"...
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {formData.venueId && (
                                    <Link to={`/app/venues/${formData.venueId}`} className="px-3 py-2 bg-slate-700 text-slate-300 rounded hover:text-white hover:bg-slate-600 whitespace-nowrap">
                                        View Details
                                    </Link>
                                )}
                             </div>
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2 pt-4">Deal Structure</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-slate-400 uppercase mb-1">Status</label>
                            <select value={formData.status} onChange={e => updateField('status', e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white">
                                {Object.values(ShowStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                             <label className="block text-xs text-slate-400 uppercase mb-1">Deal Type</label>
                             <select value={formData.dealType} onChange={e => updateField('dealType', e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white">
                                {Object.values(DealType).map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-xs text-slate-400 uppercase mb-1">Guarantee ($)</label>
                            <input type="number" value={formData.financials.guarantee} onChange={e => updateFinancials('guarantee', parseFloat(e.target.value) || 0)} className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" />
                        </div>
                    </div>
                </div>
            )}

            {activeSection === 'financials' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2 mb-4">Revenue Forecast</h3>
                        <div className="grid grid-cols-3 gap-4">
                             <div>
                                <label className="block text-xs text-slate-400 uppercase mb-1">Capacity</label>
                                <input type="number" value={formData.financials.capacity} onChange={e => updateFinancials('capacity', parseFloat(e.target.value) || 0)} className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 uppercase mb-1">Ticket Price ($)</label>
                                <input type="number" value={formData.financials.ticketPrice} onChange={e => updateFinancials('ticketPrice', parseFloat(e.target.value) || 0)} className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 uppercase mb-1">Tickets Sold (Actual)</label>
                                <input type="number" value={formData.financials.soldCount} onChange={e => updateFinancials('soldCount', parseFloat(e.target.value) || 0)} className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" />
                            </div>
                        </div>
                        <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex justify-between items-center">
                            <span className="text-emerald-300 font-medium">Estimated Ticket Revenue</span>
                            <span className="text-xl font-bold text-emerald-400">${ticketRevenue.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2 mb-4">Expenses</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(formData.financials.expenses).map(([key, val]) => (
                                <div key={key}>
                                    <label className="block text-xs text-slate-400 uppercase mb-1 capitalize">{key}</label>
                                    <input 
                                        type="number" 
                                        value={val as number} 
                                        onChange={e => updateExpense(key as keyof Show['financials']['expenses'], parseFloat(e.target.value) || 0)} 
                                        className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" 
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg flex justify-between items-center">
                            <span className="text-rose-300 font-medium">Total Expenses</span>
                            <span className="text-xl font-bold text-rose-400">${totalExpenses.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            )}

            {activeSection === 'travel' && (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 animate-fade-in space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                             Travel & Accommodation
                        </h3>
                        <button 
                            onClick={() => setIsAddingTravel(true)}
                            className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                        >
                            <Plus size={14} /> Add Booking
                        </button>
                    </div>

                    {isAddingTravel && (
                        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 space-y-3 animate-fade-in">
                            <h4 className="text-sm font-medium text-slate-300">New Booking</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                    <label className="text-xs text-slate-500 block mb-1">Type</label>
                                    <select 
                                        className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white text-sm"
                                        value={newTravel.type}
                                        onChange={e => setNewTravel({...newTravel, type: e.target.value as TravelType})}
                                    >
                                        <option value="Flight">Flight</option>
                                        <option value="Hotel">Hotel</option>
                                        <option value="Train">Train</option>
                                        <option value="Bus">Bus</option>
                                        <option value="Car Rental">Car Rental</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 block mb-1">Date</label>
                                    <input 
                                        type="date"
                                        className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white text-sm [color-scheme:dark]"
                                        value={newTravel.date || formData.date}
                                        onChange={e => setNewTravel({...newTravel, date: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 block mb-1">Provider (e.g. Airline/Hotel)</label>
                                    <input 
                                        className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white text-sm"
                                        placeholder="e.g. Delta / Marriott"
                                        value={newTravel.provider || ''}
                                        onChange={e => setNewTravel({...newTravel, provider: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 block mb-1">Cost ($)</label>
                                    <input 
                                        type="number"
                                        className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white text-sm"
                                        value={newTravel.cost || ''}
                                        onChange={e => setNewTravel({...newTravel, cost: parseFloat(e.target.value)})}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 block mb-1">Ref #</label>
                                    <input 
                                        className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white text-sm"
                                        placeholder="Confirmation Code"
                                        value={newTravel.bookingReference || ''}
                                        onChange={e => setNewTravel({...newTravel, bookingReference: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 block mb-1">Notes</label>
                                    <input 
                                        className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white text-sm"
                                        placeholder="Optional notes"
                                        value={newTravel.notes || ''}
                                        onChange={e => setNewTravel({...newTravel, notes: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 justify-end pt-2">
                                <button onClick={() => setIsAddingTravel(false)} className="text-slate-400 text-sm hover:text-white px-3">Cancel</button>
                                <button onClick={addTravelItem} className="bg-emerald-600 text-white text-sm px-4 py-1.5 rounded hover:bg-emerald-700">Add Item</button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        {!formData.travel || formData.travel.length === 0 ? (
                            <div className="text-center py-8 text-slate-500 italic bg-slate-900/50 rounded-lg">
                                No travel bookings added yet.
                            </div>
                        ) : (
                            formData.travel.map(item => (
                                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-slate-800 group hover:border-slate-600 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${item.type === 'Hotel' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-sky-500/20 text-sky-400'}`}>
                                            {getTravelIcon(item.type)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-white">{item.provider}</div>
                                            <div className="text-xs text-slate-400">
                                                {new Date(item.date).toLocaleDateString()} • Ref: {item.bookingReference || 'N/A'} • {item.type}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="font-bold text-white">${item.cost.toLocaleString()}</div>
                                            {item.notes && <div className="text-xs text-slate-500 max-w-[150px] truncate">{item.notes}</div>}
                                        </div>
                                        <button 
                                            onClick={() => removeTravelItem(item.id)}
                                            className="text-slate-600 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {formData.travel && formData.travel.length > 0 && (
                        <div className="mt-6 bg-slate-900/50 border border-slate-700 rounded-xl p-5">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h4 className="text-slate-300 font-medium">Total Estimated Cost</h4>
                                    <div className="flex gap-3 mt-1 text-xs text-slate-500">
                                        <span>Hotels: ${calculatedHotelCost.toLocaleString()}</span>
                                        <span>•</span>
                                        <span>Transport: ${calculatedTransportCost.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-white">
                                    ${totalTravelItemsCost.toLocaleString()}
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-700/50 flex justify-end">
                                <button 
                                    onClick={syncTravelExpenses}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-md"
                                >
                                    <DollarSign size={16} /> Sync to Financials
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeSection === 'merch' && (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 animate-fade-in">
                    <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2 mb-4">Merchandise Settlement</h3>
                    <div>
                        <label className="block text-xs text-slate-400 uppercase mb-1">Total Merch Revenue ($)</label>
                        <input type="number" value={formData.financials.merchSales} onChange={e => updateFinancials('merchSales', parseFloat(e.target.value) || 0)} className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-lg font-semibold" />
                        <p className="text-xs text-slate-500 mt-2">Connecting a POS integration (Square/Shopify) will automate this field.</p>
                    </div>
                </div>
            )}

            {activeSection === 'logistics' && (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 animate-fade-in space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2 flex items-center gap-2">
                        <Clock size={20} /> Schedule & Logistics
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div>
                            <label className="block text-xs text-slate-400 uppercase mb-2">Load-in Time</label>
                            <input 
                                type="time" 
                                value={formData.logistics?.loadInTime || ''} 
                                onChange={e => updateLogistics('loadInTime', e.target.value)} 
                                className="w-full bg-slate-900 border border-slate-600 rounded p-3 text-white focus:border-indigo-500 outline-none [color-scheme:dark]" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 uppercase mb-2">Sound Check / Call</label>
                            <input 
                                type="time" 
                                value={formData.logistics?.callTime || ''} 
                                onChange={e => updateLogistics('callTime', e.target.value)} 
                                className="w-full bg-slate-900 border border-slate-600 rounded p-3 text-white focus:border-indigo-500 outline-none [color-scheme:dark]" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 uppercase mb-2">Set Time</label>
                            <input 
                                type="time" 
                                value={formData.logistics?.setTime || ''} 
                                onChange={e => updateLogistics('setTime', e.target.value)} 
                                className="w-full bg-slate-900 border border-slate-600 rounded p-3 text-white focus:border-indigo-500 outline-none [color-scheme:dark]" 
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-slate-900 rounded-lg border border-slate-700 mt-4">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <List size={16} /> Day Sheet Preview
                            </h4>
                            <span className="text-[10px] text-slate-500 uppercase">Auto-Generated</span>
                        </div>
                        <div className="text-sm text-slate-400 space-y-3 pl-2 border-l-2 border-slate-700">
                             <div className="flex items-center gap-3">
                                 <div className="w-16 text-xs font-mono text-slate-500 text-right">{formData.logistics?.loadInTime || '--:--'}</div>
                                 <div className={formData.logistics?.loadInTime ? "text-white" : "text-slate-600 italic"}>Load In</div>
                             </div>
                             <div className="flex items-center gap-3">
                                 <div className="w-16 text-xs font-mono text-slate-500 text-right">{formData.logistics?.callTime || '--:--'}</div>
                                 <div className={formData.logistics?.callTime ? "text-white" : "text-slate-600 italic"}>Sound Check</div>
                             </div>
                             <div className="flex items-center gap-3">
                                 <div className="w-16 text-xs font-mono text-slate-500 text-right">{formData.logistics?.setTime || '--:--'}</div>
                                 <div className={formData.logistics?.setTime ? "text-indigo-400 font-bold" : "text-slate-600 italic"}>Show Time</div>
                             </div>
                        </div>
                    </div>
                </div>
            )}
            
            {activeSection === 'notes' && (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 animate-fade-in">
                    <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2 mb-4">Show Notes</h3>
                    <div className="relative">
                        <textarea
                            value={formData.notes || ''}
                            onChange={e => updateField('notes', e.target.value)}
                            className="w-full h-64 bg-slate-900 border border-slate-600 rounded-lg p-4 text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none resize-none leading-relaxed"
                            placeholder="Add general notes, advancing details, specific requirements, or reminders here..."
                        />
                        <div className="absolute bottom-4 right-4 text-xs text-slate-500">
                            Markdown supported
                        </div>
                    </div>
                </div>
            )}

        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 sticky top-6">
                <h3 className="text-lg font-bold text-white mb-6">P&L Snapshot</h3>
                
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Guarantee</span>
                        <span className="text-white">${formData.financials.guarantee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Ticket Revenue</span>
                        <span className="text-white">${ticketRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Merch Sales</span>
                        <span className="text-white">${formData.financials.merchSales.toLocaleString()}</span>
                    </div>
                    <div className="h-px bg-slate-700 my-2"></div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Total Revenue</span>
                        <span className="text-emerald-400 font-bold">${totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Total Expenses</span>
                        <span className="text-rose-400 font-bold">(${totalExpenses.toLocaleString()})</span>
                    </div>
                    <div className="h-px bg-slate-700 my-2"></div>
                    <div className="flex justify-between items-center text-lg">
                        <span className="text-white font-bold">Net Profit</span>
                        <span className={`font-bold ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            ${netProfit.toLocaleString()}
                        </span>
                    </div>
                </div>

                {netProfit < 0 && (
                    <div className="mt-6 flex gap-3 items-start p-3 bg-rose-500/10 rounded-lg text-rose-200 text-sm">
                        <AlertCircle size={18} className="shrink-0 mt-0.5" />
                        <p>This show is currently projecting a loss. Review expenses or ticket pricing.</p>
                    </div>
                )}
            </div>
        </div>
      </div>

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

export default ShowDetail;