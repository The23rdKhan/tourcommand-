
-- Initial Schema
-- File: 001_initial_schema.sql

-- Initial database schema for TourCommand
-- Extends Supabase auth.users

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('Artist', 'Manager', 'Operator')) NOT NULL,
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
  venue_id TEXT REFERENCES venues(id),
  status TEXT CHECK (status IN ('Confirmed', 'Challenged', 'Hold', 'Canceled', 'Draft')) NOT NULL,
  deal_type TEXT CHECK (deal_type IN ('Guarantee', 'Door Split', 'Guarantee + %', 'Flat Fee')) NOT NULL,
  notes TEXT,
  logistics JSONB,
  financials JSONB NOT NULL,
  travel JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  city TEXT,
  poc_name TEXT,
  poc_email TEXT,
  poc_phone TEXT,
  requires_permits BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscription management
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) UNIQUE NOT NULL,
  tier TEXT NOT NULL,
  status TEXT CHECK (status IN ('active', 'canceled', 'past_due')) DEFAULT 'active',
  stripe_subscription_id TEXT,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shared tour links (Pro feature)
CREATE TABLE IF NOT EXISTS shared_tour_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id TEXT REFERENCES tours(id) ON DELETE CASCADE NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Integration connections
CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  provider TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- Analytics events (for tracking)
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  event_name TEXT NOT NULL,
  properties JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tours_updated_at BEFORE UPDATE ON tours
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shows_updated_at BEFORE UPDATE ON shows
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON venues
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();




-- Indexes
-- File: 002_add_indexes.sql

-- Add indexes for performance optimization

CREATE INDEX IF NOT EXISTS idx_tours_user_id ON tours(user_id);
CREATE INDEX IF NOT EXISTS idx_shows_tour_id ON shows(tour_id);
CREATE INDEX IF NOT EXISTS idx_shows_date ON shows(date);
CREATE INDEX IF NOT EXISTS idx_venues_user_id ON venues(user_id);
CREATE INDEX IF NOT EXISTS idx_vendors_user_id ON vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_shared_links_token ON shared_tour_links(token);
CREATE INDEX IF NOT EXISTS idx_shared_links_tour_id ON shared_tour_links(tour_id);
CREATE INDEX IF NOT EXISTS idx_integrations_user_provider ON integrations(user_id, provider);
CREATE INDEX IF NOT EXISTS idx_analytics_user_event ON analytics_events(user_id, event_name, created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);




-- RLS Policies
-- File: 003_add_rls_policies.sql

-- Row Level Security (RLS) Policies

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
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Tours policies
CREATE POLICY "Users can view own tours" ON tours
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tours" ON tours
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tours" ON tours
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tours" ON tours
  FOR DELETE USING (auth.uid() = user_id);

-- Shows policies
CREATE POLICY "Users can view shows in own tours" ON shows
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tours 
      WHERE tours.id = shows.tour_id 
      AND tours.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create shows in own tours" ON shows
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM tours 
      WHERE tours.id = shows.tour_id 
      AND tours.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update shows in own tours" ON shows
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM tours 
      WHERE tours.id = shows.tour_id 
      AND tours.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete shows in own tours" ON shows
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM tours 
      WHERE tours.id = shows.tour_id 
      AND tours.user_id = auth.uid()
    )
  );

-- Venues policies
CREATE POLICY "Users can view own venues" ON venues
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own venues" ON venues
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own venues" ON venues
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own venues" ON venues
  FOR DELETE USING (auth.uid() = user_id);

-- Vendors policies
CREATE POLICY "Users can view own vendors" ON vendors
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own vendors" ON vendors
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vendors" ON vendors
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vendors" ON vendors
  FOR DELETE USING (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Shared tour links policies (public read if token valid, owner can manage)
CREATE POLICY "Public can view valid shared links" ON shared_tour_links
  FOR SELECT USING (expires_at > NOW() OR expires_at IS NULL);

CREATE POLICY "Users can create shared links for own tours" ON shared_tour_links
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM tours 
      WHERE tours.id = shared_tour_links.tour_id 
      AND tours.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete shared links for own tours" ON shared_tour_links
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM tours 
      WHERE tours.id = shared_tour_links.tour_id 
      AND tours.user_id = auth.uid()
    )
  );

-- Integrations policies
CREATE POLICY "Users can view own integrations" ON integrations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own integrations" ON integrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own integrations" ON integrations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own integrations" ON integrations
  FOR DELETE USING (auth.uid() = user_id);

-- Analytics events policies
CREATE POLICY "Users can view own analytics" ON analytics_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own analytics events" ON analytics_events
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);



