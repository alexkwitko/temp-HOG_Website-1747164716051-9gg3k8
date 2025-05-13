import { createClient } from '@supabase/supabase-js';

async function renameHomeComponentsTable() {
  // Get credentials from environment variables or replace with your actual values
  const supabaseUrl = process.env.SUPABASE_URL || 'https://yxwwmjubpkyzwmvilmsw.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseKey) {
    console.error('Error: SUPABASE_SERVICE_ROLE_KEY environment variable is not set');
    console.log('Run this script with: SUPABASE_SERVICE_ROLE_KEY=your_service_role_key node rename-home-components-table.js');
    process.exit(1);
  }

  console.log('Connecting to Supabase...');
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  console.log('Renaming home_components table to home_page_components...');
  try {
    // First, check if home_page_components already exists
    const { error: checkError } = await supabase.rpc('exec_sql', { 
      sql: `SELECT EXISTS (
              SELECT FROM information_schema.tables 
              WHERE table_schema = 'public'
              AND table_name = 'home_page_components'
            );` 
    });
    
    if (checkError) {
      console.error('Error checking if home_page_components exists:', checkError);
      return;
    }
    
    // First, create a new table with the correct name and schema
    console.log('Creating home_page_components table...');
    const createSQL = `
      CREATE TABLE IF NOT EXISTS public.home_page_components (
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
    
    const createResult = await supabase.rpc('exec_sql', { sql: createSQL });
    
    if (createResult.error) {
      console.error('Error creating home_page_components table:', createResult.error);
      return;
    }
    
    // Copy data from home_components to home_page_components
    console.log('Copying data from home_components to home_page_components...');
    const copySQL = `
      INSERT INTO public.home_page_components (
        id, name, "order", is_active, background_color, text_color, 
        border_color, border_width, border_radius, padding, 
        created_at, updated_at
      )
      SELECT 
        id, name, "order", is_active, background_color, text_color, 
        border_color, border_width, border_radius, padding, 
        created_at, updated_at
      FROM public.home_components
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        "order" = EXCLUDED."order",
        is_active = EXCLUDED.is_active,
        background_color = EXCLUDED.background_color,
        text_color = EXCLUDED.text_color,
        border_color = EXCLUDED.border_color,
        border_width = EXCLUDED.border_width,
        border_radius = EXCLUDED.border_radius,
        padding = EXCLUDED.padding;
    `;
    
    const copyResult = await supabase.rpc('exec_sql', { sql: copySQL });
    
    if (copyResult.error) {
      console.error('Error copying data to home_page_components:', copyResult.error);
      return;
    }
    
    // Enable RLS
    console.log('Enabling RLS on home_page_components...');
    const rlsSQL = `
      ALTER TABLE public.home_page_components ENABLE ROW LEVEL SECURITY;
      
      -- Drop any existing policies
      DROP POLICY IF EXISTS "Allow public read access for home_page_components" ON public.home_page_components;
      DROP POLICY IF EXISTS "Allow authenticated users to update home_page_components" ON public.home_page_components;
      DROP POLICY IF EXISTS "Allow authenticated users to insert home_page_components" ON public.home_page_components;
      DROP POLICY IF EXISTS "Allow authenticated users to delete home_page_components" ON public.home_page_components;
      
      -- Create policies
      -- Allow anyone to read
      CREATE POLICY "Allow public read access for home_page_components" 
      ON public.home_page_components FOR SELECT 
      USING (true);
      
      -- Allow authenticated users to update
      CREATE POLICY "Allow authenticated users to update home_page_components" 
      ON public.home_page_components FOR UPDATE
      USING (auth.role() = 'authenticated')
      WITH CHECK (auth.role() = 'authenticated');
      
      -- Allow authenticated users to insert
      CREATE POLICY "Allow authenticated users to insert home_page_components" 
      ON public.home_page_components FOR INSERT
      WITH CHECK (auth.role() = 'authenticated');
      
      -- Allow authenticated users to delete
      CREATE POLICY "Allow authenticated users to delete home_page_components" 
      ON public.home_page_components FOR DELETE
      USING (auth.role() = 'authenticated');
      
      -- Create updated_at trigger
      DROP TRIGGER IF EXISTS set_home_page_components_updated_at ON public.home_page_components;
      
      CREATE TRIGGER set_home_page_components_updated_at
      BEFORE UPDATE ON public.home_page_components
      FOR EACH ROW
      EXECUTE FUNCTION public.set_updated_at();
    `;
    
    const rlsResult = await supabase.rpc('exec_sql', { sql: rlsSQL });
    
    if (rlsResult.error) {
      console.error('Error enabling RLS on home_page_components:', rlsResult.error);
      return;
    }
    
    console.log('Successfully created and populated home_page_components table!');
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

renameHomeComponentsTable(); 