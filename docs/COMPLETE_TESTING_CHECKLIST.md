# Complete User Journey Testing Checklist

**Purpose:** Comprehensive testing guide to verify all features work end-to-end  
**Last Updated:** After adding comprehensive site navigation and UI navigation testing sections

---

## 🎯 Testing Overview

This checklist covers **all user journeys** across **all three roles** (Artist, Manager, Operator) to ensure every feature works correctly.

**Estimated Testing Time:** 2-3 hours for complete coverage

---

## 📋 Pre-Testing Setup

### Environment Setup
- [ ] Supabase project configured
- [ ] Environment variables set in `.env.local`
- [ ] Database migrations run
- [ ] Storage bucket `tour-documents` created
- [ ] App running locally (`npm run dev`)
- [ ] Browser console open (to check for errors)

### Test Accounts Needed
- [ ] Free tier account (Artist role)
- [ ] Free tier account (Manager role)
- [ ] Free tier account (Operator role)
- [ ] Pro tier account (for testing Pro features)
- [ ] Test email account (for password reset/verification)

---

## 🔐 Authentication & Account Management

### 1. Public Pages (Unauthenticated)

#### 1.1 Landing Page (`/`)
- [ ] Page loads without errors
- [ ] "Get Started Free" button works → `/signup`
- [ ] "See How It Works" button works → `/features`
- [ ] Navigation links work (Home, Features, Pricing, About, Help)
- [ ] Footer links work (Privacy, Terms)
- [ ] Responsive on mobile/tablet/desktop

#### 1.2 Features Page (`/features`)
- [ ] Page loads
- [ ] All feature sections display correctly
- [ ] Links work
- [ ] Responsive layout

#### 1.3 Pricing Page (`/pricing`)
- [ ] All three tiers display (Free, Pro, Agency)
- [ ] Features listed match actual implementation
- [ ] "Get Started Free" buttons work → `/signup`
- [ ] "Coming Soon" labels on unimplemented features
- [ ] Responsive layout

#### 1.4 About Page (`/about`)
- [ ] Page loads
- [ ] All sections display (Mission, Product Story, Values, Features)
- [ ] CTA buttons work → `/signup` and `/features`
- [ ] Responsive layout

#### 1.5 Help/Support Page (`/help`)
- [ ] Page loads
- [ ] Contact email link works (mailto)
- [ ] FAQ accordion works (click to expand/collapse)
- [ ] All FAQ items can be opened
- [ ] Quick action cards work (Reset Password, View Pricing, View Features)
- [ ] Documentation links work (Features, Pricing, Terms, Privacy)
- [ ] Responsive layout

#### 1.6 Terms of Service (`/terms`)
- [ ] Page loads
- [ ] "I Agree - Create Account" button works → `/signup`
- [ ] "Back to Sign Up" link works → `/signup`

#### 1.7 Privacy Policy (`/privacy`)
- [ ] Page loads
- [ ] "I Understand - Create Account" button works → `/signup`
- [ ] "Back to Sign Up" link works → `/signup`

---

### 2. Sign Up Flow

#### 2.1 Sign Up Page (`/signup`)
- [ ] Form displays all fields (First Name, Last Name, Email, Password, Confirm Password)
- [ ] Terms checkbox is required
- [ ] Links to Terms and Privacy work
- [ ] Password validation works:
  - [ ] Shows error if < 8 characters
  - [ ] Shows error if no uppercase letter
  - [ ] Shows error if no lowercase letter
  - [ ] Shows error if no number
- [ ] Password confirmation validation works (must match)
- [ ] Email validation works (basic format check)
- [ ] Error messages display correctly
- [ ] Success → Redirects to `/app/onboarding`
- [ ] Debug button appears (dev mode only) and works

#### 2.2 Email Verification (`/verify-email`)
- [ ] Page loads after signup (if email not verified)
- [ ] Shows user's email address
- [ ] "Resend Verification Email" button works
- [ ] "Check Again" button works
- [ ] Auto-polling works (checks every 10 seconds)
- [ ] Success state shows when verified
- [ ] Redirects to dashboard after verification
- [ ] "Back to Login" link works

---

### 3. Login Flow

#### 3.1 Login Page (`/login`)
- [ ] Form displays (Email, Password)
- [ ] "Forgot Password?" link works → `/forgot-password`
- [ ] "Sign up" link works → `/signup`
- [ ] Login with valid credentials works
- [ ] Error message shows for invalid credentials
- [ ] Success → Redirects to `/app/dashboard` (or `/app/onboarding` if incomplete)
- [ ] Responsive layout

#### 3.2 Password Reset Flow

**3.2.1 Forgot Password (`/forgot-password`)**
- [ ] Page loads
- [ ] Email input accepts email
- [ ] Email validation works
- [ ] Submit button sends reset email
- [ ] Success message shows
- [ ] "Back to Login" link works
- [ ] "Send another email" button works

