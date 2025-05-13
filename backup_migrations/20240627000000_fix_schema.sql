-- Drop problematic views first
DROP VIEW IF EXISTS product_variants_view;
DROP VIEW IF EXISTS admin_product_variants;
DROP VIEW IF EXISTS admin_products_summary;
DROP VIEW IF EXISTS product_available_sizes;
DROP VIEW IF EXISTS product_available_colors;

-- Create products table if it doesn't exist
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10, 2),
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

-- Add missing columns to products table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'category') THEN
    ALTER TABLE products ADD COLUMN category TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'base_price') THEN
    ALTER TABLE products ADD COLUMN base_price DECIMAL(10, 2);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'is_featured') THEN
    ALTER TABLE products ADD COLUMN is_featured BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Add missing columns to product_variants table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_variants' AND column_name = 'price_adjustment') THEN
    ALTER TABLE product_variants ADD COLUMN price_adjustment DECIMAL(10, 2) DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_variants' AND column_name = 'stock_quantity') THEN
    ALTER TABLE product_variants ADD COLUMN stock_quantity INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_variants' AND column_name = 'is_available') THEN
    ALTER TABLE product_variants ADD COLUMN is_available BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Recreate the views only if all required columns exist
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' 
    AND column_name IN ('category', 'base_price', 'is_featured')
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'product_variants' 
    AND column_name IN ('price_adjustment', 'stock_quantity', 'is_available')
  ) THEN
    EXECUTE '
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
      pv.id, p.id';
  END IF;
END $$; 