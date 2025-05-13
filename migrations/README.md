# Database Migrations System

This directory contains SQL migration files that are automatically applied to the database when you run the migration script.

## How to Use

1. **Add SQL Migration Files:**
   - Place your SQL migration files in this directory with a `.sql` extension
   - Each file should be self-contained and idempotent (safe to run multiple times)
   - Use clear names like `01_create_users_table.sql` or `fix_missing_columns.sql`

2. **Run the Migration:**
   ```
   npm run migrate
   ```

3. **Environment Variables:**
   You must have the following environment variables set:
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
   - `SUPABASE_URL` (optional) - Your Supabase URL (defaults to project URL)

## Best Practices

1. Make migrations idempotent by using:
   - `CREATE TABLE IF NOT EXISTS`
   - `ALTER TABLE IF EXISTS`
   - `ADD COLUMN IF NOT EXISTS`
   - `DROP POLICY IF EXISTS` before creating policies
   
2. Use `ON CONFLICT` clauses for default data inserts to avoid duplicates

3. Document your migrations with comments explaining what they do

## Automatic Fixes

The migration system automatically checks and fixes:

1. Missing columns in `home_page_components` table
2. Missing or incorrect `methodology` table setup

You can add more automated checks by modifying the `auto-migrate.js` file. 