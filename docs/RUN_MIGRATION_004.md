# Run Migration 004 - Quick Guide

## The SQL You Need to Run

Copy and paste this SQL into Supabase SQL Editor:

```sql
-- Migration 004: Allow null role in user_profiles
-- This allows users to sign up without a role, which will be set during onboarding

-- Drop the existing NOT NULL constraint and CHECK constraint
ALTER TABLE user_profiles 
  DROP CONSTRAINT IF EXISTS user_profiles_role_check;

-- Add new CHECK constraint that allows NULL
ALTER TABLE user_profiles 
  ADD CONSTRAINT user_profiles_role_check 
  CHECK (role IS NULL OR role IN ('Artist', 'Manager', 'Operator'));

-- Remove NOT NULL constraint (allow NULL)
ALTER TABLE user_profiles 
  ALTER COLUMN role DROP NOT NULL;
```

## Steps to Run

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project: `shkitxtebwjokkcygecn`

2. **Open SQL Editor**
   - Click **SQL Editor** in the left sidebar
   - Click **New query**

3. **Paste and Run**
   - Copy the SQL above
   - Paste into the SQL Editor
   - Click **Run** (or press `Cmd/Ctrl + Enter`)

4. **Verify Success**
   - You should see: "Success. No rows returned"
   - If you see errors, check the error message

5. **Test Signup**
   - Go back to your app: http://localhost:3001/#/signup
   - Try signing up again - it should work now!

---

## What This Does

- Removes the `NOT NULL` constraint from `role` column
- Updates the CHECK constraint to allow `NULL` values
- Allows signup to create profiles with `role: null`
- Role will be set during onboarding

---

## Alternative: Direct Link

If you want to open SQL Editor directly:
https://supabase.com/dashboard/project/shkitxtebwjokkcygecn/sql/new

