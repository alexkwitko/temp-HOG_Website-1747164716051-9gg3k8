-- Add new columns to methodology table
ALTER TABLE methodology
ADD COLUMN IF NOT EXISTS text_color VARCHAR(255),
ADD COLUMN IF NOT EXISTS icon_color VARCHAR(255),
ADD COLUMN IF NOT EXISTS text_alignment VARCHAR(50),
ADD COLUMN IF NOT EXISTS icon_alignment VARCHAR(50),
ADD COLUMN IF NOT EXISTS button_text VARCHAR(255),
ADD COLUMN IF NOT EXISTS button_url VARCHAR(255);

-- Set default values for existing rows
UPDATE methodology 
SET 
  text_color = '#333333',
  icon_color = '#333333',
  text_alignment = 'left',
  icon_alignment = 'left'
WHERE text_color IS NULL;

-- Also update RLS policies to allow access to these new columns
BEGIN;
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Enable read access for all users" ON "methodology";
  DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "methodology";
  DROP POLICY IF EXISTS "Enable update for authenticated users only" ON "methodology";
  DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON "methodology";

  -- Recreate policies to include new columns
  CREATE POLICY "Enable read access for all users"
    ON "methodology"
    FOR SELECT
    USING (true);

  CREATE POLICY "Enable insert for authenticated users only"
    ON "methodology"
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

  CREATE POLICY "Enable update for authenticated users only"
    ON "methodology"
    FOR UPDATE
    USING (auth.role() = 'authenticated');

  CREATE POLICY "Enable delete for authenticated users only"
    ON "methodology"
    FOR DELETE
    USING (auth.role() = 'authenticated');
COMMIT; 