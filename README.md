# TourCommand

Professional tour management platform for artists, managers, and operators.

## Features

- 🎵 **Tour Management**: Create and manage tours with shows, venues, and vendors
- 💰 **Financial Tracking**: Track guarantees, expenses, and profits per show
- 🤖 **AI Assistant**: Get help with tour planning via Google Gemini AI
- 📊 **Analytics**: Export data to CSV, generate reports
- 🔐 **Secure**: Row-level security, authentication, and data isolation
- 📱 **Responsive**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Vercel Serverless Functions
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: Google Gemini API
- **Deployment**: Vercel

## Quick Start

### Prerequisites

- Node.js 18+
- Supabase account (free tier)
- Vercel account (free tier)
- Google Gemini API key (optional, for AI features)

### Local Development

1. **Clone and install:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Then fill in your values in `.env.local`:
   - `VITE_SUPABASE_URL` - From Supabase dashboard
   - `VITE_SUPABASE_ANON_KEY` - From Supabase dashboard
   - `GEMINI_API_KEY` - From Google AI Studio (optional)

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Visit `http://localhost:3000`

### Production Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete deployment instructions.

**Quick steps:**
1. Set up Supabase project and run migrations
2. Deploy to Vercel
3. Configure environment variables
4. Test production deployment

## Project Structure

```
tourcommand/
├── api/                 # Vercel serverless functions
│   ├── tours/          # Tour CRUD endpoints
│   ├── shows/          # Show CRUD endpoints
│   ├── venues/         # Venue CRUD endpoints
│   ├── vendors/        # Vendor CRUD endpoints
│   ├── gemini/         # AI assistant endpoints
│   └── exports/        # CSV/PDF export endpoints
├── components/         # React components
├── context/            # React context (state management)
├── lib/                # Utilities and helpers
├── supabase/
│   └── migrations/     # Database migration files
└── types.ts            # TypeScript type definitions
```

## Environment Variables

Required environment variables (see `.env.example`):

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_URL` - Same as VITE_SUPABASE_URL (for serverless)
- `SUPABASE_SERVICE_KEY` - Supabase service role key (server-side only)
- `GEMINI_API_KEY` - Google Gemini API key (optional)
- `NEXT_PUBLIC_APP_URL` - Production app URL (for shareable links)

## Database Schema

The application uses Supabase (PostgreSQL) with the following main tables:

- `user_profiles` - User account information
- `tours` - Tour data
- `shows` - Individual show/concert data
- `venues` - Venue information
- `vendors` - Vendor/crew information
- `subscriptions` - Subscription tier management
- `shared_tour_links` - Pro feature for shareable links
- `analytics_events` - User analytics

See `supabase/migrations/` for complete schema.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:build` - Run tests with coverage

### Code Structure

- **Components**: React components in `components/`
- **API Routes**: Serverless functions in `api/`
- **State Management**: React Context in `context/TourContext.tsx`
- **Type Safety**: TypeScript types in `types.ts`
- **Validation**: Zod schemas in `lib/validations.ts`

## Documentation

- [Application Flows](./APPLICATION_FLOWS.md) - Detailed flow documentation
- [Production Readiness](./PRODUCTION_READINESS.md) - Launch checklist
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Step-by-step deployment
- [Code Review Summary](./CODE_REVIEW_SUMMARY.md) - Type safety review

## License

Private project - All rights reserved
