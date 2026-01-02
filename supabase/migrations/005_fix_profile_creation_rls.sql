-- Migration 005: Fix RLS policy for profile creation during signup
-- Allow users to insert their own profile immediately after signup

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

-- Create a new policy that allows inserting profile with matching auth.uid()
-- This works because Supabase automatically logs in the user after signup
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Alternative: If the above still doesn't work, we can use a trigger instead
-- But let's try the policy fix first

