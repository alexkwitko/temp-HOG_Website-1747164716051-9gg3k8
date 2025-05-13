-- Check if the featured_programs_config table exists, create it if it doesn't
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'featured_programs_config'
    ) THEN
        CREATE TABLE public.featured_programs_config (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            heading TEXT DEFAULT 'Featured Programs',
            subheading TEXT DEFAULT 'From beginner-friendly fundamentals to advanced competition training, find the perfect program for your journey.',
            featured_program_ids TEXT[] DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        RAISE NOTICE 'Created featured_programs_config table';
    ELSE
        RAISE NOTICE 'featured_programs_config table already exists';
    END IF;
END
$$;

-- Drop existing RLS policies for featured_programs_config
DROP POLICY IF EXISTS "Allow public read access for featured_programs_config" ON public.featured_programs_config;
DROP POLICY IF EXISTS "Allow admin full access for featured_programs_config" ON public.featured_programs_config;
DROP POLICY IF EXISTS "Allow admin write access for featured_programs_config" ON public.featured_programs_config;
DROP POLICY IF EXISTS "Allow authenticated users to update featured_programs_config" ON public.featured_programs_config;
DROP POLICY IF EXISTS "Allow authenticated users to insert featured_programs_config" ON public.featured_programs_config;

-- Enable RLS on the table
ALTER TABLE public.featured_programs_config ENABLE ROW LEVEL SECURITY;

-- Create new RLS policies with proper permissions
-- Allow anyone to read featured_programs_config
CREATE POLICY "Allow public read access for featured_programs_config" 
ON public.featured_programs_config FOR SELECT 
USING (true);

-- Allow authenticated users to update the featured_programs_config table
CREATE POLICY "Allow authenticated users to update featured_programs_config" 
ON public.featured_programs_config FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to insert into the featured_programs_config table 
CREATE POLICY "Allow authenticated users to insert featured_programs_config" 
ON public.featured_programs_config FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to delete from the featured_programs_config table
CREATE POLICY "Allow authenticated users to delete featured_programs_config" 
ON public.featured_programs_config FOR DELETE
USING (auth.role() = 'authenticated');

-- Insert default row if not exists using a proper UUID
INSERT INTO public.featured_programs_config (id, heading, subheading, featured_program_ids)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Featured Programs',
  'From beginner-friendly fundamentals to advanced competition training, find the perfect program for your journey.',
  '{}'
)
ON CONFLICT (id) DO NOTHING;

-- Create trigger for updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_featured_programs_config_updated_at'
  ) THEN
    CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS update_featured_programs_config_updated_at ON public.featured_programs_config;

    CREATE TRIGGER update_featured_programs_config_updated_at
    BEFORE UPDATE ON public.featured_programs_config
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_set_timestamp();
    
    RAISE NOTICE 'Created updated_at trigger for featured_programs_config';
  END IF;
END
$$; 