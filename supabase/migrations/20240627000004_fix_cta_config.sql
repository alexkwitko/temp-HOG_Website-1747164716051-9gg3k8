-- Drop and recreate cta_config table with proper UUID type
DROP TABLE IF EXISTS cta_config;

CREATE TABLE IF NOT EXISTS cta_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  heading TEXT DEFAULT 'Start Your Journey Today',
  subheading TEXT DEFAULT 'Join House of Grappling and experience the most effective martial art in the world.',
  background_color TEXT DEFAULT '#1A1A1A',
  text_color TEXT DEFAULT '#FFFFFF',
  primary_button_text TEXT DEFAULT 'Get Started',
  primary_button_url TEXT DEFAULT '/contact',
  secondary_button_text TEXT DEFAULT 'View Schedule',
  secondary_button_url TEXT DEFAULT '/schedule',
  button_primary_color TEXT DEFAULT '#FFFFFF',
  button_primary_text_color TEXT DEFAULT '#1A1A1A',
  button_secondary_color TEXT DEFAULT '#333333',
  button_secondary_text_color TEXT DEFAULT '#FFFFFF',
  background_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert a default entry
INSERT INTO cta_config (
  heading, 
  subheading, 
  background_color, 
  text_color, 
  primary_button_text, 
  primary_button_url, 
  secondary_button_text, 
  secondary_button_url, 
  button_primary_color, 
  button_primary_text_color, 
  button_secondary_color, 
  button_secondary_text_color, 
  is_active
)
VALUES (
  'Start Your Journey Today', 
  'Join House of Grappling and experience the most effective martial art in the world.', 
  '#1A1A1A', 
  '#FFFFFF', 
  'Get Started', 
  '/contact', 
  'View Schedule', 
  '/schedule', 
  '#FFFFFF', 
  '#1A1A1A', 
  '#333333', 
  '#FFFFFF', 
  true
);

-- Create function for automatically updating timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now(); 
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for updated_at in cta_config
DROP TRIGGER IF EXISTS update_cta_config_updated_at ON cta_config;
CREATE TRIGGER update_cta_config_updated_at
BEFORE UPDATE ON cta_config
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Also create the classes table for dashboard
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  day_of_week TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  instructor_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Add indexes
CREATE INDEX IF NOT EXISTS classes_instructor_id_idx ON classes(instructor_id);

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_classes_updated_at ON classes;
CREATE TRIGGER update_classes_updated_at
BEFORE UPDATE ON classes
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Create home_page_config table for HomePageConfig component
CREATE TABLE IF NOT EXISTS home_page_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  show_hero BOOLEAN DEFAULT true,
  show_why_choose BOOLEAN DEFAULT true,
  show_featured_programs BOOLEAN DEFAULT true,
  show_featured_products BOOLEAN DEFAULT true,
  show_methodology BOOLEAN DEFAULT true,
  show_location BOOLEAN DEFAULT true,
  show_cta BOOLEAN DEFAULT true,
  components_order JSONB DEFAULT '["hero", "why_choose", "featured_programs", "methodology", "featured_products", "location", "cta"]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default home_page_config
INSERT INTO home_page_config (
  show_hero,
  show_why_choose,
  show_featured_programs,
  show_featured_products,
  show_methodology,
  show_location,
  show_cta
)
VALUES (
  true,
  true,
  true,
  true,
  true,
  true,
  true
)
ON CONFLICT DO NOTHING;

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_home_page_config_updated_at ON home_page_config;
CREATE TRIGGER update_home_page_config_updated_at
BEFORE UPDATE ON home_page_config
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Add color_palette_settings_json to site_settings
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS color_palette_settings_json JSONB DEFAULT '{
  "primary": "#1a1a1a",
  "secondary": "#ffffff",
  "accent": "#0070f3",
  "background": "#ffffff",
  "text": "#1a1a1a",
  "headings": "#1a1a1a",
  "buttons": "#0070f3",
  "buttonText": "#ffffff",
  "links": "#0070f3"
}'::jsonb; 