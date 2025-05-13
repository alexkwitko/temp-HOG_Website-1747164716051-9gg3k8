#!/bin/bash

# Script to run migrations on KJY remote database
# You can customize the environment variables directly in this file
# or create a .env file with these variables

# Default KJY Supabase URL
export KJY_SUPABASE_URL=https://yxwwmjubpkyzwmvilmsw.supabase.co

# Add your KJY Supabase keys below
# Uncomment and add your keys
# export KJY_SUPABASE_KEY=your_anon_key_here
# export KJY_SUPABASE_SERVICE_KEY=your_service_role_key_here

# Run the migration script
node scripts/run-migrations.js 