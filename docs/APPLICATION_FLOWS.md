# TourCommand Application Flows

## Overview
This document walks through all major user flows in the TourCommand application, from authentication to tour management.

---

## 1. Authentication Flow

### Sign Up Flow
```
User visits /signup
  ↓
Fills form (name, email, password)
  ↓
POST to supabase.auth.signUp()
  ↓
Supabase creates auth.users record
  ↓
Auto-creates user_profiles record (if not exists)
  ↓
Redirects to /app/onboarding
```

**Code Path:**
- `components/Auth.tsx` → `supabase.auth.signUp()`
- `context/TourContext.tsx` → `onAuthStateChange` listener
- Creates profile in `user_profiles` table

### Login Flow
```
User visits /login
  ↓
Enters email/password
  ↓
POST to supabase.auth.signInWithPassword()
  ↓
Supabase validates credentials
  ↓
Returns JWT session token
  ↓
TourContext.onAuthStateChange() fires
  ↓
loadUserProfile() fetches from user_profiles
  ↓
refreshData() loads tours, venues, vendors
  ↓
Redirects to /app/dashboard
```

**Code Path:**
- `components/Auth.tsx` → `handleLogin()`
- `context/TourContext.tsx` → `onAuthStateChange` → `loadUserProfile()` → `refreshData()`

### Session Management
- **Auto-refresh**: Supabase automatically refreshes tokens
- **Persistence**: Session stored in localStorage by Supabase client
- **State sync**: `onAuthStateChange` keeps React state in sync
- **Logout**: `supabase.auth.signOut()` clears session and state

---

## 2. Onboarding Flow

### First-Time User Setup
```
New user signs up
  ↓
Redirected to /app/onboarding
  ↓
Step 1: Select role (Artist/Manager/Operator)
  ↓
Step 2: Enter profile info (name, role)
  ↓
Step 3: Role-specific setup
  ├─ Artist/Manager: Create first tour
  │   ├─ Tour name, artist, dates, region
  │   └─ Creates draft show automatically
  └─ Operator: Create first venue
      └─ Venue name, city, capacity
  ↓
handleFinish() called
  ↓
updateUser() → API → user_profiles table
  ↓
addTour() or addVenue() → API → database
  ↓
Redirects to tour detail or venue detail
```

**Code Path:**
- `components/Onboarding.tsx` → `handleFinish()`
- Calls `updateUser()` and `addTour()`/`addVenue()` from context
- API endpoints: `api/auth/profile` (PUT), `api/tours` (POST), `api/venues` (POST)

---

## 3. Tour Creation Flow

### Create New Tour
```
User clicks "Create Tour" button
  ↓
TourManager checks tier limit (Free = 1 tour max)
  ↓
If limit reached → Shows upgrade prompt
  ↓
Opens CreateTourWizard modal
  ↓
Step 1: Basic info (name, artist)
  ↓
Step 2: Dates & region
  ↓
Step 3: Optional (tour manager, booking agent, currency)
  ↓
handleComplete() called
  ↓
addTour() in context
  ↓
POST /api/tours
  ├─ Validates with Zod (TourSchema)
  ├─ Checks subscription tier limit
  ├─ Inserts into tours table
  └─ Returns new tour
  ↓
Transform DB row → App type (snake_case → camelCase)
  ↓
Updates local state (optimistic update)
  ↓
Shows success toast
  ↓
Navigates to /app/tours/{tourId}
```

**Code Path:**
- `components/TourManager.tsx` → `handleCreateClick()`
- `components/CreateTourWizard.tsx` → `handleComplete()`
- `context/TourContext.tsx` → `addTour()`
- `api/tours/index.ts` → POST handler

**Data Transformation:**
```
Frontend (camelCase) → API → Database (snake_case)
{
  name: "Summer Tour",
  startDate: "2024-06-01",
  tourManager: "John Doe"
}
  ↓
{
  name: "Summer Tour",
  start_date: "2024-06-01",
  tour_manager: "John Doe"
}
```

---

## 4. Show Management Flow

### Add Show to Tour
```
User on TourDetail page
  ↓
Clicks "Add Show" button
  ↓
Opens AddShowModal
  ↓
Fills form (date, city, venue, deal type)
  ↓
handleCreateShow() called
  ↓
addShow(tourId, show) in context
  ↓
POST /api/shows
  ├─ Validates with Zod (ShowSchema)
  ├─ Verifies tour ownership (RLS)
  ├─ Inserts into shows table
  └─ Returns new show
  ↓
Transform DB row → App type
  ↓
Updates tour.shows array (optimistic update)
  ↓
Shows success toast
  ↓
Modal closes, show appears in timeline
```

