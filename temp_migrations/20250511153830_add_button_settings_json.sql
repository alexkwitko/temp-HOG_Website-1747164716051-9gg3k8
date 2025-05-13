-- Add button_settings_json column to the site_settings table
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS button_settings_json JSONB;

-- Update existing button_settings record if it exists
UPDATE site_settings 
SET button_settings_json = '{
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
  "secondary_border_width": "1px",
  "secondary_border_color": "#FFFFFF",
  "secondary_style": "solid"
}'::jsonb
WHERE key = 'button_settings';

-- Insert a new record if button_settings doesn't exist
INSERT INTO site_settings (key, value, type, button_settings_json)
SELECT 'button_settings', 'default', 'json', '{
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
  "secondary_border_width": "1px",
  "secondary_border_color": "#FFFFFF",
  "secondary_style": "solid"
}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'button_settings'); 