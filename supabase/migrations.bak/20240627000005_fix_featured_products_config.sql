-- Create function for automatically updating timestamps if it doesn't exist
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now(); 
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop and recreate featured_products_config table with all needed columns
DROP TABLE IF EXISTS featured_products_config;

CREATE TABLE IF NOT EXISTS featured_products_config (
  id SERIAL PRIMARY KEY,
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

-- Insert default data
INSERT INTO featured_products_config (
  heading, 
  subheading, 
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
  promotion_badge_text, 
  promotion_badge_color, 
  promotion_badge_text_color, 
  show_preview
)
VALUES (
  'Featured Products', 
  'Shop our selection of high-quality products', 
  '#ffffff', 
  '#000000', 
  'Shop Now', 
  '/shop', 
  '#000000', 
  '#ffffff', 
  '#000000', 
  '#222222', 
  'center', 
  '3', 
  'Featured', 
  '#ff0000', 
  '#ffffff', 
  true
)
ON CONFLICT DO NOTHING;

-- Add trigger for updated_at in featured_products_config
DROP TRIGGER IF EXISTS update_featured_products_config_updated_at ON featured_products_config;
CREATE TRIGGER update_featured_products_config_updated_at
BEFORE UPDATE ON featured_products_config
FOR EACH ROW
EXECUTE FUNCTION update_modified_column(); 