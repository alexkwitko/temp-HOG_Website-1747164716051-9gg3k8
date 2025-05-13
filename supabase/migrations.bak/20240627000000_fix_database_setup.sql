-- Fix database setup to use proper tables

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

-- Create product_variants table
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

-- Create attribute_types table
CREATE TABLE IF NOT EXISTS attribute_types (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

-- Create attribute_values table
CREATE TABLE IF NOT EXISTS attribute_values (
  id SERIAL PRIMARY KEY,
  attribute_type_id INTEGER REFERENCES attribute_types(id),
  value TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  UNIQUE (attribute_type_id, value)
);

-- Create product_variant_attributes table
CREATE TABLE IF NOT EXISTS product_variant_attributes (
  id SERIAL PRIMARY KEY,
  product_variant_id INTEGER REFERENCES product_variants(id) ON DELETE CASCADE,
  attribute_value_id INTEGER REFERENCES attribute_values(id),
  UNIQUE(product_variant_id, attribute_value_id)
);

-- Insert common attribute types
INSERT INTO attribute_types (name, description)
VALUES 
  ('size', 'Product size variations'),
  ('color', 'Product color variations')
ON CONFLICT (name) DO NOTHING;

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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  collection_type TEXT DEFAULT 'manual',
  handle TEXT,
  sort_order TEXT DEFAULT 'alpha-asc'
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

-- Create profile table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT,
  full_name TEXT
);

-- Insert admin and customer users in profiles table
INSERT INTO profiles (id, email, role, full_name)
VALUES 
  ('e4c26ba5-d58c-4b0c-9ba3-c1b0aeec6bd2', 'admin@hogbjj.com', 'admin', 'Admin User'),
  ('f7c38ba5-d92c-4b7c-8ba3-c1b0aeec7cd3', 'customer@hogbjj.com', 'customer', 'Test Customer')
ON CONFLICT (id) DO NOTHING; 