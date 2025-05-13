import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Function to execute the migration
async function runMigration() {
  // Get credentials from environment variables or replace with your actual values
  const supabaseUrl = process.env.SUPABASE_URL || 'https://yxwwmjubpkyzwmvilmsw.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseKey) {
    console.error('Error: SUPABASE_SERVICE_ROLE_KEY environment variable is not set');
    console.log('Run this script with: SUPABASE_SERVICE_ROLE_KEY=your_service_role_key node run-home-components-migration.js');
    process.exit(1);
  }

  console.log('Connecting to Supabase...');
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Read the migration file
  const migrationSQL = fs.readFileSync('./supabase/migrations/20240626_create_home_components_table.sql', 'utf8');
  
  console.log('Running migration...');
  try {
    const result = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (result.error) {
      console.error('Migration failed:', result.error);
      
      // If exec_sql isn't available, try running in separate steps
      console.log('Attempting to run migration in steps...');
      await runMigrationInSteps(supabase);
    } else {
      console.log('Migration completed successfully!');
    }
  } catch (error) {
    console.error('Error executing migration:', error);
    
    // Try running in separate steps as fallback
    console.log('Attempting to run migration in steps...');
    await runMigrationInSteps(supabase);
  }
}

async function runMigrationInSteps(supabase) {
  try {
    // 1. Drop the existing table
    console.log('Dropping existing table...');
    const dropResult = await supabase.rpc('exec_sql', { 
      sql: 'DROP TABLE IF EXISTS public.home_components;' 
    });
    
    if (dropResult.error) {
      console.error('Error dropping table:', dropResult.error);
      return;
    }
    
    // 2. Create the table
    console.log('Creating table...');
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS public.home_components (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        "order" INTEGER NOT NULL,
        is_active BOOLEAN DEFAULT true,
        background_color TEXT DEFAULT '#ffffff',
        text_color TEXT DEFAULT '#000000',
        border_color TEXT DEFAULT 'transparent',
        border_width INTEGER DEFAULT 0,
        border_radius INTEGER DEFAULT 0,
        padding TEXT DEFAULT '0px',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    const createResult = await supabase.rpc('exec_sql', { sql: createTableSQL });
    
    if (createResult.error) {
      console.error('Error creating table:', createResult.error);
      return;
    }
    
    // 3. Enable RLS
    console.log('Enabling RLS...');
    const rlsResult = await supabase.rpc('exec_sql', { 
      sql: 'ALTER TABLE public.home_components ENABLE ROW LEVEL SECURITY;' 
    });
    
    if (rlsResult.error) {
      console.error('Error enabling RLS:', rlsResult.error);
      return;
    }
    
    // 4. Create policies
    console.log('Creating policies...');
    const policiesSQL = `
      -- Drop any existing policies
      DROP POLICY IF EXISTS "Allow public read access for home_components" ON public.home_components;
      DROP POLICY IF EXISTS "Allow authenticated users to update home_components" ON public.home_components;
      DROP POLICY IF EXISTS "Allow authenticated users to insert home_components" ON public.home_components;
      DROP POLICY IF EXISTS "Allow authenticated users to delete home_components" ON public.home_components;

      -- Create policies
      -- Allow anyone to read
      CREATE POLICY "Allow public read access for home_components" 
      ON public.home_components FOR SELECT 
      USING (true);

      -- Allow authenticated users to update
      CREATE POLICY "Allow authenticated users to update home_components" 
      ON public.home_components FOR UPDATE
      USING (auth.role() = 'authenticated')
      WITH CHECK (auth.role() = 'authenticated');

      -- Allow authenticated users to insert
      CREATE POLICY "Allow authenticated users to insert home_components" 
      ON public.home_components FOR INSERT
      WITH CHECK (auth.role() = 'authenticated');

      -- Allow authenticated users to delete
      CREATE POLICY "Allow authenticated users to delete home_components" 
      ON public.home_components FOR DELETE
      USING (auth.role() = 'authenticated');
    `;
    
    const policiesResult = await supabase.rpc('exec_sql', { sql: policiesSQL });
    
    if (policiesResult.error) {
      console.error('Error creating policies:', policiesResult.error);
      return;
    }
    
    // 5. Create updated_at trigger
    console.log('Creating trigger...');
    const triggerSQL = `
      -- Create trigger for updated_at
      CREATE OR REPLACE FUNCTION public.set_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS set_home_components_updated_at ON public.home_components;

      CREATE TRIGGER set_home_components_updated_at
      BEFORE UPDATE ON public.home_components
      FOR EACH ROW
      EXECUTE FUNCTION public.set_updated_at();
    `;
    
    const triggerResult = await supabase.rpc('exec_sql', { sql: triggerSQL });
    
    if (triggerResult.error) {
      console.error('Error creating trigger:', triggerResult.error);
      return;
    }
    
    // 6. Insert default data
    console.log('Inserting default data...');
    const insertSQL = `
      INSERT INTO public.home_components (id, name, "order", is_active, background_color, text_color)
      VALUES 
        ('hero', 'Hero Section', 1, true, '#000000', '#ffffff'),
        ('why_choose', 'Why Choose HOG', 2, true, '#ffffff', '#000000'),
        ('location', 'Location', 3, true, '#f5f5f5', '#000000'),
        ('featured_programs', 'Featured Programs', 4, true, '#ffffff', '#000000'),
        ('methodology', 'Training Methodology', 5, true, '#1a1a1a', '#ffffff'),
        ('featured_products', 'Featured Products', 6, true, '#ffffff', '#000000'),
        ('cta', 'Call to Action', 7, true, '#000000', '#ffffff')
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        "order" = EXCLUDED."order",
        is_active = EXCLUDED.is_active,
        background_color = EXCLUDED.background_color,
        text_color = EXCLUDED.text_color;
    `;
    
    const insertResult = await supabase.rpc('exec_sql', { sql: insertSQL });
    
    if (insertResult.error) {
      console.error('Error inserting data:', insertResult.error);
      return;
    }
    
    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

runMigration(); 