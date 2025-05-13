-- Create necessary functions for table/column operations if they don't exist
CREATE OR REPLACE FUNCTION create_table_if_not_exists(
  table_name text, 
  column_definitions text
) RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = table_name) THEN
    EXECUTE format('CREATE TABLE %I (%s)', table_name, column_definitions);
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION add_column_if_not_exists(
  table_name text, 
  column_name text, 
  column_type text
) RETURNS void AS $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = $1 AND column_name = $2
  ) THEN
    EXECUTE format('ALTER TABLE %I ADD COLUMN %I %s', 
      table_name, column_name, column_type);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create home_page_config table if it doesn't exist
SELECT create_table_if_not_exists(
  'home_page_config',
  'id serial primary key, palette_id text, use_site_palette boolean default true'
);

-- Add palette_override column to home_page_components if it doesn't exist
SELECT add_column_if_not_exists(
  'home_page_components',
  'palette_override',
  'text'
);

-- Add text background columns to home_page_components if they don't exist
SELECT add_column_if_not_exists(
  'home_page_components',
  'text_background_enabled',
  'boolean default false'
);

SELECT add_column_if_not_exists(
  'home_page_components',
  'text_background_color',
  'text default ''rgba(0,0,0,0.7)'''
);

SELECT add_column_if_not_exists(
  'home_page_components',
  'text_background_opacity',
  'integer default 70'
);

-- Make sure the site_settings table has the color_palette_settings_json column
SELECT add_column_if_not_exists(
  'site_settings',
  'color_palette_settings_json',
  'jsonb'
);

-- Set up default row in home_page_config if it doesn't exist
INSERT INTO home_page_config (id, palette_id, use_site_palette)
VALUES (1, NULL, true)
ON CONFLICT (id) DO NOTHING;

-- Add RLS policy for home_page_config
ALTER TABLE home_page_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_all ON home_page_config 
  FOR SELECT 
  USING (true);

CREATE POLICY update_admin ON home_page_config 
  FOR UPDATE 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY insert_admin ON home_page_config 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Make sure the color palette related entries exist in site_settings
INSERT INTO site_settings (key, value, type, label, color_palette_settings_json)
VALUES (
  'color_palette', 
  'default', 
  'json', 
  'Color Palette Settings',
  '{"globalPaletteId": "monochrome", "useUniformColors": true}'
)
ON CONFLICT (key) DO NOTHING; 