-- Create featured_classes_config table
CREATE TABLE IF NOT EXISTS featured_classes_config (
    id INTEGER PRIMARY KEY,
    heading TEXT NOT NULL DEFAULT 'Featured Classes',
    subheading TEXT NOT NULL DEFAULT 'From beginner-friendly fundamentals to advanced competition training, find the perfect class for your journey.',
    featured_class_ids TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert default configuration
INSERT INTO featured_classes_config (id, heading, subheading, featured_class_ids)
VALUES (
    1,
    'Featured Classes',
    'From beginner-friendly fundamentals to advanced competition training, find the perfect class for your journey.',
    '{}'
)
ON CONFLICT (id) DO NOTHING;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_featured_classes_config_updated_at
    BEFORE UPDATE ON featured_classes_config
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 