**3.2.2 Reset Password (`/reset-password`)**
- [ ] Page loads from email link
- [ ] Token validation works
- [ ] Shows error for invalid/expired token
- [ ] Password fields work (with show/hide toggle)
- [ ] Password validation works (same rules as signup)
- [ ] Password confirmation validation works
- [ ] Submit updates password successfully
- [ ] Success message shows
- [ ] Redirects to `/login` after 2 seconds
- [ ] "Back to Login" link works

---

### 4. Onboarding Flow (`/app/onboarding`)

#### 4.1 Step 1: Role Selection
- [ ] Page loads (first-time users only)
- [ ] Shows three role options (Artist, Manager, Operator)
- [ ] Role descriptions display correctly
- [ ] Can select a role
- [ ] "Continue" button works
- [ ] Email verification banner shows if email not verified
- [ ] Progress indicator shows "Step 1 of 2"

#### 4.2 Step 2A: Artist/Manager - Create Tour
- [ ] Tour creation form displays
- [ ] All fields work (Tour Name, Artist, Start Date, End Date, Region, Manager, Agent, Currency)
- [ ] Date validation works (start date must be today or future)
- [ ] Tour name validation works (min 2 characters)
- [ ] "Create Tour" button works
- [ ] Success → Redirects to tour detail page
- [ ] Error messages display correctly

#### 4.2B: Operator - Create Venue
- [ ] Venue creation form displays
- [ ] All fields work (Venue Name, City, Capacity, Contact Name, Contact Email, Notes)
- [ ] Venue name validation works (min 2 characters)
- [ ] City validation works (min 2 characters)
- [ ] Capacity validation works (must be > 0)
- [ ] "Create Venue" button works
- [ ] Success → Redirects to venue detail page
- [ ] Error messages display correctly

---

## 🏠 Dashboard (`/app/dashboard`)

### 5. Artist Dashboard
- [ ] Page loads
- [ ] Shows welcome message with user's first name
- [ ] Financial cards display:
  - [ ] Tour Revenue (calculated from actual data)
  - [ ] Net Profit (calculated from actual data)
  - [ ] Next Show (or "No upcoming shows" if none)
- [ ] Active Tour section shows:
  - [ ] Tour name and dates
  - [ ] Progress bar (calculated from actual show data)
  - [ ] Show counts (completed/remaining) - calculated, not hardcoded
  - [ ] "Manage Tour" button works → tour detail page
- [ ] Upcoming Shows list displays (max 4 shows)
- [ ] Empty state shows if no tours exist
- [ ] Upgrade prompt shows for Free tier (mentions route cost tracking)
- [ ] Responsive layout

### 6. Manager Dashboard
- [ ] Page loads
- [ ] Shows "Roster Overview" heading
- [ ] Action items count displays (calculated from actual data)
- [ ] Stats cards show:
  - [ ] Total Revenue (Roster) - calculated
  - [ ] Pending Contracts - calculated from HOLD shows
  - [ ] Active Tours - calculated
- [ ] Artist Performance section shows all artists with:
  - [ ] Artist name
  - [ ] Show count
  - [ ] Revenue
- [ ] Urgent Action Items list displays (HOLD shows)
- [ ] Empty state shows if no tours exist
- [ ] Upgrade prompt shows for Free tier
- [ ] Responsive layout

### 7. Operator Dashboard
- [ ] Page loads
- [ ] Shows "Venue & Event Pipeline" heading
- [ ] Stats cards show:
  - [ ] Confirmed Shows - calculated
  - [ ] On Hold - calculated
  - [ ] Draft Shows - calculated
  - [ ] Total Shows - calculated
- [ ] Recent Bookings list displays
- [ ] Venue Utilization chart displays (mock data is fine)
- [ ] Empty state shows if no venues exist
- [ ] Upgrade prompt shows for Free tier
- [ ] Responsive layout

---

## 🎵 Tour Management

### 8. Tours List (`/app/tours`)

#### 8.1 View Tours
- [ ] Page loads
- [ ] Shows all tours in grid layout
- [ ] Each tour card displays:
  - [ ] Tour name
  - [ ] Artist name
  - [ ] Region and year
  - [ ] Show count
- [ ] Clicking tour card → tour detail page
- [ ] Empty state shows if no tours (with "Create Your First Tour" CTA)

#### 8.2 Create Tour (Free Tier - 1 Tour Limit)
- [ ] "Create Tour" button works
- [ ] If Free tier and 1 tour exists:
  - [ ] Upgrade modal appears (not window.confirm)
  - [ ] Modal shows features (unlimited tours, route cost tracking)
  - [ ] "View Plans" button works → `/app/settings`
  - [ ] "Maybe Later" button closes modal
- [ ] If Pro tier or no tours:
  - [ ] Create Tour Wizard opens
  - [ ] Can create tour successfully

