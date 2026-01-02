#!/usr/bin/env node
/**
 * Execute Migration 004: Allow null role
 * 
 * Usage: node scripts/run-migration-004.js
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
const projectRef = supabaseUrl?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

if (!projectRef) {
  console.error('❌ Error: Could not extract project reference from SUPABASE_URL');
  console.error('Make sure SUPABASE_URL is set in .env.local');
  process.exit(1);
}

async function executeMigration() {
  try {
    const { default: pg } = await import('pg');
    const { Client } = pg;
    
    // Construct connection string
    let connectionString;
    
    if (dbUrl) {
      connectionString = dbUrl;
    } else if (dbPassword) {
      // Try direct connection first (port 5432)
      connectionString = `postgresql://postgres:${encodeURIComponent(dbPassword)}@db.${projectRef}.supabase.co:5432/postgres?sslmode=require`;
    } else {
      console.error('❌ Error: Missing database credentials');
      console.error('Set SUPABASE_DB_PASSWORD or SUPABASE_DB_URL in .env.local');
      console.error('\nTo get your database password:');
      console.error('1. Go to Supabase Dashboard → Settings → Database');
      console.error('2. Find "Connection string" or reset your database password');
      console.error('3. Add to .env.local: SUPABASE_DB_PASSWORD=your_password');
      console.error('\n💡 Alternative: Run SQL manually in Supabase SQL Editor');
      console.error('   File: supabase/migrations/004_allow_null_role.sql\n');
      process.exit(1);
    }
    
    // Try different SSL configurations
    const sslConfigs = [
      { rejectUnauthorized: false },
      { require: true, rejectUnauthorized: false },
      false // Disable SSL (won't work but trying)
    ];
    
    let client;
    let connected = false;
    
    for (const sslConfig of sslConfigs) {
      try {
        client = new Client({
          connectionString,
          ssl: sslConfig
        });
        await client.connect();
        connected = true;
        break;
      } catch (sslError) {
        if (sslConfig === sslConfigs[sslConfigs.length - 1]) {
          throw sslError;
        }
        // Try next config
      }
    }
    
    if (!connected) {
      throw new Error('Could not establish SSL connection');
    }
    
    await client.connect();
    console.log('✅ Connected to Supabase database\n');
    
    // Read migration file
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '004_allow_null_role.sql');
    const sql = fs.readFileSync(migrationPath, 'utf-8');
    
    console.log('📄 Running Migration 004: Allow null role...\n');
    console.log('SQL to execute:');
    console.log('─'.repeat(60));
    console.log(sql);
    console.log('─'.repeat(60));
    console.log('');
    
    // Execute the SQL
    await client.query(sql);
    
    console.log('✅ Migration 004 completed successfully!');
    console.log('\nThe user_profiles table now allows NULL roles.');
    console.log('Users can sign up and set their role during onboarding.\n');
    
    await client.end();
    
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log('📦 Installing pg library...\n');
      console.log('Run: npm install pg --legacy-peer-deps');
      console.log('Then run this script again.\n');
    } else {
      console.error('❌ Error:', error.message);
      console.error('\n💡 Alternative: Run SQL manually in Supabase SQL Editor');
      console.error('   1. Go to: https://supabase.com/dashboard');
      console.error('   2. Navigate to SQL Editor');
      console.error('   3. Copy contents of: supabase/migrations/004_allow_null_role.sql');
      console.error('   4. Paste and click "Run"\n');
    }
    process.exit(1);
  }
}

executeMigration();

