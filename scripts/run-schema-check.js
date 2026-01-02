#!/usr/bin/env node
/**
 * Run database schema check queries
 * 
 * Usage: node scripts/run-schema-check.js
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
  process.exit(1);
}

async function runSchemaCheck() {
  try {
    const { default: pg } = await import('pg');
    const { Client } = pg;
    
    // Construct connection string
    let connectionString;
    
    if (dbUrl) {
      connectionString = dbUrl;
    } else if (dbPassword) {
      // Try direct connection (port 5432)
      connectionString = `postgresql://postgres:${encodeURIComponent(dbPassword)}@db.${projectRef}.supabase.co:5432/postgres?sslmode=require`;
    } else {
      console.error('❌ Error: Missing database credentials');
      console.error('Set SUPABASE_DB_PASSWORD or SUPABASE_DB_URL in .env.local');
      console.error('\n💡 Alternative: Run SQL manually in Supabase SQL Editor');
      console.error('   File: supabase/check-schema.sql\n');
      process.exit(1);
    }
    
    const client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });
    
    await client.connect();
    console.log('✅ Connected to Supabase database\n');
    
    // Read SQL file
    const sqlPath = path.join(process.cwd(), 'supabase', 'check-schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    
    // Split by queries (separated by -- comments or semicolons)
    const queries = sql
      .split(/-- =+.*?=+/)
      .map(q => q.trim())
      .filter(q => q.length > 0 && !q.startsWith('--') && q.includes('SELECT'))
      .map(q => {
        // Extract just the SELECT statement
        const match = q.match(/(SELECT[\s\S]*?);/);
        return match ? match[1] + ';' : q;
      })
      .filter(q => q.trim().length > 0);
    
    console.log('📊 Running Database Schema Checks...\n');
    console.log('='.repeat(60));
    
    // Run each query
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i].trim();
      if (!query || query.length < 10) continue;
      
      try {
        console.log(`\n📋 Query ${i + 1}:`);
        console.log('─'.repeat(60));
        
        const result = await client.query(query);
        
        if (result.rows && result.rows.length > 0) {
          console.table(result.rows);
          console.log(`\n✅ Found ${result.rows.length} row(s)`);
        } else {
          console.log('ℹ️  No rows returned');
        }
      } catch (error) {
        console.error(`❌ Error in query ${i + 1}:`, error.message);
        // Continue with next query
      }
    }
    
    await client.end();
    console.log('\n' + '='.repeat(60));
    console.log('✅ Schema check complete!\n');
    
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log('📦 Installing pg library...\n');
      console.log('Run: npm install pg --legacy-peer-deps');
      console.log('Then run this script again.\n');
    } else if (error.message?.includes('self-signed certificate')) {
      console.error('❌ SSL certificate error');
      console.error('\n💡 Alternative: Run SQL manually in Supabase SQL Editor');
      console.error('   1. Go to: https://supabase.com/dashboard');
      console.error('   2. Navigate to SQL Editor');
      console.error('   3. Open: supabase/check-schema.sql');
      console.error('   4. Copy and paste, then click "Run"\n');
    } else {
      console.error('❌ Error:', error.message);
      console.error('\n💡 Alternative: Run SQL manually in Supabase SQL Editor');
      console.error('   File: supabase/check-schema.sql\n');
    }
    process.exit(1);
  }
}

runSchemaCheck();

