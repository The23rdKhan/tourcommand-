# Data Collection & Billing Overview

## 📝 Data Collected on Signup Page (`/signup`)

### Form Fields Collected:

1. **First Name** (`firstName`)
   - Required field
   - Trimmed before validation
   - Minimum: 1 character

2. **Last Name** (`lastName`)
   - Required field
   - Trimmed before validation
   - Minimum: 1 character

3. **Email** (`email`)
   - Required field
   - Validated for format
   - Trimmed before submission
   - Checked for duplicates

4. **Password** (`password`)
   - Required field
   - Validation rules:
     - Minimum 8 characters
     - Must contain at least one uppercase letter
     - Must contain at least one lowercase letter
     - Must contain at least one number
     - Must contain at least one special character

5. **Confirm Password** (`confirmPassword`)
   - Required field
   - Must match `password` exactly

6. **Terms of Service** (`acceptedTerms`)
   - Checkbox (required)
   - Must be checked to proceed
   - Links to `/terms` and `/privacy` pages

### Data Stored:

**In `auth.users` table (Supabase Auth):**
- `email` - User email
- `encrypted_password` - Hashed password
- `user_metadata`:
  - `name` - Full name (firstName + lastName)
  - `first_name` - First name
  - `last_name` - Last name

**In `user_profiles` table (via database trigger):**
- `id` - User ID (from auth.users)
- `name` - Full name (firstName + lastName)
- `email` - User email
- `role` - `null` (set during onboarding)
- `tier` - `'Free'` (default)

### Debug Feature:
- 🐛 **Debug Button** (development only)
  - Auto-fills all fields with test data
  - Generates unique email: `test-{timestamp}@example.com`
  - Automatically submits form
  - Useful for testing signup flow

---

## 📋 Data Collected on Onboarding Screen (`/app/onboarding`)

### Step 1: Profile & Role Selection

**Fields Collected:**

1. **Name** (`profile.name`)
   - Pre-filled from user profile (if available)
   - Required field
   - Minimum: 2 characters
   - Trimmed before validation

2. **Role** (`profile.role`)
   - Required selection
   - Options:
     - `'Artist'` - Musician/Performer
     - `'Manager'` - Artist Manager
     - `'Operator'` - Venue Operator/Promoter
   - Default: `'Artist'`

**Data Stored:**
- Updates `user_profiles.role`
- Updates `user_profiles.name` (if changed)

---

### Step 2A: Tour Creation (Artist/Manager Path)

**Fields Collected:**

1. **Tour Name** (`tourData.name`)
   - Required field
   - Minimum: 2 characters
   - Trimmed before validation

2. **Primary Region** (`tourData.region`)
   - Required selection
   - Options:
     - `'North America'`
     - `'Europe'`
     - `'UK & Ireland'`
     - `'Australia & NZ'`
   - Default: `'North America'`

3. **Approx. Start Date** (`tourData.startDate`)
   - Required field
   - Date input
   - Validation: Must be today or in the future
   - Format: `YYYY-MM-DD`

4. **Currency** (`tourData.currency`)
   - Required selection
   - Options:
     - `'USD'` - US Dollar
     - `'EUR'` - Euro
     - `'GBP'` - British Pound
   - Default: `'USD'`

**Data Stored:**
- Creates new record in `tours` table:
  - `name` - Tour name
  - `artist` - Artist name (from profile.name if Artist role, or 'My Roster Artist' if Manager)
  - `startDate` - Start date
  - `endDate` - Calculated (startDate + 1 month)
  - `region` - Selected region
  - `currency` - Selected currency
  - `shows` - Empty array initially

- Creates a draft show in `shows` table:
  - `tourId` - Reference to created tour
  - `date` - Same as tour startDate
  - `city` - `'TBD City'` (placeholder)
  - `venue` - `'TBD Venue'` (placeholder)
  - `status` - `'DRAFT'`
  - `dealType` - `'GUARANTEE'`
  - `financials` - All zeros (placeholder)

**Redirect:** `/app/tours/{tourId}`

---

### Step 2B: Venue Creation (Operator Path)

**Fields Collected:**

1. **Venue Name** (`venueData.name`)
   - Required field
   - Minimum: 2 characters
   - Trimmed before validation

2. **City** (`venueData.city`)
   - Required field
   - Minimum: 2 characters
   - Trimmed before validation

3. **Capacity** (`venueData.capacity`)
   - Required field
   - Number input
   - Validation: Must be > 0
   - Default: 0
   - Handles empty strings and NaN gracefully

**Data Stored:**
- Creates new record in `venues` table:
  - `name` - Venue name
  - `city` - City name
  - `capacity` - Venue capacity
  - `contactName` - From profile.name
  - `contactEmail` - From user.email
  - `notes` - `'Main Venue'` (default)

**Redirect:** `/app/venues/{venueId}`

---

## 💰 Pricing Page

### Location: `/pricing`

**Route:** Public route (no authentication required)

