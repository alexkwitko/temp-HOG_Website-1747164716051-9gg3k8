-- This script ensures all necessary settings tables and columns exist

-- Make sure site_settings table exists
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add JSON columns for each settings type if they don't exist
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS button_settings_json JSONB;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS font_settings_json JSONB;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS color_palette_settings_json JSONB;

-- Insert default records if they don't exist
-- Button settings
INSERT INTO site_settings (key, value, button_settings_json)
SELECT 'button_settings', 'default', '{
  "enabled": true,
  "fixed_width": false,
  "width": "180px",
  "height": "48px",
  "text_color": "#FFFFFF",
  "bg_color": "#000000",
  "hover_color": "#333333",
  "hover_text_color": "#FFFFFF",
  "padding_x": "1.5rem",
  "padding_y": "0.75rem",
  "font_weight": "500",
  "border_radius": "0.25rem",
  "border_radius_style": "small",
  "border_width": "0px",
  "border_color": "#000000",
  "transition_speed": "300ms",
  "primary_style": "solid",
  "secondary_text_color": "#FFFFFF",
  "secondary_bg_color": "#666666",
  "secondary_hover_color": "#444444",
  "secondary_hover_text_color": "#FFFFFF",
  "secondary_width": "180px",
  "secondary_height": "48px",
  "secondary_border_radius": "0.25rem",
  "secondary_border_radius_style": "small",
  "secondary_border_width": "1px",
  "secondary_border_color": "#FFFFFF",
  "secondary_style": "solid",
  "text_size": "md",
  "secondary_text_size": "md",
  "gradient_direction": "to-right",
  "gradient_from_color": "#4F46E5",
  "gradient_to_color": "#8B5CF6",
  "secondary_gradient_direction": "to-right",
  "secondary_gradient_from_color": "#F59E0B",
  "secondary_gradient_to_color": "#B91C1C"
}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'button_settings');

-- Font settings
INSERT INTO site_settings (key, value, font_settings_json)
SELECT 'font_settings', 'default', '{
  "enabled": true,
  "primary_font": "Verdana",
  "secondary_font": "Verdana",
  "body_font": "Verdana",
  "heading_font": "Verdana"
}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'font_settings');

-- Color palette settings
INSERT INTO site_settings (key, value, color_palette_settings_json)
SELECT 'color_palette', 'default', '{
  "globalPaletteId": "monochrome",
  "useUniformColors": true
}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'color_palette');

-- Update RLS policies to allow access
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Admins can read and write all settings
DROP POLICY IF EXISTS "Admins can read and write site_settings" ON site_settings;
CREATE POLICY "Admins can read and write site_settings" 
ON site_settings 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid() AND raw_app_meta_data->>'role' = 'admin'
  )
) 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid() AND raw_app_meta_data->>'role' = 'admin'
  )
);

-- All users can read site_settings
DROP POLICY IF EXISTS "All users can read site_settings" ON site_settings;
CREATE POLICY "All users can read site_settings" 
ON site_settings 
FOR SELECT 
TO authenticated 
USING (true);

-- Anonymous users can read site_settings
DROP POLICY IF EXISTS "Anonymous users can read site_settings" ON site_settings;
CREATE POLICY "Anonymous users can read site_settings" 
ON site_settings 
FOR SELECT 
TO anon 
USING (true); 