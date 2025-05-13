-- Enable Row Level Security and set appropriate policies for all tables
DO $$
DECLARE
    tables text[] := ARRAY[
        'about_sections', 'attribute_types', 'attribute_values', 'blog_posts', 'categories',
        'collection_products', 'collections', 'contact_settings', 'cta_config', 'customers',
        'featured_products_config', 'featured_programs_config', 'features', 'hero_config',
        'hero_slides', 'home_components', 'home_page_components', 'home_page_config',
        'home_sections', 'icons_reference', 'image_dimensions', 'image_sizes', 'images',
        'instructors', 'insurance_providers', 'location_section', 'menu_items', 'methodology',
        'page_stats', 'product_images', 'product_variant_attributes', 'product_variants',
        'products', 'profiles', 'programs', 'schedule_classes', 'section_image_sizes',
        'settings', 'settings_categories', 'settings_sections', 'site_config', 'site_content',
        'site_images', 'site_settings', 'special_schedule_classes', 'special_schedules',
        'why_choose_cards'
    ];
    t text;
BEGIN
    FOREACH t IN ARRAY tables LOOP
        BEGIN
            -- Enable RLS on the table
            EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
            
            -- Create policy for public read access
            BEGIN
                EXECUTE format('DROP POLICY IF EXISTS "Allow public read access" ON public.%I;', t);
                EXECUTE format('CREATE POLICY "Allow public read access" ON public.%I FOR SELECT USING (true);', t);
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Error creating read policy for %: %', t, SQLERRM;
            END;
            
            -- Create policy for authenticated users to manage all data
            BEGIN
                EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated users to manage" ON public.%I;', t);
                EXECUTE format('CREATE POLICY "Allow authenticated users to manage" ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true);', t);
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Error creating write policy for %: %', t, SQLERRM;
            END;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Error processing table %: %', t, SQLERRM;
        END;
    END LOOP;
END $$; 