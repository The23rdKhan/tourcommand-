#!/usr/bin/env node
/**
 * Execute Supabase migrations via direct PostgreSQL connection
 * 
 * Usage: node scripts/run-sql-direct.js
 * 
 * Requires:
 * - SUPABASE_DB_PASSWORD in .env.local (get from Supabase Dashboard → Settings → Database)
 * - Or SUPABASE_DB_URL (full connection string)
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
const dbPassword = process.env.SUPABASE_DB_PASSWORD || process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD;
const dbUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;

// Extract project ref from Supabase URL
// Format: https://[project-ref].supabase.co
const projectRef = supabaseUrl?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

if (!projectRef) {
  console.error('❌ Error: Could not extract project reference from SUPABASE_URL');
  process.exit(1);
}

async function executeWithPg() {
  try {
    const { default: pg } = await import('pg');
    const { Client } = pg;
    
    // Construct connection string
    // Format: postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
    let connectionString;
    
    if (dbUrl) {
      connectionString = dbUrl;
    } else if (dbPassword) {
      // Try connection pooler (port 6543) - recommended for migrations
      // Username format: postgres.[project-ref]
      connectionString = `postgresql://postgres.${projectRef}:${encodeURIComponent(dbPassword)}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`;
      
      // Alternative: Direct connection (port 5432) if pooler doesn't work
      // connectionString = `postgresql://postgres:${encodeURIComponent(dbPassword)}@db.${projectRef}.supabase.co:5432/postgres`;
    } else {
      // Try to use service role key to get connection info
      // Or prompt user for password
      console.error('❌ Error: Missing database credentials');
      console.error('Set SUPABASE_DB_PASSWORD or SUPABASE_DB_URL in .env.local');
      console.error('\nTo get your database password:');
      console.error('1. Go to Supabase Dashboard → Settings → Database');
      console.error('2. Find "Connection string" or reset your database password');
      console.error('3. Add to .env.local: SUPABASE_DB_PASSWORD=your_password');
      console.error('\n💡 Alternative: Run SQL manually in Supabase SQL Editor');
      console.error('   File: supabase/all-migrations.sql\n');
      process.exit(1);
    }
    
    const client = new Client({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : { rejectUnauthorized: false }
    });
    
    await client.connect();
    console.log('✅ Connected to Supabase database\n');
    
    const migrations = [
      { file: '001_initial_schema.sql', desc: 'Initial Schema' },
      { file: '002_add_indexes.sql', desc: 'Indexes' },
      { file: '003_add_rls_policies.sql', desc: 'RLS Policies' }
    ];
    
    for (const migration of migrations) {
      try {
        const filePath = path.join(process.cwd(), 'supabase', 'migrations', migration.file);
        const sql = fs.readFileSync(filePath, 'utf-8');
        
        console.log(`📄 Running: ${migration.desc}...`);
        
        // Execute the SQL
        await client.query(sql);
        
        console.log(`✅ ${migration.desc} completed\n`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`⚠️  ${migration.desc} - Some objects already exist (skipping)\n`);
        } else {
          console.error(`❌ Error in ${migration.desc}:`, error.message);
          throw error;
        }
      }
    }
    
    await client.end();
    console.log('✅ All migrations completed successfully!');
    
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log('📦 Installing pg library...\n');
      console.log('Run: npm install pg');
      console.log('Then run this script again.\n');
      console.log('Alternatively, use the SQL Editor method:\n');
      console.log('1. Open: https://supabase.com/dashboard/project/shkitxtebwjokkcygecn/sql/new');
      console.log('2. Open: supabase/all-migrations.sql');
      console.log('3. Copy and paste all SQL');
      console.log('4. Click "Run"\n');
    } else {
      console.error('❌ Error:', error.message);
      console.error('\n💡 Alternative: Run SQL manually in Supabase SQL Editor');
      console.error('   File: supabase/all-migrations.sql\n');
    }
    process.exit(1);
  }
}

// Try to execute with pg, fallback to instructions
executeWithPg().catch(() => {
  // Error already handled in executeWithPg
});

