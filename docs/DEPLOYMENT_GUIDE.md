# TourCommand Deployment Guide

This guide walks you through deploying TourCommand to production.

## Prerequisites

- [x] Supabase account (free tier)
- [x] Vercel account (free tier)
- [x] Google Gemini API key (optional, for AI features)
- [x] Node.js 18+ installed locally

## Step 1: Supabase Setup (30-60 minutes)

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in:
   - **Name**: `tourcommand` (or your choice)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait 2-3 minutes for provisioning

### 1.2 Run Database Migrations

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste contents of `supabase/migrations/001_initial_schema.sql`
4. Click "Run" (or press Cmd/Ctrl + Enter)
5. Verify success message
6. Repeat for `002_add_indexes.sql`
7. Repeat for `003_add_rls_policies.sql`

**Verify migrations:**
- Go to **Table Editor** - you should see:
  - `user_profiles`
  - `tours`
  - `shows`
  - `venues`
  - `vendors`
  - `subscriptions`
  - `shared_tour_links`
  - `integrations`
  - `analytics_events`

### 1.3 Create Storage Bucket

1. Go to **Storage** in Supabase Dashboard
2. Click "Create bucket"
3. Name: `tour-documents`
4. Set to **Private**
5. Click "Create bucket"
6. Go to **Policies** tab
7. Enable RLS (should be automatic)

### 1.4 Get API Keys

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** → Use for `VITE_SUPABASE_URL` and `SUPABASE_URL`
   - **anon public** key → Use for `VITE_SUPABASE_ANON_KEY`
   - **service_role** key → Use for `SUPABASE_SERVICE_KEY` (keep secret!)

## Step 2: Local Environment Setup (15 minutes)

### 2.1 Create .env.local

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your values:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=your_service_key_here
   GEMINI_API_KEY=your_gemini_key_here
   ```

### 2.2 Install Dependencies

```bash
npm install
```

### 2.3 Test Build

```bash
npm run build
```

Should complete without errors. Check that `dist/` folder is created.

### 2.4 Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000` and test:
- [ ] Sign up page loads
- [ ] Can create account
- [ ] Can login
- [ ] Can create tour
- [ ] Can add show

## Step 3: Vercel Deployment (30-45 minutes)

### 3.1 Connect Repository

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New" → "Project"
3. Import your Git repository
4. Select the repository containing TourCommand

### 3.2 Configure Project

Vercel should auto-detect:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

If not auto-detected, set manually.

### 3.3 Set Environment Variables

Before deploying, add all environment variables:

1. Go to **Settings** → **Environment Variables**
2. Add each variable for **Production**, **Preview**, and **Development**:

| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_SUPABASE_URL` | Your Supabase URL | From Step 1.4 |
| `VITE_SUPABASE_ANON_KEY` | Your anon key | From Step 1.4 |
| `SUPABASE_URL` | Same as VITE_SUPABASE_URL | From Step 1.4 |
| `SUPABASE_SERVICE_KEY` | Your service role key | From Step 1.4 (keep secret!) |
| `GEMINI_API_KEY` | Your Gemini key | Optional, for AI features |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | Update after first deploy |

### 3.4 Deploy

1. Click "Deploy"
2. Wait for build to complete (2-5 minutes)
3. Note your deployment URL (e.g., `https://tourcommand.vercel.app`)

### 3.5 Update App URL

1. Go back to **Environment Variables**
2. Update `NEXT_PUBLIC_APP_URL` with your actual deployment URL
3. Go to **Deployments** tab
4. Click "Redeploy" on latest deployment

## Step 4: Production Testing (1-2 hours)

### 4.1 Critical Path Testing

Test on your production URL:

**Authentication:**
- [ ] Sign up new account
- [ ] Check email (if verification enabled)
- [ ] Login
- [ ] Logout
- [ ] Session persists after refresh

**Tour Management:**
- [ ] Create tour
- [ ] View tour in list
- [ ] Edit tour details
- [ ] View tour detail page

