# TourCommand

Professional tour management platform for artists, managers, and venue operators. Built with React, TypeScript, and Supabase.

## 🎯 Overview

TourCommand is a comprehensive tour management solution that helps artists, managers, and venue operators plan, track, and manage tours, shows, venues, and vendors. Features include financial tracking, AI-powered assistance, and role-based dashboards.

## ✨ Key Features

### Core Functionality
- **🎵 Tour Management**: Create and manage multiple tours with detailed show information
- **🎤 Show Tracking**: Track individual shows with financials, logistics, and travel details
- **🏢 Venue Database**: Manage venue information and track show history
- **👥 Vendor Management**: Onboard and manage crew, vendors, and service providers
- **💰 Financial Tracking**: Track guarantees, expenses, profits, and P&L per show
- **📊 Analytics & Reports**: Export tour data to CSV, generate financial reports
- **🤖 AI Assistant**: Get help with tour planning via Google Gemini AI integration

### User Experience
- **🔐 Secure Authentication**: Email/password authentication with Supabase
- **👤 Role-Based Access**: Three user roles (Artist, Manager, Operator) with customized experiences
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **🎨 Modern UI**: Clean, intuitive interface built with Tailwind CSS
- **⚡ Real-time Updates**: Instant data synchronization across all devices

### Subscription Tiers
- **Free**: 1 tour, basic features
- **Pro**: Unlimited tours, advanced analytics, PDF exports
- **Agency**: Multi-user, team collaboration features

## 🛠 Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript 5.8** - Type safety
- **Vite 6** - Build tool and dev server
- **React Router 7** - Client-side routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Recharts** - Data visualization

### Backend
- **Vercel Serverless Functions** - API endpoints
- **Supabase** - PostgreSQL database
- **Supabase Auth** - Authentication & authorization
- **Row Level Security (RLS)** - Data isolation

### AI & Integrations
- **Google Gemini API** - AI assistant
- **Supabase Storage** - File uploads (Pro feature)

### Development Tools
- **Vitest** - Unit testing
- **Playwright** - E2E testing
- **Zod** - Schema validation
- **ESLint** - Code linting

## 🚀 Quick Start

### Running Locally (5 Minutes)

