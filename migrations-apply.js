import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Replace with your Supabase URL and service role key
const supabaseUrl = 'https://yxwwmjubpkyzwmvilmsw.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY environment variable is not set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    console.log('Running methodology migration...');
    
    // Execute each statement separately
    
    // 1. Drop the existing table
    console.log('Dropping existing table...');
    const dropResult = await supabase.rpc('exec_sql', { 
      sql: 'DROP TABLE IF EXISTS public.methodology;' 
    });
    
    if (dropResult.error) {
      console.error('Error dropping table:', dropResult.error);
      return;
    }
    
    // 2. Create the table
    console.log('Creating table...');
    const createTableSQL = `
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
    `;
    
    const createResult = await supabase.rpc('exec_sql', { sql: createTableSQL });
    
    if (createResult.error) {
      console.error('Error creating table:', createResult.error);
      return;
    }
    
    // 3. Enable RLS
    console.log('Enabling RLS...');
    const rlsResult = await supabase.rpc('exec_sql', { 
      sql: 'ALTER TABLE public.methodology ENABLE ROW LEVEL SECURITY;' 
    });
    
    if (rlsResult.error) {
      console.error('Error enabling RLS:', rlsResult.error);
      return;
    }
    
    // 4. Create policies
    console.log('Creating policies...');
    const policiesSQL = `
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

      DROP TRIGGER IF EXISTS set_methodology_updated_at ON public.methodology;

      CREATE TRIGGER set_methodology_updated_at
      BEFORE UPDATE ON public.methodology
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