# Quick Start - Get Your Supabase Keys

You've provided:
- ✅ Supabase URL: `https://shkitxtebwjokkcygecn.supabase.co`
- ⚠️ Key name mismatch detected

## What You Need

Our code uses these environment variable names (Vite convention):
- `VITE_SUPABASE_URL` (not `NEXT_PUBLIC_SUPABASE_URL`)
- `VITE_SUPABASE_ANON_KEY` (not `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`)

## Get the Correct Keys from Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/shkitxtebwjokkcygecn
2. Navigate to **Settings** → **API**
3. You need these two keys:

### 1. Anon/Public Key (for client-side)
- Look for **"anon" "public"** key
- This is what you'll use for `VITE_SUPABASE_ANON_KEY`
- It should look like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoa2l4dGVid2pva2tj eWdlY24iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5...`

### 2. Service Role Key (for server-side API routes)
- Look for **"service_role" "secret"** key
- This is what you'll use for `SUPABASE_SERVICE_KEY`
- ⚠️ **Keep this secret!** Never expose it in client code
- It should look like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoa2l4dGVid2pva2tj eWdlY24iLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjk...`

## Your .env.local File

Once you have both keys, create `.env.local`:

```env
# Client-side (React app)
VITE_SUPABASE_URL=https://shkitxtebwjokkcygecn.supabase.co
VITE_SUPABASE_ANON_KEY=paste_your_anon_key_here

# Server-side (API routes)
SUPABASE_URL=https://shkitxtebwjokkcygecn.supabase.co
SUPABASE_SERVICE_KEY=paste_your_service_role_key_here

# Optional - for AI features
GEMINI_API_KEY=your_gemini_key_if_you_have_one

# Update after Vercel deployment
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## Next Steps

1. ✅ You have the Supabase URL
2. ⏳ Get the **anon public** key → `VITE_SUPABASE_ANON_KEY`
3. ⏳ Get the **service_role** key → `SUPABASE_SERVICE_KEY`
4. ⏳ Run database migrations (see `SUPABASE_SETUP.md`)
5. ⏳ Create `.env.local` with all keys
6. ⏳ Test locally: `npm run dev`

## Important Notes

- The key you provided (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`) might be from a different template
- We use Vite, so variables must start with `VITE_` to be accessible in the browser
- The `service_role` key is critical for API routes to work - make sure you get this one!

## After Getting Keys

1. Create `.env.local` with the correct variable names
2. Run `npm run dev` to test locally
3. Follow `DEPLOYMENT_GUIDE.md` for Vercel setup

