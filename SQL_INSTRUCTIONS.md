# SQL Instructions for HOG Website

## Running the insert_hero_slides.sql Script

When running the SQL script to insert hero slides in Supabase, you need to use double quotes around the `order` column name because it's a reserved keyword in SQL.

### Fixed insert_hero_slides.sql Script:

```sql
-- Hero Slides SQL Script for House of Grappling

-- Delete existing hero slides if you want to start fresh (optional)
-- DELETE FROM hero_slides;

-- Insert 4 hero slides with BJJ-related content
INSERT INTO hero_slides (
  title, 
  subtitle, 
  description, 
  image_url, 
  button_text, 
  button_url, 
  button_bg, 
  button_text_color, 
  button_hover, 
  "order", 
  is_active
) VALUES 
(
  'Welcome to House of Grappling',
  'Train BJJ with Championship-Level Instructors',
  'Begin your journey in Brazilian Jiu-Jitsu at HOG, where we emphasize technical excellence in a supportive, ego-free environment.',
  'https://images.pexels.com/photos/8990861/pexels-photo-8990861.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Start Training Today',
  '/contact',
  '#FF4C29',
  'text-white',
  '#E73816',
  1,
  true
),
(
  'Transform Your Jiu-Jitsu',
  'From White to Black Belt and Beyond',
  'Our structured curriculum helps you progress consistently through the ranks with detailed instruction and personalized feedback.',
  'https://images.pexels.com/photos/8990047/pexels-photo-8990047.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'View Programs',
  '/programs',
  'bg-black',
  '#ffffff',
  'bg-neutral-800',
  2,
  true
),
(
  'Competition Team',
  'Train to Dominate the Tournament Scene',
  'Join our competition team and elevate your BJJ with advanced drilling, specific training, and comprehensive competition preparation.',
  'https://images.pexels.com/photos/9014133/pexels-photo-9014133.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Competition Details',
  '/competition',
  '#1A2238',
  'text-white',
  '#0F1525',
  3,
  true
),
(
  'Kids Jiu-Jitsu Program',
  'Building Confidence Through Martial Arts',
  'Our kids program focuses on discipline, respect, and self-confidence while teaching effective self-defense in a fun, safe environment.',
  'https://images.pexels.com/photos/8990134/pexels-photo-8990134.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Kids Program',
  '/kids-program',
  '#3E92CC',
  'text-white',
  '#2A7CB8',
  4,
  true
);

-- Also insert sample features if the table exists but is empty
INSERT INTO features (title, description, icon_name, "order", is_active)
SELECT 'Expert Instructors', 'Learn from championship-level black belts with decades of combined experience.', 'Award', 1, true
WHERE NOT EXISTS (SELECT 1 FROM features);

INSERT INTO features (title, description, icon_name, "order", is_active)
SELECT 'Supportive Community', 'Train in a welcoming, ego-free environment focused on mutual growth and respect.', 'Users', 2, true
WHERE NOT EXISTS (SELECT 1 FROM features WHERE "order" = 2);

-- Insert sample methodology items if the table exists but is empty
INSERT INTO methodology (title, description, icon_name, "order", is_active)
SELECT 'Fundamentals First', 'Master the core techniques and principles that form the foundation of effective BJJ.', 'Shield', 1, true
WHERE NOT EXISTS (SELECT 1 FROM methodology);

INSERT INTO methodology (title, description, icon_name, "order", is_active)
SELECT 'Progressive Learning', 'Structured curriculum that builds complexity as you advance in your journey.', 'Target', 2, true
WHERE NOT EXISTS (SELECT 1 FROM methodology WHERE "order" = 2);
```

## Common SQL Errors and Fixes

1. **Reserved keyword error**: When using column names that are SQL reserved keywords (like `order`), always wrap them in double quotes.

2. **Table doesn't exist**: Make sure you've run the `fix_database_schema.sql` script first to create all required tables.

3. **Permission denied**: Ensure your Supabase API key has appropriate permissions for the operations you're trying to perform.

## Steps for Fully Setting Up the Database

1. Run the `fix_database_schema.sql` script first to create all tables
2. Run the `insert_hero_slides.sql` script to add sample hero slides
3. Create the storage bucket named `site_images` in the Storage section
4. Set the bucket to public access 