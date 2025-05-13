-- Import data from the remote Supabase database to the local database
-- Created for the House of Grappling website

-- Create foreign data wrapper extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS postgres_fdw;

-- Create server connection to remote Supabase
DROP SERVER IF EXISTS remote_supabase CASCADE;
CREATE SERVER remote_supabase
  FOREIGN DATA WRAPPER postgres_fdw
  OPTIONS (host 'db.yxwwmjubpkyzwmvilmsw.supabase.co', port '5432', dbname 'postgres');

-- Create user mapping for authentication
CREATE USER MAPPING IF NOT EXISTS FOR CURRENT_USER
  SERVER remote_supabase
  OPTIONS (user 'postgres', password 'postgres');

-- Create foreign schema
DROP SCHEMA IF EXISTS remote_public CASCADE;
CREATE SCHEMA remote_public;

-- Import remote tables into foreign schema
IMPORT FOREIGN SCHEMA public 
  FROM SERVER remote_supabase 
  INTO remote_public;

-- Import hero_slides
DELETE FROM hero_slides;
INSERT INTO hero_slides
  SELECT * FROM remote_public.hero_slides;
SELECT 'Imported ' || COUNT(*) || ' hero_slides' FROM hero_slides;

-- Import home_page_components
DELETE FROM home_page_components;
INSERT INTO home_page_components
  SELECT * FROM remote_public.home_page_components;
SELECT 'Imported ' || COUNT(*) || ' home_page_components' FROM home_page_components;

-- Import why_choose_cards
DELETE FROM why_choose_cards;
INSERT INTO why_choose_cards
  SELECT * FROM remote_public.why_choose_cards;
SELECT 'Imported ' || COUNT(*) || ' why_choose_cards' FROM why_choose_cards;

-- Import featured_programs_config
DELETE FROM featured_programs_config;
INSERT INTO featured_programs_config
  SELECT * FROM remote_public.featured_programs_config;
SELECT 'Imported ' || COUNT(*) || ' featured_programs_config' FROM featured_programs_config;

-- Import programs (formerly classes)
DELETE FROM programs;
INSERT INTO programs
  SELECT * FROM remote_public.programs;
SELECT 'Imported ' || COUNT(*) || ' programs' FROM programs;

-- Import site_config
DELETE FROM site_config;
INSERT INTO site_config
  SELECT * FROM remote_public.site_config;
SELECT 'Imported ' || COUNT(*) || ' site_config' FROM site_config;

-- Import site_settings
DELETE FROM site_settings;
INSERT INTO site_settings
  SELECT * FROM remote_public.site_settings;
SELECT 'Imported ' || COUNT(*) || ' site_settings' FROM site_settings;

-- Import cta_config if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'remote_public' AND table_name = 'cta_config'
  ) THEN
    DELETE FROM cta_config;
    EXECUTE 'INSERT INTO cta_config SELECT * FROM remote_public.cta_config';
    RAISE NOTICE 'Imported CTA config';
  ELSE
    RAISE NOTICE 'Remote cta_config table does not exist, skipping';
  END IF;
END $$;

-- Import icons_reference if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'remote_public' AND table_name = 'icons_reference'
  ) THEN
    DELETE FROM icons_reference;
    EXECUTE 'INSERT INTO icons_reference SELECT * FROM remote_public.icons_reference';
    RAISE NOTICE 'Imported icons reference';
  ELSE
    RAISE NOTICE 'Remote icons_reference table does not exist, skipping';
  END IF;
END $$;

-- Import featured_products_config if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'remote_public' AND table_name = 'featured_products_config'
  ) THEN
    DELETE FROM featured_products_config;
    EXECUTE 'INSERT INTO featured_products_config SELECT * FROM remote_public.featured_products_config';
    RAISE NOTICE 'Imported featured products config';
  ELSE
    RAISE NOTICE 'Remote featured_products_config table does not exist, skipping';
  END IF;
END $$;

-- Import products if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'remote_public' AND table_name = 'products'
  ) THEN
    DELETE FROM products;
    EXECUTE 'INSERT INTO products SELECT * FROM remote_public.products';
    RAISE NOTICE 'Imported products';
  ELSE
    RAISE NOTICE 'Remote products table does not exist, skipping';
  END IF;
END $$;

-- Clean up (optionally remove these lines if you want to keep the foreign connection)
DROP USER MAPPING IF EXISTS FOR CURRENT_USER SERVER remote_supabase;
DROP SERVER IF EXISTS remote_supabase CASCADE;
DROP SCHEMA IF EXISTS remote_public CASCADE;

-- Final message
DO $$
BEGIN
  RAISE NOTICE 'Database import completed!';
END $$; 