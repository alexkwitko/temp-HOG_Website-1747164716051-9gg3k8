import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Supabase connection
const supabaseUrl = process.env.SUPABASE_URL || 'https://yxwwmjubpkyzwmvilmsw.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY environment variable is not set');
  console.error('Please set the environment variable or create a .env file with SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Directory containing SQL migration files
const migrationsDir = path.join(process.cwd(), 'migrations');

// List of required tables and their fix scripts
const requiredMigrations = [
  {
    name: 'home_page_components - Missing columns fix',
    check: async () => {
      try {
        // Check if home_page_components exists and if it's missing columns
        const { data, error } = await supabase
          .from('home_page_components')
          .select('margin')
          .limit(1);
        
        // If we get a specific error about column not existing, run the fix
        return error && error.message && error.message.includes('column') && error.message.includes('not exist');
      } catch (err) {
        // If table doesn't exist, we'll create it elsewhere
        return false;
      }
    },
    fix: async () => {
      console.log('Adding missing columns to home_page_components table...');
      return await supabase.rpc('exec_sql', {
        sql: `
          ALTER TABLE IF EXISTS public.home_page_components 
          ADD COLUMN IF NOT EXISTS margin TEXT DEFAULT '0px',
          ADD COLUMN IF NOT EXISTS width TEXT DEFAULT '100%',
          ADD COLUMN IF NOT EXISTS height TEXT DEFAULT 'auto',
          ADD COLUMN IF NOT EXISTS vertical_align TEXT DEFAULT 'center',
          ADD COLUMN IF NOT EXISTS horizontal_align TEXT DEFAULT 'center';
        `
      });
    }
  },
  {
    name: 'methodology table',
    check: async () => {
      try {
        // Check if methodology table exists
        const { data, error } = await supabase
          .from('methodology')
          .select('id')
          .limit(1);
        
        // If there's an error, likely the table doesn't exist
        return !!error;
      } catch (err) {
        return true; // Run the migration if we catch an error
      }
    },
    fix: async () => {
      console.log('Setting up methodology table...');
      
      // Drop and recreate the table
      await supabase.rpc('exec_sql', { 
        sql: 'DROP TABLE IF EXISTS public.methodology;' 
      });
      
      // Create the table
      await supabase.rpc('exec_sql', { 
        sql: `
          CREATE TABLE IF NOT EXISTS public.methodology (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            icon_name TEXT NOT NULL,
            "order" INTEGER NOT NULL,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        ` 
      });
      
      // Enable RLS
      await supabase.rpc('exec_sql', {
        sql: 'ALTER TABLE public.methodology ENABLE ROW LEVEL SECURITY;'
      });
      
      // Set up policies
      await supabase.rpc('exec_sql', {
        sql: `
          -- Drop any existing policies
          DROP POLICY IF EXISTS "Allow public read access for methodology" ON public.methodology;
          DROP POLICY IF EXISTS "Allow authenticated users to update methodology" ON public.methodology;
          DROP POLICY IF EXISTS "Allow authenticated users to insert methodology" ON public.methodology;
          DROP POLICY IF EXISTS "Allow authenticated users to delete methodology" ON public.methodology;

          -- Create policies
          -- Allow anyone to read
          CREATE POLICY "Allow public read access for methodology" 
          ON public.methodology FOR SELECT 
          USING (true);

          -- Allow authenticated users to update
          CREATE POLICY "Allow authenticated users to update methodology" 
          ON public.methodology FOR UPDATE
          USING (auth.role() = 'authenticated')
          WITH CHECK (auth.role() = 'authenticated');

          -- Allow authenticated users to insert
          CREATE POLICY "Allow authenticated users to insert methodology" 
          ON public.methodology FOR INSERT
          WITH CHECK (auth.role() = 'authenticated');

          -- Allow authenticated users to delete
          CREATE POLICY "Allow authenticated users to delete methodology" 
          ON public.methodology FOR DELETE
          USING (auth.role() = 'authenticated');
        `
      });
      
      // Create trigger
      await supabase.rpc('exec_sql', {
        sql: `
          -- Create trigger for updated_at
          CREATE OR REPLACE FUNCTION public.set_updated_at()
          RETURNS TRIGGER AS $$
          BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
          END;
          $$ LANGUAGE plpgsql;

          DROP TRIGGER IF EXISTS set_methodology_updated_at ON public.methodology;

          CREATE TRIGGER set_methodology_updated_at
          BEFORE UPDATE ON public.methodology
          FOR EACH ROW
          EXECUTE FUNCTION public.set_updated_at();
        `
      });
      
      // Insert default data
      return await supabase.rpc('exec_sql', {
        sql: `
          INSERT INTO public.methodology (id, title, description, icon_name, "order", is_active)
          VALUES 
            ('fundamental', 'Fundamentals First', 'Master the core techniques and principles that form the foundation of effective BJJ.', 'Shield', 1, true),
            ('progressive', 'Progressive Learning', 'Structured curriculum that builds complexity as you advance in your journey.', 'Target', 2, true),
            ('conceptual', 'Conceptual Understanding', 'Focus on the underlying principles that connect techniques and positions.', 'Brain', 3, true),
            ('practical', 'Practical Application', 'Regular drilling and sparring to develop real-world effectiveness.', 'Dumbbell', 4, true)
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            icon_name = EXCLUDED.icon_name,
            "order" = EXCLUDED."order",
            is_active = EXCLUDED.is_active;
        `
      });
    }
  }
];

// Function to run migrations
async function runMigrations() {
  console.log('Running automatic database migrations...');
  
  try {
    // Create migrations directory if it doesn't exist
    if (!fs.existsSync(migrationsDir)) {
      fs.mkdirSync(migrationsDir, { recursive: true });
      console.log(`Created migrations directory: ${migrationsDir}`);
    }
    
    // Run required migrations
    for (const migration of requiredMigrations) {
      console.log(`Checking migration: ${migration.name}`);
      
      try {
        const shouldRun = await migration.check();
        
        if (shouldRun) {
          console.log(`Running migration: ${migration.name}`);
          const result = await migration.fix();
          
          if (result.error) {
            console.error(`Error in migration ${migration.name}:`, result.error);
          } else {
            console.log(`Migration ${migration.name} completed successfully`);
          }
        } else {
          console.log(`Migration ${migration.name} not needed`);
        }
      } catch (err) {
        console.error(`Error checking or running migration ${migration.name}:`, err);
      }
    }
    
    // Run additional SQL migrations from files
    if (fs.existsSync(migrationsDir)) {
      const files = fs.readdirSync(migrationsDir);
      const sqlFiles = files.filter(file => file.endsWith('.sql'));
      
      for (const file of sqlFiles) {
        const filePath = path.join(migrationsDir, file);
        console.log(`Running SQL migration from file: ${file}`);
        
        try {
          const sql = fs.readFileSync(filePath, 'utf8');
          const result = await supabase.rpc('exec_sql', { sql });
          
          if (result.error) {
            console.error(`Error in SQL file ${file}:`, result.error);
          } else {
            console.log(`SQL migration ${file} completed successfully`);
          }
        } catch (err) {
          console.error(`Error reading or executing SQL file ${file}:`, err);
        }
      }
    }
    
    console.log('All migrations completed!');
  } catch (err) {
    console.error('Unexpected error during migrations:', err);
    process.exit(1);
  }
}

// Run the migrations
runMigrations(); 