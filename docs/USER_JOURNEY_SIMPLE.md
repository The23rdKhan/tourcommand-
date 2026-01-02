# User Journey - Simple Visual Guide

## 🚀 Complete Flow from Start to Finish

### Phase 1: Getting Started (Public)

```
┌─────────────┐
│   Landing   │ → Marketing homepage
│     (/)     │ → Links to signup/login
└─────────────┘

┌─────────────┐
│   Sign Up   │ → Fill form (name, email, password)
│  (/signup)  │ → Accept Terms
│             │ → Click "Create Account"
│             │ → 🐛 Debug button (dev only) - auto-fills & tests
└─────────────┘
      │
      ▼
┌─────────────┐
│  Database   │ → Auth user created
│  Trigger    │ → Profile created automatically
└─────────────┘
      │
      ▼
┌─────────────┐
│Onboarding   │ → Step 1: Select role (Artist/Manager/Operator)
│(/app/onboard│ → Step 2: Create tour OR venue
│    ing)     │ → Redirects to tour/venue detail
└─────────────┘
```

---

### Phase 2: Main App (Protected - Requires Login)

```
┌─────────────────────────────────────────────────────────┐
│                    SIDEBAR NAVIGATION                    │
│  (Visible on all protected pages)                        │
│                                                           │
│  📊 Overview    → Dashboard (/app/dashboard)           │
│  📅 Tours        → Tour list (/app/tours)                │
│  📍 Venues       → Venue list (/app/venues)              │
│  👥 Crew & Vendors → Vendor list (/app/vendors)          │
│  🤖 AI Analyst   → AI Assistant (/app/assistant)         │
│  ⚙️ Settings     → Settings (/app/settings)               │
│                                                           │
│  👤 User Profile (bottom)                                │
│  🚪 Logout button                                        │
└─────────────────────────────────────────────────────────┘
```

---

### Phase 3: Detailed Flows

#### Flow A: Tour Management (Artist/Manager)

```
Dashboard
  ↓
Tours List (/app/tours)
  ├─> "Create Tour" button
  │   └─> Create Tour Wizard
  │       └─> Tour created → Tour Detail
  │
  └─> Click existing tour
      └─> Tour Detail (/app/tours/{tourId})
          ├─> View tour info
          ├─> "Add Show" button
          │   └─> Show created → Show Detail
          │
          ├─> Click existing show
          │   └─> Show Detail (/app/tours/{tourId}/shows/{showId})
          │       ├─> Edit financials
          │       ├─> Edit logistics
          │       ├─> Edit travel
          │       └─> "Save Changes"
          │
          ├─> "Edit Tour Details" button
          ├─> "Delete Tour" button
          └─> Export menu (CSV/PDF)
```

#### Flow B: Venue Management (Operator)

```
Dashboard
  ↓
Venues List (/app/venues)
  ├─> "Add Venue" button
  │   └─> Venue created → Venue Detail
  │
  └─> Click existing venue
      └─> Venue Detail (/app/venues/{venueId})
          ├─> View venue info
          ├─> "Edit Venue" button
          │   └─> Edit mode: Update contact, capacity, notes
          │       └─> "Save Changes"
          └─> Show history (shows at this venue)
```

#### Flow C: Settings & Profile

```
Settings (/app/settings)
  ├─> Profile Tab
  │   ├─> Edit Name
  │   ├─> Edit Email
  │   ├─> Change Role → Warning modal → Confirm
  │   └─> "Save Changes"
  │
  ├─> Subscription Tab
  │   ├─> View current tier
  │   ├─> "Upgrade to Pro" button
  │   └─> Feature comparison
  │
  └─> Account Tab
      └─> (Logout in sidebar)
```

---

## 📍 Page-by-Page Breakdown

### 1. **Landing Page** (`/`)
- Marketing homepage
- Links to signup, login, features, pricing

### 2. **Sign Up** (`/signup`)
- Form: First Name, Last Name, Email, Password, Confirm Password
- Terms checkbox (required)
- Links to Terms and Privacy pages
- 🐛 Debug button (dev only)
- **On Success:** → `/app/onboarding`

### 3. **Login** (`/login`)
- Form: Email, Password
- **On Success:** → `/app/dashboard` (or `/app/onboarding` if incomplete)

### 4. **Onboarding** (`/app/onboarding`) ⭐ First time only
- **Step 1:** Enter name, select role
- **Step 2A (Artist/Manager):** Create tour
- **Step 2B (Operator):** Create venue
- **On Complete:** → Tour/Venue detail page

### 5. **Dashboard** (`/app/dashboard`) 🏠
- Role-based view (Artist/Manager/Operator)
- Financial summary
- Upcoming shows
- Action items
- Quick links to tours/venues

### 6. **Tours List** (`/app/tours`)
- Shows all tours
- "Create Tour" button (tier-limited)
- Click tour → Tour detail

### 7. **Tour Detail** (`/app/tours/:tourId`)
- Tour info and financials
- Shows timeline
- "Add Show" button
- "Edit Tour Details" button
- "Delete Tour" button
- Export menu (CSV/PDF)
- Click show → Show detail

### 8. **Show Detail** (`/app/tours/:tourId/shows/:showId`)
- Show financials (guarantee, tickets, expenses)
- Logistics (times, notes)
- Travel items
- "Save Changes" button
- "Delete Show" button

### 9. **Venues List** (`/app/venues`)
- Shows all venues
- "Add Venue" button
- Click venue → Venue detail

### 10. **Venue Detail** (`/app/venues/:venueId`)
- Venue info
- "Edit Venue" button → Edit mode
- Show history

### 11. **Vendors** (`/app/vendors`)
- Vendor/crew list
- "Add Vendor" button
- Filter by role

### 12. **AI Analyst** (`/app/assistant`)
- Chat interface
- Ask questions about tours
- Create shows via chat
- Requires: GEMINI_API_KEY (optional)

### 13. **Settings** (`/app/settings`)
- Profile: Edit name, email, role
- Subscription: View/upgrade tier
- Account: Logout

---

## 🔄 Common User Paths

### Path 1: New User
```
/signup → /app/onboarding → /app/tours/{id} → Use app
```

### Path 2: Returning User
```
/login → /app/dashboard → Navigate via sidebar
```

### Path 3: Create & Manage Tour
```
/app/tours → Create Tour → /app/tours/{id} → Add Shows → 
/app/tours/{id}/shows/{id} → Edit → Save
```

### Path 4: Export Data
```
/app/tours/{id} → Export menu → CSV/PDF → Download
```

---

## 🎯 Key Features by Page

| Page | Key Actions |
|------|-------------|
| **Signup** | Create account, Debug test |
| **Onboarding** | Select role, Create tour/venue |
| **Dashboard** | View overview, Quick stats |
| **Tours List** | View all tours, Create tour |
| **Tour Detail** | Manage tour, Add shows, Export |
| **Show Detail** | Edit financials, Logistics, Travel |
| **Venues List** | View all venues, Add venue |
| **Venue Detail** | Edit venue info, View history |
| **Vendors** | Manage crew/vendors |
| **AI Analyst** | Chat, Create shows via AI |
| **Settings** | Edit profile, Upgrade tier |

---

## 🛡️ Protection & Redirects

- **Not logged in** → Tries to access `/app/*` → Redirects to `/login`
- **Logged in** → Tries to access `/login` or `/signup` → Redirects to `/app/dashboard`
- **Has tours/venues** → Tries to access `/app/onboarding` → Redirects to `/app/dashboard`
- **No tours/venues** → Logs in → Redirects to `/app/onboarding`

---

**This is your complete journey!** 🎉

