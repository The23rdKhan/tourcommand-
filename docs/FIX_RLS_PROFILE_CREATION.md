# Fix RLS Profile Creation Issue

## Problem
After signup, profile creation fails with:
```
new row violates row-level security policy for table "user_profiles"
```

## Root Cause
The RLS policy `auth.uid() = id` requires the session to be fully established, but there's a timing issue where the session might not be immediately available after `signUp()`.

## Solution

### Option 1: Wait for Session (Code Fix) ✅ IMPLEMENTED
Added a small delay and session verification before inserting profile:
- Wait 100ms for session to establish
- Verify session exists before insert
- This ensures `auth.uid()` returns the correct value

### Option 2: Database Trigger (More Reliable)
Create a database trigger that automatically creates the profile when a user signs up. This bypasses RLS entirely.

### Option 3: Update RLS Policy (If Option 1 doesn't work)
Run migration `005_fix_profile_creation_rls.sql` to ensure the policy is correct.

---

## Quick Fix

### Step 1: Try the Code Fix First
The code has been updated to wait for the session. Try signing up again.

### Step 2: If Still Failing, Run Migration
Go to Supabase SQL Editor and run:
```sql
-- Drop and recreate the INSERT policy
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT 
  WITH CHECK (auth.uid() = id);
```

### Step 3: Alternative - Database Trigger (Most Reliable)
If the above doesn't work, create a trigger that automatically creates the profile:

```sql
-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, email, role, tier)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    NULL,
    'Free'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**Note:** With a trigger, you can remove the profile creation code from `Auth.tsx` since it will happen automatically.

---

## Testing

1. Try signing up again
2. Check browser console for errors
3. If it works, profile should be created automatically
4. If it still fails, use the database trigger approach (Step 3)

---

## Which Solution to Use?

- **Code Fix (Option 1)**: Quick, but has a timing dependency
- **RLS Policy Update (Option 2)**: Should work if policy is the issue
- **Database Trigger (Option 3)**: Most reliable, automatic, no code changes needed

**Recommendation:** Try Option 1 first. If it still fails, use Option 3 (database trigger).

