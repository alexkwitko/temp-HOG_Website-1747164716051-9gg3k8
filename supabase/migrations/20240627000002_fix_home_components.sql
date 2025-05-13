-- Fix missing columns in home_components table
ALTER TABLE home_components ADD COLUMN IF NOT EXISTS component_type TEXT;
ALTER TABLE home_components ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE home_components ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE home_components ADD COLUMN IF NOT EXISTS config JSONB DEFAULT '{}'::jsonb;
ALTER TABLE home_components ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;
ALTER TABLE home_components ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Fix missing columns in home_page_components table
ALTER TABLE home_page_components ADD COLUMN IF NOT EXISTS component_type TEXT;
ALTER TABLE home_page_components ADD COLUMN IF NOT EXISTS config JSONB DEFAULT '{}'::jsonb;
ALTER TABLE home_page_components ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;
ALTER TABLE home_page_components ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE home_page_components ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE home_page_components ADD COLUMN IF NOT EXISTS background_color TEXT DEFAULT '#FFFFFF';
ALTER TABLE home_page_components ADD COLUMN IF NOT EXISTS text_color TEXT DEFAULT '#000000';
ALTER TABLE home_page_components ADD COLUMN IF NOT EXISTS border_color TEXT DEFAULT 'transparent';
ALTER TABLE home_page_components ADD COLUMN IF NOT EXISTS border_width INTEGER DEFAULT 0;
ALTER TABLE home_page_components ADD COLUMN IF NOT EXISTS border_radius INTEGER DEFAULT 0;
ALTER TABLE home_page_components ADD COLUMN IF NOT EXISTS padding TEXT DEFAULT '0px';
ALTER TABLE home_page_components ADD COLUMN IF NOT EXISTS margin TEXT DEFAULT '0px';
ALTER TABLE home_page_components ADD COLUMN IF NOT EXISTS width TEXT DEFAULT '100%';
ALTER TABLE home_page_components ADD COLUMN IF NOT EXISTS height TEXT DEFAULT 'auto';
ALTER TABLE home_page_components ADD COLUMN IF NOT EXISTS vertical_align TEXT DEFAULT 'center';
ALTER TABLE home_page_components ADD COLUMN IF NOT EXISTS horizontal_align TEXT DEFAULT 'center';
ALTER TABLE home_page_components ADD COLUMN IF NOT EXISTS palette_override TEXT;
ALTER TABLE home_page_components ADD COLUMN IF NOT EXISTS text_background_enabled BOOLEAN DEFAULT false;
ALTER TABLE home_page_components ADD COLUMN IF NOT EXISTS text_background_color TEXT DEFAULT 'rgba(0,0,0,0.7)';
ALTER TABLE home_page_components ADD COLUMN IF NOT EXISTS text_background_opacity INTEGER DEFAULT 70;

-- Fix feature_products_config table
ALTER TABLE featured_products_config ADD COLUMN IF NOT EXISTS button_url TEXT DEFAULT '/shop';
ALTER TABLE featured_products_config ADD COLUMN IF NOT EXISTS button_bg_color TEXT DEFAULT '#000000';
ALTER TABLE featured_products_config ADD COLUMN IF NOT EXISTS button_hover_color TEXT DEFAULT '#222222';
ALTER TABLE featured_products_config ADD COLUMN IF NOT EXISTS button_alignment TEXT DEFAULT 'center';
ALTER TABLE featured_products_config ADD COLUMN IF NOT EXISTS columns_layout TEXT DEFAULT '3';
ALTER TABLE featured_products_config ADD COLUMN IF NOT EXISTS enable_special_promotion BOOLEAN DEFAULT false;
ALTER TABLE featured_products_config ADD COLUMN IF NOT EXISTS promoted_product_id UUID;
ALTER TABLE featured_products_config ADD COLUMN IF NOT EXISTS promotion_badge_text TEXT DEFAULT 'Featured';
ALTER TABLE featured_products_config ADD COLUMN IF NOT EXISTS promotion_badge_color TEXT DEFAULT '#ff0000';
ALTER TABLE featured_products_config ADD COLUMN IF NOT EXISTS promotion_badge_text_color TEXT DEFAULT '#ffffff';
ALTER TABLE featured_products_config ADD COLUMN IF NOT EXISTS show_preview BOOLEAN DEFAULT true;
ALTER TABLE featured_products_config ADD COLUMN IF NOT EXISTS max_display_count INTEGER DEFAULT 3;

-- Fix methodology table fields for icon handling
ALTER TABLE methodology ADD COLUMN IF NOT EXISTS icon_name TEXT DEFAULT 'Shield';
ALTER TABLE methodology ADD COLUMN IF NOT EXISTS text_color TEXT DEFAULT '#333333';
ALTER TABLE methodology ADD COLUMN IF NOT EXISTS icon_color TEXT DEFAULT '#333333';
ALTER TABLE methodology ADD COLUMN IF NOT EXISTS text_alignment TEXT DEFAULT 'left';
ALTER TABLE methodology ADD COLUMN IF NOT EXISTS icon_alignment TEXT DEFAULT 'left';
ALTER TABLE methodology ADD COLUMN IF NOT EXISTS button_text TEXT;
ALTER TABLE methodology ADD COLUMN IF NOT EXISTS button_url TEXT;

-- Insert default home page components if they don't exist
INSERT INTO home_page_components (component_type, name, "order", is_active, background_color, text_color, border_color, border_width, border_radius, padding, margin, width, height, vertical_align, horizontal_align)
SELECT 'hero', 'Hero Section', 1, true, 'transparent', '#FFFFFF', 'transparent', 0, 0, '0px', '0px', '100%', 'auto', 'center', 'center'
WHERE NOT EXISTS (SELECT 1 FROM home_page_components WHERE component_type = 'hero');

