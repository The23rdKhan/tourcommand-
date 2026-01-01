#!/usr/bin/env node
/**
 * Execute Supabase migrations programmatically
 * 
 * Usage: node scripts/execute-migrations.js
 * 
 * Requires SUPABASE_URL and SUPABASE_SERVICE_KEY in .env.local
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env.local');
  process.exit(1);
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSQL(sql, description) {
  console.log(`\n📄 Executing: ${description}...`);
  
  try {
    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        // Use Supabase REST API to execute SQL
        // Note: This requires the service role key
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`
          },
          body: JSON.stringify({ query: statement })
        });
        
        // If exec_sql doesn't exist, we'll need to use a different approach
        // Supabase doesn't expose arbitrary SQL execution via REST API for security
        // So we'll output the SQL for manual execution instead
      }
    }
    
    console.log(`⚠️  Supabase doesn't allow arbitrary SQL execution via API`);
    console.log(`   Please run this SQL manually in the SQL Editor:\n`);
    console.log(sql);
    console.log('\n');
    
    return false; // Indicates manual execution needed
  } catch (error) {
    console.error(`❌ Error:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 TourCommand Migration Executor');
  console.log('==================================\n');
  
  // Supabase doesn't expose arbitrary SQL execution via the REST API
  // for security reasons. We need to use the SQL Editor or pg library
  // Let's try using the PostgREST API with a direct connection approach
  
  console.log('⚠️  Note: Supabase requires SQL to be executed via SQL Editor');
  console.log('   or through a direct PostgreSQL connection.\n');
  console.log('📋 Preparing SQL for execution...\n');
  
  const migrations = [
    { file: '001_initial_schema.sql', desc: 'Initial Schema' },
    { file: '002_add_indexes.sql', desc: 'Indexes' },
    { file: '003_add_rls_policies.sql', desc: 'RLS Policies' }
  ];
  
  let allSQL = '';
  
  for (const migration of migrations) {
    try {
      const filePath = path.join(process.cwd(), 'supabase', 'migrations', migration.file);
      const sql = fs.readFileSync(filePath, 'utf-8');
      
      console.log(`✅ Loaded: ${migration.desc}`);
      allSQL += `\n-- ${migration.desc}\n-- File: ${migration.file}\n\n${sql}\n\n`;
    } catch (error) {
      console.error(`❌ Error reading ${migration.file}:`, error.message);
    }
  }
  
  // Write combined SQL to a file for easy copy/paste
  const outputPath = path.join(process.cwd(), 'supabase', 'all-migrations.sql');
  fs.writeFileSync(outputPath, allSQL);
  
  console.log(`\n✅ Combined SQL written to: supabase/all-migrations.sql`);
  console.log('\n📋 Next Steps:');
  console.log('1. Open: https://supabase.com/dashboard/project/shkitxtebwjokkcygecn/sql/new');
  console.log('2. Open the file: supabase/all-migrations.sql');
  console.log('3. Copy all SQL and paste into Supabase SQL Editor');
  console.log('4. Click "Run" (or press Cmd/Ctrl + Enter)');
  console.log('5. Verify "Success" message\n');
  
  // Also try to use pg library if available (requires direct DB connection)
  try {
    const { default: pg } = await import('pg');
    const { Client } = pg;
    
    // Extract connection details from Supabase URL
    // Format: postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
    // We need to construct this from the service key or use connection pooling
    
    console.log('💡 Tip: For automated migrations, you can use Supabase CLI:');
    console.log('   npx supabase db push\n');
  } catch (e) {
    // pg library not available, that's okay
  }
}

main().catch(console.error);

