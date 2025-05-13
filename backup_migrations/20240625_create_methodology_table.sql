-- Drop the table if it exists
DROP TABLE IF EXISTS public.methodology;

-- Create methodology table to manage the training methodology components
CREATE TABLE IF NOT EXISTS public.methodology (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.methodology ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Allow public read access for methodology" ON public.methodology;
DROP POLICY IF EXISTS "Allow authenticated users to update methodology" ON public.methodology;
DROP POLICY IF EXISTS "Allow authenticated users to insert methodology" ON public.methodology;
DROP POLICY IF EXISTS "Allow authenticated users to delete methodology" ON public.methodology;

-- Create policies
-- Allow anyone to read
CREATE POLICY "Allow public read access for methodology" 
ON public.methodology FOR SELECT 
USING (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated users to update methodology" 
ON public.methodology FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert methodology" 
ON public.methodology FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated users to delete methodology" 
ON public.methodology FOR DELETE
USING (auth.role() = 'authenticated');

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_methodology_updated_at ON public.methodology;

CREATE TRIGGER set_methodology_updated_at
BEFORE UPDATE ON public.methodology
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Insert default methods
INSERT INTO public.methodology (id, title, description, icon_name, "order", is_active)
VALUES 
  ('fundamental', 'Fundamentals First', 'Master the core techniques and principles that form the foundation of effective BJJ.', 'Shield', 1, true),
  ('progressive', 'Progressive Learning', 'Structured curriculum that builds complexity as you advance in your journey.', 'Target', 2, true),
  ('conceptual', 'Conceptual Understanding', 'Focus on the underlying principles that connect techniques and positions.', 'Brain', 3, true),
  ('practical', 'Practical Application', 'Regular drilling and sparring to develop real-world effectiveness.', 'Dumbbell', 4, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  icon_name = EXCLUDED.icon_name,
  "order" = EXCLUDED."order",
  is_active = EXCLUDED.is_active; 