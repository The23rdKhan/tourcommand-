# Database Fix: Allow Null Role

## Issue
The `user_profiles` table has a `NOT NULL` constraint on the `role` column, but our signup flow now sets `role: null` during signup (to be set during onboarding). This causes a 404 error when trying to create a user profile.

## Solution
Run the migration `004_allow_null_role.sql` in your Supabase SQL Editor.

## Steps to Fix

1. **Go to Supabase Dashboard**
   - Open your project at [supabase.com](https://supabase.com)
   - Navigate to **SQL Editor**

2. **Run the Migration**
   - Click "New query"
   - Copy the entire contents of `supabase/migrations/004_allow_null_role.sql`
   - Paste into SQL Editor
   - Click "Run" (or Cmd/Ctrl + Enter)
   - Should see "Success. No rows returned"

3. **Verify the Fix**
   - Go to **Table Editor** → `user_profiles`
   - Check that the `role` column now allows NULL values
   - Try signing up again - it should work!

## What This Migration Does

- Removes the `NOT NULL` constraint from the `role` column
- Updates the CHECK constraint to allow `NULL` values
- Allows users to sign up with `role: null`, which will be set during onboarding

## After Running Migration

Once you run this migration, the signup flow should work correctly:
1. User signs up → Profile created with `role: null` ✅
2. User completes onboarding → Role is set to selected role ✅
3. User can use the app normally ✅

---

## Alternative: Quick SQL Fix

If you prefer to run the SQL directly:

```sql
-- Allow NULL role
ALTER TABLE user_profiles 
  DROP CONSTRAINT IF EXISTS user_profiles_role_check;

ALTER TABLE user_profiles 
  ADD CONSTRAINT user_profiles_role_check 
  CHECK (role IS NULL OR role IN ('Artist', 'Manager', 'Operator'));

ALTER TABLE user_profiles 
  ALTER COLUMN role DROP NOT NULL;
```

