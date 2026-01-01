import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Tour, Show, Venue, UserProfile, SubscriptionTier, Vendor, ShowStatus, DealType, VendorRole } from '../types';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/Toast';
import type { Session } from '@supabase/supabase-js';

interface TourContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (profile: Partial<UserProfile>) => Promise<void>;
  upgradeTier: (tier: SubscriptionTier) => Promise<void>;
  tours: Tour[];
  venues: Venue[];
  vendors: Vendor[];
  activeTourId: string | null;
  setActiveTourId: (id: string | null) => void;
  addTour: (tour: Omit<Tour, 'id'>) => Promise<Tour>;
  updateTour: (tour: Tour) => Promise<void>;
  addShow: (tourId: string, show: Omit<Show, 'id'>) => Promise<Show>;
  updateShow: (tourId: string, show: Show) => Promise<void>;
  deleteShow: (tourId: string, showId: string) => Promise<void>;
  addVenue: (venue: Omit<Venue, 'id'>) => Promise<Venue>;
  updateVenue: (venue: Venue) => Promise<void>;
  addVendor: (vendor: Omit<Vendor, 'id'>) => Promise<Vendor>;
  deleteVendor: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

// Helper to transform database rows to app types
function transformTour(row: any): Tour {
  return {
    id: row.id,
    name: row.name,
    artist: row.artist,
    startDate: row.start_date,
    endDate: row.end_date,
    region: row.region,
    tourManager: row.tour_manager,
    bookingAgent: row.booking_agent,
    currency: row.currency,
    shows: [] // Will be loaded separately
  };
}

function transformShow(row: any): Show {
  return {
    id: row.id,
    tourId: row.tour_id,
    date: row.date,
    city: row.city,
    venue: row.venue,
    venueId: row.venue_id || undefined,
    status: row.status as ShowStatus,
    dealType: row.deal_type as DealType,
    financials: row.financials,
    logistics: row.logistics || undefined,
    travel: row.travel || undefined,
    notes: row.notes || undefined
  };
}

function transformVenue(row: any): Venue {
  return {
    id: row.id,
    name: row.name,
    city: row.city,
    capacity: row.capacity || 0,
    contactName: row.contact_name || undefined,
    contactEmail: row.contact_email || undefined,
    notes: row.notes || undefined
  };
}