#### 8.3 Create Tour Wizard
- [ ] Modal/form opens
- [ ] All fields work (Tour Name, Artist, Dates, Region, Manager, Agent, Currency)
- [ ] Validation works
- [ ] "Create Tour" button works
- [ ] Success → Tour created and redirects to tour detail
- [ ] "Cancel" button closes wizard

---

### 9. Tour Detail (`/app/tours/:tourId`)

#### 9.1 Tour Overview Tab
- [ ] Page loads
- [ ] Tour information displays (name, artist, dates, region, manager, agent, currency)
- [ ] Financial summary shows:
  - [ ] Total Revenue (calculated)
  - [ ] Total Expenses (calculated)
  - [ ] Net Profit (calculated)
- [ ] Show status breakdown shows:
  - [ ] Confirmed count
  - [ ] Hold count
  - [ ] Draft count
- [ ] "Edit Tour Details" button works → opens edit modal
- [ ] "Delete Tour" button works → shows confirmation → deletes tour
- [ ] "Export Report" button works → shows CSV/PDF options

#### 9.2 Edit Tour Details
- [ ] Modal opens
- [ ] All fields pre-filled with current values
- [ ] Can edit all fields
- [ ] "Save Changes" button works
- [ ] Success → Tour updated, modal closes
- [ ] "Cancel" button closes modal without saving

#### 9.3 Delete Tour
- [ ] Delete button shows confirmation dialog
- [ ] "Cancel" closes dialog
- [ ] "Delete" removes tour
- [ ] Success → Redirects to tours list
- [ ] Error handling works

#### 9.4 Export Report
- [ ] Export menu opens
- [ ] CSV export works (all tiers)
- [ ] PDF export works (Pro/Agency tiers only)
- [ ] Free tier shows upgrade prompt for PDF
- [ ] Files download correctly

#### 9.5 Shows Timeline Tab
- [ ] Shows list displays in chronological order
- [ ] Each show shows:
  - [ ] Date
  - [ ] City and venue
  - [ ] Status badge
  - [ ] Financial summary (guarantee, revenue, profit)
- [ ] Clicking show → show detail page
- [ ] "Add Show" button works → opens add show form
- [ ] Drive time warnings show (if > 8 hours)
- [ ] Impossible drive alerts show (if > 14 hours)

#### 9.6 Add Show
- [ ] Form opens
- [ ] All fields work (Date, City, Venue, Status, Financials, Logistics, Travel)
- [ ] Date validation works (must be within tour dates)
- [ ] Financial calculations work (revenue, expenses, profit)
- [ ] "Save Show" button works
- [ ] Success → Show added, form closes, timeline updates
- [ ] Error handling works

#### 9.7 Budget Tab
- [ ] Budget breakdown displays
- [ ] Revenue sources show (guarantees, tickets, merch)
- [ ] Expense categories show
- [ ] Net profit displays
- [ ] Charts/graphs display (if implemented)

#### 9.8 Notes Tab
- [ ] Notes textarea displays
- [ ] Can edit and save notes
- [ ] Tour Documents section shows:
  - [ ] File upload area (drag-and-drop)
  - [ ] List of uploaded files
  - [ ] Download links work
  - [ ] Delete buttons work
- [ ] File upload works (Pro/Agency tiers)
- [ ] Free tier shows upgrade prompt for file uploads

---

### 10. Show Detail (`/app/tours/:tourId/shows/:showId`)

#### 10.1 Details Tab
- [ ] Page loads
- [ ] Show information displays (date, city, venue, status)
- [ ] Can edit all fields
- [ ] "Save Changes" button works
- [ ] Success message shows
- [ ] "Delete Show" button works → shows confirmation → deletes show
- [ ] Breadcrumb navigation works

#### 10.2 Financials Tab
- [ ] Financial form displays
- [ ] All fields work:
  - [ ] Deal Type (Guarantee, Door Split, Versus)
  - [ ] Guarantee amount
  - [ ] Ticket price and sold count
  - [ ] Merch sales
  - [ ] Expense categories
- [ ] Calculations update in real-time:
  - [ ] Total Revenue
  - [ ] Total Expenses
  - [ ] Net Profit
- [ ] "Save Changes" button works

#### 10.3 Merch Tab
- [ ] Merch form displays
- [ ] Can add/edit merch sales
- [ ] "Save Changes" button works

#### 10.4 Logistics Tab
- [ ] Logistics form displays
- [ ] All fields work (load-in time, soundcheck, doors, show time, curfew, notes)
- [ ] "Save Changes" button works

#### 10.5 Travel Tab
- [ ] Travel items list displays
- [ ] "Add Travel Item" button works
- [ ] Can add travel items (type, departure, arrival, notes)
- [ ] Can delete travel items
- [ ] "Save Changes" button works

#### 10.6 Notes Tab
- [ ] Notes textarea displays
- [ ] Can edit and save notes
- [ ] "Save Changes" button works

---

## 🏢 Venue Management

### 11. Venues List (`/app/venues`)

