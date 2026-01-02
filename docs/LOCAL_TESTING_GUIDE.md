# Local Testing Guide

## Quick Start

### 1. Start the Dev Server

```bash
npm run dev
```

You should see:
```
VITE v6.4.1  ready in 841 ms
➜  Local:   http://localhost:3000/
```

### 2. Open in Browser

Go to: **http://localhost:3000/**

---

## Step-by-Step Testing

### Test 1: Sign Up Flow

1. **Go to Sign Up Page**
   - Click "Sign Up" or navigate to `http://localhost:3000/#/signup`

2. **Fill the Form**
   - **First Name**: Enter your first name
   - **Last Name**: Enter your last name
   - **Email**: Enter a test email (e.g., `test@example.com`)
   - **Password**: Enter a password (min 6 characters)

3. **Submit**
   - Click "Create Account"
   - ✅ Should redirect to `/app/onboarding`

4. **Check Browser Console** (F12 → Console tab)
   - Should see no red errors
   - May see analytics events (green/blue messages are OK)

---

### Test 2: Onboarding Flow

1. **Step 1: Profile Setup**
   - Enter your name
   - Select a role:
     - **Artist** → Will show tour form
     - **Manager** → Will show tour form
     - **Operator** → Will show venue form
   - Click "Continue"

2. **Step 2A: Tour Setup (Artist/Manager)**
   - Enter **Tour Name**: "Summer 2025 Tour"
   - Select **Region**: "North America"
   - Select **Currency**: "USD"
   - Enter **Start Date**: Pick a future date
   - Click "Launch Dashboard"
   - ✅ Should create tour and redirect to tour detail page

3. **Step 2B: Venue Setup (Operator)**
   - Enter **Venue Name**: "The Blue Room"
   - Enter **City**: "Nashville"
   - Enter **Capacity**: 500
   - Click "Create Venue"
   - ✅ Should create venue and redirect to venue detail page

---

### Test 3: Create a Show

1. **From Tour Detail Page**
   - Click "Add Show" button (usually at top or in timeline)

2. **Fill Show Details**
   - **Date**: Pick a date
   - **City**: "Austin, TX"
   - **Venue**: "The Venue"
   - **Status**: "Draft"
   - **Deal Type**: "Guarantee"
   - **Guarantee**: 5000
   - **Ticket Price**: 50
   - **Capacity**: 200

3. **Save**
   - Click "Save" or "Add Show"
   - ✅ Show should appear in tour timeline
   - ✅ No console errors

---

### Test 4: Role Update Feature (New!)

1. **Go to Settings**
   - Click "Settings" in sidebar or navigate to `/app/settings`
   - Make sure you're on the **Profile** tab

2. **Change Role**
   - Find the **Role** dropdown
   - Change from current role to a different one (e.g., Artist → Manager)

3. **Save Changes**
   - Click "Save Changes" button
   - ✅ **Warning modal should appear** with:
     - Warning icon
     - Current role → New role display
     - Cancel and Confirm buttons

4. **Test Cancel**
   - Click "Cancel"
   - ✅ Modal closes
   - ✅ Role reverts to original

5. **Test Confirm**
   - Change role again
   - Click "Save Changes"
   - Click "Confirm Change" in modal
   - ✅ Role updates
   - ✅ Toast notification appears
   - ✅ Modal closes

6. **Verify Persistence**
   - Refresh page (F5)
   - ✅ Role should still be updated
   - ✅ Dashboard should reflect new role

---

### Test 5: Data Persistence

1. **Create Test Data**
   - Create a tour
   - Add 2-3 shows
   - Create a venue
   - Create a vendor

2. **Refresh Page**
   - Press F5 or Cmd+R
   - ✅ All data should still be there
   - ✅ You should still be logged in

3. **Logout and Login**
   - Click "Logout" in sidebar
   - Go to `/login`
   - Enter your email and password
   - Click "Sign In"
   - ✅ All your data should load:
     - Tours
     - Shows
     - Venues
     - Vendors

---

### Test 6: Edit Operations

1. **Edit a Show**
   - Go to a tour detail page
   - Click on a show
   - Change the guarantee amount
   - Update ticket price
   - Save
   - ✅ Changes should persist

2. **Edit a Tour**
   - Go to tour detail page
   - Edit tour name or dates
   - Save
   - ✅ Changes should persist

3. **Edit Profile**
   - Go to Settings → Profile
   - Change your name
   - Save (without changing role)
   - ✅ Name should update
   - ✅ No modal should appear

