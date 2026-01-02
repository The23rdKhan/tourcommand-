# Debug Button - What Gets Saved

## ✅ Yes, Everything Gets Saved to Database!

The debug button uses the **exact same signup flow** as manual signup, so all data is saved to the database.

---

## What Gets Saved

### 1. **Auth User** (Supabase `auth.users` table)
- ✅ Email: `test-{timestamp}@example.com`
- ✅ Password: Hashed and stored securely
- ✅ User metadata:
  - `name`: "Test User"
  - `first_name`: "Test"
  - `last_name`: "User"
- ✅ Created timestamp
- ✅ User ID (UUID)

### 2. **User Profile** (`user_profiles` table)
- ✅ `id`: Matches auth user ID
- ✅ `name`: "Test User"
- ✅ `email`: `test-{timestamp}@example.com`
- ✅ `role`: `NULL` (will be set during onboarding)
- ✅ `tier`: `'Free'`
- ✅ `created_at`: Current timestamp
- ✅ `updated_at`: Current timestamp

### 3. **Session**
- ✅ User is automatically logged in
- ✅ Session stored in browser localStorage
- ✅ Can access protected routes immediately

---

## How to Verify

### After clicking debug button:

1. **Check Supabase Dashboard:**
   - Go to **Authentication → Users**
   - Should see new user with email like `test-1735849200000@example.com`

2. **Check Database:**
   - Go to **Table Editor → user_profiles**
   - Should see new profile with:
     - Name: "Test User"
     - Email: `test-{timestamp}@example.com`
     - Role: `null`
     - Tier: "Free"

3. **Check Browser:**
   - Should redirect to `/app/onboarding`
   - User should be logged in
   - Can complete onboarding

---

## Important Notes

### ✅ Real Data
- This creates **real accounts** in your database
- Each click creates a **new unique account** (timestamp in email)
- Data persists after page refresh

### ✅ Same as Manual Signup
- Uses identical code path
- Same validation
- Same error handling
- Same database operations

### ✅ Can Complete Full Flow
- After debug signup, you can:
  - Complete onboarding
  - Create tours/venues
  - Use the full app
  - Everything works normally

---

## Cleanup (Optional)

If you want to clean up test accounts later:

```sql
-- Delete test user profiles
DELETE FROM user_profiles 
WHERE email LIKE 'test-%@example.com';

-- Note: Auth users will be deleted automatically 
-- if CASCADE is set up (which it is)
```

---

## Summary

**Yes, everything is saved!** The debug button is just a shortcut to fill the form - it uses the exact same signup process, so all data goes to the database just like a normal signup.

