
export enum ShowStatus {
  CONFIRMED = 'Confirmed',
  CHALLENGED = 'Challenged',
  HOLD = 'Hold',
  CANCELED = 'Canceled',
  DRAFT = 'Draft'
}

export enum DealType {
  GUARANTEE = 'Guarantee',
  DOOR_SPLIT = 'Door Split',
  GUARANTEE_PLUS_PERCENTAGE = 'Guarantee + %',
  FLAT_FEE = 'Flat Fee'
}

export interface ShowFinancials {
  guarantee: number;
  ticketPrice: number;
  soldCount: number;
  capacity: number;
  expenses: {
    venue: number;
    production: number; // sound/lights
    travel: number;
    hotels: number;
    marketing: number;
    misc: number;
  };
  merchSales: number;
}

export interface ShowLogistics {
  callTime: string;
  loadInTime: string;
  setTime: string;
}

export type TravelType = 'Flight' | 'Hotel' | 'Train' | 'Bus' | 'Car Rental' | 'Other';

export interface TravelItem {
  id: string;
  type: TravelType;
  provider: string; // e.g. Delta, Marriott
  bookingReference: string;
  cost: number;
  date: string;
  time?: string;
  notes?: string;
}

export interface Show {
  id: string;
  tourId: string;
  date: string;
  city: string;
  venue: string;
  venueId?: string;
  status: ShowStatus;
  dealType: DealType;
  financials: ShowFinancials;
  logistics?: ShowLogistics;
  travel?: TravelItem[];
  notes?: string;
}

export interface Tour {
  id: string;
  name: string;
  artist: string;
  startDate: string;
  endDate: string;
  region: string;
  shows: Show[];
  tourManager?: string;
  bookingAgent?: string;
  currency?: string;
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  capacity: number;
  contactName?: string;
  contactEmail?: string;
  notes?: string;
}

export type VendorRole = 'Security' | 'Sound/Audio' | 'Pyrotechnics' | 'Runner' | 'Makeup/Stylist' | 'Catering' | 'Other';

export interface Vendor {
  id: string;
  name: string;
  role: VendorRole;
  city?: string;
  pocName?: string;
  pocEmail?: string;
  pocPhone?: string;
  requiresPermits: boolean;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type SubscriptionTier = 'Free' | 'Pro' | 'Agency';

export interface UserProfile {
  name: string;
  email: string;
  role: 'Artist' | 'Manager' | 'Operator';
  tier: SubscriptionTier;
}
