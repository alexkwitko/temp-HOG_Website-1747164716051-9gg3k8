-- Add font_settings_json column to the site_settings table
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS font_settings_json JSONB;

-- Update existing font_settings record if it exists
UPDATE site_settings 
SET font_settings_json = '{
  "enabled": true,
  "primary_font": "Verdana",
  "secondary_font": "Verdana",
  "body_font": "Verdana",
  "heading_font": "Verdana"
}'::jsonb
WHERE key = 'font_settings';

-- Insert a new record if font_settings doesn't exist
INSERT INTO site_settings (key, value, font_settings_json)
SELECT 'font_settings', 'default', '{
  "enabled": true,
  "primary_font": "Verdana",
  "secondary_font": "Verdana",
  "body_font": "Verdana",
  "heading_font": "Verdana"
}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'font_settings'); 