-- Drop existing tables if needed (be careful in production!)
-- DROP TABLE IF EXISTS product_variant_attributes CASCADE;
-- DROP TABLE IF EXISTS product_variants CASCADE;
-- DROP TABLE IF EXISTS product_attributes CASCADE;
-- DROP TABLE IF EXISTS products CASCADE;

-- Base products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attribute types (size, color, etc.)
CREATE TABLE IF NOT EXISTS attribute_types (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

-- Insert common attribute types
INSERT INTO attribute_types (name, description)
VALUES 
  ('size', 'Product size variations'),
  ('color', 'Product color variations')
ON CONFLICT (name) DO NOTHING;

-- Attribute values (S, M, L, red, blue, etc.)
CREATE TABLE IF NOT EXISTS attribute_values (
  id SERIAL PRIMARY KEY,
  attribute_type_id INTEGER REFERENCES attribute_types(id),
  value TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  UNIQUE (attribute_type_id, value)
);

-- Insert common sizes
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

-- Insert common colors
INSERT INTO attribute_values (attribute_type_id, value, display_order)
VALUES 
  ((SELECT id FROM attribute_types WHERE name = 'color'), 'White', 10),
  ((SELECT id FROM attribute_types WHERE name = 'color'), 'Black', 20),
  ((SELECT id FROM attribute_types WHERE name = 'color'), 'Blue', 30),
  ((SELECT id FROM attribute_types WHERE name = 'color'), 'Red', 40),
  ((SELECT id FROM attribute_types WHERE name = 'color'), 'Gray', 50)
ON CONFLICT (attribute_type_id, value) DO NOTHING;

-- Create product variants table
CREATE TABLE IF NOT EXISTS product_variants (
  id SERIAL PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT UNIQUE,
  title TEXT,
  price DECIMAL(10, 2) NOT NULL,
  compare_at_price DECIMAL(10, 2),
  inventory_quantity INTEGER DEFAULT 0,
  inventory_policy TEXT DEFAULT 'deny', -- deny, continue
  inventory_management TEXT DEFAULT 'shopify', -- shopify, manual
  barcode TEXT,
  weight DECIMAL(10, 2),
  weight_unit TEXT DEFAULT 'kg', -- kg, g, lb, oz
  option1 TEXT,
  option2 TEXT,
  option3 TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product options table
CREATE TABLE IF NOT EXISTS product_options (
  id SERIAL PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  values TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product variant options table
CREATE TABLE IF NOT EXISTS product_variant_options (
  id SERIAL PRIMARY KEY,
  variant_id INTEGER REFERENCES product_variants(id) ON DELETE CASCADE,
  option_id INTEGER REFERENCES product_options(id) ON DELETE CASCADE,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Link variants with attribute values
CREATE TABLE IF NOT EXISTS product_variant_attributes (
  id SERIAL PRIMARY KEY,
  product_variant_id INTEGER REFERENCES product_variants(id) ON DELETE CASCADE,
  attribute_value_id INTEGER REFERENCES attribute_values(id),
  UNIQUE(product_variant_id, attribute_value_id)
);

-- Inventory levels table
CREATE TABLE IF NOT EXISTS inventory_levels (
  id SERIAL PRIMARY KEY,
  variant_id INTEGER REFERENCES product_variants(id) ON DELETE CASCADE,
  location_id INTEGER REFERENCES locations(id) ON DELETE CASCADE,
  available_quantity INTEGER DEFAULT 0,
  reserved_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(variant_id, location_id)
);

-- Order Line Items
CREATE TABLE IF NOT EXISTS order_line_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id INTEGER REFERENCES product_variants(id) ON DELETE SET NULL,
  sku TEXT,
  name TEXT NOT NULL,
  variant_title TEXT,
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  tax_lines JSONB,
  discount_lines JSONB,
  properties JSONB,
  requires_shipping BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fulfillment Line Items
CREATE TABLE IF NOT EXISTS fulfillment_line_items (
  id SERIAL PRIMARY KEY,
  fulfillment_id INTEGER REFERENCES fulfillments(id) ON DELETE CASCADE,
  order_line_item_id INTEGER REFERENCES order_line_items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Refund Line Items
CREATE TABLE IF NOT EXISTS refund_line_items (
  id SERIAL PRIMARY KEY,
  refund_id INTEGER REFERENCES refunds(id) ON DELETE CASCADE,
  order_line_item_id INTEGER REFERENCES order_line_items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  restocked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription Items (products in a subscription)
CREATE TABLE IF NOT EXISTS subscription_items (
  id SERIAL PRIMARY KEY,
  subscription_id INTEGER REFERENCES subscriptions(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id INTEGER REFERENCES product_variants(id) ON DELETE SET NULL,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Helper view to see all product variants with their attributes
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

-- Example function to create a product with variants
CREATE OR REPLACE FUNCTION create_product_with_variants(
  p_name TEXT,
  p_description TEXT,
  p_base_price DECIMAL,
  p_image_url TEXT,
  p_category TEXT,
  p_is_featured BOOLEAN,
  p_sizes TEXT[],
  p_colors TEXT[],
  p_stock_quantity INTEGER DEFAULT 10
) RETURNS INTEGER AS $$
DECLARE
  product_id INTEGER;
  variant_id INTEGER;
  size_value_id INTEGER;
  color_value_id INTEGER;
  size_value TEXT;
  color_value TEXT;
BEGIN
  -- Insert the base product
  INSERT INTO products (name, description, base_price, image_url, category, is_featured)
  VALUES (p_name, p_description, p_base_price, p_image_url, p_category, p_is_featured)
  RETURNING id INTO product_id;

  -- Create variants for each size/color combination
  FOREACH size_value IN ARRAY p_sizes LOOP
    -- Get the size attribute value id
    SELECT id INTO size_value_id FROM attribute_values 
    WHERE value = size_value AND attribute_type_id = (SELECT id FROM attribute_types WHERE name = 'size');
    
    -- If no colors specified, create a variant with just the size
    IF array_length(p_colors, 1) IS NULL THEN
      -- Create a variant with just the size
      INSERT INTO product_variants (product_id, sku, stock_quantity)
      VALUES (product_id, p_name || '-' || size_value, p_stock_quantity)
      RETURNING id INTO variant_id;
      
      -- Link the size attribute to the variant
      INSERT INTO product_variant_attributes (product_variant_id, attribute_value_id)
      VALUES (variant_id, size_value_id);
    ELSE
      -- Create a variant for each color in this size
      FOREACH color_value IN ARRAY p_colors LOOP
        -- Get the color attribute value id
        SELECT id INTO color_value_id FROM attribute_values 
        WHERE value = color_value AND attribute_type_id = (SELECT id FROM attribute_types WHERE name = 'color');
        
        -- Create a variant with size and color
        INSERT INTO product_variants (product_id, sku, stock_quantity)
        VALUES (product_id, p_name || '-' || size_value || '-' || color_value, p_stock_quantity)
        RETURNING id INTO variant_id;
        
        -- Link the size attribute to the variant
        INSERT INTO product_variant_attributes (product_variant_id, attribute_value_id)
        VALUES (variant_id, size_value_id);
        
        -- Link the color attribute to the variant
        INSERT INTO product_variant_attributes (product_variant_id, attribute_value_id)
        VALUES (variant_id, color_value_id);
      END LOOP;
    END IF;
  END LOOP;
  
  RETURN product_id;
END;
$$ LANGUAGE plpgsql;

-- Example usage (commented out)
-- SELECT create_product_with_variants(
--   'HOG Elite Gi',
--   'Premium competition gi with reinforced stitching and embroidered logos.',
--   159.99,
--   'https://images.unsplash.com/photo-1555597673-b21d5c935865',
--   'gi',
--   true,
--   ARRAY['A0', 'A1', 'A2', 'A3', 'A4'],
--   ARRAY['White', 'Blue', 'Black']
-- ); 