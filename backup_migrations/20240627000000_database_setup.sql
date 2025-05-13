-- Drop schema and recreate
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

-- Base products table with UUID
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_variants table if it doesn't exist
CREATE TABLE IF NOT EXISTS product_variants (
  id SERIAL PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT,
  price_adjustment DECIMAL(10, 2) DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create attribute_types table if it doesn't exist
CREATE TABLE IF NOT EXISTS attribute_types (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

-- Create attribute_values table if it doesn't exist
CREATE TABLE IF NOT EXISTS attribute_values (
  id SERIAL PRIMARY KEY,
  attribute_type_id INTEGER REFERENCES attribute_types(id),
  value TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  UNIQUE (attribute_type_id, value)
);

-- Create product_variant_attributes table if it doesn't exist
CREATE TABLE IF NOT EXISTS product_variant_attributes (
  id SERIAL PRIMARY KEY,
  product_variant_id INTEGER REFERENCES product_variants(id) ON DELETE CASCADE,
  attribute_value_id INTEGER REFERENCES attribute_values(id),
  UNIQUE(product_variant_id, attribute_value_id)
);

-- Insert common attribute types if they don't exist
INSERT INTO attribute_types (name, description)
VALUES 
  ('size', 'Product size variations'),
  ('color', 'Product color variations')
ON CONFLICT (name) DO NOTHING;

-- Insert common sizes if they don't exist
INSERT INTO attribute_values (attribute_type_id, value, display_order)
VALUES 
  ((SELECT id FROM attribute_types WHERE name = 'size'), 'A0', 10),
  ((SELECT id FROM attribute_types WHERE name = 'size'), 'A1', 20),
  ((SELECT id FROM attribute_types WHERE name = 'size'), 'A2', 30),
  ((SELECT id FROM attribute_types WHERE name = 'size'), 'A3', 40),
  ((SELECT id FROM attribute_types WHERE name = 'size'), 'A4', 50),
  ((SELECT id FROM attribute_types WHERE name = 'size'), 'S', 60),
  ((SELECT id FROM attribute_types WHERE name = 'size'), 'M', 70),
  ((SELECT id FROM attribute_types WHERE name = 'size'), 'L', 80),
  ((SELECT id FROM attribute_types WHERE name = 'size'), 'XL', 90),
  ((SELECT id FROM attribute_types WHERE name = 'size'), 'XXL', 100)
ON CONFLICT (attribute_type_id, value) DO NOTHING;

-- Insert common colors if they don't exist
INSERT INTO attribute_values (attribute_type_id, value, display_order)
VALUES 
  ((SELECT id FROM attribute_types WHERE name = 'color'), 'White', 10),
  ((SELECT id FROM attribute_types WHERE name = 'color'), 'Black', 20),
  ((SELECT id FROM attribute_types WHERE name = 'color'), 'Blue', 30),
  ((SELECT id FROM attribute_types WHERE name = 'color'), 'Red', 40),
  ((SELECT id FROM attribute_types WHERE name = 'color'), 'Gray', 50)
ON CONFLICT (attribute_type_id, value) DO NOTHING;

-- Create product_images table
CREATE TABLE IF NOT EXISTS product_images (
  id SERIAL PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_thumbnail BOOLEAN DEFAULT false,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create collection_products junction table
CREATE TABLE IF NOT EXISTS collection_products (
  id SERIAL PRIMARY KEY,
  collection_id INTEGER REFERENCES collections(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(collection_id, product_id)
);

-- Create class_categories table
CREATE TABLE IF NOT EXISTS class_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#111827',
  icon TEXT DEFAULT 'Shield',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the programs table
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  features JSONB DEFAULT '[]'::jsonb,
  link TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  image_id UUID,
  use_icon BOOLEAN DEFAULT true,
  image_size TEXT DEFAULT 'medium'::text,
  image_url TEXT,
  image_text TEXT,
  image_text_color TEXT DEFAULT 'text-white'::text,
  image_text_size TEXT DEFAULT 'text-xl'::text,
  image_hover_effect TEXT DEFAULT 'scale'::text,
  category_id UUID REFERENCES class_categories(id),
  background_color TEXT DEFAULT '#f9fafb',
  text_color TEXT DEFAULT '#111827',
  button_color TEXT DEFAULT '#111827',
  button_text_color TEXT DEFAULT '#ffffff',
  button_text TEXT DEFAULT 'Learn More',
  level TEXT,
  duration INTEGER,
  is_featured BOOLEAN DEFAULT false,
  hero_image_url TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  overlay_color TEXT DEFAULT '#000000',
  overlay_opacity FLOAT DEFAULT 0.5,
  hero_text_color TEXT DEFAULT '#ffffff',
  hero_button_text TEXT DEFAULT 'Get Started',
  hero_button_color TEXT DEFAULT '#111827',
  hero_button_text_color TEXT DEFAULT '#ffffff',
  hero_button_url TEXT,
  video_url TEXT,
  has_parallax BOOLEAN DEFAULT false,
  content_alignment TEXT DEFAULT 'center'
);

-- Create featured_programs_config table
CREATE TABLE IF NOT EXISTS featured_programs_config (
  id INTEGER PRIMARY KEY,
  heading TEXT NOT NULL DEFAULT 'Featured Programs',
  subheading TEXT NOT NULL DEFAULT 'From beginner-friendly fundamentals to advanced training, find the perfect program for your journey.',
  featured_program_ids TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert default configuration
INSERT INTO featured_programs_config (id, heading, subheading, featured_program_ids)
VALUES (
  1,
  'Featured Programs',
  'From beginner-friendly fundamentals to advanced training, find the perfect program for your journey.',
  '{}'
) ON CONFLICT (id) DO NOTHING;

-- Create updated_at trigger if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for featured_programs_config
DROP TRIGGER IF EXISTS update_featured_programs_config_updated_at ON featured_programs_config;
CREATE TRIGGER update_featured_programs_config_updated_at
  BEFORE UPDATE ON featured_programs_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);
CREATE INDEX IF NOT EXISTS products_is_featured_idx ON products(is_featured);
CREATE INDEX IF NOT EXISTS product_variants_product_id_idx ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS product_variant_attributes_product_variant_id_idx ON product_variant_attributes(product_variant_id);
CREATE INDEX IF NOT EXISTS product_variant_attributes_attribute_value_id_idx ON product_variant_attributes(attribute_value_id);
CREATE INDEX IF NOT EXISTS programs_category_id_idx ON programs(category_id);
CREATE INDEX IF NOT EXISTS programs_is_featured_idx ON programs(is_featured);

-- Create view for product variants
CREATE OR REPLACE VIEW product_variants_view AS
SELECT 
  pv.id AS variant_id,
  p.id AS product_id,
  p.name AS product_name,
  p.category,
  p.is_featured,
  COALESCE(pv.image_url, p.image_url) AS image_url,
  (p.base_price + COALESCE(pv.price_adjustment, 0)) AS final_price,
  pv.sku,
  pv.stock_quantity,
  pv.is_available,
  json_object_agg(at.name, av.value) AS attributes
FROM 
  product_variants pv
JOIN 
  products p ON pv.product_id = p.id
LEFT JOIN 
  product_variant_attributes pva ON pv.id = pva.product_variant_id
LEFT JOIN 
  attribute_values av ON pva.attribute_value_id = av.id
LEFT JOIN 
  attribute_types at ON av.attribute_type_id = at.id
GROUP BY
  pv.id, p.id;

-- Grant appropriate permissions
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variant_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_programs_config ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage products" ON products USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to product_variants" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage product_variants" ON product_variants USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to class_categories" ON class_categories FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage class_categories" ON class_categories USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to programs" ON programs FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage programs" ON programs USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated'); 