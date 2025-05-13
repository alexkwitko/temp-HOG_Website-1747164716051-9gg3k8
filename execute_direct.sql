-- Add missing columns to featured_products_config table
ALTER TABLE public.featured_products_config
  ADD COLUMN IF NOT EXISTS button_text TEXT DEFAULT 'View Product',
  ADD COLUMN IF NOT EXISTS button_url TEXT DEFAULT '/shop',
  ADD COLUMN IF NOT EXISTS button_bg_color TEXT DEFAULT '#000000',
  ADD COLUMN IF NOT EXISTS button_text_color TEXT DEFAULT '#ffffff',
  ADD COLUMN IF NOT EXISTS button_hover_color TEXT DEFAULT '#222222',
  ADD COLUMN IF NOT EXISTS button_alignment TEXT DEFAULT 'center',
  ADD COLUMN IF NOT EXISTS columns_layout TEXT DEFAULT '3',
  ADD COLUMN IF NOT EXISTS enable_special_promotion BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS promoted_product_id UUID DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS promotion_badge_text TEXT DEFAULT 'Featured',
  ADD COLUMN IF NOT EXISTS promotion_badge_color TEXT DEFAULT '#ff0000',
  ADD COLUMN IF NOT EXISTS promotion_badge_text_color TEXT DEFAULT '#ffffff',
  ADD COLUMN IF NOT EXISTS show_preview BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS max_display_count INTEGER DEFAULT 3; 