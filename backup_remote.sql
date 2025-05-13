-- Backup script for HOG website database
-- Tables to backup:
-- hero_slides, home_page_components, why_choose_cards, featured_programs_config, 
-- featured_products_config, cta_config, site_config, site_settings,
-- programs, products, images, icons_reference

-- hero_slides
DROP TABLE IF EXISTS hero_slides_backup;
CREATE TABLE hero_slides_backup AS SELECT * FROM hero_slides;

-- home_page_components
DROP TABLE IF EXISTS home_page_components_backup;
CREATE TABLE home_page_components_backup AS SELECT * FROM home_page_components;

-- why_choose_cards
DROP TABLE IF EXISTS why_choose_cards_backup;
CREATE TABLE why_choose_cards_backup AS SELECT * FROM why_choose_cards;

-- featured_programs_config
DROP TABLE IF EXISTS featured_programs_config_backup;
CREATE TABLE featured_programs_config_backup AS SELECT * FROM featured_programs_config;

-- featured_products_config
DROP TABLE IF EXISTS featured_products_config_backup;
CREATE TABLE featured_products_config_backup AS SELECT * FROM featured_products_config;

-- cta_config
DROP TABLE IF EXISTS cta_config_backup;
CREATE TABLE cta_config_backup AS SELECT * FROM cta_config;

-- site_config
DROP TABLE IF EXISTS site_config_backup;
CREATE TABLE site_config_backup AS SELECT * FROM site_config;

-- site_settings
DROP TABLE IF EXISTS site_settings_backup;
CREATE TABLE site_settings_backup AS SELECT * FROM site_settings;

-- programs
DROP TABLE IF EXISTS programs_backup;
CREATE TABLE programs_backup AS SELECT * FROM programs;

-- products
DROP TABLE IF EXISTS products_backup;
CREATE TABLE products_backup AS SELECT * FROM products;

-- images
DROP TABLE IF EXISTS images_backup;
CREATE TABLE images_backup AS SELECT * FROM images;

-- icons_reference
DROP TABLE IF EXISTS icons_reference_backup;
CREATE TABLE icons_reference_backup AS SELECT * FROM icons_reference; 