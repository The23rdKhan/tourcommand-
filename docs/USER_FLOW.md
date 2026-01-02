# New User Flow - Complete Walkthrough

## Overview
This document details the complete user journey from signup to first use, including when and how role selection works.

---

## Complete Flow

### 1. Sign Up (`/signup`)
**User Actions:**
- Enters **First Name** and **Last Name** (separate fields)
- Enters **Email** (label changed from "Work Email")
- Enters **Password** (min 6 characters)
- Clicks "Create Account"

**What Happens:**
```typescript
1. First + Last name combined → fullName
2. Supabase auth.signUp() creates auth.users record
3. user_profiles record created with:
   - name: fullName
   - email: email
   - role: 'Manager' (⚠️ TEMPORARY - hardcoded)
   - tier: 'Free'
4. Redirects to /app/onboarding
```

**Code:** `components/Auth.tsx` → `handleSignup()`

---

### 2. Onboarding (`/app/onboarding`)

#### Step 1: Profile Setup
**User Actions:**
- Enters their **Name** (full name field)
- Selects **Role** from 3 options:
  - 🎵 **Artist / Musician** - "I want to route tours and track my show profits."
  - 🛡️ **Artist Manager** - "I manage a roster and need financial oversight."
  - 🏢 **Venue Operator / Promoter** - "I manage a venue calendar and book talent."
- Clicks "Continue"

**What Happens:**
- User selects role (stored in local state)
- Moves to Step 2 (different forms based on role)

**Code:** `components/Onboarding.tsx` → Step 1 (lines 191-242)

---

#### Step 2A: Artist/Manager Path
**If role = 'Artist' or 'Manager':**

**User Actions:**
- Enters **Tour Name** (e.g., "Summer 2025 Run")
- Selects **Primary Region** (North America, Europe, UK & Ireland, Australia & NZ)
- Selects **Currency** (USD, EUR, GBP)
- Enters **Approx. Start Date**
- Clicks "Launch Dashboard"

**What Happens:**
```typescript
1. updateUser() → Updates user_profiles with:
   - name: profile.name
   - role: profile.role (Artist or Manager)
   - tier: 'Free'

2. addTour() → Creates tour with:
   - name: tourData.name
   - artist: profile.role === 'Artist' ? profile.name : 'My Roster Artist'
   - startDate: tourData.startDate
   - endDate: startDate + 1 month
   - region: tourData.region
   - currency: tourData.currency

3. addShow() → Creates a draft placeholder show:
   - date: tourData.startDate
   - city: 'TBD City'
   - venue: 'TBD Venue'
   - status: 'Draft'
   - dealType: 'Guarantee'
   - financials: all zeros

4. Navigate to /app/tours/{tourId}
```

**Code:** `components/Onboarding.tsx` → Step 2 Artist/Manager (lines 244-318)

---

#### Step 2B: Operator Path
**If role = 'Operator':**

**User Actions:**
- Enters **Venue Name** (e.g., "The Blue Room")
- Enters **City**
- Enters **Capacity** (number)
- Clicks "Create Venue"

**What Happens:**
```typescript
1. updateUser() → Updates user_profiles with:
   - name: profile.name
   - role: 'Operator'
   - tier: 'Free'

2. addVenue() → Creates venue with:
   - name: venueData.name
   - city: venueData.city
   - capacity: venueData.capacity
   - contactName: profile.name
   - contactEmail: user.email
   - notes: 'Main Venue'

3. Navigate to /app/venues/{venueId}
```

**Code:** `components/Onboarding.tsx` → Step 2 Operator (lines 321-382)

---

## Key Points

### Role Selection Timing
✅ **Role is selected in Onboarding Step 1**, NOT during signup
- Signup creates account with temporary role='Manager'
- Onboarding allows user to choose their actual role
- Role is saved when onboarding completes

### Role-Based Branching
The onboarding flow **branches based on role**:

```
Role Selection (Step 1)
    │
    ├─→ Artist/Manager → Tour Creation Form → Creates Tour + Draft Show
    │
    └─→ Operator → Venue Creation Form → Creates Venue
```

### Final Destination
- **Artist/Manager**: `/app/tours/{tourId}` (tour detail page)
- **Operator**: `/app/venues/{venueId}` (venue detail page)

---

## Current Issue

⚠️ **Role Mismatch During Signup:**
- In `components/Auth.tsx` line 164, role is hardcoded to `'Manager'`
- This is temporary - the actual role is set during onboarding
- The user profile is updated in `handleFinish()` with the correct role

**Recommendation:** Consider not setting a role during signup, or setting it to `null` and requiring onboarding completion.

---

## Database Schema

**user_profiles table:**
```sql
- id (UUID, references auth.users)
- name (TEXT) - Full name from signup
- email (TEXT, UNIQUE)
- role (TEXT) - 'Artist' | 'Manager' | 'Operator'
- tier (TEXT) - 'Free' | 'Pro' | 'Agency'
- created_at, updated_at
```

---

## Flow Diagram

```
Sign Up
  ↓
[First Name, Last Name, Email, Password]
  ↓
Create auth.users + user_profiles (role='Manager' temp)
  ↓
Redirect to /app/onboarding
  ↓
Step 1: Enter Name + Select Role
  ↓
Step 2: Role-Based Form
  ├─ Artist/Manager → Tour Form
  │   ↓
  │   Create Tour + Draft Show
  │   ↓
  │   Navigate to /app/tours/{id}
  │
  └─ Operator → Venue Form
      ↓
      Create Venue
      ↓
      Navigate to /app/venues/{id}
```

---

## Testing Checklist

- [ ] Sign up with first/last name
- [ ] Verify redirect to onboarding
- [ ] Select "Artist" role → Should show tour form
- [ ] Select "Manager" role → Should show tour form
- [ ] Select "Operator" role → Should show venue form
- [ ] Complete Artist onboarding → Should create tour + show
- [ ] Complete Manager onboarding → Should create tour + show
- [ ] Complete Operator onboarding → Should create venue
- [ ] Verify role is saved correctly in user_profiles
- [ ] Verify user can navigate after onboarding

