-- Update featured_products_config to use UUID instead of SERIAL ID
-- First create a temporary table with the correct structure
CREATE TABLE featured_products_config_temp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  heading TEXT DEFAULT 'Featured Products',
  subheading TEXT DEFAULT 'Shop our selection of high-quality products',
  featured_product_ids UUID[] DEFAULT ARRAY[]::UUID[],
  background_color TEXT DEFAULT '#ffffff',
  text_color TEXT DEFAULT '#000000',
  button_text TEXT DEFAULT 'Shop Now',
  button_url TEXT DEFAULT '/shop',
  button_color TEXT DEFAULT '#000000',
  button_text_color TEXT DEFAULT '#ffffff',
  button_bg_color TEXT DEFAULT '#000000',
  button_hover_color TEXT DEFAULT '#222222',
  button_alignment TEXT DEFAULT 'center',
  columns_layout TEXT DEFAULT '3',
  enable_special_promotion BOOLEAN DEFAULT false,
  promoted_product_id UUID,
  promotion_badge_text TEXT DEFAULT 'Featured',
  promotion_badge_color TEXT DEFAULT '#ff0000',
  promotion_badge_text_color TEXT DEFAULT '#ffffff',
  show_preview BOOLEAN DEFAULT true,
  max_display_count INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Copy data from the existing table to the temp table
INSERT INTO featured_products_config_temp (
  heading, 
  subheading, 
  featured_product_ids,
  background_color, 
  text_color, 
  button_text, 
  button_url, 
  button_color, 
  button_text_color, 
  button_bg_color, 
  button_hover_color, 
  button_alignment, 
  columns_layout, 
  enable_special_promotion,
  promoted_product_id,
  promotion_badge_text, 
  promotion_badge_color, 
  promotion_badge_text_color, 
  show_preview,
  max_display_count,
  created_at,
  updated_at
)
SELECT
  heading, 
  subheading, 
  featured_product_ids,
  background_color, 
  text_color, 
  button_text, 
  button_url, 
  button_color, 
  button_text_color, 
  button_bg_color, 
  button_hover_color, 
  button_alignment, 
  columns_layout, 
  enable_special_promotion,
  promoted_product_id,
  promotion_badge_text, 
  promotion_badge_color, 
  promotion_badge_text_color, 
  show_preview,
  max_display_count,
  created_at,
  updated_at
FROM featured_products_config;

-- Drop the original table
DROP TABLE featured_products_config;

-- Rename the temp table to the original name
ALTER TABLE featured_products_config_temp RENAME TO featured_products_config;

-- Create specific IDs that the frontend might be looking for
INSERT INTO featured_products_config (id, heading, subheading, background_color, text_color)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Featured Products', 'Shop our selection of high-quality products', '#ffffff', '#000000'),
  ('00000000-0000-0000-0000-000000000002', 'Featured Products', 'Shop our selection of high-quality products', '#ffffff', '#000000')
ON CONFLICT (id) DO NOTHING;

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_featured_products_config_updated_at ON featured_products_config;
CREATE TRIGGER update_featured_products_config_updated_at
BEFORE UPDATE ON featured_products_config
FOR EACH ROW
EXECUTE FUNCTION update_modified_column(); 