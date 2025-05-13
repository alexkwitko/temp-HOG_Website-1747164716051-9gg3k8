#!/bin/bash

# This script runs database migrations using the environment variables from .env-migration file

# Check if .env-migration exists
if [ ! -f .env-migration ]; then
  echo "Error: .env-migration file not found"
  exit 1
fi

# Export environment variables from .env-migration
echo "Loading environment variables from .env-migration..."
export $(grep -v '^#' .env-migration | xargs)

# Verify the key is loaded
if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "Error: SUPABASE_SERVICE_ROLE_KEY not found in .env-migration"
  exit 1
fi

echo "Running migrations..."
node auto-migrate.js

# Unset the environment variables when done
unset SUPABASE_SERVICE_ROLE_KEY
echo "Done!" 