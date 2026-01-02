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

