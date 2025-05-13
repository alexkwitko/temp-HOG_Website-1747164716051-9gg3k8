-- SQL Script for programs with fixed syntax
-- Generated on 2024-05-09

-- Clear existing data
DELETE FROM programs;

-- Insert data
INSERT INTO programs (
  id, title, description, "order", is_featured, image_url, 
  level, duration, button_text, button_color, content_alignment,
  created_at, updated_at
) 
VALUES 
(
  'bcc00c31-0d2d-4df8-a1d4-dce9a3a99c78',
  'Adult BJJ Fundamentals',
  'A structured curriculum focusing on core BJJ techniques and principles. Perfect for beginners or those looking to refine their basic skills.',
  1,
  TRUE,
  'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=2007&auto=format&fit=crop',
  'Beginner',
  90,
  'Join Class',
  '#B91C1C',
  'center',
  '2024-05-08T12:40:11.583Z',
  '2024-05-08T12:40:11.583Z'
),
(
  'c9f44f9a-7e36-40c0-9cd7-a9f4cd23b675',
  'Advanced BJJ',
  'For experienced practitioners seeking to expand their technical arsenal and develop more sophisticated strategies.',
  2,
  TRUE,
  'https://images.unsplash.com/photo-1577998474517-7a146abb0e60?q=80&w=1974&auto=format&fit=crop',
  'Advanced',
  90,
  'Join Class',
  '#111827',
  'center',
  '2024-05-08T12:40:11.583Z',
  '2024-05-08T12:40:11.583Z'
),
(
  'd7e39c0b-8f12-4e9c-96ab-5d2d1cda6c19',
  'Competition Team Training',
  'Intensive training sessions designed for competitive athletes. Focus on competition strategies, drilling, and live sparring.',
  3,
  TRUE,
  'https://images.unsplash.com/photo-1580261450046-d0a30080dc9b?q=80&w=1976&auto=format&fit=crop',
  'All Levels',
  120,
  'Join Team',
  '#B91C1C',
  'center',
  '2024-05-08T12:40:11.583Z',
  '2024-05-08T12:40:11.583Z'
),
(
  'e5f28d7c-6a23-5f0d-87bc-6e9d2bda7d20',
  'Kids BJJ (Ages 6-12)',
  'A fun and engaging introduction to Brazilian Jiu-Jitsu tailored for children. Focus on coordination, discipline, respect, and basic self-defense.',
  4,
  TRUE,
  'https://images.unsplash.com/photo-1539628399213-d6aa89c93074?q=80&w=2070&auto=format&fit=crop',
  'Kids',
  60,
  'Enroll Kids',
  '#2563EB',
  'center',
  '2024-05-08T12:40:11.583Z',
  '2024-05-08T12:40:11.583Z'
),
(
  'f9a67e5d-3b12-4e8f-85ab-7c3d9fbe8d11',
  'Teens BJJ (Ages 13-17)',
  'Tailored for teenagers, this program focuses on technique, strategy, and developing confidence through martial arts training.',
  5,
  TRUE,
  'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2070&auto=format&fit=crop',
  'Teen',
  75,
  'Enroll Teens',
  '#4F46E5',
  'center',
  '2024-05-08T12:40:11.583Z',
  '2024-05-08T12:40:11.583Z'
),
(
  'a1b22f8e-4c45-7d3f-98cd-2e5f8abc9d33',
  'No-Gi Jiu-Jitsu',
  'Brazilian Jiu-Jitsu without the traditional gi, focusing on techniques that translate well to MMA and self-defense situations.',
  6,
  FALSE,
  'https://images.unsplash.com/photo-1590056468875-599259419857?q=80&w=2070&auto=format&fit=crop',
  'All Levels',
  90,
  'Join Class',
  '#111827',
  'center',
  '2024-05-08T12:40:11.583Z',
  '2024-05-08T12:40:11.583Z'
),
(
  'b3c78d9f-5d67-4e2a-92bc-3a4b5c6d7e8f',
  E'Women\'s Only BJJ',
  'A supportive environment for women to learn and practice Brazilian Jiu-Jitsu with focus on self-defense and technical development.',
  7,
  FALSE,
  'https://images.unsplash.com/photo-1544125945-85f9b4d31a8d?q=80&w=2070&auto=format&fit=crop',
  'All Levels',
  90,
  'Join Class',
  '#D946EF',
  'center',
  '2024-05-08T12:40:11.583Z',
  '2024-05-08T12:40:11.583Z'
),
(
  'c4d89a0b-6e78-4f3a-a4bc-5d6e7f8a9b0c',
  'Open Mat Sessions',
  'Unstructured training time for practitioners to work on specific techniques, spar, and develop their game with guidance available.',
  8,
  FALSE,
  'https://images.unsplash.com/photo-1599058918144-1ffabb6ab9a0?q=80&w=2069&auto=format&fit=crop',
  'All Levels',
  120,
  'Attend Session',
  '#111827',
  'center',
  '2024-05-08T12:40:11.583Z',
  '2024-05-08T12:40:11.583Z'
); 