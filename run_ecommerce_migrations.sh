#!/bin/bash
# Script to run e-commerce migrations on local Supabase

# Ensure the script stops on any errors
set -e

echo "Running e-commerce migrations on local Supabase..."

# Kill any existing dev server
killall node 2>/dev/null || true

# Check if Supabase is running
echo "Checking if Supabase is running locally..."
curl -s http://localhost:54323/health > /dev/null
if [ $? -ne 0 ]; then
  echo "Starting local Supabase..."
  npx supabase start
else
  echo "Supabase is already running."
fi

# Apply the migrations
echo "Applying e-commerce tables migration..."
npx supabase migration up --db-url postgresql://postgres:postgres@localhost:54322/postgres --include-all

# Link the migration to avoid it running again
echo "Linking migrations with Supabase..."
npx supabase migration repair --status applied 20240510000000
npx supabase migration repair --status applied 20240510000001

echo "E-commerce migrations applied successfully!"

# Restart the dev server
echo "Starting dev server..."
npm run dev 