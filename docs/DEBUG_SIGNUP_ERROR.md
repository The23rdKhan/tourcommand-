# Debug Signup Error

## Error Message
"Database error saving new user"

## Steps to Debug

### 1. Check Browser Console (F12)
Open DevTools → Console tab and look for:
- Red error messages
- `[ERROR]` prefixed logs from our logger
- The actual error object/details

**What to look for:**
- RLS policy errors
- Constraint violations
- Network errors
- Trigger errors

### 2. Check Network Tab (F12)
Open DevTools → Network tab:
- Look for failed requests (red status codes)
- Click on failed request to see:
  - Request payload
  - Response error
  - Status code

### 3. Verify Trigger Exists
Run this in Supabase SQL Editor:

```sql
-- Check if trigger exists
SELECT 
  trigger_name,
  event_object_table,
  action_timing,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND event_object_table = 'users';

-- Check if function exists
SELECT 
  proname as function_name,
  prosrc as function_body
FROM pg_proc
WHERE proname = 'handle_new_user';
```

**Expected:** Should show `on_auth_user_created` trigger

### 4. Check if Profile Was Created
After the error, check Supabase Table Editor:
- Go to `user_profiles` table
- See if a profile was created despite the error
- If yes, the trigger worked but something else failed

### 5. Check Auth Users
In Supabase Dashboard:
- Go to Authentication → Users
- See if the auth user was created
- If yes, auth worked but profile creation failed

---

## Common Issues

### Issue 1: Trigger Not Created
**Symptom:** No trigger found in query results
**Fix:** Run migration `006_auto_create_profile_trigger.sql` again

### Issue 2: Trigger Function Error
**Symptom:** Function exists but has errors
**Fix:** Check function body for syntax errors

### Issue 3: RLS Policy Blocking
**Symptom:** "row-level security policy" error
**Fix:** Verify RLS policies are correct

### Issue 4: Session Not Established
**Symptom:** `auth.uid()` returns null
**Fix:** Wait longer for session (already implemented)

---

## Quick Test

Try this in Supabase SQL Editor to test trigger manually:

```sql
-- Check recent auth users
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- Check if profiles exist for those users
SELECT up.id, up.name, up.email, up.role
FROM user_profiles up
JOIN auth.users au ON up.id = au.id
ORDER BY up.created_at DESC
LIMIT 5;
```

---

## Next Steps

1. **Check browser console** - Get actual error details
2. **Verify trigger exists** - Run the SQL queries above
3. **Check if profile was created** - Look in Supabase Table Editor
4. **Share error details** - From console/network tab

