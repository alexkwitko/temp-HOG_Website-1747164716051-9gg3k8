# Fixing Style and Methodology Issues

This document outlines the changes made to fix two main issues:
1. Style changes not applying to the preview or live website
2. Blank white screen on the Training Methodology admin page

## Root Causes

1. **Style Not Applying Issue**:
   - The style changes were being saved to the database but weren't being properly applied in the HomePage component.
   - The text colors weren't being consistently applied to all text elements.
   - The component preview wasn't refreshing properly after saving changes.

2. **Training Methodology White Screen**:
   - The methodology table might not exist in your database, causing the component to fail without proper error handling.
   - This happened because of missing or incomplete migrations.

## Changes Made

### 1. Fixed Style Application
- Added detailed logging to the `getContainerStyle` function to diagnose when styles aren't found
- Updated all sections to properly apply text colors consistently
- Improved the save function to force refresh of data
- Added a waiting period after saving to ensure database updates are processed

### 2. Fixed Training Methodology Admin Page
- Improved error handling to show a useful message instead of a white screen
- Added fallback to default items when the table doesn't exist
- Prevented errors from breaking the UI

### 3. Added Database Setup Script
- Created `setup-missing-tables.js` to create any missing tables necessary
- This helps ensure all required tables exist (methodology, home_page_components, cta_config, featured_products_config)

## How to Test and Fix Database Issues

1. **Run the setup script**:
   ```
   npm install dotenv  # Required dependency
   node setup-missing-tables.js
   ```

2. **Verify style changes are working**:
   - Make a style change in the Home Page Config screen
   - Click the Save button
   - Check Preview to confirm the change appears
   - Visit the actual homepage to verify the change appears there too

3. **Verify methodology page is working**:
   - Visit the Training Methodology config page
   - You should now see the configuration page (not a white screen)
   - Make changes and save them
   - Verify they appear on the homepage

## Troubleshooting

If you still encounter issues:

1. **Check browser console** for any JavaScript errors
2. **Verify database connection** is working properly
3. **Inspect Network requests** to ensure data is being sent/received
4. **Clear browser cache** to ensure you're seeing the latest version

If the methodology table is still causing issues, try running:
```
supabase db remote execute --execute="DROP TABLE IF EXISTS public.methodology;"
```
And then run the setup script again. 