#### 11.1 View Venues
- [ ] Page loads
- [ ] Shows all venues in grid layout
- [ ] Each venue card displays:
  - [ ] Venue name
  - [ ] City
  - [ ] Capacity
  - [ ] Contact email
- [ ] Clicking venue card → venue detail page
- [ ] Empty state shows if no venues (with "Add Your First Venue" CTA)

#### 11.2 Add Venue
- [ ] "Add Venue" button works
- [ ] Form displays with labels:
  - [ ] Venue Name * (required)
  - [ ] City * (required)
  - [ ] Capacity
  - [ ] Contact Email
- [ ] Validation works (name and city required, min 2 chars)
- [ ] "Save Venue" button works
- [ ] Success → Venue added, form closes, list updates
- [ ] "Cancel" button closes form

---

### 12. Venue Detail (`/app/venues/:venueId`)

#### 12.1 View Venue
- [ ] Page loads
- [ ] Venue information displays (name, city, capacity, contact info, notes)
- [ ] Show history list displays (all shows at this venue)
- [ ] Clicking show → show detail page

#### 12.2 Edit Venue
- [ ] "Edit Venue" button works → enters edit mode
- [ ] All fields become editable
- [ ] "Save Changes" button works
- [ ] Success → Venue updated, exits edit mode
- [ ] "Cancel" button exits edit mode without saving

---

## 👥 Vendor Management

### 13. Vendors List (`/app/vendors`)

#### 13.1 View Vendors
- [ ] Page loads
- [ ] Shows all vendors in grid layout
- [ ] Search bar works (filters by name, role, city)
- [ ] Each vendor card displays:
  - [ ] Vendor name
  - [ ] Role icon and color
  - [ ] City
  - [ ] Contact information
  - [ ] Permit badge (if required)
- [ ] Empty state shows if no vendors (with "Add Your First Vendor" CTA)
- [ ] "No vendors found" message shows if search has no results

#### 13.2 Add Vendor
- [ ] "Onboard Vendor" button works → opens modal
- [ ] Modal form displays:
  - [ ] Company/Entity Name (required)
  - [ ] Role/Type dropdown
  - [ ] Base City
  - [ ] Point of Contact (name, email, phone)
  - [ ] Compliance checkbox (requires permits)
- [ ] Validation works (name required)
- [ ] "Complete Onboarding" button works
- [ ] Success → Vendor added, modal closes, list updates
- [ ] "Cancel" button closes modal

#### 13.3 Delete Vendor
- [ ] Delete button (trash icon) works
- [ ] Vendor removed from list
- [ ] Success message shows

---

## ⚙️ Settings (`/app/settings`)

### 14. Profile Tab
- [ ] Page loads
- [ ] User information displays (name, email, role, tier)
- [ ] Can edit name
- [ ] Can edit email
- [ ] Role dropdown works (can change role)
- [ ] Role change warning modal appears:
  - [ ] Shows warning message
  - [ ] "Confirm Change" button works
  - [ ] "Cancel" button reverts role
- [ ] "Save Changes" button works (only enabled when changes made)
- [ ] Success message shows
- [ ] Analytics events tracked

### 15. Subscription Tab
- [ ] Current tier displays
- [ ] Feature comparison shows
- [ ] "Upgrade to Pro" button works (if Free tier)
- [ ] Upgrade flow works (if payment integrated)
- [ ] Tier limits display correctly

### 16. Integrations Tab
- [ ] Page loads
- [ ] All integrations show "Coming Soon" badge
- [ ] No "Connect" buttons are functional
- [ ] Support email link works
- [ ] Message about requesting integrations displays

---

## 🤖 AI Assistant (`/app/assistant`)

### 17. AI Chat Interface
- [ ] Page loads
- [ ] Chat interface displays
- [ ] Initial message shows
- [ ] Can type and send messages
- [ ] AI responses display
- [ ] "Create show" tool calls work:
  - [ ] Can say "Add a show in Las Vegas on Oct 20th"
  - [ ] AI creates show successfully
  - [ ] Success message shows
- [ ] "Analyze profit" queries work
- [ ] Loading states display
- [ ] Error handling works (if API key not set)

---

## 🔄 Role-Specific Testing

### 18. Test as Artist Role
- [ ] Sign up as Artist
- [ ] Complete onboarding (create tour)
- [ ] Dashboard shows Artist view
- [ ] Can create 1 tour (Free tier limit)
- [ ] Upgrade prompt shows when trying to create second tour
- [ ] Can manage tours and shows
- [ ] Can view venues and vendors

### 19. Test as Manager Role
- [ ] Sign up as Manager
- [ ] Complete onboarding (create tour)
- [ ] Dashboard shows Manager view (Roster Overview)
- [ ] Can create multiple tours (if Pro tier)
- [ ] Can see artist performance stats
- [ ] Can see urgent action items
- [ ] Can manage tours across multiple artists

