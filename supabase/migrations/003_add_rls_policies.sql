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

