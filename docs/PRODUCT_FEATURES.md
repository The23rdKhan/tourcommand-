# TourCommand - Complete Product Features

## 🎯 Overview

TourCommand is a comprehensive tour management platform designed for three primary user personas: **Artists**, **Managers**, and **Venue Operators**. The platform combines tour planning, financial tracking, logistics management, and AI-powered assistance into a single, data-driven solution.

---

## 👥 User Roles & Personas

### 🎤 Artist
**Focus:** Logistics & Performance
- Manage personal tours
- Track show schedules and itineraries
- Monitor personal profit and revenue
- Access mobile-friendly day sheets
- View upcoming shows and tour progress

### 👔 Manager
**Focus:** Financials & Strategy
- Manage multiple artists (roster)
- Track revenue across all artists
- Monitor contract status and action items
- Compare artist performance
- Oversee team and vendor management

### 🏢 Operator
**Focus:** Pipeline & Utilization
- Manage venue booking calendar
- Track holds, challenges, and confirmed dates
- Monitor venue utilization
- Handle booking requests
- Prevent double-booking

---

## ✨ Core Features

### 1. 🎵 Tour Management

#### Create & Manage Tours
- **Create unlimited tours** (Pro/Agency tier) or 1 tour (Free tier)
- **Tour details:**
  - Tour name and artist
  - Start and end dates
  - Region/territory
  - Tour manager and booking agent
  - Currency selection
- **Edit tour details** after creation
- **Delete tours** with confirmation
- **Tour timeline view** with all shows

#### Tour Overview
- Financial summary (revenue, expenses, profit)
- Show count and status breakdown
- Progress tracking
- Quick access to all shows

---

### 2. 🎪 Show Management

#### Create Shows
- **Add shows to tours** with full details
- **Show information:**
  - Date and city
  - Venue (select existing or create new)
  - Status (Draft, Hold, Confirmed, Challenged, Canceled)
  - Deal type (Guarantee, Door Split, Guarantee + %, Flat Fee)
- **Financial tracking:**
  - Guarantee amount
  - Ticket price and sold count
  - Capacity
  - Expenses (venue, production, travel, hotels, marketing, misc)
  - Merchandise sales
- **Logistics:**
  - Call time
  - Load-in time
  - Set time
- **Travel items:**
  - Flight, hotel, train, bus, car rental, other
  - Provider and booking reference
  - Cost and date/time
  - Notes
- **Notes field** for additional information

#### Show Status Management
- **Draft:** Initial planning stage
- **Hold:** Tentative booking
- **Confirmed:** Finalized show
- **Challenged:** Another artist competing for date
- **Canceled:** Show no longer happening

#### Show Actions
- **Edit show details** inline or via detail page
- **Update financials** in real-time
- **Delete shows** with confirmation
- **View show details** in dedicated page
- **Quick status updates** from timeline

---

### 3. 🏢 Venue Database

#### Venue Management
- **Create venues** with:
  - Name and city
  - Capacity
  - Contact name and email
  - Notes
- **Edit venue details** after creation
- **View venue history** (all shows at venue)
- **Link shows to venues** for better tracking
- **Venue detail page** with:
  - Contact information
  - Show history
  - Capacity and location

#### Venue Features
- **Automatic linking** when creating shows
- **Venue suggestions** when adding shows
- **Show history tracking** per venue
- **Contact management** for venue operators

---

### 4. 👥 Vendor & Crew Management

#### Vendor Database
- **Create vendors** with:
  - Name and role (Security, Sound/Audio, Pyrotechnics, Runner, Makeup/Stylist, Catering, Other)
  - City location
  - Point of contact (name, email, phone)
  - Permit requirements flag
  - Notes
- **Delete vendors** when no longer needed
- **Vendor roles:**
  - Security
  - Sound/Audio
  - Pyrotechnics
  - Runner
  - Makeup/Stylist
  - Catering
  - Other

#### Vendor Features
- **Compliance tracking** (permit requirements)
- **Contact management** (POC details)
- **City-based organization**
- **Notes for special requirements**

---

### 5. 💰 Financial Tracking

#### Real-Time P&L
- **Revenue tracking:**
  - Guarantees
  - Ticket sales (price × sold count)
  - Merchandise sales
- **Expense tracking:**
  - Venue costs
  - Production (sound/lights)
  - Travel expenses
  - Hotel costs
  - Marketing expenses
  - Miscellaneous costs
- **Net profit calculation** (revenue - expenses)
- **Break-even analysis** per show

#### Financial Features
- **Deal type calculators:**
  - Guarantee (flat fee)
  - Door Split (percentage of door)
  - Guarantee + Percentage (base + %)
  - Flat Fee
- **Real-time updates** as you edit financials
- **Tour-level aggregation** of all shows
- **Show-level profit tracking**