### 20. Test as Operator Role
- [ ] Sign up as Operator
- [ ] Complete onboarding (create venue)
- [ ] Dashboard shows Operator view (Venue Pipeline)
- [ ] Can create venues
- [ ] Can see venue utilization
- [ ] Can see booking pipeline
- [ ] Can manage venues and shows

---

## 🎨 UI/UX Testing

### 21. Responsive Design
- [ ] Test on mobile (375px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1920px width)
- [ ] Sidebar collapses on mobile
- [ ] Mobile menu works
- [ ] All forms are usable on mobile
- [ ] Tables/cards stack properly on mobile

### 22. Site Navigation (Public Pages)

#### 22.1 Marketing Header Navigation
- [ ] Header displays on all public pages (Home, Features, Pricing, About, Help)
- [ ] Logo (TourCommand) is visible and clickable
- [ ] Logo click → redirects to `/` (home page)
- [ ] Desktop navigation links display (Home, Features, Pricing, About, Help)
- [ ] All header links work:
  - [ ] "Home" → `/`
  - [ ] "Features" → `/features`
  - [ ] "Pricing" → `/pricing`
  - [ ] "About" → `/about`
  - [ ] "Help" → `/help`
- [ ] "Log in" link works → `/login`
- [ ] "Sign up" button works → `/signup`
- [ ] Header is sticky (stays at top when scrolling)
- [ ] Header has backdrop blur effect
- [ ] Hover states work on all links
- [ ] Mobile menu works (if implemented)

#### 22.2 Marketing Footer Navigation
- [ ] Footer displays on all public pages
- [ ] Footer logo (TourCommand) is visible
- [ ] Footer navigation links work:
  - [ ] "Home" → `/`
  - [ ] "Features" → `/features`
  - [ ] "Pricing" → `/pricing`
  - [ ] "About" → `/about`
  - [ ] "Help" → `/help`
  - [ ] "Login" → `/login`
  - [ ] "Get Started" → `/signup`
- [ ] Footer legal links work:
  - [ ] "Privacy Policy" → `/privacy`
  - [ ] "Terms of Service" → `/terms`
- [ ] Copyright year displays correctly
- [ ] Hover states work on all footer links
- [ ] Footer is responsive (stacks on mobile)

#### 22.3 Public Page Internal Links
- [ ] Landing page (`/`) links work:
  - [ ] "Get Started Free" button → `/signup`
  - [ ] "See How It Works" button → `/features`
  - [ ] All CTA buttons work
- [ ] Features page (`/features`) links work:
  - [ ] All internal navigation links
  - [ ] CTA buttons → `/signup`
- [ ] Pricing page (`/pricing`) links work:
  - [ ] All "Get Started" buttons → `/signup`
  - [ ] All "Get Started Free" buttons → `/signup`
- [ ] About page (`/about`) links work:
  - [ ] CTA buttons → `/signup` and `/features`
- [ ] Help page (`/help`) links work:
  - [ ] "Reset Password" → `/forgot-password`
  - [ ] "View Pricing" → `/pricing`
  - [ ] "View Features" → `/features`
  - [ ] Documentation links work
- [ ] Terms page (`/terms`) links work:
  - [ ] "I Agree - Create Account" → `/signup`
  - [ ] "Back to Sign Up" → `/signup`
- [ ] Privacy page (`/privacy`) links work:
  - [ ] "I Understand - Create Account" → `/signup`
  - [ ] "Back to Sign Up" → `/signup`

---

### 23. UI Navigation (App Pages)

#### 23.1 Sidebar Navigation
- [ ] Sidebar displays on all protected routes (`/app/*`)
- [ ] Sidebar is fixed on left side (desktop)
- [ ] Sidebar has TourCommand logo at top
- [ ] All sidebar links work:
  - [ ] "Overview" → `/app/dashboard`
  - [ ] "Tours" → `/app/tours`
  - [ ] "Venues" → `/app/venues`
  - [ ] "Crew & Vendors" → `/app/vendors`
  - [ ] "AI Analyst" → `/app/assistant`
  - [ ] "Settings" → `/app/settings`
- [ ] Active route highlights correctly:
  - [ ] Active link has indigo background (`bg-indigo-600`)
  - [ ] Active link text is white
  - [ ] Active link has shadow effect
  - [ ] Inactive links are gray (`text-slate-400`)
- [ ] Hover states work on sidebar links
- [ ] Icons display correctly for each link
- [ ] User profile card displays at bottom of sidebar:
  - [ ] User name displays
  - [ ] User email displays
  - [ ] User tier displays (Free/Pro/Agency)
- [ ] Logout button works (in sidebar or profile card)
- [ ] Sidebar collapses on mobile (hidden by default)
- [ ] Mobile menu toggle works (hamburger button)

#### 23.2 Breadcrumb Navigation
- [ ] Breadcrumbs display on detail pages:
  - [ ] Tour detail page (`/app/tours/:tourId`)
  - [ ] Show detail page (`/app/tours/:tourId/shows/:showId`)
  - [ ] Venue detail page (`/app/venues/:venueId`)
