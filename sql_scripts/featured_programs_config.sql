-- SQL Script for featured_programs_config
-- Generated on 2025-05-09T02:55:06.056Z

-- Clear existing data
DELETE FROM featured_programs_config;

-- Insert data
INSERT INTO featured_programs_config (id, heading, subheading, featured_program_ids, created_at, updated_at) VALUES ('00000000-0000-0000-0000-000000000001', 'Featured Programs', 'From beginner-friendly fundamentals to advanced competition training, find the perfect program for your journey.', ARRAY['3d6bbc38-8121-4355-93a4-0e8ea216a233', '4ab10117-996e-4e24-b4ab-ced6aa3fe4b4', '615f5f63-5394-4121-9acf-3c55af3bf07b'], '2025-05-07T20:56:34.405921+00:00', '2025-05-09T01:01:31.062467+00:00');
