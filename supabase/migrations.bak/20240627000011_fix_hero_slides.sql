-- Drop and recreate hero_slides table with all needed columns
DROP TABLE IF EXISTS hero_slides CASCADE;

CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  subtitle TEXT,
  description TEXT,
  text_color TEXT DEFAULT '#FFFFFF',
  image_url TEXT,
  image_id TEXT,
  image_opacity INTEGER DEFAULT 100,
  text_background JSONB DEFAULT '{"enabled": false, "color": "rgba(0,0,0,0.7)", "opacity": 70, "size": "md", "padding": "16px"}'::jsonb,
  text_position JSONB DEFAULT '{"horizontal": "center", "vertical": "center"}'::jsonb,
  button_text TEXT,
  button_url TEXT,
  button_active BOOLEAN DEFAULT true,
  button_bg TEXT DEFAULT '#000000',
  button_text_color TEXT DEFAULT '#FFFFFF',
  button_hover TEXT DEFAULT '#222222',
  button_padding_x TEXT DEFAULT '16px',
  button_padding_y TEXT DEFAULT '8px',
  button_font TEXT DEFAULT 'inherit',
  button_mobile_width TEXT DEFAULT '100%',
  button_desktop_width TEXT DEFAULT 'auto',
  secondary_button_text TEXT,
  secondary_button_url TEXT,
  secondary_button_active BOOLEAN DEFAULT false,
  secondary_button_bg TEXT DEFAULT '#FFFFFF',
  secondary_button_text_color TEXT DEFAULT '#000000',
  secondary_button_hover TEXT DEFAULT '#F5F5F5',
  secondary_button_padding_x TEXT DEFAULT '16px',
  secondary_button_padding_y TEXT DEFAULT '8px',
  secondary_button_font TEXT DEFAULT 'inherit',
  secondary_button_mobile_width TEXT DEFAULT '100%',
  secondary_button_desktop_width TEXT DEFAULT 'auto',
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert a default hero slide
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM hero_slides) THEN
    INSERT INTO hero_slides (
      title, 
      subtitle, 
      description, 
      text_color, 
      image_opacity, 
      text_background, 
      text_position, 
      button_text, 
      button_url, 
      "order", 
      is_active
    )
    VALUES (
      'House of Grappling', 
      'A Premier Brazilian Jiu-Jitsu Training Center', 
      'Join our community and start your journey to mastery today.', 
      '#FFFFFF', 
      100,
      '{"enabled": false, "color": "rgba(0,0,0,0.7)", "opacity": 70, "size": "md", "padding": "16px"}'::jsonb,
      '{"horizontal": "center", "vertical": "center"}'::jsonb,
      'Get Started', 
      '/contact', 
      1, 
      true
    );
  END IF;
END $$;

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_hero_slides_updated_at ON hero_slides;
CREATE TRIGGER update_hero_slides_updated_at
BEFORE UPDATE ON hero_slides
FOR EACH ROW
EXECUTE FUNCTION update_modified_column(); 