-- Add JSON columns to site_settings table
ALTER TABLE IF EXISTS site_settings 
ADD COLUMN IF NOT EXISTS social_links_json JSONB,
ADD COLUMN IF NOT EXISTS business_hours_json JSONB,
ADD COLUMN IF NOT EXISTS color_palette_settings_json JSONB;
