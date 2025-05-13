-- Fix site_settings permissions to correctly identify admin users
-- This addresses the "permission denied for table users" error when saving settings

-- Update RLS policies to allow admin access properly
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate with correct permissions
DROP POLICY IF EXISTS "Admins can read and write site_settings" ON site_settings;
DROP POLICY IF EXISTS "All users can read site_settings" ON site_settings;
DROP POLICY IF EXISTS "Anonymous users can read site_settings" ON site_settings;

-- Admins can read and write all settings
-- Change from checking raw_user_meta_data->>'isAdmin' to using raw_app_meta_data->>'role'
CREATE POLICY "Admins can read and write site_settings" 
ON site_settings 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid() AND raw_app_meta_data->>'role' = 'admin'
  )
) 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid() AND raw_app_meta_data->>'role' = 'admin'
  )
);

-- All users can read site_settings
CREATE POLICY "All users can read site_settings" 
ON site_settings 
FOR SELECT 
TO authenticated 
USING (true);

-- Anonymous users can read site_settings
CREATE POLICY "Anonymous users can read site_settings" 
ON site_settings 
FOR SELECT 
TO anon 
USING (true); 