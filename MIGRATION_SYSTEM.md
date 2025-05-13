# Database Migration System

This system helps you consistently apply database schema changes and fixes to your Supabase database, ensuring all environments (development, production) stay in sync.

## Quick Start

1. Set up environment variables:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_key_here
   ```

2. Run the migrations:
   ```
   npm run migrate
   ```

## Production Migrations

For production environments, we use a dedicated `.env-migration` file with production credentials:

1. Make sure your `.env-migration` file exists in the project root with your production key:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_production_key_here
   ```

2. Run the production migration script:
   ```
   npm run migrate:prod
   ```

This method automatically reads the production key from your `.env-migration` file without needing to manually set environment variables.

## Features

This migration system provides:

1. **Automatic Schema Fixes**:
   - Detects and fixes the `home_page_components` table missing columns
   - Creates and maintains the `methodology` table when needed

2. **SQL File Processing**:
   - Automatically runs any `.sql` files in the `migrations/` directory
   - Executes them in alphabetical order

3. **Error Handling**:
   - Shows clear error messages for each step of the process
   - Logs detailed information about what happened

## How It Works

The migration system works by:

1. First checking for known issues and fixing them automatically
2. Then running any custom SQL migration files you've created
3. Logging detailed information about what happened

## Directory Structure

```
/
├── auto-migrate.js         # Main migration script
├── run-migrate.sh          # Shell script for production migrations
├── .env-migration          # Production environment variables (do not commit)
├── package.json            # Contains the "migrate" npm script
├── ENV_SETUP.md            # Instructions for setting up environment variables
├── migrations/             # Directory for SQL migration files
│   ├── README.md           # Documentation for how to use migrations
│   └── *.sql               # Your SQL migration files
```

## Creating New Migrations

1. Create a new SQL file in the `migrations/` directory
2. Use clear naming like `01_create_table.sql` or `fix_column_types.sql` 
3. Make your migrations idempotent (can be run multiple times safely)
4. Run `npm run migrate` to apply changes

## Essential Tips

1. **Always Test First**: Run migrations in development before production
2. **Keep Migrations Small**: Small, focused migrations are easier to debug
3. **Use Version Control**: Commit migration files to track database changes 
4. **Documentation**: Add comments in SQL files explaining complex changes

## Troubleshooting

If you encounter errors:

1. Check the error message for specific SQL syntax issues
2. Verify that your environment variables are set correctly
3. Ensure your Supabase service key has the right permissions
4. Check if the database state matches what your migration expects

---

For more specific instructions on environment setup, see `ENV_SETUP.md`.
For details on SQL file usage, see `migrations/README.md`. 