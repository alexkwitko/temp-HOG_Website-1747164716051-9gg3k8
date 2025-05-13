// Script to copy ALL data from remote to local database, including auth
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

// Get all schemas and tables
const schemas = [
  { schema: 'public', skipTables: [] },
  { schema: 'auth', tables: ['users', 'identities', 'sessions', 'refresh_tokens', 'mfa_factors', 'mfa_challenges', 'mfa_amr_claims', 'flow_state'] }
];

// Helper function to get all tables in a schema
async function getTables(schema) {
  try {
    // For auth schema, we use predefined tables
    if (schema.tables) {
      return schema.tables;
    }
    
    // For public schema, query tables
    const { data, error } = await remoteSupabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', schema.schema)
      .neq('table_name', 'schema_migrations'); // Skip migration table
    
    if (error) {
      console.error(`Error fetching tables for schema ${schema.schema}:`, error);
      return [];
    }
    
    // Filter out tables to skip
    return data
      .map(table => table.table_name)
      .filter(tableName => !schema.skipTables.includes(tableName));
  } catch (error) {
    console.error(`Error in getTables for schema ${schema.schema}:`, error);
    return [];
  }
}

async function copyTableData(schema, tableName) {
  try {
    const fullTableName = `${schema}.${tableName}`;
    console.log(`Copying data from ${fullTableName}...`);
    
    // Fetch data from remote
    let query = remoteSupabase.from(tableName);
    
    // Only use schema for auth tables
    if (schema !== 'public') {
      query = remoteSupabase.schema(schema).from(tableName);
    }
    
    const { data: remoteData, error: remoteError } = await query.select('*');
    
    if (remoteError) {
      console.error(`Error fetching from remote ${fullTableName}:`, remoteError);
      return;
    }
    
    if (!remoteData || remoteData.length === 0) {
      console.log(`No data found in remote ${fullTableName}`);
      return;
    }
    
    console.log(`Found ${remoteData.length} records in ${fullTableName}`);
    
    // Delete existing data from local table
    let deleteQuery = localSupabase.from(tableName);
    
    // Only use schema for auth tables
    if (schema !== 'public') {
      deleteQuery = localSupabase.schema(schema).from(tableName);
    }
    
    const { error: deleteError } = await deleteQuery
      .delete()
      .neq('id', 'dummy_value_for_empty_filter'); // This creates a "delete all" query
    
    if (deleteError) {
      console.error(`Error clearing local ${fullTableName}:`, deleteError);
      
      // Special handling for tables where we can't just delete everything
      if (schema === 'auth' && tableName === 'users') {
        console.log('Skipping deletion of auth.users, will try to upsert instead');
      } else {
        return;
      }
    }
    
    // Insert remote data into local
    let insertQuery = localSupabase.from(tableName);
    
    // Only use schema for auth tables
    if (schema !== 'public') {
      insertQuery = localSupabase.schema(schema).from(tableName);
    }
    
    // For auth users table, use upsert to handle conflicts
    if (schema === 'auth' && tableName === 'users') {
      const { error: upsertError } = await insertQuery.upsert(remoteData, { onConflict: 'id' });
      
      if (upsertError) {
        console.error(`Error upserting into local ${fullTableName}:`, upsertError);
        return;
      }
    } else {
      // Standard insert for other tables
      const { error: insertError } = await insertQuery.insert(remoteData);
      
      if (insertError) {
        console.error(`Error inserting into local ${fullTableName}:`, insertError);
        return;
      }
    }
    
    console.log(`✓ Successfully copied ${remoteData.length} records to ${fullTableName}`);
  } catch (error) {
    console.error(`Unexpected error with ${schema}.${tableName}:`, error);
  }
}

async function copyStorage() {
  try {
    console.log('Getting list of buckets...');
    
    // Get list of buckets from remote
    const { data: buckets, error: bucketsError } = await remoteSupabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error getting buckets:', bucketsError);
      return;
    }
    
    for (const bucket of buckets) {
      console.log(`Processing bucket: ${bucket.name}`);
      
      // Create bucket locally if it doesn't exist
      const { error: createBucketError } = await localSupabase.storage.createBucket(bucket.name, {
        public: bucket.public,
        allowedMimeTypes: bucket.allowed_mime_types,
        fileSizeLimit: bucket.file_size_limit
      });
      
      if (createBucketError && !createBucketError.message.includes('already exists')) {
        console.error(`Error creating bucket ${bucket.name}:`, createBucketError);
        continue;
      }
      
      // Get list of files in the bucket
      const { data: files, error: filesError } = await remoteSupabase.storage.from(bucket.name).list();
      
      if (filesError) {
        console.error(`Error listing files in bucket ${bucket.name}:`, filesError);
        continue;
      }
      
      console.log(`Found ${files.length} files in bucket ${bucket.name}`);
      
      for (const file of files) {
        // Skip folder objects
        if (file.name.endsWith('/') || file.name === '.emptyFolderPlaceholder') continue;
        
        try {
          console.log(`Copying file: ${bucket.name}/${file.name}`);
          
          // Download file from remote
          const { data: fileData, error: downloadError } = await remoteSupabase.storage
            .from(bucket.name)
            .download(file.name);
          
          if (downloadError) {
            console.error(`Error downloading ${file.name}:`, downloadError);
            continue;
          }
          
          // Upload to local
          const { error: uploadError } = await localSupabase.storage
            .from(bucket.name)
            .upload(file.name, fileData, {
              contentType: file.metadata?.mimetype || 'application/octet-stream',
              upsert: true
            });
          
          if (uploadError) {
            console.error(`Error uploading ${file.name}:`, uploadError);
            continue;
          }
          
          console.log(`✓ Copied ${bucket.name}/${file.name}`);
        } catch (fileError) {
          console.error(`Error processing file ${file.name}:`, fileError);
        }
      }
    }
    
    console.log('Storage copying completed');
  } catch (error) {
    console.error('Error copying storage:', error);
  }
}

async function main() {
  console.log('Starting comprehensive database clone from remote to local...');
  
  // Process each schema
  for (const schemaObj of schemas) {
    const schemaName = schemaObj.schema;
    console.log(`Processing schema: ${schemaName}`);
    
    // Get tables for this schema
    const tables = await getTables(schemaObj);
    console.log(`Found ${tables.length} tables in schema ${schemaName}`);
    
    // Copy each table
    for (const table of tables) {
      await copyTableData(schemaName, table);
    }
  }
  
  // Copy storage buckets and files
  await copyStorage();
  
  console.log('Database clone completed successfully!');
}

main().catch(error => {
  console.error('Failed to complete database clone:', error);
  process.exit(1);
}); 