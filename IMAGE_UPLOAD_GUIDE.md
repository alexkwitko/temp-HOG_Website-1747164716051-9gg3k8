# Image Upload Guide

## Using the ImageUploader Component

The ImageUploader component provides a standardized way to handle image uploads across your application. It handles:

- Upload to Supabase storage
- Image deletion
- Preview and replacement
- Error handling
- Fallback for broken images

### Basic Usage

```tsx
import ImageUploader from '../components/ImageUploader';

// In your component:
<ImageUploader
  currentImageUrl={yourImageState}
  onImageUploaded={(url) => {
    // Update your state with the new image URL
    setYourImageState(url);
  }}
  onImageDeleted={() => {
    // Handle image deletion
    setYourImageState('');
  }}
  folder="your-folder-name"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentImageUrl` | `string \| null \| undefined` | `undefined` | The current image URL (if any) |
| `onImageUploaded` | `(url: string) => void` | *Required* | Callback when image is uploaded |
| `onImageDeleted` | `() => void` | `undefined` | Callback when image is deleted |
| `folder` | `string` | `'uploads'` | Folder name in storage bucket |
| `maxSizeMB` | `number` | `5` | Maximum file size in MB |
| `acceptedFileTypes` | `string` | `'image/*'` | Accepted MIME types |
| `placeholderText` | `string` | `'Upload an image'` | Text shown in upload area |
| `className` | `string` | `''` | Additional CSS classes |
| `buttonText` | `string` | `'Upload'` | Text for upload button |
| `height` | `string` | `'h-32'` | Height of the component (TailwindCSS class) |

## Setting Up Supabase Storage

1. **Create a Storage Bucket:**
   - Go to your Supabase dashboard
   - Navigate to "Storage" in the sidebar
   - Click "Create new bucket"
   - Name it "site-images"
   - Set it to public or private based on your needs

2. **Configure Storage Policies:**
   - Run the `storage_policies.sql` script in your Supabase SQL editor
   - This script:
     - Restricts uploads to image file types only (.jpg, .jpeg, .png, .gif, .webp, .svg)
     - Sets up appropriate access control for public reading
     - Handles authentication for uploads and deletions

```sql
-- From storage_policies.sql
-- Policy for authenticated user upload - only allow image file types
CREATE POLICY "Allow image upload to site-images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'site-images' AND 
    (storage.extension(name) = 'jpg' OR 
     storage.extension(name) = 'jpeg' OR 
     storage.extension(name) = 'png' OR 
     storage.extension(name) = 'gif' OR 
     storage.extension(name) = 'webp' OR
     storage.extension(name) = 'svg')
  );
```

## Environment Variables

Ensure your `.env` file has these variables:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Troubleshooting

### Image Upload Errors

If you encounter errors like:
```
POST http://localhost:5174/admin/programs/edit/undefined/storage/v1/object/site-images/... 404 (Not Found)
```
or
```
new row violates row-level security policy
```

These indicate two common issues:

1. **Incorrect URL formation**: The upload URL is being built relative to your current page path instead of using the absolute Supabase URL
2. **Row Level Security (RLS) policies**: Your Supabase storage bucket has RLS policies that are blocking uploads

### Fixing URL Formation Issues

The fixes in the latest version of the ImageUploader component ensure proper URL formation by:

1. Always using absolute URLs with the proper protocol
2. Providing a fallback if environment variables aren't set correctly
3. Properly logging the URLs for debugging

### Setting Up RLS Policies

To configure proper RLS policies for your storage bucket, run the `storage_policies.sql` script in your Supabase SQL editor:

1. Go to your Supabase project dashboard
2. Navigate to "SQL Editor"
3. Copy and paste the contents of `storage_policies.sql` 
4. Run the script

This will:
- Create the `site-images` bucket if it doesn't exist
- Set up the necessary RLS policies for public reading and authenticated uploads/deletes
- Optionally restrict uploads to image file types only

### Authentication Issues

If you're still seeing RLS policy violations, ensure that:

1. The user is properly authenticated before uploading
2. Your JWT token is not expired
3. The token is being correctly included in the Authorization header

You can manually check your JWT by using the Supabase UI:
- Go to Authentication → Settings → JWT Templates
- Review your JWT template and expiration settings

### Images Not Uploading

1. Check browser console for errors
2. Verify storage bucket exists and policies are correctly set
3. Ensure proper authentication

### Image URL Patterns

The component handles URLs from:
- Supabase storage: `/storage/v1/object/public/site-images/...`
- External URLs: `https://example.com/images/...`

### Errors with External Images

For external image URLs, the component:
- Validates and normalizes URLs
- Provides fallback if images don't load
- Skips storage deletion for external URLs 