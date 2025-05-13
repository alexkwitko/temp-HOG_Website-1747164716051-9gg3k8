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
  ADD COLUMN IF NOT EXISTS show_preview BOOLEAN DEFAULT TRUE;

-- Update default record with new column values
UPDATE public.featured_products_config
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
  show_preview = TRUE
WHERE id = '00000000-0000-0000-0000-000000000002';

-- Also update the '00000000-0000-0000-0000-000000000001' record if it exists
UPDATE public.featured_products_config
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
  show_preview = TRUE
WHERE id = '00000000-0000-0000-0000-000000000001'; 