-- SQL Script for site_settings with fixed syntax
-- Generated on 2024-05-09

-- Clear existing data
DELETE FROM site_settings;

-- Insert data
INSERT INTO site_settings (
  key, value, site_name, site_description, contact_email, created_at, updated_at
) 
VALUES 
(
  'site_title',
  'HOG - House of Grappling | Premier Brazilian Jiu-Jitsu Academy',
  'House of Grappling',
  'Elite Brazilian Jiu-Jitsu training at House of Grappling. Classes for adults, teens, and kids. Learn self-defense, improve fitness, and build confidence.',
  'info@houseofgrappling.com',
  '2024-05-08T12:40:11.583Z',
  '2024-05-08T12:40:11.583Z'
),
(
  'location_address',
  '123 Main Street, Suite 101, San Francisco, CA 94105',
  NULL,
  NULL,
  NULL,
  '2024-05-08T12:40:11.583Z',
  '2024-05-08T12:40:11.583Z'
),
(
  'contact_phone',
  '(123) 456-7890',
  NULL,
  NULL,
  NULL,
  '2024-05-08T12:40:11.583Z',
  '2024-05-08T12:40:11.583Z'
),
(
  'about_text',
  'House of Grappling (HOG) is a premier Brazilian Jiu-Jitsu (BJJ) academy committed to providing world-class instruction in a supportive environment. Our mission is to empower individuals through the art of BJJ, fostering physical fitness, mental resilience, and self-defense skills.',
  NULL,
  NULL,
  NULL,
  '2024-05-08T12:40:11.583Z',
  '2024-05-08T12:40:11.583Z'
); 