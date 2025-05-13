-- Create home_page_components table to manage the order and styling of home page sections
CREATE TABLE IF NOT EXISTS public.home_page_components (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  background_color TEXT DEFAULT '#FFFFFF',
  text_color TEXT DEFAULT '#000000',
  border_color TEXT DEFAULT 'transparent',
  border_width INTEGER DEFAULT 0,
  border_radius INTEGER DEFAULT 0,
  padding TEXT DEFAULT '0px',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
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

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_home_page_components_updated_at ON public.home_page_components;

CREATE TRIGGER set_home_page_components_updated_at
BEFORE UPDATE ON public.home_page_components
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Insert default components
INSERT INTO public.home_page_components (id, name, "order", is_active, background_color, text_color, border_color, border_width, border_radius, padding)
VALUES 
  ('hero', 'Hero Section', 1, true, 'transparent', '#FFFFFF', 'transparent', 0, 0, '0px'),
  ('why_choose', 'Why Choose Section', 2, true, '#FFFFFF', '#000000', 'transparent', 0, 0, '80px 0'),
  ('location', 'Location Section', 3, true, '#F5F5F5', '#000000', 'transparent', 0, 0, '80px 0'),
  ('featured_programs', 'Featured Programs', 4, true, '#FFFFFF', '#000000', 'transparent', 0, 0, '80px 0'),
  ('methodology', 'Training Methodology', 5, true, '#1A1A1A', '#FFFFFF', 'transparent', 0, 0, '80px 0'),
  ('featured_products', 'Featured Products', 6, true, '#F5F5F5', '#000000', 'transparent', 0, 0, '80px 0'),
  ('cta', 'Call to Action', 7, true, '#1A1A1A', '#FFFFFF', 'transparent', 0, 0, '80px 0')
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