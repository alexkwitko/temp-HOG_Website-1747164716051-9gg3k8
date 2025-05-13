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

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  auth_id UUID,
  notes TEXT,
  marketing_opt_in BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer_addresses table
CREATE TABLE IF NOT EXISTS customer_addresses (
  id SERIAL PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  address_type TEXT NOT NULL, -- 'billing' or 'shipping'
  is_default BOOLEAN DEFAULT false,
  first_name TEXT,
  last_name TEXT,
  company TEXT,
  address1 TEXT NOT NULL,
  address2 TEXT,
  city TEXT NOT NULL,
  state TEXT,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),
  email TEXT NOT NULL,
  phone TEXT,
  total_price DECIMAL(10, 2) NOT NULL,
  subtotal_price DECIMAL(10, 2) NOT NULL,
  total_tax DECIMAL(10, 2) DEFAULT 0,
  total_discounts DECIMAL(10, 2) DEFAULT 0,
  total_shipping DECIMAL(10, 2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  financial_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'refunded', 'partially_refunded'
  fulfillment_status TEXT DEFAULT 'unfulfilled', -- 'unfulfilled', 'partially_fulfilled', 'fulfilled'
  billing_address JSONB,
  shipping_address JSONB,
  note TEXT,
  shipping_method TEXT,
  discount_codes TEXT[],
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancel_reason TEXT
);

