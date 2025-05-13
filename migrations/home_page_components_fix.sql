-- Fix for home_page_components table - Adding missing columns
-- This migration adds the missing columns that might be missing from older installations

-- Add missing columns if they don't exist
ALTER TABLE IF EXISTS public.home_page_components 
  ADD COLUMN IF NOT EXISTS margin TEXT DEFAULT '0px',
  ADD COLUMN IF NOT EXISTS width TEXT DEFAULT '100%',
  ADD COLUMN IF NOT EXISTS height TEXT DEFAULT 'auto',
  ADD COLUMN IF NOT EXISTS vertical_align TEXT DEFAULT 'center',
  ADD COLUMN IF NOT EXISTS horizontal_align TEXT DEFAULT 'center';

-- Make sure the updated_at trigger exists
CREATE OR REPLACE FUNCTION public.set_home_page_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Only create the trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'set_home_page_components_updated_at'
  ) THEN
    CREATE TRIGGER set_home_page_components_updated_at
    BEFORE UPDATE ON public.home_page_components
    FOR EACH ROW
    EXECUTE FUNCTION public.set_home_page_updated_at();
  END IF;
END
$$; 