**Code Path:**
- `components/TourDetail.tsx` → `handleCreateShow()`
- `context/TourContext.tsx` → `addShow()`
- `api/shows/index.ts` → POST handler

### Update Show
```
User clicks show in timeline or detail page
  ↓
Opens ShowDetail page
  ↓
Edits fields (financials, logistics, travel, notes)
  ↓
handleSave() called
  ↓
updateShow(tourId, show) in context
  ↓
PUT /api/shows/{showId}
  ├─ Validates with Zod
  ├─ Verifies ownership
  ├─ Updates shows table
  └─ Returns updated show
  ↓
Updates local state
  ↓
Shows success toast
```

**Code Path:**
- `components/ShowDetail.tsx` → `handleSave()`
- `context/TourContext.tsx` → `updateShow()`
- `api/shows/[id].ts` → PUT handler

---

## 5. Data Flow Architecture

### Reading Data (GET)
```
Component renders
  ↓
useTour() hook called
  ↓
TourContext.refreshData() called
  ↓
Parallel Supabase queries:
  ├─ GET tours (with shows via separate query)
  ├─ GET venues
  └─ GET vendors
  ↓
Transform DB rows → App types
  ↓
Update React state
  ↓
Components re-render with new data
```

**Code Path:**
- `context/TourContext.tsx` → `refreshData()`
- Direct Supabase queries (client-side)
- Transform functions convert snake_case → camelCase

### Writing Data (POST/PUT/DELETE)
```
User action in component
  ↓
Context method called (addTour, updateShow, etc.)
  ↓
apiCall() helper
  ├─ Gets session token
  ├─ Adds Authorization header
  └─ Calls /api/{endpoint}
  ↓
Vercel serverless function
  ├─ authenticateRequest() validates JWT
  ├─ Zod validation
  ├─ Supabase query (server-side)
  └─ Returns response
  ↓
Transform response → App type
  ↓
Optimistic update to local state
  ↓
Toast notification
```

**Code Path:**
- Component → Context method → `apiCall()` → API endpoint → Supabase → Response → State update

---

## 6. AI Assistant Flow

### Chat with AI
```
User opens Assistant page
  ↓
Types message in chat input
  ↓
handleSend() called
  ↓
getTourAgentResponse() in geminiService
  ↓
POST /api/gemini/chat
  ├─ Authenticates user
  ├─ Fetches user's tours, venues, vendors
  ├─ Builds context string
  ├─ Calls Google Gemini API
  └─ Returns text or tool calls
  ↓
If tool call (create_draft_show):
  ├─ handleCreateShowTool() called
  ├─ POST /api/gemini/create-show
  ├─ Creates show in database
  └─ refreshData() updates UI
  ↓
AI response displayed in chat
```

**Code Path:**
- `components/Assistant.tsx` → `handleSend()`
- `services/geminiService.ts` → `getTourAgentResponse()`
- `api/gemini/chat.ts` → Gemini API call
- `api/gemini/create-show.ts` → Show creation

---

## 7. Subscription & Tier Management

### Upgrade Subscription
```
User visits Settings page
  ↓
Clicks "Upgrade to Pro" button
  ↓
handleUpgrade('Pro') called
  ↓
upgradeTier() in context
  ↓
PUT /api/auth/subscription
  ├─ Updates user_profiles.tier
  ├─ Updates/creates subscriptions record
  └─ Returns updated tier
  ↓
Updates local user state
  ↓
Shows success toast
  ↓
Pro features now unlocked
```

**Code Path:**
- `components/Settings.tsx` → `handleUpgrade()`
- `context/TourContext.tsx` → `upgradeTier()`
- `api/auth/subscription.ts` → PUT handler

### Tier Enforcement
```
User tries to create 2nd tour (Free tier)
  ↓
TourManager.handleCreateClick()
  ↓
Checks: user.tier === 'Free' && tours.length >= 1
  ↓
Shows upgrade prompt
  ↓
If confirmed → Navigate to Settings
```

**Code Path:**
- `components/TourManager.tsx` → Tier check
- `api/tours/index.ts` → Server-side tier limit check

---

## 8. Export & Pro Features Flow

### CSV Export
```
User on TourDetail page
  ↓
Clicks Export menu → CSV Export
  ↓
handleExportCSV() called
  ↓
GET /api/exports/csv?tourId={id}
  ├─ Authenticates user
  ├─ Verifies tour ownership
  ├─ Fetches all shows for tour
  ├─ Generates CSV content
  └─ Returns CSV file
  ↓
Downloads file to user's computer
```

