-- Add is_featured column to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Add category column if it doesn't exist (just to be safe)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS category TEXT; 