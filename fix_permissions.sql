-- Comprehensive fix for permissions issues with site_settings table
-- This script addresses the "permission denied for table users" error
-- Run this directly in Supabase SQL editor

-- 1. Update admin users to ensure consistent role format
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
  email = 'admin@hogbjj.com' 
  OR raw_app_meta_data->>'role' = 'admin' 
  OR raw_user_meta_data->>'isAdmin' = 'true';

-- 2. Disable RLS temporarily to allow direct update
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;

-- 3. Update the RLS policies for site_settings
DROP POLICY IF EXISTS "Admins can read and write site_settings" ON site_settings;
DROP POLICY IF EXISTS "All users can read site_settings" ON site_settings;
DROP POLICY IF EXISTS "Anonymous users can read site_settings" ON site_settings;

-- 4. Create proper policies
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

CREATE POLICY "All users can read site_settings" 
ON site_settings 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Anonymous users can read site_settings" 
ON site_settings 
FOR SELECT 
TO anon 
USING (true);

-- 5. Re-enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 6. Make a copy of existing settings just to be safe
CREATE TABLE IF NOT EXISTS site_settings_backup AS SELECT * FROM site_settings;

-- 7. Verify current admin users
SELECT id, email, raw_app_meta_data, raw_user_meta_data FROM auth.users 
WHERE raw_app_meta_data->>'role' = 'admin' OR raw_user_meta_data->>'isAdmin' = 'true'; 