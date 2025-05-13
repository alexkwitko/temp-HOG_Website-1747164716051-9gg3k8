-- Insert BJJ-related hero slides
INSERT INTO hero_slides (
  title, 
  subtitle, 
  description, 
  text_color,
  image_url,
  image_opacity,
  text_background,
  text_position,
  button_text,
  button_url,
  button_active,
  button_bg,
  button_text_color,
  secondary_button_text,
  secondary_button_url,
  secondary_button_active,
  "order",
  is_active
)
VALUES 
  -- Slide 1: Main promotional slide
  (
    'Elevate Your Jiu-Jitsu Journey', 
    'Train with Champions at House of Grappling', 
    'World-class instruction in a supportive environment focused on technical excellence and personal growth.', 
    '#FFFFFF',
    'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?q=80&w=2274&auto=format&fit=crop',
    90,
    '{"enabled": true, "color": "rgba(0,0,0,0.5)", "opacity": 50, "size": "md", "padding": "24px"}',
    '{"horizontal": "center", "vertical": "center"}',
    'Start Training Today',
    '/contact',
    true,
    '#B91C1C',
    '#FFFFFF',
    'View Programs',
    '/programs',
    true,
    1,
    true
  ),
  
  -- Slide 2: Focus on community
  (
    'Join Our Jiu-Jitsu Community', 
    'From Beginners to Black Belts', 
    'Our academy welcomes practitioners of all levels with specialized programs designed for your unique goals.', 
    '#FFFFFF',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop',
    85,
    '{"enabled": true, "color": "rgba(0,0,0,0.6)", "opacity": 60, "size": "md", "padding": "24px"}',
    '{"horizontal": "left", "vertical": "center"}',
    'Explore Membership',
    '/membership',
    true,
    '#111827',
    '#FFFFFF',
    null,
    null,
    false,
    2,
    true
  ),
  
  -- Slide 3: Competition team
  (
    'Competition Team', 
    'Train to Dominate the Tournament Scene', 
    'Our dedicated competition program has produced champions at local, national, and international levels.', 
    '#FFFFFF',
    'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=1974&auto=format&fit=crop',
    80,
    '{"enabled": true, "color": "rgba(17,24,39,0.75)", "opacity": 75, "size": "md", "padding": "24px"}',
    '{"horizontal": "right", "vertical": "center"}',
    'Join the Team',
    '/competition-team',
    true,
    '#B91C1C',
    '#FFFFFF',
    'Competition Schedule',
    '/events',
    true,
    3,
    true
  ),
  
  -- Slide 4: Kids program
  (
    'Kids Jiu-Jitsu Program', 
    'Building Confidence Through Martial Arts', 
    'Our youth program teaches discipline, respect, and self-defense in a fun, safe environment.', 
    '#FFFFFF',
    'https://images.unsplash.com/photo-1586035758264-c5e7c388b4c4?q=80&w=2060&auto=format&fit=crop',
    90,
    '{"enabled": true, "color": "rgba(37,99,235,0.7)", "opacity": 70, "size": "md", "padding": "24px"}',
    '{"horizontal": "center", "vertical": "center"}',
    'Learn More',
    '/kids-program',
    true,
    '#2563EB',
    '#FFFFFF',
    'Free Trial Class',
    '/contact',
    true,
    4,
    true
  ); 