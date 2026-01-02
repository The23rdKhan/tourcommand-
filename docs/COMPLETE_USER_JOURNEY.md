# Complete User Journey - TourCommand App

## 🗺️ Visual Journey Map

```
┌─────────────────────────────────────────────────────────────────┐
│                    PUBLIC / UNAUTHENTICATED                     │
└─────────────────────────────────────────────────────────────────┘

1. Landing Page (/)
   └─> Marketing homepage
   └─> Links to: /features, /pricing, /signup, /login

2. Features Page (/features)
   └─> Product features overview

3. Pricing Page (/pricing)
   └─> Subscription tiers (Free, Pro, Agency)

4. Sign Up (/signup)
   ├─> Form: First Name, Last Name, Email, Password, Confirm Password
   ├─> Terms of Service checkbox (required)
   ├─> Links to: /terms, /privacy
   ├─> 🐛 Debug Button (dev only): Auto-fills and tests signup
   └─> On Success: Creates auth user + profile → Redirects to /app/onboarding

5. Login (/login)
   ├─> Form: Email, Password
   ├─> Validates credentials
   └─> On Success: Redirects to /app/dashboard (or /app/onboarding if no tours/venues)

6. Terms (/terms)
   └─> Terms of Service page

7. Privacy (/privacy)
   └─> Privacy Policy page


┌─────────────────────────────────────────────────────────────────┐
│                    PROTECTED / AUTHENTICATED                     │
└─────────────────────────────────────────────────────────────────┘

8. Onboarding (/app/onboarding) ⭐ FIRST TIME ONLY
   │
   ├─ Step 1: Profile & Role Selection
   │  ├─ Enter Name
   │  ├─ Select Role:
   │  │  ├─ 🎵 Artist / Musician
   │  │  ├─ 🛡️ Artist Manager
   │  │  └─ 🏢 Venue Operator / Promoter
   │  └─ Continue Button
   │
   ├─ Step 2A: Artist/Manager Path
   │  ├─ Create First Tour:
   │  │  ├─ Tour Name
   │  │  ├─ Primary Region (North America, Europe, UK & Ireland, Australia & NZ)
   │  │  ├─ Currency (USD, EUR, GBP)
   │  │  └─ Approx. Start Date
   │  └─ Launch Dashboard Button
   │     └─> Creates tour + draft show → Redirects to /app/tours/{tourId}
   │
   └─ Step 2B: Operator Path
      ├─ Create First Venue:
      │  ├─ Venue Name
      │  ├─ City
      │  └─ Capacity
      └─ Launch Dashboard Button
         └─> Creates venue → Redirects to /app/venues/{venueId}


┌─────────────────────────────────────────────────────────────────┐
│                      MAIN APP (SIDEBAR NAV)                     │
└─────────────────────────────────────────────────────────────────┘

All protected routes have:
- Left Sidebar (desktop) / Mobile Menu
- Navigation links
- User profile card (bottom of sidebar)
- Logout button

9. Dashboard (/app/dashboard) 🏠 HOME
   │
   ├─ Role-Based Views:
   │  ├─ Artist View:
   │  │  ├─ Welcome message
   │  │  ├─ Financial cards (Revenue, Net Profit, Next Show)
   │  │  ├─ Active tour overview
   │  │  └─ Upcoming shows list
   │  │
   │  ├─ Manager View:
   │  │  ├─ Roster overview
   │  │  ├─ Artist stats (revenue, shows per artist)
   │  │  ├─ Action items (holds needing attention)
   │  │  └─ Upcoming shows across roster
   │  │
   │  └─ Operator View:
   │     ├─ Venue calendar overview
   │     ├─ Booking requests
   │     └─ Venue stats
   │
   └─ Links to: Tours, Venues, Settings

10. Tours List (/app/tours) 📅
    │
    ├─ Shows all user's tours
    ├─ "Create Tour" button (tier-limited)
    ├─ Tour cards with:
    │  ├─ Tour name, artist, dates
    │  ├─ Show count
    │  └─ "Manage Tour" button
    │
    └─ Click tour → /app/tours/{tourId}

11. Tour Detail (/app/tours/:tourId) 🎤
    │
    ├─ Tour Header:
    │  ├─ Tour name, artist, dates
    │  ├─ "Edit Tour Details" button
    │  └─ "Delete Tour" button
    │
    ├─ Financial Summary:
    │  ├─ Total revenue, expenses, profit
    │  └─ Charts (if Pro tier)
    │
    ├─ Shows Timeline:
    │  ├─ List of all shows
    │  ├─ Status badges (Confirmed, Hold, Draft, etc.)
    │  ├─ "Add Show" button
    │  └─ Click show → /app/tours/{tourId}/shows/{showId}
    │
    ├─ Export Menu:
    │  ├─ CSV Export (all tiers)
    │  └─ PDF Export (Pro tier)
    │
    └─ Actions:
       ├─ Add shows
       ├─ Edit tour details
       └─ Delete tour

12. Show Detail (/app/tours/:tourId/shows/:showId) 🎪
    │
    ├─ Show Header:
    │  ├─ City, Venue, Date
    │  ├─ Status badge
    │  └─ "Delete Show" button
    │
    ├─ Financials Tab:
    │  ├─ Guarantee
    │  ├─ Ticket Price & Sold Count
    │  ├─ Merch Sales
    │  ├─ Expenses (Travel, Hotels, Per Diems, etc.)
    │  └─ Net Profit calculation
    │
    ├─ Logistics Tab:
    │  ├─ Load-in time
    │  ├─ Soundcheck time
    │  ├─ Show time
    │  └─ Notes
    │
    ├─ Travel Tab:
    │  ├─ Travel items (flights, hotels, ground transport)
    │  └─ Add/remove travel items
    │
    └─ "Save Changes" button

13. Venues List (/app/venues) 📍
    │
    ├─ Shows all user's venues
    ├─ "Add Venue" button
    ├─ Venue cards with:
    │  ├─ Venue name, city
    │  ├─ Capacity
    │  └─ "View Details" button
    │
    └─ Click venue → /app/venues/{venueId}

14. Venue Detail (/app/venues/:venueId) 🏢
    │
    ├─ Venue Info:
    │  ├─ Name, City, Capacity
    │  ├─ Contact Name, Contact Email
    │  └─ Notes
    │
    ├─ "Edit Venue" button
    │  └─> Edit mode: Update contact info, capacity, notes
    │
    └─ Show History:
       └─ List of shows at this venue

15. Vendors (/app/vendors) 👥
    │
    ├─ Shows all vendors/crew
    ├─ "Add Vendor" button
    ├─ Vendor cards with:
    │  ├─ Name, Role
    │  ├─ City, Contact info
    │  └─ Requires Permits badge
    │
    └─ Filter by role (Security, Sound/Audio, etc.)

16. AI Analyst (/app/assistant) 🤖
    │
    ├─ Chat interface
    ├─ Can ask questions about tours
    ├─ Can create shows via chat:
    │  └─ "Add a show in Las Vegas on Oct 20th"
    │     └─> AI creates draft show
    │
    └─ Requires: GEMINI_API_KEY (optional feature)

17. Settings (/app/settings) ⚙️
    │
    ├─ Profile Tab:
    │  ├─ Name (editable)
    │  ├─ Email (editable)
    │  ├─ Role (editable - shows warning modal on change)
    │  └─ "Save Changes" button
    │
    ├─ Subscription Tab:
    │  ├─ Current tier (Free, Pro, Agency)
    │  ├─ Upgrade buttons
    │  └─ Feature comparison
    │
    └─ Account Tab:
       └─ Logout button (in sidebar)


┌─────────────────────────────────────────────────────────────────┐
│                        NAVIGATION FLOW                          │
└─────────────────────────────────────────────────────────────────┘

Sidebar Navigation (Left):
├─ Overview → /app/dashboard
├─ Tours → /app/tours
├─ Venues → /app/venues
├─ Crew & Vendors → /app/vendors
├─ AI Analyst → /app/assistant
└─ Settings → /app/settings

Breadcrumbs (on detail pages):
Dashboard → Tours → Tour Name → Show Name


┌─────────────────────────────────────────────────────────────────┐
│                      ROLE-BASED EXPERIENCES                     │
└─────────────────────────────────────────────────────────────────┘

🎵 ARTIST
├─ Dashboard: Tour profit tracking, next show
├─ Focus: Single tour, show profitability
├─ Features: Tour routing, profit analysis
└─ Onboarding: Creates tour

🛡️ MANAGER
├─ Dashboard: Roster overview, artist stats
├─ Focus: Multiple artists, financial oversight
├─ Features: Team management, roster analytics
└─ Onboarding: Creates tour

🏢 OPERATOR
├─ Dashboard: Venue calendar, booking requests
├─ Focus: Venue management, booking calendar
├─ Features: Venue CRM, booking management
└─ Onboarding: Creates venue


┌─────────────────────────────────────────────────────────────────┐
│                        KEY USER FLOWS                           │
└─────────────────────────────────────────────────────────────────┘

FLOW 1: New User Signup
/signup → Fill form → Create account → /app/onboarding → 
Select role → Create tour/venue → /app/tours/{id} or /app/venues/{id}

FLOW 2: Returning User Login
/login → Enter credentials → /app/dashboard (or /app/onboarding if incomplete)

FLOW 3: Create Tour
/app/tours → "Create Tour" → Fill form → Tour created → /app/tours/{id}

FLOW 4: Add Show to Tour
/app/tours/{tourId} → "Add Show" → Fill form → Show created → 
/app/tours/{tourId}/shows/{showId}

FLOW 5: Update Show Financials
/app/tours/{tourId}/shows/{showId} → Edit financials → "Save Changes" → 
Data saved to database

FLOW 6: Export Tour Data
/app/tours/{tourId} → Export menu → CSV/PDF → File downloads

FLOW 7: Change Role
/app/settings → Change role dropdown → Warning modal → Confirm → 
Role updated → Analytics event tracked


┌─────────────────────────────────────────────────────────────────┐
│                        PROTECTION & GUARDS                       │
└─────────────────────────────────────────────────────────────────┘

Authentication Guards:
├─ /login, /signup → Redirects to /app/dashboard if already logged in
└─ /app/* → Redirects to /login if not authenticated

Onboarding Guard:
└─ /app/onboarding → Redirects to /app/dashboard if already completed
   (checks if user has tours or venues)


┌─────────────────────────────────────────────────────────────────┐
│                        DATA FLOW                                │
└─────────────────────────────────────────────────────────────────┘

User Action → Component → TourContext Method → API Endpoint → 
Supabase Database → Response → State Update → UI Update

Example: Create Tour
1. User clicks "Create Tour"
2. TourManager component calls addTour()
3. TourContext.addTour() → POST /api/tours
4. API validates with Zod schema
5. Inserts into Supabase tours table
6. Returns tour data
7. TourContext updates local state
8. UI shows new tour in list


┌─────────────────────────────────────────────────────────────────┐
│                        FEATURES BY TIER                         │
└─────────────────────────────────────────────────────────────────┘

FREE TIER:
├─ 1 tour maximum
├─ Basic features
├─ CSV export
└─ Basic analytics

PRO TIER:
├─ Unlimited tours
├─ PDF export
├─ Advanced analytics
└─ Advanced routing

AGENCY TIER:
├─ Multi-user
├─ Team collaboration
└─ All Pro features


┌─────────────────────────────────────────────────────────────────┐
│                        QUICK REFERENCE                          │
└─────────────────────────────────────────────────────────────────┘

Public Routes:
- / → Home
- /features → Features
- /pricing → Pricing
- /login → Login
- /signup → Signup
- /terms → Terms of Service
- /privacy → Privacy Policy

Protected Routes:
- /app/dashboard → Dashboard (home)
- /app/onboarding → First-time setup
- /app/tours → Tour list
- /app/tours/:tourId → Tour detail
- /app/tours/:tourId/shows/:showId → Show detail
- /app/venues → Venue list
- /app/venues/:venueId → Venue detail
- /app/vendors → Vendor list
- /app/assistant → AI Assistant
- /app/settings → Settings

Sidebar Links:
- Overview (Dashboard)
- Tours
- Venues
- Crew & Vendors
- AI Analyst
- Settings

