#!/usr/bin/env node
/**
 * Run Supabase migrations - Outputs SQL for manual execution
 * 
 * Usage: node scripts/run-migrations.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrations = [
  { file: '001_initial_schema.sql', desc: 'Initial Schema - Creates all tables' },
  { file: '002_add_indexes.sql', desc: 'Indexes - Adds performance indexes' },
  { file: '003_add_rls_policies.sql', desc: 'RLS Policies - Sets up Row Level Security' }
];

console.log('🚀 TourCommand Migration SQL Generator');
console.log('=====================================\n');
console.log('⚠️  Supabase requires SQL to be executed via SQL Editor');
console.log('This script will output all migration SQL for you to copy/paste.\n');

migrations.forEach((migration, index) => {
  try {
    const filePath = path.join(__dirname, '..', 'supabase', 'migrations', migration.file);
    const sql = fs.readFileSync(filePath, 'utf-8');
    
    console.log('\n' + '='.repeat(70));
    console.log(`Migration ${index + 1}/3: ${migration.desc}`);
    console.log(`File: ${migration.file}`);
    console.log('='.repeat(70));
    console.log('\n--- COPY FROM HERE ---\n');
    console.log(sql);
    console.log('\n--- END OF SQL ---\n');
  } catch (error) {
    console.error(`❌ Error reading ${migration.file}:`, error.message);
  }
});

console.log('\n✅ All migration SQL prepared!');
console.log('\n📋 Instructions:');
console.log('1. Go to: https://supabase.com/dashboard/project/shkitxtebwjokkcygecn/sql/new');
console.log('2. Copy each migration SQL above (one at a time)');
console.log('3. Paste into SQL Editor');
console.log('4. Click "Run" (or press Cmd/Ctrl + Enter)');
console.log('5. Verify "Success" message');
console.log('6. Repeat for next migration\n');

