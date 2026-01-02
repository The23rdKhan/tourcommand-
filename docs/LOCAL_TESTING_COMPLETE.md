# Complete Local Testing Guide - TourCommand

## 🎯 Goal: Test Everything Locally Before Production

This guide will help you test all features locally to ensure everything works before deploying.

---

## ✅ Pre-Testing Checklist

Before starting, verify:

- [ ] **Dev server can start**: `npm run dev`
- [ ] **Environment variables set**: `.env.local` exists with Supabase keys
- [ ] **Supabase tables exist**: All 9 tables in Supabase dashboard
- [ ] **Storage bucket exists**: `tour-documents` bucket in Supabase
- [ ] **Browser console open**: Press F12 to monitor errors

---

## 🚀 Step 1: Start Dev Server

```bash
npm run dev
```

**Expected output:**
```
VITE v6.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
```

**Open in browser:** http://localhost:3000

---

## 📋 Step 2: Complete Testing Checklist

### Test 1: Authentication & Signup ✅

**Location:** `http://localhost:3000/#/signup`

**Steps:**
1. Fill in form:
   - First Name: `Test`
   - Last Name: `User`
   - Email: `test-${Date.now()}@example.com` (unique email)
   - Password: `Test1234!` (8+ chars, uppercase, lowercase, number, special)
   - Confirm Password: `Test1234!`
   - ✅ Check "I accept Terms of Service"

2. Click "Create Account"

3. **Expected:**
   - ✅ Redirects to `/app/onboarding`
   - ✅ No errors in console
   - ✅ Toast notification: "Account created! Redirecting to role selection..."

4. **Check Supabase:**
   - Go to Supabase → Table Editor → `user_profiles`
   - Should see new user with `role: null`, `tier: 'Free'`

---

### Test 2: Onboarding Flow ✅

**Location:** `/app/onboarding`

**Test 2A: Artist Role**
1. **Step 1:**
   - Name should be pre-filled: "Test User"
   - Select **Artist** role
   - Click "Continue"

2. **Step 2:**
   - Tour Name: `Summer 2025 Tour`
   - Region: `North America`
   - Currency: `USD`
   - Start Date: Pick a future date
   - Click "Launch Dashboard"

3. **Expected:**
   - ✅ Creates tour
   - ✅ Creates draft show
   - ✅ Redirects to `/app/tours/{tourId}`
   - ✅ Toast: "Tour created! Redirecting..."

**Test 2B: Manager Role** (if you want to test)
- Same as Artist, but select Manager role

**Test 2C: Operator Role** (if you want to test)
- Select Operator
- Venue Name: `The Blue Room`
- City: `Nashville`
- Capacity: `500`
- Should redirect to `/app/venues/{venueId}`

---

### Test 3: Dashboard ✅

**Location:** `/app/dashboard`

**Check:**
- [ ] Dashboard loads without errors
- [ ] Shows your tour/venue data
- [ ] Financial cards display correctly
- [ ] Upcoming shows list (if any)
- [ ] Role-specific content displays
- [ ] No console errors

---

### Test 4: Tour Management ✅

**Location:** `/app/tours`

**4A: Tour List**
- [ ] Your tour appears in list
- [ ] Shows correct tour name, region, show count
- [ ] Click tour → Goes to tour detail

**4B: Tour Detail** (`/app/tours/{tourId}`)
- [ ] Tour info displays correctly
- [ ] Financial summary shows
- [ ] Shows timeline displays
- [ ] "Add Show" button works
- [ ] "Edit Tour Details" button works
- [ ] "Delete Tour" button works (with confirmation)
- [ ] Export menu works (CSV, PDF)

**4C: Edit Tour**
- [ ] Click "Edit Tour Details"
- [ ] Modal opens
- [ ] Update tour name, dates, etc.
- [ ] Save changes
- [ ] Verify updates persist

**4D: Delete Tour**
- [ ] Click delete button
- [ ] Confirmation dialog appears
- [ ] Confirm deletion
- [ ] Tour removed, redirects to tours list

---

### Test 5: Show Management ✅

**Location:** `/app/tours/{tourId}`

