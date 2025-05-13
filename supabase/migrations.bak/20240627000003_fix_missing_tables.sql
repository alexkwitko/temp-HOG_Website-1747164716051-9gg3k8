-- Create missing tables for the admin section

-- 1. Create hero_slides table
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

-- Create trigger for updated_at column on hero_slides
DROP TRIGGER IF EXISTS update_hero_slides_updated_at ON hero_slides;
CREATE TRIGGER update_hero_slides_updated_at
BEFORE UPDATE ON hero_slides
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 2. Create hero_config table
CREATE TABLE IF NOT EXISTS hero_config (
  id TEXT PRIMARY KEY,
  text_background_settings JSONB DEFAULT '{"enabled": false, "color": "rgba(0,0,0,0.7)", "opacity": 70}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default hero_config if it doesn't exist
INSERT INTO hero_config (id)
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Create trigger for updated_at column on hero_config
DROP TRIGGER IF EXISTS update_hero_config_updated_at ON hero_config;
CREATE TRIGGER update_hero_config_updated_at
BEFORE UPDATE ON hero_config
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 3. Create site_config table
CREATE TABLE IF NOT EXISTS site_config (
  key TEXT PRIMARY KEY,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add description column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'site_config' AND column_name = 'description'
  ) THEN
    ALTER TABLE site_config ADD COLUMN description TEXT;
  END IF;
END $$;

-- Insert default site config values
INSERT INTO site_config (key, value)
VALUES 
  ('why_choose_heading', 'Why Choose House of Grappling?'),
  ('why_choose_subheading', 'We offer a world-class training environment focused on technical excellence, personal growth, and community.'),
  ('why_choose_columns_layout', '3')
ON CONFLICT (key) DO NOTHING;

-- Create trigger for updated_at column on site_config
DROP TRIGGER IF EXISTS update_site_config_updated_at ON site_config;
CREATE TRIGGER update_site_config_updated_at
BEFORE UPDATE ON site_config
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 4. Create why_choose_cards table
CREATE TABLE IF NOT EXISTS why_choose_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  icon_name TEXT DEFAULT 'Shield',
  icon_color TEXT DEFAULT '#333333',
  image_url TEXT,
  image_id TEXT,
  button_text TEXT,
  button_url TEXT,
  button_bg TEXT DEFAULT '#000000',
  button_text_color TEXT DEFAULT '#FFFFFF',
  card_bg TEXT DEFAULT '#FFFFFF',
  card_text_color TEXT DEFAULT '#333333',
  use_icon BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  text_alignment TEXT DEFAULT 'left',
  icon_alignment TEXT DEFAULT 'left',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for updated_at column on why_choose_cards
DROP TRIGGER IF EXISTS update_why_choose_cards_updated_at ON why_choose_cards;
CREATE TRIGGER update_why_choose_cards_updated_at
BEFORE UPDATE ON why_choose_cards
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 5. Create icons_reference table
CREATE TABLE IF NOT EXISTS icons_reference (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint to icons_reference.name if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c 
    JOIN pg_namespace n ON n.oid = c.connamespace 
    WHERE c.contype = 'u' 
      AND c.conrelid = 'icons_reference'::regclass 
      AND c.conname = 'icons_reference_name_key'
  ) THEN
    ALTER TABLE icons_reference ADD CONSTRAINT icons_reference_name_key UNIQUE (name);
  END IF;
EXCEPTION
  WHEN undefined_table THEN
    -- Table doesn't exist, do nothing
    NULL;
END $$;

-- Insert default icons
INSERT INTO icons_reference (name, display_name, category)
SELECT 'Shield', 'Shield', 'basic'
WHERE NOT EXISTS (SELECT 1 FROM icons_reference WHERE name = 'Shield');

INSERT INTO icons_reference (name, display_name, category)
SELECT 'Award', 'Award', 'basic'
WHERE NOT EXISTS (SELECT 1 FROM icons_reference WHERE name = 'Award');

INSERT INTO icons_reference (name, display_name, category)
SELECT 'Users', 'Users/Community', 'basic'
WHERE NOT EXISTS (SELECT 1 FROM icons_reference WHERE name = 'Users');

INSERT INTO icons_reference (name, display_name, category)
SELECT 'Calendar', 'Calendar', 'basic'
WHERE NOT EXISTS (SELECT 1 FROM icons_reference WHERE name = 'Calendar');

INSERT INTO icons_reference (name, display_name, category)
SELECT 'ShieldCheck', 'Shield Check', 'basic'
WHERE NOT EXISTS (SELECT 1 FROM icons_reference WHERE name = 'ShieldCheck');

INSERT INTO icons_reference (name, display_name, category)
SELECT 'Brain', 'Brain/Knowledge', 'basic'
WHERE NOT EXISTS (SELECT 1 FROM icons_reference WHERE name = 'Brain');

INSERT INTO icons_reference (name, display_name, category)
SELECT 'Target', 'Target', 'basic'
WHERE NOT EXISTS (SELECT 1 FROM icons_reference WHERE name = 'Target');

INSERT INTO icons_reference (name, display_name, category)
SELECT 'Dumbbell', 'Dumbbell/Strength', 'basic'
WHERE NOT EXISTS (SELECT 1 FROM icons_reference WHERE name = 'Dumbbell');

-- 6. Insert default why_choose_cards if none exist
INSERT INTO why_choose_cards (title, description, icon_name, "order", is_active)
SELECT 'Expert Instructors', 'Train with certified black belts and champions who are committed to your progress.', 'Award', 1, true
WHERE NOT EXISTS (SELECT 1 FROM why_choose_cards);

INSERT INTO why_choose_cards (title, description, icon_name, "order", is_active)
SELECT 'Supportive Community', 'Join a welcoming team of practitioners that supports and elevates each other.', 'Users', 2, true
WHERE NOT EXISTS (SELECT 1 FROM why_choose_cards WHERE "order" = 2);

INSERT INTO why_choose_cards (title, description, icon_name, "order", is_active)
SELECT 'Progressive Curriculum', 'Follow a structured learning path designed to build skills systematically.', 'Target', 3, true
WHERE NOT EXISTS (SELECT 1 FROM why_choose_cards WHERE "order" = 3);

-- 7. Insert default hero slides if none exist
INSERT INTO hero_slides (title, subtitle, description, "order", is_active)
SELECT 'House of Grappling', 'A Premier Brazilian Jiu-Jitsu Training Center', 'Join our community and start your journey to mastery today.', 1, true
WHERE NOT EXISTS (SELECT 1 FROM hero_slides); 