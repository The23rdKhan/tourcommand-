-- ============================================
-- Database Schema Check - Complete
-- Run this entire file in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. List All Public Tables
-- ============================================
SELECT 
  table_name,
  table_schema
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- ============================================
-- 2. user_profiles Table - Column Details
-- ============================================
SELECT 
  column_name,
  data_type,
  character_maximum_length,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'user_profiles'
ORDER BY ordinal_position;

-- ============================================
-- 3. All Tables - Complete Column List
-- ============================================
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
    'user_profiles', 'tours', 'shows', 'venues', 
    'vendors', 'subscriptions', 'shared_tour_links',
    'integrations', 'analytics_events'
  )
ORDER BY table_name, ordinal_position;

-- ============================================
-- 4. Row Level Security Policies
-- ============================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================
-- 5. Database Triggers
-- ============================================
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement,
  action_timing
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- ============================================
-- 6. Check Trigger Function (handle_new_user)
-- ============================================
SELECT 
  proname as function_name,
  prosrc as function_body,
  proargtypes,
  prorettype
FROM pg_proc
WHERE proname = 'handle_new_user';

-- ============================================
-- 7. Sample Data - user_profiles (Last 5)
-- ============================================
SELECT 
  id,
  name,
  email,
  role,
  tier,
  created_at
FROM user_profiles
ORDER BY created_at DESC
LIMIT 5;

-- ============================================
-- 8. Check Constraints on user_profiles
-- ============================================
SELECT
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.user_profiles'::regclass;

-- ============================================
-- 9. Table Row Counts
-- ============================================
SELECT 
  'user_profiles' as table_name,
  COUNT(*) as row_count
FROM user_profiles
UNION ALL
SELECT 'tours', COUNT(*) FROM tours
UNION ALL
SELECT 'shows', COUNT(*) FROM shows
UNION ALL
SELECT 'venues', COUNT(*) FROM venues
UNION ALL
SELECT 'vendors', COUNT(*) FROM vendors
UNION ALL
SELECT 'subscriptions', COUNT(*) FROM subscriptions
UNION ALL
SELECT 'shared_tour_links', COUNT(*) FROM shared_tour_links
UNION ALL
SELECT 'integrations', COUNT(*) FROM integrations
UNION ALL
SELECT 'analytics_events', COUNT(*) FROM analytics_events;
