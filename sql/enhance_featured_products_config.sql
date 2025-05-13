-- Add missing columns to featured_products_config table
ALTER TABLE featured_products_config
  ADD COLUMN IF NOT EXISTS button_text TEXT,
  ADD COLUMN IF NOT EXISTS button_url TEXT,
  ADD COLUMN IF NOT EXISTS button_bg_color TEXT,
  ADD COLUMN IF NOT EXISTS button_text_color TEXT,
  ADD COLUMN IF NOT EXISTS button_hover_color TEXT,
  ADD COLUMN IF NOT EXISTS button_alignment TEXT,
  ADD COLUMN IF NOT EXISTS columns_layout TEXT,
  ADD COLUMN IF NOT EXISTS enable_special_promotion BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS promoted_product_id UUID,
  ADD COLUMN IF NOT EXISTS promotion_badge_text TEXT,
  ADD COLUMN IF NOT EXISTS promotion_badge_color TEXT,
  ADD COLUMN IF NOT EXISTS promotion_badge_text_color TEXT,
  ADD COLUMN IF NOT EXISTS show_preview BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS max_display_count INTEGER DEFAULT 3;

-- Set default values for existing records
UPDATE featured_products_config
SET 
  button_text = 'View Product',
  button_url = '/shop',
  button_bg_color = '#000000',
  button_text_color = '#ffffff',
  button_hover_color = '#222222',
  button_alignment = 'center',
  columns_layout = '3',
  enable_special_promotion = FALSE,
  promotion_badge_text = 'Featured',
  promotion_badge_color = '#ff0000',
  promotion_badge_text_color = '#ffffff',
  show_preview = TRUE,
  max_display_count = 3
WHERE id = '00000000-0000-0000-0000-000000000002'; 