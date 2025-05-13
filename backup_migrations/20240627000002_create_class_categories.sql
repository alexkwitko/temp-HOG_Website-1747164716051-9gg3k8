-- Create class_categories table
CREATE TABLE IF NOT EXISTS public.class_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#111827',
  icon TEXT DEFAULT 'Shield',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.class_categories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to class_categories" 
  ON public.class_categories 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow authenticated users to manage class_categories" 
  ON public.class_categories 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Insert default categories
INSERT INTO public.class_categories (name, description, color, icon)
VALUES 
  ('Fundamentals', 'Core techniques and principles', '#2563eb', 'Shield'),
  ('Advanced', 'Advanced techniques and strategies', '#dc2626', 'Target'),
  ('Competition', 'Competition preparation and training', '#9333ea', 'Award'),
  ('Kids', 'Classes designed for children', '#16a34a', 'Users')
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  color = EXCLUDED.color,
  icon = EXCLUDED.icon; 