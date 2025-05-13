# Program Categories Setup

This guide will help you set up the program categories table in your Supabase database to support the Programs page functionality.

## Database Setup Instructions

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left menu
3. Create a new query
4. Copy and paste the contents of the `program_categories_setup.sql` file
5. Click "Run" to execute the SQL script

This script will:
- Create a new `program_categories` table
- Add some default categories
- Ensure the `programs` table has a `category_id` column that references the categories
- Set up Row Level Security (RLS) policies

## Updating Existing Data

If you already have programs in your database, you may want to update them to assign them to the new categories:

```sql
-- Example: Update existing programs to assign them to categories
UPDATE public.programs
SET category_id = (SELECT id FROM public.program_categories WHERE name = 'Fundamentals')
WHERE category_id IS NULL AND title LIKE '%fundamental%';

UPDATE public.programs
SET category_id = (SELECT id FROM public.program_categories WHERE name = 'Advanced')
WHERE category_id IS NULL AND title LIKE '%advanced%';
```

## Troubleshooting

If you encounter the error "relation does not exist" for the `program_categories` table, it means the table has not been created yet. Make sure to run the SQL script.

If you have issues with permissions, ensure your Supabase service role has the necessary permissions, or run the script using the SQL editor in the Supabase dashboard.

## Migrating from Class Categories

If you were previously using a `class_categories` table, you might want to migrate the data:

```sql
-- Only run this if you have an existing class_categories table
INSERT INTO public.program_categories (name, description, color, icon)
SELECT name, description, color, icon
FROM public.class_categories
ON CONFLICT (name) DO NOTHING;

-- Update program category_id references
UPDATE public.programs p
SET category_id = pc.id
FROM public.program_categories pc
JOIN public.class_categories cc ON cc.name = pc.name
WHERE p.category_id = cc.id;
``` 