- [ ] Breadcrumb format: Home → Tours → Tour Name → Show Name
- [ ] Home icon (🏠) links to `/app/dashboard`
- [ ] All breadcrumb links are clickable
- [ ] Current page is not a link (just text)
- [ ] Chevron separators (›) display between items
- [ ] Hover states work on breadcrumb links
- [ ] Breadcrumbs are responsive (wrap on mobile if needed)

#### 23.3 Page Header Navigation
- [ ] Page titles display correctly on all pages
- [ ] Back buttons work (where applicable):
  - [ ] Show detail → Tour detail
  - [ ] Venue detail → Venues list
- [ ] Action buttons in headers work:
  - [ ] "Create Tour" button → Opens create modal
  - [ ] "Add Show" button → Opens add show form
  - [ ] "Add Venue" button → Opens add venue form
  - [ ] "Onboard Vendor" button → Opens vendor modal
- [ ] Edit buttons work:
  - [ ] "Edit Tour Details" → Opens edit modal
  - [ ] "Edit Venue" → Enters edit mode
- [ ] Delete buttons work (with confirmation):
  - [ ] "Delete Tour" → Shows confirmation → Deletes
  - [ ] "Delete Show" → Shows confirmation → Deletes
- [ ] Export buttons work:
  - [ ] "Export Report" → Shows CSV/PDF options
  - [ ] CSV export → Downloads file
  - [ ] PDF export → Downloads file (Pro/Agency)

#### 23.4 In-Page Navigation Links
- [ ] Tour cards link to tour detail pages
- [ ] Show items in timeline link to show detail pages
- [ ] Venue cards link to venue detail pages
- [ ] Vendor cards are clickable (if detail pages exist)
- [ ] "Manage Tour" buttons → Tour detail page
- [ ] "View Tour" links → Tour detail page
- [ ] Tab navigation works (where applicable):
  - [ ] Tour detail tabs (Overview, Shows Timeline, Budget, Notes)
  - [ ] Show detail tabs (Details, Financials, Merch, Logistics, Travel, Notes)
  - [ ] Settings tabs (Profile, Subscription, Integrations)
- [ ] Active tab highlights correctly
- [ ] Tab content switches correctly

#### 23.5 Modal & Form Navigation
- [ ] Modal close buttons work (X button)
- [ ] "Cancel" buttons close modals/forms
- [ ] "Save" buttons submit and close modals
- [ ] Clicking outside modal closes it (if implemented)
- [ ] ESC key closes modals (if implemented)
- [ ] Form navigation works:
  - [ ] Multi-step forms progress correctly
  - [ ] "Back" buttons work in multi-step forms
  - [ ] "Continue" buttons work in multi-step forms
  - [ ] "Finish" buttons complete forms

---

### 24. Mobile Navigation

#### 24.1 Mobile Menu
- [ ] Mobile menu button (hamburger) displays on mobile
- [ ] Mobile menu opens when button clicked
- [ ] Mobile menu closes when:
  - [ ] Close button clicked
  - [ ] Link clicked
  - [ ] Outside menu clicked (if implemented)
- [ ] All sidebar links work in mobile menu
- [ ] Mobile menu overlays content correctly
- [ ] Mobile menu has smooth animations
- [ ] User profile card displays in mobile menu
- [ ] Logout button works in mobile menu

#### 24.2 Mobile Header
- [ ] Mobile header displays on mobile devices
- [ ] Logo displays in mobile header
- [ ] Mobile menu toggle button displays
- [ ] Header is sticky on mobile
- [ ] Header doesn't overlap content

#### 24.3 Mobile Footer
- [ ] Footer displays on mobile
- [ ] Footer links stack vertically on mobile
- [ ] Footer links are large enough for touch (44px minimum)
- [ ] Footer is readable on mobile

---

### 25. Navigation State & Active Routes

#### 25.1 Active Route Highlighting
- [ ] Sidebar highlights correct route:
  - [ ] `/app/dashboard` → "Overview" highlighted
  - [ ] `/app/tours` → "Tours" highlighted
  - [ ] `/app/tours/:tourId` → "Tours" highlighted (parent route)
  - [ ] `/app/venues` → "Venues" highlighted
  - [ ] `/app/vendors` → "Crew & Vendors" highlighted
  - [ ] `/app/assistant` → "AI Analyst" highlighted
  - [ ] `/app/settings` → "Settings" highlighted
- [ ] Active route styling is consistent:
  - [ ] Background color: `bg-indigo-600`
  - [ ] Text color: white
  - [ ] Shadow effect present
- [ ] Only one route highlighted at a time
- [ ] Highlight persists after page refresh

