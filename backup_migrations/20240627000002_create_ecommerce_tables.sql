-- E-commerce Database Tables for HOG
-- This script creates tables related to e-commerce functionality

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
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
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
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(collection_id, product_id)
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