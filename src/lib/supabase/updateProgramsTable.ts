import { supabase } from './supabaseClient';

/**
 * This script adds hero-style columns to the existing programs table
 * Run this script once to update the database schema
 */
export const updateProgramsTable = async () => {
  console.log('Starting program table update...');
  
  try {
    // Each column to add
    const columnsToAdd = [
      { name: 'hero_image_url', type: 'TEXT' },
      { name: 'hero_title', type: 'TEXT' },
      { name: 'hero_subtitle', type: 'TEXT' },
      { name: 'overlay_color', type: 'TEXT' },
      { name: 'overlay_opacity', type: 'FLOAT' },
      { name: 'hero_text_color', type: 'TEXT' },
      { name: 'hero_button_text', type: 'TEXT' },
      { name: 'hero_button_color', type: 'TEXT' },
      { name: 'hero_button_text_color', type: 'TEXT' },
      { name: 'hero_button_url', type: 'TEXT' },
      { name: 'video_url', type: 'TEXT' },
      { name: 'has_parallax', type: 'BOOLEAN' },
      { name: 'content_alignment', type: 'TEXT' }
    ];
    
    // First check if we can connect to the database
    const { error: connError } = await supabase
      .from('programs')
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
    
    // Try to add each column individually with simple SQL
    for (const column of columnsToAdd) {
      try {
        // Use the SQL query builder instead of raw SQL
        const { error } = await supabase
          .from('programs')
          .select(`${column.name}`)
          .limit(1);
        
        if (error && error.code === '42703') { // Column doesn't exist
          console.log(`Column ${column.name} doesn't exist, will create it`);
          
          // For this example, we can't actually alter the table directly via client
          // In a real application, you would need server-side code or Supabase functions
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
        
        ALTER TABLE public.programs
        ADD COLUMN IF NOT EXISTS hero_image_url TEXT,
        ADD COLUMN IF NOT EXISTS hero_title TEXT,
        ADD COLUMN IF NOT EXISTS hero_subtitle TEXT,
        ADD COLUMN IF NOT EXISTS overlay_color TEXT DEFAULT '#000000',
        ADD COLUMN IF NOT EXISTS overlay_opacity FLOAT DEFAULT 0.5,
        ADD COLUMN IF NOT EXISTS hero_text_color TEXT DEFAULT '#ffffff',
        ADD COLUMN IF NOT EXISTS hero_button_text TEXT DEFAULT 'Get Started',
        ADD COLUMN IF NOT EXISTS hero_button_color TEXT DEFAULT '#111827',
        ADD COLUMN IF NOT EXISTS hero_button_text_color TEXT DEFAULT '#ffffff',
        ADD COLUMN IF NOT EXISTS hero_button_url TEXT,
        ADD COLUMN IF NOT EXISTS video_url TEXT,
        ADD COLUMN IF NOT EXISTS has_parallax BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS content_alignment TEXT DEFAULT 'center';
      `
    };
  } catch (error) {
    console.error('Exception updating programs table:', error);
    return { success: false, error };
  }
};

// Call the function if this script is executed directly
if (typeof window !== 'undefined' && window.location.pathname.includes('update-database')) {
  updateProgramsTable().then(result => {
    console.log('Update result:', result);
  });
}

export default updateProgramsTable; 