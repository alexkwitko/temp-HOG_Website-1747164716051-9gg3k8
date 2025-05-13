-- Comprehensive fix for site_settings table to ensure all columns exist and RLS is disabled
-- Run this in Supabase SQL Editor

-- First, make sure the table exists
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add all the JSON columns for settings if they don't exist
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS button_settings_json JSONB;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS font_settings_json JSONB;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS color_palette_settings_json JSONB;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS site_name TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS site_description TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS social_links_json JSONB;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS business_hours_json JSONB;

-- Disable Row Level Security for the site_settings table
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;

-- Set up proper timestamps trigger
DROP TRIGGER IF EXISTS set_site_settings_updated_at ON site_settings;
CREATE TRIGGER set_site_settings_updated_at
BEFORE UPDATE ON site_settings
FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- Confirm changes worked
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'site_settings';
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'site_settings';

-- Insert default data if it doesn't exist
INSERT INTO site_settings (key, value, button_settings_json, font_settings_json, color_palette_settings_json)
VALUES 
  ('button_settings', 'default', '{"enabled":true,"fixed_width":false,"width":"180px","height":"48px","text_color":"#FFFFFF","bg_color":"#000000","hover_color":"#333333","hover_text_color":"#FFFFFF","padding_x":"1.5rem","padding_y":"0.75rem","font_weight":"500","border_radius":"0.25rem","border_radius_style":"small","border_width":"0px","border_color":"#000000","transition_speed":"300ms","primary_style":"solid","secondary_text_color":"#FFFFFF","secondary_bg_color":"#666666","secondary_hover_color":"#444444","secondary_hover_text_color":"#FFFFFF","secondary_width":"180px","secondary_height":"48px","secondary_border_radius":"0.25rem","secondary_border_radius_style":"small","secondary_border_width":"1px","secondary_border_color":"#FFFFFF","secondary_style":"solid","text_size":"md","secondary_text_size":"md","gradient_direction":"to-right","gradient_from_color":"#4F46E5","gradient_to_color":"#8B5CF6","secondary_gradient_direction":"to-right","secondary_gradient_from_color":"#F59E0B","secondary_gradient_to_color":"#B91C1C"}', NULL, NULL)
ON CONFLICT (key) DO NOTHING;

INSERT INTO site_settings (key, value, font_settings_json)
VALUES 
  ('font_settings', 'default', '{"enabled":true,"primary_font":"Verdana","secondary_font":"Verdana","body_font":"Verdana","heading_font":"Verdana"}')
ON CONFLICT (key) DO NOTHING;

INSERT INTO site_settings (key, value, color_palette_settings_json)
VALUES 
  ('color_palette', 'default', '{"globalPaletteId":"monochrome","useUniformColors":true}')
ON CONFLICT (key) DO NOTHING; 