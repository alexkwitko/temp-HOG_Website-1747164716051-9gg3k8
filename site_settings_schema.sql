-- Create or update site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  site_name TEXT,
  site_description TEXT,
  contact_email TEXT,
  social_links_json JSONB,
  business_hours_json JSONB,
  color_palette_settings_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default row if none exists
INSERT INTO public.site_settings (id, site_name, site_description, contact_email)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', -- Fixed UUID so we always reference the same row
  'House of Grappling',
  'Premier BJJ and martial arts training academy',
  'info@houseofgrappling.com'
)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Policy for admin access
CREATE POLICY admin_all_access ON public.site_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true); 