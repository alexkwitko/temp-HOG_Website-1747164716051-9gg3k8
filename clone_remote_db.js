// Script to clone remote database to local
import { createClient } from '@supabase/supabase-js';

// Remote Supabase credentials
const remoteSupabaseUrl = 'https://yxwwmjubpkyzwmvilmsw.supabase.co';
const remoteSupabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4d3dtanVicGt5endtdmlsbXN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjU2NDgyNiwiZXhwIjoyMDYyMTQwODI2fQ.ijwmiQPDrZyTfRAfA8I1e0QBh4uRGvMDF7A4w1v9y9k';

// Local Supabase credentials
const localSupabaseUrl = 'http://localhost:54322';
const localSupabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

// Create Supabase clients
const remoteSupabase = createClient(remoteSupabaseUrl, remoteSupabaseKey);
const localSupabase = createClient(localSupabaseUrl, localSupabaseKey);

// Known tables to copy in the public schema
const knownTables = [
  // Core website components
  'hero_slides',
  'home_page_components',
  'why_choose_cards',
  'featured_programs_config',
  'featured_products_config',
  'cta_config',
  'location_config',
  'site_config',
  'site_settings',
  
  // Content tables
  'programs',
  'program_categories',
  'products',
  'product_categories',
  'images',
  'icons_reference',
];

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

// Helper function to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to retry operation
async function withRetry(operation, name, retries = MAX_RETRIES) {
  try {
    return await operation();
  } catch (error) {
    if (retries <= 0) {
      console.error(`Failed after max retries: ${name}`, error);
      throw error;
    }
    
    console.log(`Retrying ${name}, attempts remaining: ${retries}`);
    await wait(RETRY_DELAY);
    return withRetry(operation, name, retries - 1);
  }
}

async function copyTable(tableName) {
  try {
    console.log(`Copying table: ${tableName}...`);
    
    // Fetch data from remote
    const { data: remoteData, error: remoteError } = await withRetry(
      () => remoteSupabase.from(tableName).select('*'),
      `fetch ${tableName}`
    );
    
    if (remoteError) {
      console.error(`Error fetching from remote ${tableName}:`, remoteError);
      return false;
    }
    
    if (!remoteData || remoteData.length === 0) {
      console.log(`No data found in remote ${tableName}`);
      return true; // Successfully copied (just empty)
    }
    
    console.log(`Found ${remoteData.length} records in ${tableName}`);
    
    // Delete existing data from local table
    const { error: deleteError } = await withRetry(
      () => localSupabase.from(tableName).delete().neq('id', 'dummy_value_for_empty_filter'),
      `delete from ${tableName}`
    );
    
    if (deleteError) {
      console.error(`Error clearing local ${tableName}:`, deleteError);
      
      // Check if it's a foreign key constraint error
      if (deleteError.message && deleteError.message.includes('violates foreign key constraint')) {
        console.log(`Foreign key constraint detected for ${tableName}, skipping deletion`);
      } else {
        return false;
      }
    }
    
    // Insert remote data into local in chunks to avoid payload limits
    const CHUNK_SIZE = 100;
    
    for (let i = 0; i < remoteData.length; i += CHUNK_SIZE) {
      const chunk = remoteData.slice(i, i + CHUNK_SIZE);
      
      // Try upsert first, fall back to insert if that fails
      try {
        const { error: upsertError } = await withRetry(
          () => localSupabase.from(tableName).upsert(chunk, { onConflict: 'id' }),
          `upsert chunk ${i / CHUNK_SIZE + 1} to ${tableName}`
        );
        
        if (upsertError) {
          console.error(`Error upserting chunk ${i / CHUNK_SIZE + 1} to ${tableName}:`, upsertError);
          
          // Try insert instead
          const { error: insertError } = await withRetry(
            () => localSupabase.from(tableName).insert(chunk),
            `insert chunk ${i / CHUNK_SIZE + 1} to ${tableName}`
          );
          
          if (insertError) {
            console.error(`Error inserting chunk ${i / CHUNK_SIZE + 1} to ${tableName}:`, insertError);
            return false;
          }
        }
      } catch (err) {
        console.error(`Unexpected error with chunk ${i / CHUNK_SIZE + 1} of ${tableName}:`, err);
        return false;
      }
      
      console.log(`Copied chunk ${i / CHUNK_SIZE + 1}/${Math.ceil(remoteData.length / CHUNK_SIZE)} of ${tableName}`);
    }
    
    console.log(`✓ Successfully copied ${remoteData.length} records to ${tableName}`);
    return true;
  } catch (error) {
    console.error(`Unexpected error with ${tableName}:`, error);
    return false;
  }
}