function transformVendor(row: any): Vendor {
  return {
    id: row.id,
    name: row.name,
    role: row.role as VendorRole,
    city: row.city || undefined,
    pocName: row.poc_name || undefined,
    pocEmail: row.poc_email || undefined,
    pocPhone: row.poc_phone || undefined,
    requiresPermits: row.requires_permits || false,
    notes: row.notes || undefined
  };
}

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState<Tour[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [activeTourId, setActiveTourId] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAuthenticated(!!session);
      if (session) {
        loadUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setIsAuthenticated(!!session);
      
      if (session) {
        await loadUserProfile(session.user.id);
        await refreshData();
      } else {
        setUser(null);
        setTours([]);
        setVenues([]);
        setVendors([]);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load user profile
  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setUser({
          name: data.name,
          email: data.email,
          role: data.role,
          tier: data.tier
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading user profile:', error);
      setLoading(false);
    }
  };

  // Load all data from Supabase
  const refreshData = useCallback(async () => {
    if (!session?.user) return;

    try {
      // Load tours
      const { data: toursData, error: toursError } = await supabase
        .from('tours')
        .select('*')
        .order('created_at', { ascending: false });

      if (toursError) throw toursError;

      // Load shows for each tour
      const toursWithShows = await Promise.all(
        (toursData || []).map(async (tour) => {
          const { data: showsData } = await supabase
            .from('shows')
            .select('*')
            .eq('tour_id', tour.id)
            .order('date', { ascending: true });

          return {
            ...transformTour(tour),
            shows: (showsData || []).map(transformShow)
          };
        })
      );

      setTours(toursWithShows);

      // Load venues
      const { data: venuesData, error: venuesError } = await supabase
        .from('venues')
        .select('*')
        .order('created_at', { ascending: false });

      if (venuesError) throw venuesError;
      setVenues((venuesData || []).map(transformVenue));

      // Load vendors
      const { data: vendorsData, error: vendorsError } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });

      if (vendorsError) throw vendorsError;
      setVendors((vendorsData || []).map(transformVendor));

    } catch (error) {
      console.error('Error loading data:', error);
      addToast('Failed to load data', 'error');
    }
  }, [session]);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated && session) {
      refreshData();
    }
  }, [isAuthenticated, session, refreshData]);

  // API helper
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch(`/api/${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API request failed');
    }

    const result = await response.json();
    return result.data;
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.user) {
      await loadUserProfile(data.user.id);
      addToast('Logged in successfully', 'success');
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setTours([]);
    setVenues([]);
    setVendors([]);
    addToast('Logged out', 'info');
  };

  const updateUser = async (profile: Partial<UserProfile>) => {
    if (!session?.user) throw new Error('Not authenticated');
    
    await apiCall('auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profile)
    });

    if (user) {
      setUser({ ...user, ...profile });
    }
    addToast('Profile updated', 'success');
  };

  const upgradeTier = async (tier: SubscriptionTier) => {
    await apiCall('auth/subscription', {
      method: 'PUT',
      body: JSON.stringify({ tier })
    });

    if (user) {
      setUser({ ...user, tier });
    }
    addToast(`Upgraded to ${tier} tier`, 'success');
  };

  const addTour = async (tour: Omit<Tour, 'id'>): Promise<Tour> => {
    const newTour = await apiCall('tours', {
      method: 'POST',
      body: JSON.stringify({
        name: tour.name,
        artist: tour.artist,
        startDate: tour.startDate,
        endDate: tour.endDate,
        region: tour.region,
        tourManager: tour.tourManager,
        bookingAgent: tour.bookingAgent,
        currency: tour.currency
      })
    });

    const transformed = transformTour(newTour);
    setTours([transformed, ...tours]);
    setActiveTourId(transformed.id);
    addToast('Tour created', 'success');
    return transformed;
  };

  const updateTour = async (tour: Tour) => {
    await apiCall(`tours/${tour.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: tour.name,
        artist: tour.artist,
        startDate: tour.startDate,
        endDate: tour.endDate,
        region: tour.region,
        tourManager: tour.tourManager,
        bookingAgent: tour.bookingAgent,
        currency: tour.currency
      })
    });

    setTours(tours.map(t => t.id === tour.id ? tour : t));
    addToast('Tour updated', 'success');
  };

  const addShow = async (tourId: string, show: Omit<Show, 'id'>): Promise<Show> => {
    const newShow = await apiCall('shows', {
      method: 'POST',
      body: JSON.stringify({
        ...show,
        tourId
      })
    });

    const transformed = transformShow(newShow);
    setTours(tours.map(t => 
      t.id === tourId 
        ? { ...t, shows: [...t.shows, transformed] }
        : t
    ));
    addToast('Show created', 'success');
    return transformed;
  };

  const updateShow = async (tourId: string, show: Show) => {
    await apiCall(`shows/${show.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        date: show.date,
        city: show.city,
        venue: show.venue,
        venueId: show.venueId,
        status: show.status,
        dealType: show.dealType,
        financials: show.financials,
        logistics: show.logistics,
        travel: show.travel,
        notes: show.notes
      })
    });

    setTours(tours.map(t => 
      t.id === tourId
        ? { ...t, shows: t.shows.map(s => s.id === show.id ? show : s) }
        : t
    ));
    addToast('Show updated', 'success');
  };

  const deleteShow = async (tourId: string, showId: string) => {
    await apiCall(`shows/${showId}`, {
      method: 'DELETE'
    });

    setTours(tours.map(t => 
      t.id === tourId
        ? { ...t, shows: t.shows.filter(s => s.id !== showId) }
        : t
    ));
    addToast('Show deleted', 'info');
  };

  const addVenue = async (venue: Omit<Venue, 'id'>): Promise<Venue> => {
    const newVenue = await apiCall('venues', {
      method: 'POST',
      body: JSON.stringify({
        name: venue.name,
        city: venue.city,
        capacity: venue.capacity,
        contactName: venue.contactName,
        contactEmail: venue.contactEmail,
        notes: venue.notes
      })
    });

    const transformed = transformVenue(newVenue);
    setVenues([transformed, ...venues]);
    addToast('Venue created', 'success');
    return transformed;
  };

  const updateVenue = async (venue: Venue) => {
    await apiCall(`venues/${venue.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: venue.name,
        city: venue.city,
        capacity: venue.capacity,
        contactName: venue.contactName,
        contactEmail: venue.contactEmail,
        notes: venue.notes
      })
    });

    setVenues(venues.map(v => v.id === venue.id ? venue : v));
    addToast('Venue updated', 'success');
  };

  const addVendor = async (vendor: Omit<Vendor, 'id'>): Promise<Vendor> => {
    const newVendor = await apiCall('vendors', {
      method: 'POST',
      body: JSON.stringify({
        name: vendor.name,
        role: vendor.role,
        city: vendor.city,
        pocName: vendor.pocName,
        pocEmail: vendor.pocEmail,
        pocPhone: vendor.pocPhone,
        requiresPermits: vendor.requiresPermits,
        notes: vendor.notes
      })
    });

    const transformed = transformVendor(newVendor);
    setVendors([transformed, ...vendors]);
    addToast('Vendor added', 'success');
    return transformed;
  };

  const deleteVendor = async (id: string) => {
    await apiCall(`vendors/${id}`, {
      method: 'DELETE'
    });

    setVendors(vendors.filter(v => v.id !== id));
    addToast('Vendor deleted', 'info');
  };

  return (
    <TourContext.Provider value={{ 
      isAuthenticated,
      user,
      session,
      loading,
      login,
      logout,
      updateUser,
      upgradeTier,
      tours, 
      venues,
      vendors,
      activeTourId, 
      setActiveTourId, 
      addTour,
      updateTour,
      addShow, 
      updateShow, 
      deleteShow,
      addVenue,
      updateVenue,
      addVendor,
      deleteVendor,
      refreshData
    }}>
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};