**Show Management:**
- [ ] Add show to tour
- [ ] Edit show details
- [ ] Update financials
- [ ] Add travel items
- [ ] Delete show

**Data Persistence:**
- [ ] Create data, refresh page, verify still exists
- [ ] Check Supabase dashboard → Table Editor to see data

**Export:**
- [ ] CSV export works
- [ ] File downloads correctly

**AI Assistant:**
- [ ] Can send message
- [ ] AI responds (if Gemini key set)
- [ ] Can create show via AI

### 4.2 Security Testing

- [ ] Try accessing another user's data (should fail)
- [ ] Check browser console - no API keys exposed
- [ ] Verify authentication required for API calls

### 4.3 Performance

- [ ] Run Lighthouse audit (Chrome DevTools)
- [ ] Test on mobile device
- [ ] Check load times

## Step 5: Post-Deployment (30 minutes)

### 5.1 Monitoring (Optional)

**Vercel Analytics:**
1. Go to Vercel Dashboard → Analytics
2. Enable (free tier available)

**Error Tracking (Optional):**
- Consider Sentry (free tier: 5K events/month)
- Or use Vercel's built-in error logs

### 5.2 Custom Domain (Optional)

1. Go to Vercel Dashboard → Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

### 5.3 Documentation

Update `README.md` with:
- Production URL
- Deployment date
- Environment variables needed

## Troubleshooting

### Build Fails

**Error: Module not found**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Error: TypeScript errors**
```bash
npm run build
# Fix any TypeScript errors shown
```

### API Calls Fail in Production

1. Check environment variables are set in Vercel
2. Verify Supabase keys are correct
3. Check Vercel function logs: Dashboard → Deployments → Click deployment → Functions tab
4. Check Supabase logs: Dashboard → Logs

### Authentication Not Working

1. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
2. Check browser console for errors
3. Verify email confirmation is disabled (or handle it):
   - Supabase Dashboard → Authentication → Settings
   - Toggle "Enable email confirmations" if needed

### Data Not Persisting

1. Check Supabase Dashboard → Table Editor - is data there?
2. Check RLS policies are correct:
   - Supabase Dashboard → Authentication → Policies
3. Check browser console for errors
4. Verify foreign key constraints aren't blocking inserts

### RLS Policy Errors

If you see "new row violates row-level security policy":

1. Go to Supabase Dashboard → Authentication → Policies
2. Verify policies are created (from migration 003)
3. Check that policies allow your operations
4. Test with Supabase SQL Editor:
   ```sql
   -- Test as authenticated user
   SET ROLE authenticated;
   SELECT * FROM tours;
   ```

## Success Checklist

Before considering launch complete:

- [x] Supabase project created and migrations run
- [x] Storage bucket created
- [x] Environment variables configured
- [x] App deployed to Vercel
- [x] Can sign up and login
- [x] Can create tours and shows
- [x] Data persists correctly
- [x] CSV export works
- [x] AI Assistant works (if Gemini key set)
- [x] No console errors
- [x] Mobile responsive
- [x] Security verified (RLS working)

## Next Steps

After successful deployment:

1. Monitor error logs for first week
2. Gather user feedback
3. Implement PDF export (currently returns 501)
4. Add file uploads (if needed)
5. Set up payment processing (Stripe) for subscriptions
6. Add OAuth integrations (Eventbrite, Square, etc.)

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check Supabase logs
3. Check browser console
4. Review this guide's troubleshooting section
5. Check Supabase and Vercel documentation

## Cost Estimate

**Free Tier (Current):**
- Vercel: Free (100GB bandwidth/month)
- Supabase: Free (500MB database, 1GB storage, 50K MAU)
- Gemini API: Pay-per-use (free credits available)
- **Total: $0/month** (within limits)

**When to Upgrade:**
- Supabase: $25/month when exceeding free tier
- Vercel: $20/month for Pro (if needed)