#### 25.2 Route Matching
- [ ] Parent routes highlight when on child routes:
  - [ ] `/app/tours/:tourId` → "Tours" highlighted
  - [ ] `/app/tours/:tourId/shows/:showId` → "Tours" highlighted
  - [ ] `/app/venues/:venueId` → "Venues" highlighted
- [ ] Exact route matching works for dashboard
- [ ] Route parameters don't break highlighting

---

### 26. Navigation Flows & Redirects

#### 26.1 Authentication Redirects
- [ ] Unauthenticated users redirected to `/login` from protected routes
- [ ] After login → redirects to `/app/dashboard` (or `/app/onboarding` if incomplete)
- [ ] After signup → redirects to `/app/onboarding`
- [ ] After logout → redirects to `/` (home page)
- [ ] Authenticated users redirected away from `/login` and `/signup` to `/app/dashboard`

#### 26.2 Onboarding Redirects
- [ ] New users redirected to `/app/onboarding` after signup
- [ ] Users with incomplete onboarding redirected to `/app/onboarding`
- [ ] After onboarding completion → redirects to tour/venue detail page
- [ ] Users with completed onboarding can't access `/app/onboarding`

#### 26.3 Post-Action Redirects
- [ ] After creating tour → redirects to tour detail page
- [ ] After creating show → stays on tour detail page (or redirects to show detail)
- [ ] After creating venue → redirects to venue detail page
- [ ] After deleting tour → redirects to tours list
- [ ] After deleting show → redirects to tour detail page
- [ ] After password reset → redirects to `/login`
- [ ] After email verification → redirects to `/app/dashboard`

#### 26.4 Error & 404 Handling
- [ ] Invalid routes show 404 page (`/app/invalid-route`)
- [ ] 404 page has navigation options:
  - [ ] "Go to Dashboard" → `/app/dashboard`
  - [ ] "Go to Home" → `/`
- [ ] 404 page displays on public routes too (`/invalid-page`)
- [ ] Error pages don't break navigation

---

### 27. Navigation Performance & UX

#### 27.1 Navigation Speed
- [ ] Page transitions are fast (< 200ms)
- [ ] No loading delays when clicking links
- [ ] Smooth animations on route changes
- [ ] No flickering during navigation

#### 27.2 Navigation Feedback
- [ ] Loading states show during navigation (if needed)
- [ ] Active link provides visual feedback
- [ ] Hover states provide visual feedback
- [ ] Clicked links show immediate response

#### 27.3 Browser Navigation
- [ ] Browser back button works correctly
- [ ] Browser forward button works correctly
- [ ] Browser history is maintained
- [ ] URL updates correctly on navigation
- [ ] Direct URL access works (e.g., `/app/tours/123`)
- [ ] Page refresh maintains current route

#### 27.4 Keyboard Navigation
- [ ] Tab key navigates through links
- [ ] Enter key activates focused links
- [ ] Focus indicators are visible
- [ ] Keyboard navigation works in sidebar
- [ ] Keyboard navigation works in modals
- [ ] ESC key closes modals (if implemented)

---

### 28. Navigation Accessibility

#### 28.1 ARIA Labels
- [ ] Navigation links have proper ARIA labels
- [ ] Active links have `aria-current="page"`
- [ ] Mobile menu button has `aria-label`
- [ ] Breadcrumbs have proper `aria-label`

#### 28.2 Screen Reader Support
- [ ] Screen readers announce active route
- [ ] Screen readers announce navigation changes
- [ ] Navigation structure is logical for screen readers
- [ ] Skip links work (if implemented)

#### 28.3 Focus Management
- [ ] Focus moves to main content after navigation
- [ ] Focus is trapped in modals
- [ ] Focus returns after closing modals
- [ ] Focus indicators are visible and clear

### 23. Error Handling
- [ ] Network errors show user-friendly messages
- [ ] Validation errors display correctly
- [ ] 404 page shows for invalid routes
- [ ] Error boundary catches React errors
- [ ] Console shows no unhandled errors

### 24. Loading States
- [ ] Loading spinners show during async operations
- [ ] Buttons disable during submission
- [ ] Forms show loading states
- [ ] No flickering or layout shifts

---

## 🔒 Security & Data Testing

### 29. Authentication
- [ ] Protected routes redirect to login if not authenticated
- [ ] Can't access `/app/*` without login
- [ ] Session persists after page refresh
- [ ] Logout clears session
- [ ] Multiple tabs stay in sync

### 30. Data Persistence
- [ ] Create tour → refresh page → tour still exists
- [ ] Create show → refresh page → show still exists
- [ ] Edit data → refresh page → changes persist
- [ ] Delete data → refresh page → data removed

### 31. Row Level Security (RLS)
- [ ] Users can only see their own data
- [ ] Users can't access other users' tours
- [ ] Users can't modify other users' data
- [ ] API endpoints verify ownership

---

## 📊 Export & File Features

### 32. CSV Export
- [ ] CSV export works from tour detail page
- [ ] File downloads correctly
- [ ] Data is accurate
- [ ] All shows included
- [ ] Financial data included

