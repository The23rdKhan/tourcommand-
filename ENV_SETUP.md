# Environment Variables Setup Guide

## Important: Variable Name Mismatch

You provided:
- `NEXT_PUBLIC_SUPABASE_URL` 
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

But our code uses **Vite** (not Next.js), so we need:
- `VITE_SUPABASE_URL` ✅ (you have the URL)
- `VITE_SUPABASE_ANON_KEY` ⚠️ (need the correct key)

## What You Have

✅ **Supabase URL**: `https://shkitxtebwjokkcygecn.supabase.co`

⚠️ **Key Name Issue**: The key name `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` suggests you might be using a different template. We need the standard Supabase keys.

## Get the Correct Keys

1. Go to your Supabase Dashboard:
   - https://supabase.com/dashboard/project/shkitxtebwjokkcygecn
   - Or: Settings → API

2. You need **TWO** keys:

### Key 1: Anon Public Key (Client-side)
- Look for **"anon" "public"** in the API settings
- This is for `VITE_SUPABASE_ANON_KEY`
- It's safe to expose in client code
- Format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Key 2: Service Role Key (Server-side)
- Look for **"service_role" "secret"** in the API settings
- This is for `SUPABASE_SERVICE_KEY`
- ⚠️ **KEEP SECRET!** Never expose in client
- Format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Create .env.local

Once you have both keys, create `.env.local` in the project root:

```env
# Client-side (React app - must start with VITE_)
VITE_SUPABASE_URL=https://shkitxtebwjokkcygecn.supabase.co
VITE_SUPABASE_ANON_KEY=paste_your_anon_public_key_here

# Server-side (API routes - used in Vercel)
SUPABASE_URL=https://shkitxtebwjokkcygecn.supabase.co
SUPABASE_SERVICE_KEY=paste_your_service_role_key_here

# Optional: Google Gemini API (for AI features)
GEMINI_API_KEY=your_gemini_key_if_you_have_one

# Update after Vercel deployment
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## Why VITE_ Prefix?

Vite only exposes environment variables that start with `VITE_` to the client code. This is a security feature.

- ✅ `VITE_SUPABASE_URL` → Accessible in browser
- ✅ `VITE_SUPABASE_ANON_KEY` → Accessible in browser
- ❌ `SUPABASE_SERVICE_KEY` → NOT accessible in browser (server-only)

## Quick Test

After creating `.env.local`:

```bash
npm run dev
```

Check browser console - should see no Supabase connection errors.

## For Vercel Deployment

When deploying to Vercel, add these same variables in Vercel Dashboard:
- Settings → Environment Variables
- Add all variables from `.env.local`
- Make sure variable names match exactly

## Still Need Help?

If you can't find the keys in Supabase:
1. Go to Settings → API
2. Look for "Project API keys" section
3. You should see:
   - **anon public** (for client)
   - **service_role** (for server - click "Reveal" to see it)

