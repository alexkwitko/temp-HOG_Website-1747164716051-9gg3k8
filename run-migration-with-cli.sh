#!/bin/bash

# Exit on error
set -e

echo "Running methodology migration..."

# Execute SQL commands through Supabase CLI
echo "Executing DROP TABLE statement..."
supabase db remote execute --execute="DROP TABLE IF EXISTS public.methodology;"

echo "Executing CREATE TABLE statement..."
supabase db remote execute --execute="
CREATE TABLE IF NOT EXISTS public.methodology (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  \"order\" INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);"

echo "Enabling Row Level Security..."
supabase db remote execute --execute="ALTER TABLE public.methodology ENABLE ROW LEVEL SECURITY;"

echo "Dropping existing policies..."
supabase db remote execute --execute="
DROP POLICY IF EXISTS \"Allow public read access for methodology\" ON public.methodology;
DROP POLICY IF EXISTS \"Allow authenticated users to update methodology\" ON public.methodology;
DROP POLICY IF EXISTS \"Allow authenticated users to insert methodology\" ON public.methodology;
DROP POLICY IF EXISTS \"Allow authenticated users to delete methodology\" ON public.methodology;"

echo "Creating policies..."
supabase db remote execute --execute="
CREATE POLICY \"Allow public read access for methodology\" 
ON public.methodology FOR SELECT 
USING (true);"

supabase db remote execute --execute="
CREATE POLICY \"Allow authenticated users to update methodology\" 
ON public.methodology FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');"

supabase db remote execute --execute="
CREATE POLICY \"Allow authenticated users to insert methodology\" 
ON public.methodology FOR INSERT
WITH CHECK (auth.role() = 'authenticated');"

supabase db remote execute --execute="
CREATE POLICY \"Allow authenticated users to delete methodology\" 
ON public.methodology FOR DELETE
USING (auth.role() = 'authenticated');"

echo "Creating updated_at trigger..."
supabase db remote execute --execute="
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS \$\$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
\$\$ LANGUAGE plpgsql;"

supabase db remote execute --execute="
DROP TRIGGER IF EXISTS set_methodology_updated_at ON public.methodology;"

supabase db remote execute --execute="
CREATE TRIGGER set_methodology_updated_at
BEFORE UPDATE ON public.methodology
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();"

echo "Inserting default methods..."
supabase db remote execute --execute="
INSERT INTO public.methodology (id, title, description, icon_name, \"order\", is_active)
VALUES 
  ('fundamental', 'Fundamentals First', 'Master the core techniques and principles that form the foundation of effective BJJ.', 'Shield', 1, true),
  ('progressive', 'Progressive Learning', 'Structured curriculum that builds complexity as you advance in your journey.', 'Target', 2, true),
  ('conceptual', 'Conceptual Understanding', 'Focus on the underlying principles that connect techniques and positions.', 'Brain', 3, true),
  ('practical', 'Practical Application', 'Regular drilling and sparring to develop real-world effectiveness.', 'Dumbbell', 4, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  icon_name = EXCLUDED.icon_name,
  \"order\" = EXCLUDED.\"order\",
  is_active = EXCLUDED.is_active;"

echo "Migration completed successfully!" 