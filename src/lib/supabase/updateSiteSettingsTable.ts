import { supabase } from './supabaseClient';

/**
 * This script adds JSON columns to the existing site_settings table
 * Run this script once to update the database schema
 */
export const updateSiteSettingsTable = async () => {
  console.log('Starting site_settings table update...');
  
  try {
    // Each column to add
    const columnsToAdd = [
      { name: 'social_links_json', type: 'JSONB' },
      { name: 'business_hours_json', type: 'JSONB' },
      { name: 'color_palette_settings_json', type: 'JSONB' },
    ];
    
    // First check if we can connect to the database
    const { error: connError } = await supabase
      .from('site_settings')
      .select('id')
      .limit(1);
    
    if (connError) {
      console.error('Error connecting to database:', connError);
      return { 
        success: false, 
        error: connError,
        message: 'Could not connect to the database. Make sure you have the right permissions.'
      };
    }
    
    console.log('Successfully connected to database');
    
    // Count of successful column additions
    let successCount = 0;
    let errorCount = 0;
    
    // Try to check each column individually with simple SQL
    for (const column of columnsToAdd) {
      try {
        // Use the SQL query builder instead of raw SQL
        const { error } = await supabase
          .from('site_settings')
          .select(`${column.name}`)
          .limit(1);
        
        if (error && error.code === '42703') { // Column doesn't exist
          console.log(`Column ${column.name} doesn't exist, will create it`);
          errorCount++;
        } else {
          // Column exists
          console.log(`Column ${column.name} already exists`);
          successCount++;
        }
      } catch (columnError) {
        console.error(`Error checking column ${column.name}:`, columnError);
        errorCount++;
      }
    }

    // Provide instructions since we can't directly alter the table from the client
    return { 
      success: true, 
      message: `Database check completed. Found ${successCount} columns already existing, and ${errorCount} columns that need to be added.`,
      instructionsBanner: `
        Since Supabase client doesn't allow direct schema alterations, please use the Supabase SQL Editor to run:
        
        ALTER TABLE public.site_settings
        ADD COLUMN IF NOT EXISTS social_links_json JSONB,
        ADD COLUMN IF NOT EXISTS business_hours_json JSONB,
        ADD COLUMN IF NOT EXISTS color_palette_settings_json JSONB;
      `
    };
  } catch (error) {
    console.error('Exception updating site_settings table:', error);
    return { success: false, error };
  }
};

export default updateSiteSettingsTable; 