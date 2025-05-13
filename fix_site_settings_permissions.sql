-- Fix permissions for site_settings table in HOG supabase
-- Run this in the SQL editor in Supabase dashboard

-- 1. Update all admin users to have consistent metadata
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

-- 2. Disable RLS temporarily
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies
DROP POLICY IF EXISTS "Admins can read and write site_settings" ON site_settings;
DROP POLICY IF EXISTS "All users can read site_settings" ON site_settings;
DROP POLICY IF EXISTS "Anonymous users can read site_settings" ON site_settings;

-- 4. Create simplified policy for admin users
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

-- 5. Create policy for reading site settings
CREATE POLICY "Everyone can read site_settings" 
ON site_settings 
FOR SELECT 
TO authenticated, anon
USING (true);

-- 6. Re-enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY; 