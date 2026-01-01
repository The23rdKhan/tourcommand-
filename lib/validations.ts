import { z } from 'zod';

// User Profile Schema
export const UserProfileSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  role: z.enum(['Artist', 'Manager', 'Operator']),
  tier: z.enum(['Free', 'Pro', 'Agency']).default('Free')
});

// Tour Schema
export const TourSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(200),
  artist: z.string().min(1).max(200),
  startDate: z.string().date(),
  endDate: z.string().date(),
  region: z.string().min(1),
  tourManager: z.string().optional(),
  bookingAgent: z.string().optional(),
  currency: z.string().default('USD')
});

// Show Financials Schema
export const ShowFinancialsSchema = z.object({
  guarantee: z.number().min(0),
  ticketPrice: z.number().min(0),
  soldCount: z.number().min(0),
  capacity: z.number().min(0),
  expenses: z.object({
    venue: z.number().min(0),
    production: z.number().min(0),
    travel: z.number().min(0),
    hotels: z.number().min(0),
    marketing: z.number().min(0),
    misc: z.number().min(0)
  }),
  merchSales: z.number().min(0)
});

// Show Logistics Schema
export const ShowLogisticsSchema = z.object({
  callTime: z.string().optional(),
  loadInTime: z.string().optional(),
  setTime: z.string().optional()
});

// Travel Item Schema
export const TravelItemSchema = z.object({
  id: z.string(),
  type: z.enum(['Flight', 'Hotel', 'Train', 'Bus', 'Car Rental', 'Other']),
  provider: z.string().min(1),
  bookingReference: z.string().optional(),
  cost: z.number().min(0),
  date: z.string().date(),
  time: z.string().optional(),
  notes: z.string().optional()
});

// Show Schema
export const ShowSchema = z.object({
  id: z.string().optional(),
  tourId: z.string(),
  date: z.string().date(),
  city: z.string().min(1),
  venue: z.string().min(1),
  venueId: z.string().optional(),
  status: z.enum(['Confirmed', 'Challenged', 'Hold', 'Canceled', 'Draft']),
  dealType: z.enum(['Guarantee', 'Door Split', 'Guarantee + %', 'Flat Fee']),
  financials: ShowFinancialsSchema,
  logistics: ShowLogisticsSchema.optional(),
  travel: z.array(TravelItemSchema).optional(),
  notes: z.string().optional()
});

// Venue Schema
export const VenueSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(200),
  city: z.string().min(1),
  capacity: z.number().int().min(0),
  contactName: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal('')),
  notes: z.string().optional()
});

// Vendor Schema
export const VendorSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(200),
  role: z.string().min(1),
  city: z.string().optional(),
  pocName: z.string().optional(),
  pocEmail: z.string().email().optional().or(z.literal('')),
  pocPhone: z.string().optional(),
  requiresPermits: z.boolean().default(false),
  notes: z.string().optional()
});

// Analytics Event Schema
export const AnalyticsEventSchema = z.object({
  eventName: z.string().min(1),
  properties: z.record(z.any()).optional()
});

// API Request/Response types
export type CreateTourRequest = z.infer<typeof TourSchema>;
export type UpdateTourRequest = Partial<CreateTourRequest>;
export type CreateShowRequest = z.infer<typeof ShowSchema>;
export type UpdateShowRequest = Partial<CreateShowRequest>;
export type CreateVenueRequest = z.infer<typeof VenueSchema>;
export type UpdateVenueRequest = Partial<CreateVenueRequest>;
export type CreateVendorRequest = z.infer<typeof VendorSchema>;
export type UpdateVendorRequest = Partial<CreateVendorRequest>;

