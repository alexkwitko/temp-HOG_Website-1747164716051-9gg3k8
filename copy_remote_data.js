// Script to copy data from remote to local database
import { createClient } from '@supabase/supabase-js';

// Remote Supabase credentials
const remoteSupabaseUrl = 'https://yxwwmjubpkyzwmvilmsw.supabase.co';
const remoteSupabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4d3dtanVicGt5endtdmlsbXN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjU2NDgyNiwiZXhwIjoyMDYyMTQwODI2fQ.ijwmiQPDrZyTfRAfA8I1e0QBh4uRGvMDF7A4w1v9y9k';

// Local Supabase credentials
const localSupabaseUrl = 'http://localhost:54321';
const localSupabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

// Create Supabase clients
const remoteSupabase = createClient(remoteSupabaseUrl, remoteSupabaseKey);
const localSupabase = createClient(localSupabaseUrl, localSupabaseKey);

// Tables to copy
const tables = [
  'hero_slides',
  'home_page_components',
  'why_choose_cards',
  'featured_programs_config',
  'site_config',
  'site_settings',
  'programs',
  'featured_products_config',
  'products',
  'images',
  'icons_reference',
  'cta_config'
];

// Function to copy a table
async function copyTable(tableName) {
  try {
    console.log(`Copying ${tableName}...`);
    
    // Get data from remote
    const { data, error } = await remoteSupabase
      .from(tableName)
      .select('*');
    
    if (error) {
      console.error(`Error fetching remote ${tableName}:`, error.message);
      return;
    }
    
    if (!data || data.length === 0) {
      console.log(`No data found in ${tableName}`);
      return;
    }
    
    console.log(`Found ${data.length} records in ${tableName}`);
    
    // Delete existing data from local
    const { error: deleteError } = await localSupabase
      .from(tableName)
      .delete()
      .not('id', 'is', null); // Delete all records
    
    if (deleteError) {
      console.error(`Error clearing local ${tableName}:`, deleteError.message);
      // Continue anyway
    }
    
    // Insert data into local
    const { error: insertError } = await localSupabase
      .from(tableName)
      .insert(data);
    
    if (insertError) {
      console.error(`Error inserting into ${tableName}:`, insertError.message);
      
      // Try inserting one by one if batch insert fails
      console.log(`Trying to insert records one by one...`);
      let successCount = 0;
      
      for (const record of data) {
        const { error: singleInsertError } = await localSupabase
          .from(tableName)
          .insert([record]);
        
        if (!singleInsertError) {
          successCount++;
        }
      }
      
      console.log(`Inserted ${successCount}/${data.length} records individually`);
    } else {
      console.log(`Successfully inserted ${data.length} records into ${tableName}`);
    }
  } catch (err) {
    console.error(`Unexpected error copying ${tableName}:`, err);
  }
}

// Main function
async function main() {
  console.log('Starting data copy from remote to local...');
  
  for (const table of tables) {
    await copyTable(table);
  }
  
  console.log('Data copy completed.');
}

main(); 