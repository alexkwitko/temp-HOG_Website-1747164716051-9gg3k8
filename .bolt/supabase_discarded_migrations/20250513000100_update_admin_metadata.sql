-- Update admin user metadata to ensure consistent format between 
-- raw_app_meta_data and raw_user_meta_data

-- Update all admin users to have the correct metadata structure
UPDATE auth.users
SET 
  raw_app_meta_data = jsonb_set(
    COALESCE(raw_app_meta_data, '{}'::jsonb),
    '{role}',
    '"admin"'
  ),
  raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    '"admin"'
  )
WHERE 
  email = 'admin@hogbjj.com' 
  OR raw_app_meta_data->>'role' = 'admin' 
  OR raw_user_meta_data->>'isAdmin' = 'true';

-- Set isAdmin flag as well for backward compatibility
UPDATE auth.users
SET 
  raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{isAdmin}',
    'true'
  )
WHERE 
  raw_app_meta_data->>'role' = 'admin';

-- Ensure all admin users have a profile entry
INSERT INTO public.profiles (id, email, role, full_name)
SELECT 
  id, 
  email, 
  'admin', 
  COALESCE(raw_user_meta_data->>'full_name', 'Admin User')
FROM auth.users
WHERE raw_app_meta_data->>'role' = 'admin'
ON CONFLICT (id) DO UPDATE
SET role = 'admin';

-- Output log message for debugging
DO $$
BEGIN
  RAISE NOTICE 'Updated admin user metadata for authorization.';
END
$$; 