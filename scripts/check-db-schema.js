#!/usr/bin/env node
/**
 * Check database schema - tables and columns
 * 
 * Usage: node scripts/check-db-schema.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('Set SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

// SQL queries to check schema
const schemaQueries = {
  tables: `
    SELECT 
      table_name,
      table_schema
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `,
  
  user_profiles_columns: `
    SELECT 
      column_name,
      data_type,
      is_nullable,
      column_default
    FROM information_schema.columns
    WHERE table_schema = 'public' 
      AND table_name = 'user_profiles'
    ORDER BY ordinal_position;
  `,
  
  all_columns: `
    SELECT 
      table_name,
      column_name,
      data_type,
      is_nullable,
      column_default
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name IN (
        'user_profiles', 'tours', 'shows', 'venues', 
        'vendors', 'subscriptions', 'shared_tour_links',
        'integrations', 'analytics_events'
      )
    ORDER BY table_name, ordinal_position;
  `,
  
  rls_policies: `
    SELECT 
      schemaname,
      tablename,
      policyname,
      permissive,
      roles,
      cmd,
      qual,
      with_check
    FROM pg_policies
    WHERE schemaname = 'public'
    ORDER BY tablename, policyname;
  `,
  
  triggers: `
    SELECT 
      trigger_name,
      event_manipulation,
      event_object_table,
      action_statement
    FROM information_schema.triggers
    WHERE trigger_schema = 'public'
    ORDER BY event_object_table, trigger_name;
  `
};

async function querySupabase(query, description) {
  try {
    // Use Supabase REST API to run SQL via RPC (if available)
    // Or use direct PostgreSQL connection
    
    console.log(`\n📊 ${description}`);
    console.log('─'.repeat(60));
    
    // For now, output the query for manual execution
    console.log('\nSQL Query:');
    console.log(query);
    console.log('\n💡 Run this in Supabase SQL Editor to see results\n');
    
    return null;
  } catch (error) {
    console.error(`❌ Error:`, error.message);
    return null;
  }
}

async function checkSchema() {
  console.log('🔍 Database Schema Checker');
  console.log('='.repeat(60));
  console.log(`\nSupabase URL: ${supabaseUrl}`);
  console.log(`Project: ${supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] || 'unknown'}\n`);

  // Check tables
  await querySupabase(schemaQueries.tables, 'All Public Tables');
  
  // Check user_profiles columns
  await querySupabase(schemaQueries.user_profiles_columns, 'user_profiles Table Columns');
  
  // Check all columns
  await querySupabase(schemaQueries.all_columns, 'All Tables - Columns');
  
  // Check RLS policies
  await querySupabase(schemaQueries.rls_policies, 'Row Level Security Policies');
  
  // Check triggers
  await querySupabase(schemaQueries.triggers, 'Database Triggers');
  
  console.log('\n✅ Schema check complete!');
  console.log('\n📋 Next Steps:');
  console.log('1. Go to Supabase SQL Editor');
  console.log('2. Copy and run each query above');
  console.log('3. Verify tables and columns match expected schema\n');
}

// Also create a combined SQL file
function createCombinedSQL() {
  const combinedSQL = `-- Database Schema Check Queries
-- Run these in Supabase SQL Editor to verify your database structure

-- ============================================
-- 1. List All Tables
-- ============================================
${schemaQueries.tables}

-- ============================================
-- 2. user_profiles Table Structure
-- ============================================
${schemaQueries.user_profiles_columns}

-- ============================================
-- 3. All Tables - Complete Column List
-- ============================================
${schemaQueries.all_columns}

-- ============================================
-- 4. Row Level Security Policies
-- ============================================
${schemaQueries.rls_policies}

-- ============================================
-- 5. Database Triggers
-- ============================================
${schemaQueries.triggers}

-- ============================================
-- 6. Check if trigger function exists
-- ============================================
SELECT 
  proname as function_name,
  prosrc as function_body
FROM pg_proc
WHERE proname = 'handle_new_user';

-- ============================================
-- 7. Sample Data Check (user_profiles)
-- ============================================
SELECT 
  id,
  name,
  email,
  role,
  tier,
  created_at
FROM user_profiles
ORDER BY created_at DESC
LIMIT 5;
`;

  const outputPath = path.join(process.cwd(), 'supabase', 'check-schema.sql');
  fs.writeFileSync(outputPath, combinedSQL);
  console.log(`\n✅ Combined SQL saved to: supabase/check-schema.sql`);
}

checkSchema();
createCombinedSQL();

