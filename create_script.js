// Script to extract data from remote database and generate SQL scripts
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Remote Supabase credentials
const remoteSupabaseUrl = 'https://yxwwmjubpkyzwmvilmsw.supabase.co';
const remoteSupabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4d3dtanVicGt5endtdmlsbXN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjU2NDgyNiwiZXhwIjoyMDYyMTQwODI2fQ.ijwmiQPDrZyTfRAfA8I1e0QBh4uRGvMDF7A4w1v9y9k';

// Create Supabase client
const remoteSupabase = createClient(remoteSupabaseUrl, remoteSupabaseKey);

// Tables to copy (in the order they should be copied due to potential dependencies)
const tables = [
  'site_config',
  'site_settings',
  'hero_slides',
  'programs',
  'featured_programs_config',
  'home_page_components',
  'why_choose_cards',
  'icons_reference',
  'images',
  'products',
  'featured_products_config',
];

// Create a directory for SQL scripts if it doesn't exist
if (!fs.existsSync('./sql_scripts')) {
  fs.mkdirSync('./sql_scripts');
}

// Helper function to convert a JavaScript value to a SQL string
function toSqlValue(value) {
  if (value === null) {
    return 'NULL';
  } else if (typeof value === 'string') {
    return `'${value.replace(/'/g, "''")}'`;
  } else if (typeof value === 'number') {
    return value.toString();
  } else if (typeof value === 'boolean') {
    return value ? 'TRUE' : 'FALSE';
  } else if (Array.isArray(value)) {
    // Handle arrays like UUID[] by creating an array literal
    const arrayStr = value.map(toSqlValue).join(', ');
    return `ARRAY[${arrayStr}]`;
  } else if (typeof value === 'object') {
    // Handle objects by converting to JSON
    return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
  }
  return `'${value}'`;
}

async function generateSqlScriptForTable(tableName) {
  try {
    console.log(`Generating SQL script for ${tableName}...`);
    
    // Fetch data from remote
    const { data: remoteData, error: remoteError } = await remoteSupabase
      .from(tableName)
      .select('*');
    
    if (remoteError) {
      console.error(`Error fetching from remote ${tableName}:`, remoteError);
      return;
    }
    
    if (!remoteData || remoteData.length === 0) {
      console.log(`No data found in remote ${tableName}`);
      return;
    }
    
    console.log(`Found ${remoteData.length} records in ${tableName}`);
    
    // Generate SQL script
    let sqlScript = `-- SQL Script for ${tableName}\n`;
    sqlScript += `-- Generated on ${new Date().toISOString()}\n\n`;
    
    // Delete existing data
    sqlScript += `-- Clear existing data\n`;
    sqlScript += `DELETE FROM ${tableName};\n\n`;
    
    // Insert statements
    sqlScript += `-- Insert data\n`;
    
    for (const record of remoteData) {
      const columns = Object.keys(record).filter(key => record[key] !== null || record[key] !== undefined);
      const values = columns.map(column => toSqlValue(record[column]));
      
      sqlScript += `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')});\n`;
    }
    
    // Write to file
    fs.writeFileSync(`./sql_scripts/${tableName}.sql`, sqlScript);
    console.log(`✓ Generated SQL script for ${tableName}`);
  } catch (error) {
    console.error(`Unexpected error with ${tableName}:`, error);
  }
}

async function main() {
  console.log('Starting SQL script generation...');
  
  for (const table of tables) {
    await generateSqlScriptForTable(table);
  }
  
  console.log('SQL script generation completed.');
}

main().catch(error => {
  console.error('Failed to generate SQL scripts:', error);
  process.exit(1);
}); 