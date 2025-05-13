-- Create featured_products_config table to manage the featured products section configuration
CREATE TABLE IF NOT EXISTS public.featured_products_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  heading TEXT NOT NULL DEFAULT 'Featured Products',
  subheading TEXT NOT NULL DEFAULT 'Premium gear designed for serious practitioners. Quality you can trust.',
  background_color TEXT DEFAULT '#F5F5F5',
  text_color TEXT DEFAULT '#000000',
  featured_product_ids TEXT[] DEFAULT '{}',
  max_display_count INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.featured_products_config ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Allow public read access for featured_products_config" ON public.featured_products_config;
DROP POLICY IF EXISTS "Allow authenticated users to update featured_products_config" ON public.featured_products_config;
DROP POLICY IF EXISTS "Allow authenticated users to insert featured_products_config" ON public.featured_products_config;
DROP POLICY IF EXISTS "Allow authenticated users to delete featured_products_config" ON public.featured_products_config;

-- Create policies
-- Allow anyone to read
CREATE POLICY "Allow public read access for featured_products_config" 
ON public.featured_products_config FOR SELECT 
USING (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated users to update featured_products_config" 
ON public.featured_products_config FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert featured_products_config" 
ON public.featured_products_config FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated users to delete featured_products_config" 
ON public.featured_products_config FOR DELETE
USING (auth.role() = 'authenticated');

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS set_featured_products_config_updated_at ON public.featured_products_config;

CREATE TRIGGER set_featured_products_config_updated_at
BEFORE UPDATE ON public.featured_products_config
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Insert default configuration
INSERT INTO public.featured_products_config (
  id, 
  heading, 
  subheading, 
  background_color,
  text_color,
  featured_product_ids,
  max_display_count
)
VALUES (
  '00000000-0000-0000-0000-000000000001', 
  'Featured Products', 
  'Premium gear designed for serious practitioners. Quality you can trust.',
  '#F5F5F5',
  '#000000',
  '{}',
  3
)
ON CONFLICT (id) DO UPDATE SET
  heading = EXCLUDED.heading,
  subheading = EXCLUDED.subheading,
  background_color = EXCLUDED.background_color,
  text_color = EXCLUDED.text_color,
  featured_product_ids = EXCLUDED.featured_product_ids,
  max_display_count = EXCLUDED.max_display_count; 