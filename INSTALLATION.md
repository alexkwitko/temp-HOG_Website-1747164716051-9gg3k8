# House of Grappling Website - Installation Guide

## Prerequisites
- Node.js (v16 or later)
- npm or yarn
- Supabase account

## Setup Instructions

1. Clone the repository
2. Install dependencies:
```
npm install
```
or
```
yarn install
```

3. Set up your Supabase project:
   - Create a new project in [Supabase](https://supabase.com)
   - Get your API keys from the project dashboard
   - Create a `.env.local` file in the root of your project with the following content:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the database setup script:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy the contents of `fix_database_schema.sql` from this project
   - Run the SQL commands to create the necessary tables and sample data

5. Create a storage bucket for images:
   - In your Supabase dashboard, go to Storage
   - Click "Create a new bucket"
   - Name it `site_images`
   - Make sure "Public bucket" is enabled
   - Click "Create bucket"

6. Start the development server:
```
npm run dev
```
or
```
yarn dev
```

7. Open your browser and go to `http://localhost:3000`

## Troubleshooting

### Database Table Missing
If you see errors about missing tables (like "relation 'hero_slides' does not exist"), run the SQL script in `fix_database_schema.sql` from the SQL Editor in your Supabase dashboard.

### Image Upload/Delete Not Working
If you can't upload or delete images, check that:
1. You've created a storage bucket named `site_images` in Supabase
2. The bucket is set to public
3. Your Supabase API key has the necessary permissions

### Hero Slides Not Saving
If changes to the hero slides aren't being saved:
1. Check for console errors in your browser's developer tools
2. Verify that your Supabase API key has write permissions
3. Make sure the `hero_slides` table exists in your database

## Sample Data

The application comes with sample data that you can insert. To populate your database with sample hero slides:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `insert_hero_slides.sql` from this project
4. Run the SQL commands to insert sample hero slides

## Database Setup

Most of the 404 errors you're seeing are caused by missing database tables in your Supabase project. Follow these steps to fix the issues:

1. Log in to your Supabase dashboard at https://app.supabase.com
2. Select your project (yxwwmjubpkyzwmvilmsw)
3. Go to the SQL Editor section
4. Create a new query
5. Copy and paste the entire contents of the `fix_database_schema.sql` file into the editor
6. Run the script by clicking the "Run" button
7. Refresh your website to verify the errors are resolved

## Storage Setup

If you're still having issues with image uploads, you may need to set up the storage bucket:

1. In the Supabase dashboard, go to the Storage section
2. Create a new bucket named `site_images`
3. Set the bucket to Public (or adjust permissions as needed)
4. Try uploading images again

## Starting the Development Server

Run the development server with:

```bash
npm run dev
```

This will start the development server, typically on port 5173 (or another available port if 5173 is already in use). 