**Fastest way to get the app running:**

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.local.template .env.local
   ```
   Then edit `.env.local` with your Supabase credentials (see [ENV_SETUP.md](./ENV_SETUP.md))

3. **Start the dev server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

> **Note:** You'll need to set up Supabase first (see below). The app will run but authentication won't work without it.

---

### Complete Setup Guide

#### Prerequisites

- **Node.js 18+** (recommended: 20+)
- **npm** or **yarn**
- **Supabase account** (free tier works) - [Sign up here](https://supabase.com)
- **Vercel account** (for deployment) - [Sign up here](https://vercel.com)
- **Google Gemini API key** (optional, for AI features) - [Get it here](https://ai.google.dev)

#### Step-by-Step Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/The23rdKhan/tourcommand-.git
   cd tourcommand
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Supabase:**
   
   See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions.
   
   **Quick steps:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to SQL Editor
   - Run all SQL files from `supabase/migrations/` folder (or use `supabase/all-migrations.sql`)
   - Get your project URL and API keys from Settings → API

4. **Set up environment variables:**
   
   Create `.env.local` file:
   ```bash
   cp env.local.template .env.local
   ```
   
   Then edit `.env.local` with your values:
   ```env
   # Supabase (Required - Get from Supabase Dashboard → Settings → API)
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   
   # Serverless Functions (Required for API endpoints)
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=your_service_role_key_here
   
   # AI Assistant (Optional - Get from https://ai.google.dev)
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Production (Optional - Your Vercel deployment URL)
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```
   
   > **Important:** Never commit `.env.local` to git! It's already in `.gitignore`.

5. **Start development server:**
   ```bash
   npm run dev
   ```
   
   You should see:
   ```
   VITE v6.x.x  ready in xxx ms
   ➜  Local:   http://localhost:3000/
   ```

6. **Open in browser:**
   ```
   http://localhost:3000
   ```

7. **Test the app:**
   - Click "Sign Up" to create an account
   - Complete onboarding (select role, create tour/venue)
   - Explore the dashboard

#### Troubleshooting

**Port already in use:**
- Vite will automatically use the next available port (e.g., 3001, 3002)
- Check the terminal output for the actual URL

**Environment variables not working:**
- Make sure file is named `.env.local` (not `.env` or `.env.example`)
- Restart the dev server after changing environment variables
- Check [ENV_SETUP.md](./ENV_SETUP.md) for detailed help

**Database connection errors:**
- Verify Supabase project is active
- Check that migrations have been run
- Verify API keys are correct in `.env.local`
- See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for help

**Build errors:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Check Node.js version: `node --version` (should be 18+)

**Authentication not working:**
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Check browser console for errors (F12)
- Verify Supabase project has authentication enabled

## 📁 Project Structure

```
tourcommand/
├── api/                      # Vercel serverless functions
│   ├── tours/               # Tour CRUD endpoints
│   ├── shows/               # Show CRUD endpoints
│   ├── venues/              # Venue CRUD endpoints
│   ├── vendors/             # Vendor CRUD endpoints
│   ├── gemini/              # AI assistant endpoints
│   ├── exports/             # CSV/PDF export endpoints
│   ├── auth/                # Authentication endpoints
│   └── analytics/           # Analytics tracking
├── components/              # React components
│   ├── Auth.tsx            # Login/Signup
│   ├── Onboarding.tsx      # User onboarding flow
│   ├── Dashboard.tsx       # Role-based dashboard
│   ├── TourDetail.tsx      # Tour management
│   ├── ShowDetail.tsx      # Show details
│   ├── Venues.tsx          # Venue list
│   ├── Vendors.tsx         # Vendor management
│   ├── Settings.tsx        # User settings
│   └── Assistant.tsx       # AI assistant
├── context/                 # React Context (state management)
│   └── TourContext.tsx     # Main app state
├── lib/                     # Utilities and helpers
│   ├── supabase.ts         # Supabase client (client-side)
│   ├── supabase-server.ts  # Supabase client (server-side)
│   ├── validations.ts      # Zod schemas
│   ├── errors.ts           # Custom error classes
│   └── subscription.ts     # Subscription utilities
├── services/                # External service integrations
│   └── geminiService.ts    # Gemini AI service
├── supabase/
│   └── migrations/         # Database migrations
│       ├── 001_initial_schema.sql
│       ├── 002_add_indexes.sql
│       └── 003_add_rls_policies.sql
├── utils/                   # Utility functions
│   ├── analytics.ts        # Analytics tracking
│   └── geo.ts              # Geographic utilities
├── types.ts                 # TypeScript type definitions
├── App.tsx                  # Main app component
└── vercel.json              # Vercel configuration
```

## 🔐 Authentication & User Flow

### Sign Up Process
1. User enters **First Name**, **Last Name**, **Email**, **Password**, and **Confirm Password**
2. User accepts **Terms of Service** and **Privacy Policy**
3. Account created → Auto-logged in → Redirected to onboarding

### Onboarding Flow
1. **Step 1**: Enter name and select role (Artist/Manager/Operator)
2. **Step 2**: 
   - **Artist/Manager**: Create first tour
   - **Operator**: Create first venue
3. Redirected to tour/venue detail page

### Role-Based Features
- **Artist**: Tour routing, show profit tracking
- **Manager**: Roster management, financial oversight
- **Operator**: Venue calendar, booking management

## 🗄 Database Schema

### Main Tables
- `user_profiles` - User account information and preferences
- `tours` - Tour data (name, dates, region, currency)
- `shows` - Individual show/concert data (financials, logistics, travel)
- `venues` - Venue information and contact details
- `vendors` - Vendor/crew information and compliance tracking
- `analytics_events` - User analytics and event tracking

### Security
- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Service role key used for serverless functions only

See `supabase/migrations/` for complete schema.

## 🧪 Testing

### Local Testing
See [LOCAL_TESTING_GUIDE.md](./LOCAL_TESTING_GUIDE.md) for comprehensive testing instructions.

**Quick test checklist:**
- [ ] Sign up with new account
- [ ] Complete onboarding flow
- [ ] Create tour and add shows
- [ ] Update role in Settings
- [ ] Export CSV from tour
- [ ] Verify data persists after refresh

### Test Scripts
```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:build

