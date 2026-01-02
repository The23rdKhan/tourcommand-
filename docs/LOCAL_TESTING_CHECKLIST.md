# Local Testing Checklist

## Pre-Testing Setup

- [ ] Dev server is running: `npm run dev`
- [ ] Environment variables are set in `.env.local`
- [ ] Database migrations have been run in Supabase
- [ ] Browser console is open (F12) to catch errors

---

## 1. Authentication Flow Testing

### Sign Up
- [ ] Go to `http://localhost:3000/#/signup`
- [ ] Fill in **First Name** and **Last Name** (separate fields)
- [ ] Enter **Email** (not "Work Email")
- [ ] Enter **Password** (min 8 characters, must include uppercase, lowercase, and number)
- [ ] Click "Create Account"
- [ ] Verify redirect to `/app/onboarding`
- [ ] Check browser console for errors

### Onboarding - Role Selection
- [ ] **NEW**: User with existing tours tries to access /onboarding → Should redirect to dashboard
- [ ] **NEW**: User with existing venues tries to access /onboarding → Should redirect to dashboard
- [ ] Enter your name in onboarding Step 1
- [ ] Select **Artist** role → Verify tour form appears in Step 2
- [ ] Go back, select **Manager** role → Verify tour form appears
- [ ] Go back, select **Operator** role → Verify venue form appears
- [ ] Complete onboarding with **Artist** role
- [ ] Verify redirect to tour detail page
- [ ] **NEW**: Try to access /onboarding again → Should redirect to dashboard

### Login
- [ ] Logout (if logged in)
- [ ] Go to `http://localhost:3000/#/login`
- [ ] Try to submit with empty email → Should show error
- [ ] Try to submit with empty password → Should show error
- [ ] **NEW**: Verify no hardcoded credentials work (should require actual input)
- [ ] Enter email and password
- [ ] Click "Sign In"
- [ ] Verify redirect to `/app/dashboard`
- [ ] Check that user data loads correctly
- [ ] **NEW**: Try to access /login while logged in → Should redirect

---

## 2. Role Update Feature (New!)

### Settings - Role Change
- [ ] Go to `/app/settings`
- [ ] Click on **Profile** tab
- [ ] Change role dropdown (e.g., Artist → Manager)
- [ ] Click "Save Changes"
- [ ] **Verify warning modal appears** with:
  - Warning icon
  - Current role → New role display
  - Cancel and Confirm buttons
- [ ] Click **Cancel** → Verify role reverts, modal closes
- [ ] Change role again, click **Confirm**
- [ ] Verify role updates successfully
- [ ] Verify toast notification appears
- [ ] Refresh page → Verify role persists
- [ ] Check browser console for analytics event: `role_changed`

### Profile Updates (Name/Email)
- [ ] Change name in Settings
- [ ] Change email in Settings
- [ ] Click "Save Changes" (without role change)
- [ ] Verify updates save without modal
- [ ] Verify toast notification appears

---

## 3. Tour Management

### Create Tour
- [ ] Go to `/app/tours` or create from onboarding
- [ ] Click "Create Tour" (if available)
- [ ] Fill in tour details:
  - Tour name
  - Artist name
  - Start date
  - End date
  - Region
- [ ] Save tour
- [ ] Verify tour appears in list
- [ ] Click on tour → Verify tour detail page loads

### Add Show
- [ ] From tour detail page, click "Add Show"
- [ ] Fill in show details:
  - Date
  - City
  - Venue
  - Status
  - Deal type
  - Financials (guarantee, ticket price, etc.)
- [ ] Save show
- [ ] Verify show appears in tour's show list
- [ ] Click on show → Verify show detail page loads

### Edit Show
- [ ] From show detail page, edit financials
- [ ] Update ticket price or guarantee
- [ ] Save changes
- [ ] Verify changes persist
- [ ] Refresh page → Verify data still there

### Delete Show
- [ ] Delete a test show
- [ ] Verify it's removed from tour
- [ ] Verify it's removed from database

---

## 4. Venue Management

### Create Venue
- [ ] Go to `/app/venues`
- [ ] Click "Add Venue" or create from onboarding (if Operator)
- [ ] Fill in:
  - Venue name
  - City
  - Capacity
  - Contact info (optional)
- [ ] Save venue
- [ ] Verify venue appears in list

### Edit Venue
- [ ] Click on a venue
- [ ] Update capacity or contact info
- [ ] Save changes
- [ ] Verify updates persist

---

## 5. Vendor Management

### Create Vendor
- [ ] Go to `/app/vendors`
- [ ] Click "Onboard New Vendor"
- [ ] Fill in vendor details:
  - Company name
  - Role (Security, Sound/Audio, etc.)
  - City
  - Point of contact info
