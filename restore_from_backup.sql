-- Restore script for HOG website database
-- Restores data from backup tables to main tables

-- Clear existing data from all tables
TRUNCATE TABLE hero_slides;
TRUNCATE TABLE home_page_components;
TRUNCATE TABLE why_choose_cards;
TRUNCATE TABLE featured_programs_config;
TRUNCATE TABLE featured_products_config;
TRUNCATE TABLE cta_config;
TRUNCATE TABLE site_config;
TRUNCATE TABLE site_settings;
TRUNCATE TABLE programs;
TRUNCATE TABLE products;
TRUNCATE TABLE images;
TRUNCATE TABLE icons_reference;

-- Restore data from backup tables
INSERT INTO hero_slides SELECT * FROM hero_slides_backup;
INSERT INTO home_page_components SELECT * FROM home_page_components_backup;
INSERT INTO why_choose_cards SELECT * FROM why_choose_cards_backup;
INSERT INTO featured_programs_config SELECT * FROM featured_programs_config_backup;
INSERT INTO featured_products_config SELECT * FROM featured_products_config_backup;
INSERT INTO cta_config SELECT * FROM cta_config_backup;
INSERT INTO site_config SELECT * FROM site_config_backup;
INSERT INTO site_settings SELECT * FROM site_settings_backup;
INSERT INTO programs SELECT * FROM programs_backup;
INSERT INTO products SELECT * FROM products_backup;
INSERT INTO images SELECT * FROM images_backup;
INSERT INTO icons_reference SELECT * FROM icons_reference_backup;

-- Report success
DO $$
BEGIN
  RAISE NOTICE 'Database restore completed successfully!';
END $$; 