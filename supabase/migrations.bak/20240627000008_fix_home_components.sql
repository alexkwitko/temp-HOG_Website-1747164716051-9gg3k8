-- Drop and recreate home_components table with all needed columns
DROP TABLE IF EXISTS home_components CASCADE;

CREATE TABLE IF NOT EXISTS home_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  component_type TEXT,
  title TEXT,
  description TEXT,
  config JSONB DEFAULT '{}'::jsonb,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  background_color TEXT DEFAULT '#FFFFFF',
  text_color TEXT DEFAULT '#000000',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_home_components_updated_at ON home_components;
CREATE TRIGGER update_home_components_updated_at
BEFORE UPDATE ON home_components
FOR EACH ROW
EXECUTE FUNCTION update_modified_column(); 