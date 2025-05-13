-- Drop existing RLS policies for featured_programs_config
DROP POLICY IF EXISTS "Allow public read access for featured_programs_config" ON public.featured_programs_config;
DROP POLICY IF EXISTS "Allow admin full access for featured_programs_config" ON public.featured_programs_config;
DROP POLICY IF EXISTS "Allow admin write access for featured_programs_config" ON public.featured_programs_config;
DROP POLICY IF EXISTS "Allow authenticated users to update featured_programs_config" ON public.featured_programs_config;
DROP POLICY IF EXISTS "Allow authenticated users to insert featured_programs_config" ON public.featured_programs_config;
DROP POLICY IF EXISTS "Allow authenticated users to delete featured_programs_config" ON public.featured_programs_config;

-- Enable RLS on the table
ALTER TABLE public.featured_programs_config ENABLE ROW LEVEL SECURITY;

-- Create new RLS policies with proper permissions
-- Allow anyone to read featured_programs_config
CREATE POLICY "Allow public read access for featured_programs_config" 
ON public.featured_programs_config FOR SELECT 
USING (true);

-- Allow anyone to update the featured_programs_config table (temporarily for debugging)
CREATE POLICY "Allow anyone to update featured_programs_config" 
ON public.featured_programs_config FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow anyone to insert into the featured_programs_config table (temporarily for debugging)
CREATE POLICY "Allow anyone to insert featured_programs_config" 
ON public.featured_programs_config FOR INSERT
WITH CHECK (true);

-- Allow anyone to delete from the featured_programs_config table (temporarily for debugging)
CREATE POLICY "Allow anyone to delete featured_programs_config" 
ON public.featured_programs_config FOR DELETE
USING (true);

-- Make sure the default row exists
INSERT INTO public.featured_programs_config (id, heading, subheading, featured_program_ids)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Featured Programs',
  'From beginner-friendly fundamentals to advanced competition training, find the perfect program for your journey.',
  '{}'
)
ON CONFLICT (id) DO NOTHING; 