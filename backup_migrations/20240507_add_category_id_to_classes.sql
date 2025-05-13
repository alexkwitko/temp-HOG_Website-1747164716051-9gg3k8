-- Add category_id to classes table
ALTER TABLE public.classes ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES class_categories(id);

-- Optionally, set category_id to NULL for existing records
UPDATE public.classes SET category_id = NULL WHERE category_id IS NULL; 