---

### Test 7: Delete Operations

1. **Delete a Show**
   - Go to show detail page
   - Click delete button
   - Confirm deletion
   - ✅ Show should be removed
   - ✅ Should redirect back to tour

2. **Delete a Vendor**
   - Go to Vendors page
   - Click delete on a vendor
   - ✅ Vendor should be removed

---

### Test 8: CSV Export

1. **Go to Tour Detail Page**
   - Navigate to a tour with shows

2. **Export CSV**
   - Look for "Export" button or menu
   - Click "CSV Export"
   - ✅ CSV file should download
   - ✅ Open file and verify data is correct

---

### Test 9: AI Assistant (If GEMINI_API_KEY is set)

1. **Go to Assistant Page**
   - Click "Assistant" in sidebar or `/app/assistant`

2. **Send a Message**
   - Type: "Help me plan a tour"
   - Press Enter or click Send
   - ✅ Should get a response
   - ✅ Check console for API calls (should see `/api/gemini/chat`)

3. **If No API Key**
   - You'll see an error message
   - This is expected if `GEMINI_API_KEY` is not set

---

### Test 10: Browser Console Check

1. **Open Console** (F12 → Console tab)

2. **Navigate Through App**
   - Go through different pages
   - Create, edit, delete items

3. **Check for Errors**
   - ❌ **Red errors** = Problem (note these down)
   - ⚠️ **Yellow warnings** = Usually OK, but note them
   - ✅ **Green/Blue messages** = Info/analytics (OK)

4. **Check Network Tab** (F12 → Network tab)
   - Filter by "Fetch/XHR"
   - Verify API calls return 200 status
   - ❌ **4xx/5xx errors** = Problem

---

## Common Issues & Solutions

### Issue: "Not authenticated" errors

**Solution:**
- Make sure you're logged in
- Check that `.env.local` has correct Supabase keys
- Verify Supabase project is active

### Issue: Data not saving

**Solution:**
- Check browser console for API errors
- Verify database migrations were run
- Check Network tab for failed requests

### Issue: Role update modal not appearing

**Solution:**
- Make sure you actually changed the role dropdown
- Check browser console for JavaScript errors
- Verify Settings component loaded correctly

### Issue: Can't create tour/show

**Solution:**
- Check if you're on Free tier and already have 1 tour (limit)
- Check browser console for subscription errors
- Verify API endpoints are accessible

---

## Quick Test Checklist

Run through this quickly:

- [ ] Sign up works
- [ ] Onboarding completes
- [ ] Can create tour
- [ ] Can add show
- [ ] Can edit show
- [ ] Can delete show
- [ ] Role update works (with modal)
- [ ] Data persists after refresh
- [ ] Logout/login works
- [ ] CSV export works
- [ ] No console errors

---

## Testing Tips

1. **Use Browser DevTools**
   - F12 opens DevTools
   - Console tab = JavaScript errors
   - Network tab = API calls
   - Application tab = LocalStorage/SessionStorage

2. **Test Different Roles**
   - Create accounts with different roles
   - Verify role-specific features work
   - Test role switching

3. **Test Edge Cases**
   - Empty fields
   - Very long text
   - Special characters
   - Invalid dates

4. **Test Mobile View**
   - F12 → Toggle device toolbar
   - Test on mobile sizes
   - Verify responsive design

---

## What to Look For

### ✅ Good Signs
- No red errors in console
- API calls return 200 status
- Data saves and loads correctly
- UI is responsive
- Forms validate correctly

### ❌ Bad Signs
- Red errors in console
- API calls return 4xx/5xx
- Data doesn't persist
- Forms don't submit
- Pages don't load

---

## Next Steps After Testing

If all tests pass:
1. ✅ Fix any bugs found
2. ✅ Commit fixes to git
3. ✅ Ready for deployment

If issues found:
1. Note the issue (what happened, what you expected)
2. Check browser console for errors
3. Check Network tab for failed requests
4. Share details and we'll fix them

---

## Quick Command Reference

```bash
# Start dev server
npm run dev

# Build for production (test build)
npm run build

# Preview production build
npm run preview

# Check for linting errors
npm run lint  # (if configured)
```

---

## Need Help?

If you encounter issues:
1. Check browser console (F12)
2. Check Network tab for failed requests
3. Verify `.env.local` has correct keys
4. Verify database migrations ran
5. Share the error message and we'll fix it!

