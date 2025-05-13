-- Create admin user for local development
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  role,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'admin@hogbjj.com',
  '$2a$10$5nHB/Y8LlQlXSCNy8jpqQeRwJtdH1jRJhK.kN8Wy8rvkT4Ik8mLoe', -- bcrypt hash for 'password123'
  NOW(),
  'authenticated',
  '{"provider": "email", "providers": ["email"], "role": "admin"}',
  '{"full_name": "Admin User"}',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Set role to admin
UPDATE auth.users
SET raw_app_meta_data = jsonb_set(raw_app_meta_data, '{role}', '"admin"')
WHERE email = 'admin@hogbjj.com';

-- Insert into profiles table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    INSERT INTO public.profiles (id, email, role, full_name)
    VALUES ('00000000-0000-0000-0000-000000000000', 'admin@hogbjj.com', 'admin', 'Admin User')
    ON CONFLICT (id) DO NOTHING;
  END IF;
END
$$; 