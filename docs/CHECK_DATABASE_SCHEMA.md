# Check Database Schema

## Quick Check

I've created SQL queries to check your database structure. Run them in Supabase SQL Editor.

---

## File Created

**`supabase/check-schema.sql`** - Complete schema check queries

---

## How to Use

### Step 1: Open Supabase SQL Editor
Go to: https://supabase.com/dashboard/project/shkitxtebwjokkcygecn/sql/new

### Step 2: Copy SQL File
Open: `supabase/check-schema.sql`

### Step 3: Run Queries
1. Copy the entire file
2. Paste into SQL Editor
3. Click "Run" (or `Cmd/Ctrl + Enter`)
4. Review results

---

## What the Queries Check

### 1. All Public Tables
Lists all tables in your database

### 2. user_profiles Columns
Shows column names, types, nullable, defaults for `user_profiles`

### 3. All Tables - Columns
Complete column list for all 9 tables

### 4. RLS Policies
Shows all Row Level Security policies

### 5. Database Triggers
Lists all triggers (including `on_auth_user_created`)

### 6. Trigger Function
Checks if `handle_new_user` function exists

### 7. Sample Data
Shows last 5 user profiles

### 8. Constraints
Shows constraints on `user_profiles` (including CHECK constraints)

### 9. Row Counts
Counts rows in each table

---

## Expected Results

### user_profiles Table Should Have:
- ✅ `id` (uuid, primary key)
- ✅ `name` (text, not null)
- ✅ `email` (text, unique, not null)
- ✅ `role` (text, nullable) - Should allow NULL
- ✅ `tier` (text, default 'Free')
- ✅ `created_at` (timestamptz)
- ✅ `updated_at` (timestamptz)

### Trigger Should Exist:
- ✅ `on_auth_user_created` trigger on `auth.users`
- ✅ `handle_new_user` function

### RLS Policies Should Include:
- ✅ "Users can view own profile"
- ✅ "Users can update own profile"
- ✅ "Users can insert own profile"

---

## Quick Single Query

If you just want to check `user_profiles` columns quickly:

```sql
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'user_profiles'
ORDER BY ordinal_position;
```

---

**Run the queries and share the results if you need help interpreting them!**

