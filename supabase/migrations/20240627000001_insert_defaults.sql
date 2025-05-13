-- Insert default featured programs config
INSERT INTO featured_programs_config (id, heading, subheading, featured_program_ids)
VALUES (
  1,
  'Featured Programs',
  'From beginner-friendly fundamentals to advanced training, find the perfect program for your journey.',
  '{}'
) ON CONFLICT (id) DO NOTHING;

-- Insert default featured products config
INSERT INTO featured_products_config (id, heading, subheading, featured_product_ids)
VALUES (
  1,
  'Featured Products',
  'Shop our selection of high-quality products',
  '{}'
) ON CONFLICT (id) DO NOTHING;

-- Insert default CTA config
INSERT INTO cta_config (id, heading, subheading, button_text, button_url)
VALUES (
  1,
  'Ready to start your journey?',
  'Join our community and experience the benefits of training with us.',
  'Get Started',
  '/contact'
) ON CONFLICT (id) DO NOTHING;

-- Insert default site settings
INSERT INTO site_settings (key, value, description, type)
VALUES 
  ('site_name', 'House of Grappling', 'Site name displayed in the title and header', 'text'),
  ('contact_email', 'info@houseofgrappling.com', 'Primary contact email address', 'text'),
  ('contact_phone', '(555) 123-4567', 'Primary contact phone number', 'text'),
  ('primary_color', '#111827', 'Primary brand color', 'text'),
  ('secondary_color', '#4F46E5', 'Secondary brand color', 'text'),
  ('social_media', NULL, 'Social media links', 'json'),
  ('store_enabled', 'true', 'Whether the e-commerce store is enabled', 'boolean'),
  ('logo_url', '/images/logo.png', 'URL to the site logo', 'text'),
  ('favicon_url', '/images/favicon.ico', 'URL to the site favicon', 'text'),
  ('meta_description', 'House of Grappling - Premier BJJ and grappling training center', 'Default meta description for SEO', 'text')
ON CONFLICT (key) DO NOTHING; 