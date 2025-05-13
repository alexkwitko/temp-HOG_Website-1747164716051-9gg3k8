-- Clear existing user if any
DELETE FROM auth.users WHERE email = 'admin@hogbjj.com';

-- Create admin user for local development with service role
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  role,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  confirmation_token
)
VALUES (
  'e4c26ba5-d58c-4b0c-9ba3-c1b0aeec6bd2', -- static UUID so we can reference it
  'admin@hogbjj.com',
  crypt('admin123', gen_salt('bf')), -- Use stronger password (admin123)
  NOW(),
  'authenticated',
  '{"provider": "email", "providers": ["email"], "role": "admin"}',
  '{"full_name": "Admin User"}',
  NOW(),
  ''
) ON CONFLICT (id) DO NOTHING;

-- Make sure the role is admin
UPDATE auth.users
SET raw_app_meta_data = jsonb_set(raw_app_meta_data, '{role}', '"admin"')
WHERE email = 'admin@hogbjj.com';

-- Create default profile too
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    INSERT INTO public.profiles (id, email, role, full_name)
    VALUES ('e4c26ba5-d58c-4b0c-9ba3-c1b0aeec6bd2', 'admin@hogbjj.com', 'admin', 'Admin User')
    ON CONFLICT (id) DO NOTHING;
  END IF;
END
$$;

-- Create a customer role
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  role,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  confirmation_token
)
VALUES (
  'f7c38ba5-d92c-4b7c-8ba3-c1b0aeec7cd3', -- static UUID for customer
  'customer@hogbjj.com',
  crypt('customer123', gen_salt('bf')), -- Use simple password (customer123)
  NOW(),
  'authenticated',
  '{"provider": "email", "providers": ["email"], "role": "customer"}',
  '{"full_name": "Test Customer"}',
  NOW(),
  ''
) ON CONFLICT (id) DO NOTHING;

-- Make sure the role is customer
UPDATE auth.users
SET raw_app_meta_data = jsonb_set(raw_app_meta_data, '{role}', '"customer"')
WHERE email = 'customer@hogbjj.com';

-- Create default profile for customer too
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    INSERT INTO public.profiles (id, email, role, full_name)
    VALUES ('f7c38ba5-d92c-4b7c-8ba3-c1b0aeec7cd3', 'customer@hogbjj.com', 'customer', 'Test Customer')
    ON CONFLICT (id) DO NOTHING;
  END IF;
END
$$; 