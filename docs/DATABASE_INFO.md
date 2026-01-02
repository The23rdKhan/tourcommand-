# Database Information - TourCommand

## What Database Are We Using?

**PostgreSQL** (via Supabase)

TourCommand uses **Supabase**, which provides a fully managed **PostgreSQL** database in the cloud.

---

## Where Is the Database Stored?

### Cloud-Hosted (Supabase Infrastructure)

The database is **NOT stored locally** on your computer. It's hosted on **Supabase's cloud infrastructure**.

**Location:**
- **Hosted by**: Supabase (supabase.com)
- **Database Type**: PostgreSQL (open-source relational database)
- **Storage**: Cloud-based, managed by Supabase
- **Region**: Chosen when creating Supabase project (US East, US West, EU, etc.)

### How It Works

```
Your App (Vercel/Local)
    ↓
    API Calls
    ↓
Supabase Cloud (PostgreSQL Database)
    ↓
    Data Stored in Supabase's Servers
```

---

## Database Connection

### Client-Side (Browser)
**File:** `lib/supabase.ts`

```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

- Connects to: `https://xxxxx.supabase.co`
- Uses: Anon key (safe for frontend)
- Access: Limited by Row Level Security (RLS)

### Server-Side (API Routes)
**File:** `lib/supabase-server.ts`

```typescript
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
```

- Connects to: Same Supabase URL
- Uses: Service role key (full access, server-only)
- Access: Bypasses RLS (for admin operations)

---

## Database Schema

### Main Tables

All tables are stored in Supabase's PostgreSQL database:

1. **`user_profiles`** - User account information
2. **`tours`** - Tour data
3. **`shows`** - Individual show/concert data
4. **`venues`** - Venue information
5. **`vendors`** - Vendor/crew information
6. **`subscriptions`** - Subscription records
7. **`analytics_events`** - User analytics
8. **`shared_tour_links`** - Shareable tour links
9. **`integrations`** - Third-party integrations

### Schema Location

**Migration Files:** `supabase/migrations/`

- `001_initial_schema.sql` - Creates all tables
- `002_add_indexes.sql` - Performance indexes
- `003_add_rls_policies.sql` - Security policies
- `004_allow_null_role.sql` - Role column fix
- `005_fix_profile_creation_rls.sql` - RLS fix
- `006_auto_create_profile_trigger.sql` - Auto profile creation

---

## Database Access

### Where to Access

1. **Supabase Dashboard**
   - URL: `https://app.supabase.com`
   - Go to your project
   - Click "Table Editor" to view data
   - Click "SQL Editor" to run queries

2. **From Your Code**
   - Client: `lib/supabase.ts` (browser)
   - Server: `lib/supabase-server.ts` (API routes)

3. **Direct PostgreSQL Connection** (Advanced)
   - Supabase provides connection string
   - Can use `psql` or database tools
   - Connection string format:
     ```
     postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
     ```

---

## Database Storage Details

### Storage Location

- **Physical Location**: Supabase's data centers
- **Region**: Chosen during project creation
- **Backup**: Automatic daily backups (Supabase handles this)
- **Replication**: Managed by Supabase

### Storage Limits (Free Tier)

- **Database Size**: 500 MB
- **Storage (Files)**: 1 GB
- **Bandwidth**: 2 GB/month
- **Database Requests**: Unlimited (with rate limits)

### When You Need More

- Upgrade to Pro plan ($25/month)
- More storage, bandwidth, and features
- See Supabase pricing for details

---

## Environment Variables

### Required for Database Connection

**Local Development** (`.env.local`):
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Production** (Vercel):
- Same variables set in Vercel dashboard
- Environment → Variables

---

## Database Security

### Row Level Security (RLS)

- **Enabled**: Yes, on all tables
- **Purpose**: Users can only access their own data
- **Implementation**: Policies in `003_add_rls_policies.sql`

### Authentication

- **Method**: Supabase Auth (JWT tokens)
- **Storage**: Session stored in browser localStorage
- **Validation**: Every API request validates JWT

---

## Database Management

### Viewing Data

1. **Supabase Dashboard** → Table Editor
   - Browse tables
   - View/edit data
   - Filter and search

2. **SQL Editor**
   - Run custom queries
   - View table structure
   - Check RLS policies

### Modifying Schema

1. **Create Migration File**
   - Add to `supabase/migrations/`
   - Name: `007_your_migration.sql`

2. **Run in Supabase**
   - Go to SQL Editor
   - Paste migration SQL
   - Click "Run"

3. **Test Locally First**
   - Run migration on local/test project
   - Verify it works
   - Then run on production

---

## Database Backup & Recovery

### Automatic Backups

- **Frequency**: Daily
- **Retention**: 7 days (Free tier)
- **Location**: Managed by Supabase
- **Access**: Via Supabase dashboard

### Manual Backup

1. Go to Supabase dashboard
2. Settings → Database
3. Click "Backup" or use SQL dump

### Restore

- Contact Supabase support
- Or use pg_restore with backup file

---

## Summary

| Aspect | Details |
|--------|---------|
| **Database Type** | PostgreSQL |
| **Hosting** | Supabase Cloud |
| **Location** | Cloud (Supabase servers) |
| **Storage** | Not local - cloud-hosted |
| **Access** | Via Supabase API or direct PostgreSQL |
| **Security** | Row Level Security (RLS) enabled |
| **Backup** | Automatic daily backups |
| **Free Tier** | 500 MB database, 1 GB file storage |

---

## Quick Reference

**Database URL Format:**
```
https://[PROJECT_REF].supabase.co
```

**Direct PostgreSQL Connection:**
```
postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
```

**Where to Find:**
- Supabase Dashboard: https://app.supabase.com
- Your Project → Settings → API (for connection details)
- Your Project → SQL Editor (to run queries)

---

**Your database is in the cloud, managed by Supabase!** ☁️

No local database installation needed. Everything is handled by Supabase's infrastructure.

