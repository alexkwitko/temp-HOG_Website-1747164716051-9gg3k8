-- Add missing columns to site_settings table
ALTER TABLE public.site_settings
ADD COLUMN IF NOT EXISTS social_links_json JSONB,
ADD COLUMN IF NOT EXISTS business_hours_json JSONB,
ADD COLUMN IF NOT EXISTS color_palette_settings_json JSONB;

-- Add missing columns to programs table
ALTER TABLE public.programs
ADD COLUMN IF NOT EXISTS hero_background_url TEXT,
ADD COLUMN IF NOT EXISTS hero_title TEXT,
ADD COLUMN IF NOT EXISTS hero_subtitle TEXT,
ADD COLUMN IF NOT EXISTS hero_description TEXT;
