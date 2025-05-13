-- Fix permissions for site_settings table
-- Run this in Supabase SQL Editor

-- 1. First, update your admin user to have proper metadata
-- Replace YOUR_ADMIN_EMAIL with your actual admin email
UPDATE auth.users
SET 
  raw_app_meta_data = jsonb_set(
    COALESCE(raw_app_meta_data, '{}'::jsonb),
    '{role}',
    '"admin"'
  ),
  raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{isAdmin}',
    'true'
  )
WHERE 
  email = 'YOUR_ADMIN_EMAIL' -- REPLACE THIS WITH YOUR ACTUAL ADMIN EMAIL
  OR raw_app_meta_data->>'role' = 'admin' 
  OR raw_user_meta_data->>'isAdmin' = 'true';

-- 2. Temporarily disable RLS
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies
DROP POLICY IF EXISTS "Admins can read and write site_settings" ON site_settings;
DROP POLICY IF EXISTS "All users can read site_settings" ON site_settings;
DROP POLICY IF EXISTS "Anonymous users can read site_settings" ON site_settings;
DROP POLICY IF EXISTS "Everyone can read site_settings" ON site_settings;

-- 4. Create simpler policies
CREATE POLICY "Admins can read and write site_settings" 
ON site_settings 
FOR ALL 
TO authenticated 
USING (
  (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
) 
WITH CHECK (
  (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Everyone can read site_settings" 
ON site_settings 
FOR SELECT 
TO authenticated, anon
USING (true);

-- 5. Re-enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 6. Output the current admin users for verification
SELECT id, email, raw_app_meta_data, raw_user_meta_data
FROM auth.users
WHERE raw_app_meta_data->>'role' = 'admin' OR raw_user_meta_data->>'isAdmin' = 'true'; 