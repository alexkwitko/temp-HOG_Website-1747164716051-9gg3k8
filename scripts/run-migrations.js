#!/usr/bin/env node

/**
 * Automated migration script for KJY remote database
 * Run with: node scripts/run-migrations.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get env variables or use defaults
const KJY_SUPABASE_URL = process.env.KJY_SUPABASE_URL || 'https://yxwwmjubpkyzwmvilmsw.supabase.co';
const KJY_SUPABASE_KEY = process.env.KJY_SUPABASE_KEY || process.env.SUPABASE_KEY;
const KJY_SUPABASE_SERVICE_KEY = process.env.KJY_SUPABASE_SERVICE_KEY;

if (!KJY_SUPABASE_KEY && !KJY_SUPABASE_SERVICE_KEY) {
  console.error('Error: No KJY database keys provided. Please set KJY_SUPABASE_KEY or KJY_SUPABASE_SERVICE_KEY in .env');
  process.exit(1);
}

// Use service key if available, otherwise use anon key
const supabaseKey = KJY_SUPABASE_SERVICE_KEY || KJY_SUPABASE_KEY;

// Create Supabase client
const supabase = createClient(KJY_SUPABASE_URL, supabaseKey);

/**
 * Run site_settings migrations
 */
async function runSiteSettingsMigration() {
  console.log('Running site_settings migration...');
  
  try {
    // Check if we can connect to the database
    const { data: testData, error: connError } = await supabase
      .from('site_settings')
      .select('id')
      .limit(1);
    
    if (connError) {
      console.error('Error connecting to database:', connError);
      return { success: false, error: connError };
    }
    
    console.log('Connected to KJY database successfully');

    // List of columns we want to make sure exist
    const columnsToAdd = [
      { name: 'social_links_json', type: 'JSONB' },
      { name: 'business_hours_json', type: 'JSONB' },
      { name: 'color_palette_settings_json', type: 'JSONB' },
    ];
    
    // Check columns and build SQL
    let columnsToAddSQL = [];
    
    for (const column of columnsToAdd) {
      try {
        // Try to query the column
        const { error } = await supabase
          .from('site_settings')
          .select(`${column.name}`)
          .limit(1);
        
        if (error && error.code === '42703') { // Column doesn't exist
          console.log(`Column ${column.name} doesn't exist, will create it`);
          columnsToAddSQL.push(`ADD COLUMN IF NOT EXISTS ${column.name} ${column.type}`);
        } else {
          console.log(`Column ${column.name} already exists`);
        }
      } catch (columnError) {
        console.error(`Error checking column ${column.name}:`, columnError);
        columnsToAddSQL.push(`ADD COLUMN IF NOT EXISTS ${column.name} ${column.type}`);
      }
    }
    
    // If there are columns to add, run SQL
    if (columnsToAddSQL.length > 0) {
      const sql = `
        ALTER TABLE public.site_settings
        ${columnsToAddSQL.join(',\n        ')};
      `;
      
      console.log('Running SQL:', sql);
      
      // Run the SQL if we have a service key
      if (KJY_SUPABASE_SERVICE_KEY) {
        const { error: sqlError } = await supabase.rpc('exec_sql', { query: sql });
        
        if (sqlError) {
          console.error('Error executing SQL:', sqlError);
          return { success: false, error: sqlError };
        }
        
        console.log('Successfully updated site_settings table');
      } else {
        console.log('Service key not provided, cannot run SQL directly. SQL to run:');
        console.log(sql);
        return { success: false, message: 'Service key not provided, cannot run SQL directly' };
      }
    } else {
      console.log('No columns need to be added to site_settings table');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Exception updating site_settings table:', error);
    return { success: false, error };
  }
}

/**
 * Run programs table migrations
 */
async function runProgramsMigration() {
  console.log('Running programs table migration...');
  
  try {
    // Check if we can connect to the database
    const { error: connError } = await supabase
      .from('programs')
      .select('id')
      .limit(1);
    
    if (connError) {
      console.error('Error connecting to database:', connError);
      return { success: false, error: connError };
    }
    
    // Define columns to check and add if missing
    const columnsToAdd = [
      { name: 'hero_background_url', type: 'TEXT' },
      { name: 'hero_title', type: 'TEXT' },
      { name: 'hero_subtitle', type: 'TEXT' },
      { name: 'hero_description', type: 'TEXT' },
    ];
    
    let columnsToAddSQL = [];
    
    for (const column of columnsToAdd) {
      try {
        const { error } = await supabase
          .from('programs')
          .select(`${column.name}`)
          .limit(1);
        
        if (error && error.code === '42703') { // Column doesn't exist
          console.log(`Column ${column.name} doesn't exist, will create it`);
          columnsToAddSQL.push(`ADD COLUMN IF NOT EXISTS ${column.name} ${column.type}`);
        } else {
          console.log(`Column ${column.name} already exists`);
        }
      } catch (columnError) {
        console.error(`Error checking column ${column.name}:`, columnError);
        columnsToAddSQL.push(`ADD COLUMN IF NOT EXISTS ${column.name} ${column.type}`);
      }
    }
    
    // If there are columns to add, run SQL
    if (columnsToAddSQL.length > 0) {
      const sql = `
        ALTER TABLE public.programs
        ${columnsToAddSQL.join(',\n        ')};
      `;
      
      console.log('Running SQL:', sql);
      
      // Run the SQL if we have a service key
      if (KJY_SUPABASE_SERVICE_KEY) {
        const { error: sqlError } = await supabase.rpc('exec_sql', { query: sql });
        
        if (sqlError) {
          console.error('Error executing SQL:', sqlError);
          return { success: false, error: sqlError };
        }
        
        console.log('Successfully updated programs table');
      } else {
        console.log('Service key not provided, cannot run SQL directly. SQL to run:');
        console.log(sql);
        return { success: false, message: 'Service key not provided, cannot run SQL directly' };
      }
    } else {
      console.log('No columns need to be added to programs table');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Exception updating programs table:', error);
    return { success: false, error };
  }
}

/**
 * Main function
 */
async function main() {
  console.log(`Running migrations on KJY remote database: ${KJY_SUPABASE_URL}`);
  
  // Run site_settings migration
  const siteSettingsResult = await runSiteSettingsMigration();
  
  // Run programs migration
  const programsResult = await runProgramsMigration();
  
  if (siteSettingsResult.success && programsResult.success) {
    console.log('✅ All migrations completed successfully');
  } else {
    console.error('❌ Some migrations failed');
    process.exit(1);
  }
}

// Run the script
main().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
}); 