**5A: Add Show**
1. Click "Add Show"
2. Fill in:
   - Date: Future date
   - City: `Austin, TX`
   - Venue: `The Continental Club`
   - Status: `Confirmed`
   - Deal Type: `Guarantee`
   - Financials:
     - Guarantee: `5000`
     - Ticket Price: `50`
     - Sold Count: `200`
     - Expenses: Fill in some values
3. Click "Save" or "Add Show"
4. **Expected:**
   - ✅ Show appears in timeline
   - ✅ No errors

**5B: Show Detail** (`/app/tours/{tourId}/shows/{showId}`)
- [ ] Click on show in timeline
- [ ] Show detail page loads
- [ ] All tabs work: Details, Financials, Logistics, Travel, Notes
- [ ] Can edit financials
- [ ] Can add travel items
- [ ] "Save Changes" button works
- [ ] "Delete Show" button works (with confirmation)

**5C: Edit Show**
- [ ] Update guarantee amount
- [ ] Update expenses
- [ ] Add travel item
- [ ] Click "Save Changes"
- [ ] Verify changes persist after refresh

**5D: Delete Show**
- [ ] Click "Delete Show"
- [ ] Confirm deletion
- [ ] Show removed, redirects to tour detail

---

### Test 6: Venue Management ✅

**Location:** `/app/venues`

**6A: Venue List**
- [ ] Venues list displays (if you created any)
- [ ] "Add Venue" button works

**6B: Create Venue**
1. Click "Add Venue"
2. Fill in:
   - Name: `The Ryman Auditorium`
   - City: `Nashville`
   - Capacity: `2000`
   - Contact Name: `John Doe`
   - Contact Email: `john@ryman.com`
3. Save
4. **Expected:**
   - ✅ Venue appears in list
   - ✅ Can click to view details

**6C: Venue Detail** (`/app/venues/{venueId}`)
- [ ] Venue info displays
- [ ] "Edit Venue" button works
- [ ] Edit mode allows updates
- [ ] "Save Changes" works
- [ ] Show history displays (if any shows at this venue)

**6D: Edit Venue**
- [ ] Click "Edit Venue"
- [ ] Update contact info, capacity, notes
- [ ] Save
- [ ] Verify updates persist

---

### Test 7: Vendor Management ✅

**Location:** `/app/vendors`

**7A: Vendor List**
- [ ] Vendors list displays
- [ ] "Add Vendor" button works
- [ ] Filter by role works

**7B: Create Vendor**
1. Click "Add Vendor"
2. Fill in:
   - Name: `Sound Tech Pro`
   - Role: `Sound/Audio`
   - City: `Los Angeles`
   - Contact: `contact@soundtech.com`
3. Save
4. **Expected:**
   - ✅ Vendor appears in list

**7C: Delete Vendor**
- [ ] Click delete on a vendor
- [ ] Confirm deletion
- [ ] Vendor removed

---

### Test 8: Settings ✅

**Location:** `/app/settings`

**8A: Profile Tab**
- [ ] Name field editable
- [ ] Email field editable
- [ ] Role dropdown works
- [ ] "Save Changes" button works
- [ ] Changes persist after refresh

**8B: Role Change**
- [ ] Change role (e.g., Artist → Manager)
- [ ] Click "Save Changes"
- [ ] **Expected:**
   - ✅ Warning modal appears
   - ✅ Shows current → new role
   - ✅ Cancel button works
   - ✅ Confirm button updates role
   - ✅ Toast notification appears
   - ✅ Analytics event tracked

**8C: Billing Tab**
- [ ] Current tier displays
- [ ] Plan options show
- [ ] Upgrade buttons work (may show error if not connected to payment)

---

### Test 9: CSV Export ✅

**Location:** `/app/tours/{tourId}`

**Steps:**
1. Click "Export Report" button
2. Click "CSV Data Export"
3. **Expected:**
   - ✅ CSV file downloads
   - ✅ File contains tour and show data
   - ✅ Can open in Excel/Google Sheets

---

### Test 10: PDF Export ✅ (Pro/Agency Only)

**Location:** `/app/tours/{tourId}`

**Prerequisites:**
- User must have Pro or Agency tier
- Update tier in Supabase: `user_profiles.tier = 'Pro'`

