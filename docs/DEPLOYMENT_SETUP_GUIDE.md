# Deployment Setup Guide - TourCommand

This guide walks you through deploying TourCommand to Vercel.

## Prerequisites

- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js 18+ installed locally (for testing)

---

## Step 1: Prepare Your Repository

### 1.1 Push Code to GitHub

If you haven't already:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - TourCommand ready for deployment"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/tourcommand.git

# Push to GitHub
git push -u origin main
```

---

## Step 2: Set Up Supabase

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in:
   - **Name**: `tourcommand` (or your choice)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait 2-3 minutes for project to initialize

### 2.2 Run Database Migrations

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Open `supabase/run-all-migrations-with-004.sql` from your project
4. Copy the entire contents
5. Paste into SQL Editor
6. Click "Run" (or press Cmd/Ctrl + Enter)
7. Wait for "Success" message

### 2.3 Create Storage Bucket

1. In Supabase dashboard, go to **Storage**
2. Click "New bucket"
3. Name: `tour-documents`
4. **Public bucket**: ✅ Check this (for file access)
5. Click "Create bucket"

### 2.4 Get API Keys

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - Keep this secret!

---

## Step 3: Deploy to Vercel

### 3.1 Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Sign in (use GitHub if possible)
3. Click "Add New..." → "Project"
4. Import your `tourcommand` repository
5. Click "Import"

### 3.2 Configure Build Settings

Vercel should auto-detect:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

If not auto-detected, set manually.

### 3.3 Set Environment Variables

Before deploying, add these in Vercel:

1. In project settings, go to **Settings** → **Environment Variables**
2. Add each variable:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_key (optional, for AI features)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app (set after first deploy)
```

**Important:**
- Use the same values for `VITE_SUPABASE_URL` and `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY` is the service_role key (not anon key)
- `GEMINI_API_KEY` is optional - app works without it
- Set `NEXT_PUBLIC_APP_URL` after first deployment

### 3.4 Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. Once deployed, copy your production URL
4. Go back to Environment Variables
5. Update `NEXT_PUBLIC_APP_URL` with your production URL
6. Redeploy (or it will auto-redeploy)

---

## Step 4: Verify Deployment

### 4.1 Test Production URL

1. Open your Vercel deployment URL
2. Test these flows:
   - ✅ Sign up (create new account)
   - ✅ Login
   - ✅ Create tour
   - ✅ Add show
   - ✅ Export CSV
   - ✅ View dashboard

### 4.2 Check for Errors

1. Open browser console (F12)
2. Look for any errors
3. Check Vercel logs:
   - Go to Vercel dashboard
   - Click on your project
   - Go to "Deployments"
   - Click on latest deployment
   - Check "Functions" tab for API errors

---

## Step 5: Post-Deployment

### 5.1 Set Up Custom Domain (Optional)

1. In Vercel, go to **Settings** → **Domains**
2. Add your domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation (can take 24-48 hours)

### 5.2 Configure Email Templates (Optional)

1. In Supabase, go to **Authentication** → **Email Templates**
2. Customize verification email
3. Customize password reset email
4. Test email delivery

### 5.3 Set Up Error Tracking (Recommended)

1. Sign up for [Sentry](https://sentry.io) (free tier)
2. Create new project
3. Add Sentry SDK to your app (future enhancement)
4. Configure error reporting

---

## Troubleshooting

### Build Fails

**Error: Missing environment variables**
- Solution: Make sure all required env vars are set in Vercel

**Error: Module not found**
- Solution: Run `npm install` locally, commit `package-lock.json`

**Error: Build timeout**
- Solution: Check for large dependencies, optimize build

### Runtime Errors

**Error: Supabase connection failed**
- Solution: Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct

**Error: 401 Unauthorized**
- Solution: Verify `SUPABASE_SERVICE_KEY` is set correctly

**Error: RLS policy violation**
- Solution: Verify migrations ran successfully in Supabase

### Database Issues

**Tables don't exist**
- Solution: Re-run migrations in Supabase SQL Editor

**Can't create user profile**
- Solution: Check migration `006_auto_create_profile_trigger.sql` ran

---

## Quick Reference

### Environment Variables Checklist

- [ ] `VITE_SUPABASE_URL` - Supabase project URL
- [ ] `VITE_SUPABASE_ANON_KEY` - Supabase anon key
- [ ] `SUPABASE_URL` - Same as VITE_SUPABASE_URL
- [ ] `SUPABASE_SERVICE_KEY` - Supabase service role key
- [ ] `GEMINI_API_KEY` - Optional, for AI features
- [ ] `NEXT_PUBLIC_APP_URL` - Your Vercel deployment URL

### Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Supabase project created
- [ ] Migrations run successfully
- [ ] Storage bucket created
- [ ] Vercel project connected
- [ ] Environment variables set
- [ ] First deployment successful
- [ ] Production URL tested
- [ ] Core features verified

---

## Next Steps

After successful deployment:

1. **Test thoroughly** - Go through all user flows
2. **Monitor errors** - Check Vercel logs regularly
3. **Collect feedback** - Get user input
4. **Iterate** - Improve based on usage

---

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check Supabase logs (Dashboard → Logs)
3. Check browser console for errors
4. Review this guide for common issues

---

**You're all set!** 🚀

Your app should now be live at `https://your-app.vercel.app`

