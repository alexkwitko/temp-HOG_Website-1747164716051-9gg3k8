-- Add color_palette_settings_json column to the site_settings table
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS color_palette_settings_json JSONB;

-- Update existing color_palette record if it exists
UPDATE site_settings 
SET color_palette_settings_json = '{
  "globalPaletteId": "monochrome",
  "useUniformColors": true
}'::jsonb
WHERE key = 'color_palette';

-- Insert a new record if color_palette doesn't exist
INSERT INTO site_settings (key, value, color_palette_settings_json)
SELECT 'color_palette', 'default', '{
  "globalPaletteId": "monochrome",
  "useUniformColors": true
}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'color_palette'); 