#### Financial Dashboards
- **Artist view:** Personal profit and revenue
- **Manager view:** Roster-wide revenue and P&L
- **Operator view:** Booking revenue tracking

---

### 6. 📊 Analytics & Reporting

#### CSV Export
- **Export tour data** to CSV
- **Includes:**
  - All shows
  - Financial data
  - Dates and locations
  - Status information
- **Available on all tiers**

#### PDF Export (Pro/Agency)
- **Professional PDF reports:**
  - Financial summary
  - Show details table
  - Tour overview
  - Revenue and expense breakdown
- **Downloadable reports** for sharing

#### Analytics Features
- **Revenue charts** (Pro tier)
- **Expense breakdowns**
- **Profit trends**
- **Show status distribution**
- **Tour progress tracking**

---

### 7. 🤖 AI Assistant

#### Natural Language Interface
- **Chat-based interface** for tour management
- **Natural language commands:**
  - "Add a show in Las Vegas on Oct 20th"
  - "What's the gas cost?"
  - "How much profit if we sell 70% of tickets?"
- **Instant responses** with actionable results

#### AI Features
- **Show creation** via chat commands
- **Profit analysis** and calculations
- **Route suggestions** and logistics help
- **Data analysis** across tours
- **Tool calls** for direct actions (e.g., creating shows)

#### AI Capabilities
- **Context awareness** (knows your tours, venues, vendors)
- **Action execution** (can create shows, analyze data)
- **Conversational interface** (remembers chat history)
- **Error handling** with helpful messages

---

### 8. 🗺️ Routing & Logistics

#### Smart Routing
- **Automatic distance calculations** between shows
- **Drive time estimates**
- **Gas cost calculations**
- **Conflict detection:**
  - Impossible travel days
  - Double bookings
  - Venue restrictions
- **City suggestions** for profitable stops

#### Logistics Management
- **Call times** per show
- **Load-in times**
- **Set times**
- **Travel item tracking:**
  - Flights
  - Hotels
  - Trains
  - Buses
  - Car rentals
  - Other transportation

#### Route Features
- **Visual timeline** of all shows
- **Date-based organization**
- **Geographic awareness** (city-based)
- **Travel cost aggregation**

---

### 9. 📁 Document Management

#### File Uploads (Pro/Agency)
- **Upload tour documents:**
  - Contracts
  - Rider documents
  - Venue agreements
  - Other tour-related files
- **Drag-and-drop interface**
- **File organization** per tour
- **Download uploaded files**
- **Delete files** when no longer needed

#### Document Features
- **Supabase Storage integration**
- **Secure file storage**
- **Public URL generation** for downloads
- **File list display** with upload dates

---

### 10. 🔐 Authentication & User Management

#### Account Creation
- **Sign up with:**
  - First name and last name
  - Email address
  - Password (8+ characters, complexity requirements)
  - Password confirmation
  - Terms of Service acceptance
- **Email verification** reminder
- **Automatic profile creation** via database trigger

#### Login & Security
- **Email/password authentication**
- **Session management**
- **Secure logout**
- **Password validation**

#### User Profile
- **Update name and email**
- **Change role** (Artist, Manager, Operator)
- **View subscription tier**
- **Upgrade subscription** (Free → Pro → Agency)

---

### 11. 🎯 Onboarding Flow

#### First-Time Setup
- **Step 1: Role Selection**
  - Choose Artist, Manager, or Operator
  - Profile name pre-filled from signup
- **Step 2: Initial Data Creation**
  - **Artist:** Create first tour
  - **Manager:** Create first tour
  - **Operator:** Create first venue
- **Step 3: Profile Completion**
  - Confirm profile name
  - Finalize setup

#### Onboarding Features
- **Email verification reminder**
- **Data validation** (future dates, required fields)
- **Error handling** with clear messages
- **Pre-filled data** from signup
- **Smooth transition** to dashboard

---

### 12. 📱 Responsive Design

#### Mobile Support
- **Mobile-first design**
- **Touch-friendly interfaces**
- **Responsive layouts** for all screens
- **Mobile-optimized dashboards**

#### Cross-Device
- **Desktop optimization**
- **Tablet support**
- **Consistent experience** across devices

---

### 13. 🎨 User Interface

#### Modern Design
- **Clean, intuitive interface**
- **Dark theme** (slate-900 background)
- **Tailwind CSS** styling
- **Lucide React icons**
- **Smooth animations** and transitions

#### Navigation
- **Sidebar navigation** with:
  - Dashboard
  - Tours
  - Venues
  - Vendors
  - AI Assistant
  - Settings
- **Breadcrumbs** for deep navigation
- **Quick actions** throughout UI

---

### 14. 🔔 Notifications & Feedback

#### Toast Notifications
- **Success messages** for completed actions
- **Error messages** with helpful details
- **Info messages** for important updates
- **Non-intrusive** bottom-right placement