INSERT INTO home_page_components (component_type, name, "order", is_active, background_color, text_color, border_color, border_width, border_radius, padding, margin, width, height, vertical_align, horizontal_align)
SELECT 'why_choose', 'Why Choose Section', 2, true, '#FFFFFF', '#000000', 'transparent', 0, 0, '80px 0', '0px', '100%', 'auto', 'center', 'center'
WHERE NOT EXISTS (SELECT 1 FROM home_page_components WHERE component_type = 'why_choose');

INSERT INTO home_page_components (component_type, name, "order", is_active, background_color, text_color, border_color, border_width, border_radius, padding, margin, width, height, vertical_align, horizontal_align)
SELECT 'location', 'Location Section', 3, true, '#F5F5F5', '#000000', 'transparent', 0, 0, '80px 0', '0px', '100%', 'auto', 'center', 'center'
WHERE NOT EXISTS (SELECT 1 FROM home_page_components WHERE component_type = 'location');

INSERT INTO home_page_components (component_type, name, "order", is_active, background_color, text_color, border_color, border_width, border_radius, padding, margin, width, height, vertical_align, horizontal_align)
SELECT 'featured_programs', 'Featured Programs', 4, true, '#FFFFFF', '#000000', 'transparent', 0, 0, '80px 0', '0px', '100%', 'auto', 'center', 'center'
WHERE NOT EXISTS (SELECT 1 FROM home_page_components WHERE component_type = 'featured_programs');

INSERT INTO home_page_components (component_type, name, "order", is_active, background_color, text_color, border_color, border_width, border_radius, padding, margin, width, height, vertical_align, horizontal_align)
SELECT 'methodology', 'Training Methodology', 5, true, '#1A1A1A', '#FFFFFF', 'transparent', 0, 0, '80px 0', '0px', '100%', 'auto', 'center', 'center'
WHERE NOT EXISTS (SELECT 1 FROM home_page_components WHERE component_type = 'methodology');

INSERT INTO home_page_components (component_type, name, "order", is_active, background_color, text_color, border_color, border_width, border_radius, padding, margin, width, height, vertical_align, horizontal_align)
SELECT 'featured_products', 'Featured Products', 6, true, '#F5F5F5', '#000000', 'transparent', 0, 0, '80px 0', '0px', '100%', 'auto', 'center', 'center'
WHERE NOT EXISTS (SELECT 1 FROM home_page_components WHERE component_type = 'featured_products');

INSERT INTO home_page_components (component_type, name, "order", is_active, background_color, text_color, border_color, border_width, border_radius, padding, margin, width, height, vertical_align, horizontal_align)
SELECT 'cta', 'Call to Action', 7, true, '#1A1A1A', '#FFFFFF', 'transparent', 0, 0, '80px 0', '0px', '100%', 'auto', 'center', 'center'
WHERE NOT EXISTS (SELECT 1 FROM home_page_components WHERE component_type = 'cta');

-- Insert default methodology items if they don't exist
INSERT INTO methodology (title, description, icon_name, "order", is_active, text_color, icon_color, text_alignment, icon_alignment)
SELECT 'Fundamentals First', 'Master the core techniques and principles that form the foundation of effective BJJ.', 'Shield', 1, true, '#333333', '#333333', 'left', 'left'
WHERE NOT EXISTS (SELECT 1 FROM methodology WHERE title = 'Fundamentals First');

INSERT INTO methodology (title, description, icon_name, "order", is_active, text_color, icon_color, text_alignment, icon_alignment)
SELECT 'Progressive Learning', 'Structured curriculum that builds complexity as you advance in your journey.', 'Target', 2, true, '#333333', '#333333', 'left', 'left'
WHERE NOT EXISTS (SELECT 1 FROM methodology WHERE title = 'Progressive Learning');

INSERT INTO methodology (title, description, icon_name, "order", is_active, text_color, icon_color, text_alignment, icon_alignment)
SELECT 'Conceptual Understanding', 'Focus on the underlying principles that connect techniques and positions.', 'Brain', 3, true, '#333333', '#333333', 'left', 'left'
WHERE NOT EXISTS (SELECT 1 FROM methodology WHERE title = 'Conceptual Understanding');

INSERT INTO methodology (title, description, icon_name, "order", is_active, text_color, icon_color, text_alignment, icon_alignment)
SELECT 'Practical Application', 'Regular drilling and sparring to develop real-world effectiveness.', 'Dumbbell', 4, true, '#333333', '#333333', 'left', 'left'
WHERE NOT EXISTS (SELECT 1 FROM methodology WHERE title = 'Practical Application');

-- Insert default featured products config if it doesn't exist
INSERT INTO featured_products_config (id, heading, subheading, background_color, text_color, button_text, button_url, button_color, button_text_color, button_bg_color, button_hover_color, button_alignment, columns_layout, promotion_badge_text, promotion_badge_color, promotion_badge_text_color, show_preview)
SELECT 1, 'Featured Products', 'Shop our selection of high-quality products', '#ffffff', '#000000', 'Shop Now', '/shop', '#000000', '#ffffff', '#000000', '#222222', 'center', '3', 'Featured', '#ff0000', '#ffffff', true
WHERE NOT EXISTS (SELECT 1 FROM featured_products_config WHERE id = 1);

-- Add trigger for updated_at in featured_products_config
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now(); 
   RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_featured_products_config_updated_at ON featured_products_config;
CREATE TRIGGER update_featured_products_config_updated_at
BEFORE UPDATE ON featured_products_config
FOR EACH ROW
EXECUTE FUNCTION update_modified_column(); 