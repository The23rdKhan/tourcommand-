# Database Setup - Complete Guide

## Issue
The `user_profiles` table doesn't exist yet. You need to run all migrations in order.

## Solution
Run the combined migration file that includes everything.

---

## Quick Setup (5 minutes)

### Step 1: Open Supabase SQL Editor
Go to: https://supabase.com/dashboard/project/shkitxtebwjokkcygecn/sql/new

### Step 2: Copy the Combined Migration
Open the file: `supabase/run-all-migrations-with-004.sql`

**OR** copy this SQL:

```sql
-- ============================================
-- TourCommand Database Migrations
-- Run this entire file in Supabase SQL Editor
-- ============================================

-- Migration 001: Initial Schema
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IS NULL OR role IN ('Artist', 'Manager', 'Operator')),
  tier TEXT CHECK (tier IN ('Free', 'Pro', 'Agency')) DEFAULT 'Free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ... (rest of the migrations)
```

### Step 3: Run the SQL
1. Paste the entire contents of `supabase/run-all-migrations-with-004.sql`
2. Click **Run** (or press `Cmd/Ctrl + Enter`)
3. Wait for "Success" message

### Step 4: Verify
- Go to **Table Editor** in Supabase
- You should see these tables:
  - ✅ `user_profiles`
  - ✅ `tours`
  - ✅ `shows`
  - ✅ `venues`
  - ✅ `vendors`
  - ✅ `subscriptions`
  - ✅ `shared_tour_links`
  - ✅ `integrations`
  - ✅ `analytics_events`

### Step 5: Test Signup
- Go to your app: http://localhost:3001/#/signup
- Try signing up - it should work now!

---

## What This Does

The combined migration file includes:
1. **Migration 001**: Creates all tables (user_profiles, tours, shows, etc.)
2. **Migration 002**: Adds indexes for performance
3. **Migration 003**: Sets up Row Level Security (RLS) policies
4. **Migration 004**: Allows NULL roles (already included in the schema)

**Note:** Migration 004 is already included in the initial schema, so the `role` column allows NULL from the start.

---

## File Location

The complete migration file is at:
```
supabase/run-all-migrations-with-004.sql
```

Copy the entire contents and paste into Supabase SQL Editor.