# Run E2E tests
npm run test:e2e
```

## 📚 Documentation

### Getting Started
- [QUICK_START.md](./QUICK_START.md) - Quick setup guide
- [ENV_SETUP.md](./ENV_SETUP.md) - Environment variable setup
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Database setup guide

### User Guides
- [SIGNUP_FLOW.md](./SIGNUP_FLOW.md) - Complete signup and onboarding flow
- [USER_FLOW.md](./USER_FLOW.md) - Detailed user journey documentation
- [LOCAL_TESTING_GUIDE.md](./LOCAL_TESTING_GUIDE.md) - Testing instructions

### Development
- [APPLICATION_FLOWS.md](./APPLICATION_FLOWS.md) - Application flow documentation
- [CODE_REVIEW_ONBOARDING.md](./CODE_REVIEW_ONBOARDING.md) - Code review findings
- [UI_BACKEND_ALIGNMENT_REVIEW.md](./UI_BACKEND_ALIGNMENT_REVIEW.md) - UI/Backend alignment

### Deployment
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Step-by-step deployment guide
- [PRODUCTION_READINESS.md](./PRODUCTION_READINESS.md) - Production checklist
- [END_TO_END_IMPLEMENTATION_VERIFICATION.md](./END_TO_END_IMPLEMENTATION_VERIFICATION.md) - Feature verification

## 🚢 Deployment

### Vercel Deployment

1. **Connect repository to Vercel**
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will auto-detect Vite configuration
4. **Test production URL**

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

### Environment Variables (Production)

Set these in Vercel dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `GEMINI_API_KEY` (optional)
- `NEXT_PUBLIC_APP_URL`

## 🛠 Available Scripts

### Development
```bash
npm run dev              # Start dev server
# Opens at http://localhost:3000 (or next available port)
# Hot reload enabled - changes reflect immediately
```

### Building
```bash
npm run build            # Build for production
# Output: dist/ folder with optimized assets

npm run preview          # Preview production build locally
# Test the production build before deploying
```

### Testing
```bash
npm test                 # Run unit tests (Vitest) - watch mode
# Runs in watch mode - re-runs on file changes

npm run test:build       # Run tests with coverage report
# Generates coverage report in coverage/ folder

npm run test:e2e         # Run E2E tests (Playwright)
# Requires browser installation: npx playwright install
```

### Deployment
```bash
npm run build:verify     # Build and test before deployment
# Runs build + tests to verify everything works
```

### Common Commands
```bash
# Check if dev server is running
lsof -ti:3000            # Returns process ID if port 3000 is in use

# Kill process on port 3000 (if needed)
kill -9 $(lsof -ti:3000)

# Check Node version
node --version           # Should be 18+

# Check npm version
npm --version

# Clear npm cache (if having issues)
npm cache clean --force
```

## 🔒 Security Features

- **Row Level Security (RLS)** - Database-level access control
- **API Key Protection** - Gemini API key secured in serverless functions
- **Input Validation** - Zod schemas validate all user inputs
- **Error Boundaries** - Graceful error handling
- **Type Safety** - TypeScript prevents runtime errors
- **Secure Authentication** - Supabase handles session management

## 📊 Current Status

### ✅ Production Ready Features
- Complete authentication system
- Full CRUD operations for tours, shows, venues, vendors
- Role-based dashboards and features
- CSV export functionality
- AI assistant integration
- Subscription tier system
- Error handling and validation
- Responsive design

### 🟡 In Progress / Optional
- PDF export (API ready, generation pending)
- File uploads (infrastructure ready)
- OAuth integrations (framework in place)

## 🤝 Contributing

This is a private project. For questions or issues, please contact the maintainer.

## 📝 License

Private project - All rights reserved

## 🔗 Links

- **Repository**: https://github.com/The23rdKhan/tourcommand-
- **Supabase**: https://supabase.com
- **Vercel**: https://vercel.com
- **Google Gemini**: https://ai.google.dev

## 📞 Support

For setup help, see the documentation files listed above or check:
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Database setup
- [ENV_SETUP.md](./ENV_SETUP.md) - Environment configuration
- [LOCAL_TESTING_GUIDE.md](./LOCAL_TESTING_GUIDE.md) - Testing help

---

**Built with ❤️ for the music industry**
