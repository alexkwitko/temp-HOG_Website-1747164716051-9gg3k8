#!/bin/bash

# Direct script to run migrations on KJY remote database
# This script uses direct SQL execution to add columns without migration tracking

# Check for psql dependency
if ! command -v psql &> /dev/null; then
  echo "Error: psql is not installed. Please install PostgreSQL command-line tools."
  exit 1
fi

# Check for supabase CLI dependency
if ! command -v supabase &> /dev/null; then
  echo "Error: supabase CLI is not installed. Please install it with:"
  echo "brew install supabase/tap/supabase"
  exit 1
fi

# Set KJY project reference
KJY_PROJECT_REF=yxwwmjubpkyzwmvilmsw

# Login to Supabase (if not already logged in)
echo "Authenticating with Supabase..."
if ! supabase projects list &> /dev/null; then
  echo "Please login to Supabase:"
  supabase login
fi

# Link to the KJY project
echo "Linking to KJY project..."
supabase link --project-ref $KJY_PROJECT_REF

# Get database connection info
echo "Getting database connection info..."
DB_URL=$(supabase db dump --dry-run | grep -o "postgresql://.*" | head -1 | tr -d '"')

if [ -z "$DB_URL" ]; then
  echo "Error: Could not get database connection URL"
  exit 1
fi

echo "Executing SQL to add missing columns..."

# Create a temporary SQL file
SQL_FILE=$(mktemp)

# Write SQL statements to the temporary file
cat > "$SQL_FILE" << EOF
-- Add missing columns to site_settings table
ALTER TABLE public.site_settings
ADD COLUMN IF NOT EXISTS social_links_json JSONB,
ADD COLUMN IF NOT EXISTS business_hours_json JSONB,
ADD COLUMN IF NOT EXISTS color_palette_settings_json JSONB;

-- Add missing columns to programs table
ALTER TABLE public.programs
ADD COLUMN IF NOT EXISTS hero_background_url TEXT,
ADD COLUMN IF NOT EXISTS hero_title TEXT,
ADD COLUMN IF NOT EXISTS hero_subtitle TEXT,
ADD COLUMN IF NOT EXISTS hero_description TEXT;
EOF

# Execute SQL using psql
PGPASSWORD=$(echo $DB_URL | grep -o ":[^:]*@" | sed 's/://g' | sed 's/@//g')
DB_HOST=$(echo $DB_URL | grep -o "@[^:]*:" | sed 's/@//g' | sed 's/://g')
DB_PORT=$(echo $DB_URL | grep -o ":[0-9]*/" | sed 's/://g' | sed 's/\///g')
DB_NAME=$(echo $DB_URL | grep -o "/[^?]*" | sed 's/\///g')
DB_USER=$(echo $DB_URL | grep -o "//[^:]*:" | sed 's/\/\///g' | sed 's/://g')

echo "Running SQL against KJY database..."
echo "Connection details:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"

export PGPASSWORD
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