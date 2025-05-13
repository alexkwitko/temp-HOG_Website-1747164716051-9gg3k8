-- Add new columns to why_choose_cards table
ALTER TABLE why_choose_cards
ADD COLUMN IF NOT EXISTS text_alignment VARCHAR(50),
ADD COLUMN IF NOT EXISTS icon_alignment VARCHAR(50);

-- Set default values for existing rows
UPDATE why_choose_cards 
SET 
  text_alignment = 'left',
  icon_alignment = 'left'
WHERE text_alignment IS NULL;

-- Also update RLS policies to allow access to these new columns
BEGIN;
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Enable read access for all users" ON "why_choose_cards";
  DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "why_choose_cards";
  DROP POLICY IF EXISTS "Enable update for authenticated users only" ON "why_choose_cards";
  DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON "why_choose_cards";

  -- Recreate policies to include new columns
  CREATE POLICY "Enable read access for all users"
    ON "why_choose_cards"
    FOR SELECT
    USING (true);

  CREATE POLICY "Enable insert for authenticated users only"
    ON "why_choose_cards"
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

  CREATE POLICY "Enable update for authenticated users only"
    ON "why_choose_cards"
    FOR UPDATE
    USING (auth.role() = 'authenticated');

  CREATE POLICY "Enable delete for authenticated users only"
    ON "why_choose_cards"
    FOR DELETE
    USING (auth.role() = 'authenticated');
COMMIT; 