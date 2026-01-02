# Supabase Setup Instructions

Quick reference guide for setting up Supabase for TourCommand.

## 1. Create Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create account
3. Click "New Project"
4. Fill in:
   - **Name**: `tourcommand`
   - **Database Password**: (save this!)
   - **Region**: Choose closest to users
5. Click "Create new project"
6. Wait 2-3 minutes

## 2. Run Migrations

Go to **SQL Editor** in Supabase Dashboard.

### Migration 1: Initial Schema

1. Click "New query"
2. Copy entire contents of `supabase/migrations/001_initial_schema.sql`
3. Paste into SQL Editor
4. Click "Run" (or Cmd/Ctrl + Enter)
5. Should see "Success. No rows returned"

### Migration 2: Indexes

1. Click "New query" (or clear previous)
2. Copy contents of `supabase/migrations/002_add_indexes.sql`
3. Paste and run
4. Should see "Success. No rows returned"

### Migration 3: RLS Policies

1. Click "New query" (or clear previous)
2. Copy contents of `supabase/migrations/003_add_rls_policies.sql`
3. Paste and run
4. Should see "Success. No rows returned"

## 3. Verify Tables

Go to **Table Editor** - you should see:

- ✅ `user_profiles`
- ✅ `tours`
- ✅ `shows`
- ✅ `venues`
- ✅ `vendors`
- ✅ `subscriptions`
- ✅ `shared_tour_links`
- ✅ `integrations`
- ✅ `analytics_events`

## 4. Create Storage Bucket

1. Go to **Storage** in sidebar
2. Click "Create bucket"
3. Name: `tour-documents`
4. **Public**: No (Private)
5. Click "Create bucket"
6. Go to **Policies** tab
7. Verify RLS is enabled

## 5. Get API Keys

1. Go to **Settings** → **API**
2. Copy these values:

**Project URL:**
```
https://xxxxxxxxxxxxx.supabase.co
```
→ Use for: `VITE_SUPABASE_URL` and `SUPABASE_URL`

**anon public key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
→ Use for: `VITE_SUPABASE_ANON_KEY`

**service_role key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
→ Use for: `SUPABASE_SERVICE_KEY` (keep secret!)

## 6. Configure Authentication (Optional)

If you want to disable email confirmation:

1. Go to **Authentication** → **Settings**
2. Find "Enable email confirmations"
3. Toggle OFF (for faster testing)
4. Or keep ON and handle verification in app

## 7. Test Connection

You can test the connection by running:

```bash
npm run dev
```

And checking browser console for Supabase connection errors.

## Troubleshooting

### Migration Fails

**Error: "relation already exists"**
- Tables already created - this is OK, migrations use `IF NOT EXISTS`

**Error: "permission denied"**
- Make sure you're running as project owner
- Check you're in the correct project

### RLS Policies Not Working

1. Go to **Authentication** → **Policies**
2. Verify policies are listed for each table
3. Check policy conditions match your needs
4. Test with SQL Editor:
   ```sql
   -- Should work (as authenticated user)
   SET ROLE authenticated;
   SELECT * FROM tours LIMIT 1;
   ```

### Storage Bucket Issues

- Make sure bucket is **Private**
- Check RLS policies are enabled
- Verify bucket name is exactly `tour-documents`

## Next Steps

After Supabase is set up:

1. Add keys to `.env.local` for local development
2. Add keys to Vercel for production deployment
3. Test locally with `npm run dev`
4. Proceed with Vercel deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for next steps.