- [ ] Save vendor
- [ ] Verify vendor appears in list

---

## 6. Dashboard

### Dashboard Display
- [ ] Go to `/app/dashboard`
- [ ] Verify role-specific content appears:
  - **Artist/Manager**: Tour summaries, financial cards
  - **Operator**: Venue-related content
- [ ] Check for upcoming shows
- [ ] Verify financial summaries display correctly
- [ ] Check for any upsell messages (Free tier)

---

## 7. Data Persistence

### Refresh Test
- [ ] Create a tour with shows
- [ ] Add venues and vendors
- [ ] **Refresh the page** (F5 or Cmd+R)
- [ ] Verify all data is still there
- [ ] Verify you're still logged in

### Logout/Login Test
- [ ] Logout
- [ ] Login again
- [ ] Verify all your data loads:
  - Tours
  - Shows
  - Venues
  - Vendors
- [ ] Verify role is correct

---

## 8. CSV Export

### Export Tour Data
- [ ] Go to a tour detail page
- [ ] Click "Export CSV" or export button
- [ ] Verify CSV file downloads
- [ ] Open CSV file
- [ ] Verify data is correct:
  - Show dates
  - Financials
  - Venue names
  - Cities

---

## 9. AI Assistant (If GEMINI_API_KEY is set)

### Assistant Chat
- [ ] Go to `/app/assistant`
- [ ] Type a message (e.g., "Help me plan a tour")
- [ ] Verify response appears
- [ ] Check browser console for API calls
- [ ] Verify no errors in console

---

## 10. Error Handling

### Invalid Inputs
- [ ] Try to create tour with empty name → Verify validation error
- [ ] Try to create show with invalid date → Verify error
- [ ] Try to save profile with invalid email → Verify error

### Network Errors
- [ ] Disconnect internet
- [ ] Try to save a tour
- [ ] Verify error message appears
- [ ] Reconnect internet
- [ ] Verify app recovers

---

## 11. Role-Specific Features

### Artist Role
- [ ] Verify dashboard shows tour-focused content
- [ ] Verify can create tours
- [ ] Check upsell messages mention "Smart Routing"

### Manager Role
- [ ] Verify dashboard shows roster management content
- [ ] Verify can create tours
- [ ] Check upsell messages mention "Team Roles"

### Operator Role
- [ ] Verify dashboard shows venue-focused content
- [ ] Verify can create venues
- [ ] Check upsell messages mention "Bulk Tools"

---

## 12. Browser Console Checks

### No Errors
- [ ] Open browser console (F12)
- [ ] Navigate through app
- [ ] Verify **no red errors** appear
- [ ] Check for any warnings (yellow)
- [ ] Verify network requests succeed (200 status)

### Analytics Events
- [ ] Check console for analytics events:
  - `role_changed` (when changing role)
  - `profile_updated` (when updating profile)
  - `settings_tab_changed` (when switching tabs)

---

## 13. Mobile Responsiveness

### Mobile View
- [ ] Open browser DevTools (F12)
- [ ] Toggle device toolbar (mobile view)
- [ ] Test on mobile sizes:
  - iPhone SE (375px)
  - iPhone 12 Pro (390px)
  - iPad (768px)
- [ ] Verify:
  - Sidebar collapses on mobile
  - Forms are usable
  - Buttons are tappable
  - Text is readable

---

## 14. Performance

### Load Times
- [ ] Check initial page load < 3 seconds
- [ ] Check navigation between pages is smooth
- [ ] Verify no long loading spinners
- [ ] Check data loads quickly after login

---

## Issues to Report

If you find any issues, note:
- **What you were doing** (step-by-step)
- **What happened** (actual behavior)
- **What you expected** (expected behavior)
- **Browser console errors** (copy/paste)
- **Screenshot** (if visual issue)

---

## Quick Test Script

Run this quick test sequence:

```bash
1. Sign up → Onboarding → Create tour
2. Add a show to the tour
3. Create a venue
4. Create a vendor
5. Change role in Settings (test warning modal)
6. Refresh page → Verify everything persists
7. Logout → Login → Verify data loads
8. Export CSV from tour
```

---

## Success Criteria

✅ **All tests pass** = Ready for production deployment
🟡 **Minor issues** = Fix before deployment
🔴 **Critical issues** = Must fix before deployment

---

## Next Steps After Testing

Once all tests pass:
1. Fix any bugs found
2. Commit fixes to git
3. Deploy to Vercel
4. Test production URL
5. Launch! 🚀

