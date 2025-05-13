-- Add column layout configuration
INSERT INTO site_config (key, value)
VALUES 
  ('why_choose_columns_layout', '3'),
  ('methodology_columns_layout', '4')
ON CONFLICT (key) 
DO UPDATE SET value = EXCLUDED.value;

-- Ensure the columns have default values
COMMENT ON COLUMN site_config.key IS 'Configuration key';
COMMENT ON COLUMN site_config.value IS 'Configuration value'; 