#### User Feedback
- **Loading states** during operations
- **Confirmation dialogs** for destructive actions
- **Form validation** with inline errors
- **Helpful error messages**

---

### 15. 📈 Role-Based Dashboards

#### Artist Dashboard
- **Welcome message** with personalized greeting
- **Financial cards:**
  - Tour revenue
  - Net profit (my share)
  - Next show
- **Active tour overview** with progress bar
- **Upcoming shows** list (next 4 shows)
- **Upgrade prompts** for Pro features

#### Manager Dashboard
- **Roster overview** with action items count
- **Financial metrics:**
  - Total revenue (roster)
  - Pending contracts
  - Active tours
- **Artist performance** comparison
- **Urgent action items** (holds needing attention)
- **Upgrade prompts** for team features

#### Operator Dashboard
- **Venue & event pipeline** overview
- **Booking metrics:**
  - Total confirmed
  - Holds/pending
  - Active offers
  - Avails sent
- **Recent bookings** list
- **Venue utilization** chart (last 30 days)
- **Upgrade prompts** for bulk tools

---

### 16. 💳 Subscription Tiers

#### Free Tier
- **1 tour maximum**
- **Basic features:**
  - Tour and show management
  - Venue database
  - Vendor management
  - CSV export
  - Basic analytics
- **Limited to single tour**

#### Pro Tier
- **Unlimited tours**
- **All Free features plus:**
  - PDF export
  - Advanced analytics
  - Charts and visualizations
  - File uploads
  - Smart routing features

#### Agency Tier
- **All Pro features plus:**
  - Multi-user support
  - Team collaboration
  - Role management
  - Advanced team features

---

### 17. 🔒 Security Features

#### Data Security
- **Row Level Security (RLS)** policies
- **User data isolation** (users only see their data)
- **Secure authentication** via Supabase
- **Encrypted connections** (HTTPS)

#### Access Control
- **Role-based access** to features
- **Tier-based limitations** (Free vs Pro)
- **Protected routes** (authentication required)
- **Session management**

---

### 18. 🌐 Legal & Compliance

#### Terms & Privacy
- **Terms of Service page** (`/terms`)
- **Privacy Policy page** (`/privacy`)
- **Links in footer** and signup flow
- **Acceptance required** during signup

---

### 19. 🛠️ Developer Features

#### Debug Tools
- **Debug button** on signup page (dev only)
- **Auto-fills form** with test data
- **Tests full signup flow** automatically
- **Helps with local testing**

#### Error Handling
- **Global error handlers** for uncaught errors
- **Centralized logging** utility
- **Error tracking** and reporting
- **User-friendly error messages**

---

### 20. 📊 Data Management

#### Data Persistence
- **Supabase PostgreSQL** database
- **Real-time synchronization**
- **Automatic data refresh**
- **Optimistic UI updates**

#### Data Export
- **CSV export** for all tours
- **PDF export** for Pro users
- **Data backup** via exports

---

## 🎯 Feature Matrix by Tier

| Feature | Free | Pro | Agency |
|---------|------|-----|--------|
| Tours | 1 | Unlimited | Unlimited |
| Shows | Unlimited | Unlimited | Unlimited |
| Venues | Unlimited | Unlimited | Unlimited |
| Vendors | Unlimited | Unlimited | Unlimited |
| CSV Export | ✅ | ✅ | ✅ |
| PDF Export | ❌ | ✅ | ✅ |
| File Uploads | ❌ | ✅ | ✅ |
| Advanced Analytics | ❌ | ✅ | ✅ |
| Charts | ❌ | ✅ | ✅ |
| Smart Routing | Limited | ✅ | ✅ |
| Multi-user | ❌ | ❌ | ✅ |
| Team Collaboration | ❌ | ❌ | ✅ |

---

## 🚀 Upcoming Features (Planned)

Based on the codebase and marketing materials, these features are mentioned but may not be fully implemented:

- **Smart Routing Engine** (enhanced)
- **City Suggestions** (AI-powered)
- **Day Sheets** (automated)
- **Mobile App** (native)
- **Team Roles** (delegation)
- **Bulk Tools** (for operators)
- **Advanced Reporting** (more formats)
- **Integrations** (calendar, email, etc.)

---

## 📝 Notes

- All features are **role-aware** and adapt to user persona
- **Tier limitations** are enforced throughout the app
- **Real-time updates** ensure data consistency
- **Mobile-responsive** design works on all devices
- **AI Assistant** requires Google Gemini API key (optional)

---

## 🔗 Related Documentation

- [Complete User Journey](./COMPLETE_USER_JOURNEY.md)
- [User Journey Simple](./USER_JOURNEY_SIMPLE.md)
- [Data Collection & Billing](./DATA_COLLECTION_AND_BILLING.md)
- [Production Readiness](./PRODUCTION_READINESS_ASSESSMENT.md)

