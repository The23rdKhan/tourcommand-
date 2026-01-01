import { Tour, ShowStatus, DealType, Venue } from './types';

export const INITIAL_TOURS: Tour[] = [
  {
    id: 't-1',
    name: 'West Coast Run 2024',
    artist: 'Neon Horizon',
    startDate: '2024-10-01',
    endDate: '2024-10-15',
    region: 'US West',
    shows: [
      {
        id: 's-1',
        tourId: 't-1',
        date: '2024-10-01',
        city: 'Seattle, WA',
        venue: 'The Crocodile',
        venueId: 'v-1',
        status: ShowStatus.CONFIRMED,
        dealType: DealType.GUARANTEE_PLUS_PERCENTAGE,
        financials: {
          guarantee: 1500,
          ticketPrice: 25,
          soldCount: 450,
          capacity: 550,
          expenses: {
            venue: 200,
            production: 300,
            travel: 150,
            hotels: 200,
            marketing: 100,
            misc: 50
          },
          merchSales: 800
        }
      },
      {
        id: 's-2',
        tourId: 't-1',
        date: '2024-10-02',
        city: 'Portland, OR',
        venue: 'Doug Fir Lounge',
        venueId: 'v-2',
        status: ShowStatus.CONFIRMED,
        dealType: DealType.GUARANTEE,
        financials: {
          guarantee: 1200,
          ticketPrice: 22,
          soldCount: 280,
          capacity: 300,
          expenses: {
            venue: 150,
            production: 200,
            travel: 50,
            hotels: 180,
            marketing: 50,
            misc: 20
          },
          merchSales: 600
        }
      },
      {
        id: 's-3',
        tourId: 't-1',
        date: '2024-10-05',
        city: 'San Francisco, CA',
        venue: 'The Independent',
        status: ShowStatus.HOLD,
        dealType: DealType.DOOR_SPLIT,
        financials: {
          guarantee: 0,
          ticketPrice: 30,
          soldCount: 0,
          capacity: 500,
          expenses: {
            venue: 500,
            production: 400,
            travel: 200,
            hotels: 400,
            marketing: 200,
            misc: 100
          },
          merchSales: 0
        }
      }
    ]
  },
  {
    id: 't-2',
    name: 'Midwest Winter Mini',
    artist: 'Neon Horizon',
    startDate: '2024-12-05',
    endDate: '2024-12-10',
    region: 'US Midwest',
    shows: []
  }
];

export const INITIAL_VENUES: Venue[] = [
  {
    id: 'v-1',
    name: 'The Crocodile',
    city: 'Seattle, WA',
    capacity: 550,
    contactName: 'Sarah Booking',
    contactEmail: 'sarah@crocodile.com',
    notes: 'Great sound, loaded in through back alley.'
  },
  {
    id: 'v-2',
    name: 'Doug Fir Lounge',
    city: 'Portland, OR',
    capacity: 300,
    contactName: 'Mike Jones',
    contactEmail: 'mike@dougfir.com',
    notes: 'Hotel discount usually available.'
  }
];
