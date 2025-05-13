-- Step 1: Rename the classes table to programs and add new columns for styling
ALTER TABLE IF EXISTS public.classes RENAME TO programs;

-- Step 2: Add new columns for styling programs
ALTER TABLE public.programs 
  ADD COLUMN IF NOT EXISTS background_color TEXT DEFAULT '#f9fafb',
  ADD COLUMN IF NOT EXISTS text_color TEXT DEFAULT '#111827',
  ADD COLUMN IF NOT EXISTS button_color TEXT DEFAULT '#111827',
  ADD COLUMN IF NOT EXISTS button_text_color TEXT DEFAULT '#ffffff',
  ADD COLUMN IF NOT EXISTS button_text TEXT DEFAULT 'Learn More',
  ADD COLUMN IF NOT EXISTS icon TEXT,
  ADD COLUMN IF NOT EXISTS level TEXT,
  ADD COLUMN IF NOT EXISTS duration INTEGER,
  ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
  -- Hero-style options
  ADD COLUMN IF NOT EXISTS hero_image_url TEXT,
  ADD COLUMN IF NOT EXISTS hero_title TEXT,
  ADD COLUMN IF NOT EXISTS hero_subtitle TEXT,
  ADD COLUMN IF NOT EXISTS overlay_color TEXT DEFAULT '#000000',
  ADD COLUMN IF NOT EXISTS overlay_opacity FLOAT DEFAULT 0.5,
  ADD COLUMN IF NOT EXISTS hero_text_color TEXT DEFAULT '#ffffff',
  ADD COLUMN IF NOT EXISTS hero_button_text TEXT DEFAULT 'Get Started',
  ADD COLUMN IF NOT EXISTS hero_button_color TEXT DEFAULT '#111827',
  ADD COLUMN IF NOT EXISTS hero_button_text_color TEXT DEFAULT '#ffffff',
  ADD COLUMN IF NOT EXISTS hero_button_url TEXT,
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS has_parallax BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS content_alignment TEXT DEFAULT 'center';

-- Step 3: Rename featured_classes_config table to featured_programs_config
ALTER TABLE IF EXISTS public.featured_classes_config RENAME TO featured_programs_config;

-- Step 4: Rename column in featured_programs_config
ALTER TABLE public.featured_programs_config 
  RENAME COLUMN featured_class_ids TO featured_program_ids;

-- Step 5: Update referenced table name in the trigger
DROP TRIGGER IF EXISTS update_featured_classes_config_updated_at ON public.featured_programs_config;

CREATE TRIGGER update_featured_programs_config_updated_at
  BEFORE UPDATE ON public.featured_programs_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Step 6: Update default values in featured_programs_config
UPDATE public.featured_programs_config 
SET 
  heading = 'Featured Programs',
  subheading = 'From beginner-friendly fundamentals to advanced training, find the perfect program for your journey.'
WHERE id = 1;

-- Step 7: Rename schedule_classes and related columns
ALTER TABLE IF EXISTS public.schedule_classes RENAME TO schedule_programs;

-- Step 8: Rename special schedule classes
ALTER TABLE IF EXISTS public.special_schedule_classes RENAME TO special_schedule_programs;

-- Step 9: Update policies for the renamed tables
DROP POLICY IF EXISTS "Allow authenticated users to manage classes" ON public.programs;
CREATE POLICY "Allow authenticated users to manage programs" 
  ON public.programs 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read access to classes" ON public.programs;
CREATE POLICY "Allow public read access to programs" 
  ON public.programs 
  FOR SELECT 
  USING (true);

-- Step 10: Enable row level security
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

-- Ensure grants are in place
GRANT ALL ON TABLE public.programs TO anon;
GRANT ALL ON TABLE public.programs TO authenticated;
GRANT ALL ON TABLE public.programs TO service_role; 