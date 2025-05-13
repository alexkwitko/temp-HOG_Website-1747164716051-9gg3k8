#!/bin/bash
# Script to run shop schema migrations on local Supabase

# Ensure the script stops on any errors
set -e

echo "Running shop schema migrations on local Supabase..."

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
echo "Applying shop schema migration..."
npx supabase db reset --db-url postgresql://postgres:postgres@localhost:54322/postgres

echo "Shop schema migration applied successfully!"

# Start the dev server
echo "Starting dev server..."
npm run dev 