### 33. PDF Export (Pro/Agency Only)
- [ ] PDF export button shows for Pro/Agency users
- [ ] PDF generates successfully
- [ ] Financial summary included
- [ ] Shows table included
- [ ] Free tier shows upgrade prompt

### 34. File Uploads (Pro/Agency Only)
- [ ] File upload area works
- [ ] Drag-and-drop works
- [ ] Files upload to Supabase Storage
- [ ] Uploaded files list displays
- [ ] Download links work
- [ ] Delete buttons work
- [ ] Free tier shows upgrade prompt

---

## 🧪 Edge Cases & Error Scenarios

### 35. Empty States
- [ ] No tours → empty state shows
- [ ] No venues → empty state shows
- [ ] No vendors → empty state shows
- [ ] No shows in tour → appropriate message shows

### 36. Validation Edge Cases
- [ ] Very long text inputs handled
- [ ] Special characters in inputs handled
- [ ] Negative numbers prevented (where applicable)
- [ ] Date ranges validated correctly
- [ ] Required fields enforced

### 37. Network Issues
- [ ] Offline mode handled gracefully
- [ ] Slow network shows loading states
- [ ] Failed requests show error messages
- [ ] Retry mechanisms work (where applicable)

### 38. Browser Compatibility
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge
- [ ] Mobile browsers work

---

## 📱 Mobile-Specific Testing

### 39. Mobile Forms
- [ ] Mobile menu opens/closes
- [ ] Sidebar hidden on mobile
- [ ] Touch targets are large enough (44px minimum)
- [ ] Swipe gestures work (if implemented)

### 40. Mobile Forms
- [ ] Forms are usable on mobile
- [ ] Date pickers work on mobile
- [ ] Dropdowns work on mobile
- [ ] File uploads work on mobile

---

## 🎯 Tier-Specific Features

### 41. Free Tier Limits
- [ ] Can create 1 tour (limit enforced)
- [ ] Upgrade prompt shows when limit reached
- [ ] CSV export works
- [ ] PDF export shows upgrade prompt
- [ ] File uploads show upgrade prompt

### 42. Pro Tier Features
- [ ] Unlimited tours
- [ ] PDF export works
- [ ] File uploads work
- [ ] Route cost tracking available
- [ ] Shareable tour links work

### 43. Agency Tier Features
- [ ] All Pro features work
- [ ] Additional features (if any) work

---

## 🔍 Performance Testing

### 44. Page Load Times
- [ ] Dashboard loads < 2 seconds
- [ ] Tour list loads < 1 second
- [ ] Tour detail loads < 1 second
- [ ] No unnecessary re-renders

### 45. Data Loading
- [ ] Large tour lists load efficiently
- [ ] Many shows don't cause lag
- [ ] Images load with lazy loading (if applicable)

---

## ✅ Final Verification

### 46. Browser Console
- [ ] No JavaScript errors
- [ ] No unhandled promise rejections
- [ ] No network errors (except expected 404s)
- [ ] Analytics events fire correctly

### 47. Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader compatible (basic check)
- [ ] Color contrast is sufficient
- [ ] Focus indicators visible

### 48. Cross-Browser
- [ ] Chrome: All features work
- [ ] Firefox: All features work
- [ ] Safari: All features work
- [ ] Edge: All features work

---

## 📝 Testing Notes Template

For each test, note:
- **Date:** 
- **Browser:** 
- **Role:** (Artist/Manager/Operator)
- **Tier:** (Free/Pro/Agency)
- **Result:** ✅ Pass / ❌ Fail / ⚠️ Partial
- **Issues Found:** 
- **Screenshots:** (if issues found)

---

## 🎯 Quick Test Path (30 minutes)

If you need a quick test, focus on these critical paths:

1. **Sign Up → Onboarding → Dashboard** (5 mins)
2. **Create Tour → Add Show → View Show** (5 mins)
3. **Edit Show Financials → Save** (3 mins)
4. **Export CSV** (2 mins)
5. **Password Reset Flow** (5 mins)
6. **Email Verification** (3 mins)
7. **Settings → Change Role** (3 mins)
8. **Delete Tour** (2 mins)
9. **Mobile Responsive Check** (2 mins)

**Total: ~30 minutes for critical path testing**

---

## 🚨 Critical Issues to Watch For

1. **Data not persisting** after refresh
2. **Authentication not working** (can't login/signup)
3. **RLS violations** (users seeing other users' data)
4. **Memory leaks** (check browser memory usage)
5. **Navigation errors** (wrong redirects)
6. **Form validation not working**
7. **Export features not working**
8. **Tier limits not enforced**

---

## 📊 Test Results Summary

After testing, document:
- **Total Tests:** 
- **Passed:** 
- **Failed:** 
- **Blocked:** 
- **Critical Issues:** 
- **Minor Issues:** 

---

**Good luck with testing!** 🧪✨

