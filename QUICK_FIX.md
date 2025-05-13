# HOG Setup Instructions

1. Create a storage bucket named 'site_images' in Supabase dashboard (Storage section)
2. Run the fix_database_schema.sql script in Supabase SQL Editor
3. Run the insert_hero_slides.sql script to add sample slides
4. Check browser console for detailed error messages if issues persist

## Storage Bucket Settings
- Name: site_images
- Public access: Enabled
- File size limit: Optional (10MB recommended)

## Database Setup
If you're seeing errors about missing tables:
1. Go to Supabase SQL Editor
2. Run the fix_database_schema.sql script to create all required tables

## Common Issues
- If image upload fails but the bucket exists, check browser console for detailed error information
- If saving fails, check for any validation errors in the form fields
