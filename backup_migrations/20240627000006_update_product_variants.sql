-- Update product_variants table to better integrate with full e-commerce system
-- This script assumes that you've already created the basic product_variants table

-- 1. First, update stock_quantity in existing variants to copy to inventory_levels
DO $$
DECLARE
  default_location_id INTEGER;
BEGIN
  -- Get the default location
  SELECT id INTO default_location_id FROM locations ORDER BY id LIMIT 1;
  
  -- If we found a location, transfer stock data to inventory_levels
  IF default_location_id IS NOT NULL THEN
    -- Insert into inventory_levels if not exists
    INSERT INTO inventory_levels (variant_id, location_id, available_quantity)
    SELECT 
      pv.id, 
      default_location_id, 
      pv.stock_quantity
    FROM 
      product_variants pv
    WHERE 
      NOT EXISTS (
        SELECT 1 FROM inventory_levels 
        WHERE variant_id = pv.id AND location_id = default_location_id
      );
    
    -- Or update if it does exist
    UPDATE inventory_levels il
    SET available_quantity = pv.stock_quantity
    FROM product_variants pv
    WHERE il.variant_id = pv.id 
      AND il.location_id = default_location_id
      AND il.available_quantity != pv.stock_quantity;
  END IF;
END $$;

-- 2. Add relationship to product images (allow variant-specific images)
-- Add variant_id column to product_images if not already exists
DO $$
BEGIN
  -- Check if column exists already
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'product_images' AND column_name = 'variant_id'
  ) THEN
    -- Add column with foreign key constraint
    ALTER TABLE product_images 
    ADD COLUMN variant_id INTEGER REFERENCES product_variants(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 3. Create initial product images from the image_url in products and product_variants
INSERT INTO product_images (product_id, variant_id, image_url, is_thumbnail, position)
SELECT 
  p.id,
  NULL,
  p.image_url,
  true,
  0
FROM 
  products p
WHERE 
  p.image_url IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM product_images 
    WHERE product_id = p.id AND variant_id IS NULL AND image_url = p.image_url
  );

-- Add variant-specific images
INSERT INTO product_images (product_id, variant_id, image_url, is_thumbnail, position)
SELECT 
  pv.product_id,
  pv.id,
  pv.image_url,
  true,
  0
FROM 
  product_variants pv
WHERE 
  pv.image_url IS NOT NULL
  AND pv.image_url != (SELECT image_url FROM products WHERE id = pv.product_id)
  AND NOT EXISTS (
    SELECT 1 FROM product_images 
    WHERE product_id = pv.product_id AND variant_id = pv.id AND image_url = pv.image_url
  );

-- 4. Create a trigger to sync stock_quantity with inventory_levels
CREATE OR REPLACE FUNCTION sync_variant_stock_with_inventory_levels()
RETURNS TRIGGER AS $$
DECLARE
  default_location_id INTEGER;
BEGIN
  -- Get the default location ID
  SELECT id INTO default_location_id FROM locations ORDER BY id LIMIT 1;
  
  IF default_location_id IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Update or insert into inventory_levels
  INSERT INTO inventory_levels (variant_id, location_id, available_quantity)
  VALUES (NEW.id, default_location_id, NEW.stock_quantity)
  ON CONFLICT (variant_id, location_id) 
  DO UPDATE SET available_quantity = NEW.stock_quantity, updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS sync_variant_stock_trigger ON product_variants;

-- Create the trigger
CREATE TRIGGER sync_variant_stock_trigger
AFTER INSERT OR UPDATE OF stock_quantity ON product_variants
FOR EACH ROW
EXECUTE FUNCTION sync_variant_stock_with_inventory_levels();

-- 5. Create a trigger to sync inventory_levels with stock_quantity in product_variants
CREATE OR REPLACE FUNCTION sync_inventory_levels_with_variant_stock()
RETURNS TRIGGER AS $$
BEGIN
  -- Update stock_quantity in product_variants
  UPDATE product_variants
  SET stock_quantity = NEW.available_quantity
  WHERE id = NEW.variant_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS sync_inventory_levels_trigger ON inventory_levels;

-- Create the trigger
CREATE TRIGGER sync_inventory_levels_trigger
AFTER INSERT OR UPDATE OF available_quantity ON inventory_levels
FOR EACH ROW
EXECUTE FUNCTION sync_inventory_levels_with_variant_stock(); 