**Steps:**
1. Click "Export Report"
2. Click "PDF Report"
3. **Expected:**
   - ✅ PDF downloads
   - ✅ Contains tour info, financial summary, shows table
   - ✅ Can open in PDF viewer

**If Free Tier:**
- Should show error toast: "PDF export requires Pro subscription"
- Should redirect to settings

---

### Test 11: File Upload ✅

**Location:** `/app/tours/{tourId}` → Notes tab

**Steps:**
1. Go to tour detail page
2. Click "Notes" tab
3. Click file upload area (or drag and drop)
4. Select a file (PDF, DOC, image, etc.)
5. **Expected:**
   - ✅ File uploads
   - ✅ Shows in uploaded files list
   - ✅ Can click to download
   - ✅ File appears in Supabase Storage

**Check Supabase:**
- Go to Storage → `tour-documents` bucket
- Should see uploaded file

---

### Test 12: AI Assistant ✅ (Optional)

**Location:** `/app/assistant`

**Prerequisites:**
- `GEMINI_API_KEY` set in `.env.local`

**Steps:**
1. Go to AI Analyst page
2. Type a message: "Show me my tours"
3. **Expected:**
   - ✅ AI responds
   - ✅ Can ask questions about tours
   - ✅ Can create shows via chat

**If no API key:**
- Should show error or disabled state

---

### Test 13: Data Persistence ✅

**Critical Test:**
1. Create a tour
2. Add a show
3. Update show financials
4. **Refresh the page** (F5)
5. **Expected:**
   - ✅ All data still exists
   - ✅ No data loss
   - ✅ Everything loads correctly

**Check Supabase:**
- Go to Table Editor
- Verify data in `tours` and `shows` tables

---

### Test 14: Error Handling ✅

**Test Error Scenarios:**
1. **Invalid Login:**
   - Try wrong password
   - Should show error message

2. **Network Error:**
   - Disconnect internet
   - Try to save data
   - Should show error toast

3. **Validation Errors:**
   - Try to create tour with empty name
   - Should show validation error

4. **Console Errors:**
   - Check browser console (F12)
   - Should see minimal/no red errors
   - Analytics events (green/blue) are OK

---

### Test 15: Mobile Responsiveness ✅

**Steps:**
1. Open browser DevTools (F12)
2. Toggle device toolbar (Cmd/Ctrl + Shift + M)
3. Test on:
   - iPhone (375px)
   - iPad (768px)
   - Desktop (1920px)

**Check:**
- [ ] Sidebar collapses on mobile
- [ ] Mobile menu works
- [ ] Forms are usable on mobile
- [ ] Buttons are tappable
- [ ] Text is readable

---

## 🐛 Common Issues & Fixes

### Issue: "Cannot connect to Supabase"
**Fix:**
- Check `.env.local` has correct keys
- Verify Supabase project is active
- Check browser console for specific error

### Issue: "Table doesn't exist"
**Fix:**
- Run migrations in Supabase SQL Editor
- Use: `supabase/run-all-migrations-with-004.sql`

### Issue: "RLS policy violation"
**Fix:**
- Verify migrations `003` and `005` ran
- Check user is authenticated
- Verify RLS policies are active

### Issue: "File upload fails"
**Fix:**
- Verify `tour-documents` bucket exists
- Check bucket is set to Public
- Verify storage policies allow uploads

---

## ✅ Testing Summary

After completing all tests, you should have verified:

- [x] Signup works
- [x] Onboarding works
- [x] Tour CRUD works
- [x] Show CRUD works
- [x] Venue CRUD works
- [x] Vendor CRUD works
- [x] Settings updates work
- [x] CSV export works
- [x] PDF export works (if Pro tier)
- [x] File upload works
- [x] Data persists after refresh
- [x] No critical console errors
- [x] Mobile responsive

---

## 🚀 After Local Testing

Once all tests pass:

1. **Fix any bugs found**
2. **Document any issues**
3. **Then proceed to Vercel deployment**

**You're ready to deploy!** 🎉

---

## 📝 Testing Notes

Use this space to note any issues found:

```
Issue 1: [Description]
- Location: [Page/Component]
- Steps to reproduce: [Steps]
- Expected: [What should happen]
- Actual: [What actually happened]

Issue 2: [Description]
...
```

---

**Happy Testing!** 🧪

