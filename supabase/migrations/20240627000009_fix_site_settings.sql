-- Drop and recreate site_settings table with all needed columns
DROP TABLE IF EXISTS site_settings CASCADE;

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  site_name TEXT,
  site_description TEXT,
  contact_email TEXT,
  social_links_json JSONB DEFAULT '{
    "facebook": "",
    "instagram": "",
    "twitter": "",
    "youtube": ""
  }'::jsonb,
  business_hours_json JSONB DEFAULT '{
    "monday": {"open": "08:00", "close": "21:00", "closed": false},
    "tuesday": {"open": "08:00", "close": "21:00", "closed": false},
    "wednesday": {"open": "08:00", "close": "21:00", "closed": false},
    "thursday": {"open": "08:00", "close": "21:00", "closed": false},
    "friday": {"open": "08:00", "close": "21:00", "closed": false},
    "saturday": {"open": "09:00", "close": "17:00", "closed": false},
    "sunday": {"open": "09:00", "close": "17:00", "closed": true}
  }'::jsonb,
  color_palette_settings_json JSONB DEFAULT '{
    "primary": "#1a1a1a",
    "secondary": "#ffffff",
    "accent": "#0070f3",
    "background": "#ffffff",
    "text": "#1a1a1a",
    "headings": "#1a1a1a",
    "buttons": "#0070f3",
    "buttonText": "#ffffff",
    "links": "#0070f3"
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default site settings if they don't exist
INSERT INTO site_settings (key, site_name, site_description, contact_email)
SELECT 'site_info', 'House of Grappling', 'A Premier Brazilian Jiu-Jitsu Training Center', 'info@houseofgrappling.com'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'site_info');

INSERT INTO site_settings (key, social_links_json)
SELECT 'social_links', '{
  "facebook": "https://facebook.com/houseofgrappling",
  "instagram": "https://instagram.com/houseofgrappling",
  "twitter": "https://twitter.com/houseofgrappling",
  "youtube": "https://youtube.com/houseofgrappling"
}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'social_links');

INSERT INTO site_settings (key, business_hours_json)
SELECT 'business_hours', '{
  "monday": {"open": "08:00", "close": "21:00", "closed": false},
  "tuesday": {"open": "08:00", "close": "21:00", "closed": false},
  "wednesday": {"open": "08:00", "close": "21:00", "closed": false},
  "thursday": {"open": "08:00", "close": "21:00", "closed": false},
  "friday": {"open": "08:00", "close": "21:00", "closed": false},
  "saturday": {"open": "09:00", "close": "17:00", "closed": false},
  "sunday": {"open": "10:00", "close": "15:00", "closed": true}
}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'business_hours');

INSERT INTO site_settings (key, color_palette_settings_json)
SELECT 'color_palette', '{
  "primary": "#1a1a1a",
  "secondary": "#ffffff",
  "accent": "#0070f3",
  "background": "#ffffff",
  "text": "#1a1a1a",
  "headings": "#1a1a1a",
  "buttons": "#0070f3",
  "buttonText": "#ffffff",
  "links": "#0070f3"
}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'color_palette');

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON site_settings
FOR EACH ROW
EXECUTE FUNCTION update_modified_column(); 