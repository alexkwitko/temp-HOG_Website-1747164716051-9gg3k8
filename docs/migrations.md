# Database Migrations

This document explains how to run database migrations for the House of Grappling (HOG) website.

## Local Development Migrations

To run migrations on your local development database:

```bash
npm run migrate
```

This will execute `auto-migrate.js` which runs all required migrations against your local database.

## Production Migrations

To run migrations on the production database:

```bash
npm run migrate:prod
```

This uses the `run-migrate.sh` script which properly sets environment variables before running migrations.

## KJY Remote Database Migrations

### Method 1: Using Supabase CLI (Recommended)

This is the direct approach using the Supabase CLI which will authenticate through your CLI login and execute SQL directly:

```bash
npm run migrate:kjy:cli
```

This method:
1. Uses the Supabase CLI's built-in authentication
2. Connects directly to the KJY remote database
3. Executes the SQL statements to add required columns
4. No environment variables or passwords needed

If you're not logged in to Supabase CLI, it will prompt you to login with your Supabase account.

### Method 2: Using Node.js Script

Alternatively, you can use the Node.js script approach:

```bash
npm run migrate:kjy
```

This command uses the `run-kjy-migrate.sh` script. Before using it, you'll need to:

1. Edit the `run-kjy-migrate.sh` script to include your KJY Supabase keys:
   ```bash
   # Uncomment and add your keys
   export KJY_SUPABASE_KEY=your_anon_key_here
   export KJY_SUPABASE_SERVICE_KEY=your_service_role_key_here
   ```

2. Alternatively, you can create a `.env` file in the project root with these variables:
   ```
   KJY_SUPABASE_URL=https://yxwwmjubpkyzwmvilmsw.supabase.co
   KJY_SUPABASE_KEY=your_anon_key_here
   KJY_SUPABASE_SERVICE_KEY=your_service_role_key_here
   ```

### What the KJY Migration Scripts Do

Both migration scripts automatically:

1. Check if the required columns exist in the `site_settings` table
2. Add any missing columns like `social_links_json`, `business_hours_json`, and `color_palette_settings_json`
3. Check if the required columns exist in the `programs` table
4. Add any missing columns like `hero_background_url`, `hero_title`, `hero_subtitle`, and `hero_description`

These migrations ensure that your database schema stays up-to-date with the latest code changes.

### Note on Service Role Key

For full migration functionality, the `KJY_SUPABASE_SERVICE_KEY` is required. This key allows the script to execute SQL directly. If only the anon key is provided, the script will check for missing columns but will only output the SQL statements that need to be run manually. 