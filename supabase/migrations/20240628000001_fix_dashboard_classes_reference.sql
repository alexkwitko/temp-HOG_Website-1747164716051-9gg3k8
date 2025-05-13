-- Drop any existing classes table or view
DROP TABLE IF EXISTS classes CASCADE;

-- Create a view named 'classes' that maps to the 'programs' table
-- This is to maintain backward compatibility with any code that still references 'classes'
CREATE OR REPLACE VIEW classes AS
    SELECT 
        id,
        title,
        created_at,
        updated_at
    FROM programs;

-- Add a comment to the view for documentation
COMMENT ON VIEW classes IS 'Legacy view that maps to the programs table for backward compatibility';

-- Grant access to the view
GRANT SELECT ON classes TO authenticated, anon, service_role; 