-- Create order_line_items table
CREATE TABLE IF NOT EXISTS order_line_items (
  id SERIAL PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_variant_id INTEGER REFERENCES product_variants(id),
  title TEXT NOT NULL,
  variant_title TEXT,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  sku TEXT,
  properties JSONB DEFAULT '{}',
  requires_shipping BOOLEAN DEFAULT true,
  taxable BOOLEAN DEFAULT true,
  tax_rate DECIMAL(10, 4) DEFAULT 0,
  fulfillment_status TEXT DEFAULT 'unfulfilled', -- 'unfulfilled', 'fulfilled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL, -- 'charge', 'refund', 'capture', 'void'
  payment_method TEXT, -- 'credit_card', 'paypal', 'stripe', etc.
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL, -- 'success', 'failure', 'pending'
  gateway_transaction_id TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create refunds table
CREATE TABLE IF NOT EXISTS refunds (
  id SERIAL PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  transaction_id INTEGER REFERENCES transactions(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  reason TEXT,
  note TEXT,
  refund_line_items JSONB,
  status TEXT DEFAULT 'pending', -- 'pending', 'processed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fulfillments table
CREATE TABLE IF NOT EXISTS fulfillments (
  id SERIAL PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL, -- 'success', 'failure', 'pending', 'cancelled'
  tracking_company TEXT,
  tracking_number TEXT,
  tracking_url TEXT,
  line_items JSONB,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create discount_codes table
CREATE TABLE IF NOT EXISTS discount_codes (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  title TEXT,
  discount_type TEXT NOT NULL, -- 'percentage', 'fixed_amount', 'shipping'
  amount DECIMAL(10, 2) NOT NULL,
  minimum_order_amount DECIMAL(10, 2) DEFAULT 0,
  starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ends_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  times_used INTEGER DEFAULT 0,
  usage_limit INTEGER,
  applies_to JSONB, -- Can specify product IDs, collection IDs, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create marketing_campaigns table
CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft', -- 'draft', 'active', 'completed', 'cancelled'
  campaign_type TEXT NOT NULL, -- 'email', 'sms', 'social'
  target_segment TEXT, -- 'all', 'previous_customers', 'newsletter_subscribers'
  content TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create marketing_events table
CREATE TABLE IF NOT EXISTS marketing_events (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER REFERENCES marketing_campaigns(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL, -- 'open', 'click', 'conversion', 'unsubscribe'
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  billing_interval TEXT NOT NULL, -- 'monthly', 'yearly'
  trial_days INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  features JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  plan_id INTEGER REFERENCES subscription_plans(id) ON DELETE RESTRICT,
  status TEXT NOT NULL, -- 'active', 'cancelled', 'paused', 'past_due'
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  payment_method_id TEXT,
  gateway_subscription_id TEXT,
  gateway TEXT, -- 'stripe', 'paypal', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create billing_attempts table
CREATE TABLE IF NOT EXISTS billing_attempts (
  id SERIAL PRIMARY KEY,
  subscription_id INTEGER REFERENCES subscriptions(id) ON DELETE CASCADE,
  transaction_id INTEGER REFERENCES transactions(id) ON DELETE SET NULL,
  status TEXT NOT NULL, -- 'success', 'failure', 'pending'
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  error_message TEXT,
  next_retry_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'USA',
  phone TEXT,
  email TEXT,
  hours JSONB,
  coordinates POINT,
  is_active BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

-- Create schedule_programs table (formerly schedule_classes)
CREATE TABLE IF NOT EXISTS schedule_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day TEXT NOT NULL,
  title TEXT NOT NULL,
  category_id UUID REFERENCES class_categories(id),
  instructor TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  is_closed BOOLEAN DEFAULT false
);

-- Create special_schedules table
CREATE TABLE IF NOT EXISTS special_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create special_schedule_programs table (formerly special_schedule_classes)
CREATE TABLE IF NOT EXISTS special_schedule_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  special_schedule_id UUID REFERENCES special_schedules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  instructor TEXT,
  category_id UUID REFERENCES class_categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

-- Create featured_products_config table
CREATE TABLE IF NOT EXISTS featured_products_config (
  id SERIAL PRIMARY KEY,
  heading TEXT NOT NULL DEFAULT 'Featured Products',
  subheading TEXT NOT NULL DEFAULT 'Shop our selection of high-quality products',
  featured_product_ids TEXT[] NOT NULL DEFAULT '{}',
  background_color TEXT DEFAULT '#ffffff',
  text_color TEXT DEFAULT '#000000',
  button_text TEXT DEFAULT 'Shop Now',
  button_color TEXT DEFAULT '#000000',
  button_text_color TEXT DEFAULT '#ffffff',
  display_type TEXT DEFAULT 'grid',
  items_per_row INTEGER DEFAULT 3,
  show_price BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  section_padding TEXT DEFAULT 'py-12',
  container_width TEXT DEFAULT 'max-w-7xl',
  product_details JSONB DEFAULT '[]'::jsonb
);

-- Create methodology_table
CREATE TABLE IF NOT EXISTS methodology (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  image_url TEXT,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cta_config table
CREATE TABLE IF NOT EXISTS cta_config (
  id SERIAL PRIMARY KEY,
  heading TEXT NOT NULL DEFAULT 'Ready to start your journey?',
  subheading TEXT NOT NULL DEFAULT 'Join our community and experience the benefits of training with us.',
  background_type TEXT DEFAULT 'color', -- color, image, gradient
  background_color TEXT DEFAULT '#111827',
  background_image TEXT,
  overlay_opacity FLOAT DEFAULT 0.5,
  text_color TEXT DEFAULT '#ffffff',
  button_text TEXT DEFAULT 'Get Started',
  button_url TEXT DEFAULT '/contact',
  button_color TEXT DEFAULT '#ffffff',
  button_text_color TEXT DEFAULT '#111827',
  alignment TEXT DEFAULT 'center', -- left, center, right
  padding TEXT DEFAULT 'py-16',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create home_page_components table
CREATE TABLE IF NOT EXISTS home_page_components (
  id SERIAL PRIMARY KEY,
  component_type TEXT NOT NULL, -- hero, featured_programs, featured_products, testimonials, cta, etc.
  config JSONB,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create home_components table
CREATE TABLE IF NOT EXISTS home_components (
  id SERIAL PRIMARY KEY,
  component_type TEXT NOT NULL,
  title TEXT,
  description TEXT,
  config JSONB,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  value_json JSONB,
  value_array TEXT[],
  description TEXT,
  type TEXT NOT NULL DEFAULT 'text', -- text, number, boolean, json, array
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create instructors table
CREATE TABLE IF NOT EXISTS instructors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  image_id UUID,
  image_url TEXT,
  social_media JSONB,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  image_id UUID,
  image_url TEXT,
  author TEXT,
  status TEXT DEFAULT 'draft', -- draft, published
  tags TEXT[],
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
CREATE INDEX IF NOT EXISTS orders_customer_id_idx ON orders(customer_id);
CREATE INDEX IF NOT EXISTS orders_order_number_idx ON orders(order_number);
CREATE INDEX IF NOT EXISTS order_line_items_order_id_idx ON order_line_items(order_id);
CREATE INDEX IF NOT EXISTS blog_posts_published_at_idx ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts(slug);

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
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE fulfillments ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_schedule_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_programs_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_products_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE methodology ENABLE ROW LEVEL SECURITY;
ALTER TABLE cta_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_page_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage products" ON products USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to product_variants" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage product_variants" ON product_variants USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to class_categories" ON class_categories FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage class_categories" ON class_categories USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to programs" ON programs FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage programs" ON programs USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated'); 