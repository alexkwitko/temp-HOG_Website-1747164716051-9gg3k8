import pg from 'pg';
import fs from 'fs';

// Load the migration SQL
const migrationSQL = fs.readFileSync('./supabase/migrations/20240625_create_methodology_table.sql', 'utf8');

// Function to execute the migration
async function runMigration() {
  // Get credentials from environment variables
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('Error: DATABASE_URL environment variable is not set');
    console.log('Run this script with: DATABASE_URL=your_postgres_connection_string node simple-migration.js');
    process.exit(1);
  }

  console.log('Connecting to database...');
  const client = new pg.Client({ connectionString });
  
  try {
    await client.connect();
    console.log('Connected to database. Running migration...');
    
    // Execute the entire SQL migration
    await client.query(migrationSQL);
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error executing migration:', error);
  } finally {
    await client.end();
  }
}

runMigration(); 