**Code Path:**
- `components/TourDetail.tsx` → `handleExportCSV()`
- `api/exports/csv.ts` → CSV generation

### PDF Export (Pro Only)
```
User on TourDetail page
  ↓
Clicks Export menu → Branded PDF Report
  ↓
Checks user.tier (must be Pro/Agency)
  ↓
If Free → Shows upgrade prompt
  ↓
If Pro → GET /api/exports/pdf?tourId={id}
  ├─ Validates tier
  ├─ Generates PDF (placeholder - needs implementation)
  └─ Returns PDF file
  ↓
Downloads PDF
```

**Code Path:**
- `components/TourDetail.tsx` → PDF export handler
- `api/exports/pdf.ts` → PDF generation (needs full implementation)

### Shareable Link (Pro Only)
```
User on TourDetail page
  ↓
Clicks Export menu → Shareable Web Link
  ↓
Checks user.tier (must be Pro/Agency)
  ↓
If Free → Shows upgrade prompt
  ↓
If Pro → POST /api/exports/share
  ├─ Validates tier
  ├─ Generates unique token
  ├─ Creates shared_tour_links record
  └─ Returns share URL
  ↓
Copies link to clipboard
  ↓
Shows success toast
```

**Code Path:**
- `components/TourDetail.tsx` → Share handler
- `api/exports/share.ts` → Link generation

---

## 9. Venue & Vendor Management Flow

### Add Venue
```
User on Venues page
  ↓
Clicks "Add Venue" button
  ↓
Fills form (name, city, capacity, contact info)
  ↓
handleAdd() called
  ↓
addVenue() in context
  ↓
POST /api/venues
  ├─ Validates with Zod
  ├─ Inserts into venues table
  └─ Returns new venue
  ↓
Updates local state
  ↓
Shows success toast
```

### Add Vendor
```
User on Vendors page
  ↓
Clicks "Add Vendor" button
  ↓
Fills form (name, role, POC info, permits)
  ↓
handleSave() called
  ↓
addVendor() in context
  ↓
POST /api/vendors
  ├─ Validates with Zod
  ├─ Inserts into vendors table
  └─ Returns new vendor
  ↓
Updates local state
  ↓
Shows success toast
```

---

## 10. Error Handling Flow

### API Error
```
API call fails
  ↓
apiCall() catches error
  ↓
Extracts error message from response
  ↓
Throws Error with message
  ↓
Component catch block
  ↓
Shows error toast
  ↓
User sees friendly error message
```

### Authentication Error
```
Session expires
  ↓
onAuthStateChange fires with null session
  ↓
TourContext clears state
  ↓
ProtectedLayout redirects to /login
```

### Validation Error
```
User submits invalid data
  ↓
Zod schema validation fails
  ↓
API returns 400 with error details
  ↓
Component shows validation errors
```

---

## 11. Analytics Flow

### Track Event
```
User performs action (create tour, add show, etc.)
  ↓
trackEvent() called with event name and properties
  ↓
POST /api/analytics/track
  ├─ Authenticates user
  ├─ Validates event schema
  ├─ Inserts into analytics_events table
  └─ Returns success
```

**Code Path:**
- Various components → `trackEvent()`
- `utils/analytics.ts` → API call
- `api/analytics/track.ts` → Event storage

---

## Data Flow Summary

### Client-Side Flow
```
React Component
  ↓
useTour() hook
  ↓
TourContext (state management)
  ↓
API calls via apiCall() helper
  ↓
Vercel serverless functions
```

### Server-Side Flow
```
Vercel API endpoint
  ↓
authenticateRequest() (JWT validation)
  ↓
Zod validation
  ↓
Supabase query (PostgreSQL)
  ↓
Transform response
  ↓
Return JSON
```

### Database Flow
```
Supabase Client/Server
  ↓
PostgreSQL Database
  ├─ Tables (tours, shows, venues, vendors, etc.)
  ├─ Row Level Security (RLS) policies
  └─ Foreign key constraints
```

---

## Key Technologies & Patterns

1. **State Management**: React Context API (TourContext)
2. **Data Fetching**: Supabase client (direct queries) + API routes (mutations)
3. **Authentication**: Supabase Auth with JWT tokens
4. **Validation**: Zod schemas on both client and server
5. **Type Safety**: TypeScript with proper type transformations
6. **Error Handling**: Try/catch with toast notifications
7. **Optimistic Updates**: Update UI immediately, sync with server
8. **Security**: RLS policies, JWT validation, tier enforcement

---

This covers all major flows in the TourCommand application!

