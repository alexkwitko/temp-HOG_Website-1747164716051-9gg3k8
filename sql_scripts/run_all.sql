-- Main SQL script to load all table data
-- Run this script to populate your local database with data from the remote database

-- Import all table scripts in the correct order
\echo 'Importing site_config...'
\i site_config.sql

\echo 'Importing site_settings...'
\i site_settings.sql

\echo 'Importing hero_slides...'
\i hero_slides.sql

\echo 'Importing programs...'
\i programs.sql

\echo 'Importing featured_programs_config...'
\i featured_programs_config.sql

\echo 'Importing home_page_components...'
\i home_page_components.sql

\echo 'Importing why_choose_cards...'
\i why_choose_cards.sql

\echo 'Importing icons_reference...'
\i icons_reference.sql

\echo 'Importing images...'
\i images.sql

\echo 'Importing products...'
\i products.sql

\echo 'Importing featured_products_config...'
\i featured_products_config.sql

\echo 'Data import complete!' 