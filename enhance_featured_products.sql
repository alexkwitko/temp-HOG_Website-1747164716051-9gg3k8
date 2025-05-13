-- Enhanced Featured Products Configuration Table

-- Add new columns to the featured_products_config table for enhanced styling options
ALTER TABLE featured_products_config 
ADD COLUMN IF NOT EXISTS background_color VARCHAR DEFAULT '#ffffff',
ADD COLUMN IF NOT EXISTS text_color VARCHAR DEFAULT '#333333',
ADD COLUMN IF NOT EXISTS button_text VARCHAR DEFAULT 'View Product',
ADD COLUMN IF NOT EXISTS button_url VARCHAR DEFAULT '/shop',
ADD COLUMN IF NOT EXISTS button_bg_color VARCHAR DEFAULT '#000000',
ADD COLUMN IF NOT EXISTS button_text_color VARCHAR DEFAULT '#ffffff',
ADD COLUMN IF NOT EXISTS button_hover_color VARCHAR DEFAULT '#222222',
ADD COLUMN IF NOT EXISTS button_alignment VARCHAR DEFAULT 'center',
ADD COLUMN IF NOT EXISTS columns_layout VARCHAR DEFAULT '3',
ADD COLUMN IF NOT EXISTS enable_special_promotion BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS promoted_product_id VARCHAR DEFAULT NULL,
ADD COLUMN IF NOT EXISTS promotion_badge_text VARCHAR DEFAULT 'Featured',
ADD COLUMN IF NOT EXISTS promotion_badge_color VARCHAR DEFAULT '#ff0000',
ADD COLUMN IF NOT EXISTS promotion_badge_text_color VARCHAR DEFAULT '#ffffff',
ADD COLUMN IF NOT EXISTS show_preview BOOLEAN DEFAULT true;

-- Create new RLS policies to ensure proper access
ALTER TABLE featured_products_config ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated reads
DROP POLICY IF EXISTS "Allow authenticated reads on featured_products_config" ON featured_products_config;
CREATE POLICY "Allow authenticated reads on featured_products_config" 
  ON featured_products_config FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy to allow admins to insert/update/delete - use emails directly instead of admin_users table
DROP POLICY IF EXISTS "Allow admin full access to featured_products_config" ON featured_products_config;
CREATE POLICY "Allow admin full access to featured_products_config" 
  ON featured_products_config FOR ALL
  USING (auth.role() = 'authenticated' AND auth.email() IN (
    'admin@example.com', 'admin@houseofgrappling.com'
  ));

-- Allow anon to read for public access
DROP POLICY IF EXISTS "Allow public read access to featured_products_config" ON featured_products_config;
CREATE POLICY "Allow public read access to featured_products_config" 
  ON featured_products_config FOR SELECT
  USING (true); 