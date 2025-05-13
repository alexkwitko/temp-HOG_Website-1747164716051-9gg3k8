-- Drop and recreate home_page_components table with all needed columns
DROP TABLE IF EXISTS home_page_components CASCADE;

CREATE TABLE IF NOT EXISTS home_page_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  component_type TEXT,
  name TEXT,
  config JSONB DEFAULT '{}'::jsonb,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  background_color TEXT DEFAULT '#FFFFFF',
  text_color TEXT DEFAULT '#000000',
  border_color TEXT DEFAULT 'transparent',
  border_width INTEGER DEFAULT 0,
  border_radius INTEGER DEFAULT 0,
  padding TEXT DEFAULT '0px',
  margin TEXT DEFAULT '0px',
  width TEXT DEFAULT '100%',
  height TEXT DEFAULT 'auto',
  vertical_align TEXT DEFAULT 'center',
  horizontal_align TEXT DEFAULT 'center',
  palette_override TEXT,
  text_background_enabled BOOLEAN DEFAULT false,
  text_background_color TEXT DEFAULT 'rgba(0,0,0,0.7)',
  text_background_opacity INTEGER DEFAULT 70,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_home_page_components_updated_at ON home_page_components;
CREATE TRIGGER update_home_page_components_updated_at
BEFORE UPDATE ON home_page_components
FOR EACH ROW
EXECUTE FUNCTION update_modified_column(); 