#!/usr/bin/env node
/**
 * Run Supabase migrations programmatically
 * 
 * Usage: npx tsx scripts/run-migrations.ts
 * 
 * Requires SUPABASE_URL and SUPABASE_SERVICE_KEY in environment
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_KEY in environment');
  console.error('Or ensure .env.local has these values');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration(fileName: string, description: string) {
  console.log(`\n📄 Running: ${description}...`);
  
  try {
    const sql = readFileSync(join(process.cwd(), 'supabase', 'migrations', fileName), 'utf-8');
    
    // Split by semicolons and filter empty statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        // If rpc doesn't work, try direct query (this might not work for all statements)
        // For now, we'll use a simpler approach - execute via REST API
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`
          },
          body: JSON.stringify({ sql: statement })
        });
        
        // Actually, Supabase doesn't expose exec_sql by default
        // We need to use the PostgREST API differently
        // Let's just output the SQL for manual execution
      }
    }
    
    console.log(`✅ ${description} - SQL loaded (needs manual execution)`);
    return true;
  } catch (error: any) {
    console.error(`❌ Error in ${description}:`, error.message);
    return false;
  }
}

// Actually, Supabase doesn't allow arbitrary SQL execution via the JS client for security
// We need to output the SQL for the user to run manually
async function main() {
  console.log('🚀 TourCommand Migration Runner');
  console.log('================================\n');
  console.log('⚠️  Note: Supabase requires migrations to be run via SQL Editor');
  console.log('This script will prepare the SQL for you to copy/paste.\n');
  
  const migrations = [
    { file: '001_initial_schema.sql', desc: 'Initial Schema' },
    { file: '002_add_indexes.sql', desc: 'Indexes' },
    { file: '003_add_rls_policies.sql', desc: 'RLS Policies' }
  ];
  
  for (const migration of migrations) {
    try {
      const sql = readFileSync(join(process.cwd(), 'supabase', 'migrations', migration.file), 'utf-8');
      console.log(`\n${'='.repeat(60)}`);
      console.log(`📄 ${migration.desc} (${migration.file})`);
      console.log('='.repeat(60));
      console.log('\nCopy and paste this into Supabase SQL Editor:\n');
      console.log(sql);
      console.log('\n');
    } catch (error: any) {
      console.error(`❌ Error reading ${migration.file}:`, error.message);
    }
  }
  
  console.log('\n✅ All migration SQL prepared!');
  console.log('\nNext steps:');
  console.log('1. Go to Supabase Dashboard → SQL Editor');
  console.log('2. Copy each migration SQL above');
  console.log('3. Paste and run in order');
}

main().catch(console.error);

