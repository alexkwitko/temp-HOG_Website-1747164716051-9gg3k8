// Script to list all public tables
import { createClient } from '@supabase/supabase-js';

// Remote Supabase credentials
const remoteSupabaseUrl = 'https://yxwwmjubpkyzwmvilmsw.supabase.co';
const remoteSupabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4d3dtanVicGt5endtdmlsbXN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjU2NDgyNiwiZXhwIjoyMDYyMTQwODI2fQ.ijwmiQPDrZyTfRAfA8I1e0QBh4uRGvMDF7A4w1v9y9k';

// Create Supabase client
const remoteSupabase = createClient(remoteSupabaseUrl, remoteSupabaseKey);

async function listTables() {
  const tables = [];
  
  try {
    const { data, error } = await remoteSupabase.rpc('list_tables');
    
    if (error) {
      console.error('Error listing tables:', error);
      
      // Fallback: try to get list of tables we've successfully used before
      console.log('Using hardcoded list of known tables');
      return [
        'hero_slides',
        'home_page_components',
        'why_choose_cards',
        'featured_programs_config',
        'featured_products_config',
        'programs',
        'program_categories',
        'products',
        'product_categories',
        'cta_config',
        'location_config',
        'site_config',
        'site_settings',
        'images',
        'icons_reference',
      ];
    }
    
    console.log('Tables found:', data);
    tables.push(...data);
  } catch (err) {
    console.error('Error:', err);
    
    // Try direct SQL query using supabase function
    try {
      const { data, error } = await remoteSupabase.rpc('list_tables_direct');
      
      if (error) {
        console.error('Error with direct query:', error);
        return tables;
      }
      
      console.log('Tables found with direct query:', data);
      tables.push(...data);
    } catch (directErr) {
      console.error('Error with direct query:', directErr);
    }
  }
  
  return tables;
}

// Create the RPC function to list tables
async function createListTablesFunctions() {
  try {
    // Create function to list tables
    await remoteSupabase.rpc('create_list_tables_function', {});
    console.log('Created list_tables function');
    
    // Create direct SQL function
    await remoteSupabase.rpc('create_list_tables_direct_function', {});
    console.log('Created list_tables_direct function');
  } catch (err) {
    console.error('Error creating RPC functions:', err);
    console.log('Functions may already exist or insufficient permissions');
  }
}

async function main() {
  await createListTablesFunctions();
  const tables = await listTables();
  console.log('All tables:', tables);
}

main(); 