# Supabase Setup - Step-by-Step Guide

Complete guide to setting up Supabase for TourCommand.

---

## Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email
4. Verify your email if needed

---

## Step 2: Create New Project

1. In Supabase dashboard, click **"New Project"**
2. Fill in project details:

   **Organization:**
   - Select existing or create new
   - Name: `My Organization` (or your choice)

   **Project Details:**
   - **Name**: `tourcommand` (or your choice)
   - **Database Password**: 
     - Create a strong password
     - **⚠️ SAVE THIS PASSWORD** - You'll need it later
     - Example: `MySecurePass123!@#`
   
   **Region:**
   - Choose closest to your users
   - Options: US East, US West, EU, etc.
   - Recommendation: Choose based on primary user base

   **Pricing Plan:**
   - Select **Free** (for MVP)
   - Upgrade later if needed

3. Click **"Create new project"**
4. Wait 2-3 minutes for project initialization

---

## Step 3: Run Database Migrations

### 3.1 Open SQL Editor

1. In Supabase dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New query"** button

### 3.2 Run All Migrations

**Option A: Run Combined Migration (Recommended)**

1. Open file: `supabase/run-all-migrations-with-004.sql`
2. Copy **entire contents** (all SQL)
3. Paste into SQL Editor
4. Click **"Run"** button (or press `Cmd+Enter` / `Ctrl+Enter`)
5. Wait for **"Success"** message
6. Should see: "Success. No rows returned"

**Option B: Run Migrations Individually**

If combined migration fails, run in order:

1. `001_initial_schema.sql` - Creates all tables
2. `002_add_indexes.sql` - Adds performance indexes
3. `003_add_rls_policies.sql` - Sets up security
4. `004_allow_null_role.sql` - Allows null roles
5. `005_fix_profile_creation_rls.sql` - Fixes RLS
6. `006_auto_create_profile_trigger.sql` - Auto-creates profiles

### 3.3 Verify Migrations

Run this query to verify tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_profiles', 'tours', 'shows', 'venues', 'vendors');
```

Should return 5 rows.

---

## Step 4: Create Storage Bucket

1. In Supabase dashboard, click **"Storage"** (left sidebar)
2. Click **"New bucket"** button
3. Fill in:
   - **Name**: `tour-documents`
   - **Public bucket**: ✅ **Check this** (required for file access)
4. Click **"Create bucket"**
5. Verify bucket appears in list

---

## Step 5: Get API Keys

1. In Supabase dashboard, click **"Settings"** (gear icon, bottom left)
2. Click **"API"** in settings menu
3. Find these values:

### Project URL
- **Label**: Project URL
- **Value**: `https://xxxxx.supabase.co`
- **Copy this** - You'll need it for `VITE_SUPABASE_URL` and `SUPABASE_URL`

### API Keys

**anon/public key:**
- **Label**: `anon` `public`
- **Value**: Starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Copy this** - You'll need it for `VITE_SUPABASE_ANON_KEY`
- ✅ Safe to expose in frontend code

**service_role key:**
- **Label**: `service_role` `secret`
- **Value**: Starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Copy this** - You'll need it for `SUPABASE_SERVICE_KEY`
- ⚠️ **KEEP SECRET** - Only use in server-side code

---

## Step 6: Configure Authentication

### 6.1 Enable Email Auth

1. Go to **Authentication** → **Providers**
2. **Email** should be enabled by default
3. If not, toggle it ON

### 6.2 Configure Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize:
   - **Confirm signup** - Email verification
   - **Reset password** - Password reset
   - **Magic Link** - If using magic links
3. Click **"Save"** after changes

### 6.3 Set Site URL

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL**:
   - Local: `http://localhost:3000`
   - Production: `https://your-app.vercel.app`
3. Add **Redirect URLs**:
   - `http://localhost:3000/**`
   - `https://your-app.vercel.app/**`

---

## Step 7: Test Database Connection

### 7.1 Test Locally

1. Create `.env.local` file in project root:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here
```

2. Run locally:
```bash
npm run dev
```

3. Test signup/login flow

### 7.2 Verify Tables

Run this in SQL Editor:

```sql
-- Check user_profiles table
SELECT * FROM user_profiles LIMIT 1;

-- Check tours table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tours';
```

---

## Step 8: Verify RLS Policies

1. Go to **Authentication** → **Policies**
2. Or run in SQL Editor:

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('user_profiles', 'tours', 'shows', 'venues', 'vendors');
```

All should show `rowsecurity = true`.

---

## Step 9: Verify Trigger

Check that the profile creation trigger exists:

```sql
-- Check trigger exists
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

Should return 1 row.

---

## Troubleshooting

### Migration Errors

**Error: "relation already exists"**
- Tables already created - this is OK, skip that migration

**Error: "permission denied"**
- Make sure you're running as project owner
- Check you're in the correct project

**Error: "syntax error"**
- Check SQL syntax
- Make sure you copied entire migration file

### Connection Issues

**Can't connect from app**
- Verify `VITE_SUPABASE_URL` is correct
- Verify `VITE_SUPABASE_ANON_KEY` is correct
- Check Supabase project is active (not paused)

**RLS blocking queries**
- Verify migrations `003` and `005` ran successfully
- Check user is authenticated
- Verify policies are active

### Storage Issues

**Can't upload files**
- Verify bucket `tour-documents` exists
- Check bucket is set to **Public**
- Verify storage policies allow uploads

---

## Quick Checklist

- [ ] Supabase account created
- [ ] Project created and initialized
- [ ] Database password saved securely
- [ ] All migrations run successfully
- [ ] Storage bucket `tour-documents` created (public)
- [ ] API keys copied:
  - [ ] Project URL
  - [ ] anon/public key
  - [ ] service_role key
- [ ] Authentication configured
- [ ] Site URL set
- [ ] Local `.env.local` file created
- [ ] Local connection tested
- [ ] Tables verified
- [ ] RLS policies verified
- [ ] Trigger verified

---

## Next Steps

After Supabase is set up:

1. **Set environment variables** in Vercel (see [DEPLOYMENT_SETUP_GUIDE.md](./DEPLOYMENT_SETUP_GUIDE.md))
2. **Deploy to Vercel**
3. **Test production deployment**
4. **Monitor usage** in Supabase dashboard

---

## Support Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [Supabase GitHub](https://github.com/supabase/supabase)

---

**Setup complete!** ✅

Your Supabase project is ready. Proceed to deployment setup.

