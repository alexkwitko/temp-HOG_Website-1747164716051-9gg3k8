-- Create useful views for the admin interface
-- These views will make it easier to manage products and their variants

-- View to see all products with variant counts
CREATE OR REPLACE VIEW admin_products_summary AS
SELECT 
  p.id,
  p.name,
  p.description,
  p.base_price,
  p.category,
  p.is_featured,
  p.image_url,
  COUNT(DISTINCT pv.id) AS variant_count,
  SUM(pv.stock_quantity) AS total_stock,
  p.created_at,
  p.updated_at
FROM 
  products p
LEFT JOIN 
  product_variants pv ON p.id = pv.product_id
GROUP BY 
  p.id
ORDER BY 
  p.created_at DESC;

-- View to see available sizes for each product
CREATE OR REPLACE VIEW product_available_sizes AS
SELECT 
  p.id AS product_id,
  p.name AS product_name,
  ARRAY_AGG(DISTINCT av.value ORDER BY av.display_order) AS available_sizes
FROM 
  products p
JOIN 
  product_variants pv ON p.id = pv.product_id
JOIN 
  product_variant_attributes pva ON pv.id = pva.product_variant_id
JOIN 
  attribute_values av ON pva.attribute_value_id = av.id
JOIN 
  attribute_types at ON av.attribute_type_id = at.id
WHERE 
  at.name = 'size'
  AND pv.is_available = true
GROUP BY 
  p.id, p.name;

-- View to see available colors for each product
CREATE OR REPLACE VIEW product_available_colors AS
SELECT 
  p.id AS product_id,
  p.name AS product_name,
  ARRAY_AGG(DISTINCT av.value ORDER BY av.display_order) AS available_colors
FROM 
  products p
JOIN 
  product_variants pv ON p.id = pv.product_id
JOIN 
  product_variant_attributes pva ON pv.id = pva.product_variant_id
JOIN 
  attribute_values av ON pva.attribute_value_id = av.id
JOIN 
  attribute_types at ON av.attribute_type_id = at.id
WHERE 
  at.name = 'color'
  AND pv.is_available = true
GROUP BY 
  p.id, p.name;

-- View to see all variant details in a flat format (for admin interface)
CREATE OR REPLACE VIEW admin_product_variants AS
WITH size_attrs AS (
  SELECT 
    pva.product_variant_id,
    av.value AS size
  FROM 
    product_variant_attributes pva
  JOIN 
    attribute_values av ON pva.attribute_value_id = av.id
  JOIN 
    attribute_types at ON av.attribute_type_id = at.id
  WHERE 
    at.name = 'size'
),
color_attrs AS (
  SELECT 
    pva.product_variant_id,
    av.value AS color
  FROM 
    product_variant_attributes pva
  JOIN 
    attribute_values av ON pva.attribute_value_id = av.id
  JOIN 
    attribute_types at ON av.attribute_type_id = at.id
  WHERE 
    at.name = 'color'
)
SELECT 
  pv.id AS variant_id,
  p.id AS product_id,
  p.name AS product_name,
  p.category,
  s.size,
  c.color,
  (p.base_price + COALESCE(pv.price_adjustment, 0)) AS price,
  pv.sku,
  pv.stock_quantity,
  pv.is_available,
  COALESCE(pv.image_url, p.image_url) AS image_url
FROM 
  product_variants pv
JOIN 
  products p ON pv.product_id = p.id
LEFT JOIN 
  size_attrs s ON pv.id = s.product_variant_id
LEFT JOIN 
  color_attrs c ON pv.id = c.product_variant_id
ORDER BY 
  p.name, s.size, c.color; 