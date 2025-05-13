-- Create cta_config table to manage the Call to Action section configuration
CREATE TABLE IF NOT EXISTS public.cta_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  heading TEXT NOT NULL DEFAULT 'Start Your Journey Today',
  subheading TEXT NOT NULL DEFAULT 'Join House of Grappling and experience the most effective martial art in the world.',
  primary_button_text TEXT DEFAULT 'Get Started',
  primary_button_url TEXT DEFAULT '/contact',
  secondary_button_text TEXT DEFAULT 'View Schedule',
  secondary_button_url TEXT DEFAULT '/schedule',
  background_color TEXT DEFAULT '#1A1A1A',
  text_color TEXT DEFAULT '#FFFFFF',
  button_primary_color TEXT DEFAULT '#FFFFFF',
  button_primary_text_color TEXT DEFAULT '#1A1A1A',
  button_secondary_color TEXT DEFAULT '#333333',
  button_secondary_text_color TEXT DEFAULT '#FFFFFF',
  background_image_url TEXT DEFAULT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.cta_config ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Allow public read access for cta_config" ON public.cta_config;
DROP POLICY IF EXISTS "Allow authenticated users to update cta_config" ON public.cta_config;
DROP POLICY IF EXISTS "Allow authenticated users to insert cta_config" ON public.cta_config;
DROP POLICY IF EXISTS "Allow authenticated users to delete cta_config" ON public.cta_config;

-- Create policies
-- Allow anyone to read
CREATE POLICY "Allow public read access for cta_config" 
ON public.cta_config FOR SELECT 
USING (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated users to update cta_config" 
ON public.cta_config FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert cta_config" 
ON public.cta_config FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated users to delete cta_config" 
ON public.cta_config FOR DELETE
USING (auth.role() = 'authenticated');

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS set_cta_config_updated_at ON public.cta_config;

CREATE TRIGGER set_cta_config_updated_at
BEFORE UPDATE ON public.cta_config
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Insert default configuration
INSERT INTO public.cta_config (
  id, 
  heading, 
  subheading, 
  primary_button_text,
  primary_button_url,
  secondary_button_text,
  secondary_button_url,
  background_color,
  text_color,
  button_primary_color,
  button_primary_text_color,
  button_secondary_color,
  button_secondary_text_color,
  is_active
)
VALUES (
  '00000000-0000-0000-0000-000000000001', 
  'Start Your Journey Today', 
  'Join House of Grappling and experience the most effective martial art in the world.',
  'Get Started',
  '/contact',
  'View Schedule',
  '/schedule',
  '#1A1A1A',
  '#FFFFFF',
  '#FFFFFF',
  '#1A1A1A',
  '#333333',
  '#FFFFFF',
  true
)
ON CONFLICT (id) DO UPDATE SET
  heading = EXCLUDED.heading,
  subheading = EXCLUDED.subheading,
  primary_button_text = EXCLUDED.primary_button_text,
  primary_button_url = EXCLUDED.primary_button_url,
  secondary_button_text = EXCLUDED.secondary_button_text,
  secondary_button_url = EXCLUDED.secondary_button_url,
  background_color = EXCLUDED.background_color,
  text_color = EXCLUDED.text_color,
  button_primary_color = EXCLUDED.button_primary_color,
  button_primary_text_color = EXCLUDED.button_primary_text_color,
  button_secondary_color = EXCLUDED.button_secondary_color,
  button_secondary_text_color = EXCLUDED.button_secondary_text_color,
  background_image_url = EXCLUDED.background_image_url,
  is_active = EXCLUDED.is_active; 