**File:** `components/Marketing.tsx` → `Pricing` component

**Features:**
- Marketing page with pricing tiers
- Accessible from:
  - Landing page navigation
  - Footer links
  - Direct URL: `/pricing`

**Pricing Tiers Displayed:**

1. **Free Plan** - $0/mo
   - 1 Active Tour
   - Basic Routing
   - Day Sheets
   - "Start for Free" button → `/signup`

2. **Pro Plan** - $29/mo (Most Popular)
   - Unlimited Tours
   - Smart Routing Engine
   - Financial Forecasts
   - Vendor Compliance Tools
   - "Get Started" button → `/signup`

3. **Agency Plan** - $99/mo
   - Everything in Pro
   - Multi-User Access
   - API Access
   - White-label Reports
   - "Contact Sales" button → `/signup`

---

## 💳 Billing Page

### Location: `/app/settings` → "Billing" Tab

**Route:** Protected route (requires authentication)

**File:** `components/Settings.tsx` → Billing tab section

**Access:**
1. Navigate to `/app/settings`
2. Click "Billing" tab (second tab)

**Features:**

### Current Plan Card
- Displays current subscription tier
- Shows "Free Plan", "Pro Plan", or "Agency Plan"
- Checkmark icon for paid plans
- "Upgrade to Pro" button (if on Free tier)

### Available Plans Section
- Grid of 3 plan cards:
  - **Free** - $0/mo - "Essentials."
  - **Pro** - $29/mo - "Multi-user access & API." (marked "POPULAR")
  - **Agency** - $99/mo - "Multi-user access & API."
- Current plan highlighted with indigo border
- Click any plan to upgrade
- "Current Plan" button for active plan
- "Select Plan" button for other plans

### Billing History Section
- Currently shows: "No invoices found."
- Placeholder for future invoice display

**Upgrade Flow:**
1. User clicks plan card or "Upgrade" button
2. Calls `upgradeTier(tier)` from `TourContext`
3. Updates `user_profiles.tier` in database
4. Updates `subscriptions` table
5. Analytics event tracked: `subscription_upgraded`

---

## ✅ Free Tier Status

### **Free Tier Already Exists!** ✅

**Evidence:**

1. **Type Definition** (`types.ts`):
   ```typescript
   export type SubscriptionTier = 'Free' | 'Pro' | 'Agency';
   ```

2. **Default Assignment** (`components/Auth.tsx`):
   - New users automatically assigned `tier: 'Free'` on signup

3. **Pricing Page** (`components/Marketing.tsx`):
   - Free plan displayed as first option
   - $0/mo pricing shown

4. **Settings/Billing** (`components/Settings.tsx`):
   - Free tier shown in billing tab
   - Upgrade button available for Free users

5. **Feature Limitations** (`components/TourManager.tsx`):
   - Free tier limited to 1 tour
   - Upgrade prompt shown when trying to create second tour

6. **Database Schema:**
   - `user_profiles.tier` column defaults to `'Free'`
   - `subscriptions` table supports Free tier

**Free Tier Features:**
- ✅ 1 Active Tour maximum
- ✅ Basic Routing
- ✅ Day Sheets
- ✅ All core features (limited by tour count)

**Upgrade Triggers:**
- User tries to create 2nd tour → Upgrade prompt
- User clicks "Upgrade to Pro" in Settings
- User clicks plan card in Billing tab

---

## 📊 Data Collection Summary

### Signup Page → Database

```
User Input:
├─ firstName → auth.users.user_metadata.first_name
├─ lastName → auth.users.user_metadata.last_name
├─ email → auth.users.email
├─ password → auth.users.encrypted_password (hashed)
└─ acceptedTerms → (not stored, just validated)

Auto-Created:
└─ user_profiles:
    ├─ id (from auth.users.id)
    ├─ name (firstName + lastName)
    ├─ email
    ├─ role (null)
    └─ tier ('Free')
```

### Onboarding → Database

```
Step 1:
└─ Updates user_profiles:
    ├─ name
    └─ role

Step 2A (Artist/Manager):
├─ Creates tours record
└─ Creates shows record (draft)

Step 2B (Operator):
└─ Creates venues record
```

---

## 🔗 Quick Links

- **Pricing Page:** `/pricing` (public)
- **Billing/Subscription:** `/app/settings` → Billing tab (protected)
- **Signup:** `/signup` (public)
- **Onboarding:** `/app/onboarding` (protected, first-time only)

---

## 💡 Recommendations

### Current State: ✅ Good
- Free tier is fully implemented
- Data collection is comprehensive
- Pricing page is accessible
- Billing page exists in Settings

### Potential Enhancements:
1. **Billing History:** Currently placeholder - could add invoice display
2. **Payment Integration:** Currently tier changes are manual - could integrate Stripe/Paddle
3. **Trial Period:** Could add 14-day Pro trial for new users
4. **Usage Tracking:** Could show tour count vs. tier limit on dashboard

