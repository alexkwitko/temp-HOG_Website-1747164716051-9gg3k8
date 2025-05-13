-- Fix product_id type inconsistencies
-- First, drop the problematic view
DROP VIEW IF EXISTS product_variants_view;

-- Update product_variants table to use UUID
ALTER TABLE product_variants 
  ALTER COLUMN product_id TYPE UUID USING product_id::UUID;

-- Update product_variant_attributes table
ALTER TABLE product_variant_attributes
  DROP CONSTRAINT IF EXISTS product_variant_attributes_product_variant_id_fkey;

-- Update order_line_items table
ALTER TABLE order_line_items
  ALTER COLUMN product_id TYPE UUID USING product_id::UUID;

-- Update product_images table
ALTER TABLE product_images
  ALTER COLUMN product_id TYPE UUID USING product_id::UUID;

-- Update collection_products table
ALTER TABLE collection_products
  ALTER COLUMN product_id TYPE UUID USING product_id::UUID;

-- Update subscription_items table
ALTER TABLE subscription_items
  ALTER COLUMN product_id TYPE UUID USING product_id::UUID;

-- Recreate the product_variants_view
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