async function copyStorage() {
  try {
    console.log('Getting list of storage buckets...');
    
    // List buckets from remote
    const { data: buckets, error: bucketsError } = await withRetry(
      () => remoteSupabase.storage.listBuckets(),
      'list buckets'
    );
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return false;
    }
    
    console.log(`Found ${buckets.length} buckets`);
    
    for (const bucket of buckets) {
      console.log(`Processing bucket: ${bucket.name}`);
      
      // Create bucket locally if it doesn't exist
      try {
        const { error: createBucketError } = await withRetry(
          () => localSupabase.storage.createBucket(bucket.name, {
            public: bucket.public,
            fileSizeLimit: bucket.file_size_limit || null,
          }),
          `create bucket ${bucket.name}`
        );
        
        if (createBucketError && !createBucketError.message.includes('already exists')) {
          console.error(`Error creating bucket ${bucket.name}:`, createBucketError);
          continue;
        }
      } catch (err) {
        console.log(`Bucket ${bucket.name} may already exist, trying to continue`);
      }
      
      // Get list of files in the bucket
      const { data: files, error: filesError } = await withRetry(
        () => remoteSupabase.storage.from(bucket.name).list(),
        `list files in ${bucket.name}`
      );
      
      if (filesError) {
        console.error(`Error listing files in bucket ${bucket.name}:`, filesError);
        continue;
      }
      
      console.log(`Found ${files.length} files/folders in bucket ${bucket.name}`);
      
      // Process each file
      for (const file of files) {
        // Skip folders and placeholder files
        if (file.name.endsWith('/') || file.name === '.emptyFolderPlaceholder') {
          console.log(`Skipping folder: ${file.name}`);
          continue;
        }
        
        console.log(`Processing file: ${bucket.name}/${file.name}`);
        
        try {
          // Download file from remote
          const { data: fileData, error: downloadError } = await withRetry(
            () => remoteSupabase.storage.from(bucket.name).download(file.name),
            `download ${bucket.name}/${file.name}`
          );
          
          if (downloadError) {
            console.error(`Error downloading ${file.name}:`, downloadError);
            continue;
          }
          
          // Upload to local
          const { error: uploadError } = await withRetry(
            () => localSupabase.storage.from(bucket.name).upload(file.name, fileData, {
              contentType: file.metadata?.mimetype || 'application/octet-stream',
              upsert: true
            }),
            `upload ${bucket.name}/${file.name}`
          );
          
          if (uploadError) {
            console.error(`Error uploading ${file.name}:`, uploadError);
            continue;
          }
          
          console.log(`✓ Copied file ${bucket.name}/${file.name}`);
        } catch (fileError) {
          console.error(`Error processing file ${file.name}:`, fileError);
        }
      }
    }
    
    console.log('Storage copying completed');
    return true;
  } catch (error) {
    console.error('Error copying storage:', error);
    return false;
  }
}

async function main() {
  console.log('Starting database clone operation...');
  
  let successCount = 0;
  let failCount = 0;
  
  // Copy known tables
  for (const table of knownTables) {
    const success = await copyTable(table);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }
  
  // Copy storage
  const storageSuccess = await copyStorage();
  
  // Final summary
  console.log('\n== Database Clone Summary ==');
  console.log(`Tables: ${successCount} succeeded, ${failCount} failed`);
  console.log(`Storage: ${storageSuccess ? 'Succeeded' : 'Failed'}`);
  console.log('Database clone operation completed.');
}

main().catch(error => {
  console.error('Fatal error in clone operation:', error);
  process.exit(1);
}); 