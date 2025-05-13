-- Insert BJJ Products using the new variant system
-- This uses the create_product_with_variants function to add products with all their size/color variants

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
) RETURNS UUID AS $$
DECLARE
  product_id UUID;
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
      -- Create variants for each color
      FOREACH color_value IN ARRAY p_colors LOOP
        -- Get the color attribute value id
        SELECT id INTO color_value_id FROM attribute_values 
        WHERE value = color_value AND attribute_type_id = (SELECT id FROM attribute_types WHERE name = 'color');
        
        -- Create a variant with both size and color
        INSERT INTO product_variants (product_id, sku, stock_quantity)
        VALUES (product_id, p_name || '-' || size_value || '-' || color_value, p_stock_quantity)
        RETURNING id INTO variant_id;
        
        -- Link both attributes to the variant
        INSERT INTO product_variant_attributes (product_variant_id, attribute_value_id)
        VALUES 
          (variant_id, size_value_id),
          (variant_id, color_value_id);
      END LOOP;
    END IF;
  END LOOP;

  RETURN product_id;
END;
$$ LANGUAGE plpgsql;

-- GIs (Traditional Kimonos)
SELECT create_product_with_variants(
  'HOG Elite Gi',
  'Premium competition gi with reinforced stitching and embroidered logos.',
  159.99,
  'https://images.unsplash.com/photo-1593810450967-f9c42742e3b5?q=80&w=2940&auto=format&fit=crop',
  'gi',
  true,
  ARRAY['A1', 'A2', 'A3', 'A4'],
  ARRAY['Blue', 'Black']
);

-- Rashguards
SELECT create_product_with_variants(
  'HOG Performance Rashguard',
  'Competition-grade rashguard with 4-way stretch fabric and flatlock seams.',
  49.99,
  'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2576&auto=format&fit=crop',
  'rashguards',
  true,
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['Black/Red', 'Blue']
);

-- Shorts
SELECT create_product_with_variants(
  'HOG Fight Shorts',
  'Lightweight nylon competition shorts with side slits for maximum mobility.',
  39.99,
  'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=2940&auto=format&fit=crop',
  'shorts',
  true,
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['Black', 'Blue']
);

-- T-Shirts
SELECT create_product_with_variants(
  'HOG Logo T-Shirt',
  'Soft cotton T-shirt with House of Grappling logo. Perfect for casual wear.',
  24.99,
  'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=3087&auto=format&fit=crop',
  't-shirts',
  false,
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['Gray', 'Black', 'White']
);

-- Hoodies
SELECT create_product_with_variants(
  'HOG Zip-Up Hoodie',
  'Lightweight full-zip hoodie perfect for before and after training.',
  64.99,
  'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=3072&auto=format&fit=crop',
  'hoodies',
  true,
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['Gray', 'Black']
);

-- Belts (no color variants, just sizes)
SELECT create_product_with_variants(
  'HOG BJJ Belt',
  'Premium cotton BJJ belt with embroidered HOG logo.',
  29.99,
  'https://images.unsplash.com/photo-1617050318658-a9a22c962fc4?q=80&w=2600&auto=format&fit=crop',
  'belts',
  false,
  ARRAY['A0', 'A1', 'A2', 'A3', 'A4'],
  NULL  -- No colors needed as the belt color is determined by rank
);

-- Accessories (no size variants)
-- For products without sizes, we need to add them to products table directly
-- and then create variants manually if needed

-- Mouthguard
INSERT INTO products (name, description, base_price, image_url, category, is_featured)
VALUES ('HOG Mouthguard', 'Competition-grade mouthguard with carrying case. Essential protection for rolling.', 
       19.99, 'https://images.unsplash.com/photo-1589189951169-b8318e1d7cc1?q=80&w=3000&auto=format&fit=crop', 
       'accessories', false);

-- Create a variant for the mouthguard with default attributes
WITH new_product AS (
  SELECT id FROM products WHERE name = 'HOG Mouthguard' ORDER BY created_at DESC LIMIT 1
)
INSERT INTO product_variants (product_id, sku, stock_quantity) 
VALUES ((SELECT id FROM new_product), 'HOG-MOUTHGUARD', 50);

-- Gym Bag
INSERT INTO products (name, description, base_price, image_url, category, is_featured)
VALUES ('HOG Gym Bag', 'Spacious gym bag with dedicated compartments for gi, no-gi gear, and accessories. Water-resistant.', 
       79.99, 'https://images.unsplash.com/photo-1588099768531-a72d4a198538?q=80&w=3087&auto=format&fit=crop', 
       'accessories', true);
       
-- Create variants for the gym bag with different colors
WITH new_product AS (
  SELECT id FROM products WHERE name = 'HOG Gym Bag' ORDER BY created_at DESC LIMIT 1
),
black_color AS (
  SELECT id FROM attribute_values 
  WHERE value = 'Black' AND attribute_type_id = (SELECT id FROM attribute_types WHERE name = 'color')
),
blue_color AS (
  SELECT id FROM attribute_values 
  WHERE value = 'Blue' AND attribute_type_id = (SELECT id FROM attribute_types WHERE name = 'color')
)
INSERT INTO product_variants (product_id, sku, stock_quantity)
VALUES 
  ((SELECT id FROM new_product), 'HOG-BAG-BLACK', 20),
  ((SELECT id FROM new_product), 'HOG-BAG-BLUE', 20)
RETURNING id INTO variant_id;

-- Link colors to variants
INSERT INTO product_variant_attributes (product_variant_id, attribute_value_id)
SELECT variant_id, id FROM black_color
UNION ALL
SELECT variant_id, id FROM blue_color; 