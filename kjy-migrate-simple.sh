#!/bin/bash

# Simple script to run migrations on KJY remote database
# This script connects directly to the KJY database using provided credentials

# Check for psql dependency
if ! command -v psql &> /dev/null; then
  echo "Error: psql is not installed. Please install PostgreSQL command-line tools."
  exit 1
fi

# Connection details for KJY database (shared pooler - IPv4 compatible)
DB_HOST="aws-0-us-east-2.pooler.supabase.com"
DB_PORT="5432"
DB_NAME="postgres"
DB_USER="postgres.yxwwmjubpkyzwmvilmsw"
DB_PASSWORD="Mestre@2214"

echo "Using the following connection details:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo "  Password: ********"

# Create a temporary SQL file
SQL_FILE=$(mktemp)

# Write SQL statements to the temporary file
cat > "$SQL_FILE" << EOF
-- Make sure columns exist in site_settings table
ALTER TABLE public.site_settings
ADD COLUMN IF NOT EXISTS social_links_json JSONB,
ADD COLUMN IF NOT EXISTS business_hours_json JSONB,
ADD COLUMN IF NOT EXISTS color_palette_settings_json JSONB;

-- Create the color palette settings row if it doesn't exist
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.site_settings WHERE key = 'color_palette') THEN
    INSERT INTO public.site_settings (
      id,
      key,
      value,
      label,
      type,
      color_palette_settings_json
    ) VALUES (
      'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      'color_palette',
      'default',
      'Color Palette Settings',
      'json',
      '{"globalPaletteId": "monochrome", "useUniformColors": true}'
    );
  ELSE
    -- Update the existing color palette settings
    UPDATE public.site_settings
    SET color_palette_settings_json = COALESCE(color_palette_settings_json, '{"globalPaletteId": "monochrome", "useUniformColors": true}')
    WHERE key = 'color_palette';
  END IF;
  
  -- Create general site settings if needed
  IF NOT EXISTS (SELECT 1 FROM public.site_settings WHERE key = 'site_info') THEN
    INSERT INTO public.site_settings (
      key,
      value, 
      label,
      type,
      site_name,
      site_description,
      contact_email
    ) VALUES (
      'site_info',
      'default',
      'Site Information',
      'json',
      'House of Grappling',
      'Premier BJJ and martial arts training academy',
      'info@houseofgrappling.com'
    );
  END IF;
  
  -- Create social links settings if needed
  IF NOT EXISTS (SELECT 1 FROM public.site_settings WHERE key = 'social_links') THEN
    INSERT INTO public.site_settings (
      key,
      value, 
      label,
      type,
      social_links_json
    ) VALUES (
      'social_links',
      'default',
      'Social Media Links',
      'json',
      '{"facebook": "https://facebook.com/houseofgrappling", "instagram": "https://instagram.com/houseofgrappling", "twitter": "", "youtube": ""}'
    );
  END IF;
  
  -- Create business hours settings if needed
  IF NOT EXISTS (SELECT 1 FROM public.site_settings WHERE key = 'business_hours') THEN
    INSERT INTO public.site_settings (
      key,
      value, 
      label,
      type,
      business_hours_json
    ) VALUES (
      'business_hours',
      'default',
      'Business Hours',
      'json',
      '{"monday": "6:00 AM - 9:00 PM", "tuesday": "6:00 AM - 9:00 PM", "wednesday": "6:00 AM - 9:00 PM", "thursday": "6:00 AM - 9:00 PM", "friday": "6:00 AM - 9:00 PM", "saturday": "8:00 AM - 4:00 PM", "sunday": "Closed"}'
    );
  END IF;
END
\$\$;

-- Add missing columns to programs table
ALTER TABLE public.programs
ADD COLUMN IF NOT EXISTS hero_background_url TEXT,
ADD COLUMN IF NOT EXISTS hero_title TEXT,
ADD COLUMN IF NOT EXISTS hero_subtitle TEXT,
ADD COLUMN IF NOT EXISTS hero_description TEXT;
EOF

# Execute SQL using psql
echo "Running SQL against KJY database..."
export PGPASSWORD="$DB_PASSWORD"
psql -h "$DB_HOST" -p "$DB_PORT" -d "$DB_NAME" -U "$DB_USER" -f "$SQL_FILE"
SQL_RESULT=$?

# Clean up
rm "$SQL_FILE"
unset PGPASSWORD

# Check if SQL execution was successful
if [ $SQL_RESULT -eq 0 ]; then
  echo "✅ All migrations completed successfully!"
else
  echo "❌ Error occurred during SQL execution"
  exit 1
fi 