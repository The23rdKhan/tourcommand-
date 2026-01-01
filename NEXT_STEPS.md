# Next Steps to Production Launch

## ✅ Completed
- [x] Supabase project created
- [x] Environment variables configured in `.env.local`
- [x] Dependencies installed
- [x] Build successful

## 🔄 Next Steps (30-60 minutes)

### Step 1: Run Database Migrations (10 minutes)

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/shkitxtebwjokkcygecn
2. Click **SQL Editor** in the left sidebar
3. Run each migration file in order:

**Migration 1:**
- Click "New query"
- Copy entire contents of `supabase/migrations/001_initial_schema.sql`
- Paste and click "Run" (or Cmd/Ctrl + Enter)
- Should see "Success. No rows returned"

**Migration 2:**
- Click "New query" (or clear previous)
- Copy contents of `supabase/migrations/002_add_indexes.sql`
- Paste and run
- Should see "Success. No rows returned"

**Migration 3:**
- Click "New query" (or clear previous)
- Copy contents of `supabase/migrations/003_add_rls_policies.sql`
- Paste and run
- Should see "Success. No rows returned"

**Verify:**
- Go to **Table Editor** - you should see all tables created

### Step 2: Create Storage Bucket (2 minutes)

1. In Supabase Dashboard, go to **Storage**
2. Click "Create bucket"
3. Name: `tour-documents`
4. Set to **Private**
5. Click "Create bucket"

### Step 3: Test Locally (5 minutes)

```bash
npm run dev
```

Visit `http://localhost:3000` and test:
- [ ] Sign up page loads
- [ ] Can create account
- [ ] Can login
- [ ] Can create tour
- [ ] Can add show
- [ ] Data persists after refresh

### Step 4: Deploy to Vercel (30-45 minutes)

1. **Connect Repository:**
   - Go to vercel.com
   - Click "Add New" → "Project"
   - Import your Git repository

2. **Configure Build:**
   - Framework: Vite (should auto-detect)
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Add Environment Variables:**
   - Go to Settings → Environment Variables
   - Add all variables from your `.env.local`:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `SUPABASE_URL`
     - `SUPABASE_SERVICE_KEY`
     - `GEMINI_API_KEY` (if you have it)
     - `NEXT_PUBLIC_APP_URL` (update after first deploy)

4. **Deploy:**
   - Click "Deploy"
   - Wait for build (2-5 minutes)
   - Note your deployment URL

5. **Update App URL:**
   - Go back to Environment Variables
   - Update `NEXT_PUBLIC_APP_URL` with your actual Vercel URL
   - Redeploy

### Step 5: Production Testing (15-30 minutes)

Test on your production URL:
- [ ] Sign up works
- [ ] Login works
- [ ] Can create tour
- [ ] Can add show
- [ ] CSV export works
- [ ] Data persists
- [ ] No console errors

## 🎉 Launch!

Once testing passes, you're live!

## Quick Command Reference

```bash
# Test locally
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Troubleshooting

**If migrations fail:**
- Check you're running them in order
- Verify you're in the correct Supabase project
- Check SQL Editor for error messages

**If local test fails:**
- Check `.env.local` has correct keys
- Check browser console for errors
- Verify Supabase project is active

**If Vercel deploy fails:**
- Check environment variables are set
- Check build logs in Vercel dashboard
- Verify `vercel.json` is in project root

