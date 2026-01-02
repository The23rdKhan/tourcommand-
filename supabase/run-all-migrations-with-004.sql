-- ============================================
-- TourCommand Database Migrations
-- Run this entire file in Supabase SQL Editor
-- ============================================

-- ============================================
-- Migration 001: Initial Schema
-- ============================================

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('Artist', 'Manager', 'Operator')),
  tier TEXT CHECK (tier IN ('Free', 'Pro', 'Agency')) DEFAULT 'Free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tours table
CREATE TABLE IF NOT EXISTS tours (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  artist TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  region TEXT NOT NULL,
  tour_manager TEXT,
  booking_agent TEXT,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Venues table (created before shows to allow foreign key reference)
CREATE TABLE IF NOT EXISTS venues (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  capacity INTEGER DEFAULT 0,
  contact_name TEXT,
  contact_email TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shows table
CREATE TABLE IF NOT EXISTS shows (
  id TEXT PRIMARY KEY,
  tour_id TEXT REFERENCES tours(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  city TEXT NOT NULL,
  venue TEXT NOT NULL,
  venue_id TEXT REFERENCES venues(id) ON DELETE SET NULL,
  status TEXT CHECK (status IN ('Confirmed', 'Challenged', 'Hold', 'Canceled', 'Draft')) DEFAULT 'Draft',
  deal_type TEXT CHECK (deal_type IN ('Guarantee', 'Door Split', 'Guarantee + %', 'Flat Fee')) DEFAULT 'Guarantee',
  financials JSONB NOT NULL DEFAULT '{}',
  logistics JSONB,
  travel JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('Security', 'Sound/Audio', 'Pyrotechnics', 'Runner', 'Makeup/Stylist', 'Catering', 'Other')) NOT NULL,
  city TEXT,
  poc_name TEXT,
  poc_email TEXT,
  poc_phone TEXT,
  requires_permits BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  user_id UUID PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
  tier TEXT CHECK (tier IN ('Free', 'Pro', 'Agency')) DEFAULT 'Free',
  status TEXT CHECK (status IN ('active', 'canceled', 'past_due')) DEFAULT 'active',
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shared tour links table
CREATE TABLE IF NOT EXISTS shared_tour_links (
  id TEXT PRIMARY KEY,
  tour_id TEXT REFERENCES tours(id) ON DELETE CASCADE NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Integrations table
CREATE TABLE IF NOT EXISTS integrations (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  provider TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Migration 002: Indexes
-- ============================================

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- Tours indexes
CREATE INDEX IF NOT EXISTS idx_tours_user_id ON tours(user_id);
CREATE INDEX IF NOT EXISTS idx_tours_start_date ON tours(start_date);

-- Shows indexes
CREATE INDEX IF NOT EXISTS idx_shows_tour_id ON shows(tour_id);
CREATE INDEX IF NOT EXISTS idx_shows_date ON shows(date);
CREATE INDEX IF NOT EXISTS idx_shows_venue_id ON shows(venue_id);

-- Venues indexes
CREATE INDEX IF NOT EXISTS idx_venues_user_id ON venues(user_id);
CREATE INDEX IF NOT EXISTS idx_venues_city ON venues(city);

-- Vendors indexes
CREATE INDEX IF NOT EXISTS idx_vendors_user_id ON vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_vendors_role ON vendors(role);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at);

-- Shared links indexes
CREATE INDEX IF NOT EXISTS idx_shared_links_tour_id ON shared_tour_links(tour_id);
CREATE INDEX IF NOT EXISTS idx_shared_links_token ON shared_tour_links(token);

-- ============================================
-- Migration 003: RLS Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_tour_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- User profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Tours policies
DROP POLICY IF EXISTS "Users can view own tours" ON tours;
CREATE POLICY "Users can view own tours" ON tours
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own tours" ON tours;
CREATE POLICY "Users can create own tours" ON tours
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own tours" ON tours;
CREATE POLICY "Users can update own tours" ON tours
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own tours" ON tours;
CREATE POLICY "Users can delete own tours" ON tours
  FOR DELETE USING (auth.uid() = user_id);

-- Shows policies
DROP POLICY IF EXISTS "Users can view shows in own tours" ON shows;
CREATE POLICY "Users can view shows in own tours" ON shows
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tours 
      WHERE tours.id = shows.tour_id 
      AND tours.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create shows in own tours" ON shows;
CREATE POLICY "Users can create shows in own tours" ON shows
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM tours 
      WHERE tours.id = shows.tour_id 
      AND tours.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update shows in own tours" ON shows;
CREATE POLICY "Users can update shows in own tours" ON shows
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM tours 
      WHERE tours.id = shows.tour_id 
      AND tours.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete shows in own tours" ON shows;
CREATE POLICY "Users can delete shows in own tours" ON shows
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM tours 
      WHERE tours.id = shows.tour_id 
      AND tours.user_id = auth.uid()
    )
  );

-- Venues policies
DROP POLICY IF EXISTS "Users can view own venues" ON venues;
CREATE POLICY "Users can view own venues" ON venues
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own venues" ON venues;
CREATE POLICY "Users can create own venues" ON venues
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own venues" ON venues;
CREATE POLICY "Users can update own venues" ON venues
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own venues" ON venues;
CREATE POLICY "Users can delete own venues" ON venues
  FOR DELETE USING (auth.uid() = user_id);

-- Vendors policies
DROP POLICY IF EXISTS "Users can view own vendors" ON vendors;
CREATE POLICY "Users can view own vendors" ON vendors
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own vendors" ON vendors;
CREATE POLICY "Users can create own vendors" ON vendors
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own vendors" ON vendors;
CREATE POLICY "Users can update own vendors" ON vendors
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own vendors" ON vendors;
CREATE POLICY "Users can delete own vendors" ON vendors
  FOR DELETE USING (auth.uid() = user_id);

-- Subscriptions policies
DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own subscription" ON subscriptions;
CREATE POLICY "Users can update own subscription" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Shared tour links policies (public read if token valid, owner can manage)
DROP POLICY IF EXISTS "Public can view valid shared links" ON shared_tour_links;
CREATE POLICY "Public can view valid shared links" ON shared_tour_links
  FOR SELECT USING (expires_at > NOW() OR expires_at IS NULL);

DROP POLICY IF EXISTS "Users can create shared links for own tours" ON shared_tour_links;
CREATE POLICY "Users can create shared links for own tours" ON shared_tour_links
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM tours 
      WHERE tours.id = shared_tour_links.tour_id 
      AND tours.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete shared links for own tours" ON shared_tour_links;
CREATE POLICY "Users can delete shared links for own tours" ON shared_tour_links
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM tours 
      WHERE tours.id = shared_tour_links.tour_id 
      AND tours.user_id = auth.uid()
    )
  );

-- Integrations policies
DROP POLICY IF EXISTS "Users can view own integrations" ON integrations;
CREATE POLICY "Users can view own integrations" ON integrations
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own integrations" ON integrations;
CREATE POLICY "Users can create own integrations" ON integrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own integrations" ON integrations;
CREATE POLICY "Users can update own integrations" ON integrations
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own integrations" ON integrations;
CREATE POLICY "Users can delete own integrations" ON integrations
  FOR DELETE USING (auth.uid() = user_id);

-- Analytics events policies
DROP POLICY IF EXISTS "Users can view own analytics" ON analytics_events;
CREATE POLICY "Users can view own analytics" ON analytics_events
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own analytics events" ON analytics_events;
CREATE POLICY "Users can create own analytics events" ON analytics_events
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- ============================================
-- Migration 004: Allow Null Role
-- ============================================

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

-- ============================================
-- Migration Complete!
-- ============================================

