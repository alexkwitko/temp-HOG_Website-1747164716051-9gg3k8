-- COMPLETE E-COMMERCE MIGRATION FOR HOUSE OF GRAPPLING
-- RUN THIS SCRIPT IN THE SUPABASE SQL EDITOR DIRECTLY

BEGIN;

-- =============================================
-- PART 1: BASE PRODUCT TABLES
-- =============================================

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

-- Product variants (actual purchasable items)
CREATE TABLE IF NOT EXISTS product_variants (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT, -- Stock keeping unit
  price_adjustment DECIMAL(10, 2) DEFAULT 0, -- Price adjustment from base price
  stock_quantity INTEGER DEFAULT 0,
  image_url TEXT, -- Can override the main product image
  is_available BOOLEAN DEFAULT true,
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

-- =============================================
-- PART 2: EXPANDED E-COMMERCE TABLES
-- =============================================

-- Locations table for inventory management
CREATE TABLE IF NOT EXISTS locations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  postal_code TEXT,
  phone TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default location if none exists
INSERT INTO locations (name, address, city, state, country)
SELECT 'Main Warehouse', '123 Main St', 'Los Angeles', 'CA', 'US'
WHERE NOT EXISTS (SELECT 1 FROM locations LIMIT 1);

-- Product Images table
CREATE TABLE IF NOT EXISTS product_images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  variant_id INTEGER REFERENCES product_variants(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_thumbnail BOOLEAN DEFAULT false,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collections for grouping products
CREATE TABLE IF NOT EXISTS collections (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE,
  image_url TEXT,
  published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collection-Product relationship
CREATE TABLE IF NOT EXISTS collection_products (
  id SERIAL PRIMARY KEY,
  collection_id INTEGER REFERENCES collections(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(collection_id, product_id)
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

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  notes TEXT,
  accepts_marketing BOOLEAN DEFAULT false,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer addresses
CREATE TABLE IF NOT EXISTS customer_addresses (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  company TEXT,
  address1 TEXT NOT NULL,
  address2 TEXT,
  city TEXT NOT NULL,
  state TEXT,
  postal_code TEXT,
  country TEXT NOT NULL,
  phone TEXT,
  is_default_shipping BOOLEAN DEFAULT false,
  is_default_billing BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_number TEXT UNIQUE,
  customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  phone TEXT,
  financial_status TEXT DEFAULT 'pending', -- pending, authorized, paid, refunded, etc.
  fulfillment_status TEXT DEFAULT 'unfulfilled', -- unfulfilled, fulfilled, partially_fulfilled
  order_status TEXT DEFAULT 'open', -- open, closed, cancelled
  currency TEXT DEFAULT 'USD',
  shipping_address JSONB,
  billing_address JSONB,
  subtotal_price DECIMAL(10, 2) NOT NULL,
  total_tax DECIMAL(10, 2) DEFAULT 0,
  total_discounts DECIMAL(10, 2) DEFAULT 0,
  total_shipping DECIMAL(10, 2) DEFAULT 0,
  total_price DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Line Items
CREATE TABLE IF NOT EXISTS order_line_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
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

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL, -- authorization, sale, capture, void, refund
  status TEXT NOT NULL, -- success, failure, pending
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  gateway TEXT NOT NULL, -- stripe, paypal, etc.
  gateway_transaction_id TEXT,
  gateway_response JSONB,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Refunds
CREATE TABLE IF NOT EXISTS refunds (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  reason TEXT,
  note TEXT,
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

-- Fulfillments
CREATE TABLE IF NOT EXISTS fulfillments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- pending, success, cancelled, error
  tracking_company TEXT,
  tracking_number TEXT,
  tracking_url TEXT,
  metadata JSONB,
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

-- Discount Codes
CREATE TABLE IF NOT EXISTS discount_codes (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL, -- percentage, fixed_amount, free_shipping
  value DECIMAL(10, 2) NOT NULL, -- percentage or amount
  minimum_order_amount DECIMAL(10, 2) DEFAULT 0,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL, -- for customer-specific discounts
  starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ends_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketing Campaigns
CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  source TEXT, -- email, social, google, etc.
  medium TEXT, -- cpc, banner, email, etc.
  budget DECIMAL(10, 2),
  starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ends_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketing Events
CREATE TABLE IF NOT EXISTS marketing_events (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER REFERENCES marketing_campaigns(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL, -- view, click, add_to_cart, checkout, purchase
  customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
  order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
  revenue_impact DECIMAL(10, 2) DEFAULT 0,
  source TEXT,
  utm_parameters JSONB,
  referrer TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription Plans
CREATE TABLE IF NOT EXISTS subscription_plans (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  billing_interval TEXT NOT NULL, -- day, week, month, year
  billing_interval_count INTEGER DEFAULT 1,
  trial_days INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
  plan_id INTEGER REFERENCES subscription_plans(id) ON DELETE CASCADE,
  status TEXT NOT NULL, -- active, cancelled, paused
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  next_billing_date TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription Items (products in a subscription)
CREATE TABLE IF NOT EXISTS subscription_items (
  id SERIAL PRIMARY KEY,
  subscription_id INTEGER REFERENCES subscriptions(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  variant_id INTEGER REFERENCES product_variants(id) ON DELETE SET NULL,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Billing Attempts
CREATE TABLE IF NOT EXISTS billing_attempts (
  id SERIAL PRIMARY KEY,
  subscription_id INTEGER REFERENCES subscriptions(id) ON DELETE CASCADE,
  status TEXT NOT NULL, -- success, failed
  amount DECIMAL(10, 2) NOT NULL,
  next_retry_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  transaction_id INTEGER REFERENCES transactions(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PART 3: HELPER VIEWS
-- =============================================

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

-- =============================================
-- PART 4: CREATE FUNCTIONS AND TRIGGERS
-- =============================================

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

-- Create a trigger to sync stock_quantity with inventory_levels
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

-- Create a trigger to sync inventory_levels with stock_quantity in product_variants
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

-- =============================================
-- PART 5: CREATE PERFORMANCE INDEXES
-- =============================================

-- Product related indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_variant_id ON product_images(variant_id);

-- Collection related indexes
CREATE INDEX IF NOT EXISTS idx_collections_published ON collections(published);
CREATE INDEX IF NOT EXISTS idx_collection_products_collection_id ON collection_products(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_products_product_id ON collection_products(product_id);

-- Inventory related indexes
CREATE INDEX IF NOT EXISTS idx_inventory_levels_variant_id ON inventory_levels(variant_id);
CREATE INDEX IF NOT EXISTS idx_inventory_levels_location_id ON inventory_levels(location_id);

-- Customer related indexes
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer_id ON customer_addresses(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_is_default_shipping ON customer_addresses(is_default_shipping);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_is_default_billing ON customer_addresses(is_default_billing);

-- Order related indexes
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_financial_status ON orders(financial_status);
CREATE INDEX IF NOT EXISTS idx_orders_fulfillment_status ON orders(fulfillment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_line_items_order_id ON order_line_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_line_items_product_id ON order_line_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_line_items_variant_id ON order_line_items(variant_id);

-- Other indexes for performance
CREATE INDEX IF NOT EXISTS idx_transactions_order_id ON transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_refunds_order_id ON refunds(order_id);
CREATE INDEX IF NOT EXISTS idx_fulfillments_order_id ON fulfillments(order_id);
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_subscriptions_customer_id ON subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Enable RLS on products and variants table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON products FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON products FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON product_variants FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON product_variants FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON product_variants FOR DELETE USING (auth.role() = 'authenticated');

COMMIT; 