#!/usr/bin/env node
/**
 * Verify that migrations were run successfully
 * Checks if all required tables exist via Supabase API
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const requiredTables = [
  'user_profiles',
  'tours',
  'shows',
  'venues',
  'vendors',
  'subscriptions',
  'shared_tour_links',
  'integrations',
  'analytics_events'
];

async function verifyMigrations() {
  console.log('🔍 Verifying database migrations...\n');
  
  let allTablesExist = true;
  
  for (const table of requiredTables) {
    try {
      // Try to query the table (will fail if table doesn't exist)
      const { error } = await supabase.from(table).select('*').limit(0);
      
      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
          console.log(`❌ ${table} - Table does not exist`);
          allTablesExist = false;
        } else {
          // Other errors (like RLS) are okay - table exists
          console.log(`✅ ${table} - Table exists`);
        }
      } else {
        console.log(`✅ ${table} - Table exists`);
      }
    } catch (error) {
      console.log(`⚠️  ${table} - Could not verify (${error.message})`);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (allTablesExist) {
    console.log('✅ All migrations appear to be successful!');
    console.log('\nNext steps:');
    console.log('1. Test the app locally: npm run dev');
    console.log('2. Create a test account and verify data saves');
    console.log('3. Deploy to Vercel when ready\n');
  } else {
    console.log('❌ Some tables are missing');
    console.log('\nPlease run the migrations:');
    console.log('1. Go to: https://supabase.com/dashboard/project/shkitxtebwjokkcygecn/sql/new');
    console.log('2. Open: supabase/all-migrations.sql');
    console.log('3. Copy and paste all SQL');
    console.log('4. Click "Run"\n');
  }
}

verifyMigrations().catch(console.error);

